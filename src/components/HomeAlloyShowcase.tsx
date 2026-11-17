import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, GitCompare, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ASSETS, VisualAsset } from '../data/assets';
import { ALLOY_FAMILIES, AlloyFamily, AlloyProduct, PRODUCTS } from '../data/products';
import { CompareModal } from './CompareModal';
import { ResilientImage } from './ResilientImage';
import { SpotlightSurface } from './motion/SpotlightSurface';
import { AnimatedTooltip } from './ui/AnimatedTooltip';
import { IndustrialButton } from './ui/IndustrialButton';
import { WaveGridBackground } from './ui/WaveGridBackground';

const FAMILY_MEDIA: Record<
  AlloyFamily,
  { index: string; tagline: string; officialSpecimen: VisualAsset; fractureScene: VisualAsset }
> = {
  'Ferro Manganese': {
    index: '01',
    tagline: 'High, medium, low, and ultra-low carbon manganese grades with low-phosphorus and low-boron options.',
    officialSpecimen: ASSETS.officialProdFeMn,
    fractureScene: ASSETS.alloySamples,
  },
  'Silico Manganese': {
    index: '02',
    tagline: 'Combined silicon-manganese deoxidation and alloying across standard, medium, and low-carbon melts.',
    officialSpecimen: ASSETS.officialProdSiMn,
    fractureScene: ASSETS.silicoManganese,
  },
  'Ferro Chrome': {
    index: '03',
    tagline: 'Silicothermic and vacuum-treated low & medium carbon chromium (60–65% Cr min) for stainless steels.',
    officialSpecimen: ASSETS.officialProdFeCr,
    fractureScene: ASSETS.ferroChrome,
  },
  'Ferro Silicon': {
    index: '04',
    tagline: '70% and 72% minimum silicon alloy for steel deoxidation, electrical steel cores, and foundry inoculation.',
    officialSpecimen: ASSETS.officialProdFeSi,
    fractureScene: ASSETS.ferroSilicon,
  },
};

interface HomeAlloyShowcaseProps {
  onEnquireAlloy?: (slug: string) => void;
}

export function HomeAlloyShowcase({ onEnquireAlloy }: HomeAlloyShowcaseProps) {
  const [activeFamily, setActiveFamily] = useState<AlloyFamily>('Ferro Manganese');
  const familyProducts = useMemo(
    () => PRODUCTS.filter((p) => p.family === activeFamily),
    [activeFamily]
  );

  const [selectedSlug, setSelectedSlug] = useState<string>(PRODUCTS[0].slug);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([
    'high-carbon-ferro-manganese',
    'high-carbon-silico-manganese',
  ]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [limitNotice, setLimitNotice] = useState<string | null>(null);

  const activeProduct: AlloyProduct = useMemo(() => {
    const matchInFamily = familyProducts.find((p) => p.slug === selectedSlug);
    return matchInFamily ?? familyProducts[0] ?? PRODUCTS[0];
  }, [familyProducts, selectedSlug]);

  const activeFamilyMedia = FAMILY_MEDIA[activeFamily];
  const activeImage = activeFamilyMedia.officialSpecimen;

  const comparedProducts = useMemo(
    () =>
      compareSlugs
        .map((s) => PRODUCTS.find((p) => p.slug === s))
        .filter((p): p is AlloyProduct => Boolean(p)),
    [compareSlugs]
  );

  const handleSelectFamily = (family: AlloyFamily) => {
    setActiveFamily(family);
    const firstInFamily = PRODUCTS.find((p) => p.family === family);
    if (firstInFamily) setSelectedSlug(firstInFamily.slug);
  };

  const toggleCompare = (slug: string) => {
    setLimitNotice(null);
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) {
        setLimitNotice('Maximum 3 alloys selected for comparison. Remove one to add another.');
        return prev;
      }
      return [...prev, slug];
    });
  };

  const isCurrentCompared = compareSlugs.includes(activeProduct.slug);

  return (
    <section
      id="alloys"
      aria-labelledby="alloy-explorer-heading"
      className="relative overflow-hidden scroll-mt-20 py-20 lg:py-28 bg-[#ECE8DF] text-[#141618] dark:bg-[#141618] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/10"
    >
      <WaveGridBackground className="absolute inset-0 opacity-75" />
      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 border-b border-[#141618]/14 dark:border-[#F3F0E9]/12">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              05 / Alloy Portfolio
            </p>
            <h2
              id="alloy-explorer-heading"
              className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
            >
              Four bulk alloy families. Ten documented grade series.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9] dark:hover:text-[#EC743C] transition-colors"
            >
              Search & Filter Full Catalogue
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Asymmetric Split Selector + Official Specimen Assay Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Family Selector & Grade Series Chips */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mobile Horizontal Tabs */}
            <div
              role="tablist"
              aria-label="Select ferro alloy family"
              className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2"
            >
              {ALLOY_FAMILIES.map((family) => {
                const isActive = activeFamily === family;
                return (
                  <button
                    key={family}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelectFamily(family)}
                    className={`min-h-[44px] px-4 py-2 text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#9E4B28] text-[#F6F4EF] border-[#9E4B28] dark:bg-[#A95632] dark:border-[#A95632]'
                        : 'bg-white text-[#4A5054] border-[#141618]/15 hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:border-[#F3F0E9]/14 dark:hover:text-[#F3F0E9]'
                    }`}
                  >
                    {FAMILY_MEDIA[family].index}. {family}
                  </button>
                );
              })}
            </div>

            {/* Desktop Vertical Numbered Family List */}
            <div className="hidden lg:block divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12 border-t border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
              {ALLOY_FAMILIES.map((family) => {
                const isActive = activeFamily === family;
                const meta = FAMILY_MEDIA[family];
                const variantCount = PRODUCTS.filter((p) => p.family === family).length;
                return (
                  <button
                    key={family}
                    type="button"
                    onClick={() => handleSelectFamily(family)}
                    aria-pressed={isActive}
                    className={`w-full text-left py-5 px-4 transition-colors duration-350 flex items-start justify-between gap-4 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-[#20242A]'
                        : 'hover:bg-white/60 dark:hover:bg-[#20242A]/55'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-mono-tabular text-xs ${
                            isActive
                              ? 'text-[#9E4B28] dark:text-[#EC743C]'
                              : 'text-[#4A5054] dark:text-[#A1A7AB]'
                          }`}
                        >
                          {meta.index}
                        </span>
                        <span
                          className={`font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight ${
                            isActive
                              ? 'text-[#141618] dark:text-[#F3F0E9]'
                              : 'text-[#141618]/65 dark:text-[#F3F0E9]/65'
                          }`}
                        >
                          {family}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed pl-7 max-w-md ${
                          isActive
                            ? 'text-[#4A5054] dark:text-[#F3F0E9]/80'
                            : 'text-[#4A5054]/80 dark:text-[#A1A7AB]'
                        }`}
                      >
                        {meta.tagline}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 font-mono-tabular text-[11px] text-[#4A5054] dark:text-[#A1A7AB] shrink-0 pt-1">
                      <span>{variantCount} series</span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform duration-350 ${
                          isActive
                            ? 'text-[#9E4B28] dark:text-[#EC743C] translate-x-0.5'
                            : 'opacity-40'
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Family Variant Selector */}
            <div className="space-y-3">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#4A5054] dark:text-[#A1A7AB]">
                Select Grade Series in {activeFamily}
              </p>
              <div className="flex flex-wrap gap-2">
                {familyProducts.map((item) => {
                  const isSelected = item.slug === activeProduct.slug;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setSelectedSlug(item.slug)}
                      aria-pressed={isSelected}
                      className={`min-h-[40px] px-3.5 py-2 text-xs font-medium border transition-colors cursor-pointer text-left whitespace-normal sm:whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#141618] text-[#F6F4EF] border-[#141618] font-semibold dark:bg-[#F3F0E9] dark:text-[#141618] dark:border-[#F3F0E9]'
                          : 'bg-white text-[#141618] border-[#141618]/18 hover:border-[#9E4B28] dark:bg-[#20242A] dark:text-[#F3F0E9]/80 dark:border-[#F3F0E9]/16 dark:hover:border-[#EC743C]'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inline Comparison Bar */}
            <div className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#141618] dark:text-[#F3F0E9]">
                  <GitCompare
                    className="w-4 h-4 text-[#9E4B28] dark:text-[#EC743C]"
                    aria-hidden="true"
                  />
                  Compare Alloys ({comparedProducts.length}/3)
                </span>
                <button
                  type="button"
                  disabled={comparedProducts.length < 2}
                  onClick={() => setCompareModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#9E4B28] text-[#F6F4EF] hover:bg-[#823B1D] dark:bg-[#A95632] dark:hover:bg-[#8D4323] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Open Matrix
                </button>
              </div>
              {comparedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {comparedProducts.map((p) => (
                    <span
                      key={p.slug}
                      className="inline-flex items-center gap-1.5 text-[11px] bg-[#F6F4EF] border border-[#141618]/15 px-2.5 py-1 text-[#141618] dark:bg-[#121417] dark:border-[#F3F0E9]/16 dark:text-[#F3F0E9]"
                    >
                      {p.shortName}
                      <button
                        type="button"
                        onClick={() => toggleCompare(p.slug)}
                        aria-label={`Remove ${p.name} from comparison`}
                        className="text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9] cursor-pointer"
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {limitNotice && (
                <p role="status" className="text-xs text-[#9E4B28] dark:text-[#EC743C]">
                  {limitNotice}
                </p>
              )}
            </div>
          </div>

          {/* Right: Official Specimen Tray + Specification Card */}
          <div className="lg:col-span-7">
            <SpotlightSurface className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Framed Official Specimen Plate (consistent studio tray in both themes) */}
                  <div className="p-4 sm:p-5 bg-[#F6F4EF] border-b border-[#141618]/14 dark:border-[#F3F0E9]/14">
                    <div className="flex items-center justify-between gap-3 pb-3 text-[11px] font-mono-tabular uppercase tracking-wider text-[#4A5054]">
                      <span>Official Alloy Specimen Plate · {activeProduct.family}</span>
                      <span>Berry Alloys Assay Series</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 aspect-[16/10] bg-white border border-[#141618]/12 overflow-hidden">
                        <ResilientImage
                          src={activeImage.src}
                          alt={`${activeProduct.name} — ${activeImage.alt}`}
                          className="w-full h-full object-contain p-2"
                          containerClassName="w-full h-full"
                        />
                      </div>
                      <div className="sm:col-span-4 aspect-[16/10] sm:aspect-square bg-[#141618] border border-[#141618]/15 overflow-hidden">
                        <ResilientImage
                          src={activeFamilyMedia.fractureScene.src}
                          alt={activeFamilyMedia.fractureScene.alt}
                          containerClassName="w-full h-full"
                        />
                      </div>
                    </div>
                    <p className="pt-3 text-[11px] font-mono-tabular text-[#4A5054]">
                      {activeImage.caption}
                    </p>
                  </div>

                  {/* Product Technical Readout */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <p className="text-xs font-mono-tabular text-[#9E4B28] dark:text-[#EC743C]">
                          {activeProduct.family} · {activeProduct.carbonTier}
                          {activeProduct.lowPhosphorusOption && (
                            <>
                              {' · '}
                              <AnimatedTooltip
                                variant="copper"
                                label="Low Phosphorus & Specialty Trace Control"
                                sublabel="P ≤ 0.1% / Low-B 50 ppm options available for clean steel melts."
                              >
                                <span
                                  tabIndex={0}
                                  className="underline decoration-dotted underline-offset-4 cursor-help focus-visible:outline-none"
                                >
                                  Low-P Available
                                </span>
                              </AnimatedTooltip>
                            </>
                          )}
                        </p>
                        <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                          {activeProduct.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleCompare(activeProduct.slug)}
                        aria-pressed={isCurrentCompared}
                        className={`min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                          isCurrentCompared
                            ? 'bg-[#141618] text-[#F6F4EF] border-[#141618] dark:bg-[#F3F0E9] dark:text-[#141618] dark:border-[#F3F0E9]'
                            : 'bg-transparent text-[#141618] border-[#141618]/25 hover:border-[#9E4B28] dark:text-[#F3F0E9] dark:border-[#F3F0E9]/25 dark:hover:border-[#EC743C]'
                        }`}
                      >
                        {isCurrentCompared && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                        {isCurrentCompared ? 'In Comparison' : 'Add to Compare'}
                      </button>
                    </div>

                    <p className="text-sm sm:text-base text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed max-w-2xl">
                      {activeProduct.summary}
                    </p>

                    {/* Chemistry Preview Strip */}
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
                      <div>
                        <dt className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">
                          {activeProduct.comparison.primaryElementLabel}
                        </dt>
                        <dd className="font-mono-tabular text-sm font-semibold text-[#141618] dark:text-[#F3F0E9] mt-1">
                          {activeProduct.comparison.primaryElementRange}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">
                          {activeProduct.comparison.siliconLabel}
                        </dt>
                        <dd className="font-mono-tabular text-sm font-semibold text-[#141618] dark:text-[#F3F0E9] mt-1">
                          {activeProduct.comparison.siliconRange}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">
                          {activeProduct.comparison.carbonLabel}
                        </dt>
                        <dd className="font-mono-tabular text-sm font-semibold text-[#141618] dark:text-[#F3F0E9] mt-1">
                          {activeProduct.comparison.carbonRange}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">
                          {activeProduct.comparison.phosphorusLabel}
                        </dt>
                        <dd className="font-mono-tabular text-sm font-semibold text-[#141618] dark:text-[#F3F0E9] mt-1">
                          {activeProduct.comparison.phosphorusRange}
                        </dd>
                      </div>
                    </dl>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4">
                      <IndustrialButton
                        to={`/products/${activeProduct.slug}`}
                        variant="outline-light"
                      >
                        View Full Specifications
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </IndustrialButton>
                      {onEnquireAlloy ? (
                        <IndustrialButton
                          href="#enquiry"
                          variant="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            onEnquireAlloy(activeProduct.slug);
                          }}
                        >
                          Enquire About This Alloy
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </IndustrialButton>
                      ) : (
                        <IndustrialButton
                          to={`/contact?tab=quote&product=${activeProduct.slug}`}
                          variant="primary"
                        >
                          Enquire About This Alloy
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </IndustrialButton>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </SpotlightSurface>
          </div>
        </div>
      </div>

      <CompareModal
        open={compareModalOpen}
        products={comparedProducts}
        onClose={() => setCompareModalOpen(false)}
        onRemoveProduct={(slug) => toggleCompare(slug)}
      />
    </section>
  );
}
