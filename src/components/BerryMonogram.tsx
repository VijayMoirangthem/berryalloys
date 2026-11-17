import { cn } from '../lib/utils';

export interface BerryMonogramProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  surface?: 'auto' | 'light' | 'dark';
  framed?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
} as const;

/**
 * BerryMonogram — Compact forged geometric 'B' monogram inspired by
 * Berry Alloys Limited's foundry heritage, copper ember arc, and architectural grid.
 */
export function BerryMonogram({
  size = 'md',
  surface = 'auto',
  framed = false,
  className,
}: BerryMonogramProps) {
  const frameBg =
    surface === 'dark'
      ? 'bg-[#121417] border-[#F3F0E9]/22'
      : surface === 'light'
      ? 'bg-[#F6F4EF] border-[#141618]/20'
      : 'bg-[#F6F4EF] border-[#141618]/20 dark:bg-[#121417] dark:border-[#F3F0E9]/22';

  const letterFill =
    surface === 'dark'
      ? 'fill-[#F3F0E9]'
      : surface === 'light'
      ? 'fill-[#141618]'
      : 'fill-[#141618] dark:fill-[#F3F0E9]';

  const emberFill =
    surface === 'dark'
      ? 'fill-[#EC743C]'
      : surface === 'light'
      ? 'fill-[#9E4B28]'
      : 'fill-[#9E4B28] dark:fill-[#EC743C]';

  const svg = (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn(SIZE_MAP[size], !framed && className)}
    >
      <path
        d="M17 14H35.5C42.6 14 47.2 17.7 47.2 23.4C47.2 27.2 44.8 30.1 41.2 31.6C45.6 33.1 48.5 36.6 48.5 41.4C48.5 47.7 43.4 51.2 35.8 51.2H17V14ZM24.5 28.8H34.2C37.6 28.8 39.4 27.2 39.4 24.5C39.4 21.8 37.6 20.4 34.2 20.4H24.5V28.8ZM24.5 44.7H35.1C38.8 44.7 40.8 43 40.8 39.9C40.8 36.9 38.8 35.1 35.1 35.1H24.5V44.7Z"
        className={letterFill}
      />
      <path
        d="M13 20.2C23.2 11.4 38.5 8.8 51.5 11.4C43.6 13.1 34.1 16 25.2 21.3L13 20.2Z"
        className={emberFill}
      />
      <rect x="17" y="54" width="15" height="2.6" className={emberFill} />
    </svg>
  );

  if (!framed) return svg;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border shrink-0 select-none',
        frameBg,
        SIZE_MAP[size],
        'p-1.5',
        className
      )}
    >
      {svg}
    </span>
  );
}

export default BerryMonogram;
