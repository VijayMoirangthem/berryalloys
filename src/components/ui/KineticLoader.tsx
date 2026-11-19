import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OFFICIAL_BRAND_MARK, OFFICIAL_BRAND_MARK_DARK } from '../../data/assets';
import { useTheme } from '../../context/ThemeContext';
import { useMotion } from '../../context/MotionContext';
import { setLoaderState, triggerHeroEntranceRipple } from '../../lib/motionDiagnostics';

/**
 * Exact quadratic curve following the authentic Berry sweep above the BERRY wordmark
 * on the 339x114 official raster artwork (berry_logo_clean.png & berry_logo_dark.png).
 */
const SWEEP_START = { x: 102, y: 45 };
const SWEEP_CTRL = { x: 178, y: 12 };
const SWEEP_END = { x: 279, y: 5 };

// In-memory guard so in-app SPA navigation never replays the splash, while every fresh load/reload of `/` plays it cleanly.
let introPlayedThisDocumentLoad = false;

export function triggerReplayIntro() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('berry:replay-intro'));
  }
}

function evalSweepPoint(t: number): { x: number; y: number } {
  const u = 1 - t;
  const x = u * u * SWEEP_START.x + 2 * u * t * SWEEP_CTRL.x + t * t * SWEEP_END.x;
  const y = u * u * SWEEP_START.y + 2 * u * t * SWEEP_CTRL.y + t * t * SWEEP_END.y;
  return { x, y };
}

interface SparkFragment {
  id: number;
  spawnAt: number;
  fanX: number;
  fanY: number;
  size: number;
  color: 'blue' | 'red' | 'silver';
}

const SPARK_FRAGMENTS: SparkFragment[] = [
  { id: 0, spawnAt: 0.12, fanX: -14, fanY: -10, size: 3.2, color: 'red' },
  { id: 1, spawnAt: 0.22, fanX: -9, fanY: 12, size: 2.6, color: 'silver' },
  { id: 2, spawnAt: 0.34, fanX: -16, fanY: -13, size: 3.4, color: 'blue' },
  { id: 3, spawnAt: 0.46, fanX: -7, fanY: 11, size: 2.8, color: 'red' },
  { id: 4, spawnAt: 0.58, fanX: -17, fanY: -9, size: 3.2, color: 'blue' },
  { id: 5, spawnAt: 0.70, fanX: -10, fanY: 10, size: 2.5, color: 'silver' },
  { id: 6, spawnAt: 0.82, fanX: -12, fanY: -8, size: 2.9, color: 'blue' },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

function easeInOutQuad(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
}

/**
 * KineticLoader — Signature ~1.6s Berry Alloys corporate logo entrance.
 * Uses native <img> layers clipped with GPU-accelerated CSS clip-path (avoiding iOS WebKit
 * SVG <image>+<clipPath> repaint bugs) overlaid with a sharp SVG spark & alloy fragment trail:
 *   0–220 ms     Clean theme field; spark ignites at Berry's sweep origin.
 *   220–720 ms   Spark accelerates along the authentic sweep curve with metallic alloy fragments.
 *   540–1180 ms  Traveling left-to-right mask reveals the crisp official BERRY wordmark + holds legible.
 *   1180–1560 ms Field dissolves into the homepage and triggers one left-to-right handoff ripple
 *                across the hero particle lettering.
 */
export function KineticLoader() {
  const { theme } = useTheme();
  const { reducedMotion } = useMotion();
  const [runId, setRunId] = useState(0);
  const [mounted, setMounted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    if (path !== '/' && path !== '') return false;
    if (introPlayedThisDocumentLoad) return false;
    return true;
  });
  const [exiting, setExiting] = useState(false);

  // Direct DOM refs for jitter-free 60fps animation on mobile & desktop
  const sweepLayerRef = useRef<HTMLDivElement>(null);
  const wordmarkLayerRef = useRef<HTMLDivElement>(null);
  const progressHairlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const sparkHeadRef = useRef<SVGCircleElement>(null);
  const sparkHaloRef = useRef<SVGCircleElement>(null);
  const fragmentRefs = useRef<Array<SVGRectElement | null>>([]);
  const dismissedRef = useRef(false);

  const finishSplash = useCallback(
    (status: 'ready' | 'skipped' | 'recovered', reason: string) => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      introPlayedThisDocumentLoad = true;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      setExiting(true);
      setLoaderState(status, reason);
      triggerHeroEntranceRipple();
      window.setTimeout(() => {
        setMounted(false);
        setExiting(false);
        ScrollTrigger.refresh();
      }, reducedMotion ? 160 : 380);
    },
    [reducedMotion]
  );

  // Allow live replay from the footer "Replay intro" control during client presentations
  useEffect(() => {
    const onReplay = () => {
      dismissedRef.current = false;
      setExiting(false);
      setMounted(true);
      setRunId((n) => n + 1);
    };
    window.addEventListener('berry:replay-intro', onReplay);
    return () => window.removeEventListener('berry:replay-intro', onReplay);
  }, []);

  useEffect(() => {
    if (!mounted) {
      if (!introPlayedThisDocumentLoad) {
        setLoaderState('skipped', 'Direct non-homepage entry route');
      }
      return;
    }

    dismissedRef.current = false;
    introPlayedThisDocumentLoad = true;
    setLoaderState('pending', reducedMotion ? 'Reduced-motion logo reveal' : 'Berry logo splash active');

    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Reduced-motion path: immediate crisp logo reveal, brief readable hold, clean exit
    if (reducedMotion) {
      if (sweepLayerRef.current) sweepLayerRef.current.style.clipPath = 'inset(0% 0% 59% 0%)';
      if (wordmarkLayerRef.current) wordmarkLayerRef.current.style.clipPath = 'inset(41% 0% 0% 0%)';
      if (progressHairlineRef.current) progressHairlineRef.current.style.transform = 'scaleX(1)';
      if (subtitleRef.current) subtitleRef.current.style.opacity = '1';
      if (sparkHeadRef.current) sparkHeadRef.current.style.opacity = '0';
      if (sparkHaloRef.current) sparkHaloRef.current.style.opacity = '0';

      const timer = window.setTimeout(() => {
        finishSplash('ready', 'Reduced-motion immediate logo reveal completed');
      }, 520);

      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = prevBodyOverflow;
      };
    }

    // Reset initial masked frame before first paint
    if (sweepLayerRef.current) sweepLayerRef.current.style.clipPath = 'inset(0% 100% 59% 0%)';
    if (wordmarkLayerRef.current) wordmarkLayerRef.current.style.clipPath = 'inset(41% 100% 0% 0%)';
    if (progressHairlineRef.current) progressHairlineRef.current.style.transform = 'scaleX(0)';
    if (subtitleRef.current) {
      subtitleRef.current.style.opacity = '0';
      subtitleRef.current.style.transform = 'translate3d(0, 6px, 0)';
    }

    let rafId = 0;
    let handoffFired = false;
    let lastNow: number | null = null;
    let elapsed = 0;

    const step = (now: number) => {
      if (dismissedRef.current) return;
      if (lastNow === null) {
        lastNow = now;
      } else {
        // Clamp frame delta so initial hydration / Three.js init stalls can never skip past the splash
        const dt = Math.max(0, Math.min(48, now - lastNow));
        elapsed += dt;
        lastNow = now;
      }

      // Subtle architectural hairline progress across 0..1360ms
      if (progressHairlineRef.current) {
        const lineP = Math.min(1, elapsed / 1320);
        progressHairlineRef.current.style.transform = `scaleX(${easeOutCubic(lineP).toFixed(4)})`;
      }

      // Phase 1 (0–220ms): Point of light ignites at sweep origin
      if (elapsed < 220) {
        const p = easeOutCubic(elapsed / 220);
        if (sparkHeadRef.current) {
          sparkHeadRef.current.setAttribute('cx', String(SWEEP_START.x));
          sparkHeadRef.current.setAttribute('cy', String(SWEEP_START.y));
          sparkHeadRef.current.setAttribute('r', (1.4 + p * 3.0).toFixed(2));
          sparkHeadRef.current.style.opacity = p.toFixed(2);
        }
        if (sparkHaloRef.current) {
          sparkHaloRef.current.setAttribute('cx', String(SWEEP_START.x));
          sparkHaloRef.current.setAttribute('cy', String(SWEEP_START.y));
          sparkHaloRef.current.setAttribute('r', (5 + p * 11).toFixed(2));
          sparkHaloRef.current.style.opacity = (p * 0.5).toFixed(2);
        }
      }

      // Phase 2 (220–760ms): Spark accelerates along Berry's actual sweep curve with alloy fragments
      if (elapsed >= 220 && elapsed <= 880) {
        const sweepT = easeInOutQuad((elapsed - 220) / 540);
        const pt = evalSweepPoint(sweepT);
        const tailFade = elapsed > 760 ? Math.max(0, 1 - (elapsed - 760) / 120) : 1;

        if (sparkHeadRef.current) {
          sparkHeadRef.current.setAttribute('cx', pt.x.toFixed(1));
          sparkHeadRef.current.setAttribute('cy', pt.y.toFixed(1));
          sparkHeadRef.current.setAttribute('r', (4.0 * tailFade + 0.7).toFixed(2));
          sparkHeadRef.current.style.opacity = tailFade.toFixed(2);
        }
        if (sparkHaloRef.current) {
          sparkHaloRef.current.setAttribute('cx', pt.x.toFixed(1));
          sparkHaloRef.current.setAttribute('cy', pt.y.toFixed(1));
          sparkHaloRef.current.setAttribute('r', (14 * tailFade + 2.5).toFixed(2));
          sparkHaloRef.current.style.opacity = (tailFade * 0.48).toFixed(2);
        }
        if (sweepLayerRef.current) {
          const revealPct = Math.min(100, Math.max(0, ((pt.x + 12) / 339) * 100));
          sweepLayerRef.current.style.clipPath = `inset(0% ${(100 - revealPct).toFixed(2)}% 59% 0%)`;
        }

        for (let i = 0; i < SPARK_FRAGMENTS.length; i++) {
          const frag = SPARK_FRAGMENTS[i];
          const el = fragmentRefs.current[i];
          if (!el) continue;
          const localAge = (sweepT - frag.spawnAt) / 0.38;
          if (localAge <= 0 || localAge >= 1.15) {
            el.style.opacity = '0';
          } else {
            const origin = evalSweepPoint(frag.spawnAt);
            const fanCurve = Math.sin(Math.min(1, localAge) * Math.PI);
            const fx = origin.x + frag.fanX * fanCurve;
            const fy = origin.y + frag.fanY * fanCurve;
            const alpha = localAge < 0.2 ? localAge / 0.2 : Math.max(0, 1 - (localAge - 0.2) / 0.95);
            el.setAttribute('x', (fx - frag.size / 2).toFixed(1));
            el.setAttribute('y', (fy - frag.size / 2).toFixed(1));
            el.setAttribute('transform', `rotate(${(localAge * 48 + i * 28).toFixed(0)} ${fx.toFixed(1)} ${fy.toFixed(1)})`);
            el.style.opacity = (alpha * 0.92 * tailFade).toFixed(2);
          }
        }
      } else if (elapsed > 880) {
        if (sweepLayerRef.current) sweepLayerRef.current.style.clipPath = 'inset(0% 0% 59% 0%)';
        if (sparkHeadRef.current) sparkHeadRef.current.style.opacity = '0';
        if (sparkHaloRef.current) sparkHaloRef.current.style.opacity = '0';
        for (let i = 0; i < SPARK_FRAGMENTS.length; i++) {
          const el = fragmentRefs.current[i];
          if (el) el.style.opacity = '0';
        }
      }

      // Phase 3 (520–1420ms): Traveling left-to-right mask reveals crisp BERRY wordmark, then holds cleanly to read
      if (elapsed >= 520) {
        const wordP = easeOutCubic((elapsed - 520) / 500);
        if (wordmarkLayerRef.current) {
          wordmarkLayerRef.current.style.clipPath = `inset(41% ${((1 - wordP) * 100).toFixed(2)}% 0% 0%)`;
        }
        if (subtitleRef.current) {
          const subP = easeOutCubic((elapsed - 720) / 320);
          subtitleRef.current.style.opacity = subP.toFixed(2);
          subtitleRef.current.style.transform = `translate3d(0, ${((1 - subP) * 6).toFixed(1)}px, 0)`;
        }
      }

      // Phase 4 (1420–1800ms): Dissolve into homepage & hand off ripple into hero particle lettering
      if (elapsed >= 1420 && !handoffFired) {
        handoffFired = true;
        finishSplash('ready', 'Signature Berry sweep splash completed');
        return;
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);

    // Bounded recovery failsafe so the homepage is always usable even if rAF throttles
    const failsafe = window.setTimeout(() => {
      finishSplash('recovered', 'Bounded splash recovery timer elapsed');
    }, 4500);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(failsafe);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [mounted, runId, reducedMotion, finishSplash]);

  if (!mounted) return null;

  const isDark = theme === 'dark';
  const logoSrc = isDark ? OFFICIAL_BRAND_MARK_DARK : OFFICIAL_BRAND_MARK;
  const sparkCoreColor = isDark ? '#F4F8FC' : '#FFFFFF';
  const sparkHaloColor = isDark ? '#69C5F5' : '#006393';
  const fragmentColors: Record<SparkFragment['color'], string> = {
    blue: isDark ? '#69C5F5' : '#006393',
    red: '#C9233B',
    silver: isDark ? '#C8D8EA' : '#5E748B',
  };

  return (
    <div
      data-berry-splash={exiting ? 'exiting' : 'active'}
      role="status"
      aria-live="polite"
      aria-label="Berry Alloys Limited entrance"
      className={`fixed inset-0 z-[95] flex flex-col items-center justify-center px-6 select-none transition-opacity duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isDark ? 'bg-[#07111F] text-[#F4F8FC]' : 'bg-[#FFFFFF] text-[#10243A]'
      } ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Subtle architectural drafting grid */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${isDark ? 'opacity-15' : 'opacity-[0.06]'}`}
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(105,197,245,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(105,197,245,0.22) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(16,36,58,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,36,58,0.28) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-[300px] sm:max-w-[390px]">
        {/* Authentic high-resolution Berry logo revealed via native HTML <img> + GPU clip-path */}
        <div
          className="relative w-full"
          style={{ aspectRatio: '339 / 114' }}
          role="img"
          aria-label="Berry Alloys Limited official logo"
        >
          {/* Upper Berry brand sweep layer (native <img> for instant WebKit/iOS paint) */}
          <div
            ref={sweepLayerRef}
            className="absolute inset-0 will-change-[clip-path]"
            style={{ clipPath: reducedMotion ? 'inset(0% 0% 59% 0%)' : 'inset(0% 100% 59% 0%)' }}
          >
            <img
              src={logoSrc}
              alt=""
              width={339}
              height={114}
              decoding="sync"
              fetchPriority="high"
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Lower authentic BERRY wordmark layer */}
          <div
            ref={wordmarkLayerRef}
            className="absolute inset-0 will-change-[clip-path]"
            style={{ clipPath: reducedMotion ? 'inset(41% 0% 0% 0%)' : 'inset(41% 100% 0% 0%)' }}
          >
            <img
              src={logoSrc}
              alt="Berry Alloys Limited"
              width={339}
              height={114}
              decoding="sync"
              fetchPriority="high"
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Sharp SVG overlay strictly for the traveling alloy spark & trailing fragments */}
          <svg
            viewBox="0 0 339 114"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
          >
            <defs>
              <radialGradient id="berrySparkGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={sparkHaloColor} stopOpacity="0.9" />
                <stop offset="48%" stopColor={sparkHaloColor} stopOpacity="0.32" />
                <stop offset="100%" stopColor={sparkHaloColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            {SPARK_FRAGMENTS.map((frag, idx) => (
              <rect
                key={frag.id}
                ref={(el) => {
                  fragmentRefs.current[idx] = el;
                }}
                x={SWEEP_START.x}
                y={SWEEP_START.y}
                width={frag.size}
                height={frag.size}
                fill={fragmentColors[frag.color]}
                style={{ opacity: 0 }}
              />
            ))}
            <circle
              ref={sparkHaloRef}
              cx={SWEEP_START.x}
              cy={SWEEP_START.y}
              r="6"
              fill="url(#berrySparkGlow)"
              style={{ opacity: 0 }}
            />
            <circle
              ref={sparkHeadRef}
              cx={SWEEP_START.x}
              cy={SWEEP_START.y}
              r="2.4"
              fill={sparkCoreColor}
              stroke="#C9233B"
              strokeWidth="0.9"
              style={{ opacity: 0 }}
            />
          </svg>
        </div>

        {/* Fine Berry-blue-to-red architectural hairline */}
        <div
          aria-hidden="true"
          className={`w-48 sm:w-56 h-[1.5px] overflow-hidden ${
            isDark ? 'bg-[#F4F8FC]/12' : 'bg-[#10243A]/10'
          }`}
        >
          <div
            ref={progressHairlineRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B] will-change-transform"
            style={{ transform: reducedMotion ? 'scaleX(1)' : 'scaleX(0)' }}
          />
        </div>

        <p
          ref={subtitleRef}
          style={{ opacity: reducedMotion ? 1 : 0 }}
          className={`font-mono-tabular text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-center sm:whitespace-nowrap ${
            isDark ? 'text-[#B5C5D7]' : 'text-[#465C72]'
          }`}
        >
          Berry Alloys Limited · From Heat to Precision
        </p>
      </div>

      <button
        type="button"
        onClick={() => finishSplash('ready', 'Skipped by visitor')}
        className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 min-h-[44px] px-4 py-2 text-[11px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer ${
          isDark
            ? 'text-[#B5C5D7] hover:text-[#F4F8FC] border-[#F4F8FC]/20 hover:border-[#69C5F5]'
            : 'text-[#465C72] hover:text-[#10243A] border-[#10243A]/20 hover:border-brand'
        }`}
      >
        Skip intro
      </button>
    </div>
  );
}
