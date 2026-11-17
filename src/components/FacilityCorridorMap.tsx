import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { FACILITY_NODES, FacilityNode } from '../data/company';

export function FacilityCorridorMap() {
  const [selectedId, setSelectedId] = useState<string>(FACILITY_NODES[0].id);

  const activeNode: FacilityNode =
    FACILITY_NODES.find((n) => n.id === selectedId) ?? FACILITY_NODES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Cartographic SVG Corridor Map (Landmass vs. Bay of Bengal Water) */}
      <div className="lg:col-span-7 bg-card text-ink border border-subtle p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-subtle mb-4">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight">
              Eastern & Coastal Operations Corridor
            </h3>
            <p className="text-xs text-ink-2">
              Cartographic overview of documented Indian plants, offices, and deep-water port export logistics
            </p>
          </div>
          <span className="text-[11px] font-mono-tabular text-[#69C5F5]">
            Jharkhand · West Bengal · Odisha · Andhra Pradesh
          </span>
        </div>

        <div className="relative w-full aspect-[16/10] bg-[#0B1622] border border-[#F4F8FC]/14 overflow-hidden">
          <svg
            viewBox="0 0 600 380"
            role="img"
            aria-label="Corridor map showing Eastern Indian landmass across Jharkhand, West Bengal, Odisha, and Andhra Pradesh bordering the Bay of Bengal, with Kolkata, Ghatsila, Dhalbhumgarh, Bobbili Vizianagaram, and Visakhapatnam Harbour Port"
            className="w-full h-full block"
          >
            <defs>
              {/* Deep Sea Gradient (Bay of Bengal) */}
              <linearGradient id="bayWaterGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#12273A" />
                <stop offset="55%" stopColor="#0C1C2B" />
                <stop offset="100%" stopColor="#08131E" />
              </linearGradient>

              {/* Continental Landmass Gradient (Warm Mineral Slate) */}
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
                  stroke="rgba(130, 185, 225, 0.08)"
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
            </defs>

            {/* 1. Ocean Base (Bay of Bengal) */}
            <rect width="600" height="380" fill="url(#bayWaterGrad)" />
            <rect width="600" height="380" fill="url(#seaRipplesPattern)" />

            {/* Offshore Bathymetric Shelf Line Parallel to East Coast */}
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

            {/* 2. Eastern Indian Landmass (North, West & Center-Left) */}
            <path
              d="M 0 0 L 600 0 L 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380 L 0 380 Z"
              fill="url(#indiaLandGrad)"
            />
            <path
              d="M 0 0 L 600 0 L 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380 L 0 380 Z"
              fill="url(#landGridPattern)"
            />

            {/* Shallow Coastal Shelf Highlight Along Eastern Coastline */}
            <path
              d="M 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380"
              fill="none"
              stroke="rgba(120, 180, 220, 0.25)"
              strokeWidth="6"
            />
            {/* Crisp Land Shoreline Stroke */}
            <path
              d="M 600 136 C 560 142, 522 142, 492 150 C 468 156, 454 170, 432 184 C 400 202, 370 215, 336 238 C 304 256, 266 276, 238 298 C 228 306, 218 314, 204 326 C 174 352, 146 368, 122 380"
              fill="none"
              stroke="#D4DFEB"
              strokeOpacity="0.65"
              strokeWidth="1.6"
            />

            {/* Subtle State Divide Borders on Landmass */}
            {/* West Bengal / Jharkhand / Odisha Internal Borders */}
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

            {/* Regional Labels on Landmass */}
            <text
              x="290"
              y="72"
              fill="rgba(244,248,252, 0.24)"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="2.4"
            >
              JHARKHAND
            </text>
            <text
              x="472"
              y="78"
              fill="rgba(244,248,252, 0.24)"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="2"
            >
              WEST BENGAL
            </text>
            <text
              x="266"
              y="214"
              fill="rgba(244,248,252, 0.24)"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="2.4"
            >
              ODISHA
            </text>
            <text
              x="72"
              y="304"
              fill="rgba(244,248,252, 0.24)"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="2"
            >
              ANDHRA PRADESH
            </text>

            {/* Water Body Typography (Bay of Bengal) */}
            <text
              x="468"
              y="272"
              textAnchor="middle"
              fill="rgba(145, 198, 235, 0.5)"
              fontSize="12"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="3.5"
            >
              BAY OF BENGAL
            </text>
            <text
              x="468"
              y="289"
              textAnchor="middle"
              fill="rgba(145, 198, 235, 0.3)"
              fontSize="8.5"
              fontFamily="IBM Plex Mono, monospace"
              letterSpacing="1.6"
            >
              EAST COAST MARITIME ROUTE
            </text>

            {/* Minimal North Compass Mark (Top Left Landmass) */}
            <g transform="translate(34, 34)" aria-hidden="true">
              <circle r="13" fill="rgba(16,36,58,0.45)" stroke="rgba(244,248,252,0.22)" strokeWidth="1" />
              <path d="M 0 -8 L 0 8 M -5 0 L 5 0" stroke="rgba(244,248,252,0.35)" strokeWidth="1" />
              <polygon points="0,-10 2.5,-4 -2.5,-4" fill="#EC743C" />
              <text
                x="0"
                y="-15"
                textAnchor="middle"
                fill="rgba(244,248,252,0.55)"
                fontSize="8"
                fontFamily="IBM Plex Mono, monospace"
              >
                N
              </text>
            </g>

            {/* Active Corridor Rail & Maritime Link */}
            <path
              d="M 462 126 L 342 118 L 376 146 L 204 264 L 224 308"
              fill="none"
              stroke="rgba(40,148,204, 0.72)"
              strokeWidth="1.75"
              strokeDasharray="5 4"
            />
            {/* Outbound Sea Shipping Vector from Visakhapatnam Port */}
            <path
              d="M 224 308 Q 275 332, 342 356"
              fill="none"
              stroke="rgba(145, 198, 235, 0.42)"
              strokeWidth="1.25"
              strokeDasharray="3 4"
            />

            {/* Documented Operational Nodes */}
            {FACILITY_NODES.map((node) => {
              const isSelected = node.id === activeNode.id;

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
                  <circle
                    className="node-focus-ring opacity-0 transition-opacity"
                    r={isSelected ? 21 : 16}
                    fill="none"
                    stroke="#EC743C"
                    strokeWidth="2"
                  />
                  <circle
                    r={isSelected ? 17 : 11}
                    fill={isSelected ? 'rgba(40,148,204,0.26)' : 'rgba(244,248,252,0.1)'}
                  />
                  <circle
                    r={isSelected ? 6.5 : 4.5}
                    fill={isSelected ? '#EC743C' : '#F4F8FC'}
                    stroke="#10243A"
                    strokeWidth="1.5"
                  />
                  <text
                    x={pos.dx}
                    y={pos.dy}
                    textAnchor={pos.anchor}
                    fill={isSelected ? '#F4F8FC' : 'rgba(244,248,252,0.85)'}
                    fontSize="10.5"
                    fontWeight={isSelected ? '700' : '500'}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    paintOrder="stroke"
                    stroke="#1D2025"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  >
                    {pos.short}
                  </text>
                </g>
              );
            })}

            {/* Bottom-Left Compact Cartographic Key (Land vs. Sea) */}
            <g transform="translate(14, 342)" aria-hidden="true">
              <rect
                x="0"
                y="0"
                width="148"
                height="26"
                fill="rgba(16, 20, 26, 0.86)"
                stroke="rgba(244,248,252, 0.16)"
                strokeWidth="1"
              />
              <rect x="8" y="8" width="10" height="10" fill="#32353A" stroke="#D4DFEB" strokeOpacity="0.5" strokeWidth="1" />
              <text x="23" y="16" fill="rgba(244,248,252,0.8)" fontSize="8.5" fontFamily="IBM Plex Mono, monospace">
                Landmass
              </text>
              <rect x="80" y="8" width="10" height="10" fill="#0C1C2B" stroke="rgba(145,198,235,0.45)" strokeWidth="1" />
              <text x="95" y="16" fill="rgba(145,198,235,0.85)" fontSize="8.5" fontFamily="IBM Plex Mono, monospace">
                Sea
              </text>
            </g>
          </svg>
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 pt-4 border-t border-subtle flex flex-col sm:flex-row sm:items-start justify-between gap-4"
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
        <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
          Documented Facilities & Offices
        </h3>
        <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
          Select any location to inspect its operational role. Export countries are shown on the globe above.
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
