import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { DICTIONARIES } from '../../i18n';
import { DEMO_PRODUCT_SLUG, localePath, type LocaleCode } from '../../i18n/locales';
import { seoFor } from '../../seo/registry';
import { seoEnv, useSeo } from '../../seo/useSeo';
import { getProductBySlug } from '../../data/products';
import { Ltr } from '../../components/localized/Ltr';
import { useGuide } from '../../context/GuideContext';
import { useRfq } from '../../rfq/RfqContext';

/** Replace the English min / max qualifiers inside a published range with the localised words (numbers stay untouched). */
function qualify(range: string, q: { min: string; max: string }): string {
  return range.replace(/\bmin\b/gi, q.min).replace(/\bmax\b/gi, q.max);
}

export function LocalizedProductPage({ locale }: { locale: LocaleCode }) {
  const t = DICTIONARIES[locale];
  const P = t.product;
  const product = getProductBySlug(DEMO_PRODUCT_SLUG)!;
  const entry = useMemo(() => seoFor('product', locale, seoEnv(), DEMO_PRODUCT_SLUG), [locale]);
  useSeo(entry);
  const { openGuide } = useGuide();
  const { patch, setStep } = useRfq();
  const navigate = useNavigate();
  const cmp = product.comparison;

  const facts: Array<{ key: keyof typeof P.keyFactLabels; value: string }> = [
    { key: 'mn', value: cmp.primaryElementRange },
    { key: 'si', value: cmp.siliconRange },
    { key: 'c', value: cmp.carbonRange },
    { key: 'p', value: cmp.phosphorusRange },
    { key: 's', value: cmp.sulfurRange },
    ...(cmp.traceElementRange ? [{ key: 'b' as const, value: cmp.traceElementRange }] : []),
  ];

  const startRfq = () => {
    patch({ family: product.family, productSlug: product.slug });
    setStep(1);
    navigate(localePath(locale, '/rfq'));
  };

  const qualLabel = (q: string) => {
    const k = q.replace(/[()]/g, '').trim().toLowerCase();
    if (k === 'min') return P.qualifier.min;
    if (k === 'max') return P.qualifier.max;
    if (k === 'ppm') return P.qualifier.ppm;
    if (k === 'series') return P.qualifier.series;
    if (k === 'nominal') return P.qualifier.nominal;
    return q;
  };
  const colLabel = (key: string, label: string) => (key === 'category' ? P.columns.variant : key === 'grade' ? P.columns.grade : label);

  return (
    <article className="mx-auto max-w-[1200px] space-y-10 px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-2">
        <Link to={localePath(locale)} className="inline-flex items-center gap-1 hover:text-brand">
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {P.back}
        </Link>
      </nav>

      <header className="grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <p className="text-sm font-semibold text-brand">{P.eyebrow} · <Ltr>{product.shortName}</Ltr></p>
          <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">{P.name}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-ink-2">{P.overview}</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={startRfq} className="inline-flex min-h-[48px] items-center bg-brand px-6 text-sm font-semibold text-on-brand hover:bg-brand-hover transition-colors cursor-pointer">
              {P.rfqCta}
            </button>
            <button type="button" onClick={() => openGuide()} className="inline-flex min-h-[48px] items-center gap-2 border border-control bg-card px-5 text-sm font-semibold text-ink hover:border-brand transition-colors cursor-pointer">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {P.askCompass}
            </button>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="border border-subtle bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-subtle pb-3">
              <span className="font-display text-4xl font-bold text-ink" dir="ltr">FeMn</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand" dir="ltr">
                {product.shortName}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-xs">
              {facts.slice(0, 4).map((f) => (
                <div key={f.key}>
                  <dt className="text-ink-muted">{P.keyFactLabels[f.key]}</dt>
                  <dd className="mt-0.5 text-sm font-bold text-ink">
                    <Ltr>{qualify(f.value, P.qualifier)}</Ltr>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-subtle pt-3 text-xs text-ink-2">{P.imageAlt}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-2" aria-labelledby="prod-process">
        <div className="space-y-3">
          <h2 id="prod-process" className="text-2xl font-bold text-ink">{P.processTitle}</h2>
          <p className="text-sm leading-relaxed text-ink-2">{P.process}</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-ink">{P.applicationsTitle}</h2>
          <ul className="list-disc space-y-1.5 ps-5 text-sm text-ink-2">
            {P.applications.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-ink">{P.benefitsTitle}</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {P.benefits.map((b) => (
            <li key={b} className="border border-subtle bg-card p-4 text-sm leading-relaxed text-ink-2">{b}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="prod-facts">
        <h2 id="prod-facts" className="text-2xl font-bold text-ink">{P.keyFactsTitle}</h2>
        <dl className="grid gap-px border border-subtle bg-subtle sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.key} className="bg-card p-4">
              <dt className="text-xs font-semibold text-ink-muted">{P.keyFactLabels[f.key]}</dt>
              <dd className="mt-1 text-lg font-bold text-ink"><Ltr>{qualify(f.value, P.qualifier)}</Ltr></dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-6" aria-labelledby="prod-spec">
        <div>
          <h2 id="prod-spec" className="text-2xl font-bold text-ink">{P.specTitle}</h2>
          <p className="mt-1 text-xs text-ink-muted">{P.specNote}</p>
        </div>
        {product.tables.map((table) => (
          <div key={table.title} className="space-y-2">
            <h3 className="text-lg font-semibold text-ink">{P.tableTitles[table.title] ?? table.title}</h3>
            <div className="overflow-x-auto border border-subtle" tabIndex={0} role="region" aria-label={P.tableTitles[table.title] ?? table.title}>
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead className="bg-band">
                  <tr>
                    {table.columns.map((c) => (
                      <th key={c.key} scope="col" className="border-b border-subtle px-3 py-2 text-start font-semibold text-ink">
                        <span>{colLabel(c.key, c.label)}</span>
                        <span className="ms-1 text-[11px] font-normal text-ink-muted">{qualLabel(c.qualifier)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className="odd:bg-card even:bg-band/60">
                      {table.columns.map((c) => (
                        <td key={c.key} className="border-b border-subtle px-3 py-2 text-ink">
                          {c.key === 'category' ? (P.categories[row[c.key]] ?? row[c.key]) : <Ltr>{row[c.key]}</Ltr>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      <p className="border-s-4 border-brand bg-brand-soft p-4 text-sm text-ink">{t.rfq.commercial}</p>

      <p className="text-sm">
        <Link to={`/products/${DEMO_PRODUCT_SLUG}`} hrefLang="en" lang="en" className="font-semibold text-brand hover:underline">
          {P.englishPage} — <span lang={locale}>{t.common.availableInEnglish}</span>
        </Link>
      </p>
    </article>
  );
}
