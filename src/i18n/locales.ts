/**
 * Demonstration languages. These are NOT a claim that these are Berry Alloys' largest markets.
 * Language is deliberately separate from country: Arabic is a language used across many markets and a German-language
 * page does not imply German company operations.
 */
export const LOCALES = ['en', 'ja', 'ko', 'de', 'ar'] as const;
export type LocaleCode = (typeof LOCALES)[number];

export interface LocaleMeta {
  code: LocaleCode;
  /** The language's own name — shown in the selector. */
  native: string;
  english: string;
  dir: 'ltr' | 'rtl';
  /** BCP 47 tag used for lang attributes and hreflang. Language-only on purpose (no invented country targeting). */
  htmlLang: string;
  /** Internal review state. Generated translations require native technical review before production publication. */
  reviewStatus: 'source' | 'machine-draft';
}

export const LOCALE_META: Record<LocaleCode, LocaleMeta> = {
  en: { code: 'en', native: 'English', english: 'English', dir: 'ltr', htmlLang: 'en', reviewStatus: 'source' },
  ja: { code: 'ja', native: '日本語', english: 'Japanese', dir: 'ltr', htmlLang: 'ja', reviewStatus: 'machine-draft' },
  ko: { code: 'ko', native: '한국어', english: 'Korean', dir: 'ltr', htmlLang: 'ko', reviewStatus: 'machine-draft' },
  de: { code: 'de', native: 'Deutsch', english: 'German', dir: 'ltr', htmlLang: 'de', reviewStatus: 'machine-draft' },
  ar: { code: 'ar', native: 'العربية', english: 'Arabic', dir: 'rtl', htmlLang: 'ar', reviewStatus: 'machine-draft' },
};

export const DEFAULT_LOCALE: LocaleCode = 'en';

export function isLocale(value: string | undefined | null): value is LocaleCode {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** The one product with a full localised journey in this demonstration. */
export const DEMO_PRODUCT_SLUG = 'high-carbon-ferro-manganese';

export const INSIGHT_SLUGS = [
  'how-to-prepare-a-ferro-alloy-quotation-request',
  'how-to-read-alloy-chemistry-specifications',
  'how-to-describe-sizing-packaging-and-delivery',
] as const;
export type InsightSlug = (typeof INSIGHT_SLUGS)[number];

/** Split a pathname into its locale (if any) and the remainder, e.g. /ja/products/x -> { locale: 'ja', rest: '/products/x' }. */
export function parseLocalePath(pathname: string): { locale: LocaleCode | null; rest: string } {
  const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (m && isLocale(m[1])) return { locale: m[1], rest: m[2] && m[2] !== '/' ? m[2].replace(/\/$/, '') : '' };
  return { locale: null, rest: pathname };
}

export function localePath(locale: LocaleCode, rest = ''): string {
  return `/${locale}${rest}${rest ? '' : '/'}`;
}

/**
 * Where the equivalent of the current page lives in another language.
 * - localised landing / product / rfq / insights keep their equivalent;
 * - the legacy English product page for the demo product maps to the localised product page;
 * - everything else maps to that language's landing page (the English page stays reachable via "Available in English").
 */
export function equivalentPath(pathname: string, target: LocaleCode): string {
  const { locale, rest } = parseLocalePath(pathname);
  if (locale) {
    if (rest === '/insights') return target === 'en' ? '/insights' : localePath(target, '/insights');
    if (rest === '' || rest === '/rfq' || rest === `/products/${DEMO_PRODUCT_SLUG}`) return localePath(target, rest);
    return localePath(target);
  }
  if (pathname === `/products/${DEMO_PRODUCT_SLUG}`) return localePath(target, `/products/${DEMO_PRODUCT_SLUG}`);
  if (pathname === '/insights' || pathname.startsWith('/insights/')) return target === 'en' ? '/insights' : localePath(target, '/insights');
  if (pathname.startsWith('/contact')) return localePath(target, '/rfq');
  return localePath(target);
}

/** English knowledge-centre index lives at /insights; other languages at /{lang}/insights. */
export const insightsHref = (l: LocaleCode): string => (l === 'en' ? '/insights' : localePath(l, '/insights'));
