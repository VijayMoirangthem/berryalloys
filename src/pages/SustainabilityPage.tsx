import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { SUSTAINABILITY_INITIATIVES, SustainabilityInitiative } from '../data/company';
import { CSR_DIAGONAL_SLIDES } from '../data/showcaseCollections';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';
import { OPERATIONS_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { ImageReveal } from '../components/motion/ImageReveal';
import { SplitText } from '../components/motion/SplitText';
import { DiagonalCarousel } from '../components/ui/DiagonalCarousel';
import { GooeyTextReveal } from '../components/ui/GooeyTextReveal';

type StageFilter = 'All' | SustainabilityInitiative['stage'];

export function SustainabilityPage() {
  const [stageFilter, setStageFilter] = useState<StageFilter>('All');

  const filtered = SUSTAINABILITY_INITIATIVES.filter(
    (item) => stageFilter === 'All' || item.stage === stageFilter
  );

  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      <SubNav links={OPERATIONS_SUBNAV_LINKS} ariaLabel="Operations navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-14">
        <div>
          <Breadcrumbs items={[{ label: 'Sustainability' }]} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                Energy Transition & Process Stewardship
              </p>
              <SplitText
                text="Operational renewables, planned recovery & research."
                as="h1"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
              />
              <GooeyTextReveal>
                <p
                  data-gooey-reveal-item=""
                  className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-[62ch]"
                >
                  Ferro alloy smelting is energy intensive. Berry Alloys’ published disclosures describe solar and wind generation assets alongside planned waste heat recovery at Ghatsila and exploratory biomass evaluations. Each initiative below is categorized transparently by stage without inventing unverified emissions counters.
                </p>
              </GooeyTextReveal>
            </div>

            <div className="lg:col-span-5">
              <figure className="bg-[#ECE8DF] dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 overflow-hidden">
                <ImageReveal direction="up" className="aspect-video bg-[#141618]">
                  <ResilientImage
                    src={ASSETS.officialSolarRoof.src}
                    alt={ASSETS.officialSolarRoof.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#4A5054] dark:text-[#A1A7AB] border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
                  {ASSETS.officialSolarRoof.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Stage Filter & Initiatives */}
        <div className="pt-8 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Filter sustainability initiatives by stage"
              className="flex flex-wrap items-center gap-1.5"
            >
              {(['All', 'Reported / Operational', 'Planned', 'Exploratory'] as const).map(
                (stage) => {
                  const active = stageFilter === stage;
                  return (
                    <button
                      key={stage}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setStageFilter(stage)}
                      className={`min-h-[40px] px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
                          : 'bg-[#ECE8DF] text-[#4A5054] hover:bg-[#D8D1C3] hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
                      }`}
                    >
                      {stage}
                    </button>
                  );
                }
              )}
            </div>

            <p className="text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
              Showing {filtered.length} documented initiative{filtered.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="divide-y divide-[#141618]/15 dark:divide-[#F3F0E9]/14 border-t border-b border-[#141618]/15 dark:border-[#F3F0E9]/14 bg-white dark:bg-[#20242A] px-6 sm:px-8">
            {filtered.map((item, idx) => (
              <article
                key={item.id}
                className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-3 space-y-1">
                  <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C] font-semibold">
                    0{idx + 1} · {item.stage}
                  </p>
                  <p className="font-display text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {item.metric}
                  </p>
                </div>

                <div className="lg:col-span-5 space-y-2">
                  <h2 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="lg:col-span-4 text-xs text-[#4A5054] dark:text-[#A1A7AB] bg-[#F6F4EF] dark:bg-[#191C20] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-4 leading-relaxed">
                  <strong className="text-[#141618] dark:text-[#F3F0E9]">Disclosure Note:</strong>{' '}
                  {item.verificationNote}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Ecological & Fieldwork Showcase */}
        <DiagonalCarousel
          slides={CSR_DIAGONAL_SLIDES}
          eyebrow="Ecological & Community Fieldwork"
        />

        {/* Methodological Note */}
        <aside className="bg-[#141618] text-[#F3F0E9] border border-[#141618] dark:border-[#F3F0E9]/14 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display text-2xl font-bold uppercase text-[#F3F0E9]">
              Scope Separation & Life-Cycle Assessment Note
            </h2>
            <p className="text-xs text-[#A1A7AB] leading-relaxed">
              The 83 MW solar capacity reported on the company sustainability page and the 2.6 MW solar installation announced on the homepage are kept strictly separate because their project scopes are not reconciled in source documents. Low-carbon ferro alloy grades reduce direct carbon addition in the ladle, which is distinct from a third-party verified Life-Cycle Assessment (LCA).
            </p>
          </div>
          <Link
            to="/products?family=Ferro+Manganese"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#A95632] text-[#F3F0E9] hover:bg-[#823B1D] transition-colors whitespace-nowrap shrink-0"
          >
            Low-Carbon FeMn Grades
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
