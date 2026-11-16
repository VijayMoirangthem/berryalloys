import { ReactNode, useRef, useState } from 'react';

/**
 * SpotlightSurface — Adapted from React Bits SpotlightCard (https://reactbits.dev).
 * Applies a subtle warm copper specular gradient following pointer position on dark technical panels.
 */
interface SpotlightSurfaceProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightSurface({
  children,
  className = '',
  spotlightColor = 'rgba(236, 116, 60, 0.12)',
}: SpotlightSurfaceProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

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
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-200"
        style={{
          opacity,
          background: `radial-gradient(480px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
