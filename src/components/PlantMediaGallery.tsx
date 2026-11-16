import { PointerEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { GALLERY_ITEMS } from '../data/assets';
import { ResilientImage } from './ResilientImage';

interface PlantMediaGalleryProps {
  embedded?: boolean;
}

/**
 * PlantMediaGallery — Interactive horizontal photography strip featuring real plant aerials,
 * framed official alloy specimen plates, CSR field imagery, and an accessible full-screen lightbox.
 */
export function PlantMediaGallery({ embedded = false }: PlantMediaGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startScrollLeft: number;
    movedDistance: number;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    movedDistance: 0,
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const nextIdx = Math.max(0, Math.min(GALLERY_ITEMS.length - 1, activeSlide + direction));
    setActiveSlide(nextIdx);
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 360;
    el.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scrollerRef.current) return;
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: scrollerRef.current.scrollLeft,
      movedDistance: 0,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    const el = scrollerRef.current;
    if (!state.active || !el) return;
    const deltaX = e.clientX - state.startX;
    state.movedDistance = Math.max(state.movedDistance, Math.abs(deltaX));
    if (state.movedDistance > 4) {
      el.scrollLeft = state.startScrollLeft - deltaX;
    }
  };

  const endDrag = () => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setIsDragging(false);
    window.setTimeout(() => {
      dragStateRef.current.movedDistance = 0;
    }, 60);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        triggerRef.current?.focus();
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_ITEMS.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
        );
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  const Wrapper = embedded ? 'div' : 'section';

  return (
    <Wrapper
      aria-labelledby="gallery-heading"
      className={`${
        embedded
          ? 'py-20 lg:py-24 bg-[#ECE8DF] dark:bg-[#191C20]'
          : 'py-20 lg:py-28 bg-[#F6F4EF] dark:bg-[#121417]'
      } border-t border-[#141618]/12 dark:border-[#F3F0E9]/12`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              10 / Plant & Specimen Gallery
            </p>
            <h2
              id="gallery-heading"
              className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
            >
              Works photography, alloy specimens, and CSR records
            </h2>
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
              Drag horizontally or use arrow controls to browse aerial plant visuals, official ferro alloy specimens, and community programmes; click any frame to inspect full size.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono-tabular text-xs text-[#4A5054] dark:text-[#A1A7AB] mr-2">
              {String(activeSlide + 1).padStart(2, '0')} / {String(GALLERY_ITEMS.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous gallery image"
              className="inline-flex items-center justify-center w-11 h-11 border border-[#141618]/25 text-[#141618] hover:bg-[#141618] hover:text-[#F6F4EF] dark:border-[#F3F0E9]/25 dark:text-[#F3F0E9] dark:hover:bg-[#A95632] dark:hover:border-[#A95632] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next gallery image"
              className="inline-flex items-center justify-center w-11 h-11 border border-[#141618]/25 text-[#141618] hover:bg-[#141618] hover:text-[#F6F4EF] dark:border-[#F3F0E9]/25 dark:text-[#F3F0E9] dark:hover:bg-[#A95632] dark:hover:border-[#A95632] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Horizontal Strip */}
        <div className="space-y-4">
          <div
            ref={scrollerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onScroll={(e) => {
              const target = e.currentTarget;
              const cardWidth = target.firstElementChild?.getBoundingClientRect().width ?? 360;
              const idx = Math.round(target.scrollLeft / (cardWidth + 24));
              setActiveSlide(Math.max(0, Math.min(GALLERY_ITEMS.length - 1, idx)));
              const maxScroll = Math.max(1, target.scrollWidth - target.clientWidth);
              setScrollRatio(Math.min(1, Math.max(0, target.scrollLeft / maxScroll)));
            }}
            className={`flex gap-6 overflow-x-auto pb-4 select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory scroll-smooth'
            }`}
          >
            {GALLERY_ITEMS.map((item, idx) => (
              <figure
                key={item.id}
                className="snap-start shrink-0 w-[82vw] sm:w-[420px] lg:w-[460px] bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 flex flex-col justify-between group"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    if (dragStateRef.current.movedDistance > 6) {
                      e.preventDefault();
                      return;
                    }
                    triggerRef.current = e.currentTarget;
                    setLightboxIndex(idx);
                  }}
                  aria-label={`Inspect larger image: ${item.caption}`}
                  className={`relative aspect-[4/3] w-full overflow-hidden cursor-pointer text-left ${
                    item.specimenPlate ? 'bg-[#F6F4EF] p-4' : 'bg-[#141618]'
                  }`}
                >
                  <ResilientImage
                    src={item.src}
                    alt={item.alt}
                    loading="eager"
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-[1.03] pointer-events-none ${
                      item.specimenPlate ? 'object-contain' : 'object-cover'
                    }`}
                    containerClassName="w-full h-full"
                  />
                  <span className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 bg-[#141618]/80 text-[#F3F0E9] opacity-90 group-hover:bg-[#9E4B28] transition-colors">
                    <Maximize2 className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>

                <figcaption className="p-4 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 space-y-1">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                    Fig. {String(idx + 1).padStart(2, '0')} · {item.category}
                  </p>
                  <p className="text-xs text-[#141618] dark:text-[#F3F0E9]/88 leading-relaxed">
                    {item.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Scroll Progress Track */}
          <div className="h-[2px] w-full bg-[#141618]/12 dark:bg-[#F3F0E9]/14 overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-[#9E4B28] dark:bg-[#EC743C] origin-left transition-transform duration-150"
              style={{
                transform: `scaleX(${Math.max(1 / GALLERY_ITEMS.length, scrollRatio)})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Accessible Lightbox Viewer */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="fixed inset-0 z-50 bg-[#141618]/92 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setLightboxIndex(null);
                triggerRef.current?.focus();
              }
            }}
          >
            <div className="w-full max-w-5xl bg-[#191C20] border border-[#F3F0E9]/15 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F0E9]/12 text-[#F3F0E9]">
                <span className="font-mono-tabular text-xs text-[#EC743C]">
                  Fig. {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                  {String(GALLERY_ITEMS.length).padStart(2, '0')} ·{' '}
                  {GALLERY_ITEMS[lightboxIndex].category}
                </span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(null);
                    triggerRef.current?.focus();
                  }}
                  aria-label="Close image viewer"
                  className="inline-flex items-center justify-center w-10 h-10 text-[#F3F0E9] hover:bg-[#20242A] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div
                className={`relative aspect-video ${
                  GALLERY_ITEMS[lightboxIndex].specimenPlate ? 'bg-[#F6F4EF] p-6' : 'bg-[#121417]'
                }`}
              >
                <ResilientImage
                  src={GALLERY_ITEMS[lightboxIndex].src}
                  alt={GALLERY_ITEMS[lightboxIndex].alt}
                  className="w-full h-full object-contain"
                  containerClassName="w-full h-full"
                />
              </div>

              <div className="px-5 py-4 border-t border-[#F3F0E9]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[#F3F0E9]">
                <p className="text-xs sm:text-sm text-[#F3F0E9]/85">
                  {GALLERY_ITEMS[lightboxIndex].caption}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
                      )
                    }
                    aria-label="Previous image"
                    className="inline-flex items-center justify-center w-10 h-10 border border-[#F3F0E9]/20 hover:bg-[#A95632] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length)
                    }
                    aria-label="Next image"
                    className="inline-flex items-center justify-center w-10 h-10 border border-[#F3F0E9]/20 hover:bg-[#A95632] transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
