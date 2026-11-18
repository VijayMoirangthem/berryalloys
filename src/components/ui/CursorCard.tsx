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
 * narrative terms on desktop hover, and a crisp tap-to-inspect bottom card on mobile.
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
  const [mounted, setMounted] = useState(false);
  const isCompactMobile = useIsCompactMobile(767);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isCompactMobile) return;
    const { targetX, targetY } = clampCoordinates(e.clientX, e.clientY);
    mouseX.set(targetX);
    mouseY.set(targetY);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (isCompactMobile) return;
    const { targetX, targetY } = clampCoordinates(e.clientX, e.clientY);
    mouseX.jump(targetX);
    mouseY.jump(targetY);
    smoothX.jump(targetX);
    smoothY.jump(targetY);
    setIsActive(true);
  };

  const handleFocus = () => {
    if (isCompactMobile || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const { targetX, targetY } = clampCoordinates(rect.right, rect.top + rect.height * 0.5);
    mouseX.jump(targetX);
    mouseY.jump(targetY);
    smoothX.jump(targetX);
    smoothY.jump(targetY);
    setIsActive(true);
  };

  const handleClick = () => {
    if (isCompactMobile) {
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
        role={onActivate || isCompactMobile ? 'button' : undefined}
        aria-describedby={isActive ? tooltipId : undefined}
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((onActivate || isCompactMobile) && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
          if (e.key === 'Escape') {
            setIsActive(false);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (!isCompactMobile) setIsActive(false);
        }}
        onFocus={handleFocus}
        onBlur={() => setIsActive(false)}
        className={cn(
          variant === 'block'
            ? 'relative block'
            : 'relative inline font-semibold text-[#10243A] dark:text-[#F4F8FC] border-b border-dashed border-brand dark:border-[#69C5F5] hover:text-brand dark:hover:text-[#69C5F5] transition-colors cursor-help focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#69C5F5]',
          className
        )}
      >
        {children}
      </Wrapper>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isActive &&
              (isCompactMobile ? (
                <motion.div
                  id={tooltipId}
                  role="dialog"
                  aria-label={caption ?? 'Site reference preview'}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'fixed bottom-4 left-4 right-4 z-[9990] border border-[#10243A]/20 dark:border-[#F4F8FC]/22 bg-[#FFFFFF] dark:bg-[#0D1B2E] shadow-2xl overflow-hidden',
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
                      className="absolute top-2 right-2 inline-flex items-center justify-center w-9 h-9 bg-[#07111F]/85 text-[#F4F8FC] border border-[#F4F8FC]/20"
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
