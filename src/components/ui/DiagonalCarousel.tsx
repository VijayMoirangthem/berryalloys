import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';
import { ResilientImage } from '../ResilientImage';

export interface DiagonalCarouselSlide {
  id: string;
  category: string;
  location?: string;
  title: string;
  summary: string;
  image: string;
  alt: string;
  to?: string;
  actionLabel?: string;
}

export interface DiagonalCarouselProps {
  slides: DiagonalCarouselSlide[];
  className?: string;
  eyebrow?: string;
}

/**
 * DiagonalCarousel — Kinetic slanted-plate editorial photo deck with keyboard/button
 * navigation, crisp facility/CSR framing, and dual-theme industrial styling.
 */
export function DiagonalCarousel({
  slides,
  className,
  eyebrow = 'Fieldwork Sequence',
}: DiagonalCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReduced = useReducedMotion();

  const total = slides.length;
  const active = slides[index] ?? slides[0];

  const step = useCallback(
    (delta: 1 | -1) => {
      if (total <= 1) return;
      setDirection(delta);
      setIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  const jumpTo = useCallback(
    (target: number) => {
      if (target === index) return;
      setDirection(target > index ? 1 : -1);
      setIndex(target);
    },
    [index]
  );

  if (!active) return null;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14',
        className
      )}
    >
      {/* Subtle diagonal copper drafting hairline backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 w-72 h-72 border border-brand/15 dark:border-[#69C5F5]/18 rotate-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-10 items-center relative z-10">
        {/* Left: Diagonal Canted Image Stage */}
        <div className="lg:col-span-6 py-3 px-2 sm:px-4">
          <div className="relative overflow-hidden bg-[#07111F] border border-[#10243A]/18 dark:border-[#F4F8FC]/16 shadow-lg">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                initial={
                  prefersReduced
                    ? { opacity: 1 }
                    : {
                        opacity: 0,
                        x: direction * 38,
                        y: direction * -16,
                        rotate: direction * 2.5,
                        scale: 0.96,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                }}
                exit={
                  prefersReduced
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        x: direction * -38,
                        y: direction * 16,
                        rotate: direction * -2.5,
                        scale: 0.96,
                      }
                }
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                className="group relative aspect-[16/10] w-full overflow-hidden"
              >
                <div
                  className={cn(
                    'w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    !prefersReduced && '-rotate-[1.75deg] scale-[1.06] group-hover:rotate-0 group-hover:scale-[1.02]'
                  )}
                >
                  <ResilientImage
                    src={active.image}
                    alt={active.alt}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#07111F]/80 via-[#07111F]/20 to-transparent"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-wider text-[#F4F8FC]">
                  <span className="bg-[#10243A]/85 border border-[#F4F8FC]/18 px-2.5 py-1">
                    {active.category}
                  </span>
                  <span className="bg-brand/90 text-[#F4F8FC] px-2 py-1">
                    0{index + 1} / 0{total}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Structured Editorial Narrative & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              <span>{eyebrow}</span>
              {active.location && (
                <span className="text-[#465C72] dark:text-[#B5C5D7]">{active.location}</span>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3"
              >
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                  {active.title}
                </h3>
                <p className="text-sm text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed max-w-[58ch]">
                  {active.summary}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stepper & Action Bar */}
          <div className="pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous initiative slide"
                className="inline-flex items-center justify-center w-11 h-11 border border-[#10243A]/20 dark:border-[#F4F8FC]/22 bg-[#FFFFFF] dark:bg-[#0D1B2E] text-[#10243A] dark:text-[#F4F8FC] hover:border-brand hover:text-brand dark:hover:border-[#69C5F5] dark:hover:text-[#69C5F5] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next initiative slide"
                className="inline-flex items-center justify-center w-11 h-11 border border-[#10243A]/20 dark:border-[#F4F8FC]/22 bg-[#FFFFFF] dark:bg-[#0D1B2E] text-[#10243A] dark:text-[#F4F8FC] hover:border-brand hover:text-brand dark:hover:border-[#69C5F5] dark:hover:text-[#69C5F5] transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-1.5 pl-2" role="tablist" aria-label="Select slide">
                {slides.map((slide, idx) => {
                  const isCurrent = idx === index;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`Slide ${idx + 1}: ${slide.title}`}
                      onClick={() => jumpTo(idx)}
                      className={cn(
                        'h-2 transition-all duration-400 cursor-pointer',
                        isCurrent
                          ? 'w-7 bg-brand dark:bg-[#69C5F5]'
                          : 'w-2.5 bg-[#10243A]/20 hover:bg-[#10243A]/45 dark:bg-[#F4F8FC]/20 dark:hover:bg-[#F4F8FC]/45'
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {active.to && (
              <Link
                to={active.to}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
              >
                <span>{active.actionLabel ?? 'View Full Record'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagonalCarousel;
