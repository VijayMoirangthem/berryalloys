import * as React from 'react';
import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useMotion } from '../../context/MotionContext';
import { cn } from '../../lib/utils';

export interface LogoSliderItem {
  id: string;
  content: React.ReactNode;
}

export interface LogoSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  gap?: string;
  logoHeight?: string;
  pauseOnHover?: boolean;
  showBlur?: boolean;
  /** Fade the first and last items into the edges with a mask. Off by default: logos stay crisp right up to the edge. */
  edgeFade?: boolean;
  blurLayers?: number;
  blurWidth?: number;
  /** CSS background color for progressive edge masks */
  edgeBackground?: string;
}

/**
 * LogoSlider — Continuous marquee ribbon with hover-pause on fine pointers,
 * explicit tap-to-pause/resume (ignoring scroll drags) on touch screens,
 * and ambient-motion awareness.
 */
export function LogoSlider({
  items,
  speed = 32,
  direction = 'left',
  gap = '2.5rem',
  logoHeight = '3.5rem',
  pauseOnHover = true,
  showBlur = false,
  edgeFade = false,
  blurLayers = 6,
  blurWidth = 14,
  edgeBackground,
  className,
  style,
  ...props
}: LogoSliderProps) {
  const safeSpeed = Math.max(8, speed);
  const safeBlurLayers = Math.max(1, Math.min(8, blurLayers));
  const { ambientActive, reducedMotion } = useMotion();
  const [tapPaused, setTapPaused] = useState(false);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);

  const effectivelyPaused = tapPaused || !ambientActive || reducedMotion;

  return (
    <div
      className={cn('logo-slider relative', pauseOnHover && 'cursor-pointer', className)}
      data-direction={direction}
      data-pause-on-hover={String(pauseOnHover)}
      data-user-paused={String(effectivelyPaused)}
      data-edge-fade={String(edgeFade)}
      onPointerDown={(e) => {
        downPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        if (!pauseOnHover) return;
        const start = downPosRef.current;
        downPosRef.current = null;
        if (start) {
          const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
          if (moved > 8) return;
        }
        setTapPaused((p) => !p);
      }}
      style={
        {
          '--duration': `${safeSpeed}s`,
          '--gap-x': gap,
          '--slider-height': logoHeight,
          '--blur-width': blurWidth,
          ...(edgeBackground ? { '--slider-edge-bg': edgeBackground } : {}),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {pauseOnHover && !reducedMotion && ambientActive && tapPaused && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTapPaused(false);
          }}
          aria-label="Resume logo ribbon motion"
          className="absolute right-2 top-1.5 z-20 inline-flex items-center gap-1 border border-brand/60 bg-card/95 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider text-brand shadow-sm cursor-pointer"
        >
          <Play className="h-2.5 w-2.5" aria-hidden="true" />
          Paused · Resume
        </button>
      )}
      {pauseOnHover && !reducedMotion && ambientActive && !tapPaused && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setTapPaused(true);
          }}
          aria-label="Pause logo ribbon motion"
          className="sr-only focus:not-sr-only focus:absolute focus:right-2 focus:top-1.5 focus:z-20 inline-flex items-center gap-1 border border-control bg-card px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider text-ink"
        >
          <Pause className="h-2.5 w-2.5" aria-hidden="true" />
          Pause
        </button>
      )}

      <div className="logo-slider__viewport">
        {showBlur && (
          <>
            <div className="logo-slider__blur logo-slider__blur--left" aria-hidden="true">
              {Array.from({ length: safeBlurLayers }).map((_, i) => (
                <div
                  key={`left-blur-${i}`}
                  style={{ '--blur-index': i + 1 } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="logo-slider__blur logo-slider__blur--right" aria-hidden="true">
              {Array.from({ length: safeBlurLayers }).map((_, i) => (
                <div
                  key={`right-blur-${i}`}
                  style={{ '--blur-index': i + 1 } as React.CSSProperties}
                />
              ))}
            </div>
          </>
        )}

        <ul className="logo-slider__track m-0 list-none p-0" aria-label="Credentials and industry affiliations">
          {items.map((item, index) => (
            <li key={`primary-${index}`} className="logo-slider__item">
              {item}
            </li>
          ))}
          {items.map((item, index) => (
            <li
              key={`clone-${index}`}
              className="logo-slider__item"
              aria-hidden="true"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LogoSlider;

