import { useEffect, useRef, useState } from 'react';
import { useInViewActive, useMotion } from '../context/MotionContext';
import { AmbientMotionToggle } from './AmbientMotionToggle';
import { cn } from '../lib/utils';

/**
 * CleanEnergyJourney — Architectural animated SVG schematic illustrating Berry Alloys'
 * disclosed clean-power mix and circular heat recovery plan:
 * 83 MW Solar PV + 29.6 MW Wind Turbines (reported operational) → Plant Smelting Substation
 * ↔ Planned 90 MW Waste Heat Recovery & DRI Flue-Gas Loop (Ghatsila).
 */

const SOLAR_BUS_PATH = 'M 206 206 H 432';
const WIND_BUS_PATH = 'M 332 232 H 432';
const WHR_HEAT_PATH = 'M 594 176 H 776';
const WHR_RETURN_PATH = 'M 776 238 H 594';
const CYCLE = 12;

const NODES = [
  {
    n: 1,
    tag: 'Operational',
    title: '83 MW solar PV generation',
    text: 'Utility & rooftop photovoltaic arrays feeding plant load.',
  },
  {
    n: 2,
    tag: 'Operational',
    title: '29.6 MW wind power assets',
    text: 'Hybrid wind capacity complementing daytime solar supply.',
  },
  {
    n: 3,
    tag: 'Active Load',
    title: 'Smelting substation & grid',
    text: 'High-voltage bus balancing continuous SAF transformer demand.',
  },
  {
    n: 4,
    tag: 'Planned · Ghatsila',
    title: '90 MW waste heat recovery',
    text: 'Planned DRI off-gas boiler & steam turbine return loop.',
  },
];

const DISC_X = [120, 294, 514, 834];
const DISC_Y = [98, 98, 98, 98];

function WindTurbine({ cx, baseY, scale = 1, animated }: { cx: number; baseY: number; scale?: number; animated: boolean }) {
  const hubY = baseY - 82 * scale;
  return (
    <g>
      <line x1={cx} y1={baseY} x2={cx} y2={hubY} className="stroke-ink" strokeWidth={3.5 * scale} />
      <g transform={`translate(${cx} ${hubY})`}>
        <g>
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d={`M 0 0 L ${-3 * scale} ${-34 * scale} L ${2.5 * scale} ${-34 * scale} Z`}
              className="fill-brand"
              transform={`rotate(${deg})`}
            />
          ))}
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur={scale > 0.9 ? '4.8s' : '3.8s'}
              repeatCount="indefinite"
            />
          )}
        </g>
        <circle r={4 * scale} className="fill-ink" />
      </g>
    </g>
  );
}

export function CleanEnergyJourney() {
  const { ambientActive, reducedMotion } = useMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const active = useInViewActive(wrapRef, '80px');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
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
          <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand">
            Schematic energy &amp; heat-recovery loop
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-ink">
            Solar, wind &amp; planned waste-heat loop
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedNode !== null && (
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand hover:underline cursor-pointer"
            >
              Reset Focus
            </button>
          )}
          <AmbientMotionToggle />
        </div>
      </div>

      <div className="overflow-hidden border border-subtle bg-card">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 340"
          role="img"
          aria-label="Schematic energy loop illustrating reported operational solar and wind renewable assets supplying the smelting substation alongside planned Ghatsila waste heat recovery."
          className="block h-auto w-full"
        >
          {/* Split Backdrop: Renewables Zone (left) vs Thermal Recovery Zone (right) */}
          <rect width="1000" height="340" className="fill-card" />
          <rect x="0" y="0" width="420" height="278" className="fill-brand-soft" opacity="0.45" />
          <rect x="650" y="0" width="350" height="278" className="fill-band" opacity="0.65" />
          <rect x="0" y="278" width="1000" height="62" className="fill-band" />
          <line x1="0" y1="278" x2="1000" y2="278" className="stroke-subtle" strokeWidth="1.5" />

          {/* Dashed division lines */}
          <line x1="420" y1="16" x2="420" y2="278" className="stroke-subtle" strokeDasharray="4 6" />
          <line x1="650" y1="16" x2="650" y2="278" className="stroke-subtle" strokeDasharray="4 6" />

          {/* Power Transmission & Thermal Recovery Bus Lines */}
          <path d={SOLAR_BUS_PATH} fill="none" className="stroke-subtle" strokeWidth="10" strokeLinecap="round" />
          <path
            d={SOLAR_BUS_PATH}
            fill="none"
            className={cn('stroke-brand', running && 'diagram-flow-dash')}
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          <path d={WIND_BUS_PATH} fill="none" className="stroke-subtle" strokeWidth="10" strokeLinecap="round" />
          <path
            d={WIND_BUS_PATH}
            fill="none"
            className={cn('stroke-brand', running && 'diagram-flow-dash')}
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          {/* Thermal Flue-Gas Duct (Substation/Furnace → WHR Boiler) */}
          <path d={WHR_HEAT_PATH} fill="none" className="stroke-subtle" strokeWidth="12" strokeLinecap="round" />
          <path
            d={WHR_HEAT_PATH}
            fill="none"
            className={cn('stroke-accent-red', running && 'diagram-flow-dash')}
            strokeWidth="2.4"
            strokeDasharray="8 8"
          />

          {/* Recovered Clean Steam-Turbine Power Return Bus (WHR → Plant Substation) */}
          <path d={WHR_RETURN_PATH} fill="none" className="stroke-subtle" strokeWidth="10" strokeLinecap="round" />
          <path
            d={WHR_RETURN_PATH}
            fill="none"
            className={cn('stroke-success', running && 'diagram-flow-dash')}
            strokeWidth="2"
            strokeDasharray="8 8"
          />

          {/* Animated Electron & Thermal Flow Pulses */}
          {animated && (
            <>
              <circle r="4.5" className="fill-brand">
                <animateMotion dur="2.8s" repeatCount="indefinite" path={SOLAR_BUS_PATH} />
              </circle>
              <circle r="4.5" className="fill-brand">
                <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path={WIND_BUS_PATH} />
              </circle>
              <circle r="5" className="fill-accent-red">
                <animateMotion dur="3.1s" repeatCount="indefinite" path={WHR_HEAT_PATH} />
              </circle>
              <circle r="4.5" className="fill-success">
                <animateMotion dur="3.1s" begin="1.4s" repeatCount="indefinite" path={WHR_RETURN_PATH} />
              </circle>
            </>
          )}

          {/* Stage 1: Solar PV Array */}
          <g transform="translate(48 168)">
            {/* Subtle Sun Beacon */}
            <circle cx="18" cy="-16" r="10" className="fill-brand" opacity="0.24" />
            <circle cx="18" cy="-16" r="5" className="fill-brand" />
            {/* Three Tilted Photovoltaic Tables */}
            {[0, 52, 104].map((x) => (
              <g key={x} transform={`translate(${x} 24)`}>
                <polygon points="8,0 50,0 40,36 -2,36" className="fill-ink" />
                <polygon points="10,3 47,3 39,33 1,33" className="fill-brand" opacity="0.82" />
                <line x1="25" y1="3" x2="19" y2="33" className="stroke-card" strokeOpacity="0.65" strokeWidth="1" />
                <line x1="6" y1="18" x2="43" y2="18" className="stroke-card" strokeOpacity="0.65" strokeWidth="1" />
                <rect x="20" y="36" width="5" height="22" className="fill-ink" />
              </g>
            ))}
          </g>

          {/* Stage 2: Twin Wind Turbines */}
          <WindTurbine cx={268} baseY={276} scale={1.08} animated={animated} />
          <WindTurbine cx={332} baseY={276} scale={0.86} animated={animated} />

          {/* Stage 3: Plant Substation & Smelting Load */}
          <g transform="translate(432 146)">
            <rect x="0" y="28" width="162" height="104" className="fill-ink" />
            <rect x="0" y="28" width="162" height="10" className="fill-brand" />
            {/* High-voltage insulator pylons */}
            {[28, 81, 134].map((px) => (
              <g key={px}>
                <rect x={px - 3} y="6" width="6" height="22" className="fill-ink" />
                <rect x={px - 8} y="12" width="16" height="3" className="fill-brand" />
              </g>
            ))}
            {/* Active load indicator bays */}
            {[22, 64, 106].map((bx, idx) => (
              <rect
                key={bx}
                x={bx}
                y="56"
                width="32"
                height="48"
                className={idx === 1 ? 'fill-accent-red diagram-molten-pulse' : 'fill-card'}
                opacity={idx === 1 ? 0.92 : 0.16}
              />
            ))}
            <text
              x="81"
              y="120"
              textAnchor="middle"
              fontSize="10"
              letterSpacing="1.4"
              className="fill-card"
              fontFamily="IBM Plex Mono, monospace"
            >
              SAF SUBSTATION
            </text>
          </g>

          {/* Stage 4: Planned 90 MW Waste Heat Recovery Boiler & Turbine */}
          <g transform="translate(776 154)">
            <rect x="0" y="14" width="144" height="110" className="fill-card stroke-ink" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="0" y="14" width="144" height="12" className="fill-accent-red" opacity="0.88" />
            {/* Heat Exchanger Serpentine Coil */}
            <path
              d="M24 44 h44 v12 h-44 v12 h44 v12 h-44"
              fill="none"
              className={cn('stroke-accent-red', running && 'diagram-molten-pulse')}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Steam Turbine Rotor Wheel */}
            <g transform="translate(106 64)">
              <circle r="20" className="fill-brand-soft stroke-brand" strokeWidth="2" />
              <g>
                <line x1="-14" y1="0" x2="14" y2="0" className="stroke-brand" strokeWidth="2.4" />
                <line x1="0" y1="-14" x2="0" y2="14" className="stroke-brand" strokeWidth="2.4" />
                {animated && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="2.8s"
                    repeatCount="indefinite"
                  />
                )}
              </g>
              <circle r="4" className="fill-ink" />
            </g>
            <text
              x="72"
              y="108"
              textAnchor="middle"
              fontSize="9.5"
              letterSpacing="1.1"
              className="fill-ink-muted"
              fontFamily="IBM Plex Mono, monospace"
            >
              PLANNED 90 MW WHR
            </text>
          </g>

          {/* Interactive Stage Discs 1–4 */}
          {DISC_X.map((x, i) => {
            const nodeNum = i + 1;
            const isSelected = selectedNode === nodeNum;
            return (
              <g
                key={x}
                transform={`translate(${x} ${DISC_Y[i]})`}
                onClick={() => setSelectedNode((prev) => (prev === nodeNum ? null : nodeNum))}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle
                    r="21"
                    fill="none"
                    className={cn('stroke-accent-red', running && 'diagram-ring-ping')}
                    strokeWidth="2.5"
                  />
                )}
                <circle
                  r="15"
                  className={cn(
                    'transition-colors',
                    isSelected ? 'fill-accent-red stroke-accent-red' : 'fill-card stroke-brand'
                  )}
                  strokeWidth="2"
                />
                {!isSelected && selectedNode === null && (
                  <circle
                    r="15"
                    className="lj-disc fill-brand"
                    style={{ animationDelay: `${(i * CYCLE) / 4}s` }}
                  />
                )}
                <text
                  textAnchor="middle"
                  dy="4.5"
                  fontSize="13"
                  fontWeight="700"
                  className={isSelected ? 'fill-on-accent' : 'fill-ink'}
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {nodeNum}
                </text>
              </g>
            );
          })}

          <text x="24" y="316" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            REPORTED RENEWABLES
          </text>
          <text x="454" y="316" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            SMELTING LOAD
          </text>
          <text x="724" y="316" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            PLANNED RECOVERY LOOP
          </text>
        </svg>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {NODES.map((n) => {
          const isSelected = selectedNode === n.n;
          return (
            <li key={n.n}>
              <button
                type="button"
                onClick={() => setSelectedNode((prev) => (prev === n.n ? null : n.n))}
                aria-pressed={isSelected}
                className={cn(
                  'w-full h-full text-left flex gap-3 border p-3 transition-colors cursor-pointer',
                  isSelected
                    ? 'border-accent-red bg-accent-red-soft/60 dark:bg-elevated'
                    : 'border-subtle bg-card hover:border-brand'
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center font-mono-tabular text-xs font-bold transition-colors',
                    isSelected ? 'bg-accent-red text-on-accent' : 'bg-brand text-on-brand'
                  )}
                >
                  {n.n}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-mono-tabular uppercase tracking-wider text-brand">
                    {n.tag}
                  </span>
                  <span className="block text-sm font-semibold leading-tight text-ink mt-0.5">{n.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-2">{n.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="text-[11px] text-ink-muted">
        Schematic energy overview separating published operational solar/wind disclosures from planned Ghatsila 90 MW waste-heat
        recovery infrastructure (dashed outline). Tap any stage to highlight it on the diagram.
      </p>
    </div>
  );
}
