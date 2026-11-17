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
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      {/* Architectural Catalogue Header */}
      <header className="bg-[#141618] text-[#F3F0E9] py-12 lg:py-16 border-b border-[#F3F0E9]/12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Products & Specifications' }]} dark />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#EC743C]">
                {`Product Catalogue · ${PRODUCTS.length} Documented Series`}
              </p>
              <SplitText
                text="Bulk ferro alloys by family & grade."
                as="h1"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#F3F0E9]"
              />
            </div>
            <p className="lg:col-span-4 text-sm text-[#A1A7AB] leading-relaxed">
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

        <aside className="mt-14 bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mb-2">
              Sizing, Packaging & Custom Chemistry
            </h2>
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
              Across all four alloy families, lump sizing and domestic or export packaging are supplied according to customer furnace and ladle specifications. Contact the commercial desk for batch-specific sieve analysis and packing schedules.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mb-2">
              Specification Record Attribution
            </h2>
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
              Numeric tables transcribe published company website records verbatim, preserving min/max qualifiers and column structures. Final contractual sales specifications and mill test certificates are issued per confirmed order.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
