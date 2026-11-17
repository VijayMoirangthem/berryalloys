import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface WaveGridBackgroundProps {
  className?: string;
  /** Wave amplitude multiplier */
  amplitude?: number;
  /** Grid density across width */
  segments?: number;
}

/**
 * WaveGridBackground — Three.js interactive 3D topographic wave lattice
 * adapted from VengeanceUI WaveGridBackground for Berry Alloys industrial backdrops.
 * Follows WebGL lifecycle hygiene: isSoftwareGl probe, IntersectionObserver visibility pause,
 * reduced-motion static frame, and deterministic GPU resource disposal on unmount.
 */
export function WaveGridBackground({
  className,
  amplitude = 0.72,
  segments = 42,
}: WaveGridBackgroundProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDark = theme === 'dark';

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
    const isSoftwareGl = /(swiftshader|llvmpipe|software)/i.test(rendererStr);

    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    const domCanvas = renderer.domElement;
    domCanvas.style.width = '100%';
    domCanvas.style.height = '100%';
    domCanvas.style.display = 'block';
    container.appendChild(domCanvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 4.6, 8.2);
    camera.lookAt(0, -0.5, 0);

    const segs = isSoftwareGl ? Math.min(26, segments) : segments;
    const planeWidth = 22;
    const planeDepth = 14;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeDepth, segs, Math.round(segs * 0.72));
    geometry.rotateX(-Math.PI / 2);

    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const baseY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      baseY[i] = posAttr.getY(i);
    }

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xec743c : 0x9e4b28,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.24 : 0.16,
    });
    const waveMesh = new THREE.Mesh(geometry, wireMaterial);
    waveMesh.position.y = -0.6;
    scene.add(waveMesh);

    const pointsMaterial = new THREE.PointsMaterial({
      color: isDark ? 0xf3f0e9 : 0x141618,
      size: 0.055,
      transparent: true,
      opacity: isDark ? 0.36 : 0.22,
    });
    const wavePoints = new THREE.Points(geometry, pointsMaterial);
    wavePoints.position.y = -0.59;
    scene.add(wavePoints);

    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);

    const onPointerMove = (e: PointerEvent) => {
      if (prefersReduced) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
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
    };
    window.addEventListener('resize', onResize);

    const updateWave = (t: number) => {
      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.05;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.05;

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);

        const ridgeA = Math.sin(x * 0.45 + t * 0.85) * Math.cos(z * 0.52 + t * 0.65);
        const ridgeB = Math.sin((x + z) * 0.32 - t * 0.55) * 0.48;
        const dx = x - smoothPointer.x * 7.5;
        const dz = z - smoothPointer.y * 4.5;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const cursorRipple = Math.exp(-dist * 0.24) * Math.cos(dist * 1.1 - t * 2.2) * 0.65;

        posAttr.setY(i, baseY[i] + (ridgeA + ridgeB) * amplitude + cursorRipple);
      }
      posAttr.needsUpdate = true;
    };

    // Always render initial crisp frame
    updateWave(0.8);
    renderer.render(scene, camera);

    let rafId = 0;
    let timeoutId = 0;
    let disposed = false;
    const startTime = performance.now();

    const loop = () => {
      if (disposed || prefersReduced) return;
      if (isVisible && !document.hidden) {
        const elapsed = (performance.now() - startTime) * 0.001;
        updateWave(elapsed);
        renderer?.render(scene, camera);
      }
      if (isSoftwareGl) {
        timeoutId = window.setTimeout(() => {
          if (!disposed) rafId = window.requestAnimationFrame(loop);
        }, 65);
      } else {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    if (!prefersReduced) {
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
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
  }, [amplitude, segments, theme]);

  if (fallback) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none opacity-25',
          className
        )}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(236,116,60,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(236,116,60,0.18) 1px, transparent 1px)',
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
