import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}

/**
 * ImageReveal — Scroll-linked editorial image curtain wipe + subtle photographic settle.
 * Uses GSAP ScrollTrigger with clearProps across mobile & desktop so iPhone WebKit
 * executes every curtain wipe reliably without CSS-transition frame skips.
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
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (prefersReduced || !frame || !inner) return;

    const fromClip =
      direction === 'left'
        ? 'inset(0% 100% 0% 0%)'
        : direction === 'right'
        ? 'inset(0% 0% 0% 100%)'
        : 'inset(14% 0% 0% 0%)';

    const isCompact = window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { clipPath: fromClip, opacity: 0.7 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: isCompact ? 0.85 : 1.18,
          ease: 'power3.out',
          clearProps: 'clipPath,opacity',
          scrollTrigger: {
            trigger: frame,
            start: isCompact ? 'top 93%' : 'top 86%',
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        inner,
        { scale: 1.07 },
        {
          scale: 1,
          duration: isCompact ? 1.0 : 1.4,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: frame,
            start: isCompact ? 'top 93%' : 'top 86%',
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, frameRef);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
