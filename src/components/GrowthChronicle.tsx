import { useState } from 'react';
import { ASSETS } from '../data/assets';
import { GROWTH_TIMELINE, GrowthMilestone } from '../data/company';
import { ResilientImage } from './ResilientImage';

const YEAR_VISUAL_MAP: Record<string, { src: string; alt: string; caption: string }> = {
  '2010': ASSETS.milestone2010Visual,
  '2016': ASSETS.officialPlantGate,
  '2017': ASSETS.furnaceElectrodes,
  '2020': ASSETS.portLogistics,
  '2021': ASSETS.officialAerialComplex,
  '2022': ASSETS.officialPlantOverview,
  '2023': ASSETS.qualityLab,
  '2025': ASSETS.milestone2025Visual,
  '2026+': ASSETS.newsBobbiliVisual,
};

export function GrowthChronicle() {
  const [selectedYear, setSelectedYear] = useState<string>(GROWTH_TIMELINE[0].year);

  const activeItem: GrowthMilestone =
    GROWTH_TIMELINE.find((m) => m.year === selectedYear) ?? GROWTH_TIMELINE[0];
  const activeVisual = YEAR_VISUAL_MAP[activeItem.year] ?? ASSETS.officialAerialComplex;

  return (
    <div className="space-y-10">
      {/* Horizontal Year Selector Strip */}
      <div
        role="tablist"
        aria-label="Select milestone year in Berry Alloys growth story"
        className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2"
      >
        {GROWTH_TIMELINE.map((milestone) => {
          const isSelected = milestone.year === activeItem.year;
          return (
            <button
              key={milestone.year}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedYear(milestone.year)}
              className={`min-h-[48px] px-3 py-2.5 text-left border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#141618] text-[#F3F0E9] border-[#141618] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:border-[#EC743C]'
                  : 'bg-white text-[#141618] border-[#141618]/15 hover:border-[#9E4B28] dark:bg-[#20242A] dark:text-[#F3F0E9]/80 dark:border-[#F3F0E9]/14 dark:hover:border-[#EC743C]'
              }`}
            >
              <span
                className={`block font-mono-tabular text-xs font-semibold ${
                  isSelected
                    ? 'text-[#EC743C] dark:text-[#F3F0E9]'
                    : 'text-[#9E4B28] dark:text-[#EC743C]'
                }`}
              >
                {milestone.year}
              </span>
              <span
                className={`block text-[11px] truncate mt-0.5 ${
                  isSelected
                    ? 'text-[#F3F0E9]/85'
                    : 'text-[#4A5054] dark:text-[#A1A7AB]'
                }`}
              >
                {milestone.capacitySummary.split('·')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Milestone Focus + Supporting Official Photograph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14">
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 pb-3">
              <span className="font-mono-tabular text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C]">
                Milestone {activeItem.year}
              </span>
              <span className="text-[11px] font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                {activeItem.sourceStage}
              </span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
              {activeItem.headline}
            </h3>

            <p className="inline-block font-mono-tabular text-xs sm:text-sm font-semibold px-3 py-1.5 bg-[#ECE8DF] text-[#141618] border border-[#141618]/15 dark:bg-[#121417] dark:text-[#EC743C] dark:border-[#F3F0E9]/16">
              {activeItem.capacitySummary}
            </p>

            <p className="text-sm sm:text-base text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
              {activeItem.details}
            </p>
          </div>

          <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB] pt-4 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 leading-relaxed">
            Milestones 2010–2025 transcribe Berry Alloys’ published website growth timeline verbatim; 2026 entries reflect dated news and AP SIPB disclosures rather than completed installed tonnage.
          </p>
        </div>

        <figure className="lg:col-span-6 flex flex-col bg-[#ECE8DF] dark:bg-[#121417] border-t lg:border-t-0 lg:border-l border-[#141618]/12 dark:border-[#F3F0E9]/12">
          <div className="aspect-[16/10] flex-1 overflow-hidden bg-[#141618]">
            <ResilientImage
              src={activeVisual.src}
              alt={activeVisual.alt}
              containerClassName="w-full h-full"
            />
          </div>
          <figcaption className="px-4 py-3 text-xs text-[#4A5054] dark:text-[#A1A7AB] border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
            {activeVisual.caption}
          </figcaption>
        </figure>
      </div>

      {/* Scannable Compact Growth Index Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#141618]/12 dark:bg-[#F3F0E9]/14 border border-[#141618]/12 dark:border-[#F3F0E9]/14">
        {GROWTH_TIMELINE.map((item) => {
          const active = item.year === activeItem.year;
          return (
            <button
              key={item.year}
              type="button"
              onClick={() => setSelectedYear(item.year)}
              className={`text-left p-5 transition-colors cursor-pointer ${
                active
                  ? 'bg-[#ECE8DF] dark:bg-[#191C20]'
                  : 'bg-white hover:bg-[#F6F4EF] dark:bg-[#20242A] dark:hover:bg-[#191C20]/80'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="font-display text-2xl font-bold text-[#9E4B28] dark:text-[#EC743C]">
                  {item.year}
                </span>
                <span className="font-mono-tabular text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">
                  {item.capacitySummary.split('·')[0]}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] leading-snug">
                {item.headline}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
