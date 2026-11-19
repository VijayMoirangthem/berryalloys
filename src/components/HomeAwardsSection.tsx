import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AWARD_CATEGORIES,
  AWARD_RECORDS,
  AwardCategory,
  CREDIT_RATING_DISCLOSURE,
} from '../data/awards';
import { HOME_AWARD_EDITORIAL_PLATES } from '../data/showcaseCollections';
import { ResilientImage } from './ResilientImage';
import { ImageReveal } from './motion/ImageReveal';
import { SpotlightSurface } from './motion/SpotlightSurface';
import { AnimatedTooltip } from './ui/AnimatedTooltip';
import { IndustrialButton } from './ui/IndustrialButton';
import { PerspectiveGrid } from './ui/PerspectiveGrid';

type HomeAwardFilter = 'All' | AwardCategory;

/**
 * HomeAwardsSection — Complete executive Awards & Achievements chapter integrated
 * directly into the Homepage narrative, featuring 4 exclusive bespoke recognition plates,
 * interactive category filtering across all published Berry Alloys award records,
 * expandable source provenance notes, and direct passage to the full ceremony archive.
 */
export function HomeAwardsSection() {
  const [activeCategory, setActiveCategory] = useState<HomeAwardFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? AWARD_RECORDS
        : AWARD_RECORDS.filter((r) => r.category === activeCategory);
    return [...base].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeCategory]);

  const featuredPlate = HOME_AWARD_EDITORIAL_PLATES[0];
  const secondaryPlates = HOME_AWARD_EDITORIAL_PLATES.slice(1);

  return (
    <section
      id="awards"
      aria-labelledby="home-awards-heading"
      className="scroll-mt-20 relative overflow-hidden py-20 lg:py-28 bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
    >
      {/* Subtle 3D interactive PerspectiveGrid architecture in background */}
      <div className="pointer-events-none absolute inset-0 opacity-45 dark:opacity-35">
        <PerspectiveGrid
          gridSize={20}
          fadeRadius={76}
          accent="berry"
          className="[--fade-stop:#FFFFFF] dark:[--fade-stop:#07111F]"
        />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
        {/* Chapter Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              08 / Awards &amp; Achievements
            </p>
            <h2
              id="home-awards-heading"
              className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
            >
              Recognised for brand trust, workplace excellence &amp; social impact
            </h2>
          </div>
          <div className="space-y-3 max-w-md">
            <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              Every recognition below is traced to Berry Alloys Limited’s published disclosures — kept clearly distinct from audited ISO management systems and external credit ratings.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <IndustrialButton to="/awards-achievements" variant="primary">
                Full Ceremony Photo Archive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </IndustrialButton>
            </div>
          </div>
        </div>

        {/* Visual Editorial Showcase — 1 Featured Panorama + 3 Pillar Plates (4 Exclusive New Images) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Featured Workplace Recognition Panorama */}
          <motion.figure
            initial={{ opacity: 0.35, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden flex flex-col"
          >
            <ImageReveal direction="up" className="aspect-[16/9] bg-[#07111F]">
              <ResilientImage
                src={featuredPlate.asset.src}
                alt={featuredPlate.asset.alt}
                containerClassName="w-full h-full"
              />
            </ImageReveal>
            <figcaption className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-wider">
                  <span className="text-brand dark:text-[#69C5F5] font-semibold">
                    {featuredPlate.category} · {featuredPlate.year}
                  </span>
                  <AnimatedTooltip
                    variant="cora"
                    content="Verified Public Record"
                    sublabel="Published on berryalloys.com"
                    accentColor="#006393"
                    shapeColor="#10243A"
                    textColor="#F4F8FC"
                  >
                    <span className="inline-flex items-center gap-1 text-[#465C72] dark:text-[#B5C5D7] cursor-help underline decoration-dotted underline-offset-4">
                      <Award className="w-3.5 h-3.5 text-[#C9233B]" aria-hidden="true" />
                      {featuredPlate.issuer}
                    </span>
                  </AnimatedTooltip>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                  {featuredPlate.title}
                </h3>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {featuredPlate.summary}
                </p>
              </div>
              <div className="pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 flex items-center justify-between gap-4 text-xs">
                <span className="font-mono-tabular text-[11px] text-[#465C72] dark:text-[#B5C5D7]">
                  Official stage ceremony photography archived on /awards-achievements
                </span>
                <Link
                  to="/awards-achievements"
                  className="inline-flex items-center gap-1 font-semibold text-brand dark:text-[#69C5F5] hover:underline shrink-0"
                >
                  Inspect Ceremony
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </figcaption>
          </motion.figure>

          {/* 3 Editorial Pillar Cards (Brand, Social Impact, Leadership) */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {secondaryPlates.map((plate, idx) => (
              <motion.figure
                key={plate.id}
                initial={{ opacity: 0.35, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-12 bg-[#FFFFFF] dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden"
              >
                <div className="col-span-5 bg-[#07111F] min-h-[128px]">
                  <ResilientImage
                    src={plate.asset.src}
                    alt={plate.asset.alt}
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="col-span-7 p-4 flex flex-col justify-between gap-1.5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                      {plate.category} · {plate.year}
                    </p>
                    <h4 className="font-display text-base sm:text-lg font-bold uppercase leading-snug text-[#10243A] dark:text-[#F4F8FC]">
                      {plate.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] line-clamp-2 leading-relaxed">
                    {plate.summary}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* Interactive Filterable Traceable Recognition Ledger */}
        <div className="space-y-5 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                Interactive Recognition Ledger ({filteredRecords.length} Records)
              </p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Filter Published Recognitions By Category
              </h3>
            </div>

            <div
              role="tablist"
              aria-label="Filter awards by category"
              className="flex flex-wrap items-center gap-1.5"
            >
              {(['All', ...AWARD_CATEGORIES] as HomeAwardFilter[]).map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-[36px] px-3 py-1.5 text-[11px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer ${
                      active
                        ? 'bg-brand text-[#FFFFFF] border-brand dark:bg-[#0A6AA1] dark:border-[#69C5F5]/60'
                        : 'bg-[#F1F6FB] text-[#465C72] border-[#10243A]/14 hover:text-[#10243A] dark:bg-[#12243B] dark:text-[#B5C5D7] dark:border-[#F4F8FC]/14 dark:hover:text-[#F4F8FC]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record) => {
              const isExpanded = expandedId === record.id;
              return (
                <SpotlightSurface
                  key={record.id}
                  className="h-full bg-[#FFFFFF] dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-widest">
                      <span className="text-brand dark:text-[#69C5F5] font-semibold">
                        {record.category}
                      </span>
                      <span className="text-[#C9233B] dark:text-[#F48B9B] font-semibold">
                        {record.displayDate}
                      </span>
                    </div>
                    <h4 className="font-display text-xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                      {record.title}
                    </h4>
                    <p className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                      Issuer: {record.issuer}
                    </p>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                      {record.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 space-y-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5] cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Source Note' : 'Trace Source Record'}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isExpanded && (
                      <div className="pt-1.5 text-[11px] text-[#465C72] dark:text-[#B5C5D7] space-y-1.5">
                        <p className="leading-relaxed">
                          {record.verificationNote ??
                            `Recorded for ${record.recipient} (${record.displayDate}) via Berry Alloys published disclosures.`}
                        </p>
                        {record.sourceUrl && (
                          <a
                            href={record.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                          >
                            {record.sourceLabel}
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </SpotlightSurface>
              );
            })}
          </div>

          {/* Transparent Governance & Credit Rating Distinction Callout */}
          <div className="bg-[#10243A] text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/16 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <ShieldCheck
                className="w-5 h-5 text-[#69C5F5] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                  External Credit Rating Reference (Kept Separate From Awards)
                </p>
                <p className="text-xs sm:text-sm text-[#B5C5D7] leading-relaxed">
                  {CREDIT_RATING_DISCLOSURE.summary}
                </p>
              </div>
            </div>
            <Link
              to="/awards-achievements"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#69C5F5] hover:text-[#FFFFFF] whitespace-nowrap shrink-0"
            >
              Inspect Complete Archive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeAwardsSection;
