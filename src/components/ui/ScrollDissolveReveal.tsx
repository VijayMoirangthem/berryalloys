import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { cn } from '../../lib/utils';

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

export interface ScrollDissolveRevealProps {
  image1: string;
  image2: string;
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
 * ScrollDissolveReveal — Scroll-scrubbed Sobel-edge + FBM noise GLSL dissolve shader
 * built directly on Vanilla Three.js + motion/react useScroll (React 19 safe, zero @react-three/fiber dep).
 */
export function ScrollDissolveReveal({
  image1,
  image2,
  image1Alt = 'First transition frame',
  image2Alt = 'Second transition frame',
  edgeColor = '#EC743C',
  leftKicker,
  leftTitle,
  leftDescription,
  rightKicker,
  rightTitle,
  rightDescription,
  className,
}: ScrollDissolveRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const targetRevealRef = useRef(0);
  const [revealPercent, setRevealPercent] = useState(0);
  const [fallback, setFallback] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    targetRevealRef.current = latest;
    setRevealPercent(Math.round(latest * 100));
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

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
    const tex1 = loader.load(image1, () => {
      tex1.colorSpace = THREE.SRGBColorSpace;
      const img = tex1.image as HTMLImageElement;
      if (img) baseUniforms.uTextureSize1.value.set(img.width || 1280, img.height || 720);
      renderer?.render(scene, camera);
    });
    const tex2 = loader.load(image2, () => {
      tex2.colorSpace = THREE.SRGBColorSpace;
      const img = tex2.image as HTMLImageElement;
      if (img) baseUniforms.uTextureSize2.value.set(img.width || 1280, img.height || 720);
      renderer?.render(scene, camera);
    });
    tex1.minFilter = THREE.LinearFilter;
    tex2.minFilter = THREE.LinearFilter;

    const baseUniforms = {
      uTexture1: { value: tex1 },
      uTexture2: { value: tex2 },
      uReveal: { value: targetRevealRef.current },
      uPlaneSize: { value: new THREE.Vector2(width, height) },
      uTextureSize1: { value: new THREE.Vector2(1600, 900) },
      uTextureSize2: { value: new THREE.Vector2(1600, 900) },
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
        baseUniforms.uReveal.value = currentReveal;
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
      tex1.dispose();
      tex2.dispose();
      scene.remove(baseMesh);
      scene.remove(edgeMesh);
      renderer?.dispose();
      if (canvasEl.parentNode === stage) {
        stage.removeChild(canvasEl);
      }
    };
  }, [edgeColor, image1, image2]);

  return (
    <section
      ref={containerRef}
      aria-label="Transition from plant complex to submerged-arc furnace smelting"
      className={cn('relative w-full h-[160vh] bg-[#07111F] text-[#F4F8FC]', className)}
    >
      <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[500px] w-full overflow-hidden">
        {fallback ? (
          <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-2">
            <img src={image1} alt={image1Alt} className="w-full h-full object-cover" />
            <img src={image2} alt={image2Alt} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div ref={stageRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        )}

        {/* Measured Contrast Scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111F]/88 via-[#07111F]/25 to-[#07111F]/55"
        />

        {/* Editorial Split Caption Overlay */}
        <div className="pointer-events-none relative z-10 max-w-[1360px] mx-auto h-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 py-10 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-widest text-[#F4F8FC]/80">
            <span>Thermal Reduction Bridge</span>
            <span className="text-[#69C5F5]">Transformation {revealPercent}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pb-4">
            <div className="bg-[#07111F]/92 border border-[#F4F8FC]/16 p-5 space-y-1.5 max-w-md">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#69C5F5]">
                {leftKicker ?? 'Stage 01 · Integrated Complex'}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#F4F8FC]">
                {leftTitle ?? 'Bobbili & Jharkhand Works'}
              </h3>
              <p className="text-xs sm:text-sm text-[#F4F8FC]/82 leading-relaxed">
                {leftDescription ?? 'Raw manganese, quartz, chromite, and metallurgical reductants prepared across multi-furnace production sheds.'}
              </p>
            </div>

            <div className="bg-[#07111F]/92 border border-[#F4F8FC]/16 p-5 space-y-1.5 max-w-md md:ml-auto">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#69C5F5]">
                {rightKicker ?? 'Stage 02 · High-Temperature Reduction'}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#F4F8FC]">
                {rightTitle ?? 'From Heat To Precision'}
              </h3>
              <p className="text-xs sm:text-sm text-[#F4F8FC]/82 leading-relaxed">
                {rightDescription ?? 'Submerged-arc electrodes, 6,000 MT/month AOD converters, and spectrographic assay verification.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollDissolveReveal;
