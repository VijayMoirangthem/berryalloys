import { PointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, LayoutGrid, Maximize2, Orbit } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/assets';
import { ResilientImage } from './ResilientImage';
import { CircularGallery } from './ui/CircularGallery';
import { GalleryLightbox, describeProvenance } from './GalleryLightbox';
import { useMotion } from '../context/MotionContext';

interface PlantMediaGalleryProps {
  embedded?: boolean;
}

type ViewMode = 'circular' | 'strip';

const DRAG_THRESHOLD = 6;
const GAP_PX = 16;

/** Touch devices and narrow viewports start in the swipe strip; the orbital ring is a desktop enhancement. */
function preferredMode(): ViewMode {
  if (typeof window === 'undefined') return 'strip';
  return window.matchMedia('(min-width: 768px) and (pointer: fine)').matches ? 'circular' : 'strip';
}

/**
 * PlantMediaGallery — orbital gallery on capable desktops, swipeable scroll-snap strip everywhere else,
 * with one shared accessible lightbox. Images open only through a deliberate click / tap / Enter.
 */
export function PlantMediaGallery({ embedded = false }: PlantMediaGalleryProps) {
  const { reducedMotion } = useMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(preferredMode);
  const [canOrbit, setCanOrbit] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  const [lightbox, setLightbox] = useState<{ index: number; trigger: HTMLElement | null } | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [mouseDragging, setMouseDragging] = useState(false);

  const drag = useRef({ active: false, captured: false, pointerId: -1, startX: 0, startScroll: 0, moved: 0 });
  const suppressClick = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      setCanOrbit(mq.matches);
      if (!mq.matches) setViewMode('strip');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const cardStep = useCallback(() => {
    const el = scrollerRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    return (card?.getBoundingClientRect().width ?? 320) + GAP_PX;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const next = Math.max(0, Math.min(GALLERY_ITEMS.length - 1, index));
      el.scrollTo({ left: next * cardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [cardStep, reducedMotion]
  );

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / cardStep());
    setActiveSlide(Math.max(0, Math.min(GALLERY_ITEMS.length - 1, idx)));
    const max = Math.max(1, el.scrollWidth - el.clientWidth);
    setScrollRatio(Math.min(1, Math.max(0, el.scrollLeft / max)));
  };

  // Mouse drag on the strip. Touch and pen use native scrolling, so vertical page scroll is never captured.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scrollerRef.current) return;
    drag.current = { active: true, captured: false, pointerId: e.pointerId, startX: e.clientX, startScroll: scrollerRef.current.scrollLeft, moved: 0 };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = scrollerRef.current;
    if (!d.active || !el || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved <= DRAG_THRESHOLD) return;
    if (!d.captured) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      d.captured = true;
      setMouseDragging(true);
    }
    el.scrollLeft = d.startScroll - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    const wasDrag = d.captured;
    d.active = false;
    d.captured = false;
    setMouseDragging(false);
    if (wasDrag) {
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      // Gentle settle onto the nearest card.
      const el = scrollerRef.current;
      if (el) el.scrollTo({ left: Math.round(el.scrollLeft / cardStep()) * cardStep(), behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const openAt = (index: number, trigger: HTMLElement | null) => setLightbox({ index, trigger });
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const Wrapper = embedded ? 'div' : 'section';
  const segment = (mode: ViewMode) =>
    `inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
      viewMode === mode ? 'bg-brand text-on-brand' : 'text-ink-2 hover:text-ink'
    }`;

  return (
    <Wrapper
      id="plant-gallery"
      aria-labelledby="gallery-heading"
      className={`scroll-mt-20 ${embedded ? 'py-16 lg:py-24 bg-band' : 'py-16 lg:py-28 bg-canvas'} border-t border-subtle`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand">10 / Plant & Specimen Gallery</p>
            <h2 id="gallery-heading" className="font-display fluid-section-title font-bold uppercase tracking-tight text-ink">
              Works photography, alloy specimens, and CSR records
            </h2>
            <p className="text-xs text-ink-2">
              {viewMode === 'circular'
                ? 'Drag the orbital ring to look around. Click a frame to open it full size.'
                : 'Swipe through the frames. Tap an image to open it full size.'}{' '}
              Images marked illustrative are representative visuals, not factory documentation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {canOrbit && (
              <div role="group" aria-label="Gallery presentation mode" className="inline-flex border border-control bg-card p-0.5">
                <button type="button" onClick={() => setViewMode('circular')} aria-pressed={viewMode === 'circular'} className={segment('circular')}>
                  <Orbit className="w-3.5 h-3.5" aria-hidden="true" />
                  Orbital ring
                </button>
                <button type="button" onClick={() => setViewMode('strip')} aria-pressed={viewMode === 'strip'} className={segment('strip')}>
                  <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                  Strip
                </button>
              </div>
            )}

            {viewMode === 'strip' && (
              <div className="flex items-center gap-2">
                <span className="font-mono-tabular text-xs text-ink-2 mr-1" aria-live="polite">
                  {String(activeSlide + 1).padStart(2, '0')} / {String(GALLERY_ITEMS.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => goTo(activeSlide - 1)}
                  disabled={activeSlide === 0}
                  aria-label="Previous gallery image"
                  className="inline-flex h-11 w-11 items-center justify-center border border-control text-ink hover:bg-brand hover:text-on-brand hover:border-brand disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeSlide + 1)}
                  disabled={activeSlide === GALLERY_ITEMS.length - 1}
                  aria-label="Next gallery image"
                  className="inline-flex h-11 w-11 items-center justify-center border border-control text-ink hover:bg-brand hover:text-on-brand hover:border-brand disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {viewMode === 'circular' && canOrbit ? (
          <CircularGallery items={GALLERY_ITEMS} onItemSelect={(_, index, trigger) => openAt(index, trigger)} />
        ) : (
          <div className="space-y-4">
            <div
              ref={scrollerRef}
              role="group"
              aria-roledescription="carousel"
              aria-label="Plant and specimen gallery"
              onScroll={onScroll}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              className={`flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-3 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                mouseDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'
              }`}
            >
              {GALLERY_ITEMS.map((item, idx) => {
                const info = describeProvenance(item);
                return (
                  <figure
                    key={item.id}
                    aria-roledescription="slide"
                    aria-label={`${idx + 1} of ${GALLERY_ITEMS.length}`}
                    className="snap-start shrink-0 w-[80vw] sm:w-[400px] lg:w-[440px] bg-card border border-subtle flex flex-col group"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        if (suppressClick.current) {
                          e.preventDefault();
                          return;
                        }
                        openAt(idx, e.currentTarget);
                      }}
                      aria-label={`Open larger image: ${info.caption}`}
                      className={`relative aspect-[4/3] w-full overflow-hidden cursor-pointer text-left ${item.specimenPlate ? 'bg-white p-4' : 'bg-band'}`}
                    >
                      <ResilientImage
                        src={item.src}
                        alt={item.alt}
                        loading={idx < 3 ? 'eager' : 'lazy'}
                        className={`w-full h-full transition-transform duration-500 group-hover:scale-[1.03] pointer-events-none ${item.specimenPlate ? 'object-contain' : 'object-cover'}`}
                        containerClassName="w-full h-full"
                      />
                      <span className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center bg-[#10243A]/80 text-[#F4F8FC] group-hover:bg-brand group-hover:text-on-brand transition-colors">
                        <Maximize2 className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </button>
                    <figcaption className="p-4 border-t border-subtle space-y-1">
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand">
                        Fig. {String(idx + 1).padStart(2, '0')} · {item.category}
                      </p>
                      <p className="text-xs text-ink leading-relaxed">{info.caption}</p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            <div className="h-[2px] w-full bg-subtle overflow-hidden" aria-hidden="true">
              <div
                className="h-full bg-brand origin-left transition-transform duration-150"
                style={{ transform: `scaleX(${Math.max(1 / GALLERY_ITEMS.length, scrollRatio)})` }}
              />
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <GalleryLightbox
            items={GALLERY_ITEMS}
            index={lightbox.index}
            onIndexChange={(next) => setLightbox((prev) => (prev ? { ...prev, index: next } : prev))}
            onClose={closeLightbox}
            returnFocusEl={lightbox.trigger}
          />
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
