import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../context/MotionContext';
import { incrementCanvasFrame, upsertCanvasTelemetry } from '../lib/motionDiagnostics';

/**
 * MetallicShaderCanvas — Self-contained WebGL fragment shader rendering a brushed-graphite
 * and warm-copper thermal sheen. Gates WebGL allocation behind viewport proximity so
 * offscreen sections never exhaust mobile WKWebView WebGL context budgets.
 */
export function MetallicShaderCanvas({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, ambientActive } = useMotion();
  const [fallbackMode, setFallbackMode] = useState(false);
  const [inProximity, setInProximity] = useState(false);
  const ambientRef = useRef(ambientActive);
  ambientRef.current = ambientActive;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        setInProximity(entry.isIntersecting);
      },
      { rootMargin: '420px 0px', threshold: 0.01 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inProximity || fallbackMode) return;
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'pointer-events-none block w-full h-full';
    host.appendChild(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      if (canvas.parentNode === host) host.removeChild(canvas);
      upsertCanvasTelemetry('metallic-shader', { backend: 'fallback-css', contextLost: false });
      setFallbackMode(true);
      return;
    }

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float t = u_time * 0.22;

        float grain = noise(vec2(uv.x * 7.0 + t * 0.35, uv.y * 110.0));
        float fineStreak = noise(vec2(uv.x * 22.0 - t * 0.2, uv.y * 180.0));
        float wave = sin(uv.x * 3.4 + uv.y * 2.1 - t) * 0.5 + 0.5;
        float sheen = smoothstep(0.26, 0.86, wave * 0.6 + grain * 0.28 + fineStreak * 0.12);

        vec3 graphite = vec3(0.075, 0.082, 0.090);
        vec3 steel    = vec3(0.145, 0.160, 0.180);
        vec3 copper   = vec3(0.663, 0.337, 0.196);
        vec3 ember    = vec3(0.925, 0.455, 0.235);

        vec3 col = mix(graphite, steel, grain * 0.6 + fineStreak * 0.2);

        vec2 focusPoint = mix(vec2(0.76, 0.32), u_mouse, 0.35);
        float radialGlow = pow(max(0.0, 1.0 - distance(uv, focusPoint) * 0.92), 2.4);

        col = mix(col, copper, sheen * 0.22 + radialGlow * 0.28);
        col += ember * pow(radialGlow, 3.0) * 0.16;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !program) {
      if (canvas.parentNode === host) host.removeChild(canvas);
      setFallbackMode(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (canvas.parentNode === host) host.removeChild(canvas);
      setFallbackMode(true);
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    const mouseTarget = { x: 0.76, y: 0.32 };
    const mouseCurrent = { x: 0.76, y: 0.32 };

    const updateMouse = (clientX: number, clientY: number) => {
      if (reducedMotion) return;
      const rect = host.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        mouseTarget.x = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(1, rect.width)));
        mouseTarget.y = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / Math.max(1, rect.height)));
      }
    };

    const onPointerMove = (e: PointerEvent) => updateMouse(e.clientX, e.clientY);
    const onTouchUpdate = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateMouse(t.clientX, t.clientY);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onTouchUpdate, { passive: true });
    window.addEventListener('touchmove', onTouchUpdate, { passive: true });

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.floor(rect.width * dpr));
      const h = Math.max(2, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      upsertCanvasTelemetry('metallic-shader', {
        backend: 'webgl',
        contextLost: false,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener('resize', resize);

    let isVisible = true;
    let rafId = 0;
    const startTime = performance.now();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[entries.length - 1]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(host);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      upsertCanvasTelemetry('metallic-shader', { contextLost: true, backend: 'fallback-css' });
      setFallbackMode(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const drawFrame = (now: number) => {
      if (isVisible && !document.hidden && (ambientRef.current || now === startTime)) {
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, reducedMotion || !ambientRef.current ? 0.0 : (now - startTime) * 0.001);
        gl.uniform2f(mouseLoc, mouseCurrent.x, mouseCurrent.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        incrementCanvasFrame('metallic-shader');
      }
      if (!reducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame(startTime);
    if (!reducedMotion) {
      rafId = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchUpdate);
      window.removeEventListener('touchmove', onTouchUpdate);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
  }, [fallbackMode, inProximity, reducedMotion]);

  if (fallbackMode) {
    return (
      <div
        aria-hidden="true"
        className={`bg-[radial-gradient(ellipse_at_top_right,rgba(10,106,161,0.28),#141618_62%)] ${className}`}
      />
    );
  }

  return <div ref={hostRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}

