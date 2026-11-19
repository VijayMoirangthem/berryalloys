import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useDrag } from '@use-gesture/react';
import { cn } from '../../lib/utils';
import { useIsCompactMobile } from '../../hooks/useIsCompactMobile';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BASE_FRAGMENT_SHADER = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uReveal;
  uniform vec2 uPlaneSize;
  uniform vec2 uTextureSize1;
  uniform vec2 uTextureSize2;

  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  vec2 getCoverUV(vec2 uv, vec2 planeSize, vec2 imageSize) {
    vec2 s = planeSize;
    vec2 i = max(imageSize, vec2(1.0));
    float rs = s.x / max(s.y, 1.0);
    float ri = i.x / i.y;
    vec2 newUv = uv;
    if (rs > ri) {
      newUv.y = (uv.y - 0.5) * (ri / rs) + 0.5;
    } else {
      newUv.x = (uv.x - 0.5) * (rs / ri) + 0.5;
    }
    return newUv;
  }

  float sampleLum(sampler2D tex, vec2 uv) {
    vec4 color = texture2D(tex, uv);
    return dot(color.rgb, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 res) {
    vec2 px = 1.0 / res;
    float x =
      -sampleLum(tex, uv + px * vec2(-1.0,  1.0)) - 2.0 * sampleLum(tex, uv + px * vec2(-1.0,  0.0)) - sampleLum(tex, uv + px * vec2(-1.0, -1.0)) +
       sampleLum(tex, uv + px * vec2( 1.0,  1.0)) + 2.0 * sampleLum(tex, uv + px * vec2( 1.0,  0.0)) + sampleLum(tex, uv + px * vec2( 1.0, -1.0));
    float y =
      -sampleLum(tex, uv + px * vec2(-1.0,  1.0)) - 2.0 * sampleLum(tex, uv + px * vec2( 0.0,  1.0)) - sampleLum(tex, uv + px * vec2( 1.0,  1.0)) +
       sampleLum(tex, uv + px * vec2(-1.0, -1.0)) + 2.0 * sampleLum(tex, uv + px * vec2( 0.0, -1.0)) + sampleLum(tex, uv + px * vec2( 1.0, -1.0));
    return sqrt(x * x + y * y);
  }

  void main() {
    vec2 uv1 = getCoverUV(vUv, uPlaneSize, uTextureSize1);
    vec2 uv2 = getCoverUV(vUv, uPlaneSize, uTextureSize2);

    vec4 col1 = texture2D(uTexture1, uv1);
    vec4 col2 = texture2D(uTexture2, uv2);

    float edges1 = smoothstep(0.05, 0.28, sobel(uTexture1, uv1, uPlaneSize));
    float edges2 = smoothstep(0.05, 0.28, sobel(uTexture2, uv2, uPlaneSize));

    float n = fbm(vUv * 5.0);
    float reveal = smoothstep(0.0, 1.0, uReveal * 1.4 - (1.0 - n) * 0.4);
    float edgeMask1 = smoothstep(0.0, 0.2, reveal) * (1.0 - smoothstep(0.2, 0.7, reveal));
    float edgeMask2 = smoothstep(0.2, 0.7, reveal) * (1.0 - smoothstep(0.7, 1.0, reveal));

    vec4 img1 = mix(col1, vec4(0.92, 0.45, 0.24, 1.0), edges1 * edgeMask1 * 0.55);
    vec4 img2 = mix(col2, vec4(0.92, 0.45, 0.24, 1.0), edges2 * edgeMask2 * 0.55);

    gl_FragColor = mix(img1, img2, reveal);
  }
`;

const EDGE_OVERLAY_FRAGMENT_SHADER = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uReveal;
  uniform vec2 uPlaneSize;
  uniform vec2 uTextureSize1;
  uniform vec2 uTextureSize2;
  uniform vec3 uEdgeColor;

  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  vec2 getCoverUV(vec2 uv, vec2 planeSize, vec2 imageSize) {
    vec2 s = planeSize;
    vec2 i = max(imageSize, vec2(1.0));
    float rs = s.x / max(s.y, 1.0);
    float ri = i.x / i.y;
    vec2 newUv = uv;
    if (rs > ri) {
      newUv.y = (uv.y - 0.5) * (ri / rs) + 0.5;
    } else {
      newUv.x = (uv.x - 0.5) * (rs / ri) + 0.5;
    }
    return newUv;
  }

  float sampleLum(sampler2D tex, vec2 uv) {
    vec4 color = texture2D(tex, uv);
    return dot(color.rgb, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 res) {
    vec2 px = 1.0 / res;
    float x =
      -sampleLum(tex, uv + px * vec2(-1.0,  1.0)) - 2.0 * sampleLum(tex, uv + px * vec2(-1.0,  0.0)) - sampleLum(tex, uv + px * vec2(-1.0, -1.0)) +
       sampleLum(tex, uv + px * vec2( 1.0,  1.0)) + 2.0 * sampleLum(tex, uv + px * vec2( 1.0,  0.0)) + sampleLum(tex, uv + px * vec2( 1.0, -1.0));
    float y =
      -sampleLum(tex, uv + px * vec2(-1.0,  1.0)) - 2.0 * sampleLum(tex, uv + px * vec2( 0.0,  1.0)) - sampleLum(tex, uv + px * vec2( 1.0,  1.0)) +
       sampleLum(tex, uv + px * vec2(-1.0, -1.0)) + 2.0 * sampleLum(tex, uv + px * vec2( 0.0, -1.0)) + sampleLum(tex, uv + px * vec2( 1.0, -1.0));
    return sqrt(x * x + y * y);
  }

  void main() {
    vec2 uv1 = getCoverUV(vUv, uPlaneSize, uTextureSize1);
    vec2 uv2 = getCoverUV(vUv, uPlaneSize, uTextureSize2);

    float edges1 = smoothstep(0.06, 0.35, sobel(uTexture1, uv1, uPlaneSize));
    float edges2 = smoothstep(0.06, 0.35, sobel(uTexture2, uv2, uPlaneSize));

    float n = fbm(vUv * 5.0);
    float reveal = smoothstep(0.0, 1.0, uReveal * 1.4 - (1.0 - n) * 0.4);
    float edgeMask1 = smoothstep(0.0, 0.2, reveal) * (1.0 - smoothstep(0.2, 0.7, reveal));
    float edgeMask2 = smoothstep(0.2, 0.7, reveal) * (1.0 - smoothstep(0.7, 1.0, reveal));

    float alpha1 = edges1 * edgeMask1;
    float alpha2 = edges2 * edgeMask2;

    gl_FragColor = vec4(uEdgeColor, clamp(max(alpha1, alpha2) * 0.85, 0.0, 1.0));
  }
`;

export interface ScrollDissolveSlide {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  description: string;
}

export interface ScrollDissolveRevealProps {
  /** Optional multi-stage sequence (2 to 6 images) dissolved sequentially on scroll. */
  slides?: ScrollDissolveSlide[];
  /** Legacy 2-image props preserved for backwards compatibility. */
  image1?: string;
  image2?: string;
  image1Alt?: string;
  image2Alt?: string;
  edgeColor?: string;
  leftKicker?: string;
  leftTitle?: string;
  leftDescription?: string;
  rightKicker?: string;
  rightTitle?: string;
  rightDescription?: string;
  className?: string;
}

/**
 * ScrollDissolveReveal — Multi-stage scroll-scrubbed Sobel-edge + FBM noise GLSL dissolve shader
 * built directly on Vanilla Three.js + motion/react useScroll. Supports 2 to 6 sequential scenes
 * with live stage rails on desktop and touch-swipe cross-fade on compact mobile viewports.
 */
export function ScrollDissolveReveal({
  slides: slidesProp,
  image1,
  image2,
  image1Alt = 'First transition frame',
  image2Alt = 'Second transition frame',
  edgeColor = '#69C5F5',
  leftKicker,
  leftTitle,
  leftDescription,
  rightKicker,
  rightTitle,
  rightDescription,
  className,
}: ScrollDissolveRevealProps) {
  const slides = useMemo<ScrollDissolveSlide[]>(() => {
    if (slidesProp && slidesProp.length >= 2) return slidesProp;
    return [
      {
        image: image1 ?? '',
        alt: image1Alt,
        kicker: leftKicker ?? 'Stage 01 · Integrated Complex',
        title: leftTitle ?? 'Bobbili & Jharkhand Works',
        description:
          leftDescription ??
          'Raw manganese, quartz, chromite, and metallurgical reductants prepared across multi-furnace production sheds.',
      },
      {
        image: image2 ?? '',
        alt: image2Alt,
        kicker: rightKicker ?? 'Stage 02 · High-Temperature Reduction',
        title: rightTitle ?? 'From Heat To Precision',
        description:
          rightDescription ??
          'Submerged-arc electrodes, 6,000 MT/month AOD converters, and spectrographic assay verification.',
      },
    ];
  }, [
    slidesProp,
    image1,
    image2,
    image1Alt,
    image2Alt,
    leftKicker,
    leftTitle,
    leftDescription,
    rightKicker,
    rightTitle,
    rightDescription,
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const targetRevealRef = useRef(0);
  const isCompactMobile = useIsCompactMobile(1023);
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualMobileIndex, setManualMobileIndex] = useState<number | null>(null);
  const [revealPercent, setRevealPercent] = useState(0);
  const [fallback, setFallback] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isCompactMobile ? ['start 85%', 'end 25%'] : ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    targetRevealRef.current = latest;
    const clamped = Math.max(0, Math.min(1, latest));
    const idx = Math.min(slides.length - 1, Math.floor(clamped * (slides.length - 0.001)));
    if (!isCompactMobile || manualMobileIndex === null) {
      setRevealPercent(Math.round(clamped * 100));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    }
  });

  const selectMobileSlide = (idx: number | null) => {
    setManualMobileIndex(idx);
    if (idx === null) {
      const clamped = Math.max(0, Math.min(1, targetRevealRef.current));
      setActiveIndex(Math.min(slides.length - 1, Math.floor(clamped * (slides.length - 0.001))));
      setRevealPercent(Math.round(clamped * 100));
      return;
    }
    const safeIdx = (idx + slides.length) % slides.length;
    setActiveIndex(safeIdx);
    setRevealPercent(Math.round((safeIdx / Math.max(1, slides.length - 1)) * 100));
  };

  const bindMobileSwipe = useDrag(
    ({ last, movement: [mx], velocity: [vx], direction: [dx] }) => {
      if (!last) return;
      if (Math.abs(mx) > 36 || vx > 0.3) {
        const delta = dx < 0 || mx < 0 ? 1 : -1;
        selectMobileSlide(activeIndex + delta);
      }
    },
    { axis: 'x', filterTaps: true, threshold: 8, pointer: { capture: false } }
  );

  // Build stable URL signature so Three.js only rebuilds if image URLs actually change
  const imageKey = slides.map((s) => s.image).join('|');

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || isCompactMobile || slides.length < 2) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setFallback(true);
      return;
    }

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /(swiftshader|llvmpipe|software|softpipe)/i.test(rendererStr);

    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvasEl = renderer.domElement;
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    canvasEl.style.display = 'block';
    stage.appendChild(canvasEl);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 5;

    const loader = new THREE.TextureLoader();
    const texSizes = slides.map(() => new THREE.Vector2(1600, 900));
    const textures = slides.map((slide, idx) => {
      const tex = loader.load(slide.image, () => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const img = tex.image as HTMLImageElement;
        if (img) {
          texSizes[idx].set(img.width || 1600, img.height || 900);
        }
        renderer?.render(scene, camera);
      });
      tex.minFilter = THREE.LinearFilter;
      return tex;
    });

    const baseUniforms = {
      uTexture1: { value: textures[0] },
      uTexture2: { value: textures[1] },
      uReveal: { value: 0 },
      uPlaneSize: { value: new THREE.Vector2(width, height) },
      uTextureSize1: { value: texSizes[0].clone() },
      uTextureSize2: { value: texSizes[1].clone() },
      uEdgeColor: { value: new THREE.Color(edgeColor) },
    };

    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const baseMat = new THREE.ShaderMaterial({
      uniforms: baseUniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: BASE_FRAGMENT_SHADER,
      depthWrite: false,
    });
    const edgeMat = new THREE.ShaderMaterial({
      uniforms: baseUniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: EDGE_OVERLAY_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
    });

    const baseMesh = new THREE.Mesh(planeGeo, baseMat);
    const edgeMesh = new THREE.Mesh(planeGeo, edgeMat);
    edgeMesh.position.z = 0.01;
    scene.add(baseMesh);
    scene.add(edgeMesh);

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[entries.length - 1]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    observer.observe(stage);

    const onResize = () => {
      if (!stage || !renderer) return;
      const w = Math.max(1, stage.clientWidth);
      const h = Math.max(1, stage.clientHeight);
      renderer.setSize(w, h);
      baseUniforms.uPlaneSize.value.set(w, h);
    };
    window.addEventListener('resize', onResize);

    let currentReveal = targetRevealRef.current;
    let disposed = false;
    let rafId = 0;
    let timeoutId = 0;
    const segmentCount = slides.length - 1;

    const applySegmentUniforms = (progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress));
      const scaled = clamped * segmentCount;
      const segIdx = Math.min(segmentCount - 1, Math.floor(scaled));
      const localReveal = Math.max(0, Math.min(1, scaled - segIdx));

      baseUniforms.uTexture1.value = textures[segIdx];
      baseUniforms.uTexture2.value = textures[segIdx + 1];
      baseUniforms.uTextureSize1.value.copy(texSizes[segIdx]);
      baseUniforms.uTextureSize2.value.copy(texSizes[segIdx + 1]);
      baseUniforms.uReveal.value = localReveal;
    };

    applySegmentUniforms(currentReveal);
    renderer.render(scene, camera);

    const afterDraw = () => {
      if (disposed) return;
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
      if (disposed) return;
      if (isVisible && !document.hidden) {
        currentReveal = THREE.MathUtils.lerp(currentReveal, targetRevealRef.current, 0.14);
        applySegmentUniforms(currentReveal);
        renderer?.render(scene, camera);
      }
      afterDraw();
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);

      planeGeo.dispose();
      baseMat.dispose();
      edgeMat.dispose();
      textures.forEach((t) => t.dispose());
      scene.remove(baseMesh);
      scene.remove(edgeMesh);
      renderer?.dispose();
      if (canvasEl.parentNode === stage) {
        stage.removeChild(canvasEl);
      }
    };
  }, [edgeColor, imageKey, isCompactMobile, slides]);

  const currentSlide = slides[Math.min(activeIndex, slides.length - 1)];
  const nextSlide = slides[Math.min(activeIndex + 1, slides.length - 1)];

  if (isCompactMobile) {
    return (
      <section
        ref={containerRef}
        aria-label="Multi-stage smelting to export visual transition"
        className={cn('w-full bg-[#07111F] text-[#F4F8FC] py-12 px-4 border-t border-[#F4F8FC]/10', className)}
      >
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-3 text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
            <span>Thermal Reduction Sequence</span>
            <span>
              {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} · {revealPercent}%
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Production stage selector"
            className="flex flex-wrap gap-1.5"
          >
            {slides.map((s, idx) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={activeIndex === idx}
                onClick={() => selectMobileSlide(idx)}
                className={cn(
                  'min-h-[36px] px-2.5 py-1 text-[10px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer',
                  activeIndex === idx
                    ? 'bg-[#0A6AA1] text-[#FFFFFF] border-[#69C5F5]'
                    : 'bg-[#0D1B2E] text-[#B5C5D7] border-[#F4F8FC]/16'
                )}
              >
                0{idx + 1}
              </button>
            ))}
          </div>

          <div
            {...bindMobileSwipe()}
            style={{ touchAction: 'pan-y' }}
            className="relative aspect-[16/10] w-full overflow-hidden border border-[#F4F8FC]/18 bg-[#0D1B2E]"
          >
            {slides.map((slide, idx) => (
              <motion.img
                key={slide.image}
                src={slide.image}
                alt={slide.alt}
                initial={false}
                animate={{
                  opacity: idx === activeIndex ? 1 : 0,
                  scale: idx === activeIndex ? 1 : 1.05,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
              />
            ))}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#07111F]/92 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-[#69C5F5]">
              <span className="truncate">{currentSlide.kicker}</span>
              {manualMobileIndex !== null && (
                <button
                  type="button"
                  onClick={() => selectMobileSlide(null)}
                  className="shrink-0 underline underline-offset-2 text-[#F4F8FC]/85 cursor-pointer"
                >
                  Sync Scroll
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#0D1B2E] border border-[#F4F8FC]/16 p-5 space-y-1.5">
            <h3 className="font-display text-2xl font-bold uppercase text-[#F4F8FC]">
              {currentSlide.title}
            </h3>
            <p className="text-xs text-[#F4F8FC]/82 leading-relaxed">
              {currentSlide.description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-label="Multi-stage scroll transition from submerged-arc smelting through assay and renewable power to port export"
      className={cn(
        'relative w-full bg-[#07111F] text-[#F4F8FC]',
        slides.length >= 4 ? 'h-[320vh]' : slides.length === 3 ? 'h-[240vh]' : 'h-[160vh]',
        className
      )}
    >
      <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[520px] w-full overflow-hidden">
        {fallback ? (
          <div className="relative h-full w-full grid grid-cols-2 md:grid-cols-3">
            {slides.map((s) => (
              <img key={s.image} src={s.image} alt={s.alt} className="w-full h-full object-cover" />
            ))}
          </div>
        ) : (
          <div ref={stageRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        )}

        {/* Measured Contrast Scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/22 to-[#07111F]/60"
        />

        {/* Editorial Split Caption Overlay + Live Multi-Stage Progress Rail */}
        <div className="pointer-events-none relative z-10 max-w-[1360px] mx-auto h-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 py-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-widest text-[#F4F8FC]/82">
              <span>
                Thermal Reduction &amp; Export Bridge · {slides.length} Visual Stages
              </span>
              <span className="text-[#69C5F5]">
                Stage {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')} · {revealPercent}%
              </span>
            </div>

            {/* Segmented Stage Indicator Track */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
              {slides.map((s, idx) => {
                const isDone = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                return (
                  <div key={s.title} className="space-y-1">
                    <div className="h-[3px] w-full bg-[#F4F8FC]/20 overflow-hidden">
                      <div
                        className="h-full bg-[#69C5F5] transition-all duration-300"
                        style={{ width: isDone ? '100%' : isCurrent ? '100%' : '0%', opacity: isCurrent ? 1 : isDone ? 0.65 : 0 }}
                      />
                    </div>
                    <p
                      className={cn(
                        'text-[10px] font-mono-tabular uppercase tracking-wider truncate transition-colors',
                        isCurrent ? 'text-[#69C5F5] font-semibold' : 'text-[#F4F8FC]/55'
                      )}
                    >
                      0{idx + 1} · {s.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pb-4">
            <div className="bg-[#07111F]/92 border border-[#69C5F5]/45 p-5 space-y-1.5 max-w-md">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#69C5F5]">
                {currentSlide.kicker}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#F4F8FC]">
                {currentSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#F4F8FC]/84 leading-relaxed">
                {currentSlide.description}
              </p>
            </div>

            {nextSlide && nextSlide !== currentSlide && (
              <div className="bg-[#07111F]/80 border border-[#F4F8FC]/16 p-5 space-y-1.5 max-w-md md:ml-auto">
                <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                  Next On Scroll · {nextSlide.kicker}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#F4F8FC]/90">
                  {nextSlide.title}
                </h3>
                <p className="text-xs text-[#F4F8FC]/70 leading-relaxed line-clamp-2">
                  {nextSlide.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollDissolveReveal;
