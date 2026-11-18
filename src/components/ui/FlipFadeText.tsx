import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useIsCompactMobile } from '../../hooks/useIsCompactMobile';

export interface FlipFadeTextProps {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  letterDuration?: number;
  staggerDelay?: number;
  exitStaggerDelay?: number;
}

const DEFAULT_WORDS = ['SAFETY', 'INTEGRITY', 'RELIABILITY', 'INNOVATION', 'TEAMWORK', 'SUSTAINABILITY'];

const Letter = memo(function Letter({
  char,
  letterDuration,
  useBlur,
}: {
  char: string;
  letterDuration: number;
  useBlur: boolean;
}) {
  return (
    <motion.span
      style={{ transformStyle: 'preserve-3d' }}
      variants={{
        initial: {
          rotateX: 90,
          y: 12,
          opacity: 0,
          ...(useBlur ? { filter: 'blur(5px)' } : {}),
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          ...(useBlur ? { filter: 'blur(0px)' } : {}),
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -12,
          opacity: 0,
          ...(useBlur ? { filter: 'blur(5px)' } : {}),
          transition: {
            duration: letterDuration * 0.62,
            ease: 'easeIn',
          },
        },
      }}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
});

const Word = memo(function Word({
  text,
  staggerDelay,
  exitStaggerDelay,
  letterDuration,
  textClassName,
  useBlur,
}: {
  text: string;
  staggerDelay: number;
  exitStaggerDelay: number;
  letterDuration: number;
  textClassName?: string;
  useBlur: boolean;
}) {
  const letters = useMemo(() => text.split(''), [text]);

  return (
    <motion.div
      className={cn(
        'flex flex-wrap justify-center gap-[0.06em] font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#10243A] dark:text-[#F4F8FC]',
        textClassName
      )}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay },
        },
        exit: {
          opacity: 1,
          transition: { staggerChildren: exitStaggerDelay },
        },
      }}
    >
      {letters.map((char, i) => (
        <Letter key={`${char}-${i}`} char={char} letterDuration={letterDuration} useBlur={useBlur} />
      ))}
    </motion.div>
  );
});

/**
 * FlipFadeText — Per-character 3D rotateX cycling indicator across desktop, tablet, and mobile.
 */
export function FlipFadeText({
  words = DEFAULT_WORDS,
  interval = 2400,
  className,
  textClassName,
  letterDuration = 0.5,
  staggerDelay = 0.06,
  exitStaggerDelay = 0.03,
}: FlipFadeTextProps) {
  const isCompactMobile = useIsCompactMobile(767);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const updateIndex = useCallback(() => {
    setIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    if (reducedMotion || words.length <= 1) return;
    const timer = window.setInterval(updateIndex, interval);
    return () => window.clearInterval(timer);
  }, [updateIndex, interval, reducedMotion, words.length]);

  const currentWord = useMemo(() => words[index] ?? words[0], [words, index]);

  if (reducedMotion) {
    return (
      <div className={cn('flex items-center justify-center min-h-[56px]', className)}>
        <span
          className={cn(
            'font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#10243A] dark:text-[#F4F8FC]',
            textClassName
          )}
        >
          {words.join(' · ')}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center min-h-[44px] sm:min-h-[60px]', className)}>
      <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <Word
            key={currentWord}
            text={currentWord}
            staggerDelay={isCompactMobile ? Math.min(staggerDelay, 0.035) : staggerDelay}
            exitStaggerDelay={isCompactMobile ? Math.min(exitStaggerDelay, 0.02) : exitStaggerDelay}
            letterDuration={isCompactMobile ? Math.min(letterDuration, 0.34) : letterDuration}
            textClassName={textClassName}
            useBlur={!isCompactMobile}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FlipFadeText;
