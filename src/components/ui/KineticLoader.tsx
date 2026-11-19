import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OFFICIAL_BRAND_MARK, OFFICIAL_BRAND_MARK_DARK } from '../../data/assets';
import { useTheme } from '../../context/ThemeContext';
import { useMotion } from '../../context/MotionContext';
import { setLoaderState, triggerHeroEntranceRipple } from '../../lib/motionDiagnostics';

// In-memory guard so in-app SPA navigation never replays the splash, while every fresh load/reload of `/` plays it cleanly.
let introPlayedThisDocumentLoad = false;

export function triggerReplayIntro() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('berry:replay-intro'));
  }
}

function easeOutCubic(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - c, 3);
}

function easeInOutQuart(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 8 * c * c * c * c : 1 - Math.pow(-2 * c + 2, 4) / 2;
}

const DIAL_SIZE = 264;
const DIAL_CENTER = DIAL_SIZE / 2;
const MAIN_RADIUS = 104;
const MAIN_CIRCUMFERENCE = 2 * Math.PI * MAIN_RADIUS;
const INNER_RADIUS = 88;
const OUTER_TICK_RADIUS_IN = 116;
const OUTER_TICK_RADIUS_OUT = 122;

/**
 * KineticLoader — Executive Circular Orbital Berry Alloys Loading Splash (~1.55s).
 * Immediately animated from frame 0 (zero blank white delay):
 *  - Precision 36-tick outer furnace-dial compass ring rotating counter-clockwise
 *  - Smooth SVG circular orbital progress arc sweeping 0% -> 100% in Berry Blue -> Sky -> Crimson
 *    led by a luminous molten orbital spark traveling cleanly along the circumference
 *  - Dual counter-rotating split inner orbital arcs framing a crisp glass-etched circular medallion
 *  - Authentic Berry Alloys official mark centered cleanly inside the circular dial
 *  - Clean circular expansion dissolve into the homepage + hero particle ripple handoff
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

  // Direct DOM refs for jitter-free 60fps orbital animation on iPhone & desktop
  const progressArcRef = useRef<SVGCircleElement>(null);
  const glowArcRef = useRef<SVGCircleElement>(null);
  const sparkHeadRef = useRef<SVGCircleElement>(null);
  const sparkHaloRef = useRef<SVGCircleElement>(null);
  const innerArcGroupRef = useRef<SVGGElement>(null);
  const tickRingRef = useRef<SVGGElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const dismissedRef = useRef(false);

  // Precompute 36 radial precision ticks around the orbital dial
  const dialTicks = useMemo(() => {
    return Array.from({ length: 36 }, (_, idx) => {
      const deg = idx * 10;
      const rad = ((deg - 90) * Math.PI) / 180;
      const isMajor = idx % 9 === 0;
      const isMid = idx % 3 === 0;
      const rIn = isMajor ? OUTER_TICK_RADIUS_IN - 3 : OUTER_TICK_RADIUS_IN;
      const rOut = isMajor ? OUTER_TICK_RADIUS_OUT + 2 : isMid ? OUTER_TICK_RADIUS_OUT : OUTER_TICK_RADIUS_OUT - 2;
      return {
        idx,
        isMajor,
        isMid,
        x1: DIAL_CENTER + rIn * Math.cos(rad),
        y1: DIAL_CENTER + rIn * Math.sin(rad),
        x2: DIAL_CENTER + rOut * Math.cos(rad),
        y2: DIAL_CENTER + rOut * Math.sin(rad),
      };
    });
  }, []);

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
      }, reducedMotion ? 150 : 380);
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
    setLoaderState(
      'pending',
      reducedMotion ? 'Reduced-motion circular emblem reveal' : 'Berry circular orbital splash active'
    );

    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Reduced-motion path: complete circular emblem & crisp logo immediately, brief readable hold, clean exit
    if (reducedMotion) {
      if (progressArcRef.current) progressArcRef.current.style.strokeDashoffset = '0';
      if (glowArcRef.current) glowArcRef.current.style.strokeDashoffset = '0';
      if (percentRef.current) percentRef.current.textContent = '100%';
      if (statusRef.current) statusRef.current.textContent = 'READY';
      if (logoWrapRef.current) {
        logoWrapRef.current.style.opacity = '1';
        logoWrapRef.current.style.transform = 'scale(1)';
      }

      const timer = window.setTimeout(() => {
        finishSplash('ready', 'Reduced-motion circular emblem completed');
      }, 520);

      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = prevBodyOverflow;
      };
    }

    let rafId = 0;
    let handoffFired = false;
    let lastNow: number | null = null;
    let elapsed = 0;

    const DURATION_SWEEP = 1120; // Smooth 0% -> 100% circular orbital sweep
    const DURATION_TOTAL = 1520; // Brief crisp completed hold before circular bloom exit

    const step = (now: number) => {
      if (dismissedRef.current) return;
      if (lastNow === null) {
        lastNow = now;
      } else {
        const dt = Math.max(0, Math.min(48, now - lastNow));
        elapsed += dt;
        lastNow = now;
      }

      const sweepLinear = Math.min(1, elapsed / DURATION_SWEEP);
      const sweepProgress = easeInOutQuart(sweepLinear);
      const dashOffset = MAIN_CIRCUMFERENCE * (1 - sweepProgress);

      if (progressArcRef.current) {
        progressArcRef.current.style.strokeDashoffset = dashOffset.toFixed(2);
      }
      if (glowArcRef.current) {
        glowArcRef.current.style.strokeDashoffset = dashOffset.toFixed(2);
      }

      // Orbiting molten spark traveling at the tip of the circular progress arc (starts at 12 o'clock)
      const angleRad = -Math.PI / 2 + sweepProgress * Math.PI * 2;
      const sx = DIAL_CENTER + MAIN_RADIUS * Math.cos(angleRad);
      const sy = DIAL_CENTER + MAIN_RADIUS * Math.sin(angleRad);
      const sparkAlpha = sweepLinear < 0.96 ? 1 : Math.max(0, 1 - (elapsed - DURATION_SWEEP) / 220);

      if (sparkHeadRef.current) {
        sparkHeadRef.current.setAttribute('cx', sx.toFixed(2));
        sparkHeadRef.current.setAttribute('cy', sy.toFixed(2));
        sparkHeadRef.current.style.opacity = sparkAlpha.toFixed(2);
      }
      if (sparkHaloRef.current) {
        sparkHaloRef.current.setAttribute('cx', sx.toFixed(2));
        sparkHaloRef.current.setAttribute('cy', sy.toFixed(2));
        sparkHaloRef.current.style.opacity = (sparkAlpha * 0.55).toFixed(2);
      }

      // Counter-rotating concentric architectural rings
      if (innerArcGroupRef.current) {
        const innerDeg = -(elapsed * 0.085);
        innerArcGroupRef.current.setAttribute(
          'transform',
          `rotate(${innerDeg.toFixed(1)} ${DIAL_CENTER} ${DIAL_CENTER})`
        );
      }
      if (tickRingRef.current) {
        const tickDeg = elapsed * 0.018;
        tickRingRef.current.setAttribute(
          'transform',
          `rotate(${tickDeg.toFixed(1)} ${DIAL_CENTER} ${DIAL_CENTER})`
        );
      }

      // Immediately visible Berry logo gently crystallising from scale 0.93 -> 1.00
      if (logoWrapRef.current) {
        const logoP = easeOutCubic(Math.min(1, elapsed / 620));
        const scale = 0.93 + 0.07 * logoP;
        const opacity = 0.35 + 0.65 * logoP;
        logoWrapRef.current.style.opacity = opacity.toFixed(3);
        logoWrapRef.current.style.transform = `scale(${scale.toFixed(4)})`;
      }

      // Live orbital telemetry percentage
      if (percentRef.current) {
        const pct = Math.min(100, Math.round(sweepProgress * 100));
        percentRef.current.textContent = `${String(pct).padStart(2, '0')}%`;
      }
      if (statusRef.current) {
        if (sweepProgress < 0.35) {
          statusRef.current.textContent = 'IGNITING ARC';
        } else if (sweepProgress < 0.85) {
          statusRef.current.textContent = 'REFINING GRADE';
        } else {
          statusRef.current.textContent = 'BERRY ALLOYS';
        }
      }

      if (elapsed >= 1340 && !handoffFired) {
        handoffFired = true;
        triggerHeroEntranceRipple();
      }

      if (elapsed >= DURATION_TOTAL) {
        finishSplash('ready', 'Circular orbital Berry logo splash completed');
        return;
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);

    // Bounded failsafe so the splash can never stall on any browser or tab switch
    const hardFailsafe = window.setTimeout(() => {
      finishSplash('recovered', 'Circular orbital splash bounded failsafe exit');
    }, 2400);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.clearTimeout(hardFailsafe);
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [mounted, runId, reducedMotion, finishSplash]);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Berry Alloys Limited loading"
      data-berry-splash="active"
      className={`fixed inset-0 z-[95] flex flex-col items-center justify-center px-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        exiting ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: isDark ? '#07111F' : '#F8FBFE',
        backgroundImage: isDark
          ? 'radial-gradient(circle at 50% 48%, rgba(0, 99, 147, 0.24) 0%, rgba(7, 17, 31, 0.96) 56%, #07111F 100%)'
          : 'radial-gradient(circle at 50% 48%, rgba(105, 197, 245, 0.18) 0%, rgba(248, 251, 254, 0.98) 54%, #F1F6FB 100%)',
      }}
    >
      {/* Subtle architectural reticle crosshairs behind the circular medallion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-45"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(86vw,540px)] h-[1px]"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent, rgba(105,197,245,0.22), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(0,99,147,0.16), transparent)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[min(70vh,420px)] w-[1px]"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, transparent, rgba(105,197,245,0.22), transparent)'
              : 'linear-gradient(180deg, transparent, rgba(0,99,147,0.16), transparent)',
          }}
        />
      </div>

      {/* Circular Orbital Loading Medallion */}
      <div className="relative flex flex-col items-center justify-center">
        <div
          className={`relative w-[228px] h-[228px] sm:w-[264px] sm:h-[264px] flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            exiting ? 'scale-110' : 'scale-100'
          }`}
        >
          {/* Ambient circular halo behind the dial */}
          <div
            aria-hidden="true"
            className="absolute inset-5 rounded-full pointer-events-none"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(10, 106, 161, 0.22) 0%, rgba(13, 27, 46, 0.85) 68%, transparent 100%)'
                : 'radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(241, 246, 251, 0.92) 72%, transparent 100%)',
              boxShadow: isDark
                ? '0 0 60px rgba(0, 99, 147, 0.28), inset 0 0 32px rgba(105, 197, 245, 0.08)'
                : '0 22px 60px -18px rgba(16, 36, 58, 0.16), inset 0 0 0 1px rgba(16, 36, 58, 0.06)',
            }}
          />

          {/* Precision Concentric Circular SVG Orbital Dial */}
          <svg
            viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
            className="absolute inset-0 w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="berry-orbital-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#006393" />
                <stop offset="55%" stopColor="#69C5F5" />
                <stop offset="100%" stopColor="#C9233B" />
              </linearGradient>
              <linearGradient id="berry-inner-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isDark ? '#69C5F5' : '#006393'} stopOpacity="0.85" />
                <stop offset="100%" stopColor="#C9233B" stopOpacity="0.15" />
              </linearGradient>
              <radialGradient id="berry-spark-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="35%" stopColor="#C9233B" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#006393" stopOpacity="0" />
              </radialGradient>
              <filter id="berry-arc-blur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" />
              </filter>
            </defs>

            {/* Outer 36-tick furnace dial compass ring */}
            <g ref={tickRingRef}>
              {dialTicks.map((t) => (
                <line
                  key={t.idx}
                  x1={t.x1.toFixed(2)}
                  y1={t.y1.toFixed(2)}
                  x2={t.x2.toFixed(2)}
                  y2={t.y2.toFixed(2)}
                  stroke={
                    t.isMajor
                      ? '#C9233B'
                      : isDark
                      ? 'rgba(105, 197, 245, 0.42)'
                      : 'rgba(16, 36, 58, 0.24)'
                  }
                  strokeWidth={t.isMajor ? 1.8 : t.isMid ? 1.2 : 0.85}
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* Base orbital track circle */}
            <circle
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r={MAIN_RADIUS}
              fill="none"
              stroke={isDark ? 'rgba(244, 248, 252, 0.1)' : 'rgba(16, 36, 58, 0.1)'}
              strokeWidth="2.5"
            />

            {/* Soft luminous under-glow arc */}
            <circle
              ref={glowArcRef}
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r={MAIN_RADIUS}
              fill="none"
              stroke="url(#berry-orbital-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={MAIN_CIRCUMFERENCE}
              strokeDashoffset={MAIN_CIRCUMFERENCE}
              transform={`rotate(-90 ${DIAL_CENTER} ${DIAL_CENTER})`}
              opacity={isDark ? 0.55 : 0.34}
              filter="url(#berry-arc-blur)"
            />

            {/* Primary razor-sharp circular progress sweep */}
            <circle
              ref={progressArcRef}
              cx={DIAL_CENTER}
              cy={DIAL_CENTER}
              r={MAIN_RADIUS}
              fill="none"
              stroke="url(#berry-orbital-grad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray={MAIN_CIRCUMFERENCE}
              strokeDashoffset={MAIN_CIRCUMFERENCE}
              transform={`rotate(-90 ${DIAL_CENTER} ${DIAL_CENTER})`}
            />

            {/* Counter-rotating inner split orbital arcs */}
            <g ref={innerArcGroupRef}>
              <circle
                cx={DIAL_CENTER}
                cy={DIAL_CENTER}
                r={INNER_RADIUS}
                fill="none"
                stroke="url(#berry-inner-arc-grad)"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeDasharray="115 161 115 162"
              />
              <circle
                cx={DIAL_CENTER}
                cy={DIAL_CENTER}
                r={INNER_RADIUS - 8}
                fill="none"
                stroke={isDark ? 'rgba(105, 197, 245, 0.18)' : 'rgba(0, 99, 147, 0.15)'}
                strokeWidth="0.9"
                strokeDasharray="3 7"
              />
            </g>

            {/* Orbiting molten alloy spark leading the circular progress sweep */}
            <circle
              ref={sparkHaloRef}
              cx={DIAL_CENTER}
              cy={DIAL_CENTER - MAIN_RADIUS}
              r="11"
              fill="url(#berry-spark-glow)"
              style={{ opacity: reducedMotion ? 0 : 0.55 }}
            />
            <circle
              ref={sparkHeadRef}
              cx={DIAL_CENTER}
              cy={DIAL_CENTER - MAIN_RADIUS}
              r="3.6"
              fill="#FFFFFF"
              stroke="#C9233B"
              strokeWidth="1.2"
              style={{ opacity: reducedMotion ? 0 : 1 }}
            />
          </svg>

          {/* Centered Authentic Berry Alloys Brand Mark inside the Circular Medallion */}
          <div
            ref={logoWrapRef}
            className="relative z-10 flex flex-col items-center justify-center px-6 will-change-transform"
            style={{ opacity: 0.9, transform: 'scale(0.96)' }}
          >
            <img
              src={isDark ? OFFICIAL_BRAND_MARK_DARK : OFFICIAL_BRAND_MARK}
              alt="Berry Alloys Limited"
              width={148}
              height={50}
              draggable={false}
              className="w-[126px] sm:w-[144px] h-auto object-contain select-none"
            />
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono-tabular tracking-[0.22em] uppercase">
              <span
                ref={statusRef}
                className={isDark ? 'text-[#69C5F5]' : 'text-[#006393]'}
              >
                IGNITING ARC
              </span>
              <span className={isDark ? 'text-[#F4F8FC]/30' : 'text-[#10243A]/25'}>·</span>
              <span
                ref={percentRef}
                className={isDark ? 'text-[#F4F8FC]/90 font-semibold' : 'text-[#10243A] font-semibold'}
              >
                00%
              </span>
            </div>
          </div>
        </div>

        {/* Clean architectural subtitle below the circular medallion */}
        <p
          className="mt-6 text-[11px] font-mono-tabular uppercase tracking-[0.24em] text-center"
          style={{ color: isDark ? 'rgba(181, 197, 215, 0.85)' : 'rgba(70, 92, 114, 0.9)' }}
        >
          From Heat to Precision · Est. 2006
        </p>
      </div>

      {/* Subtle Skip intro control */}
      <button
        type="button"
        onClick={() => finishSplash('skipped', 'Skipped by visitor')}
        className="fixed bottom-6 right-6 z-10 min-h-[38px] px-3.5 py-1.5 text-[11px] font-mono-tabular uppercase tracking-widest border transition-colors cursor-pointer"
        style={{
          color: isDark ? 'rgba(244, 248, 252, 0.72)' : 'rgba(16, 36, 58, 0.68)',
          borderColor: isDark ? 'rgba(244, 248, 252, 0.16)' : 'rgba(16, 36, 58, 0.14)',
          backgroundColor: isDark ? 'rgba(13, 27, 46, 0.78)' : 'rgba(255, 255, 255, 0.84)',
        }}
      >
        Skip intro
      </button>
    </div>
  );
}
