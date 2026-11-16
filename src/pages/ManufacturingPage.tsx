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

export function ManufacturingPage() {
  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      <SubNav links={OPERATIONS_SUBNAV_LINKS} ariaLabel="Operations navigation" />

      {/* Dark Header */}
      <header className="bg-[#141618] text-[#F3F0E9] py-12 lg:py-16 border-b border-[#F3F0E9]/12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Manufacturing & Quality' }]} dark />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#EC743C]">
                Production & Quality Assurance
              </p>
              <SplitText
                text="Smelting routes & batch chemistry control."
                as="h1"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#F3F0E9]"
              />
              <p className="text-base text-[#F3F0E9]/82 leading-relaxed max-w-[60ch]">
                Berry Alloys Limited manufactures bulk ferro alloys across submerged-arc electric furnace smelting and specialised AOD and silicothermic refining routes, linking Bobbili and Jharkhand plants to Visakhapatnam Port.
              </p>
            </div>

            <div className="lg:col-span-5">
              <figure className="bg-[#191C20] border border-[#F3F0E9]/14 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <ResilientImage
                    src={ASSETS.officialAerialComplex.src}
                    alt={ASSETS.officialAerialComplex.alt}
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs text-[#A1A7AB] border-t border-[#F3F0E9]/10">
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
          <div className="max-w-2xl">
            <h2 id="process-routes-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              Documented Metallurgical Processes
            </h2>
            <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] mt-2">
              Process routes differ by carbon ceiling, alloying metal, and trace impurity limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-6 space-y-3">
              <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C]">
                01. Electric Smelting
              </p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Submerged-Arc Reduction & Casting
              </h3>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                Used for High Carbon Ferro Manganese, High Carbon Silico Manganese, and Ferro Silicon (70/72). Controlled slag chemistry regulates manganese, silicon, and residual phosphorus. Existing 24 MVA furnace operations are documented at Ghatsila, Jharkhand alongside Bobbili capacity milestones.
              </p>
            </article>

            <article className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-6 space-y-3">
              <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C]">
                02. AOD Decarburisation
              </p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Argon Oxygen Decarburisation
              </h3>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                6,000 MT/month converter capacity commissioned in 2023 produces Medium, Low & Ultra Low Carbon Ferro Manganese grades (down to 0.5% carbon in standard rows), supporting automotive flat steels and specialty low-nitrogen steelmaking.
              </p>
            </article>

            <article className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-6 space-y-3">
              <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C]">
                03. Silicothermic Route
              </p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Silicothermic & Vacuum Treatment
              </h3>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                Documented for Low & Medium Carbon Ferro Chrome (60–65% Cr min, 0.1%–0.5% C max), where optional vacuum treatment lowers residual carbon for 304L and 316L stainless steel production.
              </p>
            </article>
          </div>
        </section>

        {/* Quality Systems */}
        <section
          aria-labelledby="qa-heading"
          className="pt-12 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Quality Assurance & Testing
            </p>
            <h2 id="qa-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              Analytical Verification & Standards Alignment
            </h2>
            <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
              Every alloy family is tested against customer-specified chemical bands—spanning manganese, silicon, chromium, carbon, phosphorus, sulfur, and trace elements such as boron (50 ppm in Low Boron HC FeMn) and nitrogen (100 ppm in Low Nitrogen LC FeMn).
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.code} className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-4">
                  <dt className="font-mono-tabular text-sm font-semibold text-[#141618] dark:text-[#F3F0E9]">
                    {cert.code}
                  </dt>
                  <dd className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1">{cert.scope}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6">
            <figure className="bg-[#ECE8DF] dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 overflow-hidden">
              <ImageReveal direction="left" className="aspect-video bg-[#141618]">
                <ResilientImage
                  src={ASSETS.qualityLab.src}
                  alt={ASSETS.qualityLab.alt}
                  containerClassName="w-full h-full"
                />
              </ImageReveal>
              <figcaption className="px-4 py-3 text-xs text-[#4A5054] dark:text-[#A1A7AB] border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
                {ASSETS.qualityLab.caption}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Plant & Port Corridor */}
        <section aria-labelledby="corridor-heading" className="pt-12 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 id="corridor-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Plant Locations & Export Gateway
              </h2>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] mt-1">
                Connecting eastern Indian alloy facilities with Visakhapatnam Harbour Port.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline whitespace-nowrap"
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
