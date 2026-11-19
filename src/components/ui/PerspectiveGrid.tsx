import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';

export interface PerspectiveGridProps {
  /** Additional CSS classes for the grid container */
  className?: string;
  /** Number of tiles per row/column (adaptive cap on mobile for 60fps on iPhone) */
  gridSize?: number;
  /** Whether to show the radial gradient fade overlay */
  showOverlay?: boolean;
  /** Radial fade radius percentage */
  fadeRadius?: number;
  /** Accent palette tone */
  accent?: 'berry' | 'crimson' | 'steel';
}

/**
 * PerspectiveGrid — Interactive 3D tilted tile field inspired by VengeanceUI.
 * Uses CSS 3D perspective + hover/tap tile illumination with smooth 1500ms decay
 * and subtle ambient pulse cells so touch devices visibly stay alive.
 */
export function PerspectiveGrid({
  className,
  gridSize = 24,
  showOverlay = true,
  fadeRadius = 76,
  accent = 'berry',
}: PerspectiveGridProps) {
  const [mounted, setMounted] = useState(false);
  const [effectiveSize, setEffectiveSize] = useState(gridSize);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [ambientSet, setAmbientSet] = useState<number[]>([24, 52, 86, 118]);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      const narrow = window.innerWidth < 768;
      setEffectiveSize(narrow ? Math.min(gridSize, 12) : Math.min(gridSize, 26));
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, [gridSize]);

  // Subtle ambient metallurgical pulse across random tiles so phones feel alive without mouse hover
  useEffect(() => {
    if (!mounted) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const total = effectiveSize * effectiveSize;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const next: number[] = [];
      for (let i = 0; i < 4; i++) {
        next.push(Math.floor(Math.random() * total));
      }
      setAmbientSet(next);
    }, 1850);
    return () => window.clearInterval(timer);
  }, [mounted, effectiveSize]);

  const tiles = useMemo(
    () => Array.from({ length: effectiveSize * effectiveSize }),
    [effectiveSize]
  );

  const hoverClass =
    accent === 'crimson'
      ? 'hover:bg-[#C9233B]/30 dark:hover:bg-[#C9233B]/40'
      : accent === 'steel'
      ? 'hover:bg-[#10243A]/18 dark:hover:bg-[#69C5F5]/28'
      : 'hover:bg-[#006393]/24 dark:hover:bg-[#69C5F5]/30';

  const activeClass =
    accent === 'crimson'
      ? 'bg-[#C9233B]/28 dark:bg-[#C9233B]/36'
      : accent === 'steel'
      ? 'bg-[#10243A]/14 dark:bg-[#69C5F5]/22'
      : 'bg-[#006393]/18 dark:bg-[#69C5F5]/22';

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden bg-transparent',
        '[--fade-stop:#FFFFFF] dark:[--fade-stop:#07111F]',
        className
      )}
      style={{
        perspective: '2000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute w-[68rem] sm:w-[80rem] aspect-square grid origin-center"
        style={{
          left: '50%',
          top: '50%',
          transform:
            'translate(-50%, -50%) rotateX(30deg) rotateY(-5deg) rotateZ(20deg) scale(1.85)',
          transformStyle: 'preserve-3d',
          gridTemplateColumns: `repeat(${effectiveSize}, 1fr)`,
          gridTemplateRows: `repeat(${effectiveSize}, 1fr)`,
        }}
      >
        {mounted &&
          tiles.map((_, i) => {
            const isLit = activeTile === i || ambientSet.includes(i);
            return (
              <div
                key={i}
                onPointerDown={() => setActiveTile(i)}
                className={cn(
                  'tile min-h-[1px] min-w-[1px] border border-[#10243A]/[0.08] dark:border-[#69C5F5]/[0.12] bg-transparent transition-colors duration-[1500ms] hover:duration-0',
                  hoverClass,
                  isLit && activeClass
                )}
              />
            );
          })}
      </div>

      {showOverlay && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, transparent 22%, var(--fade-stop) ${fadeRadius}%)`,
          }}
        />
      )}
    </div>
  );
}

export default PerspectiveGrid;
