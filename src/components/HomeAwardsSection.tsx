import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ASSETS } from '../data/assets';
import {
  AWARD_CATEGORIES,
  AWARD_RECORDS,
  AwardCategory,
  AwardRecord,
  CREDIT_RATING_DISCLOSURE,
  MANAGEMENT_CREDENTIALS,
} from '../data/awards';
import { ResilientImage } from './ResilientImage';
import { SpotlightSurface } from './motion/SpotlightSurface';
import { AnimatedTooltip } from './ui/AnimatedTooltip';
import { IndustrialButton } from './ui/IndustrialButton';
import { PopButton } from './ui/PopButton';
import { PerspectiveGrid } from './ui/PerspectiveGrid';

type HomeAwardFilter = 'All' | AwardCategory;

/**
 * HomeAwardsSection — Complete executive Awards & Achievements chapter integrated
 * directly into the Homepage narrative, showcasing all 5 authentic official berryalloys.com
 * ceremony photographs with interactive Full-Resolution Ceremony Lightbox inspection,
 * official ET Edge 2026 emblem crest, filterable 8-record traceable ledger, audited
 * ISO management credentials, and separate CRISIL/ICRA credit rating verification disclosure.
 */
export function HomeAwardsSection() {
  const [activeCategory, setActiveCategory] = useState<HomeAwardFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxRecord, setLightboxRecord] = useState<AwardRecord | null>(null);

  const photographedRecords = useMemo(
    () =>
      AWARD_RECORDS.filter((r) => Boolean(r.image)).sort(
        (a, b) => a.sortOrder - b.sortOrder
      ),
    []
  );

  const featuredRecord = useMemo(
    () =>
      photographedRecords.find(
        (r) => r.id === 'et-edge-best-organization-to-work-2026'
      ) ?? photographedRecords[0],
    [photographedRecords]
  );

  const ceremonyGalleryRecords = useMemo(
    () => photographedRecords.filter((r) => r.id !== featuredRecord?.id),
    [photographedRecords, featuredRecord]
  );

  const filteredRecords = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? AWARD_RECORDS
        : AWARD_RECORDS.filter((r) => r.category === activeCategory);
    return [...base].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeCategory]);

  const stepLightbox = useCallback(
    (delta: number) => {
      if (!lightboxRecord || photographedRecords.length <= 1) return;
      const idx = photographedRecords.findIndex((r) => r.id === lightboxRecord.id);
      if (idx === -1) return;
      const next =
        photographedRecords[
          (idx + delta + photographedRecords.length) % photographedRecords.length
        ];
      setLightboxRecord(next);
    },
    [lightboxRecord, photographedRecords]
  );

  useEffect(() => {
    if (!lightboxRecord) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxRecord(null);
      } else if (e.key === 'ArrowRight') {
        stepLightbox(1);
      } else if (e.key === 'ArrowLeft') {
        stepLightbox(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxRecord, stepLightbox]);

  return (
    <section
      id="awards"
      aria-labelledby="home-awards-heading"
      className="scroll-mt-20 relative overflow-hidden py-20 lg:py-28 bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
    >
      {/* Subtle 3D interactive PerspectiveGrid architecture in background */}
      <div className="pointer-events-none absolute inset-0 opacity-45 dark:opacity-35">
        <PerspectiveGrid
          gridSize={20}
          fadeRadius={76}
          accent="berry"
          className="[--fade-stop:#FFFFFF] dark:[--fade-stop:#07111F]"
        />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
        {/* Chapter Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              08 / Awards &amp; Achievements
            </p>
            <h2
              id="home-awards-heading"
              className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
            >
              Official recognitions, ceremony records &amp; institutional credentials
            </h2>
          </div>
          <div className="space-y-3 max-w-md">
            <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
              Every award below is traced to Berry Alloys Limited’s official announcements on berryalloys.com — featuring authentic stage ceremony photography, kept cleanly distinct from ISO systems and external credit ratings.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <PopButton to="/awards-achievements" variant="crimson" size="md">
                Open Full Awards Archive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </PopButton>
            </div>
          </div>
        </div>

        {/* Featured Official Ceremony Record — ET Edge Best Organization to Work 2026 */}
        {featuredRecord?.image && (
          <motion.div
            initial={{ opacity: 0.35, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/16 dark:border-[#F4F8FC]/15 overflow-hidden"
          >
            <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#10243A] border-b lg:border-b-0 lg:border-r border-[#10243A]/12 dark:border-[#F4F8FC]/12 p-5 sm:p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                <span>Official Stage Ceremony</span>
                <span>{featuredRecord.displayDate}</span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxRecord(featuredRecord)}
                aria-label={`Open full view of ${featuredRecord.title} ceremony photograph`}
                className="group relative block w-full bg-[#07111F] border border-[#10243A]/14 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-brand text-left"
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <ResilientImage
                    src={featuredRecord.image.src}
                    alt={featuredRecord.image.alt}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    containerClassName="w-full h-full bg-[#07111F]"
                  />
                </div>
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 bg-[#07111F]/90 group-hover:bg-brand text-[#F4F8FC] px-2.5 py-1 text-[10px] font-mono-tabular uppercase tracking-wider transition-colors">
                  <Maximize2 className="w-3 h-3" aria-hidden="true" />
                  Inspect Full Photo
                </span>
              </button>

              <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                {featuredRecord.image.caption}
              </p>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono-tabular uppercase tracking-wider">
                      <span className="text-brand dark:text-[#69C5F5] font-semibold">
                        {featuredRecord.category}
                      </span>
                      <span aria-hidden="true" className="text-[#465C72]">/</span>
                      <AnimatedTooltip
                        variant="cora"
                        content="Official Public Disclosure"
                        sublabel={featuredRecord.image.provenance}
                        accentColor="#006393"
                        shapeColor="#10243A"
                        textColor="#F4F8FC"
                      >
                        <span className="inline-flex items-center gap-1 text-[#465C72] dark:text-[#B5C5D7] cursor-help underline decoration-dotted underline-offset-4">
                          <Award className="w-3.5 h-3.5 text-[#C9233B]" aria-hidden="true" />
                          {featuredRecord.issuer}
                        </span>
                      </AnimatedTooltip>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC] leading-[1.02]">
                      {featuredRecord.title}
                    </h3>
                  </div>

                  {/* Official ET Edge 2026 emblem crest */}
                  <div className="hidden sm:flex shrink-0 bg-[#FFFFFF] border border-[#10243A]/14 p-2.5">
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
                      {featuredRecord.awardYear ?? 'Published'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                      Announcement
                    </dt>
                    <dd className="mt-1 font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                      {featuredRecord.announcementDate ?? featuredRecord.displayDate}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={featuredRecord.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                >
                  <span>Verify on berryalloys.com</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                <span className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                  5 Official Ceremony Photographs · Click Any Frame To Enlarge
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4 Authentic Official Ceremony Photography Cards (Click Any To Open Lightbox) */}
        <div className="m-rail grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ceremonyGalleryRecords.map((record, idx) => (
            <motion.figure
              key={record.id}
              initial={{ opacity: 0.35, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#FFFFFF] dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden flex flex-col"
            >
              {record.image && (
                <button
                  type="button"
                  onClick={() => setLightboxRecord(record)}
                  aria-label={`Open full ceremony photograph for ${record.title}`}
                  className="group relative block w-full aspect-[4/3] bg-[#07111F] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-brand text-left"
                >
                  <ResilientImage
                    src={record.image.src}
                    alt={record.image.alt}
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    containerClassName="w-full h-full bg-[#07111F]"
                  />
                  <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 bg-[#07111F]/88 group-hover:bg-brand text-[#F4F8FC] px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider transition-colors">
                    <Maximize2 className="w-2.5 h-2.5" aria-hidden="true" />
                    Open
                  </span>
                </button>
              )}
              <figcaption className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-wider">
                    <span className="text-brand dark:text-[#69C5F5] font-semibold truncate">
                      {record.category}
                    </span>
                    <span className="text-[#C9233B] dark:text-[#F48B9B] shrink-0">
                      {record.displayDate}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold uppercase leading-snug text-[#10243A] dark:text-[#F4F8FC]">
                    {record.title}
                  </h4>
                  <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] line-clamp-2 leading-relaxed">
                    {record.recipient}
                  </p>
                </div>
                <p className="text-[10px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7] pt-2 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 truncate">
                  {record.issuer}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Interactive Filterable Traceable Recognition Ledger (All 8 Records) */}
        <div className="space-y-5 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                Complete Published Ledger ({filteredRecords.length} of {AWARD_RECORDS.length} Records)
              </p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                Filter Recognitions By Category
              </h3>
            </div>

            <div
              role="tablist"
              aria-label="Filter awards by category"
              className="flex flex-wrap items-center gap-1.5"
            >
              {(['All', ...AWARD_CATEGORIES] as HomeAwardFilter[]).map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-[36px] px-3 py-1.5 text-[11px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer ${
                      active
                        ? 'bg-brand text-[#FFFFFF] border-brand dark:bg-[#0A6AA1] dark:border-[#69C5F5]/60'
                        : 'bg-[#F1F6FB] text-[#465C72] border-[#10243A]/14 hover:text-[#10243A] dark:bg-[#12243B] dark:text-[#B5C5D7] dark:border-[#F4F8FC]/14 dark:hover:text-[#F4F8FC]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="m-rail grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRecords.map((record) => {
              const isExpanded = expandedId === record.id;
              return (
                <SpotlightSurface
                  key={record.id}
                  className="h-full bg-[#FFFFFF] dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-widest">
                      <span className="text-brand dark:text-[#69C5F5] font-semibold truncate">
                        {record.distinctionLabel ?? record.category}
                      </span>
                      <span className="text-[#C9233B] dark:text-[#F48B9B] font-semibold shrink-0">
                        {record.awardYear ?? 'Listed'}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold uppercase tracking-tight leading-snug text-[#10243A] dark:text-[#F4F8FC]">
                      {record.title}
                    </h4>
                    <p className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                      {record.issuer}
                    </p>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed line-clamp-3">
                      {record.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : record.id)}
                        aria-expanded={isExpanded}
                        className="inline-flex items-center gap-1 text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5] cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Source' : 'Source Note'}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {record.image && (
                        <button
                          type="button"
                          onClick={() => setLightboxRecord(record)}
                          className="inline-flex items-center gap-1 text-[10px] font-mono-tabular uppercase tracking-wider text-[#10243A] dark:text-[#F4F8FC] hover:text-brand dark:hover:text-[#69C5F5] cursor-pointer"
                        >
                          <Maximize2 className="w-3 h-3" aria-hidden="true" />
                          Photo
                        </button>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="pt-1.5 text-[11px] text-[#465C72] dark:text-[#B5C5D7] space-y-1.5">
                        <p className="leading-relaxed">
                          {record.verificationNote ??
                            `Recorded for ${record.recipient} (${record.displayDate}) via Berry Alloys published disclosures.`}
                        </p>
                        {record.sourceUrl && (
                          <a
                            href={record.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                          >
                            {record.sourceLabel}
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </SpotlightSurface>
              );
            })}
          </div>

          {/* Audited ISO Systems Strip (Kept Distinct From Awards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {MANAGEMENT_CREDENTIALS.map((cred) => (
              <div
                key={cred.code}
                className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border border-[#10243A]/12 dark:border-[#F4F8FC]/12 p-4 space-y-1"
              >
                <p className="text-[11px] font-mono-tabular font-bold uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                  {cred.code}
                </p>
                <p className="text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                  {cred.standard}
                </p>
                <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {cred.scope}
                </p>
              </div>
            ))}
          </div>

          {/* Transparent Governance & Credit Rating Distinction Callout */}
          <div className="bg-[#10243A] text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/16 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <ShieldCheck
                className="w-5 h-5 text-[#69C5F5] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                  CRISIL &amp; ICRA Credit Rating Disclosure (Kept Separate From Awards)
                </p>
                <p className="text-xs sm:text-sm text-[#B5C5D7] leading-relaxed">
                  {CREDIT_RATING_DISCLOSURE.summary}
                </p>
              </div>
            </div>
            <Link
              to="/awards-achievements"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#69C5F5] hover:text-[#FFFFFF] whitespace-nowrap shrink-0"
            >
              Inspect Complete Archive
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-Resolution Official Ceremony Lightbox Modal */}
      {lightboxRecord?.image &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${lightboxRecord.title} ceremony photograph`}
            onClick={() => setLightboxRecord(null)}
            className="fixed inset-0 z-[120] bg-[#040B14]/92 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-10"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#0B1726] border border-[#F4F8FC]/18 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 border-b border-[#F4F8FC]/12 bg-[#07111F]">
                <div className="min-w-0">
                  <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#69C5F5] truncate">
                    {lightboxRecord.category} · {lightboxRecord.displayDate} · {lightboxRecord.issuer}
                  </p>
                  <p className="font-display text-lg sm:text-xl font-bold uppercase text-[#F4F8FC] truncate">
                    {lightboxRecord.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxRecord(null)}
                  aria-label="Close ceremony photograph preview"
                  className="inline-flex items-center justify-center w-9 h-9 border border-[#F4F8FC]/20 bg-[#10243A] text-[#F4F8FC] hover:bg-[#C9233B] hover:border-[#C9233B] transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="relative flex-1 bg-[#050C16] flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px] p-4">
                <img
                  src={lightboxRecord.image.src}
                  alt={lightboxRecord.image.alt}
                  className="max-h-[65vh] max-w-full object-contain"
                />
                {photographedRecords.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepLightbox(-1)}
                      aria-label="Previous ceremony photograph"
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 bg-[#07111F]/88 border border-[#F4F8FC]/22 text-[#F4F8FC] hover:bg-brand hover:border-brand transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepLightbox(1)}
                      aria-label="Next ceremony photograph"
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 bg-[#07111F]/88 border border-[#F4F8FC]/22 text-[#F4F8FC] hover:bg-brand hover:border-brand transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-[#F4F8FC]/12 bg-[#07111F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#B5C5D7]">
                <div className="space-y-0.5">
                  <p className="text-[#F4F8FC] font-medium">{lightboxRecord.image.caption}</p>
                  <p className="text-[11px] font-mono-tabular text-[#B5C5D7]/80">
                    {lightboxRecord.image.provenance}
                  </p>
                </div>
                <a
                  href={lightboxRecord.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-[#FFFFFF] hover:bg-[#0A6AA1] text-[11px] font-semibold uppercase tracking-wider shrink-0"
                >
                  <span>{lightboxRecord.sourceLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

export default HomeAwardsSection;
