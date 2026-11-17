import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}

/**
 * ImageReveal — Scroll-linked editorial image curtain wipe + subtle photographic settle.
 * Immediately displays full frame under prefers-reduced-motion.
 */
export function ImageReveal({
  children,
  className = '',
  direction = 'up',
}: ImageRevealProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !frameRef.current || !innerRef.current) return;

    const fromClip =
      direction === 'left'
        ? 'inset(0% 100% 0% 0%)'
        : direction === 'right'
        ? 'inset(0% 0% 0% 100%)'
        : 'inset(14% 0% 0% 0%)';

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { clipPath: fromClip, opacity: 0.72 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.18,
          ease: 'power3.out',
          clearProps: 'clipPath,opacity',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        innerRef.current,
        { scale: 1.07 },
        {
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );
    }, frameRef);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
