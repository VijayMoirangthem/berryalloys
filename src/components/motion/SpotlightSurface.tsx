import { ReactNode, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

/**
 * SpotlightSurface — Dual-theme glassy cursor-tracking spotlight wrapper.
 * Tracks pointer coordinates over cards/panels and renders an interactive radial
 * copper/ivory glass sheen plus specular border highlight without obscuring content.
 */
interface SpotlightSurfaceProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightSurface({
  children,
  className = '',
  spotlightColor,
}: SpotlightSurfaceProps) {
  const { theme } = useTheme();
  const divRef = useRef<HTMLDivElement>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const resolvedFill =
    spotlightColor ??
    (theme === 'dark' ? 'rgba(105, 197, 245, 0.14)' : 'rgba(0, 99, 147, 0.08)');
  const resolvedBorderGlow =
    theme === 'dark' ? 'rgba(105, 197, 245, 0.42)' : 'rgba(0, 99, 147, 0.28)';

  const updateFromClient = (clientX: number, clientY: number) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: clientX - rect.left, y: clientY - rect.top });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updateFromClient(e.clientX, e.clientY);
    if (e.pointerType !== 'mouse') {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      setOpacity(1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    updateFromClient(e.clientX, e.clientY);
    setOpacity(1);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') {
      fadeTimerRef.current = window.setTimeout(() => setOpacity(0), 650);
    }
  };

  return (
    <div
      ref={divRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setOpacity(0)}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setOpacity(1);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setOpacity(0);
      }}
      className={cn(
        'relative overflow-hidden transition-shadow duration-200',
        opacity > 0 ? 'shadow-md' : '',
        className
      )}
    >
      {/* Glassy Radial Spotlight Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-200"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${resolvedFill}, transparent 68%)`,
        }}
      />
      {/* Crisp Cursor-Aligned Border Specular */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity,
          padding: '1px',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          background: `radial-gradient(240px circle at ${position.x}px ${position.y}px, ${resolvedBorderGlow}, transparent 75%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
