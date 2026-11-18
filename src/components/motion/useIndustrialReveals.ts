import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function findSectionChapterEyebrow(section: HTMLElement): HTMLElement | null {
  const explicit = section.querySelector<HTMLElement>('[data-chapter-eyebrow]');
  if (explicit) return explicit;
  const candidates = Array.from(section.querySelectorAll<HTMLElement>('p.font-mono-tabular'));
  return candidates.find((el) => /^\d{2}\s*\//.test((el.textContent ?? '').trim())) ?? null;
}

/**
 * Scroll-triggered storytelling layer for long pages.
 * - Desktop (1024px+): full GSAP ScrollTrigger choreography for chapter eyebrows, headings, and card grids.
 * - Mobile & Tablet (< 1024px): crisp native IntersectionObserver compositor transitions (220ms) that NEVER hide
 *   elements at opacity: 0 on long pages or anchor jumps, and never wobble 1-column cards horizontally.
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

    if (!isDesktop) {
      // Mobile / Tablet: crisp GPU reveal on scroll with passive scroll fallback so headings never stall on iOS WebKit
      const observers: IntersectionObserver[] = [];
      const scrollHandlers: Array<() => void> = [];

      sections.forEach((section) => {
        const eyebrow = findSectionChapterEyebrow(section);
        if (eyebrow) {
          eyebrow.classList.add('reveal-eyebrow');
        }

        const heading = section.querySelector<HTMLElement>('h2:not(.sr-only)');
        if (heading && !heading.querySelector('.sr-word')) {
          const alreadyInView = heading.getBoundingClientRect().top <= window.innerHeight * 0.94;
          if (!alreadyInView) {
            heading.style.opacity = '0.3';
            heading.style.transform = 'translate3d(0, 16px, 0)';
            heading.style.transition = 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 340ms ease';

            let revealed = false;
            const reveal = () => {
              if (revealed) return;
              revealed = true;
              heading.style.opacity = '1';
              heading.style.transform = 'translate3d(0, 0, 0)';
              io.disconnect();
              window.removeEventListener('scroll', onScroll);
            };
            const onScroll = () => {
              if (heading.getBoundingClientRect().top <= window.innerHeight * 0.94) reveal();
            };
            const io = new IntersectionObserver(
              (entries) => {
                if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight * 0.94)) {
                  reveal();
                }
              },
              { rootMargin: '60px 0px', threshold: 0.01 }
            );
            io.observe(heading);
            window.addEventListener('scroll', onScroll, { passive: true });
            observers.push(io);
            scrollHandlers.push(() => {
              window.removeEventListener('scroll', onScroll);
              heading.style.opacity = '';
              heading.style.transform = '';
              heading.style.transition = '';
            });
          }
        }
      });

      return () => {
        observers.forEach((io) => io.disconnect());
        scrollHandlers.forEach((fn) => fn());
        root.querySelectorAll('.reveal-eyebrow').forEach((n) => n.classList.remove('reveal-eyebrow'));
      };
    }

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
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: eyebrow, start: 'top 88%', once: true, invalidateOnRefresh: true },
            }
          );
          gsap.fromTo(
            eyebrow,
            { opacity: 0.25, x: -14 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: eyebrow, start: 'top 88%', once: true, invalidateOnRefresh: true },
            }
          );
        }

        if (heading && !heading.querySelector('.sr-word')) {
          gsap.fromTo(
            heading,
            { opacity: 0.25, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: heading, start: 'top 86%', once: true, invalidateOnRefresh: true },
            }
          );
        }

        const containers = section.querySelectorAll<HTMLElement>(
          ':scope > div > .grid, :scope > div > div > .grid, :scope > div > ul, :scope > div > ol'
        );
        containers.forEach((container) => {
          const items = Array.from(container.children).filter(
            (c): c is HTMLElement => c instanceof HTMLElement && !c.hasAttribute('data-no-reveal') && c.offsetHeight < 900
          );
          if (items.length < 2 || items.length > 16) return;
          gsap.fromTo(
            items,
            { opacity: 0.25, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              stagger: 0.08,
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: container, start: 'top 85%', once: true, invalidateOnRefresh: true },
            }
          );
        });
      });
    }, root);

    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 350);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ctx.revert();
      root.querySelectorAll('.reveal-eyebrow').forEach((n) => n.classList.remove('reveal-eyebrow'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef]);
}
