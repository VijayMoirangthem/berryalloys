import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

const CHAR_SET = ' .,:;+*#%@';
const COLS = 52;
const ROWS = 22;

function buildAsciiArt(side: 'left' | 'right'): string[] {
  const offscreen = document.createElement('canvas');
  offscreen.width = COLS;
  offscreen.height = ROWS;
  const ctx = offscreen.getContext('2d');
  if (!ctx) return Array.from({ length: ROWS }, () => ' '.repeat(COLS));

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, COLS, ROWS);

  // Procedurally paint architectural metallurgy forms (smelting vessel + ingot lattice)
  const grad = ctx.createLinearGradient(
    side === 'left' ? 0 : COLS,
    0,
    side === 'left' ? COLS : 0,
    ROWS
  );
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.55, '#a8a8a8');
  grad.addColorStop(1, '#121212');
  ctx.fillStyle = grad;

  if (side === 'left') {
    // Furnace & pouring ladle silhouette
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(24, 2);
    ctx.lineTo(36, 9);
    ctx.lineTo(44, 15);
    ctx.lineTo(40, ROWS);
    ctx.lineTo(0, ROWS);
    ctx.closePath();
    ctx.fill();

    // Diagonal truss voids
    ctx.fillStyle = '#222222';
    ctx.fillRect(6, 5, 12, 4);
    ctx.fillRect(14, 12, 16, 4);
  } else {
    // Stepped ferro-alloy ingot blocks & cooling gantry
    ctx.beginPath();
    ctx.moveTo(COLS, 2);
    ctx.lineTo(COLS - 26, 2);
    ctx.lineTo(COLS - 38, 10);
    ctx.lineTo(COLS - 45, 16);
    ctx.lineTo(COLS - 40, ROWS);
    ctx.lineTo(COLS, ROWS);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#222222';
    ctx.fillRect(COLS - 19, 5, 13, 4);
    ctx.fillRect(COLS - 30, 12, 16, 4);
  }

  const pixels = ctx.getImageData(0, 0, COLS, ROWS).data;
  const lines: string[] = [];
  for (let y = 0; y < ROWS; y++) {
    let row = '';
    for (let x = 0; x < COLS; x++) {
      const idx = (y * COLS + x) * 4;
      const lum = pixels[idx] / 255;
      if (lum < 0.08) {
        row += ' ';
      } else {
        const charIndex = Math.min(
          CHAR_SET.length - 1,
          Math.floor(lum * (CHAR_SET.length - 1))
        );
        row += CHAR_SET[charIndex];
      }
    }
    lines.push(row);
  }
  return lines;
}

function AsciiStructureCluster({
  side,
  hovered,
  isDark,
}: {
  side: 'left' | 'right';
  hovered: boolean;
  isDark: boolean;
}) {
  const [hoverTick, setHoverTick] = useState(0);
  const lines = useMemo(() => buildAsciiArt(side), [side]);

  useEffect(() => {
    if (!hovered) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const id = window.setInterval(() => {
      setHoverTick((prev) => (prev + 1) % 7);
    }, 140);
    return () => window.clearInterval(id);
  }, [hovered]);

  const dimColor = isDark ? '#323842' : '#B8B0A0';
  const midColor = isDark ? '#8B4A2B' : '#9E4B28';
  const brightColor = isDark ? '#EC743C' : '#B5471C';

  return (
    <pre
      aria-hidden="true"
      className={cn(
        'font-mono-tabular text-[9px] sm:text-[10px] leading-[1.08] tracking-[0.06em] select-none overflow-hidden whitespace-pre transition-opacity duration-300',
        side === 'left' ? 'text-left' : 'text-right'
      )}
    >
      {lines.map((line, rIdx) => (
        <span key={rIdx} className="block">
          {line.split('').map((ch, cIdx) => {
            if (ch === ' ') return ' ';
            const isCluster =
              hovered && ((rIdx * 3 + cIdx + hoverTick) % 7 === 0 || (rIdx + cIdx) % 11 === 0);
            const isEdge = ch === '@' || ch === '%' || ch === '#';
            return (
              <span
                key={cIdx}
                style={{
                  color: isCluster ? brightColor : isEdge ? midColor : dimColor,
                  transition: 'color 160ms ease',
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </pre>
  );
}

/**
 * AnimatedFooterCanvas — Adapted from VengeanceUI AnimatedFooter.
 * Renders deterministic procedural ASCII industrial metallurgy lattices
 * framing the footer marquee with cursor-activated copper thermal clusters
 * and GSAP reveal without relying on missing external JPG paths.
 */
export function AnimatedFooterCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current || !headlineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 1.0,
        ease: 'power4.out',
        clearProps: 'clipPath',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 92%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative border-b border-[#141618]/14 dark:border-[#F3F0E9]/12 overflow-hidden py-10 sm:py-12"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 relative">
        {/* Left & Right Procedural ASCII Silhouettes */}
        <div className="hidden lg:flex items-center justify-between pointer-events-none opacity-80">
          <AsciiStructureCluster side="left" hovered={isHovered} isDark={isDark} />
          <AsciiStructureCluster side="right" hovered={isHovered} isDark={isDark} />
        </div>

        {/* Center Architectural Reveal Display */}
        <div
          ref={headlineRef}
          className="lg:absolute lg:inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#9E4B28] dark:text-[#EC743C] mb-2">
            From Heat to Precision · Bobbili · Dhalbhumgarh · Visakhapatnam
          </p>
          <p className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] leading-none">
            Berry Alloys
          </p>
        </div>
      </div>
    </div>
  );
}
