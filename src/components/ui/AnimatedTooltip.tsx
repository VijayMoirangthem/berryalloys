import { ReactNode, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { cn } from '../../lib/utils';

export type TooltipVariant = 'copper' | 'graphite' | 'ivory';

interface AnimatedTooltipProps {
  label: string;
  sublabel?: string;
  children: ReactNode;
  variant?: TooltipVariant;
  className?: string;
  position?: 'top' | 'bottom';
}

const VARIANT_CLASSES: Record<TooltipVariant, string> = {
  copper:
    'bg-[#9E4B28] text-[#F6F4EF] border-[#EC743C]/40 dark:bg-[#A95632] dark:text-[#F3F0E9]',
  graphite:
    'bg-[#141618] text-[#F3F0E9] border-[#F3F0E9]/20 dark:bg-[#20242A] dark:text-[#F3F0E9]',
  ivory:
    'bg-[#FFFFFF] text-[#141618] border-[#141618]/20 dark:bg-[#F3F0E9] dark:text-[#141618]',
};

/**
 * AnimatedTooltip — Adapted from VengeanceUI AnimatedTooltip.
 * Spring-physics cursor-following metallurgical callout for alloy chemistry codes,
 * quality standards, and export credentials. Supports keyboard focus and hover.
 */
export function AnimatedTooltip({
  label,
  sublabel,
  children,
  variant = 'graphite',
  className,
  position = 'top',
}: AnimatedTooltipProps) {
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-80, 80], [-8, 8]), {
    stiffness: 240,
    damping: 20,
  });
  const translateX = useSpring(useTransform(x, [-80, 80], [-14, 14]), {
    stiffness: 240,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
  };

  return (
    <span
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        x.set(0);
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 0, y: position === 'top' ? 6 : -6, scale: 0.94 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: position === 'top' ? 4 : -4, scale: 0.94 }
            }
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={prefersReduced ? undefined : { translateX, rotate }}
            className={cn(
              'pointer-events-none absolute left-1/2 -translate-x-1/2 z-50 w-max max-w-[230px] px-3 py-1.5 border shadow-xl text-left',
              position === 'top' ? 'bottom-full mb-2.5' : 'top-full mt-2.5',
              VARIANT_CLASSES[variant]
            )}
          >
            <span className="block text-[11px] font-semibold leading-snug tracking-tight">
              {label}
            </span>
            {sublabel && (
              <span className="block text-[10px] font-mono-tabular opacity-85 mt-0.5 leading-snug">
                {sublabel}
              </span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
