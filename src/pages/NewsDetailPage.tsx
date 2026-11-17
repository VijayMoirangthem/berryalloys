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
      <div className="bg-[#FFFFFF] dark:bg-[#07111F] py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            Record Not Found
          </p>
          <h1 className="font-display text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
            The requested news or article entry could not be found
          </h1>
          <div className="pt-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] transition-colors"
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
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC] py-12 lg:py-16">
      <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Breadcrumbs
          items={[
            { label: 'News & Media', to: '/news' },
            { label: item.title },
          ]}
        />

        <article className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-8 sm:p-12 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
            <span className="font-semibold text-brand dark:text-[#69C5F5]">{item.type}</span>
            <span aria-hidden="true">/</span>
            <time>{item.date}</time>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC] leading-none">
            {item.title}
          </h1>

          {heroVisual && (
            <div className="bg-[#FFFFFF] border border-[#10243A]/12 p-3 max-h-[360px] overflow-hidden flex items-center justify-center">
              <ResilientImage
                src={heroVisual.src}
                alt={heroVisual.alt}
                className="max-h-[330px] w-auto object-contain"
                containerClassName="flex justify-center"
              />
            </div>
          )}

          <p className="text-base sm:text-lg text-[#465C72] dark:text-[#F4F8FC]/85 leading-relaxed">
            {item.excerpt}
          </p>

          <div className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/12 dark:border-[#F4F8FC]/12 p-5 space-y-2 text-xs text-[#10243A] dark:text-[#F4F8FC]">
            <p className="font-semibold uppercase font-mono-tabular text-brand dark:text-[#69C5F5]">
              Archive Scope Note
            </p>
            <p className="leading-relaxed text-[#465C72] dark:text-[#B5C5D7]">
              {item.unverifiedScopeNote ??
                'This prototype preserves the verified date, headline, and summary from the company news index without inventing unverified article text. Consult the published company page for the full post.'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] hover:text-brand dark:hover:text-[#69C5F5]"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              All News & Articles
            </Link>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#004C73] transition-colors"
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
