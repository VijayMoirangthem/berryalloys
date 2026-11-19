import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { DICTIONARIES } from '../../i18n';
import { DEMO_PRODUCT_SLUG, INSIGHT_SLUGS, insightsHref, localePath, type LocaleCode } from '../../i18n/locales';
import { seoFor } from '../../seo/registry';
import { seoEnv, useSeo } from '../../seo/useSeo';
import { ClientLogoStrip } from '../../components/ClientLogoStrip';
import { useGuide } from '../../context/GuideContext';

export function BuyerLandingPage({ locale }: { locale: LocaleCode }) {
  const t = DICTIONARIES[locale];
  const entry = useMemo(() => seoFor('landing', locale, seoEnv()), [locale]);
  useSeo(entry);
  const { openGuide } = useGuide();

  return (
    <>
      <section className="border-b border-subtle bg-band">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="space-y-6 lg:col-span-7">
            <p className="text-sm font-semibold text-brand">{t.landing.eyebrow}</p>
            <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">{t.landing.h1}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-ink-2">{t.landing.lead}</p>
            <div className="flex flex-wrap gap-3">
              <Link to={localePath(locale, '/rfq')} className="inline-flex min-h-[48px] items-center gap-2 bg-brand px-6 text-sm font-semibold text-on-brand hover:bg-brand-hover transition-colors">
                {t.landing.ctaRfq}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
              <Link to={localePath(locale, `/products/${DEMO_PRODUCT_SLUG}`)} className="inline-flex min-h-[48px] items-center gap-2 border border-control bg-card px-6 text-sm font-semibold text-ink hover:border-brand transition-colors">
                {t.landing.ctaProduct}
              </Link>
              <button type="button" onClick={() => openGuide()} className="inline-flex min-h-[48px] items-center gap-2 px-3 text-sm font-semibold text-brand hover:underline cursor-pointer">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t.landing.ctaCompass}
              </button>
            </div>
            <p className="text-xs text-ink-muted">{t.landing.demoLangNote}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="border border-subtle bg-card p-6 sm:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-subtle pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                    {t.product.eyebrow}
                  </p>
                  <p className="mt-1 font-display text-4xl font-bold tracking-tight text-ink" dir="ltr">
                    FeMn · SiMn · FeCr · FeSi
                  </p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-ink-muted">{t.product.keyFactLabels.mn}</dt>
                  <dd className="mt-1 text-base font-bold text-ink" dir="ltr">70–78% Mn</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t.product.keyFactLabels.c}</dt>
                  <dd className="mt-1 text-base font-bold text-ink" dir="ltr">6.0–8.0% C</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t.product.keyFactLabels.p}</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink" dir="ltr">0.15–0.35% max</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{t.product.keyFactLabels.s}</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink" dir="ltr">0.03–0.05% max</dd>
                </div>
              </dl>
              <p className="border-t border-subtle pt-4 text-xs text-ink-2">
                {t.product.imageAlt}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <ul className="grid gap-4 md:grid-cols-3">
          {t.landing.points.map((p) => (
            <li key={p.title} className="border border-subtle bg-card p-5">
              <h2 className="text-lg font-bold text-ink">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-subtle bg-band">
        <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-bold text-ink">{t.landing.journeyTitle}</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {t.landing.journey.map((s, i) => (
              <li key={s.title} className="flex gap-4 border border-subtle bg-card p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand text-sm font-bold text-on-brand" dir="ltr">{i + 1}</span>
                <span>
                  <span className="block font-semibold text-ink">{s.title}</span>
                  <span className="mt-1 block text-sm text-ink-2">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] space-y-3 px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-ink">{t.landing.exportTitle}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-2">{t.landing.exportText}</p>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-6">
        <ClientLogoStrip title={t.landing.logosTitle} note={t.landing.logosNote} />
      </div>

      <section className="border-t border-subtle bg-band">
        <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-ink">{t.landing.insightsTitle}</h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-2">{t.landing.insightsLead}</p>
            </div>
            <Link to={insightsHref(locale)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              {t.nav.insights}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {INSIGHT_SLUGS.map((s) => (
              <li key={s} className="border border-subtle bg-card p-4">
                <p className="font-semibold text-ink">{t.insights.items[s].title}</p>
                <p className="mt-1 text-sm text-ink-2">{t.insights.items[s].summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
