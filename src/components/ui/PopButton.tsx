import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type PopButtonVariant = 'brand' | 'crimson' | 'rose';
export type PopButtonSize = 'sm' | 'md' | 'lg';

export interface PopButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional internal route — renders a React Router Link with identical 3D tactile pop physics. */
  to?: string;
  /** Optional external href — renders an anchor tag cleanly. */
  href?: string;
  /** Color theme harmonised to Berry Alloys corporate palette or classic VengeanceUI soft-rose. */
  variant?: PopButtonVariant;
  /** Size preset */
  size?: PopButtonSize;
}

const VARIANT_CLASSES: Record<PopButtonVariant, string> = {
  brand: [
    'text-[#10243A] dark:text-[#07111F]',
    'bg-[#E7F3FA] border-2 border-[#006393]',
    'shadow-[0_10px_0_-2px_#9AD9FA,0_10px_0_0_#006393,0_18px_0_0_#CFEAF8]',
    'dark:shadow-[0_10px_0_-2px_#0A6AA1,0_10px_0_0_#69C5F5,0_18px_14px_-4px_rgba(0,0,0,0.45)]',
    'hover:bg-[#D8EEFA] hover:translate-y-1',
    'hover:shadow-[0_6px_0_-2px_#9AD9FA,0_6px_0_0_#006393,0_12px_0_0_#CFEAF8]',
    'dark:hover:shadow-[0_6px_0_-2px_#0A6AA1,0_6px_0_0_#69C5F5,0_12px_10px_-4px_rgba(0,0,0,0.45)]',
    'active:bg-[#CBE8F8] active:translate-y-2.5',
    'active:shadow-[0_0px_0_-2px_#9AD9FA,0_0px_0_0_#006393,0_0px_0_0_#CFEAF8]',
    'dark:active:shadow-[0_0px_0_-2px_#0A6AA1,0_0px_0_0_#69C5F5,0_0px_0_0_rgba(0,0,0,0)]',
  ].join(' '),
  crimson: [
    'text-[#FFFFFF] dark:text-[#FFFFFF]',
    'bg-[#C9233B] border-2 border-[#7A1323]',
    'shadow-[0_10px_0_-2px_#9E1A2E,0_10px_0_0_#5E0D19,0_18px_0_0_rgba(201,35,59,0.22)]',
    'dark:shadow-[0_10px_0_-2px_#8A1527,0_10px_0_0_#4A0A14,0_18px_14px_-4px_rgba(0,0,0,0.5)]',
    'hover:bg-[#D62B44] hover:translate-y-1',
    'hover:shadow-[0_6px_0_-2px_#9E1A2E,0_6px_0_0_#5E0D19,0_12px_0_0_rgba(201,35,59,0.22)]',
    'dark:hover:shadow-[0_6px_0_-2px_#8A1527,0_6px_0_0_#4A0A14,0_12px_10px_-4px_rgba(0,0,0,0.5)]',
    'active:bg-[#B21D33] active:translate-y-2.5',
    'active:shadow-[0_0px_0_-2px_#9E1A2E,0_0px_0_0_#5E0D19,0_0px_0_0_rgba(0,0,0,0)]',
  ].join(' '),
  rose: [
    'text-[#382b22] dark:text-[#382b22]',
    'bg-[#fff0f0] border-2 border-[#b18597]',
    'shadow-[0_10px_0_-2px_#f9c4d2,0_10px_0_0_#b18597,0_18px_0_0_#ffe3e2]',
    'dark:shadow-[0_10px_0_-2px_#f9c4d2,0_10px_0_0_#b18597,0_18px_15px_-5px_rgba(0,0,0,0.35)]',
    'hover:bg-[#ffe9e9] hover:translate-y-1',
    'hover:shadow-[0_6px_0_-2px_#f9c4d2,0_6px_0_0_#b18597,0_12px_0_0_#ffe3e2]',
    'dark:hover:shadow-[0_6px_0_-2px_#f9c4d2,0_6px_0_0_#b18597,0_12px_10px_-5px_rgba(0,0,0,0.35)]',
    'active:bg-[#ffe9e9] active:translate-y-2.5',
    'active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_#ffe3e2]',
    'dark:active:shadow-[0_0px_0_-2px_#f9c4d2,0_0px_0_0_#b18597,0_0px_0_0_rgba(0,0,0,0)]',
  ].join(' '),
};

const SIZE_CLASSES: Record<PopButtonSize, string> = {
  sm: 'px-5 py-2.5 text-[11px] gap-2 rounded-lg',
  md: 'px-6 py-3.5 text-xs gap-2.5 rounded-xl',
  lg: 'px-8 py-4 text-xs sm:text-sm gap-2.5 rounded-xl',
};

/**
 * PopButton — Tactile 3D extruded push-button ported from VengeanceUI,
 * adapted with Berry Alloys corporate steel-blue, crimson, and soft-rose themes
 * plus seamless React Router Link support.
 */
export function PopButton({
  className,
  children = 'Learn More',
  to,
  href,
  variant = 'brand',
  size = 'md',
  type = 'button',
  ...props
}: PopButtonProps) {
  const classes = cn(
    'group relative inline-flex items-center justify-center font-mono-tabular font-semibold uppercase tracking-wider select-none cursor-pointer mb-3',
    'transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand',
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default PopButton;
