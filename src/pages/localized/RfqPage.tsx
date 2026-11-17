import { useMemo } from 'react';
import { DICTIONARIES } from '../../i18n';
import type { LocaleCode } from '../../i18n/locales';
import { seoFor } from '../../seo/registry';
import { seoEnv, useSeo } from '../../seo/useSeo';
import { RfqFlow } from '../../rfq/RfqFlow';

export function RfqPage({ locale }: { locale: LocaleCode }) {
  const t = DICTIONARIES[locale];
  const entry = useMemo(() => seoFor('rfq', locale, seoEnv()), [locale]);
  useSeo(entry);
  return (
    <div className="mx-auto max-w-[760px] space-y-6 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{t.rfq.pageTitle}</h1>
        <p className="text-sm text-ink-2">{t.rfq.lead}</p>
        <p className="inline-block border border-accent-red/60 bg-accent-red-soft px-3 py-1.5 text-xs font-semibold text-ink">{t.rfq.disclosure}</p>
      </header>
      <RfqFlow lang={locale} />
    </div>
  );
}
