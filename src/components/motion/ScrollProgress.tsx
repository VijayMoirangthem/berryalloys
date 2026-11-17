import { useEffect, useRef } from 'react';

/**
 * Reading-progress bar pinned to the top of the viewport. Transform-only, rAF-throttled, passive listener.
 * Blue -> light blue -> red accent: the head of the bar is the red accent.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = bar.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand via-[#69C5F5] to-accent-red will-change-transform" />
    </div>
  );
}
