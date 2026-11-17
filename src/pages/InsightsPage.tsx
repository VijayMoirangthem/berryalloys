import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { INSIGHT_SLUGS, localePath, type InsightSlug } from '../i18n/locales';
import { en } from '../i18n/dictionaries/en';
import { INSIGHT_ARTICLES } from '../data/insights';
import { getProductBySlug } from '../data/products';
import { seoFor } from '../seo/registry';
import { seoEnv, useSeo } from '../seo/useSeo';
import { NotFoundPage } from './NotFoundPage';

/** English knowledge-centre index (/insights). */
export function InsightsPage() {
  const entry = useMemo(() => seoFor('insights', 'en', seoEnv()), []);
  useSeo(entry);
  return (
    <div className="mx-auto max-w-[900px] space-y-8 px-4 py-12 sm:px-6">
      <header className="space-y-2">
        <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand">Knowledge centre</p>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-ink sm:text-5xl">Buyer guides</h1>
        <p className="text-sm text-ink-2">Practical guides for procurement teams on quotation requests, chemistry specifications and delivery requirements. These are demonstration drafts pending review by Berry Alloys.</p>
      </header>
      <ul className="space-y-4">
        {INSIGHT_SLUGS.map((s) => {
          const a = INSIGHT_ARTICLES[s];
          const it = en.insights.items[s];
          return (
            <li key={s} className="border border-subtle bg-card p-5">
              <h2 className="text-xl font-bold text-ink">
                <Link to={`/insights/${s}`} className="hover:text-brand">{it.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-ink-2">{it.summary}</p>
              <p className="mt-3 flex items-center gap-3 text-[11px] text-ink-muted">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" />{a.readMinutes} min read</span>
                <span>{a.status}</span>
              </p>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-ink-2">
        Also available in:{' '}
        {(['ja', 'ko', 'de', 'ar'] as const).map((l, i) => (
          <span key={l}>
            {i > 0 && ' · '}
            <Link to={localePath(l, '/insights')} hrefLang={l} lang={l} className="font-semibold text-brand hover:underline">
              {{ ja: '日本語', ko: '한국어', de: 'Deutsch', ar: 'العربية' }[l]}
            </Link>
          </span>
        ))}{' '}
        (titles and summaries only).
      </p>
    </div>
  );
}

/** English article (/insights/:slug). */
export function InsightArticlePage() {
  const { slug } = useParams();
  const article = INSIGHT_ARTICLES[slug as InsightSlug];
  const entry = useMemo(() => (article ? seoFor('article', 'en', seoEnv(), article.slug) : seoFor('notfound', 'en', seoEnv())), [article]);
  useSeo(entry);
  if (!article) return <NotFoundPage />;
  const item = en.insights.items[article.slug];
  return (
    <article className="mx-auto max-w-[800px] space-y-8 px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-2">
        <Link to="/" className="hover:text-brand">Home</Link> / <Link to="/insights" className="hover:text-brand">Guides</Link>
      </nav>
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">{item.title}</h1>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-muted">
          <time dateTime={article.date}>Drafted {article.date}</time>
          <span>{article.readMinutes} min read</span>
        </p>
        <p className="border-s-4 border-accent-red bg-accent-red-soft p-3 text-xs font-semibold text-ink">{article.status}</p>
        <p className="text-base leading-relaxed text-ink-2">{article.intro}</p>
      </header>

      {article.sections.map((s) => (
        <section key={s.heading} className="space-y-3">
          <h2 className="text-2xl font-bold text-ink">{s.heading}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p} className="text-sm leading-relaxed text-ink-2">{p}</p>
          ))}
          {s.bullets && (
            <ul className="list-disc space-y-1.5 ps-5 text-sm text-ink-2">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {s.example && <pre className="whitespace-pre-wrap border border-subtle bg-band p-4 text-xs leading-relaxed text-ink font-mono-tabular">{s.example}</pre>}
        </section>
      ))}

      <section className="space-y-3 border border-subtle bg-card p-5">
        <h2 className="text-xl font-bold text-ink">What Berry’s teams confirm</h2>
        <ul className="list-disc space-y-1 ps-5 text-sm text-ink-2">
          {article.confirm.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="text-xs text-ink-muted">Please include your requirements. Berry’s sales team will confirm commercial terms.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-ink">Related products</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {article.productSlugs.map((ps) => {
            const p = getProductBySlug(ps);
            return p ? (
              <li key={ps}>
                <Link to={`/products/${ps}`} className="flex items-center justify-between border border-subtle bg-card px-4 py-3 text-sm font-semibold text-ink hover:border-brand">
                  {p.name}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      <Link to="/en/rfq" className="inline-flex min-h-[48px] items-center gap-2 bg-brand px-6 text-sm font-semibold text-on-brand hover:bg-brand-hover">
        Prepare an RFQ
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
