import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
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

function renderEmblemIcon(icon: EngineeringEmblemKey, accent: string) {
  const props = {
    className: 'w-6 h-6',
    style: { color: accent },
    strokeWidth: 1.75,
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
 * MaskedAvatars — Overlapping radial-cutout circular medallion stack with spring lift
 * and curved orbital ring label. Supports precision engineering discipline emblems
 * (zero fabricated portraits) as well as verified photography when provided.
 */
export function MaskedAvatars({
  avatars,
  size = 76,
  border = 8,
  column = 44,
  movement = 0.7,
  transition = 0.2,
  ringed = true,
  offset = -3,
  blurOnRest = false,
  className,
  restHint = 'Hover or tap any production pillar to inspect operational scope',
}: MaskedAvatarsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { dynamicSize, maskImage } = useMemo(() => {
    const computedSize = `${size}px`;
    const circle = (border * 2 + size) / 2;
    const radX = circle - column - border;
    const computedMask = `radial-gradient(${circle}px ${circle}px at ${radX}px 50%, transparent ${
      circle - 0.5
    }px, white ${circle}px)`;
    return { dynamicSize: computedSize, maskImage: computedMask };
  }, [size, border, column]);

  const springConfig = useMemo(
    () => ({
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
    }),
    []
  );

  const activeItem = hoveredIndex !== null ? avatars[hoveredIndex] : null;

  return (
    <div
      className={cn('relative flex flex-col items-start gap-4', className)}
      style={{ '--size': dynamicSize } as React.CSSProperties}
      role="group"
      aria-label="Integrated production and engineering disciplines"
    >
      <div className="relative flex items-end pt-12 pb-2">
        <ul
          className="m-0 p-0 list-none grid grid-flow-col content-end"
          style={{
            height: size + 24,
            gridAutoColumns: column,
            paddingRight: size - column + 12,
          }}
          role="list"
        >
          {avatars.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const isPrevHovered = hoveredIndex === index - 1;

            const baseOffset = -size * 1.5;
            const moveOffset = size * movement;

            const maskPosition = isPrevHovered
              ? `0 ${baseOffset - moveOffset}px`
              : isHovered
              ? `0 ${baseOffset + moveOffset}px`
              : `0 ${baseOffset}px`;

            const chars = item.name.toUpperCase().split('');
            const arcSpan = Math.min(140, chars.length * 10.5);

            return (
              <motion.li
                key={`${item.name}-${index}`}
                className="relative grid content-end outline-none will-change-transform"
                role="listitem"
                style={{
                  width: dynamicSize,
                  height: size * 1.45,
                  zIndex: isHovered ? avatars.length + 5 : avatars.length - index,
                }}
                tabIndex={0}
                aria-label={`${item.name}${item.role ? ` — ${item.role}` : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                onClick={() =>
                  setHoveredIndex((prev) => (prev === index ? null : index))
                }
              >
                {ringed && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 bottom-0"
                    style={{
                      width: size + 24,
                      height: size + 24,
                      transform: `translate(-50%, ${isHovered ? -movement * 68 : 10}%) scale(${
                        isHovered ? 1 : 0.86
                      })`,
                      opacity: isHovered ? 1 : 0,
                      transition: `transform ${transition}s cubic-bezier(0.22, 1, 0.36, 1), opacity ${transition}s ease-out`,
                    }}
                  >
                    <svg
                      viewBox="0 0 120 120"
                      className="w-full h-full overflow-visible"
                    >
                      <defs>
                        <path
                          id={`masked-avatar-arc-${index}`}
                          d="M 14,60 A 46,46 0 1,1 106,60"
                        />
                      </defs>
                      <text
                        className="fill-[#006393] dark:fill-[#69C5F5] font-mono-tabular font-semibold uppercase"
                        style={{
                          fontSize: '8.5px',
                          letterSpacing: `${Math.max(1.2, 2.2 - arcSpan * 0.004)}px`,
                          transform: `rotate(${offset}deg)`,
                          transformOrigin: '60px 60px',
                        }}
                      >
                        <textPath
                          href={`#masked-avatar-arc-${index}`}
                          startOffset="50%"
                          textAnchor="middle"
                        >
                          {item.name}
                        </textPath>
                      </text>
                    </svg>
                  </div>
                )}

                <motion.div
                  className="relative w-full aspect-square rounded-full overflow-hidden cursor-pointer border-2 border-[#FFFFFF] dark:border-[#07111F] shadow-md bg-[#0E2035]"
                  animate={{
                    y: isHovered ? -size * movement * 0.42 : 0,
                    scale: isHovered ? 1.08 : 1,
                    filter:
                      blurOnRest && hoveredIndex !== null && !isHovered
                        ? 'blur(1.2px) brightness(0.86)'
                        : 'blur(0px) brightness(1)',
                  }}
                  transition={springConfig}
                  style={
                    index > 0
                      ? {
                          WebkitMaskImage: maskImage,
                          maskImage,
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskSize: '100% 400%',
                          maskSize: '100% 400%',
                          WebkitMaskPosition: maskPosition,
                          maskPosition,
                        }
                      : undefined
                  }
                >
                  {item.emblem ? (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center relative select-none"
                      style={{
                        background: `radial-gradient(circle at 30% 25%, ${item.emblem.bgTo}, ${item.emblem.bgFrom} 75%)`,
                      }}
                    >
                      {/* Precision machined inner instrument ring */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-[5px] rounded-full border border-dashed"
                        style={{ borderColor: `${item.emblem.accent}48` }}
                      />
                      {renderEmblemIcon(item.emblem.icon, item.emblem.accent)}
                      <span
                        className="mt-0.5 text-[9px] font-mono-tabular font-bold tracking-[0.14em] uppercase"
                        style={{ color: '#F4F8FC' }}
                      >
                        {item.emblem.code}
                      </span>
                    </div>
                  ) : item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      draggable={false}
                      className="w-full h-full object-cover object-top select-none"
                    />
                  ) : null}
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Live readout bar beneath the medallion stack */}
      <div className="min-h-[38px] flex flex-col justify-center">
        {activeItem ? (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className="text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC]">
              {activeItem.name}
            </span>
            {activeItem.role && (
              <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                · {activeItem.role}
              </span>
            )}
          </div>
        ) : (
          <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
            {restHint}
          </p>
        )}
      </div>
    </div>
  );
}

export default MaskedAvatars;
