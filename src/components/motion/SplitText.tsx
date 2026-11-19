import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onLoaderCleared } from '../../lib/motionDiagnostics';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * SplitText — Adapted from React Bits (https://reactbits.dev, MIT-style open-source component pattern).
 * Customized for Barlow Condensed editorial headlines across desktop and mobile
 * with React 19 StrictMode, loader-sync, and prefers-reduced-motion safety.
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
    const el = containerRef.current;
    if (prefersReduced || !el) return;

    const isCompact = window.matchMedia('(max-width: 767px)').matches;
    let tween: gsap.core.Tween | null = null;

    const ensurePlayed = () => {
      if (!tween || tween.progress() > 0 || !triggerOnScroll) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.96) {
        tween.play();
      }
    };

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll('.split-word-inner');
      if (!targets || targets.length === 0) return;

      tween = gsap.fromTo(
        targets,
        { yPercent: 105, opacity: 0.15 },
        {
          yPercent: 0,
          opacity: 1,
          duration: isCompact ? 0.64 : 0.98,
          stagger: isCompact ? 0.04 : 0.06,
          delay,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          ...(triggerOnScroll
            ? {
                scrollTrigger: {
                  trigger: el,
                  start: isCompact ? 'top 95%' : 'top 86%',
                  once: true,
                  invalidateOnRefresh: true,
                },
              }
            : {}),
        }
      );
    }, containerRef);

    const onScroll = () => ensurePlayed();
    window.addEventListener('scroll', onScroll, { passive: true });
    const unsubLoader = onLoaderCleared(() => {
      ScrollTrigger.refresh();
      ensurePlayed();
    });

    return () => {
      unsubLoader();
      window.removeEventListener('scroll', onScroll);
      ctx.revert();
    };
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
