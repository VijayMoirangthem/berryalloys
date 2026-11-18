import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * SplitText — Adapted from React Bits (https://reactbits.dev, MIT-style open-source component pattern).
 * Customized for Barlow Condensed editorial headlines across desktop and mobile
 * with React 19 StrictMode / prefers-reduced-motion safety.
 */
interface SplitTextProps {
  id?: string;
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  triggerOnScroll?: boolean;
  delay?: number;
}

export function SplitText({
  id,
  text,
  as: Tag = 'h1',
  className = '',
  triggerOnScroll = false,
  delay = 0,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const isCompact = window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      const targets = containerRef.current?.querySelectorAll('.split-word-inner');
      if (!targets || targets.length === 0) return;

      gsap.fromTo(
        targets,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: isCompact ? 0.72 : 0.98,
          stagger: isCompact ? 0.045 : 0.06,
          delay,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          ...(triggerOnScroll
            ? {
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: isCompact ? 'top 93%' : 'top 86%',
                  once: true,
                  invalidateOnRefresh: true,
                },
              }
            : {}),
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, triggerOnScroll]);

  return (
    <Tag
      id={id}
      ref={containerRef as React.RefObject<never>}
      className={className}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden="true">
          <span className="inline-block overflow-hidden align-bottom">
            <span className="split-word-inner inline-block">
              {word}
            </span>
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
