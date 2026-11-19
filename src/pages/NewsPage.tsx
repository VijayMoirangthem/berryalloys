import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { NEWS_ITEMS, NewsItem } from '../data/communityNewsCareersDocs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SplitText } from '../components/motion/SplitText';

type NewsFilter = 'All' | NewsItem['type'];

export function NewsPage() {
  const [filter, setFilter] = useState<NewsFilter>('All');

  const filtered = NEWS_ITEMS.filter(
    (item) => filter === 'All' || item.type === filter
  );

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-[#F1F6FB]/55 dark:bg-[#0D1B2E]/70 p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <Breadcrumbs items={[{ label: 'News & Media' }]} />

            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Announcements & Technical Notes
            </p>
            <SplitText
              text="Company news, awards & steelmaking articles."
              as="h1"
              className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
            />
            <p className="text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              Dated announcements and educational metallurgical articles indexed from the Berry Alloys Limited website. Where only an announcement excerpt was archived in our source bundle, each detail view links directly to the published company portal.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
          <div
            role="tablist"
            aria-label="Filter news and articles"
            className="flex flex-wrap items-center gap-1.5"
          >
            {(['All', 'News', 'Article'] as const).map((type) => {
              const active = filter === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(type)}
                  className={`min-h-[40px] px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC]'
                      : 'bg-[#F1F6FB] text-[#465C72] hover:bg-[#D4DFEB] hover:text-[#10243A] dark:bg-[#12243B] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC]'
                  }`}
                >
                  {type === 'All' ? 'All Updates' : type === 'News' ? 'Company News' : 'Technical Articles'}
                </button>
              );
            })}
          </div>

          <a
            href="https://berryalloys.com/ferro-alloys-news/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1.5 pb-0.5 text-xs font-medium text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors duration-300 whitespace-nowrap"
          >
            <span>Company News Archive</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[1.5px] bg-brand dark:bg-[#69C5F5] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          </a>
        </div>

        {/* Editorial News Rows */}
        <div className="divide-y divide-[#10243A]/15 dark:divide-[#F4F8FC]/14 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
          {filtered.map((item) => (
            <article
              key={item.slug}
              className="py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline group"
            >
              <div className="lg:col-span-3 flex items-center gap-2.5 text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                <time>{item.date}</time>
                <span aria-hidden="true">/</span>
                <span className="font-semibold text-brand dark:text-[#69C5F5]">{item.type}</span>
              </div>

              <div className="lg:col-span-7 space-y-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC] group-hover:text-brand dark:group-hover:text-[#69C5F5] transition-colors">
                  <Link to={`/news/${item.slug}`}>{item.title}</Link>
                </h2>
                <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="lg:col-span-2 lg:text-right flex lg:flex-col lg:items-end justify-between gap-2">
                <Link
                  to={`/news/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] hover:text-brand dark:hover:text-[#69C5F5] whitespace-nowrap"
                >
                  Open Record
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] hover:underline underline-offset-4 transition-colors duration-300"
                >
                  <span>Source</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
