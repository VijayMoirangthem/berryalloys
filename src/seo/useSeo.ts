import { useEffect } from 'react';
import { LOCALE_META } from '../i18n/locales';
import { abs, type SeoEntry, type SeoEnv } from './registry';

/** Public origin is environment-driven; in a preview it falls back to the page's own origin (never an unrelated live site). */
export function seoEnv(): SeoEnv {
  const e = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
  return {
    origin: e.VITE_PUBLIC_ORIGIN || (typeof window !== 'undefined' ? window.location.origin : ''),
    indexable: e.VITE_INDEXABLE === 'true',
  };
}

const MANAGED = 'data-seo-managed';

/** The site's own defaults, restored when a page that sets its own metadata unmounts (never the previous page's values). */
const DEFAULTS = {
  title: 'Berry Alloys Limited — From Heat to Precision',
  description: 'Berry Alloys Limited manufactures bulk Ferro Manganese, Silico Manganese, Ferro Chrome, and Ferro Silicon in India for domestic steelmakers and global export.',
  ogDescription: 'Bulk ferro alloys manufacturing from Vizianagaram and Dhalbhumgarh, dispatched via Visakhapatnam Harbour Port.',
};

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  el.setAttribute(MANAGED, '1');
}

/**
 * Applies a registry entry to <head>: title, description, canonical, hreflang, Open Graph, robots, JSON-LD, <html lang/dir>.
 * Client-side metadata is a progressive enhancement; crawlers receive the build-time static HTML for the selected routes.
 */
export function useSeo(entry: SeoEntry) {
  useEffect(() => {
    const env = seoEnv();
    const html = document.documentElement;

    document.title = entry.title;
    setMeta('name', 'description', entry.description);
    setMeta('name', 'robots', entry.indexable ? 'index, follow' : 'noindex, nofollow');
    setMeta('property', 'og:title', entry.title);
    setMeta('property', 'og:description', entry.description);
    setMeta('property', 'og:type', entry.ogType);
    setMeta('property', 'og:url', abs(env, entry.path));
    setMeta('property', 'og:locale', LOCALE_META[entry.locale].htmlLang);
    html.lang = LOCALE_META[entry.locale].htmlLang;
    html.dir = LOCALE_META[entry.locale].dir;

    // Build-time static HTML already carries this route's head tags. Replace them (rather than duplicating) so the
    // document always has exactly one canonical, one set of alternates and one set of JSON-LD blocks.
    document.head
      .querySelectorAll(`link[rel="canonical"]:not([${MANAGED}]), link[rel="alternate"][hreflang]:not([${MANAGED}]), script[type="application/ld+json"]:not([${MANAGED}])`)
      .forEach((n) => n.remove());

    const added: HTMLElement[] = [];
    const link = (rel: string, href: string, hreflang?: string) => {
      const l = document.createElement('link');
      l.rel = rel;
      l.href = href;
      if (hreflang) l.hreflang = hreflang;
      l.setAttribute(MANAGED, '1');
      document.head.appendChild(l);
      added.push(l);
    };
    // Self-referencing canonical for the page's own language.
    if (entry.kind !== 'notfound') link('canonical', abs(env, entry.path));
    // Reciprocal alternates exist only for genuinely equivalent pages (see registry).
    for (const a of entry.alternates) link('alternate', abs(env, a.path), a.hreflang);
    if (entry.xDefault && entry.alternates.length) link('alternate', abs(env, entry.xDefault), 'x-default');

    entry.jsonLd.forEach((obj, i) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = `seo-jsonld-${i}`;
      s.setAttribute(MANAGED, '1');
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
      added.push(s);
    });

    return () => {
      added.forEach((n) => n.remove());
      document.title = DEFAULTS.title;
      setMeta('name', 'description', DEFAULTS.description);
      setMeta('name', 'robots', env.indexable ? 'index, follow' : 'noindex, nofollow');
      setMeta('property', 'og:title', DEFAULTS.title);
      setMeta('property', 'og:description', DEFAULTS.ogDescription);
      setMeta('property', 'og:type', 'website');
      setMeta('property', 'og:url', abs(env, '/'));
      setMeta('property', 'og:locale', 'en');
      html.lang = 'en';
      html.dir = 'ltr';
    };
  }, [entry]);
}
