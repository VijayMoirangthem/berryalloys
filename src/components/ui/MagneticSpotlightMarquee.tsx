import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cn } from '../../lib/utils';

export interface SpotlightMarqueeItem {
  id: string;
  eyebrow: string;
  title: string;
  metric: string;
  detail: string;
}

export interface MagneticSpotlightMarqueeProps {
  items: SpotlightMarqueeItem[];
  className?: string;
  /** Duration in seconds for one complete loop */
  speedSeconds?: number;
  /** Direction of horizontal drift */
  direction?: 'left' | 'right';
}

function MagneticSpotlightCard({ item }: { item: SpotlightMarqueeItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const magX = useSpring(rawX, { stiffness: 260, damping: 22 });
  const magY = useSpring(rawY, { stiffness: 260, damping: 22 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const normX = (relX / rect.width - 0.5) * 2;
    const normY = (relY / rect.height - 0.5) * 2;
    rawX.set(normX * 7);
    rawY.set(normY * 5);
    setSpotlight({
      x: (relX / rect.width) * 100,
      y: (relY / rect.height) * 100,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ x: magX, y: magY }}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative w-[270px] sm:w-[310px] shrink-0 border border-[#10243A]/14 dark:border-[#F4F8FC]/14 bg-[#FFFFFF] dark:bg-[#0D1B2E] p-5 overflow-hidden transition-colors duration-200 hover:border-brand/55 dark:hover:border-[#69C5F5]/55 select-none"
    >
      {/* Dynamic cursor/touch radial spotlight illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spotlight.active ? 1 : 0,
          background: `radial-gradient(220px circle at ${spotlight.x}% ${spotlight.y}%, rgba(105, 197, 245, 0.22), rgba(0, 99, 147, 0.08) 45%, transparent 72%)`,
        }}
      />

      {/* Top accent hairline that illuminates on interaction */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B] opacity-55 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className="text-[10px] font-mono-tabular uppercase tracking-[0.2em] text-brand dark:text-[#69C5F5]">
          {item.eyebrow}
        </span>
        <span className="text-[11px] font-mono-tabular font-semibold text-[#C9233B] dark:text-[#F48B9B] shrink-0">
          {item.metric}
        </span>
      </div>

      <h3 className="relative z-10 mt-3 font-display text-lg font-bold tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
        {item.title}
      </h3>
      <p className="relative z-10 mt-1.5 text-xs leading-relaxed text-[#465C72] dark:text-[#B5C5D7]">
        {item.detail}
      </p>
    </motion.div>
  );
}

/**
 * MagneticSpotlightMarquee — Continuous horizontal showcase strip with magnetic
 * spring attraction and cursor/touch radial spotlight illumination on every card.
 */
export function MagneticSpotlightMarquee({
  items,
  className,
  speedSeconds = 36,
  direction = 'left',
}: MagneticSpotlightMarqueeProps) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={cn('relative w-full overflow-hidden py-2', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Left & right atmospheric edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 z-20 bg-gradient-to-r from-[#F1F6FB] dark:from-[#07111F] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 z-20 bg-gradient-to-l from-[#F1F6FB] dark:from-[#07111F] to-transparent"
      />

      <div
        className="flex w-max gap-4 will-change-transform"
        style={{
          animation: `berry-marquee-scroll ${speedSeconds}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {[...items, ...items].map((item, idx) => (
          <MagneticSpotlightCard key={`${item.id}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default MagneticSpotlightMarquee;
