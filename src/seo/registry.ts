import { DICTIONARIES } from '../i18n';
import { DEMO_PRODUCT_SLUG, INSIGHT_SLUGS, LOCALES, LOCALE_META, localePath, type InsightSlug, type LocaleCode } from '../i18n/locales';
import { getProductBySlug } from '../data/products';

/**
 * Route / locale SEO registry — the single source for titles, descriptions, canonicals, hreflang equivalents,
 * Open Graph fields, structured data and indexability. Used at runtime (useSeo) and at build time (scripts/prerender.ts).
 *
 * Rules encoded here:
 *  - hreflang lists ONLY genuinely equivalent, existing, translated pages (plus a self-reference and x-default -> /en/).
 *  - Each approved translation canonicalises to itself, never to English.
 *  - Language-only codes (en, ja, ko, de, ar). No invented country targeting.
 *  - Machine-draft translations are never indexable, whatever the environment says.
 *  - Structured data mirrors visible content and never fabricates prices, offers, ratings or reviews.
 */
export type SeoKind = 'landing' | 'product' | 'rfq' | 'insights' | 'article' | 'awards' | 'presentation' | 'notfound';

export interface SeoEntry {
  kind: SeoKind;
  locale: LocaleCode;
  path: string;
  title: string;
  description: string;
  alternates: Array<{ hreflang: string; path: string }>;
  xDefault?: string;
  indexable: boolean;
  reviewStatus: 'source' | 'machine-draft';
  ogType: 'website' | 'article';
  jsonLd: Array<Record<string, unknown>>;
}

export interface SeoEnv {
  /** Public origin, e.g. https://www.example.com. Empty = use the current origin (preview). */
  origin: string;
  /** Production flag. Anything other than 'true' keeps every page noindex. */
  indexable: boolean;
}

export const ARTICLE_DATE = '2026-11-17'; // demonstration draft date (truthful: the day these drafts were written)
const COMPANY_NAME = 'Berry Alloys Limited';

export const abs = (env: SeoEnv, path: string) => `${env.origin.replace(/\/$/, '')}${path}`;

/** In a production (indexable) build only reviewed translations are advertised as alternates; previews show the full structure. */
function eligible(env: SeoEnv): readonly LocaleCode[] {
  return env.indexable ? LOCALES.filter((l) => LOCALE_META[l].reviewStatus === 'source') : LOCALES;
}

function alternatesFor(env: SeoEnv, rest: string) {
  const locales = eligible(env);
  return {
    alternates: locales.length > 1 ? locales.map((l) => ({ hreflang: LOCALE_META[l].htmlLang, path: localePath(l, rest) })) : [],
    xDefault: localePath('en', rest),
  };
}

function breadcrumb(env: SeoEnv, items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(env, it.path) })),
  };
}

export function seoFor(kind: SeoKind, locale: LocaleCode, env: SeoEnv, slug?: string): SeoEntry {
  const t = DICTIONARIES[locale];
  const meta = LOCALE_META[locale];
  // Machine-draft translations are never indexable, whatever the environment says.
  const approved = meta.reviewStatus === 'source';
  const indexable = env.indexable && approved;
  const base = { locale, reviewStatus: meta.reviewStatus, indexable, ogType: 'website' as const };

  if (kind === 'landing') {
    const path = localePath(locale);
    return {
      ...base, kind, path, title: t.seo.landing.title, description: t.seo.landing.description, ...alternatesFor(env, ''),
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'Organization', name: COMPANY_NAME, url: abs(env, '/'), logo: abs(env, '/berry-mark.png'), description: 'Manufacturer of ferro manganese, silico manganese, ferro chrome and ferro silicon in India.' },
        breadcrumb(env, [{ name: t.common.breadcrumbHome, path }]),
      ],
    };
  }
  if (kind === 'product') {
    const p = getProductBySlug(slug ?? DEMO_PRODUCT_SLUG)!;
    const path = localePath(locale, `/products/${p.slug}`);
    return {
      ...base, kind, path, title: t.seo.product.title, description: t.seo.product.description, ...alternatesFor(env, `/products/${p.slug}`),
      jsonLd: [
        // Product without offers, prices, ratings or availability: none are published for this product.
        { '@context': 'https://schema.org', '@type': 'Product', name: t.product.name, description: t.product.overview, brand: { '@type': 'Brand', name: 'Berry Alloys' }, manufacturer: { '@type': 'Organization', name: COMPANY_NAME }, category: p.family },
        breadcrumb(env, [{ name: t.common.breadcrumbHome, path: localePath(locale) }, { name: t.product.name, path }]),
      ],
    };
  }
  if (kind === 'rfq') {
    const path = localePath(locale, '/rfq');
    return { ...base, kind, path, title: t.seo.rfq.title, description: t.seo.rfq.description, ...alternatesFor(env, '/rfq'), jsonLd: [breadcrumb(env, [{ name: t.common.breadcrumbHome, path: localePath(locale) }, { name: t.rfq.pageTitle, path }])] };
  }
  if (kind === 'insights') {
    // The English knowledge-centre index lives at /insights (the source page); other languages at /{lang}/insights.
    const insightsPath = (l: LocaleCode) => (l === 'en' ? '/insights' : localePath(l, '/insights'));
    const path = insightsPath(locale);
    return {
      ...base, kind, path, title: t.seo.insights.title, description: t.seo.insights.description,
      alternates: eligible(env).length > 1 ? eligible(env).map((l) => ({ hreflang: LOCALE_META[l].htmlLang, path: insightsPath(l) })) : [],
      xDefault: '/insights',
      jsonLd: [breadcrumb(env, [{ name: t.common.breadcrumbHome, path: localePath(locale) }, { name: t.insights.title, path }])],
    };
  }
  if (kind === 'article') {
    const item = DICTIONARIES.en.insights.items[(slug ?? INSIGHT_SLUGS[0]) as InsightSlug];
    const path = `/insights/${slug}`;
    return {
      kind, locale: 'en', reviewStatus: 'source', indexable: env.indexable, ogType: 'article', path,
      title: `${item.title} | Berry Alloys`, description: item.summary, alternates: [],
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'Article', headline: item.title, description: item.summary, datePublished: ARTICLE_DATE, inLanguage: 'en', author: { '@type': 'Organization', name: COMPANY_NAME }, publisher: { '@type': 'Organization', name: COMPANY_NAME }, mainEntityOfPage: abs(env, path) },
        breadcrumb(env, [{ name: 'Home', path: '/' }, { name: 'Insights', path: '/insights' }, { name: item.title, path }]),
      ],
    };
  }
  if (kind === 'awards') {
    const path = '/awards-achievements';
    return {
      kind,
      locale: 'en',
      reviewStatus: 'source',
      indexable: env.indexable,
      ogType: 'website',
      path,
      title: 'Awards & Achievements | Berry Alloys Limited',
      description:
        'Verified archive of Berry Alloys Limited’s published corporate, workplace, sustainability, leadership, and export recognitions alongside ISO management system credentials.',
      alternates: [],
      jsonLd: [
        breadcrumb(env, [
          { name: 'Home', path: '/' },
          { name: 'Awards & Achievements', path },
        ]),
      ],
    };
  }
  if (kind === 'notfound') {
    return { kind, locale: 'en', reviewStatus: 'source', indexable: false, ogType: 'website', path: '/', title: 'Page not found | Berry Alloys', description: 'The requested page does not exist.', alternates: [], jsonLd: [] };
  }
  // presentation: always noindex, never in sitemaps
  return { kind: 'presentation', locale: 'en', reviewStatus: 'source', indexable: false, ogType: 'website', path: '/presentation', title: 'Presentation view | Berry Alloys', description: 'Internal presentation view.', alternates: [], jsonLd: [] };
}

/** Every route that gets static HTML at build time. */
export function staticRoutes(env: SeoEnv): SeoEntry[] {
  const out: SeoEntry[] = [];
  for (const l of LOCALES) {
    out.push(seoFor('landing', l, env), seoFor('product', l, env, DEMO_PRODUCT_SLUG), seoFor('rfq', l, env), seoFor('insights', l, env));
  }
  for (const s of INSIGHT_SLUGS) out.push(seoFor('article', 'en', env, s));
  out.push(seoFor('awards', 'en', env));
  return out;
}

/** Sitemap: only approved, indexable routes. Preview / machine-draft routes never appear. */
export function sitemapEntries(env: SeoEnv): SeoEntry[] {
  return staticRoutes(env).filter((e) => e.indexable);
}
