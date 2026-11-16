import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  /** When sitting over the transparent/dark hero top bar before scrolling */
  overDarkHero?: boolean;
  className?: string;
}

export function ThemeToggle({ overDarkHero = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} colour theme`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
        overDarkHero
          ? 'border-[#F3F0E9]/25 bg-[#121417]/60 text-[#F3F0E9] hover:border-[#EC743C] hover:text-[#EC743C]'
          : 'border-[#141618]/20 bg-[#FFFFFF]/70 text-[#141618] hover:border-[#9E4B28] hover:text-[#9E4B28] dark:border-[#F3F0E9]/22 dark:bg-[#191C20] dark:text-[#F3F0E9] dark:hover:border-[#EC743C] dark:hover:text-[#EC743C]'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#EC743C]" aria-hidden="true" />
          <span className="hidden md:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#9E4B28] dark:text-[#EC743C]" aria-hidden="true" />
          <span className="hidden md:inline">Dark</span>
        </>
      )}
    </button>
  );
}
