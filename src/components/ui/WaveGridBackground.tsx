import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { useMotion } from '../../context/MotionContext';
import { cn } from '../../lib/utils';
import { useIsCompactMobile } from '../../hooks/useIsCompactMobile';
import {
  incrementCanvasFrame,
  recordRuntimeError,
  upsertCanvasTelemetry,
} from '../../lib/motionDiagnostics';

interface WaveGridBackgroundProps {
  className?: string;
  /** Wave amplitude multiplier */
  amplitude?: number;
  /** Grid density across width */
  segments?: number;
}

/**
 * WaveGridBackground — Three.js interactive 3D topographic wave lattice
 * for Berry Alloys industrial backdrops.
 * Gates WebGL allocation behind viewport proximity (IntersectionObserver rootMargin)
 * so iOS WKWebView never hits active-context limits while hero or globe contexts are mounted.
 */
export function WaveGridBackground({
  className,
  amplitude = 0.72,
  segments = 42,
}: WaveGridBackgroundProps) {
  const { theme } = useTheme();
  const { reducedMotion, ambientActive } = useMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isCompactMobile = useIsCompactMobile(767);
  const [fallback, setFallback] = useState(false);
  const [inProximity, setInProximity] = useState(false);
  const ambientRef = useRef(ambientActive);
  ambientRef.current = ambientActive;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        setInProximity(entry.isIntersecting);
      },
      { rootMargin: '420px 0px', threshold: 0.01 }
    );
    io.observe(container);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inProximity || fallback) return;
    const container = containerRef.current;
    if (!container) return;

    const isDark = theme === 'dark';

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      recordRuntimeError('WaveGridBackground.WebGLInit', err);
      upsertCanvasTelemetry('wave-grid', { backend: 'fallback-css', contextLost: false });
      setFallback(true);
      return;
    }

    const gl = renderer.getContext();
    if (!gl || gl.isContextLost()) {
      renderer.dispose();
      setFallback(true);
      return;
    }

    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /(swiftshader|llvmpipe|software)/i.test(rendererStr);

    const width = Math.max(2, container.clientWidth);
    const height = Math.max(2, container.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : isCompactMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const domCanvas = renderer.domElement;
    domCanvas.style.width = '100%';
    domCanvas.style.height = '100%';
    domCanvas.style.display = 'block';
    container.appendChild(domCanvas);

    upsertCanvasTelemetry('wave-grid', {
      backend: 'webgl',
      contextLost: false,
      width,
      height,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 4.6, 8.2);
    camera.lookAt(0, -0.5, 0);

    const segs = isCompactMobile ? Math.min(20, segments) : isSoftwareGl ? Math.min(26, segments) : segments;
    const planeWidth = 22;
    const planeDepth = 14;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeDepth, segs, Math.round(segs * 0.72));
    geometry.rotateX(-Math.PI / 2);

    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const baseY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      baseY[i] = posAttr.getY(i);
    }

    const effectiveAmplitude = isCompactMobile ? amplitude * 1.32 : amplitude;
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xec743c : 0x9e4b28,
      wireframe: true,
      transparent: true,
      opacity: isDark ? (isCompactMobile ? 0.3 : 0.24) : isCompactMobile ? 0.22 : 0.16,
    });
    const waveMesh = new THREE.Mesh(geometry, wireMaterial);
    waveMesh.position.y = -0.6;
    scene.add(waveMesh);

    const pointsMaterial = new THREE.PointsMaterial({
      color: isDark ? 0xf3f0e9 : 0x141618,
      size: isCompactMobile ? 0.07 : 0.055,
      transparent: true,
      opacity: isDark ? (isCompactMobile ? 0.44 : 0.36) : isCompactMobile ? 0.28 : 0.22,
    });
    const wavePoints = new THREE.Points(geometry, pointsMaterial);
    wavePoints.position.y = -0.59;
    scene.add(wavePoints);

    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    let lastTouchAt = 0;

    const updatePointerClient = (clientX: number, clientY: number) => {
      if (reducedMotion) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.x = ((clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((clientY - rect.top) / rect.height - 0.5) * 2;
      lastTouchAt = performance.now();
    };
    const onPointerMove = (e: PointerEvent) => {
      updatePointerClient(e.clientX, e.clientY);
    };
    const onTouchUpdate = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updatePointerClient(t.clientX, t.clientY);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onTouchUpdate, { passive: true });
    window.addEventListener('touchmove', onTouchUpdate, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[entries.length - 1]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    const onResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 2 || h < 2) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      upsertCanvasTelemetry('wave-grid', { width: w, height: h });
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      upsertCanvasTelemetry('wave-grid', { contextLost: true, backend: 'fallback-css' });
      setFallback(true);
    };
    domCanvas.addEventListener('webglcontextlost', onContextLost);

    const updateWave = (t: number) => {
      const idleOnCompact = isCompactMobile && performance.now() - lastTouchAt > 2500;
      const targetX = idleOnCompact ? Math.sin(t * 0.55) * 0.65 : pointer.x;
      const targetY = idleOnCompact ? Math.cos(t * 0.42) * 0.5 : pointer.y;

      smoothPointer.x += (targetX - smoothPointer.x) * 0.05;
      smoothPointer.y += (targetY - smoothPointer.y) * 0.05;

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);

        const ridgeA = Math.sin(x * 0.45 + t * 0.95) * Math.cos(z * 0.52 + t * 0.72);
        const ridgeB = Math.sin((x + z) * 0.32 - t * 0.62) * 0.48;
        const dx = x - smoothPointer.x * 7.5;
        const dz = z - smoothPointer.y * 4.5;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const cursorRipple = Math.exp(-dist * 0.24) * Math.cos(dist * 1.1 - t * 2.4) * 0.72;

        posAttr.setY(i, baseY[i] + (ridgeA + ridgeB) * effectiveAmplitude + cursorRipple);
      }
      posAttr.needsUpdate = true;
    };

    updateWave(0.8);
    renderer.render(scene, camera);
    incrementCanvasFrame('wave-grid');

    let rafId = 0;
    let timeoutId = 0;
    let disposed = false;
    const startTime = performance.now();

    const afterDraw = () => {
      if (disposed || reducedMotion) return;
      if (!isSoftwareGl) {
        rafId = window.requestAnimationFrame(loop);
        return;
      }
      const gl2 = gl as WebGL2RenderingContext;
      if (typeof gl2.fenceSync === 'function') {
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (!sync) {
          rafId = window.requestAnimationFrame(loop);
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
            rafId = window.requestAnimationFrame(loop);
          }
        };
        timeoutId = window.setTimeout(poll, 0);
      } else {
        timeoutId = window.setTimeout(() => {
          if (!disposed) rafId = window.requestAnimationFrame(loop);
        }, 32);
      }
    };

    const loop = () => {
      if (disposed || reducedMotion) return;
      if (isVisible && !document.hidden && ambientRef.current) {
        const elapsed = (performance.now() - startTime) * 0.001;
        updateWave(elapsed);
        renderer?.render(scene, camera);
        incrementCanvasFrame('wave-grid');
      }
      afterDraw();
    };

    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      observer.disconnect();
      ro.disconnect();
      domCanvas.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      window.removeEventListener('touchstart', onTouchUpdate);
      window.removeEventListener('touchmove', onTouchUpdate);
      window.removeEventListener('resize', onResize);

      geometry.dispose();
      wireMaterial.dispose();
      pointsMaterial.dispose();
      scene.remove(waveMesh);
      scene.remove(wavePoints);
      renderer?.dispose();
      if (domCanvas.parentNode === container) {
        container.removeChild(domCanvas);
      }
    };
  }, [amplitude, fallback, inProximity, isCompactMobile, reducedMotion, segments, theme]);

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className={cn('pointer-events-none opacity-25', className)}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(40,148,204,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(40,148,204,0.18) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none select-none overflow-hidden', className)}
    />
  );
}

