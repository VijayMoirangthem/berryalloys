import { RefObject, useEffect } from 'react';
import { onLoaderCleared, setMotionInitStatus } from '../../lib/motionDiagnostics';

/**
 * Touch & compact-viewport metric enhancer.
 * Counts up numeric metrics smoothly once visible (and after initial splash curtain clears),
 * with an IntersectionObserver + passive scroll safety check so fast iPhone swipes never miss it.
 */
export function useMobileMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotionInitStatus('mobileCountups', 'skipped-reduced-motion');
      return;
    }
    if (!window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches) {
      setMotionInitStatus('mobileCountups', 'skipped-desktop');
      return;
    }

    setMotionInitStatus('mobileCountups', 'active');
    const cleanups: Array<() => void> = [];
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-countup]'));

    targets.forEach((el) => {
      const original = (el.textContent ?? '').trim();
      // Match clean leading number (e.g. "120+", "93.43 acres", "25+ yrs", "83 MW Solar...")
      const m = original.match(/^(\d[\d,]*(?:\.\d+)?)([^\d×xX].*|\+|%)$/);
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
      let unsubLoader: (() => void) | null = null;

      const startAnimation = () => {
        if (started) return;
        started = true;
        io.disconnect();
        window.removeEventListener('scroll', onScroll);

        const start = performance.now();
        const duration = 680;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = p >= 1 ? original : `${fmt(target * eased)}${suffix}`;
          if (p < 1) {
            rafId = window.requestAnimationFrame(tick);
          }
        };
        rafId = window.requestAnimationFrame(tick);
      };

      const runCount = () => {
        if (started || unsubLoader) return;
        unsubLoader = onLoaderCleared(() => {
          unsubLoader = null;
          startAnimation();
        });
      };

      const inViewport = () => {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.96 && rect.bottom >= 0;
      };

      const onScroll = () => {
        if (!started && inViewport()) runCount();
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (!started && entries.some((e) => e.isIntersecting)) {
            runCount();
          }
        },
        { threshold: 0.1, rootMargin: '40px 0px' }
      );

      io.observe(el);
      window.addEventListener('scroll', onScroll, { passive: true });
      if (inViewport()) runCount();

      cleanups.push(() => {
        io.disconnect();
        window.removeEventListener('scroll', onScroll);
        unsubLoader?.();
        if (rafId) window.cancelAnimationFrame(rafId);
        el.textContent = original;
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [rootRef]);
}
