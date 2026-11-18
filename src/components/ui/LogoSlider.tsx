import * as React from 'react';
import { useState } from 'react';
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
 * LogoSlider — Continuous marquee ribbon with hover-pause on desktop,
 * tap-to-pause/resume on touch screens, and ambient-motion awareness.
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
  const [tapPaused, setTapPaused] = useState(false);

  return (
    <div
      className={cn('logo-slider', pauseOnHover && 'cursor-pointer', className)}
      data-direction={direction}
      data-pause-on-hover={String(pauseOnHover)}
      data-user-paused={String(tapPaused)}
      data-edge-fade={String(edgeFade)}
      onClick={() => {
        if (pauseOnHover) setTapPaused((p) => !p);
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
