import React, { useRef, useEffect, useState } from 'react';
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
 * StackedLogos — Pointer/touch-tracking radial glow & border highlight matrix
 * with alternating credential/affiliation cells across desktop and mobile.
 */
export const StackedLogos: React.FC<StackedLogosProps> = ({
  logoGroups,
  duration = 16,
  className,
  itemClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchActive, setTouchActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateCoordinates = (clientX: number, clientY: number) => {
      const items = container.querySelectorAll<HTMLElement>('.stacked-logos__item');
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty('--mouse-x', `${clientX - rect.left}px`);
        item.style.setProperty('--mouse-y', `${clientY - rect.top}px`);
      });
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') setTouchActive(true);
      updateCoordinates(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      updateCoordinates(e.clientX, e.clientY);
    };

    const handleLeave = () => {
      setTouchActive(false);
      const items = container.querySelectorAll<HTMLElement>('.stacked-logos__item');
      items.forEach((item) => {
        item.style.setProperty('--mouse-x', '-250px');
        item.style.setProperty('--mouse-y', '-250px');
      });
    };

    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerup', handleLeave, { passive: true });
    container.addEventListener('pointercancel', handleLeave, { passive: true });
    container.addEventListener('pointerleave', handleLeave);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', handleLeave);
      container.removeEventListener('pointercancel', handleLeave);
      container.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-touch-active={touchActive ? 'true' : undefined}
      className={cn(
        'stacked-logos grid grid-cols-2 sm:grid-cols-4 border border-[#10243A]/14 dark:border-[#F4F8FC]/14 bg-[#F1F6FB]/40 dark:bg-[#0D1B2E]/60',
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
              'stacked-logos__item min-h-[112px] sm:min-h-[128px] border-b border-r border-[#10243A]/12 dark:border-[#F4F8FC]/12 bg-white dark:bg-[#12243B] flex items-center justify-center p-4',
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
