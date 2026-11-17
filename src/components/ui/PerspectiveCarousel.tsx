import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface PerspectiveSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  alt: string;
  specimenPlate?: boolean;
  to?: string;
  actionLabel?: string;
}

export interface PerspectiveCarouselProps {
  slides: PerspectiveSlide[];
  onSlideSelect?: (slide: PerspectiveSlide) => void;
  autoPlayMs?: number;
  className?: string;
  heading?: string;
}

/**
 * PerspectiveCarousel — 3D depth card stack for QA plates & alloy family specimens
 * with zero cropping on specimen plates, autoplay toggle, and mobile-safe overflow bounds.
 */
export function PerspectiveCarousel({
  slides,
  onSlideSelect,
  autoPlayMs = 4800,
  className,
  heading = 'Interactive 3D Inspection Deck',
}: PerspectiveCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReduced = useReducedMotion();

  const total = slides.length;

  const step = useCallback(
    (delta: number) => {
      if (total <= 1) return;
      setCurrentIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (paused || prefersReduced || total <= 1 || autoPlayMs <= 0) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [paused, prefersReduced, total, autoPlayMs]);

  const activeSlide = slides[currentIndex] ?? slides[0];
  if (!activeSlide) return null;

  const getOffset = (idx: number) => {
    let diff = idx - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div
      className={cn(
        'bg-[#121417] text-[#F3F0E9] border border-[#141618]/20 dark:border-[#F3F0E9]/14 p-5 sm:p-8 overflow-hidden select-none',
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top Deck Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F3F0E9]/12">
        <div className="flex items-center gap-2.5 text-[11px] font-mono-tabular uppercase tracking-widest">
          <span className="text-[#EC743C]">{heading}</span>
          <span aria-hidden="true" className="text-[#F3F0E9]/30">
            /
          </span>
          <span className="text-[#A1A7AB]">
            Plate 0{currentIndex + 1} of 0{total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume deck rotation' : 'Pause deck rotation'}
            className="inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1 text-[11px] font-mono-tabular uppercase tracking-wider border border-[#F3F0E9]/18 bg-[#191C20] text-[#F3F0E9] hover:border-[#EC743C] transition-colors cursor-pointer"
          >
            {paused ? <Play className="w-3 h-3" aria-hidden="true" /> : <Pause className="w-3 h-3" aria-hidden="true" />}
            <span>{paused ? 'Play' : 'Pause'}</span>
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous 3D inspection plate"
            className="inline-flex items-center justify-center w-9 h-9 border border-[#F3F0E9]/18 bg-[#191C20] text-[#F3F0E9] hover:border-[#EC743C] hover:text-[#EC743C] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next 3D inspection plate"
            className="inline-flex items-center justify-center w-9 h-9 border border-[#F3F0E9]/18 bg-[#191C20] text-[#F3F0E9] hover:border-[#EC743C] hover:text-[#EC743C] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div
        className="relative h-[270px] sm:h-[320px] flex items-center justify-center my-4 overflow-hidden"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {slides.map((slide, idx) => {
          const offset = getOffset(idx);
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;
          const visible = absOffset <= 2;

          if (!visible) return null;

          return (
            <motion.button
              key={slide.id}
              type="button"
              aria-label={`Inspect ${slide.title}`}
              onClick={() => {
                if (!isCenter) {
                  setCurrentIndex(idx);
                } else {
                  onSlideSelect?.(slide);
                }
              }}
              animate={
                prefersReduced
                  ? {
                      opacity: isCenter ? 1 : 0,
                      scale: 1,
                      x: 0,
                    }
                  : {
                      x: offset * 155,
                      scale: isCenter ? 1 : Math.max(0.72, 1 - absOffset * 0.16),
                      rotateY: offset * -14,
                      opacity: isCenter ? 1 : Math.max(0.32, 1 - absOffset * 0.34),
                      zIndex: 20 - absOffset,
                    }
              }
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'absolute w-[84%] max-w-[430px] aspect-[16/10] border overflow-hidden text-left transition-shadow cursor-pointer',
                isCenter
                  ? 'border-[#EC743C]/70 shadow-2xl ring-1 ring-[#EC743C]/25'
                  : 'border-[#F3F0E9]/16 opacity-60 hover:opacity-90'
              )}
              style={{
                backgroundColor: slide.specimenPlate ? '#FFFFFF' : '#191C20',
                pointerEvents: prefersReduced && !isCenter ? 'none' : 'auto',
              }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                loading="lazy"
                referrerPolicy="no-referrer"
                className={cn(
                  'w-full h-full block',
                  slide.specimenPlate ? 'object-contain p-3 sm:p-4' : 'object-cover'
                )}
              />
              <span
                aria-hidden="true"
                className="absolute top-2.5 left-2.5 bg-[#121417]/88 border border-[#F3F0E9]/18 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider text-[#EC743C]"
              >
                {slide.badge}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Synchronized Caption & Direct Action */}
      <div className="pt-4 border-t border-[#F3F0E9]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <p className="font-display text-xl sm:text-2xl font-bold uppercase text-[#F3F0E9]">
            {activeSlide.title}
          </p>
          <p className="text-xs text-[#A1A7AB] leading-relaxed">{activeSlide.subtitle}</p>
        </div>

        {onSlideSelect ? (
          <button
            type="button"
            onClick={() => onSlideSelect(activeSlide)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#A95632] text-[#F3F0E9] hover:bg-[#EC743C] hover:text-[#141618] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{activeSlide.actionLabel ?? 'Select Alloy Family'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : activeSlide.to ? (
          <Link
            to={activeSlide.to}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#A95632] text-[#F3F0E9] hover:bg-[#EC743C] hover:text-[#141618] transition-colors whitespace-nowrap shrink-0"
          >
            <span>{activeSlide.actionLabel ?? 'Inspect Record'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default PerspectiveCarousel;
