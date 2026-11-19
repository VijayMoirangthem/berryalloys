import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useDrag } from '@use-gesture/react';
import { useMotion } from '../../context/MotionContext';
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
 * PerspectiveCarousel — 3D depth card stack on desktop and clean directional
 * swipe deck on mobile screens with wrap-free AnimatePresence transitions.
 */
export function PerspectiveCarousel({
  slides,
  onSlideSelect,
  autoPlayMs = 4800,
  className,
  heading = 'Interactive 3D Inspection Deck',
}: PerspectiveCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const { reducedMotion: prefersReduced, ambientActive } = useMotion();
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const total = slides.length;

  const step = useCallback(
    (delta: number) => {
      if (total <= 1) return;
      setDirection(delta >= 0 ? 1 : -1);
      setCurrentIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (paused || prefersReduced || !ambientActive || total <= 1 || autoPlayMs <= 0) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [ambientActive, paused, prefersReduced, total, autoPlayMs]);

  const activeSlide = slides[currentIndex] ?? slides[0];

  const bindDeckSwipe = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], memo }) => {
      if (active) {
        if (!memo?.swiped && (Math.abs(mx) > 40 || (vx > 0.3 && Math.abs(mx) > 16))) {
          step(mx < 0 || dx < 0 ? 1 : -1);
          return { swiped: true };
        }
        return memo ?? { swiped: false };
      }
      return { swiped: false };
    },
    {
      axis: 'x',
      filterTaps: true,
      threshold: 5,
      preventScroll: true,
      pointer: { capture: false },
    }
  );

  if (!activeSlide) return null;

  const getOffset = (idx: number) => {
    let diff = idx - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div
      data-no-parallax
      className={cn(
        'bg-[#07111F] text-[#F4F8FC] border border-[#10243A]/20 dark:border-[#F4F8FC]/14 p-5 sm:p-8 overflow-hidden select-none',
        className
      )}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setPaused(false);
      }}
    >
      {/* Top Deck Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F4F8FC]/12">
        <div className="flex items-center gap-2.5 text-[11px] font-mono-tabular uppercase tracking-widest">
          <span className="text-[#69C5F5]">{heading}</span>
          <span aria-hidden="true" className="text-[#F4F8FC]/30">
            /
          </span>
          <span className="text-[#B5C5D7]">
            Plate 0{currentIndex + 1} of 0{total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume deck rotation' : 'Pause deck rotation'}
            className="inline-flex items-center gap-1.5 min-h-[34px] px-2.5 py-1 text-[11px] font-mono-tabular uppercase tracking-wider border border-[#F4F8FC]/18 bg-[#0D1B2E] text-[#F4F8FC] hover:border-[#69C5F5] transition-colors cursor-pointer"
          >
            {paused ? <Play className="w-3 h-3" aria-hidden="true" /> : <Pause className="w-3 h-3" aria-hidden="true" />}
            <span>{paused ? 'Play' : 'Pause'}</span>
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous 3D inspection plate"
            className="inline-flex items-center justify-center w-9 h-9 border border-[#F4F8FC]/18 bg-[#0D1B2E] text-[#F4F8FC] hover:border-[#69C5F5] hover:text-[#69C5F5] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next 3D inspection plate"
            className="inline-flex items-center justify-center w-9 h-9 border border-[#F4F8FC]/18 bg-[#0D1B2E] text-[#F4F8FC] hover:border-[#69C5F5] hover:text-[#69C5F5] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        {...bindDeckSwipe()}
        className="relative h-[248px] sm:h-[320px] flex items-center justify-center my-4 overflow-hidden cursor-grab active:cursor-grabbing"
        style={
          compact
            ? { touchAction: 'pan-y' }
            : { perspective: '1200px', transformStyle: 'preserve-3d', touchAction: 'pan-y' }
        }
      >
        {compact ? (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.button
              key={activeSlide.id}
              type="button"
              aria-label={`Inspect ${activeSlide.title}`}
              onClick={() => onSlideSelect?.(activeSlide)}
              custom={direction}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: direction * 48, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -direction * 48, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[410px] aspect-[16/10] border border-[#69C5F5]/70 shadow-2xl ring-1 ring-[#69C5F5]/25 overflow-hidden text-left cursor-pointer"
              style={{ backgroundColor: activeSlide.specimenPlate ? '#FFFFFF' : '#0D1B2E' }}
            >
              <img
                src={activeSlide.image}
                alt={activeSlide.alt}
                loading="eager"
                referrerPolicy="no-referrer"
                className={cn(
                  'w-full h-full block',
                  activeSlide.specimenPlate ? 'object-contain p-3 sm:p-4' : 'object-cover'
                )}
              />
              <span
                aria-hidden="true"
                className="absolute top-2.5 left-2.5 bg-[#07111F]/88 border border-[#F4F8FC]/18 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider text-[#69C5F5]"
              >
                {activeSlide.badge}
              </span>
            </motion.button>
          </AnimatePresence>
        ) : (
          slides.map((slide, idx) => {
            const offset = getOffset(idx);
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            if (absOffset > 2) return null;

            return (
              <motion.button
                key={slide.id}
                type="button"
                aria-label={`Inspect ${slide.title}`}
                onClick={() => {
                  if (!isCenter) {
                    setDirection(offset > 0 ? 1 : -1);
                    setCurrentIndex(idx);
                  } else {
                    onSlideSelect?.(slide);
                  }
                }}
                animate={
                  prefersReduced
                    ? { opacity: isCenter ? 1 : 0, scale: 1, x: 0 }
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
                    ? 'border-[#69C5F5]/70 shadow-2xl ring-1 ring-[#69C5F5]/25'
                    : 'border-[#F4F8FC]/16 opacity-60 hover:opacity-90'
                )}
                style={{
                  backgroundColor: slide.specimenPlate ? '#FFFFFF' : '#0D1B2E',
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
                  className="absolute top-2.5 left-2.5 bg-[#07111F]/88 border border-[#F4F8FC]/18 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider text-[#69C5F5]"
                >
                  {slide.badge}
                </span>
              </motion.button>
            );
          })
        )}
      </div>

      {/* Mobile Plate Step Dots */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-3 sm:hidden" aria-label="Select inspection plate">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setDirection(idx >= currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              aria-label={`Go to ${s.title}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
              className={cn(
                'h-2 transition-all cursor-pointer',
                idx === currentIndex ? 'w-6 bg-[#69C5F5]' : 'w-2 bg-[#F4F8FC]/30 hover:bg-[#F4F8FC]/60'
              )}
            />
          ))}
        </div>
      )}

      {/* Bottom Synchronized Caption & Direct Action */}
      <div className="pt-4 border-t border-[#F4F8FC]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <p className="font-display text-xl sm:text-2xl font-bold uppercase text-[#F4F8FC]">
            {activeSlide.title}
          </p>
          <p className="text-xs text-[#B5C5D7] leading-relaxed">{activeSlide.subtitle}</p>
        </div>

        {onSlideSelect ? (
          <button
            type="button"
            onClick={() => onSlideSelect(activeSlide)}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A6AA1] text-[#F4F8FC] hover:bg-[#004C73] hover:text-[#F4F8FC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{activeSlide.actionLabel ?? 'Select Alloy Family'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        ) : activeSlide.to ? (
          <Link
            to={activeSlide.to}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#0A6AA1] text-[#F4F8FC] hover:bg-[#004C73] hover:text-[#F4F8FC] transition-colors whitespace-nowrap shrink-0"
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

