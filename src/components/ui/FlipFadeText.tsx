import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';

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
}: {
  char: string;
  letterDuration: number;
}) {
  return (
    <motion.span
      style={{ transformStyle: 'preserve-3d' }}
      variants={{
        initial: {
          rotateX: 90,
          y: 14,
          opacity: 0,
          filter: 'blur(6px)',
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -14,
          opacity: 0,
          filter: 'blur(6px)',
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
}: {
  text: string;
  staggerDelay: number;
  exitStaggerDelay: number;
  letterDuration: number;
  textClassName?: string;
}) {
  const letters = useMemo(() => text.split(''), [text]);

  return (
    <motion.div
      className={cn(
        'flex flex-wrap justify-center gap-[0.06em] font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#141618] dark:text-[#F3F0E9]',
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
        <Letter key={`${char}-${i}`} char={char} letterDuration={letterDuration} />
      ))}
    </motion.div>
  );
});

/**
 * FlipFadeText — Per-character 3D rotateX + de-blur cycling indicator for Berry Alloys' core pillars.
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
            'font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#141618] dark:text-[#F3F0E9]',
            textClassName
          )}
        >
          {words.join(' · ')}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center min-h-[60px]', className)}>
      <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <Word
            key={currentWord}
            text={currentWord}
            staggerDelay={staggerDelay}
            exitStaggerDelay={exitStaggerDelay}
            letterDuration={letterDuration}
            textClassName={textClassName}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FlipFadeText;
