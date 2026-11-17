import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { CERTIFICATIONS } from '../data/company';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FacilityCorridorMap } from '../components/FacilityCorridorMap';
import { ResilientImage } from '../components/ResilientImage';
import { OPERATIONS_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { ImageReveal } from '../components/motion/ImageReveal';
import { SplitText } from '../components/motion/SplitText';
import { SpotlightSurface } from '../components/motion/SpotlightSurface';
import { CursorCard } from '../components/ui/CursorCard';
import { FlipText } from '../components/ui/FlipText';
import { GooeyTextReveal } from '../components/ui/GooeyTextReveal';
import { WaveGridBackground } from '../components/ui/WaveGridBackground';

export function ManufacturingPage() {
  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      <SubNav links={OPERATIONS_SUBNAV_LINKS} ariaLabel="Operations navigation" />

      {/* Dark Header with Interactive 3D Wave Grid Backdrop */}
      <header className="relative overflow-hidden bg-[#10243A] text-[#F4F8FC] py-12 lg:py-16 border-b border-[#F4F8FC]/12">
        <WaveGridBackground className="absolute inset-0 opacity-70" />
        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Manufacturing & Quality' }]} dark />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                Production & Quality Assurance
              </p>
              <SplitText
                text="Smelting routes & batch chemistry control."
                as="h1"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#F4F8FC]"
              />
              <p className="text-base text-[#F4F8FC]/82 leading-relaxed max-w-[60ch]">
                Berry Alloys Limited manufactures bulk ferro alloys across submerged-arc electric furnace smelting and specialised AOD and silicothermic refining routes, linking Bobbili and Jharkhand plants to Visakhapatnam Port.
              </p>
            </div>

            <div className="lg:col-span-5">
              <figure className="bg-[#0D1B2E] border border-[#F4F8FC]/14 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <ResilientImage
                    src={ASSETS.officialAerialComplex.src}
                    alt={ASSETS.officialAerialComplex.alt}
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs text-[#B5C5D7] border-t border-[#F4F8FC]/10">
                  {ASSETS.officialAerialComplex.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {/* Process Architecture */}
        <section aria-labelledby="process-routes-heading" className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <FlipText
              className="font-mono-tabular text-xs font-bold uppercase tracking-widest text-brand dark:text-[#69C5F5]"
              duration={3.2}
            >
              SAF SMELTING · AOD REFINING · SILICOTHERMIC
            </FlipText>
            <h2 id="process-routes-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Documented Metallurgical Processes
            </h2>
            <p className="text-sm text-[#465C72] dark:text-[#B5C5D7]">
              Process routes differ by carbon ceiling, alloying metal, and trace impurity limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightSurface className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6">
              <article className="space-y-3">
                <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">
                  01. Electric Smelting
                </p>
                <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Submerged-Arc Reduction & Casting
                </h3>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Used for{' '}
                  <CursorCard
                    imageSrc={ASSETS.heroSmelting.src}
                    imageAlt={ASSETS.heroSmelting.alt}
                    caption="Submerged-Arc Tapping"
                    description="High-temperature carbothermic reduction producing HC FeMn, HC SiMn, and Ferro Silicon batches."
                  >
                    High Carbon Ferro Manganese
                  </CursorCard>
                  , High Carbon Silico Manganese, and Ferro Silicon (70/72). Controlled slag chemistry regulates manganese, silicon, and residual phosphorus. Existing 24 MVA furnace operations are documented at Ghatsila, Jharkhand alongside Bobbili capacity milestones.
                </p>
              </article>
            </SpotlightSurface>

            <SpotlightSurface className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6">
              <article className="space-y-3">
                <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">
                  02. AOD Decarburisation
                </p>
                <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Argon Oxygen Decarburisation
                </h3>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  <CursorCard
                    imageSrc={ASSETS.officialProdFeMn.src}
                    imageAlt={ASSETS.officialProdFeMn.alt}
                    caption="2023 Converter Line"
                    description="Commissioned 6,000 MT/month AOD refinement line reducing carbon down to Medium, Low, and Ultra Low limits."
                  >
                    6,000 MT/month converter capacity
                  </CursorCard>{' '}
                  commissioned in 2023 produces Medium, Low & Ultra Low Carbon Ferro Manganese grades (down to 0.5% carbon in standard rows), supporting automotive flat steels and specialty low-nitrogen steelmaking.
                </p>
              </article>
            </SpotlightSurface>

            <SpotlightSurface className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6">
              <article className="space-y-3">
                <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">
                  03. Silicothermic Route
                </p>
                <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Silicothermic & Vacuum Treatment
                </h3>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Documented for{' '}
                  <CursorCard
                    imageSrc={ASSETS.officialProdFeCr.src}
                    imageAlt={ASSETS.officialProdFeCr.alt}
                    caption="Refined Ferro Chrome"
                    description="60–65% Cr min with vacuum carbon refinement tailored for 304L and 316L stainless steels."
                  >
                    Low & Medium Carbon Ferro Chrome
                  </CursorCard>{' '}
                  (60–65% Cr min, 0.1%–0.5% C max), where optional vacuum treatment lowers residual carbon for 304L and 316L stainless steel production.
                </p>
              </article>
            </SpotlightSurface>
          </div>
        </section>

        {/* Quality Systems */}
        <section
          aria-labelledby="qa-heading"
          className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Quality Assurance & Testing
            </p>
            <h2 id="qa-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Analytical Verification & Standards Alignment
            </h2>
            <GooeyTextReveal>
              <p
                data-gooey-reveal-item=""
                className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed"
              >
                Every alloy family is tested against customer-specified chemical bands—spanning manganese, silicon, chromium, carbon, phosphorus, sulfur, and trace elements such as boron (50 ppm in Low Boron HC FeMn) and nitrogen (100 ppm in Low Nitrogen LC FeMn).
              </p>
            </GooeyTextReveal>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.code} className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-4">
                  <dt className="font-mono-tabular text-sm font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    {cert.code}
                  </dt>
                  <dd className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">{cert.scope}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <figure className="bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden">
              <ImageReveal direction="left" className="aspect-video bg-[#10243A]">
                <ResilientImage
                  src={ASSETS.qualityLab.src}
                  alt={ASSETS.qualityLab.alt}
                  containerClassName="w-full h-full"
                />
              </ImageReveal>
              <figcaption className="px-4 py-3 text-xs text-[#465C72] dark:text-[#B5C5D7] border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                {ASSETS.qualityLab.caption}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Plant & Port Corridor */}
        <section aria-labelledby="corridor-heading" className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 id="corridor-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Plant Locations & Export Gateway
              </h2>
              <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] mt-1">
                Connecting eastern Indian alloy facilities with Visakhapatnam Harbour Port.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
            >
              Inspect Product Chemistry Tables
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <FacilityCorridorMap />
        </section>
      </div>
    </div>
  );
}
