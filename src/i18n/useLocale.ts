import { useLocation } from 'react-router-dom';
import { getDictionary } from './index';
import { DEFAULT_LOCALE, LOCALE_META, parseLocalePath, type LocaleCode } from './locales';

/**
 * The URL is the source of truth for the website language.
 * `routeLocale` is null on the (English-only) legacy routes such as /about or /products/x.
 */
export function useLocale() {
  const { pathname } = useLocation();
  const { locale: routeLocale, rest } = parseLocalePath(pathname);
  const locale: LocaleCode = routeLocale ?? DEFAULT_LOCALE;
  return { locale, routeLocale, rest, pathname, t: getDictionary(locale), meta: LOCALE_META[locale] };
}
