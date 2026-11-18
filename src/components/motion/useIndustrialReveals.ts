import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

function findSectionChapterEyebrow(section: HTMLElement): HTMLElement | null {
  const explicit = section.querySelector<HTMLElement>('[data-chapter-eyebrow]');
  if (explicit) return explicit;
  const candidates = Array.from(section.querySelectorAll<HTMLElement>('p.font-mono-tabular'));
  return candidates.find((el) => /^\d{2}\s*\//.test((el.textContent ?? '').trim())) ?? null;
}

/**
 * Scroll-triggered storytelling layer across Desktop, Tablet, and Mobile.
 * Uses GPU-composited GSAP ScrollTrigger tweens with `ignoreMobileResize: true`
 * and clearProps so iPhone Chrome / WebKit renders smooth eyebrow rule draws,
 * headings, and staggered grid/list entrances without stalling.
 */
export function useIndustrialReveals(rootRef: RefObject<HTMLElement | null>, skip: string[] = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>('section[id]')).filter(
      (s) => !skip.includes(s.id)
    );

    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const triggerStart = isDesktop ? 'top 86%' : 'top 93%';

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const eyebrow = findSectionChapterEyebrow(section);
        const heading = section.querySelector<HTMLElement>('h2:not(.sr-only)');

        if (eyebrow) {
          eyebrow.classList.add('reveal-eyebrow');
          gsap.fromTo(
            eyebrow,
            { '--rule': 0 },
            {
              '--rule': 1,
              duration: isDesktop ? 0.7 : 0.56,
              ease: 'power3.out',
              scrollTrigger: { trigger: eyebrow, start: triggerStart, once: true, invalidateOnRefresh: true },
            }
          );
          gsap.fromTo(
            eyebrow,
            { opacity: 0.25, x: isDesktop ? -14 : -10 },
            {
              opacity: 1,
              x: 0,
              duration: isDesktop ? 0.6 : 0.48,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: eyebrow, start: triggerStart, once: true, invalidateOnRefresh: true },
            }
          );
        }

        if (heading && !heading.querySelector('.sr-word') && !heading.querySelector('.split-word-inner')) {
          gsap.fromTo(
            heading,
            { opacity: 0.25, y: isDesktop ? 24 : 16 },
            {
              opacity: 1,
              y: 0,
              duration: isDesktop ? 0.8 : 0.58,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: heading, start: triggerStart, once: true, invalidateOnRefresh: true },
            }
          );
        }

        const containers = section.querySelectorAll<HTMLElement>(
          ':scope > div > .grid, :scope > div > div > .grid, :scope > div > ul, :scope > div > ol'
        );
        containers.forEach((container) => {
          const items = Array.from(container.children).filter(
            (c): c is HTMLElement => c instanceof HTMLElement && !c.hasAttribute('data-no-reveal') && c.offsetHeight < 950
          );
          if (items.length < 2 || items.length > 16) return;
          gsap.fromTo(
            items,
            { opacity: 0.28, y: isDesktop ? 26 : 16 },
            {
              opacity: 1,
              y: 0,
              duration: isDesktop ? 0.7 : 0.52,
              ease: 'power2.out',
              stagger: isDesktop ? 0.08 : 0.055,
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: container, start: isDesktop ? 'top 85%' : 'top 93%', once: true, invalidateOnRefresh: true },
            }
          );
        });
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 350);
    const t2 = window.setTimeout(refresh, 1150);
    document.fonts?.ready?.then(refresh);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ctx.revert();
      root.querySelectorAll('.reveal-eyebrow').forEach((n) => n.classList.remove('reveal-eyebrow'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef]);
}
