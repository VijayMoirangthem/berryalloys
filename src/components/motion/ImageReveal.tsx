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
    if (isCompact) {
      inner.style.clipPath = fromClip;
      inner.style.opacity = '0.68';
      inner.style.transform = 'scale(1.07)';
      inner.style.transition =
        'clip-path 780ms cubic-bezier(0.22, 1, 0.36, 1), opacity 620ms ease, transform 980ms cubic-bezier(0.22, 1, 0.36, 1)';

      let revealed = false;
      const hasEnteredOrPassed = () => frame.getBoundingClientRect().top <= window.innerHeight * 0.94;

      const reveal = () => {
        if (revealed) return;
        revealed = true;
        inner.style.clipPath = 'inset(0% 0% 0% 0%)';
        inner.style.opacity = '1';
        inner.style.transform = 'scale(1)';
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
        { threshold: 0.05, rootMargin: '60px 0px' }
      );
      io.observe(frame);
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
        inner.style.clipPath = '';
        inner.style.opacity = '';
        inner.style.transform = '';
        inner.style.transition = '';
      };
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { clipPath: fromClip, opacity: 0.72 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.18,
          ease: 'power3.out',
          clearProps: 'clipPath,opacity',
          scrollTrigger: {
            trigger: frame,
            start: 'top 86%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        inner,
        { scale: 1.07 },
        {
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: frame,
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
      <div ref={innerRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
