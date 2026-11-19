import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ExternalLink, Maximize2, ShieldCheck, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ASSETS } from '../data/assets';
import {
  AWARD_CATEGORIES,
  AWARD_RECORDS,
  AwardCategory,
  AwardRecord,
  CREDIT_RATING_DISCLOSURE,
  MANAGEMENT_CREDENTIALS,
} from '../data/awards';
import { seoFor } from '../seo/registry';
import { seoEnv, useSeo } from '../seo/useSeo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ResilientImage } from '../components/ResilientImage';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { SplitText } from '../components/motion/SplitText';

type CategoryFilter = 'All' | AwardCategory;

export function AwardsAchievementsPage() {
  const seoEntry = useMemo(() => seoFor('awards', 'en', seoEnv()), []);
  useSeo(seoEntry);

  const prefersReduced = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [lightboxRecord, setLightboxRecord] = useState<AwardRecord | null>(null);

  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const savedScrollYRef = useRef(0);

  const featuredRecord = useMemo(
    () =>
      AWARD_RECORDS.find((r) => r.id === 'et-edge-best-organization-to-work-2026') ??
      AWARD_RECORDS.find((r) => Boolean(r.image)) ??
      AWARD_RECORDS[0],
    []
  );

  const openLightbox = (record: AwardRecord, triggerEl?: HTMLButtonElement | null) => {
    if (triggerEl) {
      lightboxTriggerRef.current = triggerEl;
    }
    setLightboxRecord(record);
  };

  const filteredRecords = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? AWARD_RECORDS
        : AWARD_RECORDS.filter((r) => r.category === activeCategory);
    return [...base].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeCategory]);

  const toggleNote = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (!lightboxRecord) return;

    savedScrollYRef.current = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      lightboxCloseRef.current?.focus({ preventScroll: true });
    }, 20);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxRecord(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.scrollTo({ top: savedScrollYRef.current, behavior: 'auto' });
      lightboxTriggerRef.current?.focus({ preventScroll: true });
    };
  }, [lightboxRecord]);

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#07111F] text-[#10243A] dark:text-[#F4F8FC]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Company and governance navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {/* Editorial Page Header */}
        <header className="max-w-3xl space-y-4">
          <Breadcrumbs items={[{ label: 'Awards & Achievements' }]} />

          <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            Public Recognition Archive · berryalloys.com
          </p>

          <SplitText
            text="Awards, Recognitions & Institutional Credentials"
            as="h1"
            className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
          />

          <p className="text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
            A traceable chronological ledger of published corporate, workplace, social impact, leadership, and export recognitions compiled from Berry Alloys Limited’s public announcements, paired with official ceremony photography. Management system certifications and external credit rating references are maintained in dedicated sections below.
          </p>
        </header>

        {/* Featured Verified Recognition Frame (Exclusive placement for ET Edge 2026 ceremony photo & official crest) */}
        {featuredRecord.image && (
          <section
            aria-labelledby="featured-recognition-heading"
            className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
          >
            <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#10243A] border-b lg:border-b-0 lg:border-r border-[#10243A]/12 dark:border-[#F4F8FC]/12 p-6 sm:p-8 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                <span>Featured Ceremony Record</span>
                <span>{featuredRecord.awardYear ?? 'Published'}</span>
              </div>

              <figure className="space-y-3">
                <button
                  type="button"
                  onClick={(e) => openLightbox(featuredRecord, e.currentTarget)}
                  aria-label={`Inspect ${featuredRecord.title} stage ceremony photograph`}
                  className="group relative block w-full bg-[#07111F] border border-[#10243A]/12 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-brand text-left"
                >
                  <div className="aspect-[4/4] sm:aspect-[5/4] lg:aspect-[4/4] overflow-hidden">
                    <ResilientImage
                      src={featuredRecord.image.src}
                      alt={featuredRecord.image.alt}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      containerClassName="w-full h-full bg-[#07111F]"
                    />
                  </div>
                  <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 bg-[#10243A]/90 text-[#F4F8FC] px-2.5 py-1 text-[10px] font-mono-tabular uppercase tracking-wider">
                    <Maximize2 className="w-3 h-3" aria-hidden="true" />
                    Inspect
                  </span>
                </button>
                <figcaption className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {featuredRecord.image.caption}
                </figcaption>
              </figure>

              <p className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7] pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                Provenance: {featuredRecord.image.provenance}
              </p>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                      <span className="font-semibold text-brand dark:text-[#69C5F5]">
                        {featuredRecord.category}
                      </span>
                      <span aria-hidden="true">/</span>
                      <span>Issuer: {featuredRecord.issuer}</span>
                      {featuredRecord.announcementDate && (
                        <>
                          <span aria-hidden="true">/</span>
                          <span>Announced {featuredRecord.announcementDate}</span>
                        </>
                      )}
                    </div>

                    <h2
                      id="featured-recognition-heading"
                      className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC] leading-[1.02]"
                    >
                      {featuredRecord.title}
                    </h2>
                  </div>

                  {/* Exclusive placement of the official ET Edge 2026 emblem crest */}
                  <div className="hidden sm:flex shrink-0 bg-[#FFFFFF] border border-[#10243A]/12 p-2.5">
                    <img
                      src={ASSETS.awardEtEdge2026.src}
                      alt={ASSETS.awardEtEdge2026.alt}
                      className="h-14 w-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed max-w-2xl">
                  {featuredRecord.description}
                </p>

                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 text-xs">
                  <div>
                    <dt className="font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                      Recipient
                    </dt>
                    <dd className="mt-1 font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                      {featuredRecord.recipient}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                      Award Year
                    </dt>
                    <dd className="mt-1 font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                      {featuredRecord.awardYear ?? 'Not stated'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                      Announcement Date
                    </dt>
                    <dd className="mt-1 font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                      {featuredRecord.announcementDate ?? 'Undated listing'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={featuredRecord.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#004C73] transition-colors"
                >
                  <span>{featuredRecord.sourceLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <p className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                  5 records illustrated with official berryalloys.com ceremony photography.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 01. Chronological Awards & Recognitions Ledger */}
        <section aria-labelledby="awards-ledger-heading" className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
            <div className="space-y-2">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                01 / Chronological Archive
              </p>
              <h2
                id="awards-ledger-heading"
                className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              >
                Published Awards &amp; Recognitions
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div
              role="tablist"
              aria-label="Filter awards by category"
              className="flex flex-wrap items-center gap-1.5"
            >
              {(['All', ...AWARD_CATEGORIES] as CategoryFilter[]).map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC]'
                        : 'bg-[#F1F6FB] text-[#465C72] hover:bg-[#D4DFEB] hover:text-[#10243A] dark:bg-[#12243B] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-[#10243A]/15 dark:divide-[#F4F8FC]/14 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
            {filteredRecords.map((record, index) => {
              const isExpanded = Boolean(expandedNotes[record.id]);
              const isFirst = index === 0;

              return (
                <motion.article
                  key={record.id}
                  initial={
                    prefersReduced || isFirst
                      ? false
                      : { opacity: 0.25, y: 12 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative py-7 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start"
                >
                  {/* Signature Berry-blue-to-red hairline rule on hover/focus */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-[#006393] via-[#0A6AA1] to-[#C9233B] dark:from-[#69C5F5] dark:via-[#0A6AA1] dark:to-[#C9233B] origin-left scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />

                  {/* Left Column: Chronological Date, Distinction Metadata & Inline Ceremony Thumbnail (non-featured records) */}
                  <div className="lg:col-span-3 space-y-2">
                    <div className="space-y-1">
                      <p className="font-mono-tabular text-sm font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                        {record.displayDate}
                      </p>
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                        {record.category}
                      </p>
                      <div className="pt-1 space-y-0.5 text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                        {record.awardYear && (
                          <p>Award period: {record.awardYear}</p>
                        )}
                        {record.announcementDate &&
                          record.announcementDate !== record.awardYear && (
                            <p>Published: {record.announcementDate}</p>
                          )}
                      </div>
                    </div>

                    {record.image && record.id !== featuredRecord.id && (
                      <button
                        type="button"
                        onClick={(e) => openLightbox(record, e.currentTarget)}
                        aria-label={`Inspect ${record.title} ceremony photograph`}
                        className="group/thumb relative block w-full max-w-[260px] bg-[#07111F] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-brand mt-2"
                      >
                        <div className="aspect-[16/10] overflow-hidden">
                          <ResilientImage
                            src={record.image.src}
                            alt={record.image.alt}
                            className="w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/thumb:scale-[1.04]"
                            containerClassName="w-full h-full bg-[#07111F]"
                          />
                        </div>
                        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 bg-[#10243A]/90 text-[#F4F8FC] px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider">
                          <Maximize2 className="w-2.5 h-2.5" aria-hidden="true" />
                          Inspect
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Center Column: Editorial Entry */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC] leading-[1.06]">
                        {record.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#465C72] dark:text-[#B5C5D7]">
                      <span>
                        <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                          Recipient:
                        </strong>{' '}
                        {record.recipient}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                          Issuer:
                        </strong>{' '}
                        {record.issuer}
                      </span>
                      {record.distinctionLabel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular text-brand dark:text-[#69C5F5]">
                            {record.distinctionLabel}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                      {record.description}
                    </p>

                    {record.verificationNote && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleNote(record.id)}
                          aria-expanded={isExpanded}
                          className="inline-flex items-center gap-1.5 text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7] hover:text-brand dark:hover:text-[#69C5F5] transition-colors cursor-pointer py-1"
                        >
                          <span>
                            {isExpanded ? 'Hide record verification note' : 'Record verification note'}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        {isExpanded && (
                          <p className="mt-2 bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/12 dark:border-[#F4F8FC]/12 px-4 py-3 text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                            {record.verificationNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Traceable Source Link */}
                  <div className="lg:col-span-2 lg:text-right flex lg:flex-col lg:items-end justify-between gap-2 pt-1">
                    <a
                      href={record.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] border border-[#10243A]/18 dark:border-[#F4F8FC]/18 hover:border-brand hover:text-brand dark:hover:border-[#69C5F5] dark:hover:text-[#69C5F5] transition-colors whitespace-nowrap"
                    >
                      <span>{record.sourceLabel}</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    {record.image && (
                      <button
                        type="button"
                        onClick={(e) => openLightbox(record, e.currentTarget)}
                        className="text-[11px] font-mono-tabular text-brand dark:text-[#69C5F5] hover:underline cursor-pointer"
                      >
                        {record.id === featuredRecord.id ? 'View stage photo' : 'Inspect photo'}
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* 02. Management System Credentials (Kept Strictly Separate from Awards) */}
        <section
          aria-labelledby="management-credentials-heading"
          className="pt-4 space-y-8"
        >
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              02 / Standards &amp; Certifications
            </p>
            <h2
              id="management-credentials-heading"
              className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
            >
              Management System Credentials
            </h2>
            <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              International quality, environmental, occupational safety, and product carbon footprint frameworks reported across Berry Alloys Limited’s manufacturing and sustainability disclosures. Kept distinct from competitive awards and honours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#10243A]/15 dark:border-[#F4F8FC]/14 bg-white dark:bg-[#12243B]">
            {MANAGEMENT_CREDENTIALS.map((cred) => (
              <article
                key={cred.code}
                className="p-6 sm:p-8 border-r border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                      {cred.code}
                    </p>
                    <ShieldCheck
                      className="w-5 h-5 text-brand dark:text-[#69C5F5] shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                    {cred.standard}
                  </p>
                  <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {cred.scope}
                  </p>
                </div>
                <p className="pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                  {cred.statusNote}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 03. Credit Ratings Verification Disclosure (Kept Strictly Separate) */}
        <section
          aria-labelledby="credit-ratings-heading"
          className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 p-6 sm:p-10 space-y-8"
        >
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              03 / External Rating Governance
            </p>
            <h2
              id="credit-ratings-heading"
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
            >
              {CREDIT_RATING_DISCLOSURE.heading}
            </h2>
            <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              {CREDIT_RATING_DISCLOSURE.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CREDIT_RATING_DISCLOSURE.agencies.map((item) => (
              <div
                key={item.agency}
                className="bg-[#FFFFFF] dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6 space-y-2.5"
              >
                <p className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  {item.agency}
                </p>
                <p className="text-xs font-mono-tabular text-brand dark:text-[#69C5F5]">
                  {item.websiteMention}
                </p>
                <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {item.verificationRequirement}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
              Statutory filings, MGT-7 annual returns, and governance policies are indexed separately.
            </p>
            <Link
              to="/documents"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#004C73] transition-colors whitespace-nowrap"
            >
              Open Corporate Documents Archive
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

      {/* Accessible Lightbox for Verified Recognition Visual */}
      <AnimatePresence>
        {lightboxRecord?.image && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${lightboxRecord.title} ceremony photograph preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxRecord(null);
            }}
            className="fixed inset-0 z-[75] bg-[#07111F]/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          >
            <div className="w-full max-w-3xl bg-[#FFFFFF] dark:bg-[#10243A] border border-[#10243A]/20 dark:border-[#F4F8FC]/20 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
                <div>
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                    {lightboxRecord.issuer} · {lightboxRecord.displayDate}
                  </p>
                  <p className="font-display text-lg font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {lightboxRecord.title}
                  </p>
                </div>
                <button
                  ref={lightboxCloseRef}
                  type="button"
                  onClick={() => setLightboxRecord(null)}
                  aria-label="Close photograph preview"
                  className="inline-flex items-center justify-center w-10 h-10 text-[#10243A] dark:text-[#F4F8FC] hover:bg-[#F1F6FB] dark:hover:bg-[#12243B] cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="bg-[#07111F] p-4 sm:p-6 flex items-center justify-center">
                <img
                  src={lightboxRecord.image.src}
                  alt={lightboxRecord.image.alt}
                  className="max-h-[66vh] w-auto object-contain"
                />
              </div>
              <div className="px-5 py-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 text-xs text-[#465C72] dark:text-[#B5C5D7] space-y-1">
                <p>{lightboxRecord.image.caption}</p>
                <p className="font-mono-tabular text-[11px]">
                  Provenance: {lightboxRecord.image.provenance}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
