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
      'bg-[#9E4B28] text-[#F6F4EF] border-[#9E4B28] hover:border-[#823B1D] dark:bg-[#A95632] dark:border-[#A95632] dark:hover:border-[#EC743C]',
    sweep: 'bg-[#823B1D] dark:bg-[#EC743C]/20',
  },
  secondary: {
    container:
      'bg-[#141618] text-[#F6F4EF] border-[#141618] hover:border-[#9E4B28] dark:bg-[#F3F0E9] dark:text-[#141618] dark:border-[#F3F0E9] dark:hover:text-[#F6F4EF] dark:hover:border-[#EC743C]',
    sweep: 'bg-[#9E4B28] dark:bg-[#A95632]',
  },
  'outline-dark': {
    container:
      'bg-transparent text-[#F3F0E9] border-[#F3F0E9]/35 hover:text-[#141618] hover:border-[#F3F0E9]',
    sweep: 'bg-[#F3F0E9]',
  },
  'outline-light': {
    container:
      'bg-transparent text-[#141618] border-[#141618]/30 hover:text-[#F6F4EF] hover:border-[#141618] dark:text-[#F3F0E9] dark:border-[#F3F0E9]/30 dark:hover:text-[#141618] dark:hover:border-[#F3F0E9]',
    sweep: 'bg-[#141618] dark:bg-[#F3F0E9]',
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
