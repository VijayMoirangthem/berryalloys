import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Flame, Factory, Microscope, Anchor, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';

export type EngineeringEmblemKey = 'furnace' | 'converter' | 'assay' | 'maritime' | 'energy';

export interface MaskedAvatarItem {
  avatar?: string;
  name: string;
  role?: string;
  /** Optional industrial engineering medallion spec (renders precision metallic emblem instead of a human photo). */
  emblem?: {
    code: string;
    icon: EngineeringEmblemKey;
    bgFrom: string;
    bgTo: string;
    accent: string;
  };
}

export interface MaskedAvatarsProps {
  avatars: MaskedAvatarItem[];
  size?: number;
  border?: number;
  column?: number;
  movement?: number;
  transition?: number;
  ringed?: boolean;
  offset?: number;
  blurOnRest?: boolean;
  className?: string;
  restHint?: string;
}

function renderEmblemIcon(icon: EngineeringEmblemKey, accent: string, className = 'w-5 h-5') {
  const props = {
    className,
    style: { color: accent },
    strokeWidth: 1.8,
    'aria-hidden': true as const,
  };
  switch (icon) {
    case 'furnace':
      return <Flame {...props} />;
    case 'converter':
      return <Factory {...props} />;
    case 'assay':
      return <Microscope {...props} />;
    case 'maritime':
      return <Anchor {...props} />;
    case 'energy':
      return <Sun {...props} />;
  }
}

/**
 * MaskedAvatars — Zero-fluctuation Interactive Engineering Pillar Selector Dock.
 *
 * Replaces overlapping radial-masked hover medallions with five discrete, non-overlapping
 * tactile precision tiles and a smooth spring active indicator + live operational scope card.
 * Completely eliminates hover jitter/oscillation on both desktop pointers and touch screens.
 */
export function MaskedAvatars({
  avatars,
  className,
}: MaskedAvatarsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (avatars.length === 0) return null;
  const activeItem = avatars[activeIndex] ?? avatars[0];

  return (
    <div
      className={cn('w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-3.5', className)}
      role="group"
      aria-label="Integrated production and engineering disciplines"
    >
      {/* 5 Discrete Non-Overlapping Precision Pillar Buttons (Zero Hit-Box Overlap / Zero Shift) */}
      <div
        role="tablist"
        aria-label="Select production pillar"
        className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full sm:w-auto"
      >
        {avatars.map((item, index) => {
          const isActive = activeIndex === index;
          const accent = item.emblem?.accent ?? '#69C5F5';

          return (
            <button
              key={`${item.name}-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${item.name}${item.role ? ` — ${item.role}` : ''}`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={cn(
                'relative flex flex-col items-center justify-center px-2 sm:px-3.5 py-2.5 sm:py-3 border transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand select-none',
                isActive
                  ? 'bg-[#0B1B2E] border-[#006393] dark:border-[#69C5F5] shadow-[0_8px_22px_rgba(0,99,147,0.22)]'
                  : 'bg-[#FFFFFF] dark:bg-[#0D1B2E] border-[#10243A]/14 dark:border-[#F4F8FC]/14 hover:border-[#006393]/60 dark:hover:border-[#69C5F5]/60'
              )}
            >
              {/* Circular Machined Emblem Badge (Stationary — Never Moves Away From Pointer) */}
              <span
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border transition-colors duration-200"
                style={{
                  background: item.emblem
                    ? `radial-gradient(circle at 30% 25%, ${item.emblem.bgTo}, ${item.emblem.bgFrom} 78%)`
                    : '#0E2035',
                  borderColor: isActive ? accent : 'rgba(244,248,252,0.18)',
                }}
              >
                {item.emblem ? (
                  renderEmblemIcon(item.emblem.icon, accent, 'w-5 h-5')
                ) : item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    draggable={false}
                    className="w-full h-full rounded-full object-cover object-top"
                  />
                ) : null}
              </span>

              <span
                className={cn(
                  'mt-1.5 text-[10px] font-mono-tabular font-bold uppercase tracking-[0.14em] transition-colors',
                  isActive
                    ? 'text-[#69C5F5]'
                    : 'text-[#10243A] dark:text-[#F4F8FC]/82'
                )}
              >
                {item.emblem?.code ?? `0${index + 1}`}
              </span>

              {/* Crisp Spring-Animated Active Indicator Bar */}
              {isActive && (
                <motion.span
                  layoutId="engineering-pillar-active-bar"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-x-0 bottom-0 h-[3px] bg-[#C9233B] dark:bg-[#69C5F5]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Stable Live Operational Readout Card (Fixed Min-Height — Zero Layout Jump) */}
      <div className="w-full sm:min-w-[430px] lg:max-w-[480px] bg-[#FFFFFF] dark:bg-[#0D1B2E] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 px-4 py-3 min-h-[72px] flex items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.name}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="space-y-0.5 min-w-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                Pillar 0{activeIndex + 1} / 0{avatars.length}
              </span>
              {activeItem.emblem?.code && (
                <span className="text-[10px] font-mono-tabular uppercase px-1.5 py-0.2 bg-[#F1F6FB] dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] border border-[#10243A]/12 dark:border-[#F4F8FC]/14">
                  {activeItem.emblem.code}
                </span>
              )}
            </div>
            <p className="font-display text-base sm:text-lg font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] leading-tight truncate">
              {activeItem.name}
            </p>
            {activeItem.role && (
              <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-snug">
                {activeItem.role}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MaskedAvatars;
