import React, { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsCompactMobile } from '../../hooks/useIsCompactMobile';

export interface CursorCardProps {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  caption?: string;
  description: string;
  className?: string;
  cardClassName?: string;
  variant?: 'inline' | 'block';
  onActivate?: () => void;
}

/**
 * CursorCard — Spring-physics floating preview card triggered from inline
 * narrative terms on mouse hover, and a crisp tap-to-inspect preview sheet on touchscreens.
 */
export function CursorCard({
  children,
  imageSrc,
  imageAlt = '',
  caption,
  description,
  className,
  cardClassName,
  variant = 'inline',
  onActivate,
}: CursorCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [touchMode, setTouchMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isCompactMobile = useIsCompactMobile(767);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const openedByTouchRef = useRef(false);
  const tooltipId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const showTouchSheet = isCompactMobile || touchMode;

  useEffect(() => {
    if (!isActive || !showTouchSheet) return;
    const handleOutside = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target) || cardRef.current?.contains(target)) return;
      setIsActive(false);
    };
    document.addEventListener('pointerdown', handleOutside, true);
    return () => document.removeEventListener('pointerdown', handleOutside, true);
  }, [isActive, showTouchSheet]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 190, mass: 0.68 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const clampCoordinates = (clientX: number, clientY: number) => {
    const cardW = 320;
    const cardH = 270;
    const margin = 16;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    let targetX = clientX + 18;
    if (targetX + cardW > vw - margin) {
      targetX = Math.max(margin, clientX - cardW - 18);
    }

    let targetY = clientY - cardH * 0.45;
    if (targetY < margin) targetY = margin;
    if (targetY + cardH > vh - margin) {
      targetY = Math.max(margin, vh - cardH - margin);
    }

    return { targetX, targetY };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || isCompactMobile) return;
    openedByTouchRef.current = false;
    setTouchMode(false);
    const { targetX, targetY } = clampCoordinates(e.clientX, e.clientY);
    mouseX.jump(targetX);
    mouseY.jump(targetY);
    smoothX.jump(targetX);
    smoothY.jump(targetY);
    setIsActive(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || isCompactMobile) return;
    const { targetX, targetY } = clampCoordinates(e.clientX, e.clientY);
    mouseX.set(targetX);
    mouseY.set(targetY);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || isCompactMobile || openedByTouchRef.current) return;
    setIsActive(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') {
      openedByTouchRef.current = true;
      setTouchMode(true);
    } else {
      openedByTouchRef.current = false;
      setTouchMode(false);
    }
  };

  const handleFocus = () => {
    if (isCompactMobile || openedByTouchRef.current || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const { targetX, targetY } = clampCoordinates(rect.right, rect.top + rect.height * 0.5);
    mouseX.jump(targetX);
    mouseY.jump(targetY);
    smoothX.jump(targetX);
    smoothY.jump(targetY);
    setIsActive(true);
  };

  const handleClick = () => {
    if (isCompactMobile || openedByTouchRef.current) {
      setIsActive((prev) => !prev);
    }
    onActivate?.();
  };

  const Wrapper = variant === 'block' ? 'div' : 'span';

  return (
    <>
      <Wrapper
        ref={triggerRef as React.RefObject<HTMLDivElement>}
        tabIndex={0}
        role={onActivate || showTouchSheet ? 'button' : undefined}
        aria-describedby={isActive ? tooltipId : undefined}
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((onActivate || showTouchSheet) && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsActive((prev) => !prev);
            onActivate?.();
          }
          if (e.key === 'Escape') {
            setIsActive(false);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={() => {
          if (!openedByTouchRef.current) setIsActive(false);
        }}
        className={cn(
          variant === 'block'
            ? 'relative block'
            : 'relative inline font-semibold text-[#10243A] dark:text-[#F4F8FC] border-b border-dashed border-brand dark:border-[#69C5F5] hover:text-brand dark:hover:text-[#69C5F5] active:text-brand transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#69C5F5]',
          className
        )}
      >
        {children}
      </Wrapper>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isActive &&
              (showTouchSheet ? (
                <motion.div
                  ref={cardRef}
                  id={tooltipId}
                  role="dialog"
                  aria-label={caption ?? 'Site reference preview'}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[340px] z-[9990] border border-[#10243A]/20 dark:border-[#F4F8FC]/22 bg-[#FFFFFF] dark:bg-[#0D1B2E] shadow-2xl overflow-hidden',
                    cardClassName
                  )}
                >
                  <div className="relative h-36 w-full overflow-hidden bg-[#10243A]">
                    <img
                      src={imageSrc}
                      alt={imageAlt || description}
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                    {caption && (
                      <span className="absolute left-3 bottom-2.5 bg-[#07111F]/88 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider text-[#69C5F5]">
                        {caption}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsActive(false);
                      }}
                      aria-label="Close preview"
                      className="absolute top-2 right-2 inline-flex items-center justify-center w-9 h-9 bg-[#07111F]/85 text-[#F4F8FC] border border-[#F4F8FC]/20 cursor-pointer"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="p-3.5 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/12">
                    <p className="text-xs leading-relaxed text-[#465C72] dark:text-[#F4F8FC]/88">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.aside
                  id={tooltipId}
                  role="tooltip"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{
                    opacity: { duration: 0.3, ease: 'easeOut' },
                    scale: { type: 'spring', stiffness: 240, damping: 26 },
                  }}
                  style={{
                    left: 0,
                    top: 0,
                    x: smoothX,
                    y: smoothY,
                    pointerEvents: 'none',
                    willChange: 'transform, opacity',
                  }}
                  className={cn(
                    'fixed z-[9990] w-[300px] sm:w-[320px] overflow-hidden border border-[#10243A]/20 dark:border-[#F4F8FC]/22 bg-[#FFFFFF] dark:bg-[#0D1B2E] shadow-[0_24px_60px_rgba(0,0,0,0.28)]',
                    cardClassName
                  )}
                >
                  <div className="relative h-40 w-full overflow-hidden bg-[#10243A]">
                    <img
                      src={imageSrc}
                      alt={imageAlt || description}
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                    {caption && (
                      <span className="absolute left-3 bottom-2.5 bg-[#07111F]/88 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider text-[#69C5F5]">
                        {caption}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/12">
                    <p className="text-xs leading-relaxed text-[#465C72] dark:text-[#F4F8FC]/88">
                      {description}
                    </p>
                  </div>
                </motion.aside>
              ))}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

export default CursorCard;
