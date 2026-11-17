import { PRODUCTS, getProductBySlug, type AlloyFamily } from '../data/products';
import { DICTIONARIES, countryName, type Dictionary } from '../i18n';
import { en } from '../i18n/dictionaries/en';
import { DEMO_PRODUCT_SLUG, LOCALE_META, type LocaleCode } from '../i18n/locales';

/**
 * RFQ model. Structured values are stored as stable IDs (never as translated labels) so a draft survives a language switch.
 * Size and packaging describe what the buyer WANTS; they never imply that Berry offers every option.
 */
export type SizingId = 'lumps' | 'fines' | 'custom' | 'guidance';
export type PackagingId = 'bulk' | 'bag50' | 'jumbo' | 'other' | 'discuss';
export type UnitId = 'mt' | 'mtMonth' | 'containers';
export type DeliveryId = 'd30' | 'd60' | 'd90' | 'flexible';

export const SIZING_IDS: SizingId[] = ['lumps', 'fines', 'custom', 'guidance'];
export const PACKAGING_IDS: PackagingId[] = ['bulk', 'bag50', 'jumbo', 'other', 'discuss'];
export const UNIT_IDS: UnitId[] = ['mt', 'mtMonth', 'containers'];
export const DELIVERY_IDS: DeliveryId[] = ['d30', 'd60', 'd90', 'flexible'];
export const FAMILY_ORDER: AlloyFamily[] = ['Ferro Manganese', 'Silico Manganese', 'Ferro Chrome', 'Ferro Silicon'];
export const RFQ_STEPS = 8;

export interface RfqDraft {
  family: AlloyFamily | '';
  productSlug: string;
  grade: string;
  sizing: SizingId | '';
  sizeNote: string;
  quantity: string;
  unit: UnitId;
  packaging: PackagingId | '';
  packagingOther: string;
  country: string; // ISO code, or 'OTHER'
  otherCountry: string;
  port: string;
  delivery: DeliveryId | '';
  notes: string;
}

export interface RfqContact {
  name: string;
  email: string;
  company: string;
}

export const EMPTY_DRAFT: RfqDraft = {
  family: '',
  productSlug: '',
  grade: '',
  sizing: '',
  sizeNote: '',
  quantity: '',
  unit: 'mt',
  packaging: '',
  packagingOther: '',
  country: '',
  otherCountry: '',
  port: '',
  delivery: '',
  notes: '',
};

/** Family names per language (alloy family names are not part of the long-form dictionaries). */
export const FAMILY_LABELS: Record<LocaleCode, Record<AlloyFamily, string>> = {
  en: { 'Ferro Manganese': 'Ferro Manganese', 'Silico Manganese': 'Silico Manganese', 'Ferro Chrome': 'Ferro Chrome', 'Ferro Silicon': 'Ferro Silicon' },
  ja: { 'Ferro Manganese': 'フェロマンガン', 'Silico Manganese': 'シリコマンガン', 'Ferro Chrome': 'フェロクロム', 'Ferro Silicon': 'フェロシリコン' },
  ko: { 'Ferro Manganese': '페로망간', 'Silico Manganese': '실리코망간', 'Ferro Chrome': '페로크롬', 'Ferro Silicon': '페로실리콘' },
  de: { 'Ferro Manganese': 'Ferromangan', 'Silico Manganese': 'Silicomangan', 'Ferro Chrome': 'Ferrochrom', 'Ferro Silicon': 'Ferrosilicium' },
  ar: { 'Ferro Manganese': 'فيرومنغنيز', 'Silico Manganese': 'سيليكومنغنيز', 'Ferro Chrome': 'فيروكروم', 'Ferro Silicon': 'فيروسيليكون' },
};

/** Product display name: localised for the demonstration product, English (from shared data) for the others. */
export function productName(slug: string, locale: LocaleCode): string {
  if (slug === DEMO_PRODUCT_SLUG) return DICTIONARIES[locale].product.name;
  return getProductBySlug(slug)?.name ?? slug;
}

export function productsForFamily(family: AlloyFamily | '') {
  return PRODUCTS.filter((p) => !family || p.family === family);
}

export function gradesForProduct(slug: string): string[] {
  const p = getProductBySlug(slug);
  if (!p) return [];
  const set = new Set<string>();
  for (const t of p.tables) for (const r of t.rows) if (r.grade) set.add(r.grade);
  return [...set];
}

/** Persist only structured, non-free-text fields. Notes, free-text and contact details stay in memory. */
export const PERSISTED_KEYS: Array<keyof RfqDraft> = ['family', 'productSlug', 'grade', 'sizing', 'quantity', 'unit', 'packaging', 'country', 'delivery'];

/* ----------------------------------------------------------------- validation */

export function validateStep(step: number, d: RfqDraft, t: Dictionary): string | null {
  const e = t.rfq.errors;
  switch (step) {
    case 0:
      return d.productSlug && getProductBySlug(d.productSlug) ? null : e.product;
    case 1:
      return d.sizing ? null : e.sizing;
    case 2: {
      if (!d.quantity.trim()) return e.quantity;
      const n = Number(d.quantity.replace(',', '.'));
      return Number.isFinite(n) && n > 0 ? null : e.quantityInvalid;
    }
    case 3:
      if (!d.packaging) return e.packaging;
      if (d.packaging === 'other' && !d.packagingOther.trim()) return e.packagingOther;
      return null;
    case 4:
      if (!d.country) return e.country;
      if (d.country === 'OTHER' && !d.otherCountry.trim()) return e.country;
      return null;
    case 5:
      return d.delivery ? null : e.delivery;
    default:
      return null;
  }
}

export function validateAll(d: RfqDraft, t: Dictionary): Array<{ step: number; message: string }> {
  const out: Array<{ step: number; message: string }> = [];
  for (let s = 0; s <= 5; s++) {
    const m = validateStep(s, d, t);
    if (m) out.push({ step: s, message: m });
  }
  return out;
}

export function validEmail(v: string): boolean {
  return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/* ----------------------------------------------------------------- summary */

export interface SummaryRow {
  key: string;
  step: number;
  labelEn: string;
  labelLocal: string;
  valueLocal: string;
  valueEn: string;
  /** Free text kept exactly as typed (never presented as translated). */
  original?: boolean;
}

function countryLabel(d: RfqDraft, locale: LocaleCode): { local: string; en: string } {
  if (d.country === 'OTHER') return { local: d.otherCountry.trim(), en: d.otherCountry.trim() };
  return { local: countryName(d.country, locale), en: countryName(d.country, 'en') };
}

export function buildSummaryRows(d: RfqDraft, locale: LocaleCode): SummaryRow[] {
  const L = DICTIONARIES[locale].rfq;
  const E = en.rfq;
  const none = L.notProvided;
  const noneEn = E.notProvided;
  const p = getProductBySlug(d.productSlug);
  const c = d.country ? countryLabel(d, locale) : { local: none, en: noneEn };
  const pack = d.packaging
    ? d.packaging === 'other'
      ? { local: `${L.packaging.other}: ${d.packagingOther.trim()}`, en: `${E.packaging.other}: ${d.packagingOther.trim()}` }
      : { local: L.packaging[d.packaging], en: E.packaging[d.packaging] }
    : { local: none, en: noneEn };
  return [
    {
      key: 'product', step: 0, labelEn: 'Product', labelLocal: L.productLabel,
      valueLocal: p ? `${productName(p.slug, locale)} (${p.shortName})${d.grade ? ` · ${d.grade}` : ''}` : none,
      valueEn: p ? `${p.name} (${p.shortName})${d.grade ? ` · grade ${d.grade}` : ''} [${p.slug}]` : noneEn,
    },
    {
      key: 'sizing', step: 1, labelEn: 'Size requirement (buyer preference)', labelLocal: L.stepTitles[1],
      valueLocal: `${d.sizing ? L.sizing[d.sizing] : none}${d.sizeNote.trim() ? ` — ${d.sizeNote.trim()}` : ''}`,
      valueEn: `${d.sizing ? E.sizing[d.sizing] : noneEn}${d.sizeNote.trim() ? ` — ${d.sizeNote.trim()} (original text)` : ''}`,
    },
    {
      key: 'quantity', step: 2, labelEn: 'Quantity', labelLocal: L.quantity,
      valueLocal: d.quantity ? `${d.quantity} ${L.units[d.unit]}` : none,
      valueEn: d.quantity ? `${d.quantity} ${E.units[d.unit]}` : noneEn,
    },
    { key: 'packaging', step: 3, labelEn: 'Packaging preference (buyer preference)', labelLocal: L.stepTitles[3], valueLocal: pack.local, valueEn: pack.en },
    {
      key: 'destination', step: 4, labelEn: 'Delivery country / port', labelLocal: L.country,
      valueLocal: `${c.local}${d.port.trim() ? ` · ${d.port.trim()}` : ''}`,
      valueEn: `${c.en}${d.port.trim() ? ` · ${d.port.trim()}` : ''}`,
    },
    {
      key: 'delivery', step: 5, labelEn: 'Requested delivery period', labelLocal: L.delivery,
      valueLocal: d.delivery ? L.deliveryOptions[d.delivery] : none,
      valueEn: d.delivery ? E.deliveryOptions[d.delivery] : noneEn,
    },
    {
      key: 'notes', step: 6, labelEn: 'Application / technical notes', labelLocal: L.notes,
      valueLocal: d.notes.trim() || none, valueEn: d.notes.trim() ? `${d.notes.trim()} (original text, not translated)` : noneEn,
      original: true,
    },
  ];
}

/** Plain-text summary for copy / download. English labels first (for sales review), then the buyer's language. */
export function buildSummaryText(d: RfqDraft, contact: RfqContact, locale: LocaleCode): string {
  const rows = buildSummaryRows(d, locale);
  const meta = LOCALE_META[locale];
  const L = DICTIONARIES[locale].rfq;
  const lines: string[] = [];
  lines.push('BERRY ALLOYS — RFQ SUMMARY (DEMONSTRATION DRAFT — NOT SENT)');
  lines.push(`Buyer language: ${meta.english} (${meta.code})`);
  lines.push('Commercial terms (price, MOQ, availability, lead time) are to be confirmed by Berry sales.');
  lines.push('Size and packaging are buyer preferences, not confirmation of availability.');
  lines.push('');
  lines.push('— For sales review (English labels) —');
  for (const r of rows) lines.push(`${r.labelEn}: ${r.valueEn}`);
  if (contact.name || contact.email || contact.company) {
    lines.push('');
    lines.push(`Contact: ${[contact.name, contact.company, contact.email].filter(Boolean).join(' · ')}`);
  }
  if (locale !== 'en') {
    lines.push('');
    lines.push(`— ${meta.native} —`);
    for (const r of rows) lines.push(`${r.labelLocal}: ${r.valueLocal}`);
  }
  lines.push('');
  lines.push(L.notSent);
  return lines.join('\n');
}

/** Values carried into the existing English quotation form. */
export function toEnquiryPrefill(d: RfqDraft, locale: LocaleCode) {
  const rows = buildSummaryRows(d, locale);
  const get = (k: string) => rows.find((r) => r.key === k)?.valueEn ?? '';
  return {
    productSlug: d.productSlug,
    gradeLabel: d.grade,
    sizingAndPacking: `Size: ${get('sizing')}; Packaging: ${get('packaging')}`,
    message: [
      `Quantity: ${get('quantity')}`,
      `Destination: ${get('destination')}`,
      `Requested delivery: ${get('delivery')}`,
      d.notes.trim() ? `Notes: ${d.notes.trim()} (original text)` : '',
      `Buyer language: ${LOCALE_META[locale].english}. Prepared with the Berry Compass demo; commercial terms to be confirmed by sales.`,
    ].filter(Boolean).join('\n'),
  };
}
