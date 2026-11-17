import { useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import worldTopo from 'world-atlas/countries-110m.json';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { PresenceLocation, PresenceRoute } from '../../data/globalPresence';
import { KIND_LABEL } from '../../data/globalPresence';
import { cn } from '../../lib/utils';

/**
 * Capability fallback for the globe: an India-focused SVG map with the same locations, routes and
 * selection behaviour. Used when WebGL is unavailable or the 3D scene fails — never a blank container.
 */

const W = 600;
const H = 540;

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
  const { landPaths, indiaPath, pts } = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [28, 28],
        [W - 28, H - 28],
      ],
      india
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
    return { landPaths: land, indiaPath: path(india) ?? '', pts: map };
  }, [locations]);

  const owner = (l: PresenceLocation) => l.markerGroup ?? l.id;
  const selected = locations.find((l) => l.id === selectedId);
  const drawn = locations.filter((l) => !l.markerGroup);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0E4A75] dark:bg-[#0A2748]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Map of India showing the Berry Alloys plants, offices and the Visakhapatnam Harbour Port"
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
        <g fill="rgba(222,238,250,0.20)" stroke="rgba(222,238,250,0.35)" strokeWidth="0.6">
          {landPaths.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </g>
        <path d={indiaPath} fill="rgba(240,248,255,0.92)" stroke="#FFFFFF" strokeWidth="1.2" />

        <g fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="2" fill="rgba(222,238,250,0.55)">
          <text x={W * 0.3} y={H * 0.78}>ARABIAN SEA</text>
          <text x={W * 0.62} y={H * 0.74}>BAY OF BENGAL</text>
        </g>

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
              strokeWidth={active ? 2.4 : 1.7}
              strokeLinecap="round"
              strokeDasharray={ambient ? '5 8' : undefined}
              className={ambient ? 'presence-route-flow' : undefined}
              style={ambient ? { animationDelay: `${i * -0.7}s` } : undefined}
            />
          );
        })}
      </svg>

      {drawn.map((m) => {
        const p = pts.get(m.id);
        if (!p) return null;
        const label = locations.find((l) => l.id === selectedId && owner(l) === m.id) ?? m;
        const isSel = selected ? owner(selected) === m.id : false;
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
            aria-label={`${label.name} — ${KIND_LABEL[label.kind]}${isSel ? ' (selected)' : ''}`}
            aria-pressed={isSel}
            className="absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus-visible:outline-none cursor-pointer"
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'block rounded-full border-2 transition-all duration-200',
                m.kind === 'port' ? 'h-3.5 w-3.5' : 'h-3 w-3',
                isSel ? 'scale-150 border-white bg-accent-red' : hot ? 'scale-125 border-white bg-brand' : 'border-white bg-brand'
              )}
            />
            <span
              className={cn(
                'pointer-events-none absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap border border-subtle bg-card px-2 py-1 text-[11px] font-semibold text-ink shadow-md transition-opacity',
                hot ? 'opacity-100' : 'opacity-0'
              )}
            >
              {label.name.split(' / ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
