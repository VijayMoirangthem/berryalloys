import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useIsCompactMobile } from '../../hooks/useIsCompactMobile';

export interface MorphTextProps {
  /** Array of words or short industrial phrases to morph through. */
  words?: string[];
  /** Display interval per phrase in milliseconds. */
  interval?: number;
  /** Optional subtext below the morphing phrase. */
  subtext?: string;
  /** Fluid CSS font-size expression. */
  fontSize?: string;
  /** CSS font-family stack (defaults to project Barlow Condensed display font). */
  fontFamily?: string;
  /** Left or center alignment. */
  align?: 'left' | 'center';
  className?: string;
  textClassName?: string;
  subtextClassName?: string;
}

/**
 * MorphText — SVG threshold gooey morphing word rotator on desktop, and crisp blur-free
 * compositor crossfade on mobile screens so display lines never vanish mid-transition.
 */
export function MorphText({
  words = ['HEAT TO PRECISION', 'FERRO MANGANESE', 'SILICO MANGANESE', 'FERRO CHROME', 'FERRO SILICON'],
  interval = 2800,
  subtext,
  fontSize = 'clamp(1.75rem, 3.8vw, 3.25rem)',
  fontFamily = 'var(--font-display), "Barlow Condensed", sans-serif',
  align = 'left',
  className,
  textClassName,
  subtextClassName,
}: MorphTextProps) {
  const uid = useId().replace(/:/g, '');
  const filterId = `morph-threshold-${uid}`;
  const animName = `morph-word-rotate-${uid}`;
  const isCompactMobile = useIsCompactMobile(767);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isCompactMobile || reducedMotion || words.length <= 1) return;
    const id = window.setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, isCompactMobile, reducedMotion, words.length]);

  const wordDuration = interval / 1000;
  const totalDuration = wordDuration * words.length;

  if (reducedMotion) {
    return (
      <div
        className={cn(
          'relative flex flex-col',
          align === 'center' ? 'items-center text-center' : 'items-start text-left',
          className
        )}
      >
        <div
          className={cn('font-bold uppercase tracking-tight leading-none select-none', textClassName)}
          style={{ fontSize, fontFamily }}
        >
          {words[0]}
        </div>
        {subtext && (
          <p className={cn('mt-2 uppercase tracking-[0.2em] text-xs', subtextClassName)} style={{ fontFamily }}>
            {subtext}
          </p>
        )}
      </div>
    );
  }

  if (isCompactMobile) {
    const currentWord = words[mobileIndex] ?? words[0];
    return (
      <div
        className={cn(
          'relative flex flex-col w-full max-w-full',
          align === 'center' ? 'items-center text-center' : 'items-start text-left',
          className
        )}
      >
        <div
          className="min-h-[1.25em] flex items-center overflow-hidden"
          style={{
            fontSize,
            fontFamily,
            perspective: '900px',
            WebkitPerspective: '900px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, rotateX: -72, y: 12 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: 72, y: -12 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
              }}
              className={cn('font-bold uppercase tracking-[0.02em] leading-none block will-change-transform', textClassName)}
            >
              {currentWord}
            </motion.span>
          </AnimatePresence>
        </div>
        {subtext && (
          <p
            className={cn(
              'mt-2 uppercase tracking-[0.2em] text-xs text-[#B5C5D7]',
              subtextClassName
            )}
          >
            {subtext}
          </p>
        )}
      </div>
    );
  }

  // Compute opacity/blur windows so consecutive words smoothly cross-dissolve inside the threshold filter
  const slotPct = 100 / Math.max(1, words.length);
  const fadeInEnd = (slotPct * 0.28).toFixed(2);
  const holdEnd = (slotPct * 0.72).toFixed(2);
  const fadeOutEnd = (slotPct * 1.05).toFixed(2);

  return (
    <div
      className={cn(
        'morph-text-root relative flex flex-col w-full max-w-full overflow-hidden',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className={cn(
          'morph-text-container relative select-none w-full leading-none',
          textClassName
        )}
        style={{
          fontSize,
          fontWeight: 700,
          filter: `url(#${filterId})`,
          fontFamily,
        }}
      >
        <div
          className={cn(
            'relative flex items-center w-full',
            align === 'center' ? 'justify-center' : 'justify-start'
          )}
          style={{ height: '1.15em' }}
        >
          <span className="sr-only">{words.join(' · ')}</span>
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              aria-hidden="true"
              className="absolute whitespace-nowrap uppercase tracking-[0.02em]"
              style={{
                top: '50%',
                left: align === 'center' ? '50%' : '0%',
                transform: align === 'center' ? 'translate(-50%, -50%)' : 'translate(0%, -50%)',
                opacity: 0,
                animationName: animName,
                animationDuration: `${totalDuration}s`,
                animationDelay: `${i * wordDuration}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationFillMode: 'both',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {subtext && (
        <p
          className={cn(
            'mt-2 uppercase tracking-[0.2em] text-xs text-[#B5C5D7]',
            subtextClassName
          )}
        >
          {subtext}
        </p>
      )}

      <style>{`
        @keyframes ${animName} {
          0% {
            opacity: 0;
            filter: blur(14px);
            transform: ${align === 'center' ? 'translate(-50%, -50%) scale(0.92)' : 'translate(0%, -50%) scale(0.92)'};
          }
          ${fadeInEnd}% {
            opacity: 1;
            filter: blur(0px);
            transform: ${align === 'center' ? 'translate(-50%, -50%) scale(1)' : 'translate(0%, -50%) scale(1)'};
          }
          ${holdEnd}% {
            opacity: 1;
            filter: blur(0px);
            transform: ${align === 'center' ? 'translate(-50%, -50%) scale(1)' : 'translate(0%, -50%) scale(1)'};
          }
          ${fadeOutEnd}%, 100% {
            opacity: 0;
            filter: blur(14px);
            transform: ${align === 'center' ? 'translate(-50%, -50%) scale(1.04)' : 'translate(0%, -50%) scale(1.04)'};
          }
        }
      `}</style>
    </div>
  );
}

export default MorphText;
