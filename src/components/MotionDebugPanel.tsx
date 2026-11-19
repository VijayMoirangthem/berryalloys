import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, Copy, ChevronDown, ChevronUp, RotateCcw, X } from 'lucide-react';
import { useMotion } from '../context/MotionContext';
import { BUILD_INFO } from '../lib/buildInfo';
import {
  getActiveScrollTriggerCount,
  getDiagnosticsSnapshot,
  probeWebGLAvailability,
  subscribeDiagnostics,
} from '../lib/motionDiagnostics';

function isMotionDebugEnabled(search: string): boolean {
  try {
    return new URLSearchParams(search).get('motionDebug') === '1';
  } catch {
    return false;
  }
}

function getEffectiveMotionMode(reducedMotion: boolean, ambientPaused: boolean) {
  if (reducedMotion) {
    return {
      mode: 'reduced',
      reason: 'OS media query (prefers-reduced-motion: reduce) is active',
    };
  }
  if (ambientPaused) {
    return {
      mode: 'ambient-paused',
      reason: "User toggle persisted in localStorage['berry-ambient-paused'] === '1'",
    };
  }
  return {
    mode: 'active',
    reason: 'OS allows motion and ambient loops are active on this device',
  };
}

function getScrollContainerSummary() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return { container: 'ssr', scrollY: 0, maxScroll: 0 };
  }
  const el = document.scrollingElement || document.documentElement;
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const oy = window.getComputedStyle(el).overflowY;
  const maxScroll = Math.max(0, Math.round(el.scrollHeight - window.innerHeight));
  const scrollY = Math.round(el.scrollTop || window.scrollY || 0);
  return {
    container: `${tag}${id} (overflow-y:${oy})`,
    scrollY,
    maxScroll,
  };
}

/**
 * MotionDebugPanel — On-device diagnostic overlay enabled strictly with `?motionDebug=1`.
 * Hidden during normal browsing. Reports build version, motion gates, scroll container telemetry,
 * WebGL/canvas counters, recent errors, copyable JSON/text summary, and 3 independent probes.
 */
export function MotionDebugPanel() {
  const { search } = useLocation();
  const enabled = useMemo(() => isMotionDebugEnabled(search), [search]);

  if (!enabled) return null;

  return <MotionDebugPanelInner />;
}

function MotionDebugPanelInner() {
  const { reducedMotion, ambientPaused, toggleAmbient } = useMotion();
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSelectable, setShowSelectable] = useState(false);

  const [snapshot, setSnapshot] = useState(() => getDiagnosticsSnapshot());
  const [viewport, setViewport] = useState(() =>
    typeof window !== 'undefined'
      ? { w: window.innerWidth, h: window.innerHeight, dpr: Number((window.devicePixelRatio || 1).toFixed(2)) }
      : { w: 0, h: 0, dpr: 1 }
  );
  const [visibility, setVisibility] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState : 'visible'
  );
  const [scrollInfo, setScrollInfo] = useState(() => getScrollContainerSummary());
  const [scrollTriggerCount, setScrollTriggerCount] = useState(() => getActiveScrollTriggerCount());
  const [rafCounter, setRafCounter] = useState(0);

  const rafBarRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const webglProbe = useMemo(() => probeWebGLAvailability(), []);
  const motionMode = getEffectiveMotionMode(reducedMotion, ambientPaused);

  useEffect(() => {
    const unsub = subscribeDiagnostics(() => setSnapshot(getDiagnosticsSnapshot()));
    const poll = window.setInterval(() => {
      setSnapshot(getDiagnosticsSnapshot());
      setScrollTriggerCount(getActiveScrollTriggerCount());
      setScrollInfo(getScrollContainerSummary());
    }, 350);
    return () => {
      unsub();
      window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
        dpr: Number((window.devicePixelRatio || 1).toFixed(2)),
      });
      setScrollInfo(getScrollContainerSummary());
    };
    const onVisibility = () => setVisibility(document.visibilityState);
    const onScroll = () => {
      const info = getScrollContainerSummary();
      setScrollInfo(info);
      if (scrollBarRef.current) {
        const p = info.maxScroll > 0 ? Math.min(1, Math.max(0, info.scrollY / info.maxScroll)) : 0;
        scrollBarRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
    };

    onScroll();
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Probe 2: Independent rAF DOM indicator + counter (intentionally paused when reducedMotion === true)
  useEffect(() => {
    if (reducedMotion) {
      if (rafBarRef.current) {
        rafBarRef.current.style.transform = 'translate3d(0px, 0, 0)';
      }
      return;
    }

    let rafId = 0;
    let count = 0;
    const t0 = performance.now();

    const step = (now: number) => {
      count += 1;
      const elapsed = (now - t0) * 0.0025;
      const travel = (Math.sin(elapsed) * 0.5 + 0.5) * 68;
      if (rafBarRef.current) {
        rafBarRef.current.style.transform = `translate3d(${travel.toFixed(1)}px, 0, 0)`;
      }
      if (count % 4 === 0) {
        setRafCounter(count);
      }
      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`
      : '';

  const totalCanvasFrames = Object.values(snapshot.canvases).reduce((acc, c) => acc + c.frames, 0);

  const diagnosticReport = useMemo(() => {
    const payload = {
      buildId: BUILD_INFO.id,
      buildTimestamp: BUILD_INFO.timestamp,
      buildMode: BUILD_INFO.mode,
      url: currentUrl,
      viewport: `${viewport.w}x${viewport.h} @${viewport.dpr}x`,
      prefersReducedMotion: reducedMotion,
      effectiveMotionMode: motionMode.mode,
      effectiveMotionReason: motionMode.reason,
      loaderStatus: `${snapshot.loaderStatus} (${snapshot.loaderReason})`,
      documentVisibility: visibility,
      scrollContainer: scrollInfo.container,
      scrollPosition: `${scrollInfo.scrollY} / ${scrollInfo.maxScroll}`,
      animationInit: snapshot.motionInit,
      activeScrollTriggers: scrollTriggerCount,
      webgl: {
        available: snapshot.webglCapable ?? webglProbe.available,
        renderer: snapshot.webglRenderer || webglProbe.renderer || 'unknown',
        totalFrames: totalCanvasFrames,
        canvases: Object.values(snapshot.canvases).map((c) => ({
          id: c.id,
          mode: c.mode,
          status: c.status,
          size: `${c.width}x${c.height}@${c.dpr}`,
          frames: c.frames,
        })),
      },
      rafProbeFrames: reducedMotion ? 'suppressed(prefers-reduced-motion)' : rafCounter,
      recentErrors: snapshot.errors,
    };
    return JSON.stringify(payload, null, 2);
  }, [
    currentUrl,
    motionMode.mode,
    motionMode.reason,
    rafCounter,
    reducedMotion,
    scrollInfo.container,
    scrollInfo.maxScroll,
    scrollInfo.scrollY,
    scrollTriggerCount,
    snapshot,
    totalCanvasFrames,
    viewport.dpr,
    viewport.h,
    viewport.w,
    visibility,
    webglProbe.available,
    webglProbe.renderer,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(diagnosticReport);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setShowSelectable(true);
      window.requestAnimationFrame(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      });
    }
  };

  if (dismissed) {
    return (
      <button
        type="button"
        onClick={() => setDismissed(false)}
        className="fixed bottom-3 left-3 z-[95] px-2.5 py-1.5 text-[10px] font-mono-tabular uppercase tracking-wider bg-[#07111F] text-[#69C5F5] border border-[#69C5F5]/60 shadow-lg cursor-pointer"
      >
        Motion Debug
      </button>
    );
  }

  return (
    <aside
      aria-label="Motion diagnostics panel"
      data-testid="motion-debug-panel"
      className="fixed bottom-2.5 left-2.5 right-2.5 sm:left-auto sm:right-3 sm:bottom-3 sm:w-[400px] z-[95] bg-[#07111F]/96 text-[#F4F8FC] border border-[#69C5F5]/45 shadow-2xl font-mono-tabular text-[10.5px] leading-snug"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[#F4F8FC]/15 bg-[#0D1B2E]">
        <div className="min-w-0">
          <p className="text-[#69C5F5] font-semibold uppercase tracking-wider truncate">
            Motion Debug · {BUILD_INFO.id}
          </p>
          <p className="text-[9.5px] text-[#B5C5D7] truncate">
            Built {BUILD_INFO.timestamp}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            aria-label={minimized ? 'Expand diagnostics panel' : 'Collapse diagnostics panel'}
            className="inline-flex items-center justify-center w-7 h-7 border border-[#F4F8FC]/20 text-[#F4F8FC] hover:border-[#69C5F5] cursor-pointer"
          >
            {minimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Hide diagnostics panel"
            className="inline-flex items-center justify-center w-7 h-7 border border-[#F4F8FC]/20 text-[#F4F8FC] hover:border-[#FF8091] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="max-h-[62vh] overflow-y-auto p-3 space-y-2.5">
          {/* Core Environment Grid */}
          <dl className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 border-b border-[#F4F8FC]/12 pb-2">
            <div>
              <dt className="text-[9px] uppercase text-[#94A9BF]">Viewport</dt>
              <dd data-testid="dbg-viewport">{viewport.w}×{viewport.h} @{viewport.dpr}x</dd>
            </div>
            <div>
              <dt className="text-[9px] uppercase text-[#94A9BF]">prefers-reduced-motion</dt>
              <dd data-testid="dbg-reduced">{String(reducedMotion)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[9px] uppercase text-[#94A9BF]">Effective Motion Mode</dt>
              <dd data-testid="dbg-motion-mode" className={motionMode.mode === 'active' ? 'text-[#6FD59A]' : 'text-[#F0C060]'}>
                {motionMode.mode} — {motionMode.reason}
              </dd>
              {ambientPaused && !reducedMotion && (
                <button
                  type="button"
                  onClick={toggleAmbient}
                  className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 border border-[#69C5F5]/50 text-[#69C5F5] text-[9.5px] cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Re-enable Ambient Motion
                </button>
              )}
            </div>
            <div>
              <dt className="text-[9px] uppercase text-[#94A9BF]">Loader Readiness</dt>
              <dd data-testid="dbg-loader">{snapshot.loaderStatus} ({snapshot.loaderReason})</dd>
            </div>
            <div>
              <dt className="text-[9px] uppercase text-[#94A9BF]">Document Visibility</dt>
              <dd data-testid="dbg-visibility">{visibility}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[9px] uppercase text-[#94A9BF]">Current URL</dt>
              <dd className="break-all text-[#B5C5D7]">{currentUrl}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[9px] uppercase text-[#94A9BF]">Scroll Container &amp; Offset</dt>
              <dd data-testid="dbg-scroll">
                {scrollInfo.container} · {scrollInfo.scrollY}px / {scrollInfo.maxScroll}px
              </dd>
            </div>
            <div>
              <dt className="text-[9px] uppercase text-[#94A9BF]">ScrollTriggers</dt>
              <dd data-testid="dbg-st-count">{scrollTriggerCount} active</dd>
            </div>
            <div>
              <dt className="text-[9px] uppercase text-[#94A9BF]">WebGL Frames</dt>
              <dd data-testid="dbg-webgl">
                {(snapshot.webglCapable ?? webglProbe.available) ? 'available' : 'unavailable'} · {totalCanvasFrames} frames
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[9px] uppercase text-[#94A9BF]">Animation Init Status</dt>
              <dd className="text-[#B5C5D7]">
                reveals:{snapshot.motionInit.industrialReveals} · mobileCountup:{snapshot.motionInit.mobileCountups} · hero:{snapshot.motionInit.heroGsap} · particles:{snapshot.motionInit.heroParticles} · book:{snapshot.motionInit.interactiveBook} · story:{snapshot.motionInit.manufacturingStory} · portrait:{snapshot.motionInit.directorPortrait}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[9px] uppercase text-[#94A9BF]">Canvases / Stages</dt>
              <dd className="space-y-0.5 text-[9.5px] text-[#B5C5D7]">
                {Object.values(snapshot.canvases).length === 0 ? (
                  <span>none registered yet</span>
                ) : (
                  Object.values(snapshot.canvases).map((c) => (
                    <div key={c.id} className="flex justify-between gap-2">
                      <span>{c.id} [{c.mode}/{c.status}]</span>
                      <span>{c.width}×{c.height} · {c.frames}f</span>
                    </div>
                  ))
                )}
              </dd>
            </div>
          </dl>

          {/* 3 Independent Lightweight Probes */}
          <div className="space-y-1.5 border-b border-[#F4F8FC]/12 pb-2">
            <p className="text-[9px] uppercase tracking-wider text-[#69C5F5]">
              Independent Motion Probes {reducedMotion ? '(suppressed by OS prefers-reduced-motion)' : ''}
            </p>

            {/* Probe 1: CSS Keyframes Transform */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9.5px] text-[#B5C5D7] w-24 shrink-0">1. CSS Transform</span>
              <div className="relative h-2.5 w-24 bg-[#12243B] overflow-hidden border border-[#F4F8FC]/15">
                <div
                  data-testid="probe-css-dot"
                  className="motion-debug-css-dot h-full w-3 bg-[#69C5F5]"
                />
              </div>
              <span className="text-[9px] text-[#94A9BF] shrink-0">
                {reducedMotion ? 'reduced' : 'css-anim'}
              </span>
            </div>

            {/* Probe 2: rAF DOM Indicator + Counter */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9.5px] text-[#B5C5D7] w-24 shrink-0">2. rAF Loop</span>
              <div className="relative h-2.5 w-24 bg-[#12243B] overflow-hidden border border-[#F4F8FC]/15">
                <div
                  ref={rafBarRef}
                  data-testid="probe-raf-dot"
                  className="h-full w-3 bg-[#6FD59A]"
                />
              </div>
              <span data-testid="probe-raf-count" className="text-[9px] text-[#B5C5D7] shrink-0">
                {reducedMotion ? 'paused' : `${rafCounter}f`}
              </span>
            </div>

            {/* Probe 3: Scrolling Element Progress */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9.5px] text-[#B5C5D7] w-24 shrink-0">3. Scroll Ratio</span>
              <div className="relative h-2.5 w-24 bg-[#12243B] overflow-hidden border border-[#F4F8FC]/15">
                <div
                  ref={scrollBarRef}
                  data-testid="probe-scroll-bar"
                  className="h-full w-full origin-left bg-[#FF8091]"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
              <span className="text-[9px] text-[#B5C5D7] shrink-0">
                {scrollInfo.maxScroll > 0
                  ? `${Math.round((scrollInfo.scrollY / scrollInfo.maxScroll) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Recent Runtime Errors */}
          <div className="space-y-1">
            <p className="text-[9px] uppercase text-[#94A9BF]">
              Recent Runtime Errors ({snapshot.errors.length})
            </p>
            {snapshot.errors.length === 0 ? (
              <p data-testid="dbg-errors" className="text-[9.5px] text-[#6FD59A]">None captured</p>
            ) : (
              <ul data-testid="dbg-errors" className="space-y-0.5 text-[9.5px] text-[#FF8A80]">
                {snapshot.errors.slice(0, 4).map((err, i) => (
                  <li key={`${err.at}-${i}`} className="break-words">
                    [{err.at} {err.source}] {err.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Copy Diagnostics + Selectable Text Fallback */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              data-testid="copy-diagnostics-btn"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0A6AA1] hover:bg-[#004C73] text-white text-[10px] font-semibold uppercase tracking-wider cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy diagnostics'}
            </button>
            <button
              type="button"
              onClick={() => setShowSelectable((s) => !s)}
              className="inline-flex items-center px-2 py-1.5 border border-[#F4F8FC]/20 text-[#B5C5D7] hover:text-white text-[10px] cursor-pointer"
            >
              {showSelectable ? 'Hide raw text' : 'Selectable text'}
            </button>
          </div>

          {showSelectable && (
            <textarea
              ref={textareaRef}
              readOnly
              aria-label="Selectable diagnostic output"
              value={diagnosticReport}
              onFocus={(e) => e.currentTarget.select()}
              rows={7}
              className="w-full bg-[#040A12] text-[#B5C5D7] border border-[#69C5F5]/35 p-2 text-[9.5px] font-mono-tabular select-all"
            />
          )}
        </div>
      )}
    </aside>
  );
}
