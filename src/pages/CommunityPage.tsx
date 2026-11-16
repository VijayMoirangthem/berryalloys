import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { CSR_STORIES } from '../data/communityNewsCareersDocs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { SplitText } from '../components/motion/SplitText';

const CSR_PHOTO_MAP: Record<string, { src: string; alt: string } | undefined> = {
  'school-infrastructure': ASSETS.csrSchool,
  'bobbili-civic-water': ASSETS.csrWater,
  'environment-gaushala-marathon': ASSETS.csrPlantation,
};

export function CommunityPage() {
  const [leadStory, ...otherStories] = CSR_STORIES;

  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-14">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Community & CSR' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Corporate Social Responsibility
          </p>
          <SplitText
            text="Health, education, water access & local stewardship."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
          />
          <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
            Berry Alloys Limited documents grassroots social responsibility initiatives around its Andhra Pradesh and Jharkhand operations—spanning employee family education, medical camps, clean drinking water, school infrastructure, elder care, and animal welfare.
          </p>
        </div>

        {/* Lead CSR Feature with Authentic Camp Photo */}
        <article className="bg-[#141618] text-[#F3F0E9] border border-[#141618] dark:border-[#F3F0E9]/14 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <div className="lg:col-span-5 aspect-video lg:aspect-auto min-h-[260px]">
            <ResilientImage
              src={ASSETS.csrMedicalCamp.src}
              alt={ASSETS.csrMedicalCamp.alt}
              containerClassName="w-full h-full"
            />
          </div>
          <div className="lg:col-span-7 p-8 sm:p-10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                <span className="text-[#EC743C]">01 · {leadStory.category}</span>
                <span className="text-[#A1A7AB]">{leadStory.dateOrLocation}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#F3F0E9]">
                {leadStory.title}
              </h2>
              <p className="text-base text-[#F3F0E9]/85 leading-relaxed">{leadStory.summary}</p>
            </div>
            <ul className="pt-4 border-t border-[#F3F0E9]/12 space-y-1.5 text-xs text-[#A1A7AB]">
              {leadStory.details.map((d) => (
                <li key={d}>— {d}</li>
              ))}
            </ul>
          </div>
        </article>

        {/* Documented CSR Stories Index */}
        <section aria-labelledby="csr-stories-heading" className="pt-4">
          <h2 id="csr-stories-heading" className="sr-only">
            Documented CSR Stories
          </h2>
          <div className="divide-y divide-[#141618]/15 dark:divide-[#F3F0E9]/14 border-t border-b border-[#141618]/15 dark:border-[#F3F0E9]/14">
            {otherStories.map((story, idx) => {
              const photo = CSR_PHOTO_MAP[story.id];
              return (
                <article
                  key={story.id}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  <div className="lg:col-span-3 space-y-2">
                    <p className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C] font-semibold">
                      0{idx + 2} · {story.category}
                    </p>
                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">{story.dateOrLocation}</p>
                    {photo && (
                      <div className="aspect-[16/10] bg-[#141618] border border-[#141618]/12 overflow-hidden mt-3">
                        <ResilientImage
                          src={photo.src}
                          alt={photo.alt}
                          containerClassName="w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-6 space-y-2">
                    <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                      {story.title}
                    </h3>
                    <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  <ul className="lg:col-span-3 space-y-1.5 text-xs text-[#4A5054] dark:text-[#A1A7AB]">
                    {story.details.map((detail) => (
                      <li key={detail} className="leading-relaxed">
                        — {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* Link to Statutory CSR Policy */}
        <aside className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/15 dark:border-[#F3F0E9]/14 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              CSR Policy, Committee Composition & Annual Project Schedules
            </h2>
            <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
              Statutory CSR records covering FY 2021–22 through FY 2025–26 are indexed in the Corporate Documents archive.
            </p>
          </div>
          <Link
            to="/documents"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#823B1D] transition-colors whitespace-nowrap shrink-0"
          >
            View CSR Documents
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
