import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, FileWarning } from 'lucide-react';
import { ASSETS, VisualAsset } from '../data/assets';
import { AlloyFamily, getProductBySlug, PRODUCTS } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';
import { IndustrialButton } from '../components/ui/IndustrialButton';

const FAMILY_SYMBOL_MAP: Record<AlloyFamily, { symbol: string; atomicNote: string; asset: VisualAsset }> = {
  'Ferro Manganese': {
    symbol: 'FeMn',
    atomicNote: 'Mn-Fe · Deoxidiser & Desulphuriser',
    asset: ASSETS.detailAlloyFeMn,
  },
  'Silico Manganese': {
    symbol: 'SiMn',
    atomicNote: 'Mn-Si-Fe · Dual Deoxidiser',
    asset: ASSETS.detailAlloySiMn,
  },
  'Ferro Chrome': {
    symbol: 'FeCr',
    atomicNote: 'Cr-Fe · Stainless & Alloy Refining',
    asset: ASSETS.detailAlloyFeCr,
  },
  'Ferro Silicon': {
    symbol: 'FeSi',
    atomicNote: 'Si-Fe · High-Purity Deoxidiser',
    asset: ASSETS.detailAlloyFeSi,
  },
};

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="bg-[#FFFFFF] dark:bg-[#07111F] py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            Product Not Found
          </p>
          <h1 className="font-display text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
            The requested ferro alloy grade could not be found
          </h1>
          <p className="text-sm text-[#465C72] dark:text-[#B5C5D7]">
            Browse the complete catalogue to inspect Ferro Manganese, Silico Manganese, Ferro Chrome, and Ferro Silicon specifications.
          </p>
          <div className="pt-4">
            <IndustrialButton to="/products" variant="secondary">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Products
            </IndustrialButton>
          </div>
        </div>
      </div>
    );
  }

  const familyMeta = FAMILY_SYMBOL_MAP[product.family];
  const relatedProducts = PRODUCTS.filter(
    (p) => p.slug !== product.slug && (p.family === product.family || p.carbonTier === product.carbonTier)
  ).slice(0, 3);

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      {/* Dark Technical Product Header */}
      <header className="bg-[#10243A] text-[#F4F8FC] py-12 lg:py-16 border-b border-[#F4F8FC]/12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            dark
            items={[
              { label: 'Products', to: '/products' },
              { label: product.family, to: `/products?family=${encodeURIComponent(product.family)}` },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#B5C5D7]">
                <span className="text-[#69C5F5]">{product.family}</span>
                <span aria-hidden="true">·</span>
                <span>{product.carbonTier}</span>
                {product.lowPhosphorusOption && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Low Phosphorus Option</span>
                  </>
                )}
              </div>

              <h1 className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#F4F8FC]">
                {product.name}
              </h1>

              <p className="text-base sm:text-lg text-[#F4F8FC]/82 leading-relaxed max-w-2xl">
                {product.summary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <IndustrialButton
                  to={`/contact?tab=quote&product=${product.slug}`}
                  variant="primary"
                >
                  Request Quotation ({product.shortName})
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </IndustrialButton>
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 text-xs font-semibold border border-[#F4F8FC]/25 text-[#F4F8FC] hover:bg-[#F4F8FC] hover:text-[#10243A] transition-colors whitespace-nowrap"
                >
                  Company Source Page
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="bg-[#07111F] border border-[#F4F8FC]/16 overflow-hidden">
                <div className="aspect-[16/10] bg-[#040B14] overflow-hidden border-b border-[#F4F8FC]/12">
                  <ResilientImage
                    src={familyMeta.asset.src}
                    alt={familyMeta.asset.alt}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                </div>
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F4F8FC]/12">
                    <div>
                      <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                        {familyMeta.atomicNote}
                      </p>
                      <p className="font-display text-4xl font-bold uppercase tracking-tight text-[#F4F8FC] mt-0.5">
                        {familyMeta.symbol}
                      </p>
                    </div>
                    <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#B5C5D7] border border-[#F4F8FC]/20 px-2.5 py-1">
                      {product.shortName}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-5 gap-y-3.5 text-xs">
                    <div>
                      <dt className="font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                        {product.comparison.primaryElementLabel}
                      </dt>
                      <dd className="font-mono-tabular text-base font-semibold text-[#F4F8FC] mt-0.5">
                        {product.comparison.primaryElementRange}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                        Carbon Range
                      </dt>
                      <dd className="font-mono-tabular text-base font-semibold text-[#F4F8FC] mt-0.5">
                        {product.comparison.carbonRange}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                        Phosphorus
                      </dt>
                      <dd className="font-mono-tabular text-sm text-[#F4F8FC] mt-0.5">
                        {product.comparison.phosphorusRange}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                        Sulfur
                      </dt>
                      <dd className="font-mono-tabular text-sm text-[#F4F8FC] mt-0.5">
                        {product.comparison.sulfurRange}
                      </dd>
                    </div>
                  </dl>

                  <figcaption className="pt-3 border-t border-[#F4F8FC]/12 text-[11px] text-[#B5C5D7]">
                    {familyMeta.asset.caption} · {product.tables.length} chemistry {product.tables.length === 1 ? 'table' : 'tables'} below.
                  </figcaption>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </header>

      {/* Anchored Section Sub-Nav */}
      <nav
        aria-label="Product specification sections"
        className="md:sticky md:top-16 z-30 bg-[#F1F6FB]/95 dark:bg-[#0D1B2E]/95 backdrop-blur-xs border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 overflow-x-auto">
          <div className="flex items-center gap-6">
            <a
              href="#specifications"
              className="min-h-[44px] flex items-center text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] hover:text-brand dark:hover:text-[#69C5F5] whitespace-nowrap"
            >
              01. Chemistry Tables
            </a>
            <a
              href="#process"
              className="min-h-[44px] flex items-center text-xs font-medium text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] whitespace-nowrap"
            >
              02. Process & Documents
            </a>
            <a
              href="#applications"
              className="min-h-[44px] flex items-center text-xs font-medium text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] whitespace-nowrap"
            >
              03. Applications & Benefits
            </a>
          </div>
          <Link
            to={`/contact?tab=quote&product=${product.slug}`}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
          >
            Quote {product.shortName} →
          </Link>
        </div>
      </nav>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {/* 01. Specification Tables */}
        <section id="specifications" aria-labelledby="spec-tables-heading" className="scroll-mt-32 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5] mb-2">
                01 / Chemical Composition Records
              </p>
              <h2
                id="spec-tables-heading"
                className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              >
                Grade Chemistry Specifications
              </h2>
            </div>
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] max-w-md">
              Website specification records (not certified sales sheets). All percentages, ranges, and min/max qualifiers are preserved verbatim from company source tables.
            </p>
          </div>

          <div className="space-y-8">
            {product.tables.map((table) => (
              <div key={table.title} className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 overflow-hidden">
                <div className="px-5 py-4 bg-[#F1F6FB]/75 dark:bg-[#0D1B2E] border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {table.title}
                  </h3>
                  <span className="text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                    Size & Packing: Per customer requirement
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[580px]">
                    <thead>
                      <tr className="border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14 bg-[#FFFFFF]/70 dark:bg-[#07111F]">
                        {table.columns.map((col) => (
                          <th
                            key={col.key}
                            scope="col"
                            className="py-3 px-4 text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] whitespace-nowrap"
                          >
                            {col.label}{' '}
                            <span className="font-normal text-[#465C72] dark:text-[#B5C5D7]">
                              {col.qualifier}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#10243A]/10 dark:divide-[#F4F8FC]/10 text-xs">
                      {table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-[#FFFFFF]/70 dark:hover:bg-[#0D1B2E]">
                          {table.columns.map((col, colIdx) => (
                            <td
                              key={col.key}
                              className={`py-3 px-4 whitespace-nowrap ${
                                colIdx <= 1
                                  ? 'font-semibold text-[#10243A] dark:text-[#F4F8FC]'
                                  : 'font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]'
                              }`}
                            >
                              {row[col.key] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {table.sourceNote && (
                  <div className="px-5 py-3 bg-[#FFFFFF] dark:bg-[#0D1B2E] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 text-xs text-[#465C72] dark:text-[#B5C5D7]">
                    Note: {table.sourceNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 02 & 03. Process, Applications, Benefits & Document Status */}
        <section
          id="process"
          className="scroll-mt-32 pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              02 / Production & Analysis
            </p>
            <h2 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Smelting & Documentation
            </h2>
            <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              {product.productionProcess}
            </p>

            <div className="pt-4">
              <div className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-5 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[#10243A] dark:text-[#F4F8FC]">
                  <FileWarning className="w-4 h-4 text-brand dark:text-[#69C5F5] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-relaxed">
                    Downloadable brochures and mill Certificates of Analysis are not attached in this prototype archive. Request official documents via quotation.
                  </p>
                </div>
                <Link
                  to={`/contact?tab=quote&product=${product.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                >
                  Request Official Data Sheet & Quote
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div id="applications" className="lg:col-span-4 space-y-4 scroll-mt-32">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              03 / Steelmaking Uses
            </p>
            <h2 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Applications
            </h2>
            <ul className="divide-y divide-[#10243A]/10 dark:divide-[#F4F8FC]/10 border-t border-b border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-sm text-[#465C72] dark:text-[#B5C5D7]">
              {product.applications.map((app) => (
                <li key={app} className="py-3 leading-relaxed">
                  {app}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              04 / Metallurgy
            </p>
            <h2 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Documented Benefits
            </h2>
            <ul className="divide-y divide-[#10243A]/10 dark:divide-[#F4F8FC]/10 border-t border-b border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-sm text-[#465C72] dark:text-[#B5C5D7]">
              {product.supportedBenefits.map((benefit) => (
                <li key={benefit} className="py-3 leading-relaxed">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section aria-labelledby="related-heading" className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 id="related-heading" className="font-display text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Related Ferro Alloys
              </h2>
              <Link to="/products" className="text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline">
                All Products →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <article
                  key={rel.slug}
                  className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6 flex flex-col justify-between hover:border-[#10243A]/40 dark:hover:border-[#69C5F5]/60 transition-colors"
                >
                  <div>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] mb-2">
                      {rel.family} · {rel.carbonTier}
                    </p>
                    <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mb-2">
                      <Link to={`/products/${rel.slug}`} className="hover:text-brand dark:hover:text-[#69C5F5] transition-colors">
                        {rel.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] font-mono-tabular">
                      {rel.comparison.primaryElementLabel}: {rel.comparison.primaryElementRange}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 flex items-center justify-between">
                    <Link
                      to={`/products/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] hover:text-brand dark:hover:text-[#69C5F5]"
                    >
                      View Grades
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      to={`/contact?tab=quote&product=${rel.slug}`}
                      className="text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                    >
                      Quote
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
