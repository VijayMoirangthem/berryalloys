import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

/**
 * RouteTransitionLoader — Non-blocking top Berry-blue-to-crimson progress hairline +
 * sleek circular orbital loading badge during route transitions or lazy chunk lags.
 * Never washes the viewport in white and never blocks scroll or pointer events.
 */
export function RouteTransitionLoader() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const isFirstRenderRef = useRef(true);
  const [barKey, setBarKey] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [showOrbitalBadge, setShowOrbitalBadge] = useState(false);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setBarKey((k) => k + 1);
    setShowBar(true);

    let showBadgeTimer: number | null = null;
    let hideBadgeTimer: number | null = null;
    let hideBarTimer: number | null = null;

    if (!reduced) {
      // Compact circular orbital indicator appears smoothly on transition and clears rapidly
      showBadgeTimer = window.setTimeout(() => {
        setShowOrbitalBadge(true);
      }, 40);

      hideBadgeTimer = window.setTimeout(() => {
        setShowOrbitalBadge(false);
      }, 420);
    }

    hideBarTimer = window.setTimeout(() => {
      setShowBar(false);
    }, reduced ? 180 : 480);

    return () => {
      if (showBadgeTimer) window.clearTimeout(showBadgeTimer);
      if (hideBadgeTimer) window.clearTimeout(hideBadgeTimer);
      if (hideBarTimer) window.clearTimeout(hideBarTimer);
    };
  }, [pathname]);

  if (!showBar && !showOrbitalBadge) return null;

  const isDark = theme === 'dark';

  return (
    <>
      {showBar && (
        <div
          key={`route-bar-${barKey}`}
          aria-hidden="true"
          data-route-progress="true"
          className="fixed inset-x-0 top-0 z-[70] h-[2.5px] pointer-events-none overflow-hidden bg-transparent"
        >
          <div className="h-full w-full bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B] route-progress-bar" />
        </div>
      )}

      {showOrbitalBadge && (
        <div
          aria-hidden="true"
          data-route-orbital="true"
          className="fixed top-[76px] right-4 sm:right-6 z-[68] pointer-events-none flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full border shadow-lg transition-opacity duration-200"
          style={{
            backgroundColor: isDark ? 'rgba(13, 27, 46, 0.94)' : 'rgba(255, 255, 255, 0.96)',
            borderColor: isDark ? 'rgba(105, 197, 245, 0.3)' : 'rgba(16, 36, 58, 0.14)',
          }}
        >
          {/* Mini circular dual-arc orbital spinner */}
          <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0" aria-hidden="true">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke={isDark ? 'rgba(244,248,252,0.12)' : 'rgba(16,36,58,0.12)'}
              strokeWidth="2"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#006393"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="34 54"
              className="berry-orbit-fast"
            />
            <circle
              cx="18"
              cy="18"
              r="9.5"
              fill="none"
              stroke="#C9233B"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="18 42"
              className="berry-orbit-ccw"
            />
            <circle cx="18" cy="18" r="2.2" fill={isDark ? '#69C5F5' : '#006393'} />
          </svg>
          <span
            className="text-[10px] font-mono-tabular uppercase tracking-[0.18em] font-semibold"
            style={{ color: isDark ? '#F4F8FC' : '#10243A' }}
          >
            Loading
          </span>
        </div>
      )}
    </>
  );
}
