import { cn } from '../lib/utils';
import berryMark from '../assets/images/official/berry_mark.png';

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

/** BerryMonogram — the official glossy blue "B" short logo (same artwork as the browser-tab icon). */
export function BerryMonogram({ size = 'md', surface = 'auto', framed = false, className }: BerryMonogramProps) {
  const frameBg =
    surface === 'dark'
      ? 'bg-[#07111F] border-[#F4F8FC]/22'
      : surface === 'light'
      ? 'bg-[#FFFFFF] border-[#10243A]/20'
      : 'bg-[#FFFFFF] border-[#10243A]/20 dark:bg-[#07111F] dark:border-[#F4F8FC]/22';

  const img = (
    <img
      src={berryMark}
      alt=""
      aria-hidden="true"
      draggable={false}
      width={64}
      height={64}
      className={cn(framed ? 'w-full h-full' : SIZE_MAP[size], 'object-contain', !framed && className)}
    />
  );

  if (!framed) return img;

  return (
    <span className={cn('inline-flex items-center justify-center border shrink-0 select-none p-1', frameBg, SIZE_MAP[size], className)}>
      {img}
    </span>
  );
}

export default BerryMonogram;
