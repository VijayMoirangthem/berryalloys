import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { CSR_STORIES } from '../data/communityNewsCareersDocs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { SplitText } from '../components/motion/SplitText';

const CSR_PHOTO_MAP: Record<string, { src: string; alt: string } | undefined> = {
  'school-infrastructure': ASSETS.csrSchoolUpgrade2,
  'bobbili-civic-water': ASSETS.csrDrinkingWater2,
  'environment-gaushala-marathon': ASSETS.csrPlantationDrive2,
};

export function CommunityPage() {
  const [leadStory, ...otherStories] = CSR_STORIES;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-14">
        <div className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Community & CSR' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            Corporate Social Responsibility
          </p>
          <SplitText
            text="Health, education, water access & local stewardship."
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
          />
          <p className="text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
            Berry Alloys Limited documents grassroots social responsibility initiatives around its Andhra Pradesh and Jharkhand operations—spanning employee family education, medical camps, clean drinking water, school infrastructure, elder care, and animal welfare.
          </p>
        </div>

        {/* Lead CSR Feature — Official Health Checkup Camp Photograph */}
        <article className="bg-[#10243A] text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/14 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          <figure className="lg:col-span-5 bg-[#07111F] border-b lg:border-b-0 lg:border-r border-[#F4F8FC]/12 flex flex-col">
            <div className="aspect-[16/10] lg:aspect-auto lg:flex-1 overflow-hidden">
              <ResilientImage
                src={ASSETS.csrMedicalCamp2026.src}
                alt={ASSETS.csrMedicalCamp2026.alt}
                className="w-full h-full object-cover object-top"
                containerClassName="w-full h-full"
              />
            </div>
            <figcaption className="px-5 py-3 text-[11px] font-mono-tabular text-[#B5C5D7] border-t border-[#F4F8FC]/10">
              {ASSETS.csrMedicalCamp2026.caption}
            </figcaption>
          </figure>
          <div className="lg:col-span-7 p-8 sm:p-10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular">
                <span className="text-[#69C5F5]">01 · {leadStory.category}</span>
                <span className="text-[#B5C5D7]">{leadStory.dateOrLocation}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#F4F8FC]">
                {leadStory.title}
              </h2>
              <p className="text-base text-[#F4F8FC]/85 leading-relaxed">{leadStory.summary}</p>
            </div>
            <ul className="pt-4 border-t border-[#F4F8FC]/12 space-y-1.5 text-xs text-[#B5C5D7]">
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
          <div className="divide-y divide-[#10243A]/15 dark:divide-[#F4F8FC]/14 border-t border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
            {otherStories.map((story, idx) => {
              const photo = CSR_PHOTO_MAP[story.id];
              return (
                <article
                  key={story.id}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  <div className="lg:col-span-3 space-y-2">
                    <p className="font-mono-tabular text-xs text-brand dark:text-[#69C5F5] font-semibold">
                      0{idx + 2} · {story.category}
                    </p>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">{story.dateOrLocation}</p>
                    {photo && (
                      <div className="aspect-[16/10] bg-[#10243A] border border-[#10243A]/12 overflow-hidden mt-3">
                        <ResilientImage
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover object-top"
                          containerClassName="w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-6 space-y-2">
                    <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                      {story.title}
                    </h3>
                    <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  <ul className="lg:col-span-3 space-y-1.5 text-xs text-[#465C72] dark:text-[#B5C5D7]">
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

        {/* Additional Community Fieldwork Visuals */}
        <section aria-labelledby="csr-fieldwork-heading" className="space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Community Fieldwork Archive
            </p>
            <h2
              id="csr-fieldwork-heading"
              className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]"
            >
              Voluntary Blood Donation &amp; Gaushala Animal Welfare
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: 'Healthcare Outreach · Plant Campus',
                asset: ASSETS.csrBloodDonation,
              },
              {
                label: 'Animal Welfare · Srikakulam Gaushala',
                asset: ASSETS.csrCowWelfare,
              },
            ].map((item) => (
              <figure
                key={item.asset.id}
                className="bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden"
              >
                <div className="aspect-[16/10] bg-[#10243A] overflow-hidden">
                  <ResilientImage
                    src={item.asset.src}
                    alt={item.asset.alt}
                    className="w-full h-full object-cover object-top"
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="p-4 space-y-1 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                    {item.label}
                  </p>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {item.asset.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Link to Statutory CSR Policy */}
        <aside className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              CSR Policy, Committee Composition & Annual Project Schedules
            </h2>
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
              Statutory CSR records covering FY 2021–22 through FY 2025–26 are indexed in the Corporate Documents archive.
            </p>
          </div>
          <Link
            to="/documents"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#004C73] transition-colors whitespace-nowrap shrink-0"
          >
            View CSR Documents
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
