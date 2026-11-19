import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, GitCompare, Search, X } from 'lucide-react';
import {
  ALLOY_FAMILIES,
  AlloyFamily,
  AlloyProduct,
  PRODUCTS,
} from '../data/products';
import { CompareModal } from './CompareModal';

const FAMILY_PLATE_META: Record<
  AlloyFamily,
  { symbol: string; atomic: string; route: string }
> = {
  'Ferro Manganese': { symbol: 'FeMn', atomic: 'Mn 25', route: 'SAF / AOD' },
  'Silico Manganese': { symbol: 'SiMn', atomic: 'Si 14 · Mn 25', route: 'SAF Reduction' },
  'Ferro Chrome': { symbol: 'FeCr', atomic: 'Cr 24', route: 'Silicothermic' },
  'Ferro Silicon': { symbol: 'FeSi', atomic: 'Si 14', route: 'SAF Reduction' },
};

interface AlloyExplorerProps {
  initialFamily?: AlloyFamily | 'All';
}

export function AlloyExplorer({ initialFamily = 'All' }: AlloyExplorerProps) {
  const [selectedFamily, setSelectedFamily] = useState<AlloyFamily | 'All'>(initialFamily);
  const [lowPhosOnly, setLowPhosOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareSlugs, setCompareSlugs] = useState<string[]>([
    'high-carbon-ferro-manganese',
    'low-ultra-low-carbon-ferro-manganese',
  ]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedFamily(initialFamily);
  }, [initialFamily]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      if (selectedFamily !== 'All' && product.family !== selectedFamily) return false;
      if (lowPhosOnly && !product.lowPhosphorusOption) return false;
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.family.toLowerCase().includes(q) ||
        product.summary.toLowerCase().includes(q) ||
        product.applications.some((a) => a.toLowerCase().includes(q)) ||
        product.tables.some((t) =>
          t.rows.some((r) => Object.values(r).some((v) => v.toLowerCase().includes(q)))
        )
      );
    });
  }, [selectedFamily, lowPhosOnly, searchQuery]);

  const comparedProducts = useMemo(
    () =>
      compareSlugs
        .map((slug) => PRODUCTS.find((p) => p.slug === slug))
        .filter((p): p is AlloyProduct => Boolean(p)),
    [compareSlugs]
  );

  const toggleCompare = (slug: string) => {
    setLimitMessage(null);
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 3) {
        setLimitMessage('Up to 3 alloys can be compared simultaneously. Remove one to add another.');
        return prev;
      }
      return [...prev, slug];
    });
  };

  return (
    <div className="space-y-8">
      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
        <div
          role="tablist"
          aria-label="Filter alloys by family"
          className="flex flex-wrap items-center gap-1.5"
        >
          {(['All', ...ALLOY_FAMILIES] as const).map((family) => {
            const active = selectedFamily === family;
            return (
              <button
                key={family}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedFamily(family)}
                className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC]'
                    : 'bg-[#F1F6FB] text-[#465C72] hover:bg-[#D4DFEB] hover:text-[#10243A] dark:bg-[#12243B] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC]'
                }`}
              >
                {family}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            aria-pressed={lowPhosOnly}
            onClick={() => setLowPhosOnly((v) => !v)}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left sm:text-center ${
              lowPhosOnly
                ? 'border-brand bg-brand/12 text-brand dark:border-[#69C5F5] dark:bg-[#69C5F5]/14 dark:text-[#69C5F5]'
                : 'border-[#10243A]/20 bg-transparent text-[#465C72] hover:border-[#10243A] dark:border-[#F4F8FC]/20 dark:text-[#B5C5D7] dark:hover:border-[#69C5F5]'
            }`}
          >
            Low Phosphorus Options
          </button>

          <div className="relative min-w-[240px]">
            <label htmlFor="catalogue-search-input" className="sr-only">
              Search grades, chemistry, or applications
            </label>
            <Search
              className="w-4 h-4 text-[#465C72] dark:text-[#B5C5D7] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalogue-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grade, Mn %, Si %, 304L..."
              className="w-full min-h-[40px] pl-9 pr-3 py-2 text-xs bg-white border border-[#10243A]/20 text-[#10243A] placeholder:text-[#465C72]/70 focus:border-brand focus:outline-none dark:bg-[#12243B] dark:border-[#F4F8FC]/20 dark:text-[#F4F8FC] dark:placeholder:text-[#B5C5D7]/70 dark:focus:border-[#69C5F5]"
            />
          </div>
        </div>
      </div>

      {/* Comparison Tray */}
      <div className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC]">
            <GitCompare className="w-4 h-4 text-brand dark:text-[#69C5F5]" aria-hidden="true" />
            <span>Side-by-Side Chemistry Comparison ({comparedProducts.length}/3 selected)</span>
          </div>
          {comparedProducts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {comparedProducts.map((item) => (
                <span
                  key={item.slug}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#FFFFFF] border border-[#10243A]/18 px-2.5 py-1 text-[#10243A] dark:bg-[#12243B] dark:border-[#F4F8FC]/18 dark:text-[#F4F8FC]"
                >
                  <span className="font-medium">{item.shortName}</span>
                  <button
                    type="button"
                    onClick={() => toggleCompare(item.slug)}
                    aria-label={`Remove ${item.name} from comparison`}
                    className="text-[#465C72] hover:text-[#10243A] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
              Select up to three alloys below to compare elemental ranges with preserved min/max qualifiers.
            </p>
          )}
          {limitMessage && (
            <p role="status" className="text-xs text-brand dark:text-[#69C5F5] font-medium pt-1">
              {limitMessage}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {comparedProducts.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setCompareSlugs([]);
                setLimitMessage(null);
              }}
              className="min-h-[40px] px-3 py-2 text-xs font-medium text-[#465C72] hover:text-[#10243A] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC] transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            disabled={comparedProducts.length < 2}
            onClick={() => setCompareModalOpen(true)}
            className="min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Compare Selected ({comparedProducts.length})
          </button>
        </div>
      </div>

      {/* Product Listing */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-12 text-center space-y-3">
          <p className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
            No matching alloy grades found
          </p>
          <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] max-w-md mx-auto">
            Adjust your alloy family filter, clear the low-phosphorus constraint, or search using another element symbol or grade number.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFamily('All');
              setLowPhosOnly(false);
              setSearchQuery('');
            }}
            className="mt-2 min-h-[44px] inline-flex items-center px-5 py-2.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((product) => {
            const isSelected = compareSlugs.includes(product.slug);
            const plate = FAMILY_PLATE_META[product.family];
            return (
              <article
                key={product.slug}
                className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 grid grid-cols-1 sm:grid-cols-12 overflow-hidden transition-colors hover:border-[#10243A]/40 dark:hover:border-[#69C5F5]/60"
              >
                <div className="sm:col-span-4 bg-[#10243A] text-[#F4F8FC] border-b sm:border-b-0 sm:border-r border-[#10243A]/10 relative min-h-[168px] p-5 flex flex-col justify-between overflow-hidden">
                  <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B]" />
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                    <span>{plate.atomic}</span>
                    <span>{plate.route}</span>
                  </div>
                  <div className="py-3">
                    <p className="font-display text-4xl sm:text-5xl font-bold leading-none text-[#F4F8FC]">
                      {plate.symbol}
                    </p>
                    <p className="text-[11px] font-mono-tabular text-[#B5C5D7] mt-1.5">
                      {product.shortName}
                    </p>
                  </div>
                  <p className="text-[10.5px] font-mono-tabular text-[#94A9BF] border-t border-[#F4F8FC]/14 pt-2">
                    {product.tables.length} spec table{product.tables.length === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="sm:col-span-8 p-6 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#465C72] dark:text-[#B5C5D7] mb-2">
                      <span>
                        {product.family} · {product.carbonTier}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(product.slug)}
                        aria-pressed={isSelected}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-[#10243A] text-[#FFFFFF] border-[#10243A] dark:bg-[#0A6AA1] dark:border-[#0A6AA1]'
                            : 'bg-transparent text-[#10243A] border-[#10243A]/25 hover:border-[#10243A] dark:text-[#F4F8FC] dark:border-[#F4F8FC]/25 dark:hover:border-[#69C5F5]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" aria-hidden="true" />}
                        {isSelected ? 'Selected' : 'Compare'}
                      </button>
                    </div>

                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC] leading-none mb-2.5">
                      <Link
                        to={`/products/${product.slug}`}
                        className="hover:text-brand dark:hover:text-[#69C5F5] transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed mb-4">
                      {product.summary}
                    </p>

                    <dl className="border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 pt-3 space-y-1.5 text-xs">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[#465C72] dark:text-[#B5C5D7]">
                          {product.comparison.primaryElementLabel}
                        </dt>
                        <dd className="font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                          {product.comparison.primaryElementRange}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[#465C72] dark:text-[#B5C5D7]">
                          {product.comparison.carbonLabel}
                        </dt>
                        <dd className="font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                          {product.comparison.carbonRange}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[#465C72] dark:text-[#B5C5D7]">
                          {product.comparison.phosphorusLabel}
                        </dt>
                        <dd className="font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                          {product.comparison.phosphorusRange}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="pt-4 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 flex items-center justify-between gap-3">
                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10243A] hover:text-brand dark:text-[#F4F8FC] dark:hover:text-[#69C5F5] transition-colors whitespace-nowrap"
                    >
                      Specifications
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      to={`/contact?tab=quote&product=${product.slug}`}
                      className="text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CompareModal
        open={compareModalOpen}
        products={comparedProducts}
        onClose={() => setCompareModalOpen(false)}
        onRemoveProduct={(slug) => toggleCompare(slug)}
      />
    </div>
  );
}
