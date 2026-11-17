import { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * IndustrialButton — Dual-theme mechanical sweep button supporting React Router (`to`),
 * anchor links (`href`), and native `<button>` actions.
 */
interface IndustrialButtonBaseProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline-dark' | 'outline-light';
  className?: string;
}

type ButtonProps = IndustrialButtonBaseProps &
  (
    | { to: string; href?: never; type?: never; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; disabled?: never }
    | { href: string; to?: never; type?: never; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void; disabled?: never }
    | {
        to?: never;
        href?: never;
        type?: 'button' | 'submit' | 'reset';
        onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
        disabled?: boolean;
      }
  );

const VARIANT_CLASSES: Record<
  NonNullable<IndustrialButtonBaseProps['variant']>,
  { container: string; sweep: string }
> = {
  primary: {
    container:
      'bg-brand text-[#FFFFFF] border-brand hover:border-brand-hover dark:bg-[#0A6AA1] dark:border-[#0A6AA1] dark:hover:border-[#69C5F5]',
    sweep: 'bg-brand-hover dark:bg-[#69C5F5]/20',
  },
  secondary: {
    container:
      'bg-[#10243A] text-[#FFFFFF] border-[#10243A] hover:border-brand dark:bg-[#F4F8FC] dark:text-[#10243A] dark:border-[#F4F8FC] dark:hover:text-[#FFFFFF] dark:hover:border-[#69C5F5]',
    sweep: 'bg-brand dark:bg-[#0A6AA1]',
  },
  'outline-dark': {
    container:
      'bg-transparent text-[#F4F8FC] border-[#F4F8FC]/35 hover:text-[#10243A] hover:border-[#F4F8FC]',
    sweep: 'bg-[#F4F8FC]',
  },
  'outline-light': {
    container:
      'bg-transparent text-[#10243A] border-[#10243A]/30 hover:text-[#FFFFFF] hover:border-[#10243A] dark:text-[#F4F8FC] dark:border-[#F4F8FC]/30 dark:hover:text-[#10243A] dark:hover:border-[#F4F8FC]',
    sweep: 'bg-[#10243A] dark:bg-[#F4F8FC]',
  },
};

export function IndustrialButton(props: ButtonProps) {
  const { children, variant = 'primary', className = '' } = props;
  const styles = VARIANT_CLASSES[variant];
  const base =
    'group relative overflow-hidden inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide border transition-colors duration-350 active:translate-y-[1px] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  const classes = `${base} ${styles.container} ${className}`;

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${styles.sweep}`}
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2.5 [&_svg]:transition-transform [&_svg]:duration-400 group-hover:[&_svg]:translate-x-1">
        {children}
      </span>
    </>
  );

  if (typeof props.to === 'string') {
    return (
      <Link to={props.to} onClick={props.onClick} className={classes}>
        {content}
      </Link>
    );
  }

  if (typeof props.href === 'string') {
    return (
      <a href={props.href} onClick={props.onClick} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
    >
      {content}
    </button>
  );
}
