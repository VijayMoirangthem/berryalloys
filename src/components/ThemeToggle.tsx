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
      className={`inline-flex items-center justify-center w-10 h-10 border transition-colors duration-300 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#69C5F5] focus-visible:outline-offset-2 ${
        overDarkHero
          ? 'border-[#F4F8FC]/25 bg-[#07111F]/60 text-[#F4F8FC] hover:border-[#69C5F5] hover:text-[#69C5F5]'
          : 'border-[#10243A]/20 bg-[#FFFFFF]/70 text-[#10243A] hover:border-brand hover:text-brand dark:border-[#F4F8FC]/22 dark:bg-[#0D1B2E] dark:text-[#F4F8FC] dark:hover:border-[#69C5F5] dark:hover:text-[#69C5F5]'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#69C5F5]" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-brand dark:text-[#69C5F5]" aria-hidden="true" />
      )}
    </button>
  );
}
