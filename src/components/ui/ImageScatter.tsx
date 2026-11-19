import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useDrag } from '@use-gesture/react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';
import { useIsCompactMobile } from '../../hooks/useIsCompactMobile';

export interface ScatterImageSet {
  id: string;
  label: string;
  subtitle?: string;
  images: Array<{
    src: string;
    alt: string;
    caption: string;
    isEmblem?: boolean;
  }>;
}

export interface ImageScatterProps {
  /** Image collections that rotate in the scattered polaroid card stage */
  imageSets: ScatterImageSet[];
  /** Auto-rotation interval in ms */
  interval?: number;
  /** Duration of scatter animation in ms */
  animationDuration?: number;
  /** Overlap factor for staggered entrance (0–1) */
  animationOverlap?: number;
  className?: string;
}

/**
 * Six perimeter anchor vectors flanking the centered editorial focal card
 * without touching stage walls or occluding the central text block.
 * Normalized in [-1..1] relative to mathematically clamped half-bounds.
 */
const PERIMETER_SLOTS_6: Array<{ nx: number; ny: number; rot: number }> = [
  { nx: -0.66, ny: -0.92, rot: -4.0 }, // Upper-Left (inward arc)
  { nx: 0.64, ny: -0.90, rot: 3.5 },   // Upper-Right (inward arc)
  { nx: -1.0, ny: 0.0, rot: 2.2 },     // Mid-Left (outer flank)
  { nx: 1.0, ny: 0.0, rot: -2.5 },     // Mid-Right (outer flank)
  { nx: -0.64, ny: 0.92, rot: -2.5 },  // Lower-Left (inward arc)
  { nx: 0.66, ny: 0.90, rot: 4.0 },    // Lower-Right (inward arc)
];

const PERIMETER_SLOTS_4: Array<{ nx: number; ny: number; rot: number }> = [
  { nx: -0.78, ny: -0.76, rot: -3.2 }, // Upper-Left
  { nx: 0.78, ny: -0.74, rot: 3.0 },   // Upper-Right
  { nx: -0.76, ny: 0.76, rot: 2.4 },   // Lower-Left
  { nx: 0.78, ny: 0.74, rot: -2.8 },   // Lower-Right
];

const PERIMETER_SLOTS_3: Array<{ nx: number; ny: number; rot: number }> = [
  { nx: -0.84, ny: -0.62, rot: -3.4 }, // Upper-Left
  { nx: 0.84, ny: -0.58, rot: 3.1 },   // Upper-Right
  { nx: 0.72, ny: 0.76, rot: -2.4 },   // Lower-Right counterweight
];

/**
 * ImageScatter — Interactive GSAP-animated 6-frame landscape polaroid showcase
 * arranged cleanly around a centered editorial lockup on md+ screens, with a
 * non-overlapping 2-column responsive grid on narrow viewports.
 */
export function ImageScatter({
  imageSets,
  interval = 5600,
  animationDuration = 660,
  animationOverlap = 0.62,
  className,
}: ImageScatterProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const mobileGridRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [focusedCardIdx, setFocusedCardIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 1120, height: 560 });
  const isCompactMobile = useIsCompactMobile(767);
  const isAnimatingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const safeSets = imageSets.length > 0 ? imageSets : [];
  const currentSet = safeSets[currentSetIndex];

  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setStageSize({
            width: rect.width,
            height: rect.height,
          });
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Landscape polaroid frame dimensions matching 16:10 imagery + caption footer
  const cardGeometry = useMemo(() => {
    const w = stageSize.width;
    const h = stageSize.height;
    const isFourCardSet = (currentSet?.images.length ?? 6) <= 4;
    const cardW = isFourCardSet
      ? Math.round(Math.max(196, Math.min(276, w * 0.23)))
      : Math.round(Math.max(158, Math.min(224, w * 0.18)));
    // Photo box = aspect-[16/10], plus 16px padding and ~28px caption row
    const photoH = Math.round((cardW - 16) * (10 / 16));
    const cardH = photoH + 44;

    // Safety padding keeps rotated corners 100% inside stage
    const edgePadX = 24;
    const edgePadY = 22;
    const maxOffsetX = Math.max(120, w / 2 - cardW / 2 - edgePadX);
    const maxOffsetY = Math.max(110, h / 2 - cardH / 2 - edgePadY);

    return { cardW, cardH, maxOffsetX, maxOffsetY };
  }, [stageSize.width, stageSize.height, currentSet?.images.length]);

  const cardPositions = useMemo(() => {
    if (!currentSet) return [];
    const { maxOffsetX, maxOffsetY } = cardGeometry;
    const len = currentSet.images.length;
    const slots =
      len <= 3 ? PERIMETER_SLOTS_3 : len <= 4 ? PERIMETER_SLOTS_4 : PERIMETER_SLOTS_6;
    return currentSet.images.map((_, index) => {
      const slot = slots[index % slots.length];
      return {
        x: Math.round(slot.nx * maxOffsetX),
        y: Math.round(slot.ny * maxOffsetY),
        rotation: slot.rot,
      };
    });
  }, [cardGeometry, currentSet]);

  const animateCards = useCallback(() => {
    if (isCompactMobile || !cardsRef.current || !currentSet) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = Array.from(cardsRef.current.children) as HTMLElement[];
    if (cards.length === 0) return;

    if (prefersReduced) {
      cards.forEach((card, index) => {
        const pos = cardPositions[index] || { x: 0, y: 0, rotation: 0 };
        gsap.set(card, {
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          scale: 1,
          opacity: 1,
        });
      });
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
      }
      return;
    }

    isAnimatingRef.current = true;
    const durationSec = animationDuration / 1000;
    const staggerDelay = Math.max(0.05, durationSec * (1 - animationOverlap));

    cards.forEach((card) => {
      gsap.set(card, {
        x: 0,
        y: 0,
        scale: 0.78,
        opacity: 0,
        rotation: 0,
      });
    });

    if (labelRef.current) {
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    cards.forEach((card, index) => {
      const pos = cardPositions[index] || { x: 0, y: 0, rotation: 0 };
      tl.to(
        card,
        {
          x: pos.x,
          y: pos.y,
          rotation: pos.rotation,
          scale: 1,
          opacity: 1,
          duration: durationSec,
          ease: 'power3.out',
        },
        index * staggerDelay
      );
    });
  }, [animationDuration, animationOverlap, cardPositions, currentSet, isCompactMobile]);

  useEffect(() => {
    setFocusedCardIdx(null);
    animateCards();
    return () => {
      if (cardsRef.current) {
        gsap.killTweensOf(Array.from(cardsRef.current.children));
      }
    };
  }, [animateCards]);

  // Mobile card staggered entrance when photo set changes
  useEffect(() => {
    if (!isCompactMobile || !mobileGridRef.current || !currentSet) return;
    const cards = Array.from(mobileGridRef.current.children) as HTMLElement[];
    if (cards.length === 0) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      return;
    }
    const tween = gsap.fromTo(
      cards,
      { opacity: 0.15, y: 14, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.045, ease: 'power3.out' }
    );
    return () => {
      tween.kill();
    };
  }, [currentSet, isCompactMobile]);

  const stepSet = useCallback(
    (delta: number) => {
      if (safeSets.length <= 1) return;
      const cards = cardsRef.current
        ? (Array.from(cardsRef.current.children) as HTMLElement[])
        : [];
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced || cards.length === 0) {
        setCurrentSetIndex((prev) => (prev + delta + safeSets.length) % safeSets.length);
        return;
      }

      gsap.to(cards, {
        opacity: 0,
        scale: 0.92,
        duration: 0.22,
        stagger: 0.025,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentSetIndex((prev) => (prev + delta + safeSets.length) % safeSets.length);
        },
      });
    },
    [safeSets.length]
  );

  useEffect(() => {
    if (paused || safeSets.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      stepSet(1);
    }, interval);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [interval, paused, safeSets.length, stepSet]);

  const bindSetSwipe = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], memo }) => {
      if (active) {
        if (!memo?.swiped && (Math.abs(mx) > 48 || (vx > 0.35 && Math.abs(mx) > 18))) {
          stepSet(mx < 0 || dx < 0 ? 1 : -1);
          return { swiped: true };
        }
        return memo ?? { swiped: false };
      }
      return { swiped: false };
    },
    {
      axis: 'x',
      filterTaps: true,
      threshold: 5,
      preventScroll: true,
      pointer: { capture: false },
    }
  );

  if (!currentSet) return null;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border border-[#10243A]/14 dark:border-[#F4F8FC]/14 bg-[#F1F6FB] dark:bg-[#0D1B2E] flex flex-col justify-between',
        className
      )}
    >
      {/* Subtle Architectural Blueprint Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(158,75,40,0.16) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Bar: Theme selector tabs & Pause control */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 bg-[#FFFFFF]/88 dark:bg-[#07111F]/88 backdrop-blur-xs">
        <div
          role="tablist"
          aria-label="Culture and community photo sets"
          className="flex flex-wrap items-center gap-1.5"
        >
          {safeSets.map((set, idx) => {
            const active = idx === currentSetIndex;
            return (
              <button
                key={set.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCurrentSetIndex(idx)}
                className={cn(
                  'min-h-[34px] px-3 py-1 text-[11px] font-mono-tabular font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0',
                  active
                    ? 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC]'
                    : 'bg-[#F1F6FB] text-[#465C72] hover:text-[#10243A] dark:bg-[#12243B] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC]'
                )}
              >
                0{idx + 1} · {set.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => stepSet(-1)}
            aria-label="Previous culture photo set"
            className="inline-flex items-center justify-center w-9 h-9 border border-[#10243A]/18 dark:border-[#F4F8FC]/18 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] hover:border-brand cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume auto rotation' : 'Pause auto rotation'}
            className="inline-flex items-center justify-center w-9 h-9 border border-[#10243A]/18 dark:border-[#F4F8FC]/18 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] hover:border-brand cursor-pointer"
          >
            {paused ? (
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => stepSet(1)}
            aria-label="Next culture photo set"
            className="inline-flex items-center justify-center w-9 h-9 border border-[#10243A]/18 dark:border-[#F4F8FC]/18 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] hover:border-brand cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Desktop / Tablet Scattered 6-Card Perimeter Stage (md+) OR Mobile Clean Staggered Polaroid Grid (< 768px) */}
      {isCompactMobile ? (
        <div
          {...bindSetSwipe()}
          style={{ touchAction: 'pan-y' }}
          className="relative z-10 p-4 space-y-4 select-none"
        >
          <div className="text-center px-4 py-4 bg-[#FFFFFF]/96 dark:bg-[#07111F]/96 border border-[#10243A]/18 dark:border-[#F4F8FC]/18">
            <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Life & Culture at Berry Alloys
            </p>
            <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-0.5">
              {currentSet.label}
            </h3>
            {currentSet.subtitle && (
              <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1 leading-relaxed">
                {currentSet.subtitle}
              </p>
            )}
          </div>

          <div ref={mobileGridRef} className="grid grid-cols-2 gap-3">
            {currentSet.images.map((item, idx) => {
              const isFocused = focusedCardIdx === idx;
              return (
                <figure
                  key={`${currentSet.id}-mobile-${idx}`}
                  onPointerDown={() => setFocusedCardIdx((prev) => (prev === idx ? null : idx))}
                  className={cn(
                    'flex flex-col border bg-[#FFFFFF] dark:bg-[#12243B] p-1.5 shadow-md transition-transform duration-200 cursor-pointer',
                    isFocused
                      ? 'scale-[1.03] -translate-y-1 border-brand dark:border-[#69C5F5] ring-1 ring-brand/40 z-20 shadow-xl'
                      : 'border-[#10243A]/16 dark:border-[#F4F8FC]/18'
                  )}
                >
                  <div
                    className={cn(
                      'aspect-[16/10] w-full overflow-hidden',
                      item.isEmblem ? 'bg-[#FFFFFF] p-1.5' : 'bg-[#10243A]'
                    )}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      draggable={false}
                      className={cn(
                        'w-full h-full block',
                        item.isEmblem ? 'object-contain' : 'object-cover'
                      )}
                    />
                  </div>
                  <figcaption className="pt-1.5 pb-0.5 px-0.5 text-[10px] font-mono-tabular text-[#10243A] dark:text-[#F4F8FC] truncate">
                    {item.caption}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          ref={stageRef}
          {...bindSetSwipe()}
          style={{ touchAction: 'pan-y' }}
          className="flex relative flex-1 items-center justify-center min-h-[600px] lg:min-h-[680px]"
        >
          <div
            ref={cardsRef}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            {currentSet.images.map((item, idx) => {
              const isFocused = focusedCardIdx === idx;
              return (
                <figure
                  key={`${currentSet.id}-${idx}`}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setFocusedCardIdx(idx);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') setFocusedCardIdx(null);
                  }}
                  onPointerDown={() =>
                    setFocusedCardIdx((prev) => (prev === idx ? null : idx))
                  }
                  style={{ width: `${cardGeometry.cardW}px` }}
                  className={cn(
                    'pointer-events-auto absolute flex flex-col border bg-[#FFFFFF] dark:bg-[#12243B] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.2)] transition-shadow duration-200 cursor-pointer',
                    isFocused
                      ? 'z-30 border-brand dark:border-[#69C5F5] shadow-[0_26px_58px_rgba(0,0,0,0.34)]'
                      : 'z-10 border-[#10243A]/18 dark:border-[#F4F8FC]/20 hover:z-30 hover:border-brand'
                  )}
                >
                  <div
                    className={cn(
                      'aspect-[16/10] w-full overflow-hidden',
                      item.isEmblem ? 'bg-[#FFFFFF] p-2' : 'bg-[#10243A]'
                    )}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className={cn(
                        'w-full h-full block',
                        item.isEmblem ? 'object-contain' : 'object-cover'
                      )}
                    />
                  </div>
                  <figcaption className="pt-2 pb-0.5 px-0.5 flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-[#10243A] dark:text-[#F4F8FC]">
                    <span className="truncate font-medium">{item.caption}</span>
                    <span className="text-[10px] text-brand dark:text-[#69C5F5] shrink-0">
                      0{idx + 1}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {/* Center Editorial Title Lockup — Always Unobstructed */}
          <div
            ref={labelRef}
            className="relative z-20 pointer-events-none text-center max-w-[270px] lg:max-w-[330px] px-5 lg:px-6 py-4 lg:py-5 bg-[#FFFFFF]/96 dark:bg-[#07111F]/96 border border-[#10243A]/20 dark:border-[#F4F8FC]/22 shadow-2xl"
          >
            <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Life & Culture at Berry Alloys
            </p>
            <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-1 leading-tight">
              {currentSet.label}
            </h3>
            {currentSet.subtitle && (
              <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1.5 leading-relaxed">
                {currentSet.subtitle}
              </p>
            )}
            <p className="mt-2.5 pt-2 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-[10px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
              {currentSet.images.length} Field Plates · Hover Or Tap Frame
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageScatter;
