import { useId } from 'react';
import { cn } from '../lib/utils';

export interface BerryMonogramProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * BerryMonogram — Bespoke geometric 'B' emblem harmonized with the official BERRY
 * alloy-arc wordmark, obsidian steel graphite surface, and molten copper core notch.
 */
export function BerryMonogram({
  className,
  size = 40,
  title = 'Berry Alloys Limited Monogram',
}: BerryMonogramProps) {
  const uid = useId().replace(/:/g, '');
  const bgId = `bm-bg-${uid}`;
  const emberId = `bm-ember-${uid}`;
  const tealId = `bm-teal-${uid}`;
  const steelId = `bm-steel-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={cn('block shrink-0', className)}
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#191C20" />
          <stop offset="100%" stopColor="#111316" />
        </linearGradient>
        <linearGradient id={emberId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D92D20" />
          <stop offset="55%" stopColor="#EC743C" />
          <stop offset="100%" stopColor="#F29E38" />
        </linearGradient>
        <linearGradient id={tealId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CBD5DF" />
          <stop offset="35%" stopColor="#0E7B8C" />
          <stop offset="100%" stopColor="#094D86" />
        </linearGradient>
        <linearGradient id={steelId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D8D1C3" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="12" fill={`url(#${bgId})`} />
      <rect
        x="2.75"
        y="2.75"
        width="58.5"
        height="58.5"
        rx="11.25"
        fill="none"
        stroke="#EC743C"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />

      <path
        d="M17.5 16.5 C24.5 11.2, 32.5 8.5, 41.2 7.4 C35.5 9.8, 28.8 12.8, 22.8 16.5 Z"
        fill={`url(#${emberId})`}
      />
      <path
        d="M25.5 16.5 C34.2 10.6, 44.5 7.4, 54.5 7.0 C46.8 9.2, 37.8 12.4, 30.8 16.5 Z"
        fill={`url(#${tealId})`}
      />

      <path
        d="M16.5 21 H34.8 C40.6 21 44.8 24.3 44.8 29.5 C44.8 32.7 42.8 35.1 39.8 36.2 C43.8 37.3 46.5 40.3 46.5 44.8 C46.5 50.6 41.8 54 35.2 54 H16.5 V39.5 H24.5 V47 H34.2 C36.9 47 38.6 45.7 38.6 43.7 C38.6 41.7 36.8 40.5 34.0 40.5 H26.8 V33.8 H33.6 C36.1 33.8 37.4 32.7 37.4 30.9 C37.4 29.0 35.9 28.0 33.4 28.0 H24.5 V32.2 H16.5 V21 Z"
        fill={`url(#${steelId})`}
      />

      <path d="M16.5 34.4 H24.5 L23.4 37.9 H16.5 Z" fill="#EC743C" />
    </svg>
  );
}

export default BerryMonogram;
