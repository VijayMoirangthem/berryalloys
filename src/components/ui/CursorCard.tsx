import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CursorCardProps {
  children: React.ReactNode;
  /** Primary preview image (supports both `image` from VengeanceUI and `imageSrc` legacy prop) */
  image?: string;
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  description: string;
  badge?: string;
  /** Internal router path or external href */
  to?: string;
  href?: string;
  className?: string;
}

/**
 * CursorCard — Editorial inline reference term that reveals a spring-physics
 * portal preview card following the cursor on desktop, and a tactile bottom
 * preview sheet on touch phones so iPhone visitors get full parity.
 */
export function CursorCard({
  children,
  image,
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  badge,
  to,
  href,
  className,
}: CursorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [touchSheetOpen, setTouchSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { damping: 25, stiffness: 300 });
  const springY = useSpring(rawY, { damping: 25, stiffness: 300 });

  useEffect(() => {
    setMounted(true);
    setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  const resolvedImg = image || imageSrc || '';
  const resolvedAlt = imageAlt || title || description;
  const resolvedLink = to || href;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return;
    const cardW = 272;
    const cardH = 260;
    const clampedX = Math.max(12, Math.min(window.innerWidth - cardW - 12, e.clientX - cardW / 2));
    const preferBelow = e.clientY + 24 + cardH < window.innerHeight;
    const clampedY = preferBelow ? e.clientY + 22 : Math.max(16, e.clientY - cardH - 18);
    rawX.set(clampedX);
    rawY.set(clampedY);
  };

  const triggerClasses = cn(
    'relative inline font-semibold text-[#10243A] dark:text-[#F4F8FC] underline decoration-brand/55 dark:decoration-[#69C5F5]/65 decoration-[1.5px] underline-offset-4 transition-colors duration-150',
    'hover:bg-[#006393]/10 dark:hover:bg-[#69C5F5]/16 hover:text-brand dark:hover:text-[#69C5F5] px-1 -mx-1 cursor-pointer',
    className
  );

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (isTouch) {
      e.preventDefault();
      setTouchSheetOpen(true);
    }
  };

  const triggerNode =
    resolvedLink && resolvedLink.startsWith('/') ? (
      <Link
        to={resolvedLink}
        className={triggerClasses}
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleTriggerClick}
      >
        {children}
      </Link>
    ) : resolvedLink ? (
      <a
        href={resolvedLink}
        className={triggerClasses}
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleTriggerClick}
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        className={triggerClasses}
        onMouseEnter={() => !isTouch && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setTouchSheetOpen(true)}
      >
        {children}
      </button>
    );

  return (
    <>
      {triggerNode}

      {/* Desktop spring-physics cursor-following portal preview card */}
      {mounted &&
        !isTouch &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                style={{ x: springX, y: springY }}
                className="fixed top-0 left-0 z-[90] w-[272px] pointer-events-none border border-[#10243A]/16 dark:border-[#69C5F5]/28 bg-[#FFFFFF] dark:bg-[#0D1B2E] shadow-2xl overflow-hidden"
              >
                {resolvedImg && (
                  <div className="relative h-36 w-full overflow-hidden bg-[#07111F]">
                    <img
                      src={resolvedImg}
                      alt={resolvedAlt}
                      className="w-full h-full object-cover"
                    />
                    {badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider bg-[#07111F]/85 text-[#69C5F5] border border-[#69C5F5]/30">
                        {badge}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-3.5 space-y-1">
                  {eyebrow && (
                    <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                      {eyebrow}
                    </p>
                  )}
                  {title && (
                    <p className="text-xs font-display font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                      {title}
                    </p>
                  )}
                  <p className="text-xs leading-relaxed text-[#465C72] dark:text-[#B5C5D7]">
                    {description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Touch device bottom preview sheet */}
      {mounted &&
        touchSheetOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Site preview'}
            className="fixed inset-0 z-[92] flex items-end justify-center bg-[#07111F]/60 backdrop-blur-[2px] p-3"
            onClick={() => setTouchSheetOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md border border-[#10243A]/18 dark:border-[#69C5F5]/25 bg-[#FFFFFF] dark:bg-[#0D1B2E] shadow-2xl overflow-hidden"
            >
              {resolvedImg && (
                <div className="relative h-44 w-full bg-[#07111F]">
                  <img
                    src={resolvedImg}
                    alt={resolvedAlt}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setTouchSheetOpen(false)}
                    aria-label="Close preview"
                    className="absolute top-2.5 right-2.5 w-9 h-9 inline-flex items-center justify-center bg-[#07111F]/80 text-[#F4F8FC] border border-[#F4F8FC]/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="p-4 space-y-2">
                {eyebrow && (
                  <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h4 className="font-display text-base font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                    {title}
                  </h4>
                )}
                <p className="text-xs leading-relaxed text-[#465C72] dark:text-[#B5C5D7]">
                  {description}
                </p>
                {resolvedLink && resolvedLink.startsWith('/') && (
                  <Link
                    to={resolvedLink}
                    onClick={() => setTouchSheetOpen(false)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand dark:text-[#69C5F5]"
                  >
                    Explore Facility
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </>
  );
}

export default CursorCard;
