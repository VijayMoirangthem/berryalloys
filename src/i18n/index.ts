import { en, type Dictionary } from './dictionaries/en';
import { ja } from './dictionaries/ja';
import { ko } from './dictionaries/ko';
import { de } from './dictionaries/de';
import { ar } from './dictionaries/ar';
import type { LocaleCode } from './locales';

export const DICTIONARIES: Record<LocaleCode, Dictionary> = { en, ja, ko, de, ar };
export { fmt } from './dictionaries/en';
export type { Dictionary };

export function getDictionary(locale: LocaleCode): Dictionary {
  return DICTIONARIES[locale] ?? en;
}

/** Localised country name from the platform's region data. Falls back to the ISO code. */
export function countryName(code: string, locale: LocaleCode): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Curated delivery-country list: the export markets named in published sources plus other common steel-producing regions. */
export const RFQ_COUNTRY_CODES = [
  'JP', 'KR', 'VN', 'TH', 'AU', 'AE', 'BD', 'LK', 'NG', 'ZA', 'NL', 'US', 'CA',
  'DE', 'IT', 'ES', 'FR', 'GB', 'TR', 'EG', 'SA', 'QA', 'OM', 'KW', 'ID', 'MY', 'TW', 'SG', 'PK', 'BR', 'MX',
] as const;
