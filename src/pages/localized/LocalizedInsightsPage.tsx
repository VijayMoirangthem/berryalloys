import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DICTIONARIES } from '../../i18n';
import { INSIGHT_SLUGS, type LocaleCode } from '../../i18n/locales';
import { seoFor } from '../../seo/registry';
import { seoEnv, useSeo } from '../../seo/useSeo';

/**
 * Translated titles and summaries only. The full guides are English, so every link says so and carries lang="en" / hreflang="en";
 * no English body text is served under a translated URL.
 */
export function LocalizedInsightsPage({ locale }: { locale: LocaleCode }) {
  const t = DICTIONARIES[locale];
  const entry = useMemo(() => seoFor('insights', locale, seoEnv()), [locale]);
  useSeo(entry);
  return (
    <div className="mx-auto max-w-[900px] space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{t.insights.title}</h1>
        <p className="text-sm text-ink-2">{t.insights.lead}</p>
      </header>
      <ul className="space-y-4">
        {INSIGHT_SLUGS.map((s) => (
          <li key={s} className="border border-subtle bg-card p-5">
            <h2 className="text-xl font-bold text-ink">{t.insights.items[s].title}</h2>
            <p className="mt-2 text-sm text-ink-2">{t.insights.items[s].summary}</p>
            <Link to={`/insights/${s}`} hrefLang="en" lang="en" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
              {t.insights.readInEnglish} <span lang={locale} className="text-ink-muted">({t.common.availableInEnglish})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
