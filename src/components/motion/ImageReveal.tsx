import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onLoaderCleared } from '../../lib/motionDiagnostics';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}

/**
 * ImageReveal — Scroll-linked editorial image curtain wipe + subtle photographic settle.
 * Uses GSAP ScrollTrigger with clearProps and viewport sweep failsafe across mobile & desktop.
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
    let clipTween: gsap.core.Tween | null = null;
    let scaleTween: gsap.core.Tween | null = null;

    const ensurePlayed = () => {
      if (frame.getBoundingClientRect().top <= window.innerHeight * 0.96) {
        if (clipTween && clipTween.progress() === 0) clipTween.play();
        if (scaleTween && scaleTween.progress() === 0) scaleTween.play();
      }
    };

    const ctx = gsap.context(() => {
      clipTween = gsap.fromTo(
        frame,
        { clipPath: fromClip, opacity: 0.7 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: isCompact ? 0.8 : 1.18,
          ease: 'power3.out',
          clearProps: 'clipPath,opacity',
          scrollTrigger: {
            trigger: frame,
            start: isCompact ? 'top 95%' : 'top 86%',
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );

      scaleTween = gsap.fromTo(
        inner,
        { scale: 1.07 },
        {
          scale: 1,
          duration: isCompact ? 0.95 : 1.4,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: frame,
            start: isCompact ? 'top 95%' : 'top 86%',
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, frameRef);

    const onScroll = () => ensurePlayed();
    window.addEventListener('scroll', onScroll, { passive: true });
    const unsub = onLoaderCleared(() => {
      ScrollTrigger.refresh();
      ensurePlayed();
    });

    return () => {
      unsub();
      window.removeEventListener('scroll', onScroll);
      ctx.revert();
    };
  }, [direction]);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
