import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';

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
  onItemSelect?: (item: CircularGalleryItem, index: number) => void;
}

/**
 * CircularGallery — Tilted 3D GSAP rotating visual ring with hover center
 * zoom preview, horizontal scroll/drag rotation, and lightbox selection support.
 */
export function CircularGallery({
  items,
  spacing = 42,
  cardSize = { width: 176, height: 124 },
  className,
  initialRotation = 165,
  onItemSelect,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<CircularGalleryItem | null>(null);
  const [containerScale, setContainerScale] = useState(1);

  const rotationRef = useRef({ current: initialRotation, target: initialRotation });
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startRotation: initialRotation,
    movedDistance: 0,
  });

  const radius = Math.max(250, Math.round(items.length * spacing * 0.78));

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      if (w < 640) {
        setContainerScale(0.62);
      } else if (w < 980) {
        setContainerScale(0.8);
      } else {
        setContainerScale(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!galleryRef.current || !ringRef.current) return;

    const ringElement = ringRef.current;

    gsap.set(galleryRef.current, {
      perspective: 1650,
    });

    gsap.set(ringElement, {
      transformStyle: 'preserve-3d',
      rotateY: initialRotation,
    });

    if (!prefersReduced) {
      gsap.from(ringElement, {
        scale: 0.92,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
      });
    }

    let rafId = 0;
    let disposed = false;

    const animate = () => {
      if (disposed) return;
      const rot = rotationRef.current;
      if (!dragRef.current.isDragging && !prefersReduced) {
        rot.target += 0.06;
      }
      rot.current += (rot.target - rot.current) * 0.085;
      gsap.set(ringElement, { rotateY: rot.current });
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      gsap.killTweensOf(ringElement);
    };
  }, [initialRotation, items.length]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault();
      rotationRef.current.target -= (e.deltaX || e.deltaY) * 0.14;
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startRotation: rotationRef.current.target,
      movedDistance: 0,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.movedDistance = Math.max(dragRef.current.movedDistance, Math.abs(dx));
    rotationRef.current.target = dragRef.current.startRotation + dx * 0.25;
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
    window.setTimeout(() => {
      dragRef.current.movedDistance = 0;
    }, 60);
  };

  const previewItem = hoveredItem ?? items[0] ?? null;

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={cn(
        'relative h-[460px] sm:h-[540px] w-full select-none overflow-hidden border border-[#141618]/14 dark:border-[#F3F0E9]/14 bg-[#141618] text-[#F3F0E9] cursor-grab active:cursor-grabbing',
        className
      )}
    >
      {/* Subtle Copper Overhead Studio Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(236,116,60,0.16),transparent_65%)]"
      />

      {/* Tilted 3D Ring Stage */}
      <div
        ref={galleryRef}
        className="relative flex h-full w-full items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${containerScale}) rotate(-10deg)`,
        }}
      >
        <div
          ref={ringRef}
          className="relative flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, idx) => {
            const angle = (idx / items.length) * 360;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setHoveredItem(item)}
                onFocus={() => setHoveredItem(item)}
                onClick={() => {
                  if (dragRef.current.movedDistance > 8) return;
                  onItemSelect?.(item, idx);
                }}
                aria-label={`Inspect ${item.caption ?? item.alt}`}
                className="group absolute flex flex-col overflow-hidden border border-[#F3F0E9]/25 bg-[#191C20] shadow-[0_14px_30px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-110 hover:border-[#EC743C] focus-visible:border-[#EC743C] focus-visible:outline-none cursor-pointer"
                style={{
                  width: `${cardSize.width}px`,
                  height: `${cardSize.height}px`,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'visible',
                }}
              >
                <div
                  className={cn(
                    'flex-1 w-full overflow-hidden',
                    item.specimenPlate ? 'bg-[#F6F4EF] p-1.5' : 'bg-[#121417]'
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    draggable={false}
                    className={cn(
                      'w-full h-full pointer-events-none',
                      item.specimenPlate ? 'object-contain' : 'object-cover'
                    )}
                  />
                </div>
                <span className="px-1.5 py-1 text-[9px] font-mono-tabular uppercase tracking-wider text-[#F3F0E9]/85 bg-[#121417]/95 truncate text-left w-full border-t border-[#F3F0E9]/12">
                  Fig. {String(idx + 1).padStart(2, '0')} · {item.category ?? 'Work'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Featured Inspection Card */}
      {previewItem && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 w-[170px] sm:w-[220px] border border-[#EC743C]/55 bg-[#121417]/94 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
          <div
            className={cn(
              'aspect-[4/3] w-full overflow-hidden',
              previewItem.specimenPlate ? 'bg-[#F6F4EF] p-2' : 'bg-[#191C20]'
            )}
          >
            <img
              src={previewItem.src}
              alt={previewItem.alt}
              className={cn(
                'w-full h-full',
                previewItem.specimenPlate ? 'object-contain' : 'object-cover'
              )}
            />
          </div>
          <div className="pt-2 space-y-0.5 text-left">
            <p className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#EC743C]">
              {previewItem.category ?? 'Archive Frame'}
            </p>
            <p className="text-[11px] text-[#F3F0E9]/90 line-clamp-2 leading-snug">
              {previewItem.caption ?? previewItem.alt}
            </p>
          </div>
        </div>
      )}

      {/* Quiet Drag Instruction Footer */}
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 z-30 flex items-center justify-between text-[11px] font-mono-tabular text-[#A1A7AB]">
        <span>Drag horizontally or hold Shift + scroll to rotate 3D ring</span>
        <span>Click any plate to open full viewer</span>
      </div>
    </div>
  );
}

export default CircularGallery;
