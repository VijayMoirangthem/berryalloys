import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal — Adapted from React Bits (https://reactbits.dev, open-source text reveal pattern).
 * Animates editorial statements word-by-word without blur so contrast stays sharp at every scroll position.
 */
interface ScrollRevealProps {
  id?: string;
  text: string;
  as?: 'h2' | 'h3' | 'p';
  className?: string;
}

export function ScrollReveal({
  id,
  text,
  as: Tag = 'h2',
  className = '',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    if (prefersReduced || !container) return;

    const isCompact = window.matchMedia('(max-width: 767px)').matches;
    if (isCompact) {
      const wordEls = Array.from(container.querySelectorAll<HTMLElement>('.sr-word'));
      if (wordEls.length === 0) return;

      wordEls.forEach((el, idx) => {
        el.style.opacity = '0.28';
        el.style.transform = 'translate3d(0, 8px, 0)';
        el.style.transition = `opacity 380ms cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(idx * 24, 340)}ms, transform 420ms cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(idx * 24, 340)}ms`;
      });

      let revealed = false;
      const hasEnteredOrPassed = () => container.getBoundingClientRect().top <= window.innerHeight * 0.94;

      const reveal = () => {
        if (revealed) return;
        revealed = true;
        wordEls.forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'translate3d(0, 0, 0)';
        });
        io.disconnect();
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
      };

      const onScrollOrResize = () => {
        if (hasEnteredOrPassed()) reveal();
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight * 0.94)) {
            reveal();
          }
        },
        { threshold: 0.08, rootMargin: '40px 0px' }
      );
      io.observe(container);
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });

      let raf1 = 0;
      let raf2 = 0;
      raf1 = window.requestAnimationFrame(() => {
        raf2 = window.requestAnimationFrame(() => {
          if (hasEnteredOrPassed()) reveal();
        });
      });

      return () => {
        window.cancelAnimationFrame(raf1);
        window.cancelAnimationFrame(raf2);
        io.disconnect();
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        wordEls.forEach((el) => {
          el.style.opacity = '';
          el.style.transform = '';
          el.style.transition = '';
        });
      };
    }

    const ctx = gsap.context(() => {
      const wordEls = container.querySelectorAll('.sr-word');
      if (!wordEls || wordEls.length === 0) return;

      gsap.fromTo(
        wordEls,
        { opacity: 0.25, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.048,
          duration: 0.78,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: container,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Tag
      id={id}
      ref={containerRef as React.RefObject<never>}
      className={className}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true">
          <span className="sr-word inline-block">{word}</span>
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
