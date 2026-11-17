# International buyer discovery and RFQ — handoff

Status: frontend demonstration. Nothing is sent, no model is connected, no analytics are wired. Translations are machine drafts.

## What exists

| Area | Where |
| --- | --- |
| Locales, URL helpers | `src/i18n/locales.ts` (`/en /ja /ko /de /ar`; the URL is the source of truth) |
| Typed dictionaries | `src/i18n/dictionaries/{en,ja,ko,de,ar}.ts` (shape is `Dictionary` from `en.ts`; a missing key is a type error) |
| Shared layout + selector | `src/components/localized/` |
| Localised pages | `src/pages/localized/` (landing, one product, RFQ, translated insights index) |
| RFQ model + flow | `src/rfq/` (`rfq.ts` model/validation/summary, `RfqContext.tsx`, `RfqFlow.tsx`) |
| Assistant | `src/assistant/` (`provider.ts` is the response-provider seam; `AssistantContext.tsx`; `LocalizedCompassBody.tsx`) |
| SEO registry + hook | `src/seo/registry.ts`, `src/seo/useSeo.ts` |
| Static HTML | `scripts/prerender.ts` (runs after `vite build`) |
| Logos | `src/data/logos.ts`, `src/components/ClientLogoStrip.tsx`, `public/logos/` |
| Knowledge centre | `src/data/insights.ts`, `src/pages/InsightsPage.tsx` (`/insights`, `/insights/:slug`) |
| Presentation view | `/presentation` (noindex, not linked, no confidential content) |

## Compatibility strategy for English URLs

All existing English routes are unchanged (`/`, `/products/...`, `/about`, `/contact`, `/faq`, ...). New routes only add `/{lang}/...` and `/insights`. `/en/` is the English buyer landing and is self-canonical. `/en/insights` redirects to `/insights`. No existing URL is removed, so no redirect map is needed yet; one must be reviewed before any future restructuring.

## Environment

| Variable | Effect |
| --- | --- |
| `VITE_PUBLIC_ORIGIN` | Public origin for absolute canonical, hreflang and sitemap URLs. Empty in previews (the page's own origin is used). |
| `VITE_INDEXABLE=true` | Production only. Anything else keeps every page `noindex` and writes `Disallow: /` and no sitemap. |

Even with `VITE_INDEXABLE=true`, machine-draft translations (`reviewStatus: 'machine-draft'`) stay `noindex`, are excluded from the sitemap, and are not advertised as hreflang alternates. Flip a locale to `'source'` in `LOCALE_META` only after native technical review.

## Translation and factual review dependencies

- Native technical review of every dictionary (metallurgical terms, procurement phrasing, Arabic RTL wording).
- Berry sales/technical sign-off on: the three guides (`src/data/insights.ts`), the "min / max" explanation, the sizing/packaging examples, and the export wording.
- Export countries: 13 named in published sources (company website, ICRA reports, shipment records) out of "around 35" per ICRA. The full list needs company approval.
- Client logos: sourced from the company website, not independently approved for international marketing. Obtain permission and high-resolution/vector originals.
- Membership (IMnI, IFAPA) and sponsorship logos are not included.

## Production integration (not built)

1. Server-side model access behind your own API. No keys in the browser.
2. Approved multilingual knowledge retrieval, per language, over reviewed content.
3. Secure enquiry delivery (email or CRM) with validation, consent and an audit trail.
4. Rate limiting and abuse handling.
5. Privacy controls and retention rules. The draft RFQ only persists structured fields in `sessionStorage`; notes, free text and contact details stay in memory.
6. Monitoring, failure handling and human escalation.

Replace `preparedProvider` in `src/assistant/provider.ts` with a server-backed implementation of `ResponseProvider`; UI and RFQ state do not change.

## SEO work remaining before launch

- Native-reviewed translations for two priority languages; switch their `reviewStatus` to `'source'`.
- Baseline audit and a reviewed redirect map for useful existing live URLs.
- Real HTTP status codes: a static host or server must return 404 for unknown routes (the SPA shows a not-found view with a 200). Configure the host, and serve `/{lang}/...` static files as written by `prerender.ts`.
- Server-side rendering or full pre-rendering of the remaining routes (only selected routes are static today; the page is not hydrated from the static HTML).
- Search Console / analytics setup, then measurement. No traffic, ranking or lead figures exist yet.
- Review structured data against visible content before launch (Organization, BreadcrumbList, Product without offers, Article).

## Known limitations

- One product (High Carbon Ferro Manganese) has a localised page. Other pages link to English.
- `/contact` (the existing quotation form) is English; the RFQ carries values into it.
- The legacy English `Berry Compass` engine remains on English pages; localised routes use the new body.
- The global search modal is English.
