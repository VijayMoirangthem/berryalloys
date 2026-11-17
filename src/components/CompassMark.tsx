import { cn } from '../lib/utils';

/**
 * CompassMark — the Berry Compass emblem: a ticked bezel, a red north needle and a light south needle.
 * The needle sways gently at idle and spins once when an ancestor with the `group` class is hovered
 * (see .compass-needle in index.css). Both motions stop when ambient motion is paused.
 */
export function CompassMark({ className, animated = true }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={cn('block', className)}>
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="32"
          y1="5"
          x2="32"
          y2={i % 3 === 0 ? 11 : 8.5}
          stroke={i === 0 ? '#FF8091' : 'currentColor'}
          strokeOpacity={i === 0 ? 1 : 0.55}
          strokeWidth={i % 3 === 0 ? 2.2 : 1.4}
          strokeLinecap="round"
          transform={`rotate(${i * 30} 32 32)`}
        />
      ))}
      <g className={animated ? 'compass-needle' : undefined} style={{ transformOrigin: '32px 32px', transformBox: 'view-box' }}>
        <path d="M32 11 L37.5 32 L32 29 L26.5 32 Z" fill="#FF5C73" />
        <path d="M32 53 L26.5 32 L32 35 L37.5 32 Z" fill="currentColor" fillOpacity="0.92" />
        <circle cx="32" cy="32" r="3.2" fill="#07111F" stroke="currentColor" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
