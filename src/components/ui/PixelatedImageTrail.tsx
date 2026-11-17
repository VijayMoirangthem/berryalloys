import React, { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ASSETS } from '../../data/assets';
import { cn } from '../../lib/utils';
import { useInViewActive, useMotion } from '../../context/MotionContext';

const DEFAULT_TRAIL_IMAGES = [
  ASSETS.officialPlantGate.src,
  ASSETS.officialAerialComplex.src,
  ASSETS.heroSmelting.src,
  ASSETS.officialProdFeMn.src,
  ASSETS.officialProdSiMn.src,
  ASSETS.officialProdFeCr.src,
  ASSETS.officialProdFeSi.src,
  ASSETS.csrMedicalCamp.src,
  ASSETS.csrPlantation.src,
  ASSETS.officialSolarRoof.src,
];

interface PixelatedImageTrailProps {
  images?: string[];
  className?: string;
  children?: React.ReactNode;
  slices?: number;
  spawnDistance?: number;
  /** Fixed card size. When omitted, cards scale with the stage width (larger on big screens). */
  imageSize?: { width: number; height: number };
}

/**
 * PixelatedImageTrail — Pointer-driven sliced clip-path photography trail
 * adapted to verified local Berry Alloys works, alloy specimen, and CSR assets.
 */
export function PixelatedImageTrail({
  images = DEFAULT_TRAIL_IMAGES,
  className,
  children,
  slices = 4,
  spawnDistance,
  imageSize: imageSizeProp,
}: PixelatedImageTrailProps) {
  const { ambientActive, reducedMotion } = useMotion();
  const [stageWidth, setStageWidth] = useState(0);
  const imageSize = imageSizeProp ?? (() => {
    const w = Math.round(Math.min(250, Math.max(150, stageWidth * 0.2)));
    return { width: w, height: Math.round(w * 1.22) };
  })();
  const spawnGap = spawnDistance ?? Math.round(imageSize.width * 0.7);
  const lastInteractionRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trailLayerRef = useRef<HTMLDivElement>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const currentImgIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const activeCountRef = useRef(0);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageWidth(el.clientWidth));
    setStageWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const layer = trailLayerRef.current;
    return () => {
      if (layer) {
        gsap.killTweensOf(layer.querySelectorAll('*'));
        layer.innerHTML = '';
      }
    };
  }, []);

  const createTrailItem = useCallback(
    (x: number, y: number, src: string) => {
      const layer = trailLayerRef.current;
      if (!layer || !src || activeCountRef.current > 10) return;

      activeCountRef.current += 1;

      const wrapper = document.createElement('div');
      wrapper.className =
        'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[#F4F8FC]/25 bg-[#07111F] shadow-2xl';
      wrapper.style.left = `${x}px`;
      wrapper.style.top = `${y}px`;
      wrapper.style.width = `${imageSize.width}px`;
      wrapper.style.height = `${imageSize.height}px`;
      wrapper.style.zIndex = String(Date.now() % 100);

      const sliceWidthPercent = 100 / slices;
      const maskElements: HTMLDivElement[] = [];

      for (let i = 0; i < slices; i++) {
        const mask = document.createElement('div');
        mask.style.position = 'absolute';
        mask.style.inset = '0';

        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.className = 'h-full w-full object-cover';

        mask.appendChild(img);
        wrapper.appendChild(mask);
        maskElements.push(mask);
      }

      layer.appendChild(wrapper);

      maskElements.forEach((mask, i) => {
        const startX = i * sliceWidthPercent;
        const endX = (i + 1) * sliceWidthPercent + 0.6;
        gsap.set(mask, {
          clipPath: `polygon(${startX}% 0%, ${endX}% 0%, ${endX}% 0%, ${startX}% 0%)`,
          opacity: 0,
        });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          wrapper.remove();
          activeCountRef.current = Math.max(0, activeCountRef.current - 1);
        },
      });

      const randDelay = (i: number) => ((i * 37) % 10) * 0.015;

      maskElements.forEach((mask, i) => {
        const startX = i * sliceWidthPercent;
        const endX = (i + 1) * sliceWidthPercent + 0.6;
        tl.to(
          mask,
          {
            clipPath: `polygon(${startX}% 0%, ${endX}% 0%, ${endX}% 100%, ${startX}% 100%)`,
            opacity: 1,
            duration: 0.42,
            ease: 'power2.out',
          },
          randDelay(i)
        );
      });

      tl.to({}, { duration: 0.28 });

      maskElements.forEach((mask, i) => {
        const startX = i * sliceWidthPercent;
        const endX = (i + 1) * sliceWidthPercent + 0.6;
        tl.to(
          mask,
          {
            clipPath: `polygon(${startX}% 100%, ${endX}% 100%, ${endX}% 100%, ${startX}% 100%)`,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
          },
          0.62 + randDelay(i)
        );
      });
    },
    [imageSize.height, imageSize.width, slices]
  );

  const spawnAt = useCallback(
    (x: number, y: number) => {
      const src = images[currentImgIndexRef.current % images.length];
      currentImgIndexRef.current = (currentImgIndexRef.current + 1) % images.length;
      createTrailItem(x, y, src);
    },
    [images, createTrailItem]
  );

  // Self-playing demonstration: while on screen and untouched, a slow glide reveals frames so the effect is discoverable
  // on touch screens and before the first hover. It yields the moment someone interacts and honours the ambient pause.
  const inView = useInViewActive(containerRef, '0px');
  useEffect(() => {
    if (!inView || !ambientActive || reducedMotion || images.length === 0) return;
    const el = containerRef.current;
    if (!el) return;
    let t = 0;
    let last = { x: -9999, y: -9999 };
    const id = window.setInterval(() => {
      if (performance.now() - lastInteractionRef.current < 3500) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 50 || h < 50) return;
      t += 0.16;
      const x = w * (0.5 + 0.36 * Math.sin(t * 0.9));
      const y = h * (0.5 + 0.3 * Math.sin(t * 1.35 + 1.2));
      if (Math.hypot(x - last.x, y - last.y) >= spawnGap * 0.9) {
        last = { x, y };
        spawnAt(x, y);
      }
    }, 120);
    return () => window.clearInterval(id);
  }, [inView, ambientActive, reducedMotion, images.length, spawnGap, spawnAt]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || images.length === 0) return;
    lastInteractionRef.current = performance.now();
    if (reducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastMousePosRef.current.x;
    const dy = y - lastMousePosRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= spawnGap && !isAnimatingRef.current) {
      isAnimatingRef.current = true;
      lastMousePosRef.current = { x, y };

      spawnAt(x, y);

      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, 95);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      style={{ touchAction: 'pan-y' }}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        ref={trailLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
}

export default PixelatedImageTrail;
