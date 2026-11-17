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
        'relative overflow-hidden bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14',
        className
      )}
    >
      {/* Subtle diagonal copper drafting hairline backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 w-72 h-72 border border-[#9E4B28]/15 dark:border-[#EC743C]/18 rotate-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-8 lg:p-10 items-center relative z-10">
        {/* Left: Diagonal Canted Image Stage */}
        <div className="lg:col-span-6 py-3 px-2 sm:px-4">
          <div className="relative overflow-hidden bg-[#121417] border border-[#141618]/18 dark:border-[#F3F0E9]/16 shadow-lg">
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
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#121417]/80 via-[#121417]/20 to-transparent"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-wider text-[#F3F0E9]">
                  <span className="bg-[#141618]/85 border border-[#F3F0E9]/18 px-2.5 py-1">
                    {active.category}
                  </span>
                  <span className="bg-[#9E4B28]/90 text-[#F3F0E9] px-2 py-1">
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
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              <span>{eyebrow}</span>
              {active.location && (
                <span className="text-[#4A5054] dark:text-[#A1A7AB]">{active.location}</span>
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
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                  {active.title}
                </h3>
                <p className="text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed max-w-[58ch]">
                  {active.summary}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stepper & Action Bar */}
          <div className="pt-4 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous initiative slide"
                className="inline-flex items-center justify-center w-11 h-11 border border-[#141618]/20 dark:border-[#F3F0E9]/22 bg-[#F6F4EF] dark:bg-[#191C20] text-[#141618] dark:text-[#F3F0E9] hover:border-[#9E4B28] hover:text-[#9E4B28] dark:hover:border-[#EC743C] dark:hover:text-[#EC743C] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next initiative slide"
                className="inline-flex items-center justify-center w-11 h-11 border border-[#141618]/20 dark:border-[#F3F0E9]/22 bg-[#F6F4EF] dark:bg-[#191C20] text-[#141618] dark:text-[#F3F0E9] hover:border-[#9E4B28] hover:text-[#9E4B28] dark:hover:border-[#EC743C] dark:hover:text-[#EC743C] transition-colors cursor-pointer"
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
                          ? 'w-7 bg-[#9E4B28] dark:bg-[#EC743C]'
                          : 'w-2.5 bg-[#141618]/20 hover:bg-[#141618]/45 dark:bg-[#F3F0E9]/20 dark:hover:bg-[#F3F0E9]/45'
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {active.to && (
              <Link
                to={active.to}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C] hover:underline whitespace-nowrap"
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
