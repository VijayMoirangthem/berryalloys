import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALLOY_FAMILIES, AlloyFamily, PRODUCTS } from '../data/products';
import { QA_PERSPECTIVE_SLIDES } from '../data/showcaseCollections';
import { AlloyExplorer } from '../components/AlloyExplorer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SplitText } from '../components/motion/SplitText';
import { PerspectiveCarousel, PerspectiveSlide } from '../components/ui/PerspectiveCarousel';

const PLATE_TO_FAMILY: Record<string, AlloyFamily> = {
  'qa-plate-femn': 'Ferro Manganese',
  'qa-plate-simn': 'Silico Manganese',
  'qa-plate-fecr': 'Ferro Chrome',
  'qa-plate-fesi': 'Ferro Silicon',
};

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFamily = useMemo<AlloyFamily | 'All'>(() => {
    const param = searchParams.get('family');
    if (param && (ALLOY_FAMILIES as string[]).includes(param)) {
      return param as AlloyFamily;
    }
    return 'All';
  }, [searchParams]);

  const handlePlateSelect = (slide: PerspectiveSlide) => {
    const targetFamily = PLATE_TO_FAMILY[slide.id];
    if (!targetFamily) return;
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
        <PerspectiveCarousel
          slides={QA_PERSPECTIVE_SLIDES.slice(1)}
          heading="Alloy Specimen Deck · Click Active Plate to Filter Catalogue"
          onSlideSelect={handlePlateSelect}
        />

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
