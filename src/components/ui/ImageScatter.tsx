import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';

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
const PERIMETER_SLOTS: Array<{ nx: number; ny: number; rot: number }> = [
  { nx: -0.66, ny: -0.92, rot: -4.0 }, // Upper-Left (inward arc)
  { nx: 0.64, ny: -0.90, rot: 3.5 },   // Upper-Right (inward arc)
  { nx: -1.0, ny: 0.0, rot: 2.2 },     // Mid-Left (outer flank)
  { nx: 1.0, ny: 0.0, rot: -2.5 },     // Mid-Right (outer flank)
  { nx: -0.64, ny: 0.92, rot: -2.5 },  // Lower-Left (inward arc)
  { nx: 0.66, ny: 0.90, rot: 4.0 },    // Lower-Right (inward arc)
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
  const labelRef = useRef<HTMLDivElement>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [focusedCardIdx, setFocusedCardIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 1120, height: 560 });
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
    const cardW = Math.round(Math.max(158, Math.min(224, w * 0.18)));
    // Photo box = aspect-[16/10], plus 16px padding and ~28px caption row
    const photoH = Math.round((cardW - 16) * (10 / 16));
    const cardH = photoH + 44;

    // Safety padding keeps rotated corners 100% inside stage
    const edgePadX = 24;
    const edgePadY = 22;
    const maxOffsetX = Math.max(120, w / 2 - cardW / 2 - edgePadX);
    const maxOffsetY = Math.max(110, h / 2 - cardH / 2 - edgePadY);

    return { cardW, cardH, maxOffsetX, maxOffsetY };
  }, [stageSize.width, stageSize.height]);

  const cardPositions = useMemo(() => {
    if (!currentSet) return [];
    const { maxOffsetX, maxOffsetY } = cardGeometry;
    return currentSet.images.map((_, index) => {
      const slot = PERIMETER_SLOTS[index % PERIMETER_SLOTS.length];
      return {
        x: Math.round(slot.nx * maxOffsetX),
        y: Math.round(slot.ny * maxOffsetY),
        rotation: slot.rot,
      };
    });
  }, [cardGeometry, currentSet]);

  const animateCards = useCallback(() => {
    if (!cardsRef.current || !currentSet) return;
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
  }, [animationDuration, animationOverlap, cardPositions, currentSet]);

  useEffect(() => {
    setFocusedCardIdx(null);
    animateCards();
    return () => {
      if (cardsRef.current) {
        gsap.killTweensOf(Array.from(cardsRef.current.children));
      }
    };
  }, [animateCards]);

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

  if (!currentSet) return null;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border border-[#141618]/14 dark:border-[#F3F0E9]/14 bg-[#ECE8DF] dark:bg-[#191C20] flex flex-col justify-between',
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
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 bg-[#FFFFFF]/88 dark:bg-[#121417]/88 backdrop-blur-xs">
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
                    ? 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
                    : 'bg-[#ECE8DF] text-[#4A5054] hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
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
            className="inline-flex items-center justify-center w-9 h-9 border border-[#141618]/18 dark:border-[#F3F0E9]/18 bg-white dark:bg-[#20242A] text-[#141618] dark:text-[#F3F0E9] hover:border-[#9E4B28] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume auto rotation' : 'Pause auto rotation'}
            className="inline-flex items-center justify-center w-9 h-9 border border-[#141618]/18 dark:border-[#F3F0E9]/18 bg-white dark:bg-[#20242A] text-[#141618] dark:text-[#F3F0E9] hover:border-[#9E4B28] cursor-pointer"
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
            className="inline-flex items-center justify-center w-9 h-9 border border-[#141618]/18 dark:border-[#F3F0E9]/18 bg-white dark:bg-[#20242A] text-[#141618] dark:text-[#F3F0E9] hover:border-[#9E4B28] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Desktop / Tablet Scattered 6-Card Perimeter Stage (md+) */}
      <div
        ref={stageRef}
        className="hidden md:flex relative flex-1 items-center justify-center min-h-[600px] lg:min-h-[680px]"
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
                onMouseEnter={() => setFocusedCardIdx(idx)}
                onMouseLeave={() => setFocusedCardIdx(null)}
                onClick={() =>
                  setFocusedCardIdx((prev) => (prev === idx ? null : idx))
                }
                style={{ width: `${cardGeometry.cardW}px` }}
                className={cn(
                  'pointer-events-auto absolute flex flex-col border bg-[#FFFFFF] dark:bg-[#20242A] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.2)] transition-shadow duration-200 cursor-pointer',
                  isFocused
                    ? 'z-30 border-[#9E4B28] dark:border-[#EC743C] shadow-[0_26px_58px_rgba(0,0,0,0.34)]'
                    : 'z-10 border-[#141618]/18 dark:border-[#F3F0E9]/20 hover:z-30 hover:border-[#9E4B28]'
                )}
              >
                <div
                  className={cn(
                    'aspect-[16/10] w-full overflow-hidden',
                    item.isEmblem ? 'bg-[#F6F4EF] p-2' : 'bg-[#141618]'
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
                <figcaption className="pt-2 pb-0.5 px-0.5 flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-[#141618] dark:text-[#F3F0E9]">
                  <span className="truncate font-medium">{item.caption}</span>
                  <span className="text-[10px] text-[#9E4B28] dark:text-[#EC743C] shrink-0">
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
          className="relative z-20 pointer-events-none text-center max-w-[270px] lg:max-w-[330px] px-5 lg:px-6 py-4 lg:py-5 bg-[#F6F4EF]/96 dark:bg-[#121417]/96 border border-[#141618]/20 dark:border-[#F3F0E9]/22 shadow-2xl"
        >
          <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Life & Culture at Berry Alloys
          </p>
          <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mt-1 leading-tight">
            {currentSet.label}
          </h3>
          {currentSet.subtitle && (
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1.5 leading-relaxed">
              {currentSet.subtitle}
            </p>
          )}
          <p className="mt-2.5 pt-2 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 text-[10px] font-mono-tabular uppercase tracking-wider text-[#4A5054] dark:text-[#A1A7AB]">
            {currentSet.images.length} Field Plates · Hover Frame To Focus
          </p>
        </div>
      </div>

      {/* Mobile Clean 2-Column Archival Polaroid Grid (< md) */}
      <div className="md:hidden relative z-10 p-4 space-y-4">
        <div className="text-center px-4 py-4 bg-[#F6F4EF]/96 dark:bg-[#121417]/96 border border-[#141618]/18 dark:border-[#F3F0E9]/18">
          <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Life & Culture at Berry Alloys
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mt-0.5">
            {currentSet.label}
          </h3>
          {currentSet.subtitle && (
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1 leading-relaxed">
              {currentSet.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentSet.images.map((item, idx) => (
            <figure
              key={`${currentSet.id}-mobile-${idx}`}
              className="flex flex-col border border-[#141618]/16 dark:border-[#F3F0E9]/18 bg-[#FFFFFF] dark:bg-[#20242A] p-1.5 shadow-md"
            >
              <div
                className={cn(
                  'aspect-[16/10] w-full overflow-hidden',
                  item.isEmblem ? 'bg-[#F6F4EF] p-1.5' : 'bg-[#141618]'
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
              <figcaption className="pt-1.5 pb-0.5 px-0.5 text-[10px] font-mono-tabular text-[#141618] dark:text-[#F3F0E9] truncate">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageScatter;
