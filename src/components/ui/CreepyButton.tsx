import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface CreepyButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'copper' | 'obsidian';
  'aria-label'?: string;
}

/**
 * CreepyButton — Dual-layer pointer-tracking CTA button where hovering/focusing
 * tilts the upper plate to reveal a pair of animated pupil orbs underneath.
 */
export function CreepyButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  className,
  variant = 'copper',
  'aria-label': ariaLabel,
}: CreepyButtonProps) {
  const eyesRef = useRef<HTMLSpanElement>(null);
  const [eyeCoords, setEyeCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const updateEyes = (clientX: number, clientY: number) => {
    const rect = eyesRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(1, Math.hypot(dx, dy) / 140);
    setEyeCoords({
      x: Math.cos(angle) * dist * 18,
      y: Math.sin(angle) * dist * 16,
    });
  };

  const resetEyes = () => {
    setIsHovered(false);
    setEyeCoords({ x: 0, y: 0 });
  };

  const underLayerClass =
    variant === 'copper' ? 'bg-[#10243A] border border-[#69C5F5]/40' : 'bg-[#07111F] border border-brand/50';

  const topPlateClass =
    variant === 'copper'
      ? 'bg-brand text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC] group-hover:bg-brand-hover'
      : 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#12243B] dark:text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/20';

  const innerContent = (
    <>
      {/* Hidden underneath orbital eyes */}
      <span
        ref={eyesRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none select-none"
      >
        <span className="flex items-center gap-1.5">
          {[0, 1].map((eye) => (
            <span
              key={eye}
              className="relative w-3.5 h-4 bg-[#FFFFFF] rounded-full overflow-hidden flex items-center justify-center shadow-inner"
            >
              <span
                className="w-1.5 h-1.5 bg-[#10243A] rounded-full transition-transform duration-75"
                style={{
                  transform: `translate(${eyeCoords.x}%, ${eyeCoords.y}%)`,
                }}
              />
            </span>
          ))}
        </span>
      </span>

      {/* Top Interactive Plate */}
      <span
        className={cn(
          'relative z-10 inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide origin-bottom-left transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          isHovered && 'motion-safe:-translate-y-1.5 motion-safe:-rotate-[6deg]',
          topPlateClass
        )}
      >
        {children}
      </span>
    </>
  );

  const resetTimerRef = useRef<number | null>(null);

  const sharedProps = {
    'aria-label': ariaLabel,
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      if (e.pointerType === 'mouse') setIsHovered(true);
    },
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      setIsHovered(true);
      updateEyes(e.clientX, e.clientY);
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType === 'mouse' || isHovered) {
        updateEyes(e.clientX, e.clientY);
      }
    },
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== 'mouse') {
        resetTimerRef.current = window.setTimeout(resetEyes, 260);
      }
    },
    onPointerCancel: resetEyes,
    onPointerLeave: resetEyes,
    onFocus: () => setIsHovered(true),
    onBlur: resetEyes,
    className: cn(
      'group relative inline-flex items-center overflow-visible cursor-pointer whitespace-nowrap shrink-0 select-none',
      underLayerClass,
      className
    ),
  };

  if (to) {
    return (
      <Link to={to} onClick={onClick} {...sharedProps}>
        {innerContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} {...sharedProps}>
        {innerContent}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} {...sharedProps}>
      {innerContent}
    </button>
  );
}

export default CreepyButton;
