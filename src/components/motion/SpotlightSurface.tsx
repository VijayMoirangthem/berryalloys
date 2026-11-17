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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const resolvedFill =
    spotlightColor ??
    (theme === 'dark' ? 'rgba(236, 116, 60, 0.14)' : 'rgba(158, 75, 40, 0.08)');
  const resolvedBorderGlow =
    theme === 'dark' ? 'rgba(236, 116, 60, 0.42)' : 'rgba(158, 75, 40, 0.28)';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
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
