import React, { useId, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export type LegacyTooltipVariant = 'copper' | 'graphite' | 'ivory';
export type VengeanceTooltipVariant =
  | 'cora'
  | 'smaug'
  | 'dori'
  | 'gram'
  | 'indis'
  | 'malva'
  | 'sadoc';

export type TooltipVariant = LegacyTooltipVariant | VengeanceTooltipVariant;

export interface AnimatedTooltipProps {
  children: React.ReactNode;
  /** Primary tooltip content (supports both VengeanceUI `content` and legacy `label`) */
  content?: React.ReactNode;
  label?: string;
  sublabel?: string;
  variant?: TooltipVariant;
  className?: string;
  tooltipClassName?: string;
  accentColor?: string;
  shapeColor?: string;
  textColor?: string;
}

const isVengeanceVariant = (v: TooltipVariant): v is VengeanceTooltipVariant =>
  v === 'cora' ||
  v === 'smaug' ||
  v === 'dori' ||
  v === 'gram' ||
  v === 'indis' ||
  v === 'malva' ||
  v === 'sadoc';

const LEGACY_VARIANT_STYLES: Record<LegacyTooltipVariant, string> = {
  copper: 'bg-[#006393] text-[#F4F8FC] border-[#006393]',
  graphite:
    'bg-[#10243A] text-[#F4F8FC] border-[#10243A] dark:bg-[#19314B] dark:border-[#69C5F5]/40',
  ivory:
    'bg-[#FFFFFF] text-[#10243A] border-[#10243A]/20 dark:bg-[#12243B] dark:text-[#F4F8FC] dark:border-[#F4F8FC]/20',
};

const BERRY_BUBBLE_SHAPES: Record<VengeanceTooltipVariant, { path: string; viewBox: string }> = {
  cora: {
    viewBox: '0 0 220 68',
    path: 'M 22,6 L 198,6 C 210,6 216,14 214,28 C 212,44 205,52 192,52 L 122,52 L 110,64 L 98,52 L 28,52 C 15,52 8,44 6,28 C 4,14 10,6 22,6 Z',
  },
  smaug: {
    viewBox: '0 0 220 68',
    path: 'M 14,10 L 206,6 L 214,48 L 124,52 L 110,64 L 96,52 L 8,48 Z',
  },
  dori: {
    viewBox: '0 0 220 68',
    path: 'M 26,8 Q 110,2 194,8 Q 216,12 214,30 Q 212,50 192,52 L 120,52 L 110,64 L 100,52 L 28,52 Q 8,50 6,30 Q 4,12 26,8 Z',
  },
  gram: {
    viewBox: '0 0 220 68',
    path: 'M 10,8 L 210,8 L 210,50 L 122,50 L 110,63 L 98,50 L 10,50 Z',
  },
  indis: {
    viewBox: '0 0 220 68',
    path: 'M 18,6 L 202,6 C 212,6 214,16 214,29 C 214,42 212,52 202,52 L 121,52 L 110,64 L 99,52 L 18,52 C 8,52 6,42 6,29 C 6,16 8,6 18,6 Z',
  },
  malva: {
    viewBox: '0 0 220 68',
    path: 'M 24,8 L 196,8 C 210,8 214,18 212,30 C 210,44 202,52 190,52 L 121,52 L 110,63 L 99,52 L 30,52 C 18,52 10,44 8,30 C 6,18 10,8 24,8 Z',
  },
  sadoc: {
    viewBox: '0 0 220 68',
    path: 'M 16,6 L 204,6 L 214,28 L 204,52 L 122,52 L 110,64 L 98,52 L 16,52 L 6,28 Z',
  },
};

const BUBBLE_ANIMATIONS: Record<
  VengeanceTooltipVariant,
  { initial: Record<string, number>; animate: Record<string, number>; exit: Record<string, number> }
> = {
  cora: {
    initial: { opacity: 0, scale: 0.72, y: 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 8 },
  },
  smaug: {
    initial: { opacity: 0, scale: 0.78, rotate: -6, y: 12 },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0 },
    exit: { opacity: 0, scale: 0.85, rotate: 4, y: 8 },
  },
  dori: {
    initial: { opacity: 0, scale: 0.65, y: 14 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.75, y: 8 },
  },
  gram: {
    initial: { opacity: 0, scaleY: 0.5, y: 10 },
    animate: { opacity: 1, scaleY: 1, y: 0 },
    exit: { opacity: 0, scaleY: 0.6, y: 6 },
  },
  indis: {
    initial: { opacity: 0, scale: 0.82, y: 14 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.86, y: 8 },
  },
  malva: {
    initial: { opacity: 0, scale: 0.75, rotate: 5, y: 12 },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0 },
    exit: { opacity: 0, scale: 0.82, rotate: -3, y: 8 },
  },
  sadoc: {
    initial: { opacity: 0, scale: 0.74, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.82, y: 6 },
  },
};

/**
 * AnimatedTooltip — Dual-mode animated tooltip supporting both classic architectural
 * Berry badges (`copper | graphite | ivory`) and VengeanceUI bouncy SVG bubble variants
 * (`cora | smaug | dori | gram | indis | malva | sadoc`), with full hover, focus & touch support.
 */
export function AnimatedTooltip({
  children,
  content,
  label,
  sublabel,
  variant = 'graphite',
  className,
  tooltipClassName,
  accentColor = '#006393',
  shapeColor,
  textColor,
}: AnimatedTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  // Dismiss on outside touch so mobile tap-to-inspect always closes cleanly
  useEffect(() => {
    if (!open) return;
    const onOutside = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', onOutside);
    return () => window.removeEventListener('pointerdown', onOutside);
  }, [open]);

  const resolvedContent = content ?? label;
  const useVengeance = isVengeanceVariant(variant);

  return (
    <span
      ref={wrapperRef}
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => {
        // On touch devices, toggle tooltip smoothly without blocking links
        if (window.matchMedia('(hover: none)').matches) {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }
      }}
      aria-describedby={open ? tooltipId : undefined}
    >
      {children}

      <AnimatePresence>
        {open && resolvedContent && (
          useVengeance ? (
            <motion.span
              id={tooltipId}
              role="tooltip"
              initial={BUBBLE_ANIMATIONS[variant].initial}
              animate={BUBBLE_ANIMATIONS[variant].animate}
              exit={BUBBLE_ANIMATIONS[variant].exit}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className={cn(
                'pointer-events-none absolute left-1/2 bottom-full mb-2.5 -translate-x-1/2 z-50 min-w-[168px] max-w-[260px] select-none drop-shadow-[0_12px_24px_rgba(16,36,58,0.22)]',
                tooltipClassName
              )}
            >
              <span className="relative block px-4 pt-2.5 pb-4 text-center">
                <svg
                  viewBox={BERRY_BUBBLE_SHAPES[variant].viewBox}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full"
                >
                  <path
                    d={BERRY_BUBBLE_SHAPES[variant].path}
                    fill={shapeColor || '#10243A'}
                    stroke={accentColor}
                    strokeWidth="2.2"
                  />
                </svg>
                <span
                  className="relative z-10 block text-[11px] font-mono-tabular font-semibold tracking-wider uppercase whitespace-nowrap"
                  style={{ color: textColor || '#F4F8FC' }}
                >
                  {resolvedContent}
                </span>
                {sublabel && (
                  <span
                    className="relative z-10 block text-[10px] font-mono-tabular mt-0.5 whitespace-nowrap opacity-85"
                    style={{ color: textColor || '#B5C5D7' }}
                  >
                    {sublabel}
                  </span>
                )}
              </span>
            </motion.span>
          ) : (
            <motion.span
              id={tooltipId}
              role="tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'pointer-events-none absolute left-1/2 bottom-full mb-2.5 -translate-x-1/2 z-50 px-3 py-1.5 border shadow-lg whitespace-nowrap text-center',
                LEGACY_VARIANT_STYLES[variant],
                tooltipClassName
              )}
            >
              <span className="block text-[11px] font-mono-tabular font-semibold uppercase tracking-wider">
                {resolvedContent}
              </span>
              {sublabel && (
                <span className="block text-[10px] font-mono-tabular opacity-80 mt-0.5">
                  {sublabel}
                </span>
              )}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-full -translate-x-1/2 -mt-[5px] w-2.5 h-2.5 rotate-45 border-r border-b border-inherit bg-inherit"
              />
            </motion.span>
          )
        )}
      </AnimatePresence>
    </span>
  );
}

export default AnimatedTooltip;
