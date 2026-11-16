import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, FileWarning } from 'lucide-react';
import { ASSETS, VisualAsset } from '../data/assets';
import { AlloyFamily, getProductBySlug, PRODUCTS } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';
import { IndustrialButton } from '../components/ui/IndustrialButton';

const FAMILY_IMAGE_MAP: Record<AlloyFamily, VisualAsset> = {
  'Ferro Manganese': ASSETS.officialProdFeMn,
  'Silico Manganese': ASSETS.officialProdSiMn,
  'Ferro Chrome': ASSETS.officialProdFeCr,
  'Ferro Silicon': ASSETS.officialProdFeSi,
};

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return (
      <div className="bg-[#F6F4EF] dark:bg-[#121417] py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Product Not Found
          </p>
          <h1 className="font-display text-4xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
            The requested ferro alloy grade could not be found
          </h1>
          <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB]">
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

  const familyImage = FAMILY_IMAGE_MAP[product.family];
  const relatedProducts = PRODUCTS.filter(
    (p) => p.slug !== product.slug && (p.family === product.family || p.carbonTier === product.carbonTier)
  ).slice(0, 3);

  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      {/* Dark Technical Product Header */}
      <header className="bg-[#141618] text-[#F3F0E9] py-12 lg:py-16 border-b border-[#F3F0E9]/12">
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
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#A1A7AB]">
                <span className="text-[#EC743C]">{product.family}</span>
                <span aria-hidden="true">·</span>
                <span>{product.carbonTier}</span>
                {product.lowPhosphorusOption && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Low Phosphorus Option</span>
                  </>
                )}
              </div>

              <h1 className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#F3F0E9]">
                {product.name}
              </h1>

              <p className="text-base sm:text-lg text-[#F3F0E9]/82 leading-relaxed max-w-2xl">
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
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 text-xs font-semibold border border-[#F3F0E9]/25 text-[#F3F0E9] hover:bg-[#F3F0E9] hover:text-[#141618] transition-colors whitespace-nowrap"
                >
                  Company Source Page
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="bg-[#191C20] border border-[#F3F0E9]/14 overflow-hidden">
                <div className="aspect-[4/3] bg-[#F6F4EF] p-4 overflow-hidden">
                  <ResilientImage
                    src={familyImage.src}
                    alt={`${product.name} — ${familyImage.alt}`}
                    className="w-full h-full object-contain"
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs text-[#A1A7AB] border-t border-[#F3F0E9]/10">
                  {familyImage.caption} · Sizing & packing per customer specification.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </header>

      {/* Anchored Section Sub-Nav */}
      <nav
        aria-label="Product specification sections"
        className="md:sticky md:top-16 z-30 bg-[#ECE8DF]/95 dark:bg-[#191C20]/95 backdrop-blur-xs border-b border-[#141618]/12 dark:border-[#F3F0E9]/12"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 overflow-x-auto">
          <div className="flex items-center gap-6">
            <a
              href="#specifications"
              className="min-h-[44px] flex items-center text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] hover:text-[#9E4B28] dark:hover:text-[#EC743C] whitespace-nowrap"
            >
              01. Chemistry Tables
            </a>
            <a
              href="#process"
              className="min-h-[44px] flex items-center text-xs font-medium text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] whitespace-nowrap"
            >
              02. Process & Documents
            </a>
            <a
              href="#applications"
              className="min-h-[44px] flex items-center text-xs font-medium text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] whitespace-nowrap"
            >
              03. Applications & Benefits
            </a>
          </div>
          <Link
            to={`/contact?tab=quote&product=${product.slug}`}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline whitespace-nowrap"
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
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C] mb-2">
                01 / Chemical Composition Records
              </p>
              <h2
                id="spec-tables-heading"
                className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
              >
                Grade Chemistry Specifications
              </h2>
            </div>
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] max-w-md">
              Website specification records (not certified sales sheets). All percentages, ranges, and min/max qualifiers are preserved verbatim from company source tables.
            </p>
          </div>

          <div className="space-y-8">
            {product.tables.map((table) => (
              <div key={table.title} className="bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 overflow-hidden">
                <div className="px-5 py-4 bg-[#ECE8DF]/75 dark:bg-[#191C20] border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {table.title}
                  </h3>
                  <span className="text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                    Size & Packing: Per customer requirement
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[580px]">
                    <thead>
                      <tr className="border-b border-[#141618]/15 dark:border-[#F3F0E9]/14 bg-[#F6F4EF]/70 dark:bg-[#121417]">
                        {table.columns.map((col) => (
                          <th
                            key={col.key}
                            scope="col"
                            className="py-3 px-4 text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] whitespace-nowrap"
                          >
                            {col.label}{' '}
                            <span className="font-normal text-[#4A5054] dark:text-[#A1A7AB]">
                              {col.qualifier}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141618]/10 dark:divide-[#F3F0E9]/10 text-xs">
                      {table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-[#F6F4EF]/70 dark:hover:bg-[#191C20]">
                          {table.columns.map((col, colIdx) => (
                            <td
                              key={col.key}
                              className={`py-3 px-4 whitespace-nowrap ${
                                colIdx <= 1
                                  ? 'font-semibold text-[#141618] dark:text-[#F3F0E9]'
                                  : 'font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]'
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
                  <div className="px-5 py-3 bg-[#F6F4EF] dark:bg-[#191C20] border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 text-xs text-[#4A5054] dark:text-[#A1A7AB]">
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
          className="scroll-mt-32 pt-12 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              02 / Production & Analysis
            </p>
            <h2 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              Smelting & Documentation
            </h2>
            <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
              {product.productionProcess}
            </p>

            <div className="pt-4">
              <div className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-5 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[#141618] dark:text-[#F3F0E9]">
                  <FileWarning className="w-4 h-4 text-[#9E4B28] dark:text-[#EC743C] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-relaxed">
                    Downloadable brochures and mill Certificates of Analysis are not attached in this prototype archive. Request official documents via quotation.
                  </p>
                </div>
                <Link
                  to={`/contact?tab=quote&product=${product.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline"
                >
                  Request Official Data Sheet & Quote
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div id="applications" className="lg:col-span-4 space-y-4 scroll-mt-32">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              03 / Steelmaking Uses
            </p>
            <h2 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              Applications
            </h2>
            <ul className="divide-y divide-[#141618]/10 dark:divide-[#F3F0E9]/10 border-t border-b border-[#141618]/10 dark:border-[#F3F0E9]/10 text-sm text-[#4A5054] dark:text-[#A1A7AB]">
              {product.applications.map((app) => (
                <li key={app} className="py-3 leading-relaxed">
                  {app}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              04 / Metallurgy
            </p>
            <h2 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              Documented Benefits
            </h2>
            <ul className="divide-y divide-[#141618]/10 dark:divide-[#F3F0E9]/10 border-t border-b border-[#141618]/10 dark:border-[#F3F0E9]/10 text-sm text-[#4A5054] dark:text-[#A1A7AB]">
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
          <section aria-labelledby="related-heading" className="pt-12 border-t border-[#141618]/15 dark:border-[#F3F0E9]/14">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 id="related-heading" className="font-display text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Related Ferro Alloys
              </h2>
              <Link to="/products" className="text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline">
                All Products →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <article
                  key={rel.slug}
                  className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-6 flex flex-col justify-between hover:border-[#141618]/40 dark:hover:border-[#EC743C]/60 transition-colors"
                >
                  <div>
                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mb-2">
                      {rel.family} · {rel.carbonTier}
                    </p>
                    <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mb-2">
                      <Link to={`/products/${rel.slug}`} className="hover:text-[#9E4B28] dark:hover:text-[#EC743C] transition-colors">
                        {rel.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] font-mono-tabular">
                      {rel.comparison.primaryElementLabel}: {rel.comparison.primaryElementRange}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 flex items-center justify-between">
                    <Link
                      to={`/products/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] hover:text-[#9E4B28] dark:hover:text-[#EC743C]"
                    >
                      View Grades
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      to={`/contact?tab=quote&product=${rel.slug}`}
                      className="text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline"
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
