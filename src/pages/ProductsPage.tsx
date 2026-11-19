import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALLOY_FAMILIES, AlloyFamily, PRODUCTS } from '../data/products';
import { AlloyExplorer } from '../components/AlloyExplorer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SplitText } from '../components/motion/SplitText';

const FAMILY_OVERVIEW: Array<{
  family: AlloyFamily;
  symbol: string;
  range: string;
  grades: string;
  role: string;
}> = [
  {
    family: 'Ferro Manganese',
    symbol: 'FeMn',
    range: '70–80% Mn',
    grades: 'HC · MC · LC · ULC',
    role: 'Deoxidiser, desulphuriser & strength alloy for bulk and specialty steel.',
  },
  {
    family: 'Silico Manganese',
    symbol: 'SiMn',
    range: '55–70% Mn · 14–30% Si',
    grades: 'HC · MC · LC',
    role: 'Dual manganese-silicon deoxidation with lower residual carbon.',
  },
  {
    family: 'Ferro Chrome',
    symbol: 'FeCr',
    range: '60–65% Cr min',
    grades: 'Low & Medium Carbon',
    role: 'Vacuum-refined chromium addition for stainless and heat-resistant steels.',
  },
  {
    family: 'Ferro Silicon',
    symbol: 'FeSi',
    range: '70–72% Si min',
    grades: 'FeSi 70 / FeSi 72',
    role: 'High-efficiency steel deoxidation and grain-oriented electrical steel.',
  },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFamily = useMemo<AlloyFamily | 'All'>(() => {
    const param = searchParams.get('family');
    if (param && (ALLOY_FAMILIES as string[]).includes(param)) {
      return param as AlloyFamily;
    }
    return 'All';
  }, [searchParams]);

  const handleFamilySelect = (targetFamily: AlloyFamily) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('family', targetFamily);
    setSearchParams(nextParams, { replace: true });
    document.getElementById('alloy-explorer-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      {/* Architectural Catalogue Header */}
      <header className="bg-[#10243A] text-[#F4F8FC] py-12 lg:py-16 border-b border-[#F4F8FC]/12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Products & Specifications' }]} dark />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                {`Product Catalogue · ${PRODUCTS.length} Documented Series`}
              </p>
              <SplitText
                text="Bulk ferro alloys by family & grade."
                as="h1"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#F4F8FC]"
              />
            </div>
            <p className="lg:col-span-4 text-sm text-[#B5C5D7] leading-relaxed">
              Filter by Ferro Manganese, Silico Manganese, Ferro Chrome, or Ferro Silicon, compare up to three products with exact min/max qualifiers, or open individual chemistry tables.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        {/* 4-Family Metallurgical Selector Strip */}
        <section aria-label="Filter catalogue by alloy family" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#10243A]/15 dark:border-[#F4F8FC]/14">
          {FAMILY_OVERVIEW.map((item) => {
            const active = initialFamily === item.family;
            return (
              <button
                key={item.family}
                type="button"
                onClick={() => handleFamilySelect(item.family)}
                aria-pressed={active}
                className={`text-left p-6 border-r border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14 transition-colors cursor-pointer flex flex-col justify-between gap-4 ${
                  active
                    ? 'bg-[#10243A] text-[#F4F8FC] dark:bg-[#0A6AA1]'
                    : 'bg-[#FFFFFF] dark:bg-[#12243B] hover:bg-[#F1F6FB] dark:hover:bg-[#0D1B2E]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`font-display text-3xl font-bold uppercase ${
                        active ? 'text-[#69C5F5] dark:text-[#FFFFFF]' : 'text-brand dark:text-[#69C5F5]'
                      }`}
                    >
                      {item.symbol}
                    </span>
                    <span
                      className={`text-[11px] font-mono-tabular ${
                        active ? 'text-[#B5C5D7] dark:text-[#F4F8FC]/85' : 'text-[#465C72] dark:text-[#B5C5D7]'
                      }`}
                    >
                      {item.grades}
                    </span>
                  </div>
                  <h2
                    className={`font-display text-xl font-bold uppercase ${
                      active ? 'text-[#F4F8FC]' : 'text-[#10243A] dark:text-[#F4F8FC]'
                    }`}
                  >
                    {item.family}
                  </h2>
                  <p
                    className={`text-xs leading-relaxed ${
                      active ? 'text-[#F4F8FC]/82' : 'text-[#465C72] dark:text-[#B5C5D7]'
                    }`}
                  >
                    {item.role}
                  </p>
                </div>
                <p
                  className={`pt-3 border-t text-xs font-mono-tabular ${
                    active
                      ? 'border-[#F4F8FC]/16 text-[#F4F8FC]'
                      : 'border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-[#10243A] dark:text-[#F4F8FC]'
                  }`}
                >
                  {item.range}
                </p>
              </button>
            );
          })}
        </section>

        <div id="alloy-explorer-anchor" className="scroll-mt-24">
          <AlloyExplorer key={initialFamily} initialFamily={initialFamily} />
        </div>

        <aside className="mt-14 bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mb-2">
              Sizing, Packaging & Custom Chemistry
            </h2>
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              Across all four alloy families, lump sizing and domestic or export packaging are supplied according to customer furnace and ladle specifications. Contact the commercial desk for batch-specific sieve analysis and packing schedules.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mb-2">
              Specification Record Attribution
            </h2>
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              Numeric tables transcribe published company website records verbatim, preserving min/max qualifiers and column structures. Final contractual sales specifications and mill test certificates are issued per confirmed order.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
