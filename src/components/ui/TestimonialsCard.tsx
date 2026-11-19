import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TestimonialItem {
  id: string | number;
  title: string;
  subtitle?: string;
  badge?: string;
  description: string;
  image: string;
}

export interface TestimonialsCardProps {
  items: TestimonialItem[];
  className?: string;
  width?: number;
  showNavigation?: boolean;
  showCounter?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

/**
 * TestimonialsCard — VengeanceUI 3D stacked polaroid endorsement deck ported to motion/react
 * and tuned to Berry Alloys Limited's Navy / Brand-Blue / Crimson design system.
 */
export function TestimonialsCard({
  items,
  className,
  width = 880,
  showNavigation = true,
  showCounter = true,
  autoPlay = true,
  autoPlayInterval = 5200,
}: TestimonialsCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState(false);

  const activeItem = items[activeIndex];

  React.useEffect(() => {
    if (!autoPlay || hovered || items.length <= 1) return;

    const interval = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayInterval, hovered, items.length]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const rotations = useMemo(() => [4, -3, -7, 5, -2], []);

  if (!items || items.length === 0 || !activeItem) {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('flex items-center justify-center py-4 sm:py-8', className)}
    >
      <div
        className="relative grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center w-full"
        style={{ perspective: '1400px', maxWidth: `${width}px` }}
      >
        {/* 3D Stacked Image Deck */}
        <div className="md:col-span-5 relative w-full max-w-[340px] mx-auto aspect-square">
          <AnimatePresence custom={direction}>
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const offset = index - activeIndex;
              const absOffset = Math.abs(offset);

              return (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden border-[6px] bg-[#10243A] border-[#FFFFFF] dark:border-[#19314B] shadow-2xl cursor-pointer"
                  initial={{
                    x: offset * 14,
                    y: absOffset * 6,
                    z: -140 * absOffset,
                    scale: 0.86 - absOffset * 0.04,
                    rotateZ: rotations[index % rotations.length],
                    opacity: isActive ? 1 : 0.48,
                    zIndex: 10 - absOffset,
                  }}
                  animate={
                    isActive
                      ? {
                          x: [offset * 14, direction === 1 ? -110 : 110, 0],
                          y: [absOffset * 6, 0, 0],
                          z: [-160, 120, 200],
                          scale: [0.88, 1.03, 1],
                          rotateZ: [rotations[index % rotations.length], -3, 0],
                          opacity: 1,
                          zIndex: 50,
                        }
                      : {
                          x: Math.max(-36, Math.min(36, offset * 14)),
                          y: Math.min(22, absOffset * 6),
                          z: -130 * absOffset,
                          rotateZ: rotations[index % rotations.length],
                          scale: Math.max(0.76, 0.86 - absOffset * 0.04),
                          opacity: absOffset > 2 ? 0.2 : 0.55,
                          zIndex: 10 - absOffset,
                        }
                  }
                  exit={{
                    x: direction === 1 ? -180 : 180,
                    z: -220,
                    scale: 0.78,
                    rotateZ: direction === 1 ? -8 : 8,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.68,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07111F]/90 via-[#07111F]/40 to-transparent px-4 py-3">
                    <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                      {item.badge ?? 'Verified Stakeholder Record'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Editorial Readout + Controls */}
        <div className="md:col-span-7 flex flex-col justify-between gap-6 min-h-[240px]">
          <div className="flex items-center justify-between gap-4 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 pb-3">
            <span className="inline-flex items-center gap-2 text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              <Quote className="w-4 h-4 text-[#C9233B]" aria-hidden="true" />
              {activeItem.badge ?? 'Institutional Perspective'}
            </span>
            {showCounter && (
              <span className="font-mono-tabular text-xs font-semibold text-[#465C72] dark:text-[#B5C5D7]">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(items.length).padStart(2, '0')}
              </span>
            )}
          </div>

          <div className="min-h-[140px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-2.5"
              >
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                  {activeItem.title}
                </h3>
                {activeItem.subtitle && (
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                    {activeItem.subtitle}
                  </p>
                )}
                <p className="text-sm sm:text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed pt-1">
                  “{activeItem.description}”
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {showNavigation && items.length > 1 && (
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center justify-center w-10 h-10 border border-[#10243A]/18 dark:border-[#F4F8FC]/20 bg-[#FFFFFF] dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] hover:bg-brand hover:text-[#FFFFFF] hover:border-brand transition-colors cursor-pointer"
                  aria-label="Previous endorsement card"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center w-10 h-10 border border-[#10243A]/18 dark:border-[#F4F8FC]/20 bg-[#FFFFFF] dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] hover:bg-brand hover:text-[#FFFFFF] hover:border-brand transition-colors cursor-pointer"
                  aria-label="Next endorsement card"
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`View card ${idx + 1}: ${item.title}`}
                    onClick={() => {
                      setDirection(idx > activeIndex ? 1 : -1);
                      setActiveIndex(idx);
                    }}
                    className={cn(
                      'h-1.5 transition-all cursor-pointer',
                      idx === activeIndex
                        ? 'w-7 bg-brand dark:bg-[#69C5F5]'
                        : 'w-2 bg-[#10243A]/20 dark:bg-[#F4F8FC]/20 hover:bg-brand/60'
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestimonialsCard;
