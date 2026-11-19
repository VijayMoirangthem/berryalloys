import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { COMPANY_INFO, UPCOMING_OFFICE_NOTICE } from '../data/company';
import { CredentialStackedMatrix } from '../data/CredentialMatrices';
import { CORPORATE_DOSSIER_PAGES } from '../data/showcaseCollections';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { DirectorPortraitSection } from '../components/DirectorPortraitSection';
import { GrowthChronicle } from '../components/GrowthChronicle';
import { ResilientImage } from '../components/ResilientImage';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { ImageReveal } from '../components/motion/ImageReveal';
import { SplitText } from '../components/motion/SplitText';
import { GooeyTextReveal } from '../components/ui/GooeyTextReveal';
import { InteractiveBook } from '../components/ui/InteractiveBook';

export function AboutPage() {
  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        <div>
          <Breadcrumbs items={[{ label: 'About, Legacy & Leadership' }]} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                DKG Group Heritage · CIN {COMPANY_INFO.cin}
              </p>
              <SplitText
                text="Bulk ferro alloys anchored in discipline & legacy."
                as="h1"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              />
              <div className="space-y-4 text-base text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed max-w-[64ch]">
                <p>
                  Rooted in the industrial ethos of{' '}
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Late Shri Dashrath Kumar Gupta
                  </strong>
                  , founder of the DKG Group, Berry Alloys Limited translates multi-generational trading and manufacturing discipline into high-temperature metallurgical execution.
                </p>
                <p>{COMPANY_INFO.legacyNarrative.alliedEnterprise}</p>
                <p>
                  From first submerged-arc furnaces commissioned in 2010 to multi-unit operations spanning{' '}
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Bobbili Growth Centre and Dhalbhumgarh
                  </strong>
                  , the company links eastern India’s mineral belt directly to global vessels via{' '}
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Visakhapatnam Harbour Port
                  </strong>
                  .
                </p>
              </div>
              <GooeyTextReveal>
                <p
                  data-gooey-reveal-item=""
                  className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed max-w-[64ch]"
                >
                  {COMPANY_INFO.incorporationYearNote}
                </p>
              </GooeyTextReveal>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <figure className="bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden">
                <ImageReveal direction="up" className="aspect-video bg-[#10243A]">
                  <ResilientImage
                    src={ASSETS.newCorporateOffice.src}
                    alt={ASSETS.newCorporateOffice.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#465C72] dark:text-[#B5C5D7] border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                  {ASSETS.newCorporateOffice.caption} · Active Head Office remains 21A, Shakespeare Sarani, Kolkata.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Interactive 3D Heritage Dossier */}
        <InteractiveBook
          coverTitle="Berry Alloys Corporate Dossier"
          coverSubtitle="DKG Group Heritage, Promoter Governance & Multi-Plant Milestones"
          pages={CORPORATE_DOSSIER_PAGES}
        />

        {/* Mission & Vision Split */}
        <section
          aria-labelledby="mission-vision-heading"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14"
        >
          <h2 id="mission-vision-heading" className="sr-only">
            Mission and Vision
          </h2>
          <div className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-8 sm:p-10 space-y-3">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Operational Mission
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] leading-tight">
              {COMPANY_INFO.mission}
            </p>
          </div>
          <div className="bg-[#10243A] text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/16 p-8 sm:p-10 space-y-3">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
              Long-Term Vision
            </p>
            <p className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#F4F8FC] leading-tight">
              {COMPANY_INFO.vision}
            </p>
          </div>
        </section>

        {/* Core Values List */}
        <section aria-labelledby="values-heading" className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5] mb-2">
              Operating Principles
            </p>
            <h2 id="values-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
              Six Core Values
            </h2>
          </div>

          <div className="divide-y divide-[#10243A]/12 dark:divide-[#F4F8FC]/12 border-t border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
            {COMPANY_INFO.values.map((val, index) => (
              <div key={val.title} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                <span className="md:col-span-1 font-mono-tabular text-xs text-brand dark:text-[#69C5F5]">
                  0{index + 1}
                </span>
                <h3 className="md:col-span-4 font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  {val.title}
                </h3>
                <p className="md:col-span-7 text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Promoters & Managing Director Profile */}
        <section
          aria-labelledby="leadership-heading"
          className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 space-y-12"
        >
          <DirectorPortraitSection variant="about" />

          <div className="pt-10 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  People & Culture · {COMPANY_INFO.workforceStory.motto}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  {COMPANY_INFO.workforceStory.headline}
                </h3>
              </div>
              <Link
                to="/careers"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
              >
                Explore Teams & Careers
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  index: '01',
                  label: 'Smelting Floor Engineering',
                  title: 'Submerged-Arc & AOD Operations',
                  summary: 'Furnace crews monitoring electrode columns, slag basicity, tapping schedules, and 6,000 MT/month AOD decarburisation lines.',
                },
                {
                  index: '02',
                  label: 'QA & Chemical Assurance',
                  title: 'Metallurgical Assay Laboratories',
                  summary: 'Quality chemists verifying manganese, silicon, chromium, carbon, phosphorus, sulfur, boron, and nitrogen bands before dispatch.',
                },
                {
                  index: '03',
                  label: 'ISO 45001 Shift Briefings',
                  title: 'Occupational Safety Stewardship',
                  summary: 'Cross-functional shift safety huddles upholding thermal-bay PPE discipline, preventive healthcare, and zero-harm protocols.',
                },
              ].map((item) => (
                <div
                  key={item.index}
                  className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-5 space-y-2"
                >
                  <p className="font-mono-tabular uppercase text-[11px] text-brand dark:text-[#69C5F5]">
                    {item.index} · {item.label}
                  </p>
                  <h4 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full Interactive Growth Story */}
        <section
          aria-labelledby="history-heading"
          className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-2">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                Growth Trajectory (2010–2026+)
              </p>
              <h2 id="history-heading" className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Interactive Growth Chronicle & Disclosures
              </h2>
              <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed max-w-2xl">
                Trace each smelting capacity step, export accreditation, AOD converter milestone, and 2026 state industrial expansion MoU—including {UPCOMING_OFFICE_NOTICE.address}.
              </p>
            </div>

            <figure className="lg:col-span-5 bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden">
              <div className="aspect-[16/10] bg-[#10243A] overflow-hidden">
                <ResilientImage
                  src={ASSETS.aboutMouPresentation.src}
                  alt={ASSETS.aboutMouPresentation.alt}
                  className="w-full h-full object-cover object-top"
                  containerClassName="w-full h-full"
                />
              </div>
              <figcaption className="px-4 py-2.5 text-xs text-[#465C72] dark:text-[#B5C5D7] border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                {ASSETS.aboutMouPresentation.caption}
              </figcaption>
            </figure>
          </div>

          <GrowthChronicle />

          <div className="pt-2">
            <Link
              to="/documents"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
            >
              Inspect Annual Returns & Governance Policies
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Accreditations & Institutional Matrix */}
        <section
          aria-labelledby="about-credentials-heading"
          className="pt-12 border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 space-y-6"
        >
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Accreditations & Recognition Matrix
            </p>
            <h2
              id="about-credentials-heading"
              className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]"
            >
              ISO Frameworks, Credit Ratings & Memberships
            </h2>
          </div>
          <CredentialStackedMatrix />
        </section>
      </div>
    </div>
  );
}
