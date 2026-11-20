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
import { FlipText } from '../components/ui/FlipText';
import { GooeyTextReveal } from '../components/ui/GooeyTextReveal';
import { WaveGridBackground } from '../components/ui/WaveGridBackground';
import { SmeltingRefiningJourney } from '../components/SmeltingRefiningJourney';

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
              <figure className="bg-[#0D1B2E] border border-[#F4F8FC]/14 overflow-hidden relative">
                <span aria-hidden="true" className="absolute top-0 inset-x-0 z-10 h-[2px] bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B]" />
                <ImageReveal direction="up" className="aspect-[16/10] bg-[#07111F]">
                  <ResilientImage
                    src={ASSETS.mfgMoltenTap411k.src}
                    alt={ASSETS.mfgMoltenTap411k.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="p-4 sm:p-5 space-y-3 border-t border-[#F4F8FC]/12">
                  <p className="text-xs text-[#B5C5D7] leading-relaxed">
                    {ASSETS.mfgMoltenTap411k.caption}
                  </p>
                  <dl className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F4F8FC]/10 text-xs">
                    <div>
                      <dt className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#94A9BF]">
                        Timeline Scale
                      </dt>
                      <dd className="font-mono-tabular font-semibold text-[#F4F8FC] mt-0.5">
                        3,20,000 TPA (2023)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#94A9BF]">
                        AOD Refining
                      </dt>
                      <dd className="font-mono-tabular font-semibold text-[#F4F8FC] mt-0.5">
                        6,000 MT / month
                      </dd>
                    </div>
                  </dl>
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

          <div className="m-rail grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    High Carbon Ferro Manganese
                  </strong>
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
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    6,000 MT/month converter capacity
                  </strong>{' '}
                  commissioned in 2023 produces Medium, Low &amp; Ultra Low Carbon Ferro Manganese grades (down to 0.5% carbon in standard rows), supporting automotive flat steels and specialty low-nitrogen steelmaking.
                </p>
              </article>
            </SpotlightSurface>

            <SpotlightSurface className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6">
              <article className="space-y-3">
                <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">
                  03. Silicothermic Route
                </p>
                <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Silicothermic &amp; Vacuum Treatment
                </h3>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Documented for{' '}
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Low &amp; Medium Carbon Ferro Chrome
                  </strong>{' '}
                  (60–65% Cr min, 0.1%–0.5% C max), where optional vacuum treatment lowers residual carbon for 304L and 316L stainless steel production.
                </p>
              </article>
            </SpotlightSurface>
          </div>

          <div className="pt-8 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/12">
            <SmeltingRefiningJourney />
          </div>
        </section>

        {/* Quality Systems */}
        <section
          aria-labelledby="qa-heading"
          className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
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

          <div className="lg:col-span-6 space-y-5">
            <figure className="bg-[#10243A] text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/14 overflow-hidden relative">
              <span aria-hidden="true" className="absolute top-0 inset-x-0 z-10 h-[2px] bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B]" />
              <div className="aspect-[16/10] bg-[#07111F] overflow-hidden">
                <ResilientImage
                  src={ASSETS.mfgPlantSeminar.src}
                  alt={ASSETS.mfgPlantSeminar.alt}
                  className="w-full h-full object-cover object-top"
                  containerClassName="w-full h-full"
                />
              </div>
              <figcaption className="p-5 sm:p-6 space-y-4">
                <p className="text-xs text-[#B5C5D7] leading-relaxed">
                  {ASSETS.mfgPlantSeminar.caption}
                </p>
                <dl className="grid grid-cols-2 gap-x-5 gap-y-3 pt-3 border-t border-[#F4F8FC]/12 text-xs">
                  <div>
                    <dt className="text-[#94A9BF]">Low-Phosphorus</dt>
                    <dd className="font-mono-tabular font-semibold text-[#F4F8FC] mt-0.5">P ≤ 0.1%</dd>
                  </div>
                  <div>
                    <dt className="text-[#94A9BF]">Low-Boron Control</dt>
                    <dd className="font-mono-tabular font-semibold text-[#F4F8FC] mt-0.5">B ≤ 50 ppm</dd>
                  </div>
                  <div>
                    <dt className="text-[#94A9BF]">Low-Nitrogen</dt>
                    <dd className="font-mono-tabular font-semibold text-[#F4F8FC] mt-0.5">N ≤ 100 ppm</dd>
                  </div>
                  <div>
                    <dt className="text-[#94A9BF]">Carbon Accounting</dt>
                    <dd className="font-mono-tabular font-semibold text-[#F4F8FC] mt-0.5">ISO 14067:2018</dd>
                  </div>
                </dl>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Unit-2 Kadambeda Expansion & Plant Corridor */}
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

          {/* Authentic Unit-2 Kadambeda Expansion Visual Feature */}
          <div className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
            <div className="lg:col-span-6 aspect-[16/10] lg:aspect-auto bg-[#07111F] overflow-hidden">
              <ResilientImage
                src={ASSETS.mfgUnit2Kadambeda.src}
                alt={ASSETS.mfgUnit2Kadambeda.alt}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </div>
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Jharkhand Expansion Corridor · August 2026 Disclosure
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Unit-2 Integrated Complex at Kadambeda, Jharkhand
                </h3>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Published expansion announcements outline two 1,000 TPD rotary DRI (sponge iron) kilns alongside multi-furnace ferro alloy capacity additions at Kadambeda (Ghatsila belt), complementing existing 24 MVA operations and Andhra Pradesh smelting lines.
                </p>
              </div>
              <div className="pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                  {ASSETS.mfgUnit2Kadambeda.caption}
                </span>
                <Link
                  to="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
                >
                  Read Expansion Disclosures
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <FacilityCorridorMap />
        </section>
      </div>
    </div>
  );
}
