import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * ScrollReveal — Adapted from React Bits (https://reactbits.dev, open-source text reveal pattern).
 * Animates editorial statements word-by-word across all viewports without blur
 * so contrast stays sharp and iOS WebKit never stalls mid-transition.
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

    const ctx = gsap.context(() => {
      const wordEls = container.querySelectorAll('.sr-word');
      if (!wordEls || wordEls.length === 0) return;

      gsap.fromTo(
        wordEls,
        { opacity: 0.25, y: isCompact ? 10 : 8 },
        {
          opacity: 1,
          y: 0,
          stagger: isCompact ? 0.032 : 0.048,
          duration: isCompact ? 0.56 : 0.78,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: container,
            start: isCompact ? 'top 93%' : 'top 84%',
            once: true,
            invalidateOnRefresh: true,
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
