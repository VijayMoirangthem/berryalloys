import { useState } from 'react';
import { Anchor, Factory, MapPin, Ship, TrainFront, Truck } from 'lucide-react';
import { FACILITY_NODES, FacilityNode } from '../data/company';

const CORRIDOR_METRICS = [
  { label: 'Rated Capacity', value: '4,11,000 TPA', sub: 'Multi-unit smelting' },
  { label: 'AOD Refining', value: '6,000 MT/mo', sub: 'Low & ultra-low carbon' },
  { label: 'Port Distance', value: '~110 km', sub: 'Bobbili → Visakhapatnam' },
  { label: 'Export Footprint', value: '~35 Nations', sub: 'Bay of Bengal lanes' },
] as const;

const CORRIDOR_FLOW_STEPS = [
  {
    id: 'smelt',
    icon: Factory,
    stage: '01 · Smelting',
    text: 'Bobbili & Dhalbhumgarh submerged-arc furnaces tap & crush alloy heats',
  },
  {
    id: 'haul',
    icon: Truck,
    stage: '02 · Tipper & Rail',
    text: '35-MT tipper convoys & rail rakes move certified FIBC lots to coast',
  },
  {
    id: 'port',
    icon: Anchor,
    stage: '03 · Harbour Berth',
    text: 'Visakhapatnam deep-water terminal stages bulk consignments',
  },
  {
    id: 'ship',
    icon: Ship,
    stage: '04 · Bulk Vessel',
    text: 'Ocean carriers sail across Bay of Bengal to ~35 export markets',
  },
] as const;

export function FacilityCorridorMap() {
  const [selectedId, setSelectedId] = useState<string>(FACILITY_NODES[0].id);

  const activeNode: FacilityNode =
    FACILITY_NODES.find((n) => n.id === selectedId) ?? FACILITY_NODES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Live Animated Multi-Modal Cartographic Corridor Map */}
      <div className="lg:col-span-7 bg-card text-ink border border-subtle p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-subtle">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight">
              Eastern &amp; Coastal Operations Corridor
            </h3>
            <p className="text-xs text-ink-2">
              Live visual flow of alloy tipper trucks, mineral rail rakes, and outbound ocean bulk carriers
            </p>
          </div>
          <span className="text-[11px] font-mono-tabular text-[#69C5F5]">
            Jharkhand · West Bengal · Odisha · Andhra Pradesh
          </span>
        </div>

        {/* Published Capacity & Corridor Dispatch Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CORRIDOR_METRICS.map((m) => (
            <div
              key={m.label}
              className="bg-[#0B1622] text-[#F4F8FC] border border-[#F4F8FC]/12 px-3 py-2"
            >
              <p className="text-[9px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                {m.label}
              </p>
              <p className="font-display text-lg font-bold leading-tight mt-0.5">
                {m.value}
              </p>
              <p className="text-[10px] text-[#B5C5D7] truncate">{m.sub}</p>
            </div>
          ))}
        </div>

        <div className="relative w-full aspect-[16/10] bg-[#0B1622] border border-[#F4F8FC]/14 overflow-hidden">
          <svg
            viewBox="0 0 600 380"
            role="img"
            aria-label="Animated corridor map showing Eastern Indian landmass across Jharkhand, West Bengal, Odisha, and Andhra Pradesh bordering the Bay of Bengal, with moving bulk alloy trucks, freight rail, and ocean bulk cargo ships departing Visakhapatnam Harbour Port"
            className="w-full h-full block"
          >
            <defs>
              {/* Deep Sea Gradient (Bay of Bengal) */}
              <linearGradient id="bayWaterGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#122B42" />
                <stop offset="55%" stopColor="#0C1F32" />
                <stop offset="100%" stopColor="#071320" />
              </linearGradient>

              {/* Continental Landmass Gradient */}
              <linearGradient id="indiaLandGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1F3B5A" />
                <stop offset="55%" stopColor="#18304B" />
                <stop offset="100%" stopColor="#122840" />
              </linearGradient>

              {/* Subtle Bathymetric Water Ripples */}
              <pattern id="seaRipplesPattern" width="60" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 12 Q 15 9, 30 12 T 60 12"
                  fill="none"
                  stroke="rgba(130, 185, 225, 0.09)"
                  strokeWidth="1"
                />
              </pattern>

              {/* Subtle Landmass Geological Grid */}
              <pattern id="landGridPattern" width="32" height="32" patternUnits="userSpaceOnUse">
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="rgba(244,248,252, 0.04)"
                  strokeWidth="1"
                />
              </pattern>

              {/* Reusable Animated Motion Paths */}
              {/* 1. Highway Truck Corridor: Bobbili/Vizianagaram (204,264) -> Visakhapatnam Port (224,308) */}
              <path id="pathTruckBobbiliPort" d="M 204 264 Q 218 282, 224 308" />
              {/* 2. Highway/Rail Corridor: Ghatsila (342,118) -> Dhalbhumgarh (376,146) -> Odisha -> Bobbili (204,264) */}
              <path id="pathRailMineralBelt" d="M 342 118 L 376 146 Q 290 206, 204 264" />
              {/* 3. Corporate Corridor: Kolkata (462,126) -> Dhalbhumgarh (376,146) */}
              <path id="pathTruckKolkata" d="M 462 126 Q 418 134, 376 146" />
              {/* 4. Ocean Shipping Lane 1 (East Asia / Pacific): Visakhapatnam Port (224,308) -> East Bay of Bengal (590,228) */}
              <path id="pathShipEastAsia" d="M 228 310 C 310 318, 430 278, 592 224" />
              {/* 5. Ocean Shipping Lane 2 (Europe / Middle East / Americas): Visakhapatnam Port (224,308) -> South-East Bay of Bengal (445,376) */}
              <path id="pathShipGlobalWest" d="M 226 312 C 282 340, 355 362, 468 378" />

              {/* Soft Glow for Moving Vessels & Active Routes */}
              <filter id="vehicleGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Ocean Base (Bay of Bengal) */}
            <rect width="600" height="380" fill="url(#bayWaterGrad)" />
            <rect width="600" height="380" fill="url(#seaRipplesPattern)" />

            {/* Offshore Bathymetric Shelf Line */}
            <path
              d="M 600 156 C 562 162, 528 164, 498 173 C 474 180, 456 196, 434 210 C 400 229, 368 242, 338 262 C 304 282, 268 302, 240 325 C 212 348, 178 368, 152 380"
              fill="none"
              stroke="rgba(130, 185, 225, 0.16)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <path
              d="M 600 184 C 556 190, 518 198, 480 214 C 446 229, 412 248, 376 270 C 336 294, 294 326, 232 380"
              fill="none"
              stroke="rgba(130, 185, 225, 0.09)"
              strokeWidth="1"
            />

            {/* 2. Eastern Indian Landmass */}
            <path
              d="M 0 0 L 600 0 L 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380 L 0 380 Z"
              fill="url(#indiaLandGrad)"
            />
            <path
              d="M 0 0 L 600 0 L 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380 L 0 380 Z"
              fill="url(#landGridPattern)"
            />

            {/* Coastal Shelf & Shoreline */}
            <path
              d="M 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380"
              fill="none"
              stroke="rgba(120, 180, 220, 0.28)"
              strokeWidth="6"
            />
            <path
              d="M 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380"
              fill="none"
              stroke="#D4DFEB"
              strokeOpacity="0.68"
              strokeWidth="1.6"
            />

            {/* State Divide Borders */}
            <path
              d="M 424 188 C 408 164, 396 138, 405 104 C 412 72, 430 40, 446 0"
              fill="none"
              stroke="rgba(244,248,252, 0.14)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <path
              d="M 400 162 C 362 158, 326 168, 292 178 C 258 188, 220 202, 190 226"
              fill="none"
              stroke="rgba(244,248,252, 0.14)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <path
              d="M 252 287 C 218 268, 192 252, 152 246 C 110 240, 62 246, 0 264"
              fill="none"
              stroke="rgba(244,248,252, 0.14)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />

            {/* Regional Labels */}
            <text x="278" y="64" fill="rgba(244,248,252, 0.24)" fontSize="10" fontFamily="IBM Plex Mono, monospace" letterSpacing="2.4">
              JHARKHAND
            </text>
            <text x="470" y="72" fill="rgba(244,248,252, 0.24)" fontSize="10" fontFamily="IBM Plex Mono, monospace" letterSpacing="2">
              WEST BENGAL
            </text>
            <text x="242" y="198" fill="rgba(244,248,252, 0.24)" fontSize="10" fontFamily="IBM Plex Mono, monospace" letterSpacing="2.4">
              ODISHA
            </text>
            <text x="54" y="302" fill="rgba(244,248,252, 0.24)" fontSize="10" fontFamily="IBM Plex Mono, monospace" letterSpacing="2">
              ANDHRA PRADESH
            </text>

            {/* Water Body Typography */}
            <text
              x="484"
              y="320"
              textAnchor="middle"
              fill="rgba(145, 198, 235, 0.45)"
              fontSize="11.5"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="3.5"
            >
              BAY OF BENGAL
            </text>
            <text
              x="484"
              y="335"
              textAnchor="middle"
              fill="rgba(145, 198, 235, 0.3)"
              fontSize="8"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="1.6"
            >
              GLOBAL MARITIME EXPORT CORRIDOR
            </text>

            {/* Route Destination Badges on Sea Lanes */}
            <g transform="translate(508, 206)" aria-hidden="true">
              <rect x="0" y="0" width="84" height="16" rx="2" fill="rgba(7,17,31,0.82)" stroke="rgba(105,197,245,0.35)" strokeWidth="0.8" />
              <text x="42" y="11" textAnchor="middle" fill="#69C5F5" fontSize="7.5" fontFamily="IBM Plex Mono, monospace">
                EAST ASIA →
              </text>
            </g>
            <g transform="translate(362, 355)" aria-hidden="true">
              <rect x="0" y="0" width="96" height="16" rx="2" fill="rgba(7,17,31,0.82)" stroke="rgba(105,197,245,0.35)" strokeWidth="0.8" />
              <text x="48" y="11" textAnchor="middle" fill="#69C5F5" fontSize="7.5" fontFamily="IBM Plex Mono, monospace">
                EU · MENA →
              </text>
            </g>

            {/* North Compass */}
            <g transform="translate(34, 34)" aria-hidden="true">
              <circle r="13" fill="rgba(16,36,58,0.45)" stroke="rgba(244,248,252,0.22)" strokeWidth="1" />
              <path d="M 0 -8 L 0 8 M -5 0 L 5 0" stroke="rgba(244,248,252,0.35)" strokeWidth="1" />
              <polygon points="0,-10 2.5,-4 -2.5,-4" fill="#EC743C" />
              <text x="0" y="-15" textAnchor="middle" fill="rgba(244,248,252,0.55)" fontSize="8" fontFamily="IBM Plex Mono, monospace">
                N
              </text>
            </g>

            {/* 3. ANIMATED CORRIDOR ROUTES (Rail, Highway & Outbound Sea Lanes) */}
            {/* Mineral Rail Line */}
            <use
              href="#pathRailMineralBelt"
              fill="none"
              stroke="rgba(245, 158, 11, 0.55)"
              strokeWidth="2.2"
              strokeDasharray="6 4"
            >
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2.2s" repeatCount="indefinite" />
            </use>
            {/* Corporate Link */}
            <use
              href="#pathTruckKolkata"
              fill="none"
              stroke="rgba(105, 197, 245, 0.5)"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            >
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="2.6s" repeatCount="indefinite" />
            </use>
            {/* Active Highway Haulage Bobbili -> Visakhapatnam Port */}
            <use
              href="#pathTruckBobbiliPort"
              fill="none"
              stroke="#EC743C"
              strokeWidth="2.6"
              strokeDasharray="5 3"
            >
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.4s" repeatCount="indefinite" />
            </use>
            {/* Outbound Sea Lane 1 & 2 */}
            <use
              href="#pathShipEastAsia"
              fill="none"
              stroke="rgba(105, 197, 245, 0.55)"
              strokeWidth="1.75"
              strokeDasharray="4 5"
            >
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="2.0s" repeatCount="indefinite" />
            </use>
            <use
              href="#pathShipGlobalWest"
              fill="none"
              stroke="rgba(105, 197, 245, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            >
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="2.4s" repeatCount="indefinite" />
            </use>

            {/* 4. LIVE MOVING VEHICLES (3D-Styled Trucks, Freight Rail Rake & Bulk Carrier Ships!) */}

            {/* 4A. Moving Alloy Freight Rail Rake along Jharkhand -> Odisha -> Bobbili */}
            <g filter="url(#vehicleGlow)" aria-hidden="true">
              {/* 3-car train rake oriented along tangent */}
              <rect x="-15" y="-2.5" width="7" height="5" rx="1" fill="#94A3B8" stroke="#0B1622" strokeWidth="0.6" />
              <rect x="-7" y="-2.5" width="7" height="5" rx="1" fill="#CBD5E1" stroke="#0B1622" strokeWidth="0.6" />
              <rect x="1" y="-2.8" width="8" height="5.6" rx="1.2" fill="#F59E0B" stroke="#0B1622" strokeWidth="0.6" />
              <circle cx="8.5" cy="0" r="1.4" fill="#FEF08A" />
              <animateMotion dur="9.5s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathRailMineralBelt" />
              </animateMotion>
            </g>

            {/* 4B. Moving Tipper Truck #1 (Bobbili Smelter -> Visakhapatnam Port) */}
            <g filter="url(#vehicleGlow)" aria-hidden="true">
              {/* Trailer Bed (Crimson + Metallic Alloy Cargo) */}
              <rect x="-9" y="-3.4" width="11" height="6.8" rx="1" fill="#C9233B" stroke="#07111F" strokeWidth="0.7" />
              <rect x="-7.5" y="-2.1" width="8" height="4.2" rx="0.6" fill="#94A3B8" />
              {/* Berry Blue Cab + Headlight Glow */}
              <rect x="2.2" y="-3" width="5.2" height="6" rx="1" fill="#0082C3" stroke="#07111F" strokeWidth="0.7" />
              <polygon points="7.5,-2.5 14,-5.2 14,5.2 7.5,2.5" fill="rgba(254, 240, 138, 0.28)" />
              <animateMotion dur="4.2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathTruckBobbiliPort" />
              </animateMotion>
            </g>

            {/* 4C. Moving Tipper Truck #2 (Staggered convoy on Bobbili -> Port highway) */}
            <g filter="url(#vehicleGlow)" aria-hidden="true">
              <rect x="-9" y="-3.4" width="11" height="6.8" rx="1" fill="#C9233B" stroke="#07111F" strokeWidth="0.7" />
              <rect x="-7.5" y="-2.1" width="8" height="4.2" rx="0.6" fill="#94A3B8" />
              <rect x="2.2" y="-3" width="5.2" height="6" rx="1" fill="#0082C3" stroke="#07111F" strokeWidth="0.7" />
              <animateMotion dur="4.2s" begin="-2.1s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathTruckBobbiliPort" />
              </animateMotion>
            </g>

            {/* 4D. Moving 3D-Styled Bulk Carrier Ship #1 (M.V. Berry Export -> East Asia Lane) */}
            <g filter="url(#vehicleGlow)" aria-hidden="true">
              {/* Foaming Ocean V-Wake */}
              <path d="M -14 0 L -28 -7 M -14 0 L -28 7" stroke="rgba(165, 224, 255, 0.55)" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M -14 0 L -24 -4 M -14 0 L -24 4" stroke="rgba(244, 248, 252, 0.4)" strokeWidth="0.9" strokeLinecap="round" />
              {/* Tapered Hull Shadow (3D depth) */}
              <path d="M -13 -4.2 L 7 -4.2 L 15 0 L 7 4.2 L -13 4.2 Z" fill="#07111F" transform="translate(1.5, 2)" opacity="0.55" />
              {/* Main Crimson-Trimmed Navy Hull */}
              <path d="M -13 -4.5 L 7 -4.5 L 15 0 L 7 4.5 L -13 4.5 Z" fill="#0F2C4C" stroke="#C9233B" strokeWidth="1.1" />
              {/* Bulk Alloy Cargo Hold Hatches */}
              <rect x="-4" y="-2.8" width="4.4" height="5.6" rx="0.5" fill="#94A3B8" />
              <rect x="1.5" y="-2.8" width="4.4" height="5.6" rx="0.5" fill="#CBD5E1" />
              {/* White Aft Bridge Superstructure & Berry Funnel */}
              <rect x="-11.2" y="-3.2" width="5.2" height="6.4" rx="0.8" fill="#F4F8FC" />
              <circle cx="-9.2" cy="0" r="1.5" fill="#006393" stroke="#C9233B" strokeWidth="0.7" />
              <animateMotion dur="11s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathShipEastAsia" />
              </animateMotion>
            </g>

            {/* 4E. Moving 3D-Styled Bulk Carrier Ship #2 (Visakhapatnam -> Europe / MENA Lane) */}
            <g filter="url(#vehicleGlow)" aria-hidden="true">
              <path d="M -12 0 L -24 -6 M -12 0 L -24 6" stroke="rgba(165, 224, 255, 0.5)" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M -11 -4 L 6 -4 L 13 0 L 6 4 L -11 4 Z" fill="#0F2C4C" stroke="#69C5F5" strokeWidth="1" />
              <rect x="-3" y="-2.4" width="3.8" height="4.8" rx="0.4" fill="#94A3B8" />
              <rect x="1.6" y="-2.4" width="3.8" height="4.8" rx="0.4" fill="#CBD5E1" />
              <rect x="-9.6" y="-2.8" width="4.5" height="5.6" rx="0.6" fill="#F4F8FC" />
              <circle cx="-7.8" cy="0" r="1.3" fill="#C9233B" />
              <animateMotion dur="9.5s" begin="-4.5s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathShipGlobalWest" />
              </animateMotion>
            </g>

            {/* 5. Documented Operational Nodes with Live Radar Pulse */}
            {FACILITY_NODES.map((node) => {
              const isSelected = node.id === activeNode.id;
              const isPort = node.id === 'visakhapatnam-port';

              const labelMeta: Record<string, { dx: number; dy: number; anchor: 'start' | 'end'; short: string }> = {
                kolkata: { dx: 12, dy: 4, anchor: 'start', short: 'Kolkata (HQ)' },
                ghatsila: { dx: -12, dy: -6, anchor: 'end', short: 'Ghatsila' },
                dhalbhumgarh: { dx: 12, dy: 8, anchor: 'start', short: 'Dhalbhumgarh' },
                vizianagaram: { dx: -12, dy: 3, anchor: 'end', short: 'Bobbili / Vizianagaram' },
                'visakhapatnam-port': { dx: 13, dy: 5, anchor: 'start', short: 'Visakhapatnam Port' },
              };
              const pos = labelMeta[node.id] ?? { dx: 12, dy: 4, anchor: 'start', short: node.name.split(' ')[0] };

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.coordinates.x}, ${node.coordinates.y})`}
                  className="cursor-pointer focus:outline-none [&:focus-visible_.node-focus-ring]:opacity-100"
                  onClick={() => setSelectedId(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(node.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.name}, ${node.region}`}
                  aria-pressed={isSelected}
                >
                  {/* Animated Radar Ring for Selected Node & Harbour Gateway */}
                  {(isSelected || isPort) && (
                    <circle
                      r="8"
                      fill="none"
                      stroke={isPort ? '#69C5F5' : '#EC743C'}
                      strokeWidth="1.4"
                      opacity="0.7"
                    >
                      <animate attributeName="r" from="7" to="24" dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.75" to="0" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  <circle
                    className="node-focus-ring opacity-0 transition-opacity"
                    r={isSelected ? 21 : 16}
                    fill="none"
                    stroke="#EC743C"
                    strokeWidth="2"
                  />
                  <circle
                    r={isSelected ? 16 : 10}
                    fill={isSelected ? 'rgba(40,148,204,0.28)' : 'rgba(244,248,252,0.1)'}
                  />
                  <circle
                    r={isSelected ? 6.5 : 4.5}
                    fill={isSelected ? '#EC743C' : isPort ? '#69C5F5' : '#F4F8FC'}
                    stroke="#10243A"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pos.dx}
                    y={pos.dy}
                    textAnchor={pos.anchor}
                    fill={isSelected ? '#F4F8FC' : 'rgba(244,248,252,0.88)'}
                    fontSize="10.5"
                    fontWeight={isSelected ? '700' : '500'}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    paintOrder="stroke"
                    stroke="#0B1622"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  >
                    {pos.short}
                  </text>
                </g>
              );
            })}

            {/* Bottom-Left Compact Live Fleet Legend */}
            <g transform="translate(12, 344)" aria-hidden="true">
              <rect
                x="0"
                y="0"
                width="260"
                height="24"
                fill="rgba(7, 17, 31, 0.9)"
                stroke="rgba(244,248,252, 0.16)"
                strokeWidth="1"
              />
              <rect x="8" y="8" width="9" height="8" rx="1" fill="#C9233B" />
              <text x="21" y="15" fill="rgba(244,248,252,0.86)" fontSize="8" fontFamily="IBM Plex Mono, monospace">
                Tipper Truck
              </text>
              <rect x="92" y="8" width="10" height="8" rx="1" fill="#F59E0B" />
              <text x="106" y="15" fill="rgba(244,248,252,0.86)" fontSize="8" fontFamily="IBM Plex Mono, monospace">
                Rail Rake
              </text>
              <polygon points="168,12 178,8 184,12 178,16" fill="#69C5F5" />
              <text x="190" y="15" fill="#69C5F5" fontSize="8" fontFamily="IBM Plex Mono, monospace">
                Bulk Vessel
              </text>
            </g>
          </svg>
        </div>

        {/* 4-Stage Truck-to-Ship Visual Explainer Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {CORRIDOR_FLOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/12 dark:border-[#F4F8FC]/12 p-2.5 space-y-1"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{step.stage}</span>
                </div>
                <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-snug">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="pt-3 border-t border-subtle flex flex-col sm:flex-row sm:items-start justify-between gap-4"
        >
          <div>
            <p className="text-xs font-mono-tabular text-[#69C5F5]">
              {activeNode.status} · {activeNode.region}
            </p>
            <h4 className="font-display text-xl font-bold uppercase text-ink mt-0.5">
              {activeNode.name}
            </h4>
            <p className="text-xs text-ink-2 mt-1 leading-relaxed">{activeNode.detail}</p>
          </div>
        </div>
      </div>

      {/* Accessible Synchronized Text List */}
      <div className="lg:col-span-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
            Documented Facilities &amp; Offices
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
            <TrainFront className="w-3.5 h-3.5" aria-hidden="true" />
            Multi-Modal
          </span>
        </div>
        <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
          Select any location to inspect its operational role across Berry Alloys’ smelting, haulage, and deep-water port export network.
        </p>

        <ul className="divide-y divide-[#10243A]/12 dark:divide-[#F4F8FC]/12 border-t border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
          {FACILITY_NODES.map((node) => {
            const isSelected = node.id === activeNode.id;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={isSelected}
                  className={`w-full min-h-[44px] text-left py-3.5 px-3 flex items-start gap-3 transition-colors duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F1F6FB] dark:bg-[#12243B]'
                      : 'hover:bg-[#F1F6FB]/55 dark:hover:bg-[#12243B]/55'
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected
                        ? 'text-brand dark:text-[#69C5F5]'
                        : 'text-[#465C72] dark:text-[#B5C5D7]'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-lg font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                        {node.name}
                      </span>
                      <span className="text-xs text-[#465C72] dark:text-[#B5C5D7]">{node.region}</span>
                    </div>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-0.5">{node.role}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
