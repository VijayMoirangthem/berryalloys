import React, { useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface StackedLogoItem {
  id: string;
  node: React.ReactNode;
}

export interface StackedLogosProps {
  /** Groups of 2+ logo/badge layers per grid cell that cross-fade smoothly */
  logoGroups: StackedLogoItem[][];
  /** Duration of a full alternating fade cycle in seconds */
  duration?: number;
  className?: string;
  itemClassName?: string;
}

/**
 * StackedLogos — Mouse-tracking radial glow & border highlight matrix
 * with cycling alternating credential/affiliation cells.
 */
export const StackedLogos: React.FC<StackedLogosProps> = ({
  logoGroups,
  duration = 16,
  className,
  itemClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateCoordinates = (e: MouseEvent | PointerEvent) => {
      const items = container.querySelectorAll<HTMLElement>('.stacked-logos__item');
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        item.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    };

    const handleLeave = () => {
      const items = container.querySelectorAll<HTMLElement>('.stacked-logos__item');
      items.forEach((item) => {
        item.style.setProperty('--mouse-x', '-250px');
        item.style.setProperty('--mouse-y', '-250px');
      });
    };

    container.addEventListener('pointermove', updateCoordinates, { passive: true });
    container.addEventListener('pointerleave', handleLeave);

    return () => {
      container.removeEventListener('pointermove', updateCoordinates);
      container.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'stacked-logos grid grid-cols-2 sm:grid-cols-4 border border-[#141618]/14 dark:border-[#F3F0E9]/14 bg-[#ECE8DF]/40 dark:bg-[#191C20]/60',
        className
      )}
      style={{ '--duration': `${duration}s` } as React.CSSProperties}
    >
      {logoGroups.map((group, cellIdx) => {
        const totalInCell = Math.max(1, group.length);
        const step = duration / totalInCell;

        return (
          <div
            key={`stacked-cell-${cellIdx}`}
            className={cn(
              'stacked-logos__item min-h-[112px] sm:min-h-[128px] border-b border-r border-[#141618]/12 dark:border-[#F3F0E9]/12 bg-white dark:bg-[#20242A] flex items-center justify-center p-4',
              itemClassName
            )}
          >
            <div className="stacked-logos__glow" aria-hidden="true" />
            <div className="stacked-logos__border-glow" aria-hidden="true" />

            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {group.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={cn(
                    'flex items-center justify-center text-center w-full',
                    totalInCell > 1 ? 'stacked-logos__layer absolute inset-0 px-3' : 'relative'
                  )}
                  style={
                    totalInCell > 1
                      ? {
                          animationDelay: `${-(idx * step)}s`,
                        }
                      : undefined
                  }
                >
                  {entry.node}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StackedLogos;
