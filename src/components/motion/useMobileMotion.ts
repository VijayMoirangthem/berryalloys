import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll- and touch-driven motion for phones and tablets (narrow viewports or coarse pointers).
 * Desktop already has hover and pointer effects; touch screens have neither, so this layer supplies equivalent life:
 *  - scrubbed photographic parallax (transform only, clipped by the image's own frame),
 *  - count-up for numeric metrics marked with data-countup.
 * Everything is skipped under prefers-reduced-motion, and nothing hides content if it fails to run.
 */
const SKIP =
  '[data-no-parallax], .logo-slider, [aria-label^="Steel producers"], #plant-gallery, #presence, #overview, #complex-hero, header, nav, [role="dialog"]';

export function useMobileMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mm = gsap.matchMedia();
    mm.add('(max-width: 1023px), (pointer: coarse)', () => {
      const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img')).filter((img) => {
        if (img.closest(SKIP) || img.className.includes('object-contain') || img.width < 2) return false;
        const frame = img.closest<HTMLElement>('[class*="overflow-hidden"]');
        return !!frame && frame.contains(img) && frame.clientHeight >= 120;
      });
      imgs.forEach((img) => {
        const frame = img.closest<HTMLElement>('[class*="overflow-hidden"]')!;
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.13 },
          {
            yPercent: 6,
            scale: 1.13,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          }
        );
      });

      root.querySelectorAll<HTMLElement>('[data-countup]').forEach((el) => {
        const m = el.textContent?.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/s);
        if (!m) return;
        const [, pre, num, post] = m;
        const target = parseFloat(num.replace(/,/g, ''));
        if (!Number.isFinite(target) || target <= 0) return;
        const hasComma = num.includes(',');
        const decimals = num.includes('.') ? num.split('.')[1].length : 0;
        const fmt = (v: number) => (hasComma ? v.toLocaleString('en-US', { maximumFractionDigits: decimals }) : v.toFixed(decimals));
        const state = { v: 0 };
        el.textContent = `${pre}${fmt(0)}${post}`;
        gsap.to(state, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${pre}${fmt(state.v)}${post}`;
          },
          onComplete: () => {
            el.textContent = `${pre}${num}${post}`;
          },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      // Layout shifts as images decode; keep trigger positions honest.
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 1400);
      return () => window.clearTimeout(t);
    });

    return () => mm.revert();
  }, [rootRef]);
}
