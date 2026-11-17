import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BerryMonogram } from '../BerryMonogram';
import { BrandLockup } from '../BrandLockup';

const SESSION_KEY = 'berry-alloys-intro-seen';

/**
 * KineticLoader — Adapted from VengeanceUI KineticTextLoader for Berry Alloys Limited.
 * Displays a crisp, non-blocking ~950ms industrial intro reveal on fresh session entry
 * while leaving underlying DOM mounted and honoring prefers-reduced-motion.
 */
export function KineticLoader() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!visible) return;
    if (prefersReduced) {
      setVisible(false);
      return;
    }

    try {
      window.sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // Ignore storage failures
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [visible, prefersReduced]);

  const dismissNow = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // Ignore storage failures
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading Berry Alloys Limited presentation"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[70] bg-[#07111F] text-[#F4F8FC] flex flex-col items-center justify-center px-6 select-none"
        >
          {/* Subtle architectural blueprint hairlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(244,248,252,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,248,252,0.08) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-3.5"
            >
              <BrandLockup variant="loader" surface="dark" />
              <span className="font-mono-tabular text-[11px] uppercase tracking-[0.26em] text-[#69C5F5]">
                DKG Group Enterprise · Est. 2006
              </span>
            </motion.div>

            {/* Kinetic Orbit 'B' Monogram + Full Company Wordmark */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 border border-[#F4F8FC]/25 bg-[#0D1B2E] flex items-center justify-center">
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                  className="block w-full h-full relative"
                >
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#69C5F5]" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#F4F8FC]" />
                </motion.span>
                <span className="absolute flex items-center justify-center">
                  <BerryMonogram size="sm" surface="dark" />
                </span>
              </div>

              <motion.p
                initial={{ letterSpacing: '0.18em', opacity: 0 }}
                animate={{ letterSpacing: '0.04em', opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-[#F4F8FC]"
              >
                Berry Alloys Limited
              </motion.p>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="w-52 h-[2px] origin-left bg-gradient-to-r from-brand via-[#69C5F5] to-[#F4F8FC]"
            />

            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#B5C5D7]">
              From Heat to Precision · Ferro Alloys
            </p>
          </div>

          <button
            type="button"
            onClick={dismissNow}
            className="absolute bottom-8 right-8 px-3.5 py-2 text-[11px] font-mono-tabular uppercase tracking-wider text-[#B5C5D7] hover:text-[#F4F8FC] border border-[#F4F8FC]/18 hover:border-[#69C5F5] transition-colors cursor-pointer"
          >
            Enter Site →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
