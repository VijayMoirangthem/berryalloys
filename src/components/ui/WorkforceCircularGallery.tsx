import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { Maximize2, Pause, Play, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface WorkforceRingImage {
  src: string;
  caption: string;
  category: string;
}

export interface WorkforceCircularGalleryProps {
  /** Curated photographic frames cycled around the 3D tilted orbital ring. */
  images: WorkforceRingImage[];
  /** Number of cards arranged around the ring. */
  count?: number;
  /** Base tilt of the ring in degrees (rotateX). */
  tilt?: number;
  /** Ring radius in px. */
  radius?: number;
  /** Card width in px. */
  itemWidth?: number;
  /** Card height in px. */
  itemHeight?: number;
  /** Auto-rotate ring slowly. */
  autoRotate?: boolean;
  /** Degrees per second when auto-rotating. */
  autoRotateSpeed?: number;
  /** Show centre preview card when hovering/tapping a card. */
  showPreview?: boolean;
  /** Parallax tilt toward pointer. */
  parallax?: boolean;
  className?: string;
}

/**
 * WorkforceCircularGallery — VengeanceUI 3D Tilted Circular Ring Gallery powered by GSAP.
 * Cards orbit around a giant tilted ring; drag to spin, hover or tap any card to mirror it
 * in the central preview, and click any card to open a crisp full-screen inspection modal.
 */
export function WorkforceCircularGallery({
  images,
  count = 48,
  tilt = 56,
  radius = 360,
  itemWidth = 54,
  itemHeight = 72,
  autoRotate = true,
  autoRotateSpeed = 3.2,
  showPreview = true,
  parallax = true,
  className,
}: WorkforceCircularGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [activePreview, setActivePreview] = useState<WorkforceRingImage | null>(
    images[0] ?? null
  );
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<WorkforceRingImage | null>(null);
  const draggingMovedRef = useRef(false);

  const itemOf = (i: number) =>
    images.length > 0 ? images[i % images.length] : undefined;

  const optsRef = useRef({
    autoRotate: autoRotate && !isPaused,
    autoRotateSpeed,
    parallax,
    tilt,
  });

  useEffect(() => {
    optsRef.current = {
      autoRotate: autoRotate && !isPaused && !lightboxItem,
      autoRotateSpeed,
      parallax,
      tilt,
    };
  }, [autoRotate, isPaused, lightboxItem, autoRotateSpeed, parallax, tilt]);

  useEffect(() => {
    const root = rootRef.current;
    const gallery = galleryRef.current;
    if (!root || !gallery) return;

    const items = gsap.utils.toArray<HTMLElement>(
      gallery.querySelectorAll('[data-ring-item]')
    );
    if (items.length === 0) return;

    const angleIncrement = 360 / items.length;
    const baseAngles = items.map((_, i) => i * angleIncrement - 90);

    items.forEach((item, i) => {
      gsap.set(item, {
        rotationY: 50,
        rotationZ: baseAngles[i],
        transformOrigin: `50% ${radius}px`,
      });
    });
    gsap.set(gallery, { rotationY: 0 });

    const fitRing = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) return;
      // Phones: let the ring overflow the viewport sides so the cards stay big enough to read; spinning reveals the rest.
      const phone = width < 640;
      const scale = Math.min(
        1,
        phone ? (width * 1.5) / (radius * 2.15) : (width - 40) / (radius * 2.15),
        (height - 44) / (radius * 1.55)
      );
      gsap.set(gallery, { scale: Math.max(phone ? 0.5 : 0.28, scale) });
    };
    const resizeObserver = new ResizeObserver(fitRing);
    resizeObserver.observe(root);
    fitRing();

    const setZ = items.map((item) => gsap.quickSetter(item, 'rotationZ', 'deg'));

    gsap.fromTo(
      gallery,
      { rotationX: optsRef.current.tilt + 14, opacity: 0.2 },
      { rotationX: optsRef.current.tilt, opacity: 1, duration: 1.1, ease: 'power3.out' }
    );

    let current = 0;
    let target = 0;
    let isInViewport = true;
    let isPageVisible = !document.hidden;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = reducedMotionQuery.matches;

    let dragging = false;
    let lastX = 0;

    const tick = () => {
      if (!isInViewport || !isPageVisible) return;
      const { autoRotate: auto, autoRotateSpeed: speed } = optsRef.current;
      if (auto && !reducedMotion && !dragging) {
        target += (speed / 60) * gsap.ticker.deltaRatio();
      }
      current += (target - current) * 0.06;
      for (let i = 0; i < setZ.length; i++) {
        setZ[i](baseAngles[i] + current);
      }
    };
    gsap.ticker.add(tick);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
      },
      { rootMargin: '160px' }
    );
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };
    visibilityObserver.observe(root);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotionQuery.addEventListener('change', onReducedMotionChange);

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.closest('[data-ring-control]')) return;
      dragging = true;
      draggingMovedRef.current = false;
      lastX = e.clientX;
      root.style.cursor = 'grabbing';
    };
    const onPointerMove = (e: PointerEvent) => {
      if (optsRef.current.parallax && e.pointerType === 'mouse') {
        const rect = root.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(gallery, {
          rotationX: optsRef.current.tilt + py * 3.5,
          rotationY: px * 4,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
      if (dragging) {
        const dx = e.clientX - lastX;
        if (Math.abs(dx) > 3) draggingMovedRef.current = true;
        target += dx * 0.34;
        lastX = e.clientX;
      }
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      root.style.cursor = 'grab';
    };

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      gsap.killTweensOf(gallery);
    };
  }, [count, radius, images]);

  useEffect(() => {
    if (!lightboxItem) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxItem]);

  const showPreviewItem = (item?: WorkforceRingImage) => {
    if (!item) return;
    setActivePreview(item);
    setPreviewVisible(true);
    if (previewRef.current && previewRef.current.src !== item.src) {
      previewRef.current.src = item.src;
    }
  };

  return (
    <div
      ref={rootRef}
      style={{ cursor: 'grab', touchAction: 'pan-y' }}
      className={cn(
        'relative h-[460px] sm:h-[500px] lg:h-[540px] w-full select-none overflow-hidden [perspective:1500px]',
        'border border-[#10243A]/14 dark:border-[#F4F8FC]/14',
        'bg-[radial-gradient(circle_at_50%_42%,#F6FAFE,#E4EFF9)] dark:bg-[radial-gradient(circle_at_50%_42%,#112339,#050C17)]',
        className
      )}
    >
      {/* Top-Left Minimal Badge */}
      <div className="pointer-events-none absolute top-4 left-4 z-30 bg-[#FFFFFF]/90 dark:bg-[#07111F]/88 border border-[#10243A]/14 dark:border-[#F4F8FC]/16 px-3 py-1.5">
        <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
          3D Orbital Culture Ring · {images.length} Verified Frames
        </p>
      </div>

      {/* Top-Right Pause / Play Control */}
      <div data-ring-control="true" className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? 'Resume orbital ring rotation' : 'Pause orbital ring rotation'}
          className="inline-flex items-center gap-1.5 min-h-[34px] px-3 bg-[#FFFFFF]/92 dark:bg-[#07111F]/90 border border-[#10243A]/16 dark:border-[#F4F8FC]/18 text-[10px] font-mono-tabular uppercase tracking-wider text-[#10243A] dark:text-[#F4F8FC] hover:border-brand cursor-pointer"
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3" aria-hidden="true" />
              <span>Spin</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" aria-hidden="true" />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>

      {/* Centre Preview Card — reveals smoothly when hovering or tapping any orbital frame */}
      {showPreview && activePreview && (
        <div
          ref={previewWrapRef}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 z-20 w-[260px] sm:w-[320px] max-w-[78%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[#10243A]/20 dark:border-[#F4F8FC]/24 bg-[#07111F] shadow-2xl transition-opacity duration-200',
            previewVisible ? 'opacity-100' : 'opacity-90'
          )}
        >
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img
              ref={previewRef}
              src={activePreview.src}
              alt={activePreview.caption}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="px-3.5 py-2.5 bg-[#07111F]/95 border-t border-[#F4F8FC]/14">
            <p className="text-[9px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
              {activePreview.category}
            </p>
            <p className="text-xs font-medium text-[#F4F8FC] truncate">
              {activePreview.caption}
            </p>
          </div>
        </div>
      )}

      {/* 3D Tilted Orbital Ring */}
      <div
        ref={galleryRef}
        className="absolute left-1/2 top-[15%] z-10 -translate-x-1/2 [transform-style:preserve-3d]"
      >
        {Array.from({ length: count }).map((_, i) => {
          const item = itemOf(i);
          if (!item) return null;
          return (
            <div
              key={i}
              data-ring-item
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${item.caption}`}
              onMouseEnter={() => showPreviewItem(item)}
              onMouseLeave={() => setPreviewVisible(false)}
              onFocus={() => showPreviewItem(item)}
              onClick={() => {
                if (draggingMovedRef.current) return;
                showPreviewItem(item);
                setLightboxItem(item);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightboxItem(item);
                }
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[3px] bg-[#10243A] shadow-md shadow-black/25 ring-1 ring-[#10243A]/20 dark:ring-[#F4F8FC]/25 [transform-style:preserve-3d] cursor-pointer"
              style={{ width: itemWidth, height: itemHeight, margin: 8 }}
            >
              <img
                src={item.src}
                alt={item.caption}
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover transition-[transform,filter] duration-300 hover:scale-110 hover:brightness-110"
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Interactive Prompt */}
      <div className="pointer-events-none absolute bottom-3.5 inset-x-4 z-30 flex items-center justify-between text-[10px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
        <span>Drag horizontally to spin ring</span>
        <span className="inline-flex items-center gap-1 text-brand dark:text-[#69C5F5]">
          <Maximize2 className="w-3 h-3" aria-hidden="true" />
          Click any card to expand
        </span>
      </div>

      {/* Soft radial edge vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_46%,transparent_58%,rgba(228,239,249,0.58))] dark:bg-[radial-gradient(circle_at_50%_46%,transparent_58%,rgba(5,12,23,0.62))]"
      />

      {/* Full-Resolution Inspection Lightbox */}
      {lightboxItem &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.caption}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-[120] bg-[#040B14]/92 flex items-center justify-center p-4 sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0B1726] border border-[#F4F8FC]/20 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#F4F8FC]/12 bg-[#07111F]">
                <div className="min-w-0">
                  <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                    {lightboxItem.category}
                  </p>
                  <p className="font-display text-lg font-bold uppercase text-[#F4F8FC] truncate">
                    {lightboxItem.caption}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  aria-label="Close preview"
                  className="inline-flex items-center justify-center w-9 h-9 border border-[#F4F8FC]/20 bg-[#10243A] text-[#F4F8FC] hover:bg-[#C9233B] hover:border-[#C9233B] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="bg-[#050C16] flex items-center justify-center p-4">
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.caption}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default WorkforceCircularGallery;
