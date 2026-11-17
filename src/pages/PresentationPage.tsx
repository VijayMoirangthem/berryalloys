import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { seoFor } from '../seo/registry';
import { seoEnv, useSeo } from '../seo/useSeo';
import { ThemeToggle } from '../components/ThemeToggle';
import { MISSING_LOGO_ASSETS } from '../data/logos';

/**
 * Proposal display for the presentation only. Not linked from the public site, noindex, never in a sitemap.
 * This is a proposal view, not a secure portal: it contains no confidential material, and no invented metrics.
 */
type Status = 'Implemented' | 'Implemented (demo only)' | 'Draft';

const FEATURES: Array<{ name: string; status: Status; note: string }> = [
  { name: 'Language-aware routes /en /ja /ko /de /ar', status: 'Implemented', note: 'URL is the source of truth; selector links to real URLs; back/forward and refresh work.' },
  { name: 'Localised buyer landing and product page', status: 'Draft', note: 'High Carbon Ferro Manganese in five languages; chemistry values and units stay in shared data.' },
  { name: 'Multilingual Berry Compass RFQ co-pilot', status: 'Implemented (demo only)', note: 'Prepared answers and an eight-step editable RFQ. No model connected; nothing is sent.' },
  { name: 'RFQ summary: copy, download, carry into quotation form', status: 'Implemented (demo only)', note: 'English labels for sales review; buyer notes kept as typed.' },
  { name: 'Client logos from the company website', status: 'Implemented', note: 'Seven logos with a typed manifest; featured is not endorsed.' },
  { name: 'Knowledge centre: three guides', status: 'Draft', note: 'Demonstration drafts; no author or approval is implied.' },
  { name: 'SEO registry, hreflang, JSON-LD, static HTML for selected routes', status: 'Implemented', note: 'Preview stays noindex; machine-draft translations are never indexable.' },
];

const LIMITS = [
  'Translations are machine drafts and need native technical review before publication.',
  'The assistant uses prepared answers and keyword matching per language. It is not an AI model and does not understand arbitrary questions.',
  'Enquiries are not transmitted. There is no email, CRM or ticketing integration.',
  'Only one product has a localised page. Other pages link to English with an explicit “Available in English” label.',
  'Static HTML is generated at build time for selected routes; the page is not fully server-rendered or hydrated.',
  'Export countries shown are those named in published sources (13 of around 35); the full list needs the company’s approval.',
];

const STAGES = [
  { title: 'Server-side model access', text: 'A backend endpoint calls the model; no keys in the browser.' },
  { title: 'Approved multilingual knowledge', text: 'Retrieval over reviewed product and FAQ content, per language.' },
  { title: 'Secure enquiry routing', text: 'Email or CRM delivery with validation, consent and audit trail.' },
  { title: 'Safeguards', text: 'Rate limiting, abuse handling, privacy controls and retention rules.' },
  { title: 'Monitoring and escalation', text: 'Review of conversations, failure handling and handoff to a person.' },
];

const ROADMAP = [
  'Baseline audit, market prioritisation and migration planning.',
  'Native-reviewed launch for two priority languages.',
  'Technical knowledge content and a production assistant pilot.',
  'Expand the strongest language and content cluster, with relevant outreach.',
  'Improve RFQ completion, weak pages and assistant responses.',
  'Review qualified enquiries and sales outcomes; agree next-quarter priorities.',
];

const MEASURES = [
  'Search clicks and impressions by country and page',
  'Branded versus non-branded discovery',
  'RFQ starts and completions',
  'Sales-qualified enquiries',
  'Technical crawl and performance issues',
  'Attributed pipeline (where reliable CRM data exists)',
];

export function PresentationPage() {
  const entry = useMemo(() => seoFor('presentation', 'en', seoEnv()), []);
  useSeo(entry);
  const tag = (s: Status) =>
    s === 'Draft' ? 'border-warning text-warning' : s === 'Implemented' ? 'border-success text-success' : 'border-brand text-brand';
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-subtle bg-band">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand">Presentation view · not for public distribution</p>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">International buyer discovery: demonstration and plan</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] space-y-12 px-4 py-10 sm:px-6">
        <section className="space-y-3" aria-labelledby="demo">
          <h2 id="demo" className="text-2xl font-bold">Open the demonstration</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {[['/ja/', '日本語 buyer page'], ['/ja/products/high-carbon-ferro-manganese', 'Japanese product page'], ['/ja/rfq', 'Japanese RFQ'], ['/ar/', 'Arabic (RTL) buyer page'], ['/en/', 'English buyer page'], ['/insights', 'Knowledge centre']].map(([to, label]) => (
              <li key={to}><Link to={to} className="block border border-subtle bg-card px-4 py-3 font-semibold hover:border-brand">{label} <span className="text-ink-muted font-normal" dir="ltr">{to}</span></Link></li>
            ))}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="features">
          <h2 id="features" className="text-2xl font-bold">What is built</h2>
          <p className="text-sm text-ink-2">Status reflects what exists in this frontend demonstration. “Draft” means the content needs native or specialist review.</p>
          <ul className="divide-y divide-subtle border border-subtle bg-card">
            {FEATURES.map((f) => (
              <li key={f.name} className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{f.name}</p>
                  <p className="mt-0.5 text-sm text-ink-2">{f.note}</p>
                </div>
                <span className={`shrink-0 border px-2 py-1 text-[11px] font-semibold ${tag(f.status)}`}>{f.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3" aria-labelledby="limits">
          <h2 id="limits" className="text-2xl font-bold">Demonstration limitations</h2>
          <ul className="list-disc space-y-1.5 ps-5 text-sm text-ink-2">
            {LIMITS.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <p className="text-sm text-ink-2">Logo assets still needed: {MISSING_LOGO_ASSETS.join('; ')}.</p>
        </section>

        <section className="space-y-4" aria-labelledby="stages">
          <h2 id="stages" className="text-2xl font-bold">Production integration stages</h2>
          <ol className="grid gap-3 md:grid-cols-2">
            {STAGES.map((s, i) => (
              <li key={s.title} className="flex gap-3 border border-subtle bg-card p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-brand text-sm font-bold text-on-brand">{i + 1}</span>
                <span><span className="block font-semibold">{s.title}</span><span className="text-sm text-ink-2">{s.text}</span></span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-ink-muted">AI here is an implementation and assistance capability. An assistant does not by itself improve search ranking.</p>
        </section>

        <section className="space-y-4" aria-labelledby="roadmap">
          <h2 id="roadmap" className="text-2xl font-bold">Six-month roadmap</h2>
          <ol className="space-y-2">
            {ROADMAP.map((r, i) => (
              <li key={r} className="flex items-start gap-3 border border-subtle bg-card p-3 text-sm">
                <span className="mt-0.5 inline-flex h-6 min-w-[3.5rem] items-center justify-center bg-band px-2 text-[11px] font-semibold text-ink-2">Month {i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4" aria-labelledby="measures">
          <h2 id="measures" className="text-2xl font-bold">How progress will be measured</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {MEASURES.map((m) => (
              <li key={m} className="flex items-center justify-between gap-3 border border-subtle bg-card p-3 text-sm">
                <span>{m}</span>
                <span className="shrink-0 border border-subtle bg-band px-2 py-1 text-[11px] font-semibold text-ink-muted">Not connected</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-muted">No traffic, ranking, lead or revenue figures are shown because none have been measured yet.</p>
        </section>
      </main>
    </div>
  );
}
