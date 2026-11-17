import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { INSIGHT_SLUGS, LOCALES, LOCALE_META, localePath } from '../i18n/locales';
import { en } from '../i18n/dictionaries/en';

/** Homepage preview of the knowledge centre, plus an entry point to the localised buyer pages. */
export function InsightsPreview() {
  return (
    <section aria-labelledby="insights-preview-heading" className="border-t border-subtle bg-band py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand">Knowledge centre</p>
            <h2 id="insights-preview-heading" className="font-display fluid-section-title font-bold uppercase tracking-tight text-ink">
              Buyer guides for ferro alloy procurement
            </h2>
            <p className="text-sm text-ink-2">Practical guides on quotation requests, chemistry specifications and delivery requirements. Demonstration drafts pending review.</p>
          </div>
          <Link to="/insights" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
            All guides
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {INSIGHT_SLUGS.map((s) => (
            <li key={s}>
              <Link to={`/insights/${s}`} className="block h-full border border-subtle bg-card p-5 hover:border-brand transition-colors">
                <p className="font-semibold text-ink">{en.insights.items[s].title}</p>
                <p className="mt-2 text-sm text-ink-2">{en.insights.items[s].summary}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-ink-2">
          International buyers can prepare an enquiry in their own language:{' '}
          {LOCALES.map((l, i) => (
            <span key={l}>
              {i > 0 && ' · '}
              <Link to={localePath(l)} hrefLang={LOCALE_META[l].htmlLang} lang={LOCALE_META[l].htmlLang} className="font-semibold text-brand hover:underline">
                {LOCALE_META[l].native}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
