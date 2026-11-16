import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { FACILITY_NODES, FacilityNode } from '../data/company';

export function FacilityCorridorMap() {
  const [selectedId, setSelectedId] = useState<string>(FACILITY_NODES[0].id);

  const activeNode: FacilityNode =
    FACILITY_NODES.find((n) => n.id === selectedId) ?? FACILITY_NODES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Schematic SVG Corridor Map */}
      <div className="lg:col-span-7 bg-[#141618] text-[#F3F0E9] border border-[#141618]/20 dark:border-[#F3F0E9]/15 p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 border-b border-[#F3F0E9]/12 mb-4">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight">
              Eastern & Coastal Operations Corridor
            </h3>
            <p className="text-xs text-[#A1A7AB]">
              Schematic representation of documented Indian plants, offices, and port logistics
            </p>
          </div>
          <span className="text-[11px] font-mono-tabular text-[#EC743C]">
            Jharkhand · West Bengal · Andhra Pradesh
          </span>
        </div>

        <div className="relative w-full aspect-[16/10] bg-[#191C20] border border-[#F3F0E9]/10 overflow-hidden">
          <svg
            viewBox="0 0 600 380"
            role="img"
            aria-label="Schematic corridor map showing Kolkata, Dhalbhumgarh, Ghatsila, Vizianagaram, and Visakhapatnam Harbour Port"
            className="w-full h-full"
          >
            <defs>
              <pattern id="corridorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(243,240,233,0.06)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="600" height="380" fill="url(#corridorGrid)" />

            <path
              d="M 480 120 C 460 175, 435 215, 375 250 C 325 280, 280 315, 215 365 L 600 365 L 600 120 Z"
              fill="rgba(169, 86, 50, 0.1)"
              stroke="rgba(236, 116, 60, 0.3)"
              strokeWidth="1.5"
            />
            <text
              x="445"
              y="325"
              fill="rgba(243, 240, 233, 0.35)"
              fontSize="11"
              fontFamily="IBM Plex Mono, monospace"
            >
              Bay of Bengal
            </text>

            <path
              d="M 432 184 L 380 170 L 356 158 L 268 278 L 245 312"
              fill="none"
              stroke="rgba(236, 116, 60, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {FACILITY_NODES.map((node) => {
              const isSelected = node.id === activeNode.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.coordinates.x}, ${node.coordinates.y})`}
                  className="cursor-pointer"
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
                    r={isSelected ? 16 : 11}
                    fill={isSelected ? 'rgba(236,116,60,0.24)' : 'rgba(243,240,233,0.08)'}
                  />
                  <circle
                    r={isSelected ? 6 : 4.5}
                    fill={isSelected ? '#EC743C' : '#F3F0E9'}
                    stroke="#141618"
                    strokeWidth="1.5"
                  />
                  <text
                    x={node.id === 'dhalbhumgarh' ? -12 : 12}
                    y={node.id === 'ghatsila' ? -10 : 4}
                    textAnchor={node.id === 'dhalbhumgarh' ? 'end' : 'start'}
                    fill={isSelected ? '#F3F0E9' : 'rgba(243,240,233,0.75)'}
                    fontSize="11"
                    fontWeight={isSelected ? '600' : '400'}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {node.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 pt-4 border-t border-[#F3F0E9]/12 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono-tabular text-[#EC743C]">
              {activeNode.status} · {activeNode.region}
            </p>
            <h4 className="font-display text-xl font-bold uppercase text-[#F3F0E9] mt-0.5">
              {activeNode.name}
            </h4>
            <p className="text-xs text-[#A1A7AB] mt-1 leading-relaxed">{activeNode.detail}</p>
          </div>
        </div>
      </div>

      {/* Accessible Synchronized Text List */}
      <div className="lg:col-span-5 space-y-3">
        <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
          Documented Facilities & Offices
        </h3>
        <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
          Select any location to inspect its operational role. Overseas destination country lists are omitted pending formal verification.
        </p>

        <ul className="divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12 border-t border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
          {FACILITY_NODES.map((node) => {
            const isSelected = node.id === activeNode.id;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={isSelected}
                  className={`w-full min-h-[44px] text-left py-3.5 px-3 flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#ECE8DF] dark:bg-[#20242A]'
                      : 'hover:bg-[#ECE8DF]/55 dark:hover:bg-[#20242A]/55'
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected
                        ? 'text-[#9E4B28] dark:text-[#EC743C]'
                        : 'text-[#4A5054] dark:text-[#A1A7AB]'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-lg font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                        {node.name}
                      </span>
                      <span className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">{node.region}</span>
                    </div>
                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-0.5">{node.role}</p>
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
