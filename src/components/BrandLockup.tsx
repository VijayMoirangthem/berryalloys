import { OFFICIAL_BRAND_MARK, OFFICIAL_BRAND_MARK_DARK } from '../data/assets';
import { cn } from '../lib/utils';

export type BrandLockupVariant = 'header' | 'hero' | 'footer' | 'drawer' | 'loader';
export type BrandLockupSurface = 'auto' | 'light' | 'dark';

export interface BrandLockupProps {
  variant?: BrandLockupVariant;
  surface?: BrandLockupSurface;
  className?: string;
}

/**
 * BrandLockup — Architectural brand lockup pairing the transparent light/dark
 * BERRY emblem variants with harmonized condensed industrial typography for
 * "Berry Alloys Limited" — seamlessly transparent on both ivory and obsidian surfaces.
 */
export function BrandLockup({
  variant = 'header',
  surface = 'auto',
  className,
}: BrandLockupProps) {
  const isFooter = variant === 'footer';
  const isHero = variant === 'hero';
  const isDrawer = variant === 'drawer';
  const isLoader = variant === 'loader';

  const emblemImgSizeClass = isFooter
    ? 'h-[28px] sm:h-[32px] w-auto'
    : isHero
    ? 'h-[26px] sm:h-[30px] w-auto'
    : isLoader
    ? 'h-[30px] sm:h-[34px] w-auto'
    : isDrawer
    ? 'h-[25px] w-auto'
    : 'h-[24px] sm:h-[28px] w-auto';

  const dividerColorClass =
    surface === 'dark'
      ? 'bg-[#F4F8FC]/28'
      : surface === 'light'
      ? 'bg-[#10243A]/22'
      : 'bg-[#10243A]/22 dark:bg-[#F4F8FC]/26';

  const primaryWordmarkColor =
    surface === 'dark'
      ? 'text-[#F4F8FC]'
      : surface === 'light'
      ? 'text-[#10243A]'
      : 'text-[#10243A] dark:text-[#F4F8FC]';

  const secondaryWordmarkColor =
    surface === 'dark'
      ? 'text-[#69C5F5]'
      : surface === 'light'
      ? 'text-brand'
      : 'text-brand dark:text-[#69C5F5]';

  const primaryWordmarkSize = isFooter
    ? 'text-[21px] sm:text-[23px]'
    : isHero
    ? 'text-[18px] sm:text-[20px]'
    : isLoader
    ? 'text-[22px] sm:text-[26px]'
    : isDrawer
    ? 'text-[17px]'
    : 'text-[16px] sm:text-[18px]';

  const secondaryWordmarkSize = isFooter
    ? 'text-[10px]'
    : isHero
    ? 'text-[9.5px]'
    : isLoader
    ? 'text-[10px]'
    : 'text-[9px]';

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap shrink-0 select-none',
        isFooter ? 'gap-3 sm:gap-3.5' : 'gap-2.5',
        className
      )}
    >
      <span className="inline-flex items-center justify-center shrink-0 bg-transparent p-0">
        {surface === 'light' && (
          <img
            src={OFFICIAL_BRAND_MARK}
            alt="Berry Alloys Limited emblem"
            className={cn('object-contain block', emblemImgSizeClass)}
          />
        )}
        {surface === 'dark' && (
          <img
            src={OFFICIAL_BRAND_MARK_DARK}
            alt="Berry Alloys Limited emblem"
            className={cn(
              'object-contain block drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]',
              emblemImgSizeClass
            )}
          />
        )}
        {surface === 'auto' && (
          <>
            <img
              src={OFFICIAL_BRAND_MARK}
              alt="Berry Alloys Limited emblem"
              className={cn('object-contain block dark:hidden', emblemImgSizeClass)}
            />
            <img
              src={OFFICIAL_BRAND_MARK_DARK}
              alt="Berry Alloys Limited emblem"
              className={cn(
                'object-contain hidden dark:block drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]',
                emblemImgSizeClass
              )}
            />
          </>
        )}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          'w-[1.5px] shrink-0 transition-colors duration-150',
          variant === 'header' ? 'hidden min-[460px]:block h-6' : 'block',
          isFooter ? 'h-8' : isHero ? 'h-7' : isLoader ? 'h-8' : 'h-6',
          dividerColorClass
        )}
      />

      <span
        className={cn(
          'flex flex-col justify-center leading-none text-left',
          variant === 'header' && 'hidden min-[460px]:flex'
        )}
      >
        <span
          className={cn(
            'font-display font-extrabold uppercase tracking-[0.045em] leading-[0.88]',
            primaryWordmarkSize,
            primaryWordmarkColor
          )}
        >
          Berry Alloys
        </span>
        <span
          className={cn(
            'font-mono-tabular font-semibold uppercase tracking-[0.28em] leading-none mt-[3px]',
            secondaryWordmarkSize,
            secondaryWordmarkColor
          )}
        >
          Limited
        </span>
      </span>
    </span>
  );
}

export default BrandLockup;
