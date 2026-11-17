import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface SpotlightNavItem {
  label: string;
  to: string;
}

interface SpotlightNavbarProps {
  items: SpotlightNavItem[];
  ariaLabel?: string;
  className?: string;
}

/**
 * SpotlightNavbar — Adapted from VengeanceUI SpotlightNavbar.
 * Cursor-tracking copper ambient spotlight bar with crisp copper underline bar.
 */
export function SpotlightNavbar({
  items,
  ariaLabel = 'Secondary section navigation',
  className,
}: SpotlightNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
    };

    const handleLeave = () => {
      el.style.setProperty('--spotlight-x', '-160px');
    };

    el.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 bg-[#ECE8DF]/88 dark:bg-[#191C20]/95 backdrop-blur-md transition-colors',
        className
      )}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 overflow-x-auto">
        <div
          ref={navRef}
          className="relative inline-flex min-w-full sm:min-w-0 items-center gap-1.5 border border-[#141618]/12 dark:border-[#F3F0E9]/14 bg-[#F6F4EF]/75 dark:bg-[#121417]/75 px-2 py-1 overflow-hidden"
          style={{ ['--spotlight-x' as string]: '-160px' }}
        >
          {/* Ambient Pointer Spotlight Wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(110px circle at var(--spotlight-x, -160px) 50%, rgba(236, 116, 60, 0.16), transparent 72%)',
            }}
          />

          {items.map((item, idx) => (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={({ isActive }) =>
                cn(
                  'relative z-10 min-h-[38px] flex items-center px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors border',
                  isActive
                    ? 'bg-[#FFFFFF] dark:bg-[#20242A] text-[#141618] dark:text-[#F3F0E9] font-semibold border-[#9E4B28]/45 dark:border-[#EC743C]/45 shadow-xs'
                    : hoveredIndex === idx
                    ? 'bg-[#FFFFFF]/55 dark:bg-[#20242A]/55 text-[#141618] dark:text-[#F3F0E9] border-transparent'
                    : 'text-[#4A5054] dark:text-[#A1A7AB] border-transparent hover:text-[#141618] dark:hover:text-[#F3F0E9]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 -bottom-px h-[2px] bg-[#9E4B28] dark:bg-[#EC743C]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
