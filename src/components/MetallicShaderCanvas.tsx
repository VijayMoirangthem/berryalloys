import { useEffect, useRef, useState } from 'react';

/**
 * MetallicShaderCanvas — Self-contained WebGL fragment shader rendering a brushed-graphite
 * and warm-copper thermal sheen (concept inspired by shaders.com).
 * Tracks gentle pointer specular reflection, pauses when offscreen or tab-hidden,
 * freezes animation under prefers-reduced-motion, and degrades cleanly to CSS if WebGL fails.
 */
export function MetallicShaderCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
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

        // Brushed metallic directional anisotropy along horizontal rolling axis
        float grain = noise(vec2(uv.x * 7.0 + t * 0.35, uv.y * 110.0));
        float fineStreak = noise(vec2(uv.x * 22.0 - t * 0.2, uv.y * 180.0));
        float wave = sin(uv.x * 3.4 + uv.y * 2.1 - t) * 0.5 + 0.5;
        float sheen = smoothstep(0.26, 0.86, wave * 0.6 + grain * 0.28 + fineStreak * 0.12);

        vec3 graphite = vec3(0.075, 0.082, 0.090);   // #131517
        vec3 steel    = vec3(0.145, 0.160, 0.180);   // #25292E
        vec3 copper   = vec3(0.663, 0.337, 0.196);   // #A95632
        vec3 ember    = vec3(0.925, 0.455, 0.235);   // #EC743C

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
    if (!vs || !fs) {
      setFallbackMode(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setFallbackMode(true);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
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

    const onPointerMove = (e: PointerEvent) => {
      if (prefersReduced) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseTarget.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / Math.max(1, rect.width)));
        mouseTarget.y = Math.min(
          1,
          Math.max(0, 1 - (e.clientY - rect.top) / Math.max(1, rect.height))
        );
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    let isVisible = true;
    let isTabActive = !document.hidden;
    let rafId = 0;
    const startTime = performance.now();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const drawFrame = (now: number) => {
      if (isVisible && isTabActive) {
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, prefersReduced ? 0.0 : (now - startTime) * 0.001);
        gl.uniform2f(mouseLoc, mouseCurrent.x, mouseCurrent.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (!prefersReduced) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    rafId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  if (fallbackMode) {
    return (
      <div
        aria-hidden="true"
        className={`bg-[radial-gradient(ellipse_at_top_right,rgba(169,86,50,0.28),#141618_62%)] ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block w-full h-full ${className}`}
    />
  );
}
