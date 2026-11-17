import { DICTIONARIES } from '../i18n';
import type { LocaleCode } from '../i18n/locales';

/**
 * Response-provider boundary for Berry Compass.
 *
 * Today the only implementation is `preparedProvider`: it matches typed text against explicit, per-language aliases and
 * returns the ID of a PREPARED reply. Nothing is generated and no model is called.
 *
 * Production would replace this with a server-side provider (see docs/international-rfq-handoff.md): approved multilingual
 * knowledge retrieval, a model behind your own API (no keys in the browser), rate limiting, abuse handling, privacy
 * controls and human escalation. The interface below is the seam; UI and RFQ state do not change.
 */
export type ReplyKey = 'grades' | 'minmax' | 'exports' | 'pricing' | 'include' | 'rfqIntro' | 'fallback' | 'greeting' | 'welcome';
export type IntentKey = 'grades' | 'minmax' | 'exports' | 'pricing' | 'include' | 'rfq' | 'greeting';

export interface ProviderResult {
  reply: ReplyKey;
  /** True when the visitor asked to start the RFQ journey. */
  startRfq?: boolean;
}

export interface ResponseProvider {
  respond(input: { text: string; lang: LocaleCode }): ProviderResult;
}

/** Aliases are matched as substrings of the normalised text — safe for CJK and Arabic, which have no word spaces. */
export function normalise(text: string): string {
  return text.toLowerCase().normalize('NFKC').replace(/\s+/g, ' ').trim();
}

export const preparedProvider: ResponseProvider = {
  respond({ text, lang }) {
    const q = normalise(text);
    const aliases = DICTIONARIES[lang].compass.aliases;
    const english = DICTIONARIES.en.compass.aliases;
    let best: { key: IntentKey; score: number } | null = null;
    // Language-specific aliases first; English aliases are also accepted as a convenience for technical terms.
    for (const set of lang === 'en' ? [aliases] : [aliases, english]) {
      for (const key of Object.keys(set) as IntentKey[]) {
        const hits = set[key].filter((a) => a && q.includes(normalise(a)));
        if (!hits.length) continue;
        const score = hits.reduce((n, a) => n + a.length, 0);
        if (!best || score > best.score) best = { key, score };
      }
    }
    if (!best) return { reply: 'fallback' };
    if (best.key === 'rfq') return { reply: 'rfqIntro', startRfq: true };
    return { reply: best.key };
  },
};

export const STARTER_KEYS = ['rfq', 'grades', 'minmax', 'exports', 'pricing'] as const;
export type StarterKey = (typeof STARTER_KEYS)[number];

export function starterToResult(key: StarterKey): ProviderResult {
  return key === 'rfq' ? { reply: 'rfqIntro', startRfq: true } : { reply: key };
}
