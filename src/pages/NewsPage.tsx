import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/assets';
import { NEWS_ITEMS, NewsItem } from '../data/communityNewsCareersDocs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SplitText } from '../components/motion/SplitText';
import { ImageTrail } from '../components/ui/ImageTrail';

type NewsFilter = 'All' | NewsItem['type'];

export function NewsPage() {
  const [filter, setFilter] = useState<NewsFilter>('All');

  const filtered = NEWS_ITEMS.filter(
    (item) => filter === 'All' || item.type === filter
  );

  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ImageTrail
          images={GALLERY_ITEMS.slice(0, 6).map((i) => ({ src: i.src, alt: i.alt }))}
          className="border border-[#141618]/12 dark:border-[#F3F0E9]/14 bg-[#ECE8DF]/55 dark:bg-[#191C20]/70 p-6 sm:p-10"
        >
          <div className="max-w-3xl space-y-4">
            <Breadcrumbs items={[{ label: 'News & Media' }]} />

            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Announcements & Technical Notes
            </p>
            <SplitText
              text="Company news, awards & steelmaking articles."
              as="h1"
              className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
            />
            <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
              Dated announcements and educational metallurgical articles indexed from the Berry Alloys Limited website. Where only an announcement excerpt was archived in our source bundle, each detail view links directly to the published company portal.
            </p>
          </div>
        </ImageTrail>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#141618]/15 dark:border-[#F3F0E9]/14">
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
                      ? 'bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9]'
                      : 'bg-[#ECE8DF] text-[#4A5054] hover:bg-[#D8D1C3] hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
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
            className="group relative inline-flex items-center gap-1.5 pb-0.5 text-xs font-medium text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors duration-300 whitespace-nowrap"
          >
            <span>Company News Archive</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#9E4B28] dark:bg-[#EC743C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
          </a>
        </div>

        {/* Editorial News Rows */}
        <div className="divide-y divide-[#141618]/15 dark:divide-[#F3F0E9]/14 border-b border-[#141618]/15 dark:border-[#F3F0E9]/14">
          {filtered.map((item) => (
            <article
              key={item.slug}
              className="py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline group"
            >
              <div className="lg:col-span-3 flex items-center gap-2.5 text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                <time>{item.date}</time>
                <span aria-hidden="true">/</span>
                <span className="font-semibold text-[#9E4B28] dark:text-[#EC743C]">{item.type}</span>
              </div>

              <div className="lg:col-span-7 space-y-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] group-hover:text-[#9E4B28] dark:group-hover:text-[#EC743C] transition-colors">
                  <Link to={`/news/${item.slug}`}>{item.title}</Link>
                </h2>
                <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="lg:col-span-2 lg:text-right flex lg:flex-col lg:items-end justify-between gap-2">
                <Link
                  to={`/news/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141618] dark:text-[#F3F0E9] hover:text-[#9E4B28] dark:hover:text-[#EC743C] whitespace-nowrap"
                >
                  Open Record
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] hover:underline underline-offset-4 transition-colors duration-300"
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
