import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';
import { useMotion } from '../../context/MotionContext';
import {
  incrementCanvasFrame,
  isLoaderCleared,
  onHeroEntranceRipple,
  onLoaderCleared,
  recordRuntimeError,
  reportWebGLInfo,
  setMotionInitStatus,
  upsertCanvasTelemetry,
} from '../../lib/motionDiagnostics';

const VERTEX_SHADER = `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  attribute vec3 offset;
  attribute float pindex;
  attribute float angle;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uRandom;
  uniform float uDepth;
  uniform float uSize;
  uniform float uIntro;
  uniform float uAmbient;
  uniform float uHandoffX;
  uniform float uHandoffStrength;
  uniform float uAmbientSweepX;
  uniform vec2 uTextureSize;
  uniform sampler2D uTexture;
  uniform sampler2D uTouch;

  varying vec2 vPUv;
  varying vec2 vUv;
  varying float vWave;
  varying float vCrest;
  varying float vRedEdge;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float random(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    vUv = uv;
    vec2 puv = offset.xy / uTextureSize;
    vPUv = puv;

    vec4 colA = texture2D(uTexture, puv);
    float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

    vec3 displaced = offset;
    float wavePhase = sin(puv.x * 7.2 - uTime * 1.45) * cos(puv.y * 4.8 + uTime * 0.85) * uAmbient;
    float drift = snoise(vec3(puv * 4.5, uTime * 0.34)) * uAmbient;
    vWave = clamp(wavePhase * 0.5 + 0.5, 0.0, 1.0);

    // Traveling left-to-right splash handoff ripple + restrained ambient wave across lettering
    float handoffDist = abs(puv.x - uHandoffX);
    float handoffCrest = exp(-handoffDist * handoffDist * 42.0) * uHandoffStrength;
    float ambientDist = abs(puv.x - uAmbientSweepX);
    float ambientCrest = exp(-ambientDist * ambientDist * 32.0) * 0.62 * uAmbient;
    float crest = clamp(handoffCrest + ambientCrest, 0.0, 1.15);
    vCrest = crest;

    // Brief Berry red leading-edge accent on the crest
    float redLeadHandoff = exp(-pow(puv.x - (uHandoffX + 0.035), 2.0) * 170.0) * uHandoffStrength;
    float redLeadAmbient = exp(-pow(puv.x - (uAmbientSweepX + 0.03), 2.0) * 150.0) * 0.42 * uAmbient;
    vRedEdge = clamp(redLeadHandoff + redLeadAmbient, 0.0, 1.0);

    displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
    displaced.xy += vec2(drift * 1.7 + crest * 4.2, wavePhase * 1.45 + sin(puv.y * 6.0 + uTime) * crest * 3.4);
    float rndz = (random(pindex) + snoise(vec3(pindex * 0.1, uTime * 0.24 * max(uAmbient, 0.15), 0.0)));
    displaced.z += rndz * (random(pindex) * 2.4 * uDepth) + wavePhase * 4.8 + crest * 18.0;
    displaced.xy -= uTextureSize * 0.5;

    // Entrance magnetic convergence into typography
    float inv = 1.0 - uIntro;
    float inv2 = inv * inv;
    displaced.xy += vec2(cos(angle), sin(angle)) * inv2 * (85.0 + 135.0 * random(pindex + 3.0));
    displaced.z += inv2 * 64.0 * (random(pindex + 7.0) - 0.5);

    // Interactive cursor / tap / swipe burst displacement
    float t = texture2D(uTouch, puv).r;
    displaced.z += t * 46.0 * rndz;
    displaced.x += cos(angle) * t * 38.0 * (0.4 + rndz);
    displaced.y += sin(angle) * t * 38.0 * (0.4 + rndz);

    float psize = (snoise(vec3(uTime * 0.55 * max(uAmbient, 0.1), puv * 3.0)) + 2.15 + wavePhase * 0.28 + crest * 0.55);
    psize *= max(grey, 0.34);
    psize *= uSize * mix(0.65, 1.0, uIntro) * (1.0 + t * 0.42);

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    mvPosition.xyz += position * psize;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec3 uColor;
  uniform vec3 uAccentColor;
  uniform vec3 uRedColor;
  varying vec2 vPUv;
  varying vec2 vUv;
  varying float vWave;
  varying float vCrest;
  varying float vRedEdge;

  void main() {
    vec4 colA = texture2D(uTexture, vPUv);
    float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    float alpha = smoothstep(0.5, 0.24, dist) * smoothstep(0.08, 0.65, grey);

    float shimmer = mix(0.24, 0.94, clamp(grey * 0.78 + vWave * 0.24, 0.0, 1.0));
    vec3 tint = mix(uAccentColor, uColor, smoothstep(0.25, 0.9, shimmer));
    tint = mix(tint, uAccentColor, clamp(vCrest * 0.85, 0.0, 0.92));
    tint = mix(tint, uRedColor, clamp(vRedEdge * 0.78, 0.0, 0.82));
    if (alpha < 0.06) discard;
    gl_FragColor = vec4(tint, alpha);
  }
`;

class TouchTexture {
  size = 64;
  width = 64;
  height = 64;
  maxAge = 88;
  radius = 0.26;
  trail: Array<{ x: number; y: number; age: number; force: number }> = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
  }

  addTouch(point: { x: number; y: number }, minForce = 0) {
    let force = minForce;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      const dd = dx * dx + dy * dy;
      force = Math.max(minForce, Math.min(dd * 10000, 1));
    } else if (force === 0) {
      force = 0.65;
    }
    this.trail.push({ x: point.x, y: point.y, age: 0, force });
    if (this.trail.length > 48) {
      this.trail.splice(0, this.trail.length - 48);
    }
  }

  update() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawTouch(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  private drawTouch(point: { x: number; y: number; age: number; force: number }) {
    const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
    let intensity = 1;
    if (point.age < this.maxAge * 0.28) {
      intensity = Math.sin(((point.age / (this.maxAge * 0.28)) * Math.PI) / 2);
    } else {
      const t = 1 - (point.age - this.maxAge * 0.28) / (this.maxAge * 0.72);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const r = this.size * this.radius * Math.max(0.35, intensity);
    if (r <= 0.1) return;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, r * 0.16, pos.x, pos.y, r);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.86)');
    grd.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dispose() {
    this.texture.dispose();
  }
}

export interface InteractiveParticlesProps {
  text?: string;
  lines?: string[];
  subtitle?: string;
  className?: string;
  particleColor?: string;
  accentColor?: string;
  particleSize?: number;
}

type ViewportTier = 'mobile' | 'tablet' | 'desktop';

function getViewportTier(viewportWidth: number): ViewportTier {
  return viewportWidth < 640 ? 'mobile' : viewportWidth < 1024 ? 'tablet' : 'desktop';
}

function createTypographySampleCanvas(
  text: string,
  lines: string[] | undefined,
  subtitle: string | undefined,
  viewportWidth: number
): { canvas: HTMLCanvasElement | null; width: number; height: number; tier: ViewportTier } {
  const tier = getViewportTier(viewportWidth);
  const sampleWidth = tier === 'mobile' ? 420 : tier === 'tablet' ? 620 : 720;
  const sampleHeight = tier === 'mobile' ? 240 : tier === 'tablet' ? 255 : 270;

  const canvas = document.createElement('canvas');
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { canvas: null, width: sampleWidth, height: sampleHeight, tier };

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const resolvedLines =
    lines && lines.length > 0
      ? lines.map((l) => l.toUpperCase())
      : [text.toUpperCase()];
  const hasSub = Boolean(subtitle);
  const maxTextWidth = sampleWidth - 32;
  const subParts =
    tier === 'mobile' && subtitle && subtitle.includes(' · ') && subtitle.length > 32
      ? subtitle.split(' · ').map((s) => s.trim().toUpperCase())
      : subtitle
      ? [subtitle.toUpperCase()]
      : [];
  const subFontSize = tier === 'mobile' ? 22 : tier === 'tablet' ? 24 : 26;

  if (resolvedLines.length >= 2) {
    const line1 = resolvedLines[0];
    const line2 = resolvedLines[1];
    const line1Size =
      tier === 'mobile'
        ? line1.length > 14
          ? 60
          : 76
        : tier === 'tablet'
        ? line1.length > 14
          ? 78
          : 100
        : line1.length > 14
        ? 86
        : 114;
    const line2Size =
      tier === 'mobile'
        ? line2.length > 14
          ? 44
          : 54
        : tier === 'tablet'
        ? line2.length > 14
          ? 54
          : 68
        : line2.length > 14
        ? 58
        : 74;

    const twoSubLines = subParts.length >= 2;
    ctx.font = `800 ${line1Size}px "Barlow Condensed", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(
      line1,
      canvas.width / 2,
      twoSubLines ? canvas.height * 0.24 : hasSub ? canvas.height * 0.28 : canvas.height * 0.37,
      maxTextWidth
    );

    ctx.font = `700 ${line2Size}px "Barlow Condensed", sans-serif`;
    ctx.fillStyle = '#DCE8F5';
    ctx.fillText(
      line2,
      canvas.width / 2,
      twoSubLines ? canvas.height * 0.53 : hasSub ? canvas.height * 0.59 : canvas.height * 0.69,
      maxTextWidth
    );

    if (subParts.length >= 2) {
      ctx.font = `700 ${subFontSize}px "Barlow Condensed", sans-serif`;
      ctx.fillStyle = '#C6D9EC';
      ctx.fillText(subParts[0], canvas.width / 2, canvas.height * 0.78, maxTextWidth);
      ctx.fillText(subParts[1], canvas.width / 2, canvas.height * 0.9, maxTextWidth);
    } else if (subParts.length === 1) {
      ctx.font = `700 ${subFontSize}px "Barlow Condensed", sans-serif`;
      ctx.fillStyle = '#C6D9EC';
      ctx.fillText(subParts[0], canvas.width / 2, canvas.height * 0.86, maxTextWidth);
    }
  } else {
    const single = resolvedLines[0];
    const titleFontSize =
      tier === 'mobile'
        ? single.length > 14
          ? 58
          : 74
        : tier === 'tablet'
        ? single.length > 14
          ? 74
          : 98
        : single.length > 18
        ? 72
        : single.length > 13
        ? 88
        : 118;
    ctx.font = `800 ${titleFontSize}px "Barlow Condensed", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(single, canvas.width / 2, hasSub ? canvas.height * 0.4 : canvas.height * 0.5, maxTextWidth);

    if (subParts.length >= 2) {
      ctx.font = `700 ${subFontSize}px "Barlow Condensed", sans-serif`;
      ctx.fillStyle = '#C6D9EC';
      ctx.fillText(subParts[0], canvas.width / 2, canvas.height * 0.74, maxTextWidth);
      ctx.fillText(subParts[1], canvas.width / 2, canvas.height * 0.88, maxTextWidth);
    } else if (subParts.length === 1) {
      ctx.font = `700 ${subFontSize}px "Barlow Condensed", sans-serif`;
      ctx.fillStyle = '#C6D9EC';
      ctx.fillText(subParts[0], canvas.width / 2, canvas.height * 0.78, maxTextWidth);
    }
  }

  return {
    canvas,
    width: sampleWidth,
    height: sampleHeight,
    tier,
  };
}

interface Particle2D {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  grey: number;
  isAccent: boolean;
}

/**
 * Animated 2D Canvas particle typography fallback used if WebGL is unavailable,
 * loses context permanently, or throws on a mobile GPU. Preserves kinetic arrival,
 * ambient shimmer, and touch/pointer tap & swipe dispersion without a static screen.
 */
function InteractiveParticles2DFallback({
  text,
  lines,
  subtitle,
  displayLines,
  className,
  primaryColor,
  accentColor,
}: {
  text: string;
  lines?: string[];
  subtitle?: string;
  displayLines: string[];
  className?: string;
  primaryColor: string;
  accentColor: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, ambientActive } = useMotion();
  const colorsRef = useRef({ primary: primaryColor, accent: accentColor });
  colorsRef.current = { primary: primaryColor, accent: accentColor };
  const [domFallback, setDomFallback] = useState(false);

  const linesKey = lines ? lines.join('|') : '';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) {
      setDomFallback(true);
      setMotionInitStatus('heroParticles', 'fallback-dom');
      return;
    }
    container.appendChild(canvas);

    let particles: Particle2D[] = [];
    let cssWidth = Math.max(1, container.clientWidth);
    let cssHeight = Math.max(1, container.clientHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, cssWidth < 640 ? 1.5 : 2);
    let disposed = false;
    let rafId = 0;
    let isVisible = true;
    let introProgress = reducedMotion ? 1 : isLoaderCleared() ? 0.25 : 0.08;
    let introStart = isLoaderCleared() ? performance.now() : 0;
    let handoffStart = 0;
    let lastInteraction = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerForce = 0;

    const build2DParticles = () => {
      if (disposed) return;
      cssWidth = container.clientWidth;
      cssHeight = container.clientHeight;
      if (cssWidth < 2 || cssHeight < 2) return;

      dpr = Math.min(window.devicePixelRatio || 1, cssWidth < 640 ? 1.5 : 2);
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);

      const sample = createTypographySampleCanvas(text, lines, subtitle, cssWidth);
      if (!sample.canvas) return;
      const sctx = sample.canvas.getContext('2d');
      if (!sctx) return;

      const data = sctx.getImageData(0, 0, sample.width, sample.height).data;
      const step = cssWidth < 640 ? 4 : 5;
      const scale = Math.min((cssWidth * 0.92) / sample.width, (cssHeight * 0.86) / sample.height);
      const offsetX = (cssWidth - sample.width * scale) / 2;
      const offsetY = (cssHeight - sample.height * scale) / 2;

      const next: Particle2D[] = [];
      for (let y = 0; y < sample.height; y += step) {
        for (let x = 0; x < sample.width; x += step) {
          const idx = (y * sample.width + x) * 4;
          const lum = data[idx];
          if (lum > 34) {
            const hx = offsetX + x * scale;
            const hy = offsetY + y * scale;
            const angle = ((x * 37 + y * 17) % 360) * (Math.PI / 180);
            const spread = reducedMotion ? 0 : 75;
            next.push({
              homeX: hx,
              homeY: hy,
              x: hx + Math.cos(angle) * spread * (1 - introProgress),
              y: hy + Math.sin(angle) * spread * (1 - introProgress),
              vx: 0,
              vy: 0,
              phase: (x * 0.08 + y * 0.11) % (Math.PI * 2),
              grey: lum / 255,
              isAccent: (x + y) % 5 === 0,
            });
          }
        }
      }
      particles = next;
      upsertCanvasTelemetry('hero-particles', {
        backend: 'canvas-2d',
        contextLost: false,
        width: cssWidth,
        height: cssHeight,
      });
      setMotionInitStatus('heroParticles', 'canvas-2d');
    };

    const drawOnce = (now: number) => {
      if (disposed || canvas.width < 2 || canvas.height < 2) return;
      ctx2d.save();
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx2d.clearRect(0, 0, cssWidth, cssHeight);

      if (introProgress < 1) {
        if (isLoaderCleared()) {
          if (introStart === 0) introStart = now;
          const p = Math.min(1, (now - introStart) / 900);
          introProgress = 0.08 + 0.92 * (1 - Math.pow(1 - p, 3));
        }
      }

      const ambientMul = reducedMotion || !ambientActive ? 0 : 1;
      const t = now * 0.001;

      // Splash-to-hero handoff wave (left-to-right over 900ms)
      let handoffX = -1;
      let handoffAmp = 0;
      if (!reducedMotion && handoffStart > 0) {
        const hp = (now - handoffStart) / 900;
        if (hp >= 0 && hp <= 1) {
          handoffX = cssWidth * (-0.08 + 1.16 * hp);
          handoffAmp = Math.sin(hp * Math.PI);
        }
      }

      // Restrained idle left-to-right wave every ~5.2s so untouched mobile views visibly move
      const cyclePos = ((t * 0.22) % 1.35) - 0.15;
      const ambientSweepX = ambientMul ? cssWidth * cyclePos : -9999;

      const activeTouch = now - lastInteraction < 1800 ? pointerForce : 0;
      pointerForce *= 0.94;

      const dotR = cssWidth < 640 ? 1.55 : 1.75;
      const radiusSq = cssWidth < 640 ? 4800 : 7200;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const shimmerX = ambientMul ? Math.sin(t * 1.3 + p.phase) * 1.35 : 0;
        const shimmerY = ambientMul ? Math.cos(t * 1.1 + p.phase) * 1.1 : 0;

        let waveGlow = 0;
        let redGlow = false;
        let crestOffsetY = 0;
        if (handoffAmp > 0.02) {
          const d = Math.abs(p.homeX - handoffX);
          if (d < cssWidth * 0.12) {
            waveGlow = Math.max(waveGlow, (1 - d / (cssWidth * 0.12)) * handoffAmp);
            crestOffsetY -= waveGlow * 4.5;
            if (p.homeX - handoffX > 4 && p.homeX - handoffX < cssWidth * 0.045) redGlow = true;
          }
        }
        if (ambientMul && cyclePos > -0.1 && cyclePos < 1.1) {
          const d = Math.abs(p.homeX - ambientSweepX);
          if (d < cssWidth * 0.11) {
            const g = (1 - d / (cssWidth * 0.11)) * 0.72;
            waveGlow = Math.max(waveGlow, g);
            crestOffsetY -= g * 3.2;
            if (p.homeX - ambientSweepX > 4 && p.homeX - ambientSweepX < cssWidth * 0.035) redGlow = true;
          }
        }

        const targetX = p.homeX + shimmerX;
        const targetY = p.homeY + shimmerY + crestOffsetY;

        if (!reducedMotion && activeTouch > 0.02) {
          const dx = p.x - pointerX;
          const dy = p.y - pointerY;
          const d2 = dx * dx + dy * dy;
          if (d2 > 1 && d2 < radiusSq) {
            const d = Math.sqrt(d2);
            const push = (1 - d / Math.sqrt(radiusSq)) * 3.8 * activeTouch;
            p.vx += (dx / d) * push;
            p.vy += (dy / d) * push;
          }
        }

        p.vx += (targetX - p.x) * (reducedMotion ? 1 : 0.16);
        p.vy += (targetY - p.y) * (reducedMotion ? 1 : 0.16);
        p.vx *= 0.78;
        p.vy *= 0.78;
        p.x += p.vx;
        p.y += p.vy;

        ctx2d.globalAlpha = Math.max(0.35, Math.min(0.96, p.grey + waveGlow * 0.2));
        ctx2d.fillStyle = redGlow
          ? '#C9233B'
          : waveGlow > 0.25 || p.isAccent
          ? colorsRef.current.accent
          : colorsRef.current.primary;
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, dotR + waveGlow * 0.45, 0, Math.PI * 2);
        ctx2d.fill();
      }

      ctx2d.restore();
      incrementCanvasFrame('hero-particles');
    };

    const unsubLoader = onLoaderCleared(() => {
      if (introStart === 0) introStart = performance.now();
    });
    const unsubRipple = onHeroEntranceRipple(() => {
      handoffStart = performance.now();
    });

    const onImpulse = (clientX: number, clientY: number, force: number) => {
      if (reducedMotion) return;
      const rect = container.getBoundingClientRect();
      pointerX = clientX - rect.left;
      pointerY = clientY - rect.top;
      pointerForce = Math.max(pointerForce, force);
      lastInteraction = performance.now();
    };

    const onPointerDown = (e: PointerEvent) => onImpulse(e.clientX, e.clientY, 1.35);
    const onPointerMove = (e: PointerEvent) =>
      onImpulse(e.clientX, e.clientY, e.pointerType === 'touch' ? 0.95 : 0.55);
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onImpulse(t.clientX, t.clientY, 1.35);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onImpulse(t.clientX, t.clientY, 0.95);
    };

    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[entries.length - 1]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      build2DParticles();
      drawOnce(performance.now());
    });
    ro.observe(container);

    const fontRace = document.fonts?.ready
      ? Promise.race([document.fonts.ready, new Promise((r) => window.setTimeout(r, 180))])
      : Promise.resolve();
    void fontRace.then(() => {
      if (!disposed) {
        build2DParticles();
        drawOnce(performance.now());
      }
    });

    const tick = (now: number) => {
      if (disposed || reducedMotion) return;
      if (isVisible && !document.hidden) {
        drawOnce(now);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      unsubLoader();
      unsubRipple();
      window.cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [ambientActive, lines, linesKey, reducedMotion, subtitle, text]);

  if (domFallback) {
    return (
      <div className={cn('relative flex flex-col items-center justify-center py-12 px-4 text-center overflow-hidden', className)}>
        {displayLines.map((line, i) => (
          <p
            key={line}
            className={cn(
              'font-display font-bold uppercase tracking-tight leading-[0.92]',
              i === 0 ? 'text-5xl sm:text-7xl md:text-8xl' : 'text-3xl sm:text-5xl md:text-6xl mt-1',
              reducedMotion
                ? i === 0
                  ? 'text-ink'
                  : 'text-ink/85'
                : 'bg-clip-text text-transparent bg-[length:220%_100%] bg-[linear-gradient(105deg,var(--text-primary)_36%,var(--brand-primary)_48%,#C9233B_51%,var(--text-primary)_64%)] animate-[berrySheen_4.8s_ease-in-out_infinite]'
            )}
          >
            {line}
          </p>
        ))}
        {subtitle && (
          <p className="font-mono-tabular text-xs sm:text-sm uppercase tracking-[0.28em] text-brand mt-4">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${displayLines.join(' ')} — ${subtitle ?? 'interactive metallurgical particle typography'}`}
      className={cn(
        'relative w-full h-full min-h-[260px] sm:min-h-[340px] select-none overflow-hidden cursor-crosshair touch-pan-y',
        className
      )}
    />
  );
}

/**
 * InteractiveParticles — GPU WebGL Three.js instanced particle field sampling
 * the Berry Alloys Limited monumental mark across desktop, tablet, and touch phones
 * with nonzero-size initialization guard, context-loss recovery, animated 2D canvas
 * fallback, and responsive touch/tap/swipe dispersion.
 */
export function InteractiveParticles({
  text = 'BERRY ALLOYS LIMITED',
  lines,
  subtitle = 'FROM HEAT TO PRECISION · EST. 2006',
  className,
  particleColor,
  accentColor,
  particleSize = 1.85,
}: InteractiveParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { reducedMotion, ambientActive } = useMotion();
  const [fallbackMode, setFallbackMode] = useState<'none' | 'canvas-2d'>('none');
  const resolvedPrimary = particleColor ?? (theme === 'dark' ? '#F4F8FC' : '#10243A');
  const resolvedAccent = accentColor ?? (theme === 'dark' ? '#69C5F5' : '#006393');
  const colorsRef = useRef({ primary: resolvedPrimary, accent: resolvedAccent });
  colorsRef.current = { primary: resolvedPrimary, accent: resolvedAccent };
  const applyColorsRef = useRef<(() => void) | null>(null);
  const ambientRef = useRef(ambientActive);
  ambientRef.current = ambientActive;

  const linesKey = lines ? lines.join('|') : '';
  const displayLines = lines && lines.length > 0 ? lines : [text];

  useEffect(() => {
    if (fallbackMode !== 'none') return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      recordRuntimeError('InteractiveParticles.WebGLInit', err);
      upsertCanvasTelemetry('hero-particles', { backend: 'canvas-2d', contextLost: false });
      setFallbackMode('canvas-2d');
      return;
    }

    const gl = renderer.getContext();
    if (!gl || gl.isContextLost()) {
      renderer.dispose();
      upsertCanvasTelemetry('hero-particles', { backend: 'canvas-2d', contextLost: true });
      setFallbackMode('canvas-2d');
      return;
    }

    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : 'standard';
    const isSoftwareGl = /(swiftshader|llvmpipe|software|softpipe)/i.test(rendererStr);
    reportWebGLInfo(true, rendererStr);

    const canvasEl = renderer.domElement;
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';
    container.appendChild(canvasEl);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 1, 3000);
    camera.position.z = 420;

    const touch = new TouchTexture();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-99, -99);

    const hitGeo = new THREE.PlaneGeometry(1, 1, 1, 1);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    scene.add(hitMesh);

    let particlesMesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.RawShaderMaterial> | null = null;
    let sampledTexture: THREE.Texture | null = null;
    const sampledDims = { width: 420, height: 240 };
    let builtTier: ViewportTier | null = null;
    let disposed = false;
    let isVisible = true;
    let contextLost = false;
    let contextLostTimer = 0;
    let rafId = 0;
    let timeoutId = 0;
    const clock = new THREE.Clock();
    let introStart = isLoaderCleared() ? performance.now() : 0;
    let handoffStart = 0;

    const sampleStep = 3;

    const computeFitScale = (w: number, h: number, imgW: number, imgH: number) => {
      const fovRad = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const visibleWidth = visibleHeight * (w / Math.max(1, h));
      const fillRatioW = w < 640 ? 0.94 : 0.88;
      const fillRatioH = 0.86;
      const raw = Math.min((visibleWidth * fillRatioW) / imgW, (visibleHeight * fillRatioH) / imgH);
      return Math.max(0.36, Math.min(1.38, raw));
    };

    const computeParticleSize = (fitScale: number, containerW: number) => {
      const densityBoost = containerW < 640 ? 1.18 : 1.05;
      return sampleStep * fitScale * (particleSize / 2.05) * densityBoost * 0.72;
    };

    const syncRendererSize = () => {
      if (!renderer) return null;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 2 || h < 2) return null;
      const compact = w < 640;
      const dprCap = isSoftwareGl ? 1.25 : compact ? 1.5 : 2;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      return { w, h };
    };

    const disposeCurrentParticles = () => {
      sampledTexture?.dispose();
      sampledTexture = null;
      if (particlesMesh) {
        particlesMesh.geometry.dispose();
        particlesMesh.material.dispose();
        scene.remove(particlesMesh);
        particlesMesh = null;
      }
    };

    const buildParticlesFromBitmap = () => {
      if (disposed || !renderer || contextLost) return;
      const dims = syncRendererSize();
      if (!dims) return;

      const { w: currW, h: currH } = dims;
      const isCompactStage = currW < 640;
      const sample = createTypographySampleCanvas(text, lines, subtitle, currW);
      if (!sample.canvas) {
        upsertCanvasTelemetry('hero-particles', { backend: 'canvas-2d', contextLost: false });
        setFallbackMode('canvas-2d');
        return;
      }

      const ctx = sample.canvas.getContext('2d');
      if (!ctx) {
        upsertCanvasTelemetry('hero-particles', { backend: 'canvas-2d', contextLost: false });
        setFallbackMode('canvas-2d');
        return;
      }

      disposeCurrentParticles();
      builtTier = sample.tier;

      const imgW = sample.width;
      const imgH = sample.height;
      sampledDims.width = imgW;
      sampledDims.height = imgH;

      const texture = new THREE.CanvasTexture(sample.canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      sampledTexture = texture;

      const imgData = ctx.getImageData(0, 0, imgW, imgH).data;
      const indicesList: number[] = [];
      const offsetsList: number[] = [];
      const anglesList: number[] = [];
      const threshold = 24;

      for (let y = 0; y < imgH; y += sampleStep) {
        for (let x = 0; x < imgW; x += sampleStep) {
          const idx = (y * imgW + x) * 4;
          if (imgData[idx] > threshold) {
            offsetsList.push(x, imgH - y, 0);
            indicesList.push(y * imgW + x);
            anglesList.push(Math.random() * Math.PI * 2);
          }
        }
      }

      const count = indicesList.length;
      const geometry = new THREE.InstancedBufferGeometry();

      const positions = new THREE.BufferAttribute(new Float32Array(12), 3);
      positions.setXYZ(0, -0.5, 0.5, 0.0);
      positions.setXYZ(1, 0.5, 0.5, 0.0);
      positions.setXYZ(2, -0.5, -0.5, 0.0);
      positions.setXYZ(3, 0.5, -0.5, 0.0);
      geometry.setAttribute('position', positions);

      const uvs = new THREE.BufferAttribute(new Float32Array(8), 2);
      uvs.setXY(0, 0, 0);
      uvs.setXY(1, 1, 0);
      uvs.setXY(2, 0, 1);
      uvs.setXY(3, 1, 1);
      geometry.setAttribute('uv', uvs);

      geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));
      geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsetsList), 3));
      geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(new Float32Array(indicesList), 1));
      geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(new Float32Array(anglesList), 1));
      geometry.instanceCount = count;

      const fitScale = computeFitScale(currW, currH, imgW, imgH);
      const computedSize = computeParticleSize(fitScale, currW);
      hitMesh.scale.set(imgW * fitScale, imgH * fitScale, 1);

      const material = new THREE.RawShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uRandom: { value: reducedMotion ? 0.0 : isCompactStage ? 0.42 : 0.48 },
          uDepth: { value: reducedMotion ? 0.0 : isCompactStage ? 1.5 : 1.35 },
          uSize: { value: computedSize },
          uTextureSize: { value: new THREE.Vector2(imgW, imgH) },
          uTexture: { value: texture },
          uTouch: { value: touch.texture },
          uIntro: { value: reducedMotion || isSoftwareGl ? 1 : 0.14 },
          uAmbient: { value: reducedMotion || !ambientRef.current ? 0 : 1 },
          uHandoffX: { value: -0.4 },
          uHandoffStrength: { value: 0 },
          uAmbientSweepX: { value: -0.4 },
          uColor: { value: new THREE.Color(colorsRef.current.primary) },
          uAccentColor: { value: new THREE.Color(colorsRef.current.accent) },
          uRedColor: { value: new THREE.Color('#C9233B') },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        depthTest: false,
        transparent: true,
      });

      particlesMesh = new THREE.Mesh(geometry, material);
      particlesMesh.frustumCulled = false;
      particlesMesh.scale.setScalar(fitScale);
      scene.add(particlesMesh);

      try {
        renderer.render(scene, camera);
        incrementCanvasFrame('hero-particles');
        upsertCanvasTelemetry('hero-particles', {
          backend: 'webgl',
          contextLost: false,
          width: currW,
          height: currH,
        });
        setMotionInitStatus('heroParticles', 'webgl-ready');
      } catch (err) {
        recordRuntimeError('InteractiveParticles.render', err);
        setFallbackMode('canvas-2d');
      }
    };

    const unsubLoader = onLoaderCleared(() => {
      if (introStart === 0) introStart = performance.now();
    });
    const unsubRipple = onHeroEntranceRipple(() => {
      handoffStart = performance.now();
    });

    // Wait for nonzero dimensions before building; font race has 180ms timeout so slow fonts never block initial draw.
    const fontRace = document.fonts?.ready
      ? Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, 180))])
      : Promise.resolve();
    void fontRace.then(() => {
      if (!disposed && !particlesMesh) {
        buildParticlesFromBitmap();
      }
    });
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!disposed) {
          buildParticlesFromBitmap();
        }
      });
    }

    let lastInteractionAt = 0;
    let sweepCooldown = 0;

    const scatterAtClientPoint = (clientX: number, clientY: number, minForce = 0) => {
      if (reducedMotion || !particlesMesh) return;
      lastInteractionAt = performance.now();
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      mouse.y = -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(hitMesh);
      if (intersects.length > 0 && intersects[0].uv) {
        touch.addTouch(intersects[0].uv, minForce);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      scatterAtClientPoint(e.clientX, e.clientY, 0.98);
    };
    const onPointerMove = (e: PointerEvent) => {
      scatterAtClientPoint(e.clientX, e.clientY, e.pointerType === 'touch' ? 0.62 : 0.28);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) scatterAtClientPoint(t.clientX, t.clientY, 0.98);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) scatterAtClientPoint(t.clientX, t.clientY, 0.62);
    };

    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      upsertCanvasTelemetry('hero-particles', { contextLost: true });
      setMotionInitStatus('heroParticles', 'webgl-context-lost');
      window.clearTimeout(contextLostTimer);
      contextLostTimer = window.setTimeout(() => {
        if (!disposed && contextLost) {
          setFallbackMode('canvas-2d');
        }
      }, 900);
    };

    const onContextRestored = () => {
      window.clearTimeout(contextLostTimer);
      contextLost = false;
      buildParticlesFromBitmap();
    };

    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    applyColorsRef.current = () => {
      if (!particlesMesh) return;
      const u = particlesMesh.material.uniforms;
      u.uColor.value.set(colorsRef.current.primary);
      u.uAccentColor.value.set(colorsRef.current.accent);
      if (reducedMotion && !contextLost) renderer?.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[entries.length - 1]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    const onResize = () => {
      if (disposed || !renderer || contextLost) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 2 || h < 2) return;

      const nextTier = getViewportTier(w);
      if (!particlesMesh || (builtTier && nextTier !== builtTier)) {
        buildParticlesFromBitmap();
        return;
      }

      syncRendererSize();
      const nextScale = computeFitScale(w, h, sampledDims.width, sampledDims.height);
      particlesMesh.scale.setScalar(nextScale);
      particlesMesh.material.uniforms.uSize.value = computeParticleSize(nextScale, w);
      hitMesh.scale.set(sampledDims.width * nextScale, sampledDims.height * nextScale, 1);
      upsertCanvasTelemetry('hero-particles', { width: w, height: h });
      if (reducedMotion) {
        renderer.render(scene, camera);
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);

    const afterDraw = () => {
      if (disposed || reducedMotion) return;
      if (!isSoftwareGl) {
        rafId = window.requestAnimationFrame(tick);
        return;
      }
      const gl2 = gl as WebGL2RenderingContext;
      if (typeof gl2.fenceSync === 'function') {
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (!sync) {
          rafId = window.requestAnimationFrame(tick);
          return;
        }
        gl2.flush();
        const poll = () => {
          if (disposed) {
            gl2.deleteSync(sync);
            return;
          }
          const status = gl2.clientWaitSync(sync, 0, 0);
          if (status === gl2.TIMEOUT_EXPIRED) {
            timeoutId = window.setTimeout(poll, 4);
          } else {
            gl2.deleteSync(sync);
            rafId = window.requestAnimationFrame(tick);
          }
        };
        timeoutId = window.setTimeout(poll, 0);
      } else {
        timeoutId = window.setTimeout(() => {
          if (!disposed) rafId = window.requestAnimationFrame(tick);
        }, 32);
      }
    };

    const tick = () => {
      if (disposed || reducedMotion) return;
      if (isVisible && !document.hidden && !contextLost && particlesMesh) {
        const dt = Math.min(clock.getDelta(), 0.05);
        const ambientEnabled = ambientRef.current;
        const currW = container.clientWidth || 390;
        const isCompactStage = currW < 640;

        const u = particlesMesh.material.uniforms;
        u.uAmbient.value = ambientEnabled ? 1 : 0;
        touch.update();

        const now = performance.now();
        if (ambientEnabled) {
          u.uTime.value += dt;
          // Restrained periodic left-to-right Berry blue/red wave across lettering (runs in shader even on software GL)
          const cycle = ((u.uTime.value * 0.22) % 1.45) - 0.22;
          u.uAmbientSweepX.value = cycle;
        } else {
          u.uAmbientSweepX.value = -0.4;
        }

        // Splash-to-hero left-to-right handoff ripple (900ms sweep)
        if (handoffStart > 0) {
          const hp = (now - handoffStart) / 900;
          if (hp >= 0 && hp <= 1) {
            u.uHandoffX.value = -0.1 + 1.2 * hp;
            u.uHandoffStrength.value = Math.sin(hp * Math.PI);
          } else {
            u.uHandoffStrength.value = 0;
            handoffStart = 0;
          }
        }

        const intro = u.uIntro;
        if (intro.value < 1) {
          if (isLoaderCleared()) {
            if (introStart === 0) introStart = now;
            const p = Math.min(1, (now - introStart) / 900);
            intro.value = 0.14 + 0.86 * (1 - Math.pow(1 - p, 3));
          }
        } else if (ambientEnabled && !isSoftwareGl) {
          if (now - lastInteractionAt > 2400 && now > sweepCooldown) {
            const elapsed = u.uTime.value;
            const sweepX = 0.1 + 0.8 * ((elapsed * 0.22) % 1);
            const sweepY = 0.5 + 0.12 * Math.sin(elapsed * 1.2);
            touch.addTouch({ x: sweepX, y: sweepY }, isCompactStage ? 0.34 : 0.24);
            sweepCooldown = now + (isCompactStage ? 180 : 240);
          }
        }

        renderer?.render(scene, camera);
        incrementCanvasFrame('hero-particles');
      }
      afterDraw();
    };

    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      unsubLoader();
      unsubRipple();
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.clearTimeout(contextLostTimer);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      applyColorsRef.current = null;
      window.removeEventListener('resize', onResize);

      hitGeo.dispose();
      hitMat.dispose();
      touch.dispose();
      disposeCurrentParticles();
      renderer?.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, [fallbackMode, lines, linesKey, particleSize, reducedMotion, subtitle, text]);

  useEffect(() => {
    applyColorsRef.current?.();
  }, [resolvedPrimary, resolvedAccent]);

  if (fallbackMode === 'canvas-2d') {
    return (
      <InteractiveParticles2DFallback
        text={text}
        lines={lines}
        subtitle={subtitle}
        displayLines={displayLines}
        className={className}
        primaryColor={resolvedPrimary}
        accentColor={resolvedAccent}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${displayLines.join(' ')} — ${subtitle ?? 'interactive metallurgical particle typography'}`}
      className={cn(
        'relative w-full h-full min-h-[260px] sm:min-h-[340px] select-none overflow-hidden cursor-crosshair touch-pan-y',
        className
      )}
    />
  );
}

export default InteractiveParticles;

