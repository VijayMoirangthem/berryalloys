import { useEffect, useRef, useState } from 'react';
import { useInViewActive, useMotion } from '../context/MotionContext';
import { AmbientMotionToggle } from './AmbientMotionToggle';
import { cn } from '../lib/utils';

/**
 * SmeltingRefiningJourney — Sister schematic to LogisticsJourney illustrating
 * Berry Alloys' metallurgical transformation route:
 * Raw Ore Batching → Submerged-Arc Electric Furnace → Overhead Molten Ladle Crane
 * → 6,000 MT/mo AOD Decarburisation Converter → OES Spectrometry & Crushed Sizing.
 *
 * Uses native SVG SMIL + GPU-composited CSS animations that run reliably on iPhone
 * Chrome/Safari, pause automatically when offscreen or paused by the visitor, and
 * settle to clear static positions under prefers-reduced-motion.
 */

const ORE_CONVEYOR_PATH = 'M 118 228 L 266 156';
const CRANE_RAIL_PATH = 'M 382 88 L 626 88';
const DISPATCH_CHUTE_PATH = 'M 754 244 L 882 244';
const CYCLE = 12;

const STAGES = [
  {
    n: 1,
    title: 'Ore & flux batching',
    text: 'Weighed manganese, chrome, quartz, and coke charged by belt.',
  },
  {
    n: 2,
    title: 'Submerged-arc smelting',
    text: 'Three-electrode reduction at high heat in SAF shells.',
  },
  {
    n: 3,
    title: 'Molten ladle transfer',
    text: 'Overhead gantry crane delivers hot metal to refining bay.',
  },
  {
    n: 4,
    title: 'AOD decarburisation',
    text: '6,000 MT/mo converter lowers carbon down to 0.5% max.',
  },
  {
    n: 5,
    title: 'OES assay & sizing',
    text: 'Spectrometric heat certification & 10–50 mm crushing.',
  },
];

const DISC_X = [94, 304, 504, 666, 882];
const DISC_Y = [118, 108, 128, 114, 128];

function OverheadLadle() {
  return (
    <g transform="translate(-26 -14)">
      {/* Trolley wheels on overhead rail */}
      <rect x="6" y="0" width="40" height="8" className="fill-ink" />
      <circle cx="13" cy="9" r="3" className="fill-brand" />
      <circle cx="39" cy="9" r="3" className="fill-brand" />
      {/* Hoist cables */}
      <line x1="16" y1="8" x2="16" y2="54" className="stroke-ink" strokeWidth="1.6" />
      <line x1="36" y1="8" x2="36" y2="54" className="stroke-ink" strokeWidth="1.6" />
      {/* Molten ladle bucket */}
      <path d="M10 54 h32 l-4 28 h-24 z" className="fill-ink" />
      <rect x="13" y="51" width="26" height="5" className="fill-accent-red diagram-molten-pulse" />
      <rect x="15" y="64" width="22" height="3" className="fill-brand" />
    </g>
  );
}

export function SmeltingRefiningJourney() {
  const { ambientActive, reducedMotion } = useMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const active = useInViewActive(wrapRef, '80px');
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
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
            Schematic metallurgical process
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-ink">
            From raw ore charge to certified alloy
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedStage !== null && (
            <button
              type="button"
              onClick={() => setSelectedStage(null)}
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
          aria-label="Schematic metallurgical flow showing ore batching, submerged-arc electric furnace smelting, overhead molten ladle transfer, AOD decarburisation converter, and optical emission spectrometry verification."
          className="block h-auto w-full"
        >
          <defs>
            <pattern id="smelt-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                className="stroke-subtle"
                strokeOpacity="0.48"
                strokeWidth="0.8"
              />
            </pattern>
            <radialGradient id="molten-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C9233B" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#C9233B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Architectural bay background */}
          <rect width="1000" height="340" className="fill-card" />
          <rect width="1000" height="340" fill="url(#smelt-grid)" />

          {/* Shopfloor datum slab */}
          <rect x="0" y="276" width="1000" height="64" className="fill-band" />
          <line x1="0" y1="276" x2="1000" y2="276" className="stroke-subtle" strokeWidth="1.5" />

          {/* Overhead Steel Gantry Girder spanning SAF → AOD */}
          <g>
            <rect x="348" y="68" width="308" height="10" className="fill-ink" />
            <rect x="348" y="78" width="308" height="4" className="fill-brand" />
            <rect x="352" y="78" width="7" height="198" className="fill-subtle" />
            <rect x="646" y="78" width="7" height="198" className="fill-subtle" />
          </g>

          {/* Stage 1: Raw Ore Silos & Inclined Conveyor */}
          <g transform="translate(34 176)">
            <path d="M0 0 h36 v52 l-12 20 h-12 l-12 -20 z" className="fill-ink" />
            <rect x="4" y="8" width="28" height="4" className="fill-brand" />
            <path d="M44 10 h36 v42 l-12 20 h-12 l-12 -20 z" className="fill-ink" opacity="0.88" />
            <rect x="48" y="18" width="28" height="4" className="fill-brand" />
            <rect x="14" y="72" width="8" height="28" className="fill-subtle" />
            <rect x="58" y="72" width="8" height="28" className="fill-subtle" />
          </g>

          {/* Inclined Conveyor Belt */}
          <path d={ORE_CONVEYOR_PATH} fill="none" className="stroke-ink" strokeWidth="8" strokeLinecap="round" />
          <path
            d={ORE_CONVEYOR_PATH}
            fill="none"
            className={cn('stroke-brand', running && 'diagram-flow-dash')}
            strokeWidth="2.5"
            strokeDasharray="6 8"
          />

          {/* Animated Ore Charge Pellets riding conveyor into SAF */}
          {animated ? (
            [0, 1.5, 3].map((beginSec) => (
              <circle key={beginSec} r="4.5" className="fill-accent-red">
                <animateMotion
                  dur="4.5s"
                  begin={`${beginSec}s`}
                  repeatCount="indefinite"
                  path={ORE_CONVEYOR_PATH}
                />
              </circle>
            ))
          ) : (
            <circle cx="192" cy="192" r="4.5" className="fill-accent-red" />
          )}

          {/* Stage 2: Submerged-Arc Electric Furnace (SAF) */}
          <g transform="translate(248 156)">
            {/* Ambient molten thermal halo */}
            <circle cx="60" cy="84" r="44" fill="url(#molten-glow)" className={running ? 'diagram-molten-pulse' : ''} />
            {/* Three vertical carbon electrodes */}
            {[28, 56, 84].map((ex) => (
              <g key={ex}>
                <rect x={ex} y="-14" width="8" height="62" className="fill-ink" />
                <rect x={ex} y="44" width="8" height="8" className="fill-accent-red" />
              </g>
            ))}
            {/* Furnace steel shell */}
            <path d="M8 38 h104 v64 c0 12 -14 18 -52 18 s-52 -6 -52 -18 z" className="fill-ink" />
            {/* Molten alloy bath window */}
            <rect x="20" y="62" width="80" height="26" className="fill-accent-red diagram-molten-pulse" />
            <rect x="20" y="54" width="80" height="6" className="fill-brand" />
            {/* Tap spout */}
            <path d="M112 94 h16 v8 h-16 z" className="fill-accent-red" />
          </g>

          {/* Stage 3: Overhead Gantry Molten Ladle Transfer */}
          {animated ? (
            <g>
              <OverheadLadle />
              <animateMotion
                dur={`${CYCLE}s`}
                repeatCount="indefinite"
                path={CRANE_RAIL_PATH}
                keyPoints="0;1;1;0"
                keyTimes="0;0.48;0.62;1"
                calcMode="linear"
              />
            </g>
          ) : (
            <g transform="translate(504 88)">
              <OverheadLadle />
            </g>
          )}

          {/* Stage 4: 6,000 MT/mo AOD Decarburisation Converter */}
          <g transform="translate(612 162)">
            <circle cx="56" cy="48" r="42" fill="url(#molten-glow)" className={running ? 'diagram-molten-pulse' : ''} />
            {/* Exhaust hood */}
            <path d="M24 -12 h64 l-10 26 h-44 z" className="fill-brand" opacity="0.22" />
            {/* Converter trunnion stands */}
            <rect x="10" y="56" width="10" height="58" className="fill-ink" />
            <rect x="92" y="56" width="10" height="58" className="fill-ink" />
            {/* Converter pear-shaped shell */}
            <path d="M36 18 h40 l14 34 v42 c0 12 -16 20 -34 20 s-34 -8 -34 -20 v-42 z" className="fill-ink" />
            {/* Glowing bath core + Ar/O2 gas injection tuyeres */}
            <rect x="34" y="56" width="44" height="22" className="fill-accent-red diagram-molten-pulse" />
            <rect x="28" y="46" width="56" height="5" className="fill-brand" />
            {/* Rising argon-oxygen decarburisation plume dots */}
            {animated &&
              [46, 56, 66].map((gx, idx) => (
                <circle key={gx} cx={gx} cy="16" r="3" className="fill-brand">
                  <animate
                    attributeName="cy"
                    values="22;-8"
                    dur="2.1s"
                    begin={`${idx * 0.65}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0"
                    dur="2.1s"
                    begin={`${idx * 0.65}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
          </g>

          {/* Crushing & Sizing Output Chute */}
          <path d={DISPATCH_CHUTE_PATH} fill="none" className="stroke-subtle" strokeWidth="12" strokeLinecap="round" />
          <path
            d={DISPATCH_CHUTE_PATH}
            fill="none"
            className={cn('stroke-brand', running && 'diagram-flow-dash')}
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Stage 5: OES Spectrometry Assay & Certified Sizing Station */}
          <g transform="translate(838 178)">
            <rect x="0" y="18" width="90" height="80" className="fill-card stroke-ink" strokeWidth="2" />
            <rect x="0" y="18" width="90" height="14" className="fill-brand" />
            {/* OES Spark Chamber Window */}
            <rect x="12" y="42" width="38" height="26" className="fill-ink" />
            <circle
              cx="31"
              cy="55"
              r="6"
              className={cn('fill-accent-red', running && 'diagram-molten-pulse')}
            />
            {/* Verification checkmark badge */}
            <path
              d="M60 56 l6 6 l14 -15"
              fill="none"
              className="stroke-success"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Certified batch lines */}
            <rect x="12" y="76" width="66" height="4" className="fill-subtle" />
            <rect x="12" y="84" width="44" height="4" className="fill-brand" />
          </g>

          {/* Interactive Stage Discs 1–5 */}
          {DISC_X.map((x, i) => {
            const stageNum = i + 1;
            const isSelected = selectedStage === stageNum;
            return (
              <g
                key={x}
                transform={`translate(${x} ${DISC_Y[i]})`}
                onClick={() => setSelectedStage((prev) => (prev === stageNum ? null : stageNum))}
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
                {!isSelected && selectedStage === null && (
                  <circle
                    r="15"
                    className="lj-disc fill-brand"
                    style={{ animationDelay: `${(i * CYCLE) / 5}s` }}
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
                  {stageNum}
                </text>
              </g>
            );
          })}

          <text x="24" y="316" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            RAW CHARGE
          </text>
          <text x="444" y="316" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            SMELTING &amp; AOD REFINING
          </text>
          <text x="844" y="316" fontSize="11" letterSpacing="2" className="fill-ink-muted" fontFamily="IBM Plex Mono, monospace">
            CERTIFIED LOT
          </text>
        </svg>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STAGES.map((s) => {
          const isSelected = selectedStage === s.n;
          return (
            <li key={s.n}>
              <button
                type="button"
                onClick={() => setSelectedStage((prev) => (prev === s.n ? null : s.n))}
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
                  {s.n}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight text-ink">{s.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-2">{s.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="text-[11px] text-ink-muted">
        Schematic representation of submerged-arc smelting and AOD decarburisation routes documented across Berry Alloys facilities.
        Tap any numbered stage to highlight it on the diagram.
      </p>
    </div>
  );
}
