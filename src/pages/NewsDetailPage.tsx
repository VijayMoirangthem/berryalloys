import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { NEWS_ITEMS } from '../data/communityNewsCareersDocs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = NEWS_ITEMS.find((n) => n.slug === slug);

  if (!item) {
    return (
      <div className="bg-[#F6F4EF] dark:bg-[#121417] py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Record Not Found
          </p>
          <h1 className="font-display text-4xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
            The requested news or article entry could not be found
          </h1>
          <div className="pt-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to News & Media
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const heroVisual =
    item.slug === 'bobbili-growth-centre-project'
      ? ASSETS.newsBobbiliVisual
      : item.slug === 'et-edge-workplace-recognition-2026'
      ? ASSETS.awardEtEdge2026
      : undefined;

  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9] py-12 lg:py-16">
      <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Breadcrumbs
          items={[
            { label: 'News & Media', to: '/news' },
            { label: item.title },
          ]}
        />

        <article className="bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-8 sm:p-12 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
            <span className="font-semibold text-[#9E4B28] dark:text-[#EC743C]">{item.type}</span>
            <span aria-hidden="true">/</span>
            <time>{item.date}</time>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] leading-none">
            {item.title}
          </h1>

          {heroVisual && (
            <div className="bg-[#F6F4EF] border border-[#141618]/12 p-3 max-h-[360px] overflow-hidden flex items-center justify-center">
              <ResilientImage
                src={heroVisual.src}
                alt={heroVisual.alt}
                className="max-h-[330px] w-auto object-contain"
                containerClassName="flex justify-center"
              />
            </div>
          )}

          <p className="text-base sm:text-lg text-[#4A5054] dark:text-[#F3F0E9]/85 leading-relaxed">
            {item.excerpt}
          </p>

          <div className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/12 dark:border-[#F3F0E9]/12 p-5 space-y-2 text-xs text-[#141618] dark:text-[#F3F0E9]">
            <p className="font-semibold uppercase font-mono-tabular text-[#9E4B28] dark:text-[#EC743C]">
              Archive Scope Note
            </p>
            <p className="leading-relaxed text-[#4A5054] dark:text-[#A1A7AB]">
              {item.unverifiedScopeNote ??
                'This prototype preserves the verified date, headline, and summary from the company news index without inventing unverified article text. Consult the published company page for the full post.'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] hover:text-[#9E4B28] dark:hover:text-[#EC743C]"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              All News & Articles
            </Link>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#823B1D] transition-colors"
            >
              View Original Index on berryalloys.com
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
