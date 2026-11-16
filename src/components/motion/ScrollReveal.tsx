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
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const wordEls = containerRef.current?.querySelectorAll('.sr-word');
      if (!wordEls || wordEls.length === 0) return;

      gsap.fromTo(
        wordEls,
        { opacity: 0.25, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: containerRef.current,
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
