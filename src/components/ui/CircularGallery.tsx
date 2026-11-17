import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';
import { useInViewActive, useMotion } from '../../context/MotionContext';

export interface CircularGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category?: string;
  specimenPlate?: boolean;
}

export interface CircularGalleryProps {
  items: CircularGalleryItem[];
  spacing?: number;
  cardSize?: { width: number; height: number };
  className?: string;
  initialRotation?: number;
  /** Called on an intentional click / Enter / Space only — never at the end of a drag. */
  onItemSelect?: (item: CircularGalleryItem, index: number, trigger: HTMLElement) => void;
}

const DRAG_THRESHOLD_PX = 6;
const DEG_PER_PX = 0.28;
const IDLE_BEFORE_DRIFT_MS = 2400;

function normalise(angle: number) {
  return ((angle % 360) + 360) % 360;
}

/**
 * CircularGallery — tilted 3D orbital ring.
 * - No permanent preview: hover/focus only lifts + outlines the card and shows a small caption.
 * - Drag rotates with inertia and settles on the nearest frame; a movement threshold separates drag from click.
 * - Ambient drift pauses while inspecting, offscreen, in a hidden tab, or when the visitor pauses ambient motion.
 * - CSS hover transforms live on a nested wrapper so they never fight the transform that positions each card.
 */
export function CircularGallery({
  items,
  spacing = 42,
  cardSize = { width: 176, height: 124 },
  className,
  initialRotation = 165,
  onItemSelect,
}: CircularGalleryProps) {
  const { ambientActive, ambientPaused, reducedMotion, toggleAmbient } = useMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scale, setScale] = useState<number | null>(null);

  const active = useInViewActive(containerRef);
  const inspectingRef = useRef(false);
  const ambientRef = useRef(ambientActive);
  ambientRef.current = ambientActive;

  const n = items.length;
  const step = n ? 360 / n : 360;
  const radius = Math.max(250, Math.round(n * spacing * 0.78));

  const rot = useRef({ current: initialRotation, target: initialRotation });
  const lastInteraction = useRef(0);
  const drag = useRef({
    active: false,
    captured: false,
    pointerId: -1,
    startX: 0,
    startTarget: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: 0,
  });
  const suppressClick = useRef(false);

  // Responsive geometry via ResizeObserver; the scene is not positioned until the container has a real width.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const apply = () => {
      const w = el.clientWidth;
      if (w <= 0) return;
      setScale(w < 640 ? 0.62 : w < 980 ? 0.8 : 1);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Entrance
  useEffect(() => {
    if (!stageRef.current || reducedMotion) return;
    const tween = gsap.fromTo(
      stageRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    );
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  const paint = useCallback(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const r = rot.current.current;
    ring.style.transform = `rotateY(${r}deg)`;
    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const facing = Math.cos(((normalise(i * step + r) - 0) * Math.PI) / 180);
      const o = 0.32 + 0.68 * ((facing + 1) / 2);
      el.style.opacity = String(o);
      el.style.pointerEvents = facing < -0.35 ? 'none' : 'auto';
    }
  }, [n, step]);

  // Render loop — only runs while the gallery is on screen and the tab is visible.
  useEffect(() => {
    if (n === 0 || scale === null) return;
    paint();
    if (!active) return;
    let raf = 0;
    let disposed = false;
    const tick = () => {
      if (disposed) return;
      const r = rot.current;
      const idle = performance.now() - lastInteraction.current > IDLE_BEFORE_DRIFT_MS;
      if (ambientRef.current && !drag.current.active && !inspectingRef.current && idle) {
        r.target += 0.05;
      }
      const delta = r.target - r.current;
      if (Math.abs(delta) > 0.01) {
        r.current += delta * (reducedMotion ? 1 : 0.09);
        paint();
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
    };
  }, [active, n, paint, reducedMotion, scale]);

  const settleTo = useCallback(
    (target: number) => {
      lastInteraction.current = performance.now();
      rot.current.target = Math.round(target / step) * step;
    },
    [step]
  );

  const stepRing = useCallback(
    (deltaSteps: number) => {
      if (!n) return;
      lastInteraction.current = performance.now();
      settleTo(rot.current.target - deltaSteps * step);
    },
    [n, settleTo, step]
  );

  const rotateToIndex = useCallback(
    (index: number) => {
      // Shortest path to bring `index` to the front.
      const desired = -index * step;
      const cur = rot.current.target;
      const diff = ((((desired - cur) % 360) + 540) % 360) - 180;
      settleTo(cur + diff);
    },
    [settleTo, step]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-gallery-control="true"]')) return;
    const d = drag.current;
    d.active = true;
    d.captured = false;
    d.pointerId = e.pointerId;
    d.startX = e.clientX;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.startTarget = rot.current.target;
    d.velocity = 0;
    d.moved = 0;
    lastInteraction.current = performance.now();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved <= DRAG_THRESHOLD_PX) return;
    if (!d.captured) {
      // Capture only once this is clearly a drag so ordinary clicks still reach their card.
      try {
        containerRef.current?.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      d.captured = true;
      setDragging(true);
    }
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.velocity = d.velocity * 0.7 + ((e.clientX - d.lastX) / dt) * 0.3;
    d.lastX = e.clientX;
    d.lastT = now;
    lastInteraction.current = now;
    rot.current.target = d.startTarget + dx * DEG_PER_PX;
  };

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.captured) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      if (e) {
        try {
          containerRef.current?.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      // Controlled inertia, then settle on the nearest frame.
      const flick = Math.max(-1.6, Math.min(1.6, d.velocity)) * 160 * DEG_PER_PX;
      settleTo(rot.current.target + flick);
    }
    d.captured = false;
    setDragging(false);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault();
      lastInteraction.current = performance.now();
      rot.current.target -= (e.deltaX || e.deltaY) * 0.12;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepRing(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepRing(-1);
    }
  };

  const highlightId = hoveredId ?? focusedId;
  inspectingRef.current = Boolean(highlightId) || dragging;
  const highlightIndex = highlightId ? items.findIndex((it) => it.id === highlightId) : -1;
  const highlightItem = highlightIndex >= 0 ? items[highlightIndex] : null;

  return (
    <div
      ref={containerRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Plant and specimen gallery, orbital view"
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={() => endDrag()}
      onPointerLeave={(e) => {
        if (!drag.current.captured) endDrag(e);
        setHoveredId(null);
      }}
      style={{ touchAction: 'pan-y' }}
      className={cn(
        'relative h-[460px] sm:h-[540px] w-full select-none overflow-hidden border border-subtle bg-band text-ink',
        dragging ? 'cursor-grabbing' : 'cursor-grab',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,color-mix(in_srgb,var(--brand-primary)_14%,transparent),transparent_62%)]"
      />

      <div ref={stageRef} className="absolute inset-0">
        {scale !== null && (
          <div
            className="relative flex h-full w-full items-center justify-center"
            style={{
              perspective: 1650,
              transformStyle: 'preserve-3d',
              transform: `scale(${scale}) rotate(-8deg)`,
            }}
          >
            <div
              ref={ringRef}
              className="relative flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d', transform: `rotateY(${initialRotation}deg)` }}
            >
              {items.map((item, idx) => {
                const angle = idx * step;
                const isHot = highlightId === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    type="button"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId((prev) => (prev === item.id ? null : prev))}
                    onFocus={() => {
                      setFocusedId(item.id);
                      rotateToIndex(idx);
                    }}
                    onBlur={() => setFocusedId((prev) => (prev === item.id ? null : prev))}
                    onClick={(e) => {
                      if (suppressClick.current) {
                        e.preventDefault();
                        return;
                      }
                      onItemSelect?.(item, idx, e.currentTarget);
                    }}
                    aria-label={`Inspect: ${item.caption ?? item.alt}`}
                    className="group absolute focus-visible:outline-none cursor-pointer"
                    style={{
                      width: `${cardSize.width}px`,
                      height: `${cardSize.height}px`,
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    }}
                  >
                    {/* Nested wrapper: hover/focus transforms never touch the positioning transform above. */}
                    <span
                      className={cn(
                        'flex h-full w-full flex-col overflow-hidden border bg-card shadow-[0_14px_30px_rgba(16,36,58,0.22)] transition-[transform,border-color,box-shadow] duration-200 ease-out',
                        isHot
                          ? '-translate-y-1.5 border-brand ring-2 ring-brand/60 shadow-[0_20px_36px_rgba(16,36,58,0.32)]'
                          : 'border-subtle'
                      )}
                    >
                      <span
                        className={cn(
                          'block flex-1 w-full overflow-hidden',
                          item.specimenPlate ? 'bg-white p-1.5' : 'bg-band'
                        )}
                      >
                        <img
                          src={item.src}
                          alt=""
                          draggable={false}
                          loading="lazy"
                          className={cn(
                            'block w-full h-full pointer-events-none',
                            item.specimenPlate ? 'object-contain' : 'object-cover'
                          )}
                        />
                      </span>
                      <span className="block px-1.5 py-1 text-[9px] font-mono-tabular uppercase tracking-wider text-ink-2 bg-card truncate text-left w-full border-t border-subtle">
                        Fig. {String(idx + 1).padStart(2, '0')} · {item.category ?? 'Work'}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Compact caption — appears only while a frame is hovered or focused; never a centre overlay. */}
      <div className="pointer-events-none absolute left-4 right-4 bottom-14 z-20 flex justify-center">
        <p
          aria-hidden={!highlightItem}
          className={cn(
            'max-w-xl truncate border border-subtle bg-card/95 px-3 py-1.5 text-[11px] text-ink shadow-sm transition-opacity duration-150',
            highlightItem ? 'opacity-100' : 'opacity-0'
          )}
        >
          {highlightItem ? (
            <>
              <span className="font-mono-tabular uppercase tracking-wider text-brand mr-2">
                Fig. {String(highlightIndex + 1).padStart(2, '0')}
              </span>
              {highlightItem.caption ?? highlightItem.alt}
            </>
          ) : null}
        </p>
      </div>

      <div className="absolute bottom-3 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular text-ink-2">
        <span className="pointer-events-none">
          <span className="hidden sm:inline">Drag to rotate · Click or press Enter on a frame to inspect</span>
          <span className="sm:hidden">Drag to rotate · tap a frame to inspect</span>
        </span>

        <div data-gallery-control="true" className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={toggleAmbient}
            aria-pressed={ambientPaused}
            disabled={reducedMotion}
            aria-label={ambientPaused ? 'Resume automatic gallery rotation' : 'Pause automatic gallery rotation'}
            className="inline-flex items-center justify-center w-9 h-9 border border-control bg-card text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer disabled:opacity-40"
          >
            {ambientPaused || reducedMotion ? (
              <Play className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Pause className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => stepRing(-1)}
            aria-label="Rotate gallery to previous frame"
            className="inline-flex items-center justify-center w-9 h-9 border border-control bg-card text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => stepRing(1)}
            aria-label="Rotate gallery to next frame"
            className="inline-flex items-center justify-center w-9 h-9 border border-control bg-card text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CircularGallery;
