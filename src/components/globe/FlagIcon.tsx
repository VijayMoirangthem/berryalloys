import { useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * Local SVG flags. India ships inline (it is the company's home country and appears on the map legend).
 * Any other country resolves to `/flags/<iso2>.svg`; add the file when a market is approved.
 * If a file is missing the flag is simply omitted — the country name always accompanies it.
 */
export function FlagIcon({ code, className }: { code: string; className?: string }) {
  const [missing, setMissing] = useState(false);
  const iso = code.toLowerCase();

  if (iso === 'in') {
    return (
      <svg
        viewBox="0 0 36 24"
        role="img"
        aria-label="Flag of India"
        className={cn('inline-block shrink-0 border border-black/10', className)}
      >
        <rect width="36" height="8" fill="#FF9933" />
        <rect y="8" width="36" height="8" fill="#FFFFFF" />
        <rect y="16" width="36" height="8" fill="#138808" />
        <g transform="translate(18 12)" fill="none" stroke="#000080" strokeWidth="0.7">
          <circle r="3.2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-3.2" transform={`rotate(${i * 30})`} />
          ))}
        </g>
      </svg>
    );
  }

  if (missing) return null;
  return (
    <img
      src={`/flags/${iso}.svg`}
      alt={`Flag of ${code.toUpperCase()}`}
      className={cn('inline-block shrink-0 border border-black/10 object-cover', className)}
      onError={() => setMissing(true)}
      loading="lazy"
    />
  );
}
