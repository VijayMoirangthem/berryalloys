import { useEffect, useRef } from 'react';
import { useInViewActive, useMotion } from '../context/MotionContext';
import { AmbientMotionToggle } from './AmbientMotionToggle';

/**
 * LogisticsJourney — a schematic manufacturing-to-delivery illustration:
 * plant → quality & dispatch → road → port → sea freight.
 *
 * It is a diagram, not tracking: the road/sea routes are illustrative and no shipping lane is asserted.
 * The truck follows the land route only and the ship follows the sea route only (separate paths, so a
 * vehicle can never leave its medium). Motion is native SVG (SMIL animateMotion with rotate="auto"), paused
 * when offscreen, in a hidden tab, or when the visitor pauses ambient motion. Under reduced motion the
 * vehicles are drawn at fixed, meaningful positions. Labels live in HTML below so they stay readable.
 */

const LAND_ROUTE = 'M 112 252 C 215 252, 262 206, 372 218 S 560 268, 662 238';
const SEA_ROUTE = 'M 700 268 C 770 268, 812 246, 866 236 S 960 212, 1040 200';
const CYCLE = 14; // seconds

const STEPS = [
  { n: 1, title: 'Plant & smelting', text: 'Submerged-arc smelting at Bobbili and Dhalbhumgarh.' },
  { n: 2, title: 'Quality & dispatch', text: 'Batch assay verification before material is released.' },
  { n: 3, title: 'Road to port', text: 'Bulk material moves by road to the coast.' },
  { n: 4, title: 'Visakhapatnam Harbour Port', text: 'Deep-water gateway for export dispatch.' },
  { n: 5, title: 'Sea freight', text: 'Loaded onto vessels for onward delivery.' },
];

const DISC_X = [92, 262, 440, 676, 862];
const DISC_Y = [150, 126, 168, 126, 158];

function Truck() {
  // Industrial rigid truck with a container, drawn facing +x (right).
  return (
    <g transform="translate(-30 -26)">
      <rect x="0" y="6" width="38" height="22" className="fill-ink" />
      <rect x="2" y="9" width="34" height="3" className="fill-brand" />
      <rect x="6" y="14" width="8" height="2" className="fill-card" opacity="0.75" />
      <path d="M40 14 h14 l6 8 v8 h-20 z" className="fill-brand" />
      <path d="M46 17 h7 l3 5 h-10 z" className="fill-card" opacity="0.9" />
      <rect x="0" y="28" width="60" height="4" className="fill-ink" />
      {[10, 28, 48].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="34" r="5" className="fill-ink" />
          <circle cx={cx} cy="34" r="1.8" className="fill-card" />
        </g>
      ))}
    </g>
  );
}

function Ship() {
  // Bulk/container vessel, drawn facing +x (right).
  return (
    <g transform="translate(-48 -34)">
      <path d="M0 26 h96 l-10 14 h-76 z" className="fill-ink" />
      <rect x="4" y="30" width="86" height="2" className="fill-accent-red" />
      <rect x="64" y="8" width="16" height="18" className="fill-card stroke-ink" strokeWidth="1.5" />
      <rect x="68" y="12" width="8" height="4" className="fill-brand" />
      <rect x="70" y="0" width="4" height="8" className="fill-ink" />
      {[10, 24, 38, 52].map((x, i) => (
        <g key={x}>
          <rect x={x} y="12" width="12" height="14" className={i === 1 ? 'fill-accent-red' : 'fill-brand'} />
          <rect x={x + 2} y="4" width="10" height="8" className={i === 2 ? 'fill-brand' : 'fill-ink'} opacity="0.9" />
        </g>
      ))}
    </g>
  );
}

export function LogisticsJourney() {
  const { ambientActive, reducedMotion } = useMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const active = useInViewActive(wrapRef, '80px');
  const animated = !reducedMotion;
  const running = animated && ambientActive && active;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== 'function') return;
    if (running) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [running, animated]);

  return (
    <div ref={wrapRef} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand">Schematic logistics journey</p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-ink">
            From furnace floor to vessel
          </h3>
        </div>
        <AmbientMotionToggle />
      </div>

      <div className="overflow-hidden border border-subtle bg-card">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 340"
          role="img"
          aria-label="Schematic illustration of the journey from plant, through quality check and dispatch, by road to the port, then by ship. Illustrative only; not live tracking."
          className="block h-auto w-full"
        >
          <defs>
            <pattern id="lj-waves" width="46" height="18" patternUnits="userSpaceOnUse">
              <path d="M0 9 Q11 4 23 9 T46 9" fill="none" className="stroke-brand" strokeOpacity="0.28" strokeWidth="1.2" />
            </pattern>
          </defs>

          {/* Land and sea (distinct media, distinct paths) */}
          <rect width="1000" height="340" className="fill-band" />
          <path d="M0 0 H690 C700 70 660 110 690 160 C720 215 676 262 700 340 H0 Z" className="fill-card" />
          <path d="M690 0 H1000 V340 H700 C676 262 720 215 690 160 C660 110 700 70 690 0 Z" className="fill-brand-soft" />
          <path d="M690 0 H1000 V340 H700 C676 262 720 215 690 160 C660 110 700 70 690 0 Z" fill="url(#lj-waves)" />

          {/* Road */}
          <path d={LAND_ROUTE} fill="none" className="stroke-subtle" strokeWidth="16" strokeLinecap="round" />
          <path d={LAND_ROUTE} fill="none" className="stroke-control" strokeWidth="1.5" strokeDasharray="9 9" />
          {/* Sea lane (illustrative) */}
          <path d={SEA_ROUTE} fill="none" className="stroke-brand" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="3 8" strokeLinecap="round" />

          {/* Plant */}
          <g transform="translate(26 206)">
            <rect x="0" y="22" width="78" height="30" className="fill-ink" />
            <path d="M0 22 l13 -12 v12 l13 -12 v12 l13 -12 v12 l13 -12 v12 z" className="fill-ink" />
            <rect x="58" y="-8" width="9" height="32" className="fill-ink" />
            <rect x="58" y="-8" width="9" height="4" className="fill-accent-red" />
            <rect x="10" y="34" width="10" height="18" className="fill-brand" />
            <rect x="30" y="34" width="10" height="10" className="fill-card" opacity="0.8" />
          </g>

          {/* Quality & dispatch gate */}
          <g transform="translate(236 168)">
            <rect x="0" y="0" width="5" height="46" className="fill-ink" />
            <rect x="50" y="0" width="5" height="46" className="fill-ink" />
            <rect x="0" y="0" width="55" height="8" className="fill-brand" />
            <path d="M16 26 l8 8 l16 -18" fill="none" className="stroke-success" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Port quay + gantry crane */}
          <g transform="translate(626 160)">
            <rect x="0" y="78" width="78" height="10" className="fill-ink" />
            <rect x="8" y="14" width="5" height="64" className="fill-ink" />
            <rect x="52" y="14" width="5" height="64" className="fill-ink" />
            <rect x="0" y="8" width="96" height="7" className="fill-brand" />
            <path d="M80 8 v28" className="stroke-ink" strokeWidth="1.5" />
            <rect x="74" y="36" width="14" height="9" className="fill-accent-red" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={14 + i * 14} y="64" width="12" height="14" className={i === 1 ? 'fill-accent-red' : 'fill-brand'} />
            ))}
          </g>

          {/* Stage discs, highlighted in turn while the scene runs */}
          {DISC_X.map((x, i) => (
            <g key={x} transform={`translate(${x} ${DISC_Y[i]})`}>
              <circle r="15" className="fill-card stroke-brand" strokeWidth="2" />
              <circle r="15" className="lj-disc fill-brand" style={{ animationDelay: `${(i * CYCLE) / 5}s` }} />
              <text textAnchor="middle" dy="4.5" fontSize="13" fontWeight="700" className="fill-ink" fontFamily="IBM Plex Mono, monospace">
                {i + 1}
              </text>
            </g>
          ))}

          {/* Vehicles */}
          {animated ? (
            <>
              <g>
                <Truck />
                <animateMotion
                  dur={`${CYCLE}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  path={LAND_ROUTE}
                  keyPoints="0;1;1"
                  keyTimes="0;0.5;1"
                  calcMode="linear"
                />
                <animate attributeName="opacity" dur={`${CYCLE}s`} repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.04;0.5;0.56;1" />
              </g>
              <g>
                <Ship />
                <animateMotion
                  dur={`${CYCLE}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  path={SEA_ROUTE}
                  keyPoints="0;0;1"
                  keyTimes="0;0.52;1"
                  calcMode="linear"
                />
                <animate attributeName="opacity" dur={`${CYCLE}s`} repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.5;0.56;0.92;1" />
              </g>
            </>
          ) : (
            <>
              <g transform="translate(372 218)">
                <Truck />
              </g>
              <g transform="translate(790 252)">
                <Ship />
              </g>
            </>
          )}

          <text x="22" y="324" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            LAND
          </text>
          <text x="934" y="324" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            SEA
          </text>
        </svg>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s) => (
          <li key={s.n} className="flex gap-3 border border-subtle bg-card p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand font-mono-tabular text-xs font-bold text-on-brand">
              {s.n}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-tight text-ink">{s.title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-ink-2">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-ink-muted">
        Schematic illustration of a typical manufacturing-to-delivery journey. Routes are illustrative, not exact shipping
        lanes, and the vehicles do not represent live tracking.
      </p>
    </div>
  );
}
