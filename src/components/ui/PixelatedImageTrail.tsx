import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ASSETS } from '../../data/assets';
import { cn } from '../../lib/utils';

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
  spawnDistance = 125,
  imageSize = { width: 170, height: 205 },
}: PixelatedImageTrailProps) {
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || images.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastMousePosRef.current.x;
    const dy = y - lastMousePosRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance >= spawnDistance && !isAnimatingRef.current) {
      isAnimatingRef.current = true;
      lastMousePosRef.current = { x, y };

      const src = images[currentImgIndexRef.current % images.length];
      currentImgIndexRef.current = (currentImgIndexRef.current + 1) % images.length;

      createTrailItem(x, y, src);

      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, 95);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
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
