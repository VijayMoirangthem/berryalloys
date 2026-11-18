import { RefObject, useEffect } from 'react';

/**
 * Touch & compact-viewport metric enhancer.
 * Intentionally avoids global scrubbed image scaling/parallax (which degrades touch scroll frame rates
 * and fights dedicated image reveals) and gently counts up clean numeric metrics when revealed.
 */
export function useMobileMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches) return;

    const cleanups: Array<() => void> = [];
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-countup]'));

    targets.forEach((el) => {
      const original = el.textContent ?? '';
      // Match clean leading number only (e.g. "120+", "93.43 acres", "25+ yrs") — skip compounds like "2 × 10 MVA" or "24×7"
      const m = original.trim().match(/^(\d[\d,]*(?:\.\d+)?)([^\d×xX].*|\+|%)$/);
      if (!m) return;

      const [, numStr, suffix] = m;
      const target = parseFloat(numStr.replace(/,/g, ''));
      if (!Number.isFinite(target) || target <= 1) return;

      const hasComma = numStr.includes(',');
      const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
      const fmt = (v: number) =>
        hasComma ? v.toLocaleString('en-US', { maximumFractionDigits: decimals }) : v.toFixed(decimals);

      let started = false;
      let rafId = 0;

      const io = new IntersectionObserver(
        (entries) => {
          if (started || !entries.some((e) => e.isIntersecting)) return;
          started = true;
          io.disconnect();

          const start = performance.now();
          const duration = 620;
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = p >= 1 ? original : `${fmt(target * eased)}${suffix}`;
            if (p < 1) {
              rafId = window.requestAnimationFrame(tick);
            }
          };
          rafId = window.requestAnimationFrame(tick);
        },
        { threshold: 0.25 }
      );

      io.observe(el);
      cleanups.push(() => {
        io.disconnect();
        if (rafId) window.cancelAnimationFrame(rafId);
        el.textContent = original;
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [rootRef]);
}
