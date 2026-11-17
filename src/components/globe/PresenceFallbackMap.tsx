import { useMemo } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import worldTopo from 'world-atlas/countries-110m.json';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { PresenceLocation, PresenceRoute } from '../../data/globalPresence';
import { KIND_LABEL } from '../../data/globalPresence';
import { FlagIcon } from './FlagIcon';
import { cn } from '../../lib/utils';

/**
 * Capability fallback for the globe: a flat world map with the same locations, floating flags, routes and
 * selection behaviour. Used when WebGL is unavailable or the 3D scene fails — never a blank container.
 */

const W = 1000;
const H = 620;
const FLAG_W = 44;
const FLAG_H = 30;

const collection = feature(
  worldTopo as unknown as Topology,
  (worldTopo as unknown as { objects: { countries: Topology['objects'][string] } }).objects.countries
) as unknown as FeatureCollection<Geometry, { name?: string }>;

const india = collection.features.find((f) => String(f.id) === '356') as Feature<Geometry>;

interface Props {
  locations: PresenceLocation[];
  routes: PresenceRoute[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  ambient: boolean;
}

export default function PresenceFallbackMap({ locations, routes, selectedId, hoveredId, onSelect, onHover, ambient }: Props) {
  const { landPaths, indiaPath, pts, flags } = useMemo(() => {
    const projection = geoNaturalEarth1().fitExtent(
      [
        [14, 78],
        [W - 14, H - 22],
      ],
      { type: 'Sphere' } as never
    );
    const path = geoPath(projection);
    const land = collection.features
      .filter((f) => String(f.id) !== '356')
      .map((f) => ({ id: String(f.id), d: path(f) ?? '' }))
      .filter((p) => p.d);
    const map = new Map<string, { x: number; y: number }>();
    for (const l of locations) {
      const p = projection([l.lng, l.lat]);
      if (p) map.set(l.id, { x: p[0], y: p[1] });
    }

    // Floating flags sit above their country position; overlapping badges are nudged apart once, up front.
    const f = locations
      .filter((l) => l.kind === 'export-market' && map.has(l.id))
      .map((l) => ({ id: l.id, sx: map.get(l.id)!.x, sy: map.get(l.id)!.y, x: map.get(l.id)!.x, y: map.get(l.id)!.y - 34 }));
    for (let pass = 0; pass < 12; pass++) {
      for (let i = 0; i < f.length; i++) {
        for (let j = i + 1; j < f.length; j++) {
          const dx = f[j].x - f[i].x;
          const dy = f[j].y - f[i].y;
          const ox = FLAG_W + 6 - Math.abs(dx);
          const oy = FLAG_H + 4 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            if (ox < oy) {
              const s = (dx >= 0 ? 1 : -1) * (ox / 2);
              f[i].x -= s;
              f[j].x += s;
            } else {
              const s = (dy >= 0 ? 1 : -1) * (oy / 2);
              f[i].y -= s;
              f[j].y += s;
            }
          }
        }
      }
    }
    return { landPaths: land, indiaPath: path(india) ?? '', pts: map, flags: new Map(f.map((x) => [x.id, x])) };
  }, [locations]);

  const owner = (l: PresenceLocation) => l.markerGroup ?? l.id;
  const selected = locations.find((l) => l.id === selectedId);
  const drawn = locations.filter((l) => !l.markerGroup);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0E4A75] dark:bg-[#0A2748]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="World map showing the Berry Alloys plants, offices, the Visakhapatnam Harbour Port and export countries"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="presence-sea" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#1B6AA3" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#06233F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#presence-sea)" />
        <g fill="rgba(222,238,250,0.30)" stroke="rgba(222,238,250,0.45)" strokeWidth="0.5">
          {landPaths.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </g>
        <path d={indiaPath} fill="rgba(255,255,255,0.95)" stroke="#FFFFFF" strokeWidth="0.8" />

        {routes.map((r, i) => {
          const a = pts.get(r.from);
          const b = pts.get(r.to);
          if (!a || !b) return null;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.22;
          const from = locations.find((l) => l.id === r.from);
          const to = locations.find((l) => l.id === r.to);
          const active = selected && ((from && owner(from) === owner(selected)) || (to && owner(to) === owner(selected)));
          return (
            <path
              key={r.id}
              d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
              fill="none"
              stroke={active ? '#FF5C73' : '#8FD8FF'}
              strokeOpacity={active ? 1 : 0.7}
              strokeWidth={active ? 2.4 : 1.2}
              strokeLinecap="round"
              strokeDasharray={ambient ? '5 8' : undefined}
              className={ambient ? 'presence-route-flow' : undefined}
              style={ambient ? { animationDelay: `${i * -0.7}s` } : undefined}
            />
          );
        })}

        {/* Flag stems */}
        {[...flags.values()].map((f) => (
          <line key={f.id} x1={f.sx} y1={f.sy} x2={f.x} y2={f.y + 10} stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" />
        ))}
      </svg>

      {/* Surface dots */}
      {drawn.map((m) => {
        const p = pts.get(m.id);
        if (!p) return null;
        const label = locations.find((l) => l.id === selectedId && owner(l) === m.id) ?? m;
        const isSel = selected ? owner(selected) === m.id : false;
        const isMarket = m.kind === 'export-market';
        const hot = isSel || (hoveredId ? owner(locations.find((l) => l.id === hoveredId) ?? m) === m.id : false);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(label.id)}
            onPointerEnter={() => onHover(m.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(m.id)}
            onBlur={() => onHover(null)}
            tabIndex={isMarket ? -1 : 0}
            aria-hidden={isMarket ? true : undefined}
            aria-label={`${label.name} — ${KIND_LABEL[label.kind]}${isSel ? ' (selected)' : ''}`}
            aria-pressed={isMarket ? undefined : isSel}
            className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline-none cursor-pointer"
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'block rounded-full border-2 transition-all duration-200',
                isMarket ? 'h-2 w-2' : m.kind === 'port' ? 'h-3 w-3' : 'h-2.5 w-2.5',
                isSel ? 'scale-150 border-white bg-accent-red' : hot ? 'scale-125 border-white bg-brand' : 'border-white bg-brand'
              )}
            />
          </button>
        );
      })}

      {/* Floating flags (the interactive target for each export country) */}
      {locations
        .filter((l) => l.kind === 'export-market')
        .map((m) => {
          const f = flags.get(m.id);
          if (!f) return null;
          const isSel = selectedId === m.id;
          const hot = isSel || hoveredId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              onPointerEnter={() => onHover(m.id)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(m.id)}
              onBlur={() => onHover(null)}
              aria-label={`${m.name} — ${KIND_LABEL[m.kind]}${isSel ? ' (selected)' : ''}`}
              aria-pressed={isSel}
              className="absolute z-20 flex h-8 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline-none cursor-pointer"
              style={{ left: `${(f.x / W) * 100}%`, top: `${(f.y / H) * 100}%` }}
            >
              <span
                className={cn(
                  'flag-float relative block h-[22px] w-[30px] overflow-hidden rounded-[3px] border-2 shadow-[0_4px_12px_rgba(7,17,31,0.55)] transition-all duration-200',
                  isSel ? 'scale-[1.35] border-[#FF8091]' : hot ? 'scale-125 border-white' : 'border-white/95'
                )}
              >
                <FlagIcon code={m.countryCode} className="absolute inset-0 !h-full !w-full !border-0" />
              </span>
              <span
                className={cn(
                  'pointer-events-none absolute left-1/2 top-full -mt-0.5 -translate-x-1/2 whitespace-nowrap rounded-[2px] bg-[#07111F]/95 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-md transition-opacity',
                  hot ? 'opacity-100' : 'opacity-0'
                )}
              >
                {m.name}
              </span>
            </button>
          );
        })}
    </div>
  );
}
