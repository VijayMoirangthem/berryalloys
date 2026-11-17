import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered storytelling layer for long pages.
 *
 * - Section eyebrows slide in and draw a short red hairline (the controlled red accent).
 * - Section headings rise into place.
 * - Card grids and lists stagger in once, in reading order.
 *
 * Everything is `once` (nothing replays on scroll-back), skipped under prefers-reduced-motion, and the
 * content is already visible in the DOM before this runs, so a failed animation never hides text.
 * Sections listed in `skip` are left alone (they run their own pinned timelines).
 */
export function useIndustrialReveals(rootRef: RefObject<HTMLElement | null>, skip: string[] = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const sections = Array.from(root.querySelectorAll<HTMLElement>('section[id]')).filter(
        (s) => !skip.includes(s.id)
      );

      sections.forEach((section) => {
        const eyebrow = section.querySelector<HTMLElement>('p.font-mono-tabular');
        const heading = section.querySelector<HTMLElement>('h2:not(.sr-only)');

        if (eyebrow) {
          // Short red hairline drawn by a CSS ::after (see .reveal-eyebrow) — no DOM is injected into React's tree.
          eyebrow.classList.add('reveal-eyebrow');
          gsap.fromTo(
            eyebrow,
            { '--rule': 0 },
            {
              '--rule': 1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: eyebrow, start: 'top 88%', once: true },
            }
          );
          gsap.from(eyebrow, {
            opacity: 0,
            x: -14,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: eyebrow, start: 'top 88%', once: true },
          });
        }

        if (heading && !heading.querySelector('.sr-word')) {
          gsap.from(heading, {
            opacity: 0,
            y: 26,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: heading, start: 'top 86%', once: true },
          });
        }

        // Direct children of grid/list containers stagger in together.
        const containers = section.querySelectorAll<HTMLElement>(':scope > div > .grid, :scope > div > div > .grid, :scope > div > ul, :scope > div > ol');
        containers.forEach((container) => {
          const items = Array.from(container.children).filter(
            (c): c is HTMLElement => c instanceof HTMLElement && !c.hasAttribute('data-no-reveal') && c.offsetHeight < 900
          );
          if (items.length < 2 || items.length > 16) return;
          // On narrow screens cards alternate in from the left and right, so a single column still feels choreographed.
          const narrow = window.innerWidth < 1024;
          gsap.from(items, {
            opacity: 0,
            y: 28,
            x: narrow ? (i: number) => (i % 2 === 0 ? -26 : 26) : 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.08,
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: container, start: 'top 85%', once: true },
          });
        });
      });
    }, root);

    // Images and lazy content change heights after mount; keep trigger positions honest.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
      root.querySelectorAll('.reveal-eyebrow').forEach((n) => n.classList.remove('reveal-eyebrow'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef]);
}
