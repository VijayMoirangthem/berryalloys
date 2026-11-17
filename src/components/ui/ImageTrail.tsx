import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface TrailPhoto {
  src: string;
  alt?: string;
}

export interface ImageTrailProps {
  images: Array<string | TrailPhoto>;
  children: ReactNode;
  className?: string;
  spawnDistance?: number;
  maxActive?: number;
  lifetimeMs?: number;
}

interface ActiveTrailNode {
  id: number;
  x: number;
  y: number;
  rotate: number;
  src: string;
  alt: string;
}

/**
 * ImageTrail — Smooth spring-animated floating editorial photo trail triggered
 * by pointer travel across banners or archives, never blocking child clicks.
 */
export function ImageTrail({
  images,
  children,
  className,
  spawnDistance = 78,
  maxActive = 6,
  lifetimeMs = 1280,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const cursorIdxRef = useRef(0);
  const idCounterRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const prefersReduced = useReducedMotion();
  const [nodes, setNodes] = useState<ActiveTrailNode[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReduced || e.pointerType === 'touch' || images.length === 0) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!lastPosRef.current) {
        lastPosRef.current = { x, y };
        return;
      }

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist < spawnDistance) return;

      lastPosRef.current = { x, y };

      const item = images[cursorIdxRef.current % images.length];
      cursorIdxRef.current += 1;

      const src = typeof item === 'string' ? item : item.src;
      const alt = typeof item === 'string' ? '' : item.alt ?? '';
      const id = ++idCounterRef.current;
      const rotate = ((id % 5) - 2) * 3.5;

      setNodes((prev) => [...prev.slice(-(maxActive - 1)), { id, x, y, rotate, src, alt }]);

      const tid = window.setTimeout(() => {
        setNodes((prev) => prev.filter((n) => n.id !== id));
      }, lifetimeMs);
      timersRef.current.push(tid);
    },
    [images, spawnDistance, maxActive, lifetimeMs, prefersReduced]
  );

  const handlePointerLeave = useCallback(() => {
    lastPosRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Floating spring photo cards behind content */}
      {!prefersReduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence>
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.72, rotate: node.rotate - 6 }}
                animate={{ opacity: 0.36, scale: 1, rotate: node.rotate }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute w-32 h-22 sm:w-40 sm:h-26 border border-brand/35 dark:border-[#69C5F5]/35 bg-[#07111F] shadow-xl overflow-hidden"
              >
                <img
                  src={node.src}
                  alt={node.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default ImageTrail;
