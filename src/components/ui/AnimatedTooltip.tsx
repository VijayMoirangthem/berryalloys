import { ReactNode, useEffect, useRef, useState } from 'react';
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
    'bg-brand text-[#FFFFFF] border-[#69C5F5]/40 dark:bg-[#0A6AA1] dark:text-[#F4F8FC]',
  graphite:
    'bg-[#10243A] text-[#F4F8FC] border-[#F4F8FC]/20 dark:bg-[#12243B] dark:text-[#F4F8FC]',
  ivory:
    'bg-[#FFFFFF] text-[#10243A] border-[#10243A]/20 dark:bg-[#F4F8FC] dark:text-[#10243A]',
};

/**
 * AnimatedTooltip — Spring-physics pointer- and touch-responsive callout for alloy chemistry codes,
 * quality standards, and export credentials. Supports mouse hover, finger tap/drag, and keyboard focus.
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
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const openedByTouchRef = useRef(false);
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

  useEffect(() => {
    if (!open || !openedByTouchRef.current) return;
    const dismiss = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        x.set(0);
      }
    };
    document.addEventListener('pointerdown', dismiss, true);
    return () => document.removeEventListener('pointerdown', dismiss, true);
  }, [open, x]);

  const updateOffset = (clientX: number, target: HTMLElement) => {
    if (prefersReduced) return;
    const rect = target.getBoundingClientRect();
    x.set(clientX - rect.left - rect.width / 2);
  };

  return (
    <span
      ref={wrapperRef}
      className={cn('relative inline-flex items-center', className)}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') {
          openedByTouchRef.current = false;
          setOpen(true);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && !openedByTouchRef.current) {
          setOpen(false);
          x.set(0);
        }
      }}
      onPointerDown={(e) => {
        updateOffset(e.clientX, e.currentTarget);
        if (e.pointerType !== 'mouse') {
          openedByTouchRef.current = true;
          setOpen((prev) => !prev);
        }
      }}
      onPointerMove={(e) => updateOffset(e.clientX, e.currentTarget)}
      onFocus={() => setOpen(true)}
      onBlur={() => {
        if (!openedByTouchRef.current) setOpen(false);
      }}
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
