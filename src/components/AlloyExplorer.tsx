import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, GitCompare, Search, X } from 'lucide-react';
import { ASSETS, VisualAsset } from '../data/assets';
import {
  ALLOY_FAMILIES,
  AlloyFamily,
  AlloyProduct,
  PRODUCTS,
} from '../data/products';
import { CompareModal } from './CompareModal';
import { ResilientImage } from './ResilientImage';

const FAMILY_IMAGE_MAP: Record<AlloyFamily, VisualAsset> = {
  'Ferro Manganese': ASSETS.officialProdFeMn,
  'Silico Manganese': ASSETS.officialProdSiMn,
  'Ferro Chrome': ASSETS.officialProdFeCr,
  'Ferro Silicon': ASSETS.officialProdFeSi,
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#141618]/15 dark:border-[#F3F0E9]/14">
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
                    ? 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
                    : 'bg-[#ECE8DF] text-[#4A5054] hover:bg-[#D8D1C3] hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
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
                ? 'border-[#9E4B28] bg-[#9E4B28]/12 text-[#9E4B28] dark:border-[#EC743C] dark:bg-[#EC743C]/14 dark:text-[#EC743C]'
                : 'border-[#141618]/20 bg-transparent text-[#4A5054] hover:border-[#141618] dark:border-[#F3F0E9]/20 dark:text-[#A1A7AB] dark:hover:border-[#EC743C]'
            }`}
          >
            Low Phosphorus Options
          </button>

          <div className="relative min-w-[240px]">
            <label htmlFor="catalogue-search-input" className="sr-only">
              Search grades, chemistry, or applications
            </label>
            <Search
              className="w-4 h-4 text-[#4A5054] dark:text-[#A1A7AB] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalogue-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grade, Mn %, Si %, 304L..."
              className="w-full min-h-[40px] pl-9 pr-3 py-2 text-xs bg-white border border-[#141618]/20 text-[#141618] placeholder:text-[#4A5054]/70 focus:border-[#9E4B28] focus:outline-none dark:bg-[#20242A] dark:border-[#F3F0E9]/20 dark:text-[#F3F0E9] dark:placeholder:text-[#A1A7AB]/70 dark:focus:border-[#EC743C]"
            />
          </div>
        </div>
      </div>

      {/* Comparison Tray */}
      <div className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#141618] dark:text-[#F3F0E9]">
            <GitCompare className="w-4 h-4 text-[#9E4B28] dark:text-[#EC743C]" aria-hidden="true" />
            <span>Side-by-Side Chemistry Comparison ({comparedProducts.length}/3 selected)</span>
          </div>
          {comparedProducts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {comparedProducts.map((item) => (
                <span
                  key={item.slug}
                  className="inline-flex items-center gap-1.5 text-xs bg-[#F6F4EF] border border-[#141618]/18 px-2.5 py-1 text-[#141618] dark:bg-[#20242A] dark:border-[#F3F0E9]/18 dark:text-[#F3F0E9]"
                >
                  <span className="font-medium">{item.shortName}</span>
                  <button
                    type="button"
                    onClick={() => toggleCompare(item.slug)}
                    aria-label={`Remove ${item.name} from comparison`}
                    className="text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
              Select up to three alloys below to compare elemental ranges with preserved min/max qualifiers.
            </p>
          )}
          {limitMessage && (
            <p role="status" className="text-xs text-[#9E4B28] dark:text-[#EC743C] font-medium pt-1">
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
              className="min-h-[40px] px-3 py-2 text-xs font-medium text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9] transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            disabled={comparedProducts.length < 2}
            onClick={() => setCompareModalOpen(true)}
            className="min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#EC743C] dark:hover:text-[#141618] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Compare Selected ({comparedProducts.length})
          </button>
        </div>
      </div>

      {/* Product Listing */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-12 text-center space-y-3">
          <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
            No matching alloy grades found
          </p>
          <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] max-w-md mx-auto">
            Adjust your alloy family filter, clear the low-phosphorus constraint, or search using another element symbol or grade number.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFamily('All');
              setLowPhosOnly(false);
              setSearchQuery('');
            }}
            className="mt-2 min-h-[44px] inline-flex items-center px-5 py-2.5 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((product) => {
            const isSelected = compareSlugs.includes(product.slug);
            const familyImage = FAMILY_IMAGE_MAP[product.family];
            return (
              <article
                key={product.slug}
                className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 grid grid-cols-1 sm:grid-cols-12 overflow-hidden transition-colors hover:border-[#141618]/40 dark:hover:border-[#EC743C]/60"
              >
                <div className="sm:col-span-5 bg-[#F6F4EF] border-b sm:border-b-0 sm:border-r border-[#141618]/10 relative min-h-[190px] p-3 flex items-center justify-center">
                  <ResilientImage
                    src={familyImage.src}
                    alt={`${product.name} — ${familyImage.alt}`}
                    className="w-full h-full object-contain"
                    containerClassName="w-full h-full max-h-[210px]"
                  />
                </div>

                <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#4A5054] dark:text-[#A1A7AB] mb-2">
                      <span>
                        {product.family} · {product.carbonTier}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(product.slug)}
                        aria-pressed={isSelected}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-[#141618] text-[#F6F4EF] border-[#141618] dark:bg-[#A95632] dark:border-[#A95632]'
                            : 'bg-transparent text-[#141618] border-[#141618]/25 hover:border-[#141618] dark:text-[#F3F0E9] dark:border-[#F3F0E9]/25 dark:hover:border-[#EC743C]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" aria-hidden="true" />}
                        {isSelected ? 'Selected' : 'Compare'}
                      </button>
                    </div>

                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] leading-none mb-2.5">
                      <Link
                        to={`/products/${product.slug}`}
                        className="hover:text-[#9E4B28] dark:hover:text-[#EC743C] transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed mb-4">
                      {product.summary}
                    </p>

                    <dl className="border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 pt-3 space-y-1.5 text-xs">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[#4A5054] dark:text-[#A1A7AB]">
                          {product.comparison.primaryElementLabel}
                        </dt>
                        <dd className="font-mono-tabular font-semibold text-[#141618] dark:text-[#F3F0E9]">
                          {product.comparison.primaryElementRange}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[#4A5054] dark:text-[#A1A7AB]">
                          {product.comparison.carbonLabel}
                        </dt>
                        <dd className="font-mono-tabular font-semibold text-[#141618] dark:text-[#F3F0E9]">
                          {product.comparison.carbonRange}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[#4A5054] dark:text-[#A1A7AB]">
                          {product.comparison.phosphorusLabel}
                        </dt>
                        <dd className="font-mono-tabular font-semibold text-[#141618] dark:text-[#F3F0E9]">
                          {product.comparison.phosphorusRange}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="pt-4 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 flex items-center justify-between gap-3">
                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9] dark:hover:text-[#EC743C] transition-colors whitespace-nowrap"
                    >
                      Specifications
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      to={`/contact?tab=quote&product=${product.slug}`}
                      className="text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline whitespace-nowrap"
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
