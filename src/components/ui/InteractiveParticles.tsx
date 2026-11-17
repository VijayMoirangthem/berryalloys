import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

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
  uniform vec2 uTextureSize;
  uniform sampler2D uTexture;
  uniform sampler2D uTouch;

  varying vec2 vPUv;
  varying vec2 vUv;

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
    displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
    float rndz = (random(pindex) + snoise(vec3(pindex * 0.1, uTime * 0.1, 0.0)));
    displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
    displaced.xy -= uTextureSize * 0.5;

    // Entrance: particles converge from scattered positions into the typography
    float inv = 1.0 - uIntro;
    float inv2 = inv * inv;
    displaced.xy += vec2(cos(angle), sin(angle)) * inv2 * (140.0 + 220.0 * random(pindex + 3.0));
    displaced.z += inv2 * 90.0 * (random(pindex + 7.0) - 0.5);

    float t = texture2D(uTouch, puv).r;
    displaced.z += t * 22.0 * rndz;
    displaced.x += cos(angle) * t * 18.0 * rndz;
    displaced.y += sin(angle) * t * 18.0 * rndz;

    float psize = (snoise(vec3(uTime * 0.35, puv * 3.0)) + 2.0);
    psize *= max(grey, 0.25);
    psize *= uSize * mix(0.4, 1.0, uIntro);

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
  varying vec2 vPUv;
  varying vec2 vUv;

  void main() {
    vec4 colA = texture2D(uTexture, vPUv);
    float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    float t = smoothstep(0.0, 0.5, 0.5 - dist);
    float radius = max(0.0, 0.5 - dist) * 2.0;

    // Brand-blue edge highlight mixed with the primary typography tint
    vec3 tint = mix(uAccentColor, uColor, smoothstep(0.35, 0.95, grey));
    vec4 color = vec4(tint, grey * radius * t);
    if (color.a < 0.05) discard;
    gl_FragColor = color;
  }
`;

class TouchTexture {
  size = 64;
  width = 64;
  height = 64;
  maxAge = 96;
  radius = 0.16;
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

  addTouch(point: { x: number; y: number }) {
    let force = 0;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      const dd = dx * dx + dy * dy;
      force = Math.min(dd * 10000, 1);
    }
    this.trail.push({ x: point.x, y: point.y, age: 0, force });
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
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin(((point.age / (this.maxAge * 0.3)) * Math.PI) / 2);
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const r = this.size * this.radius * intensity;
    if (r <= 0.1) return;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, r * 0.25, pos.x, pos.y, r);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
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

const SAMPLE_WIDTH = 720;
const SAMPLE_HEIGHT = 270;

/**
 * Generates an offscreen high-contrast bitmap typography texture for particle sampling
 * so the complete company title renders heavily and deterministically with zero 404 risk.
 */
function createTypographySampleDataUrl(
  text: string,
  lines?: string[],
  subtitle?: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_WIDTH;
  canvas.height = SAMPLE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const resolvedLines =
    lines && lines.length > 0
      ? lines.map((l) => l.toUpperCase())
      : [text.toUpperCase()];
  const hasSub = Boolean(subtitle);

  if (resolvedLines.length >= 2) {
    // Primary monumental brand line + bold secondary corporate line
    const line1 = resolvedLines[0];
    const line2 = resolvedLines[1];
    const line1Size = line1.length > 14 ? 86 : 114;
    const line2Size = line2.length > 14 ? 58 : 74;

    ctx.font = `800 ${line1Size}px "Barlow Condensed", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(line1, canvas.width / 2, hasSub ? canvas.height * 0.30 : canvas.height * 0.37);

    ctx.font = `700 ${line2Size}px "Barlow Condensed", sans-serif`;
    ctx.fillStyle = '#E8DFD1';
    ctx.fillText(line2, canvas.width / 2, hasSub ? canvas.height * 0.61 : canvas.height * 0.69);

    if (subtitle) {
      ctx.font = '600 21px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#B8AFA2';
      ctx.fillText(subtitle.toUpperCase(), canvas.width / 2, canvas.height * 0.87);
    }
  } else {
    const single = resolvedLines[0];
    const titleFontSize = single.length > 18 ? 72 : single.length > 13 ? 88 : 118;
    ctx.font = `800 ${titleFontSize}px "Barlow Condensed", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(single, canvas.width / 2, hasSub ? canvas.height * 0.42 : canvas.height * 0.5);

    if (subtitle) {
      ctx.font = '600 22px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#D4DFEB';
      ctx.fillText(subtitle.toUpperCase(), canvas.width / 2, canvas.height * 0.78);
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * InteractiveParticles — GPU WebGL Three.js instanced particle field sampling
 * the Berry Alloys Limited monumental mark from canvas raster data with cursor & touch scatter physics.
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
  const [fallback, setFallback] = useState(false);
  const resolvedPrimary = particleColor ?? (theme === 'dark' ? '#F4F8FC' : '#10243A');
  const resolvedAccent = accentColor ?? (theme === 'dark' ? '#69C5F5' : '#006393');
  const colorsRef = useRef({ primary: resolvedPrimary, accent: resolvedAccent });
  colorsRef.current = { primary: resolvedPrimary, accent: resolvedAccent };
  const applyColorsRef = useRef<(() => void) | null>(null);

  const linesKey = lines ? lines.join('|') : '';
  const displayLines = lines && lines.length > 0 ? lines : [text];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallback(true);
      return;
    }

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /(swiftshader|llvmpipe|software|softpipe)/i.test(rendererStr);

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const canvasEl = renderer.domElement;
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';
    container.appendChild(canvasEl);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 3000);
    camera.position.z = 420;

    const touch = new TouchTexture();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-99, -99);

    const hitGeo = new THREE.PlaneGeometry(860, 380, 1, 1);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    scene.add(hitMesh);

    let particlesMesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.RawShaderMaterial> | null = null;
    let sampledTexture: THREE.Texture | null = null;
    const sampledDims = { width: SAMPLE_WIDTH, height: SAMPLE_HEIGHT };
    let disposed = false;
    let isVisible = true;
    let rafId = 0;
    let timeoutId = 0;
    const clock = new THREE.Clock();
    let introStart = 0;

    const computeFitScale = (w: number, h: number, imgW: number, imgH: number) => {
      const fovRad = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const visibleWidth = visibleHeight * (w / Math.max(1, h));
      const fillRatioW = w < 640 ? 0.94 : 0.88;
      const fillRatioH = w < 640 ? 0.84 : 0.86;
      const raw = Math.min((visibleWidth * fillRatioW) / imgW, (visibleHeight * fillRatioH) / imgH);
      return Math.max(0.32, Math.min(1.35, raw));
    };

    const buildParticlesFromBitmap = () => {
      if (disposed) return;

      const dataUrl = createTypographySampleDataUrl(text, lines, subtitle);
      if (!dataUrl) {
        setFallback(true);
        return;
      }

      new THREE.TextureLoader().load(dataUrl, (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        sampledTexture = texture;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const img = texture.image as HTMLImageElement;
        const imgW = img.width || SAMPLE_WIDTH;
        const imgH = img.height || SAMPLE_HEIGHT;
        sampledDims.width = imgW;
        sampledDims.height = imgH;

        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = imgW;
        sampleCanvas.height = imgH;
        const ctx = sampleCanvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, imgW, imgH);
        const imgData = ctx.getImageData(0, 0, imgW, imgH).data;

        // Keep particle count crisp and fast across hardware & software WebGL
        const step = isSoftwareGl ? 3 : 2;
        const indicesList: number[] = [];
        const offsetsList: number[] = [];
        const anglesList: number[] = [];
        const threshold = 26;

        for (let y = 0; y < imgH; y += step) {
          for (let x = 0; x < imgW; x += step) {
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

        const material = new THREE.RawShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uRandom: { value: prefersReduced ? 0.0 : 0.48 },
            uDepth: { value: prefersReduced ? 0.0 : 1.2 },
            uSize: { value: particleSize * (isSoftwareGl ? 1.55 : 1.18) },
            uTextureSize: { value: new THREE.Vector2(imgW, imgH) },
            uTexture: { value: texture },
            uTouch: { value: touch.texture },
            uIntro: { value: prefersReduced ? 1 : 0 },
            uColor: { value: new THREE.Color(colorsRef.current.primary) },
            uAccentColor: { value: new THREE.Color(colorsRef.current.accent) },
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          depthTest: false,
          transparent: true,
        });

        particlesMesh = new THREE.Mesh(geometry, material);
        particlesMesh.frustumCulled = false;

        const currW = Math.max(1, container.clientWidth);
        const currH = Math.max(1, container.clientHeight);
        particlesMesh.scale.setScalar(computeFitScale(currW, currH, imgW, imgH));

        scene.add(particlesMesh);
        renderer?.render(scene, camera);
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(buildParticlesFromBitmap);
    } else {
      buildParticlesFromBitmap();
    }

    const scatterAtClientPoint = (clientX: number, clientY: number) => {
      if (prefersReduced || !particlesMesh) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      mouse.y = -((clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(hitMesh);
      if (intersects.length > 0 && intersects[0].uv) {
        touch.addTouch(intersects[0].uv);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      scatterAtClientPoint(e.clientX, e.clientY);
    };

    // Pointer events cover mouse, pen and touch; one handler means a gesture is never processed twice.
    // The container uses touch-action: pan-y so vertical page scrolling always wins on phones.
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerMove, { passive: true });

    // Live theme change: update uniforms only, keep particle positions.
    applyColorsRef.current = () => {
      if (!particlesMesh) return;
      const u = particlesMesh.material.uniforms;
      u.uColor.value.set(colorsRef.current.primary);
      u.uAccentColor.value.set(colorsRef.current.accent);
      if (prefersReduced) renderer?.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[entries.length - 1]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    const onResize = () => {
      if (!container || !renderer) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (particlesMesh) {
        particlesMesh.scale.setScalar(
          computeFitScale(w, h, sampledDims.width, sampledDims.height)
        );
      }
      if (prefersReduced && particlesMesh) {
        renderer.render(scene, camera);
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', onResize);

    const afterDraw = () => {
      if (disposed || prefersReduced) return;
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
      if (disposed || prefersReduced) return;
      if (isVisible && !document.hidden && particlesMesh) {
        const dt = Math.min(clock.getDelta(), 0.05);
        touch.update();
        particlesMesh.material.uniforms.uTime.value += dt;
        const intro = particlesMesh.material.uniforms.uIntro;
        if (intro.value < 1) {
          // Wall-clock progress, so the formation takes ~1.5s even when frames are slow.
          if (introStart === 0) introStart = performance.now();
          const p = Math.min(1, (performance.now() - introStart) / 1500);
          intro.value = 1 - Math.pow(1 - p, 3);
        }
        renderer?.render(scene, camera);
      }
      afterDraw();
    };

    if (!prefersReduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerMove);
      applyColorsRef.current = null;
      window.removeEventListener('resize', onResize);

      hitGeo.dispose();
      hitMat.dispose();
      touch.dispose();
      sampledTexture?.dispose();
      if (particlesMesh) {
        particlesMesh.geometry.dispose();
        particlesMesh.material.dispose();
        scene.remove(particlesMesh);
      }
      renderer?.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, [linesKey, particleSize, subtitle, text]);

  useEffect(() => {
    applyColorsRef.current?.();
  }, [resolvedPrimary, resolvedAccent]);

  if (fallback) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
        {displayLines.map((line, i) => (
          <p
            key={line}
            className={cn(
              'font-display font-bold uppercase tracking-tight text-ink leading-[0.92]',
              i === 0 ? 'text-5xl sm:text-7xl md:text-8xl' : 'text-3xl sm:text-5xl md:text-6xl text-ink/85 mt-1'
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
      className={cn('relative w-full h-full min-h-[260px] sm:min-h-[340px] select-none overflow-hidden cursor-crosshair touch-pan-y', className)}
    />
  );
}

export default InteractiveParticles;
