/**
 * Build-time static HTML for the selected multilingual and knowledge-centre routes.
 *
 * Runs after `vite build` (see the `build` script). For each route it writes dist/<route>/index.html: the app shell plus
 *  - the route's own <title>, description, canonical, hreflang, Open Graph, robots and JSON-LD in <head>;
 *  - semantic body content (headings, text, specification tables) inside #root.
 * React then renders over it on load. This is static generation of selected routes, NOT full server-side rendering or
 * hydration; interactive features (assistant, RFQ, canvases) are progressive enhancements added by the client.
 *
 * Environment:
 *   VITE_PUBLIC_ORIGIN   public origin for absolute canonical / hreflang / sitemap URLs (empty in previews)
 *   VITE_INDEXABLE=true  production only; otherwise every page is noindex and no sitemap is written
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DICTIONARIES } from '../src/i18n/index';
import { DEMO_PRODUCT_SLUG, INSIGHT_SLUGS, LOCALE_META, insightsHref, type InsightSlug } from '../src/i18n/locales';
import { INSIGHT_ARTICLES } from '../src/data/insights';
import { getProductBySlug } from '../src/data/products';
import { abs, sitemapEntries, staticRoutes, type SeoEntry, type SeoEnv } from '../src/seo/registry';

const DIST = join(process.cwd(), 'dist');
const env: SeoEnv = { origin: process.env.VITE_PUBLIC_ORIGIN ?? '', indexable: process.env.VITE_INDEXABLE === 'true' };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const qual = (r: string, q: { min: string; max: string }) => r.replace(/\bmin\b/gi, q.min).replace(/\bmax\b/gi, q.max);

function head(e: SeoEntry): string {
  const lines = [
    `<title>${esc(e.title)}</title>`,
    `<meta name="description" content="${esc(e.description)}" />`,
    `<meta name="robots" content="${e.indexable ? 'index, follow' : 'noindex, nofollow'}" />`,
    `<link rel="canonical" href="${esc(abs(env, e.path))}" />`,
    ...e.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(abs(env, a.path))}" />`),
    ...(e.xDefault && e.alternates.length ? [`<link rel="alternate" hreflang="x-default" href="${esc(abs(env, e.xDefault))}" />`] : []),
    `<meta property="og:title" content="${esc(e.title)}" />`,
    `<meta property="og:description" content="${esc(e.description)}" />`,
    `<meta property="og:type" content="${e.ogType}" />`,
    `<meta property="og:url" content="${esc(abs(env, e.path))}" />`,
    `<meta property="og:locale" content="${LOCALE_META[e.locale].htmlLang}" />`,
    ...e.jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
  ];
  return lines.join('\n    ');
}

function body(e: SeoEntry): string {
  const t = DICTIONARIES[e.locale];
  if (e.kind === 'landing') {
    return `<main><h1>${esc(t.landing.h1)}</h1><p>${esc(t.landing.lead)}</p>
<ul>${t.landing.points.map((p) => `<li><h2>${esc(p.title)}</h2><p>${esc(p.text)}</p></li>`).join('')}</ul>
<h2>${esc(t.landing.journeyTitle)}</h2><ol>${t.landing.journey.map((s) => `<li><strong>${esc(s.title)}</strong> ${esc(s.text)}</li>`).join('')}</ol>
<h2>${esc(t.landing.exportTitle)}</h2><p>${esc(t.landing.exportText)}</p>
<p>${esc(t.landing.demoLangNote)}</p></main>`;
  }
  if (e.kind === 'product') {
    const p = getProductBySlug(DEMO_PRODUCT_SLUG)!;
    const P = t.product;
    const tables = p.tables
      .map((tb) => {
        const head = tb.columns.map((c) => `<th scope="col">${esc(c.key === 'category' ? P.columns.variant : c.key === 'grade' ? P.columns.grade : c.label)} ${esc(c.qualifier.replace('(min)', `(${P.qualifier.min})`).replace('(max)', `(${P.qualifier.max})`))}</th>`).join('');
        const rows = tb.rows.map((r) => `<tr>${tb.columns.map((c) => `<td>${esc(c.key === 'category' ? (P.categories[r[c.key]] ?? r[c.key]) : r[c.key])}</td>`).join('')}</tr>`).join('');
        return `<h3>${esc(P.tableTitles[tb.title] ?? tb.title)}</h3><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
      })
      .join('');
    const c = p.comparison;
    return `<main><article><h1>${esc(P.name)}</h1><p>${esc(P.overview)}</p>
<h2>${esc(P.processTitle)}</h2><p>${esc(P.process)}</p>
<h2>${esc(P.applicationsTitle)}</h2><ul>${P.applications.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
<h2>${esc(P.benefitsTitle)}</h2><ul>${P.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
<h2>${esc(P.keyFactsTitle)}</h2><dl>${[['mn', c.primaryElementRange], ['si', c.siliconRange], ['c', c.carbonRange], ['p', c.phosphorusRange], ['s', c.sulfurRange]].map(([k, v]) => `<dt>${esc(P.keyFactLabels[k as keyof typeof P.keyFactLabels])}</dt><dd>${esc(qual(v, P.qualifier))}</dd>`).join('')}</dl>
<h2>${esc(P.specTitle)}</h2><p>${esc(P.specNote)}</p>${tables}
<p>${esc(t.rfq.commercial)}</p></article></main>`;
  }
  if (e.kind === 'rfq') return `<main><h1>${esc(t.rfq.pageTitle)}</h1><p>${esc(t.rfq.lead)}</p><p>${esc(t.rfq.disclosure)}</p></main>`;
  if (e.kind === 'insights') {
    return `<main><h1>${esc(t.insights.title)}</h1><p>${esc(t.insights.lead)}</p><ul>${INSIGHT_SLUGS.map((s) => `<li><h2>${esc(t.insights.items[s].title)}</h2><p>${esc(t.insights.items[s].summary)}</p><a href="/insights/${s}" hreflang="en" lang="en">${esc(t.insights.readInEnglish)}</a></li>`).join('')}</ul></main>`;
  }
  // article (English)
  const slug = e.path.split('/').pop() as InsightSlug;
  const a = INSIGHT_ARTICLES[slug];
  const item = DICTIONARIES.en.insights.items[slug];
  return `<main><article><h1>${esc(item.title)}</h1><p>${esc(a.status)}</p><p>${esc(a.intro)}</p>${a.sections
    .map((s) => `<section><h2>${esc(s.heading)}</h2>${(s.paragraphs ?? []).map((p) => `<p>${esc(p)}</p>`).join('')}${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${s.example ? `<pre>${esc(s.example)}</pre>` : ''}</section>`)
    .join('')}</article></main>`;
}

function render(template: string, e: SeoEntry): string {
  const meta = LOCALE_META[e.locale];
  let html = template
    .replace(/<html[^>]*>/i, `<html lang="${meta.htmlLang}" dir="${meta.dir}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^>]*>\s*/gi, '');
  html = html.replace('</head>', `    ${head(e)}\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root">${body(e)}</div>`);
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
const routes = staticRoutes(env);
let count = 0;
for (const e of routes) {
  const out = join(DIST, e.path.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(template, e));
  count += 1;
}
console.log(`prerender: wrote ${count} static route files (${env.indexable ? 'indexable production build' : 'preview build: noindex'})`);

// robots.txt and sitemap.xml
const eligible = sitemapEntries(env);
if (env.indexable && eligible.length) {
  const urls = eligible.map((e) => `  <url><loc>${esc(abs(env, e.path))}</loc>${e.alternates.length ? e.alternates.map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(abs(env, a.path))}"/>`).join('') : ''}</url>`);
  writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /presentation\nSitemap: ${abs(env, '/sitemap.xml')}\n`);
  console.log(`prerender: sitemap.xml with ${eligible.length} eligible routes (machine-draft translations excluded)`);
} else {
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nDisallow: /\n`);
  if (existsSync(join(DIST, 'sitemap.xml'))) console.log('prerender: stale sitemap present');
  console.log('prerender: preview build, robots.txt disallows all and no sitemap is written');
}
