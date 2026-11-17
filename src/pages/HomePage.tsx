import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ASSETS, GALLERY_ITEMS } from '../data/assets';
import {
  CERTIFICATIONS,
  COMPANY_INFO,
  CREDENTIALS_AND_AWARDS,
  MEMBERSHIPS,
  OFFICES,
  UPCOMING_OFFICE_NOTICE,
} from '../data/company';
import { CSR_STORIES, NEWS_ITEMS } from '../data/communityNewsCareersDocs';
import { CredentialLogoMarquee, CredentialStackedMatrix } from '../data/CredentialMatrices';
import { CORPORATE_DOSSIER_PAGES, CSR_DIAGONAL_SLIDES, LIFE_CULTURE_SCATTER_SETS, PLANT_REVEAL_ROWS, QA_PERSPECTIVE_SLIDES } from '../data/showcaseCollections';
import { useGuide } from '../context/GuideContext';
import { BerryMonogram } from '../components/BerryMonogram';
import { BrandLockup } from '../components/BrandLockup';
import { ChapterRail } from '../components/ChapterRail';
import { ClientLogoStrip } from '../components/ClientLogoStrip';
import { InsightsPreview } from '../components/InsightsPreview';
import { DirectorPortraitSection } from '../components/DirectorPortraitSection';
import { EnquiryFormPanel } from '../components/EnquiryFormPanel';
import { FacilityCorridorMap } from '../components/FacilityCorridorMap';
import { GlobalPresenceSection } from '../components/GlobalPresenceSection';
import { LogisticsJourney } from '../components/LogisticsJourney';
import { GrowthChronicle } from '../components/GrowthChronicle';
import { HomeAlloyShowcase } from '../components/HomeAlloyShowcase';
import { HomeFaqSection } from '../components/HomeFaqSection';
import { ManufacturingScrollStory } from '../components/ManufacturingScrollStory';
import { MetallicShaderCanvas } from '../components/MetallicShaderCanvas';
import { PlantMediaGallery } from '../components/PlantMediaGallery';
import { ResilientImage } from '../components/ResilientImage';
import { ImageReveal } from '../components/motion/ImageReveal';
import { ScrollReveal } from '../components/motion/ScrollReveal';
import { useIndustrialReveals } from '../components/motion/useIndustrialReveals';
import { SplitText } from '../components/motion/SplitText';
import { SpotlightSurface } from '../components/motion/SpotlightSurface';
import { AnimatedTooltip } from '../components/ui/AnimatedTooltip';
import { CursorCard } from '../components/ui/CursorCard';
import { DiagonalCarousel } from '../components/ui/DiagonalCarousel';
import { FlipFadeText } from '../components/ui/FlipFadeText';
import { FlipText } from '../components/ui/FlipText';
import { GooeyTextReveal } from '../components/ui/GooeyTextReveal';
import { ImageRevealList } from '../components/ui/ImageRevealList';
import { ImageScatter } from '../components/ui/ImageScatter';
import { ImageTrail } from '../components/ui/ImageTrail';
import { IndustrialButton } from '../components/ui/IndustrialButton';
import { InteractiveBook } from '../components/ui/InteractiveBook';
import { InteractiveParticles } from '../components/ui/InteractiveParticles';
import { MorphText } from '../components/ui/MorphText';
import { PerspectiveCarousel } from '../components/ui/PerspectiveCarousel';
import { PixelatedImageTrail } from '../components/ui/PixelatedImageTrail';
import { ScrollDissolveReveal } from '../components/ui/ScrollDissolveReveal';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const pageRootRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const [particleMode, setParticleMode] = useState<'brand' | 'motto'>('brand');
  const {
    selectedEnquiryProductSlug: enquiryProductSlug,
    setSelectedEnquiryProductSlug: setEnquiryProductSlug,
  } = useGuide();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !heroSectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 18,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top 84%',
          once: true,
        },
      });

      if (heroMediaRef.current) {
        gsap.to(heroMediaRef.current, {
          yPercent: 10,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
      document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleEnquireAlloy = (slug: string) => {
    setEnquiryProductSlug(slug);
    scrollToChapter('enquiry');
  };

  useIndustrialReveals(pageRootRef, ['overview', 'process']);

  const featuredCamp = CSR_STORIES[0];
  const csrSecondaryStories = [CSR_STORIES[1], CSR_STORIES[4]];

  const curatedUpdates = [
    ...NEWS_ITEMS.filter((item) => item.type === 'News').slice(0, 4),
    ...NEWS_ITEMS.filter((item) => item.type === 'Article').slice(0, 2),
  ];

  return (
    <div ref={pageRootRef} className="relative">
      <ChapterRail />

      {/* 01 / OVERVIEW — Full-Viewport Monumental Particle Forging Field */}
      <section
        id="overview"
        aria-labelledby="overview-particle-heading"
        className="scroll-mt-16 relative bg-canvas text-ink min-h-[calc(100svh-4rem)] flex flex-col justify-between overflow-hidden border-b border-subtle"
      >
        <h1 id="overview-particle-heading" className="sr-only">
          Berry Alloys Limited — From Heat to Precision
        </h1>

        {/* Ambient molten copper depth backdrop behind particle stage */}
        <div
          aria-hidden="true"
          className="hero-breathe pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_46%,color-mix(in_srgb,var(--brand-primary)_16%,transparent),transparent_72%)]"
        />

        {/* Top Identity & Statutory Telemetry Bar */}
        <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 pt-4 sm:pt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BerryMonogram size="sm" framed />
            <div className="space-y-0.5">
              <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                01 / DKG Group Enterprise · Est. Sept 2006
              </p>
              <p className="text-[11px] font-mono-tabular text-ink-2">
                Bobbili · Dhalbhumgarh · Visakhapatnam Port
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono-tabular uppercase tracking-wider">
            <span className="hidden md:inline text-ink-2">
              CIN {COMPANY_INFO.cin}
            </span>
            <div
              className="flex items-center gap-1.5"
              role="group"
              aria-label="Switch particle typography phrase"
            >
              <button
                type="button"
                onClick={() => setParticleMode('brand')}
                className={`min-h-[34px] px-3 py-1 text-[11px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  particleMode === 'brand'
                    ? 'bg-brand text-on-brand border-brand'
                    : 'bg-card text-ink-2 border-control hover:text-ink'
                }`}
              >
                Berry Alloys Limited
              </button>
              <button
                type="button"
                onClick={() => setParticleMode('motto')}
                className={`min-h-[34px] px-3 py-1 text-[11px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  particleMode === 'motto'
                    ? 'bg-brand text-on-brand border-brand'
                    : 'bg-card text-ink-2 border-control hover:text-ink'
                }`}
              >
                Heat To Precision
              </button>
            </div>
          </div>
        </div>

        {/* Center Monumental Interactive Particle Stage */}
        <div className="relative z-10 flex-1 flex items-center justify-center max-w-[1440px] w-full mx-auto px-2 sm:px-6 lg:px-8 py-2">
          <InteractiveParticles
            className="w-full h-[54svh] sm:h-[60svh] lg:h-[64svh] min-h-[320px] max-h-[620px]"
            lines={
              particleMode === 'brand'
                ? ['BERRY ALLOYS', 'LIMITED']
                : ['FROM HEAT TO', 'PRECISION']
            }
            subtitle={
              particleMode === 'brand'
                ? 'FROM HEAT TO PRECISION · THREE STAR EXPORT HOUSE'
                : 'SUBMERGED-ARC & AOD METALLURGY · EST. 2006'
            }
            particleSize={2.05}
          />
        </div>

        {/* Bottom Interaction Cue & Chapter Descent Bar */}
        <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 pb-5 sm:pb-7 pt-3 border-t border-accent-red/70 lg:pr-[220px] xl:pr-[220px] 2xl:pr-[220px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
              Interactive Particle Forging Field
            </p>
            <p className="text-xs text-ink-2">
              Move cursor or swipe across the alloy typography to scatter particles · Bulk Ferro Alloys Manufacturer
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <IndustrialButton
              href="#complex-hero"
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToChapter('complex-hero');
              }}
            >
              Enter Complex & Story
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </IndustrialButton>
            <IndustrialButton
              href="#alloys"
              variant="outline-light"
              onClick={(e) => {
                e.preventDefault();
                scrollToChapter('alloys');
              }}
            >
              Alloy Portfolio
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </IndustrialButton>
          </div>
        </div>
      </section>

      {/* Secondary Smelting Complex Hero Directly Below Opening Field */}
      <section
        id="complex-hero"
        ref={heroSectionRef}
        aria-labelledby="hero-heading"
        className="scroll-mt-20 relative bg-[#07111F] text-[#F4F8FC] overflow-hidden"
      >
        <div className="relative min-h-[clamp(560px,82vh,840px)] flex flex-col justify-between">
          <div ref={heroMediaRef} className="absolute inset-0 will-change-transform">
            <ResilientImage
              src={ASSETS.officialPlantGate.src}
              alt={ASSETS.officialPlantGate.alt}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
              containerClassName="w-full h-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/68 to-[#07111F]/48"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#07111F]/92 via-[#07111F]/55 to-transparent"
          />

          <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 pt-8 sm:pt-12 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-widest text-[#F4F8FC]/80">
            <span>Bobbili Growth Centre & Dhalbhumgarh Smelting Works</span>
            <span>Visakhapatnam Deep-Water Harbour Corridor</span>
          </div>

          <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 pt-10 pb-20 lg:pt-12 lg:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 space-y-6">
                <SplitText
                  id="hero-heading"
                  text="Strength begins with precision."
                  as="h2"
                  className="font-display fluid-hero-title font-bold uppercase text-[#F4F8FC] max-w-4xl"
                />

                <div className="hero-reveal space-y-2.5 max-w-xl">
                  <span aria-hidden="true" className="block w-14 h-[1.5px] bg-[#69C5F5]" />
                  <MorphText
                    words={[
                      'HEAT TO PRECISION',
                      'FERRO MANGANESE',
                      'SILICO MANGANESE',
                      'FERRO CHROME',
                      'FERRO SILICON',
                    ]}
                    interval={2800}
                    fontSize="clamp(1.35rem, 2.6vw, 2.25rem)"
                    textClassName="text-[#69C5F5]"
                    subtext="Submerged-Arc & AOD Refined Alloy Grades"
                    subtextClassName="mt-1 text-[10px] sm:text-[11px] font-mono-tabular tracking-[0.18em] text-[#F4F8FC]/70"
                  />
                </div>

                <p className="hero-reveal text-base sm:text-lg text-[#F4F8FC]/88 leading-relaxed max-w-2xl">
                  Founded on the industrial ethos of the DKG Group and Late Shri Dashrath Kumar Gupta, Berry Alloys Limited smelts specification-grade Ferro Manganese, Silico Manganese, Ferro Chrome, and Ferro Silicon across eastern and coastal India.
                </p>

                <div className="hero-reveal pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  <IndustrialButton
                    href="#legacy"
                    variant="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter('legacy');
                    }}
                  >
                    Explore Company Legacy
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </IndustrialButton>
                  <IndustrialButton
                    href="#alloys"
                    variant="outline-dark"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter('alloys');
                    }}
                  >
                    Explore Alloys
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </IndustrialButton>
                  <IndustrialButton
                    href="#enquiry"
                    variant="outline-dark"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter('enquiry');
                    }}
                  >
                    Request a Quote
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </IndustrialButton>
                </div>
              </div>

              <div className="hero-reveal lg:col-span-4 lg:self-start lg:text-right space-y-2 border-t lg:border-t-0 lg:border-l border-[#F4F8FC]/20 pt-4 lg:pt-0 lg:pl-6">
                <div className="flex lg:justify-end">
                  <BrandLockup variant="hero" surface="dark" />
                </div>
                <p className="text-xs font-mono-tabular text-[#69C5F5]">
                  CIN {COMPANY_INFO.cin}
                </p>
                <p className="text-xs text-[#F4F8FC]/75">
                  <AnimatedTooltip
                    variant="copper"
                    label="DGFT Three Star Export House"
                    sublabel="Recognized sustained bulk export track record from eastern India."
                  >
                    <span
                      tabIndex={0}
                      className="underline decoration-dotted underline-offset-4 cursor-help focus-visible:outline-none"
                    >
                      Three Star Export House
                    </span>
                  </AnimatedTooltip>{' '}
                  · Incorporated Sept 2006
                </p>
                <p className="text-[11px] text-[#B5C5D7]">
                  Aerial plant view: Berry Alloys complex
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steel producers featured on the Berry Alloys website (logos from the company site; featured, not endorsed) */}
      <div className="border-y border-[#10243A]/12 dark:border-[#F4F8FC]/10 bg-canvas py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
          <ClientLogoStrip title="Steel producers featured on the Berry Alloys website" note="Logos are shown as featured on the company website. They are not endorsements." />
        </div>
      </div>

      {/* Institutional Credentials Continuous Marquee Ribbon */}
      <div
        aria-label="Management certifications, credit ratings, and industry memberships"
        className="bg-[#F1F6FB] dark:bg-[#0D1B2E] border-y border-[#10243A]/12 dark:border-[#F4F8FC]/10 py-4"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-widest text-[#465C72] dark:text-[#B5C5D7]">
            <span>Documented Systems, Credit Ratings & Industry Bodies</span>
            <span className="text-brand dark:text-[#69C5F5]">Hover Ribbon To Pause</span>
          </div>
          <CredentialLogoMarquee />
        </div>
      </div>

      {/* 02 / LEGACY — DKG Group Roots, Founding Heritage & Expansion Geography */}
      <section
        id="legacy"
        aria-labelledby="legacy-statement-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC]"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7 space-y-7">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                02 / DKG Group Heritage & Founding Story
              </p>

              <div>
                <FlipText
                  className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-brand dark:text-[#69C5F5]"
                  duration={3.4}
                >
                  DKG GROUP STEWARDSHIP
                </FlipText>
              </div>

              <ScrollReveal
                id="legacy-statement-heading"
                text="Built on generational steel and ferro alloy stewardship linking mineral belts to deep-water trade."
                as="h2"
                className="font-display fluid-statement font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] max-w-3xl"
              />

              <GooeyTextReveal>
                <p
                  data-gooey-reveal-item=""
                  className="text-base sm:text-lg font-medium text-[#10243A] dark:text-[#F4F8FC] leading-relaxed max-w-[65ch]"
                >
                  Translating generational industrial stewardship into specification-grade submerged-arc smelting, AOD decarburisation, and deep-water port dispatch.
                </p>
              </GooeyTextReveal>

              <div className="space-y-4 text-base text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed max-w-[65ch]">
                <p>
                  Rooted in the industrial ethos of{' '}
                  <CursorCard
                    imageSrc={ASSETS.corporateHouse.src}
                    imageAlt={ASSETS.corporateHouse.alt}
                    caption="DKG Group Lineage"
                    description="Founding industrial steward whose manufacturing values anchor Berry Alloys Limited under RoC Kolkata (CIN U27310WB2006PLC145016)."
                  >
                    Late Shri Dashrath Kumar Gupta
                  </CursorCard>
                  , founder of the DKG Group, Berry Alloys Limited translates multi-generational trading and manufacturing discipline into high-temperature metallurgical execution.
                </p>
                <p>
                  Within the broader promoter entrepreneurial footprint—including{' '}
                  <CursorCard
                    imageSrc={ASSETS.milestone2010Visual.src}
                    imageAlt={ASSETS.milestone2010Visual.alt}
                    caption="Promoter Steel Footprint"
                    description="Managing Director Shri Vijay Gupta brings over 25 years across ferro alloys, steel manufacturing, real estate, and bulk international exports."
                  >
                    Captain Steel India
                  </CursorCard>{' '}
                  co-founded by Managing Director Shri Vijay Gupta—the group built deep institutional relationships across primary steelmaking, raw ore procurement, and East Coast export logistics.
                </p>
                <p>
                  From first submerged-arc furnaces commissioned in 2010 to multi-unit operations spanning{' '}
                  <CursorCard
                    imageSrc={ASSETS.officialAerialComplex.src}
                    imageAlt={ASSETS.officialAerialComplex.alt}
                    caption="Vizianagaram Works"
                    description="Integrated smelting bays, 6,000 MT/month AOD converter, and ₹1,200 crore project allocation across 93.43 acres in Andhra Pradesh."
                  >
                    Bobbili Growth Centre
                  </CursorCard>{' '}
                  (Vizianagaram, Andhra Pradesh) and{' '}
                  <CursorCard
                    imageSrc={ASSETS.milestone2025Visual.src}
                    imageAlt={ASSETS.milestone2025Visual.alt}
                    caption="Jharkhand Operations"
                    description="Existing 24 MVA operations paired with Unit-2 Kadambera DRI & planned 90 MW waste heat recovery expansion."
                  >
                    Kadambeda Village / Dhalbhumgarh
                  </CursorCard>{' '}
                  (Singhbhum East, Jharkhand), the company links eastern India’s mineral belt directly to global vessels via{' '}
                  <CursorCard
                    imageSrc={ASSETS.portLogistics.src}
                    imageAlt={ASSETS.portLogistics.alt}
                    caption="Three Star Export Corridor"
                    description="Visakhapatnam regional director office and deep-water port infrastructure enabling global container and bulk dispatch."
                  >
                    Visakhapatnam Harbour Port
                  </CursorCard>
                  .
                </p>
                <p className="text-xs font-mono-tabular text-brand dark:text-[#69C5F5]">
                  Tip: Hover or focus any dashed underline above to inspect site imagery.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="group relative inline-flex items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#10243A] hover:text-brand dark:text-[#F4F8FC] dark:hover:text-[#69C5F5] transition-colors duration-300"
                >
                  <span>Read Complete Corporate Profile</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[1.5px] bg-brand dark:bg-[#69C5F5] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </Link>
                <Link
                  to="/documents"
                  className="group relative inline-flex items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#465C72] hover:text-[#10243A] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC] transition-colors duration-300"
                >
                  <span>Statutory Filings (MGT-7 & CSR)</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#10243A] dark:bg-[#F4F8FC] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </Link>
              </div>
            </div>

            {/* Official Aerial Complex + Corporate House Pair */}
            <div className="lg:col-span-5 space-y-6">
              <figure className="bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden">
                <ImageReveal direction="up" className="aspect-[16/10] bg-[#10243A]">
                  <ResilientImage
                    src={ASSETS.officialAerialComplex.src}
                    alt={ASSETS.officialAerialComplex.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#465C72] dark:text-[#B5C5D7] border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                  {ASSETS.officialAerialComplex.caption}
                </figcaption>
              </figure>

              <figure className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 grid grid-cols-12 overflow-hidden items-center">
                <div className="col-span-5 aspect-[4/3] bg-[#10243A] overflow-hidden">
                  <ResilientImage
                    src={ASSETS.corporateHouse.src}
                    alt={ASSETS.corporateHouse.alt}
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="col-span-7 p-4 space-y-1">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                    Corporate Infrastructure
                  </p>
                  <p className="text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Kolkata Registered Office & Announced Chowringhee Hub
                  </p>
                  <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    Active headquarters at 21A, Shakespeare Sarani; upcoming office announced at 56, Chowringhee Road, Kolkata.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Factual Heritage Strip */}
          <dl className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14 divide-y md:divide-y-0 md:divide-x divide-[#10243A]/15 dark:divide-[#F4F8FC]/14">
            <div className="py-6 md:pr-8">
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                Founding Pillar
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-1">
                {COMPANY_INFO.legacyNarrative.founderName}
              </dd>
              <dd className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">
                Visionary founder of the DKG Group whose industrial discipline anchors Berry Alloys Limited.
              </dd>
            </div>
            <div className="py-6 md:px-8">
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                Public Incorporation
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-1">
                {COMPANY_INFO.incorporationDate}
              </dd>
              <dd className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">
                Registered under CIN {COMPANY_INFO.cin} (RoC Kolkata, West Bengal).
              </dd>
            </div>
            <div className="py-6 md:pl-8">
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                Eastern & Coastal Corridor
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-1">
                Bobbili · Dhalbhumgarh
              </dd>
              <dd className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">
                Smelting works across Andhra Pradesh and Jharkhand connected directly to Visakhapatnam Port.
              </dd>
            </div>
          </dl>

          {/* Interactive 3D Corporate Heritage Dossier */}
          <InteractiveBook
            coverTitle="Berry Alloys Heritage Dossier"
            coverSubtitle="DKG Group Lineage, Eastern & Coastal Smelting Corridor, Ratings & 2026+ Milestones"
            pages={CORPORATE_DOSSIER_PAGES}
          />
        </div>
      </section>

      {/* 03 / CHRONICLE — Interactive 2010–2026+ Growth Story */}
      <section
        id="chronicle"
        aria-labelledby="chronicle-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F1F6FB] text-[#10243A] dark:bg-[#0D1B2E] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#10243A]/14 dark:border-[#F4F8FC]/12">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                03 / Growth Chronicle (2010–2026+)
              </p>
              <h2
                id="chronicle-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              >
                From 2 × 10 MVA smelting bays to Three Star Export House scale
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] max-w-md leading-relaxed">
              Explore every documented expansion milestone from 2010 commissioning through 2023 AOD/CBAM readiness, 2025 DRI integration works, and 2026 project announcements.
            </p>
          </div>

          <GrowthChronicle />
        </div>
      </section>

      {/* 04 / LEADERSHIP — Promoters, Managing Director Portrait, Mission & Core Values */}
      <section
        id="leadership"
        aria-labelledby="leadership-section-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-16">
          <DirectorPortraitSection variant="home" />

          {/* People Behind the Furnaces — Workforce Culture & Teams Storytelling */}
          <div className="pt-12 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-7 space-y-2.5">
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Workforce & Workplace Culture · {COMPANY_INFO.workforceStory.motto}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                  {COMPANY_INFO.workforceStory.headline}
                </h3>
              </div>
              <div className="lg:col-span-5 space-y-3">
                <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {COMPANY_INFO.workforceStory.narrative}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-1.5 text-brand dark:text-[#69C5F5] hover:underline"
                  >
                    Careers & Plant Teams
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/community"
                    className="inline-flex items-center gap-1.5 text-[#10243A] dark:text-[#F4F8FC] hover:underline"
                  >
                    Health Camps & Welfare
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 divide-y sm:divide-y-0 sm:divide-x divide-[#10243A]/12 dark:divide-[#F4F8FC]/12 bg-white dark:bg-[#12243B]">
              {COMPANY_INFO.workforceStory.highlights.map((item) => (
                <div key={item.metric} className="p-4 sm:p-5 space-y-1">
                  <p className="font-display text-xl sm:text-2xl font-bold uppercase text-brand dark:text-[#69C5F5]">
                    {item.metric}
                  </p>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  asset: ASSETS.teamFurnaceEngineers,
                  role: 'Smelting & Control Bay',
                  title: 'Submerged-Arc Furnace Engineers',
                },
                {
                  asset: ASSETS.teamMetallurgyLab,
                  role: 'Assay & Traceability',
                  title: 'QA Chemists & Laboratory Team',
                },
                {
                  asset: ASSETS.teamSafetyHuddle,
                  role: 'ISO 45001 · Zero Harm',
                  title: 'Shift Safety & Shopfloor Supervisors',
                },
              ].map((card) => (
                <figure
                  key={card.asset.id}
                  className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden flex flex-col"
                >
                  <div className="aspect-[16/10] bg-[#10243A] overflow-hidden">
                    <ResilientImage
                      src={card.asset.src}
                      alt={card.asset.alt}
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <figcaption className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                        {card.role}
                      </p>
                      <h4 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                        {card.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed pt-1">
                      {card.asset.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* 6 Core Values Ledger */}
          <div className="pt-10 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5] mb-1">
                  Core Operating Pillars
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Six Core Operating Values
                </h3>
              </div>

              <div className="flex items-center gap-4 border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-white dark:bg-[#12243B] px-5 py-2">
                <span className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5] whitespace-nowrap">
                  Live Pillar:
                </span>
                <FlipFadeText
                  className="min-h-[38px]"
                  textClassName="text-xl sm:text-2xl"
                />
              </div>

              <Link
                to="/about"
                className="text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
              >
                Explore Full Governance →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {COMPANY_INFO.values.map((val, idx) => (
                <SpotlightSurface
                  key={val.title}
                  className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-5 space-y-2"
                >
                  <span className="font-mono-tabular text-xs font-semibold text-brand dark:text-[#69C5F5]">
                    0{idx + 1}
                  </span>
                  <h4 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {val.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {val.description}
                  </p>
                </SpotlightSurface>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05 / ALLOYS — Interactive Alloy Explorer (#alloys) */}
      <HomeAlloyShowcase onEnquireAlloy={handleEnquireAlloy} />

      {/* Scroll-Driven Shader Dissolve Bridge: Integrated Complex -> Submerged-Arc Reduction */}
      <ScrollDissolveReveal
        image1={ASSETS.officialAerialComplex.src}
        image2={ASSETS.heroSmelting.src}
        image1Alt={ASSETS.officialAerialComplex.alt}
        image2Alt={ASSETS.heroSmelting.alt}
        leftKicker="Stage 01 · Bobbili & Jharkhand Complexes"
        leftTitle="Raw Charge To Furnace Floor"
        leftDescription="Manganese, quartz, chromite, and metallurgical coke staged across Eastern and Coastal Indian smelting sheds."
        rightKicker="Stage 02 · Thermal & AOD Precision"
        rightTitle="From Heat To Precision"
        rightDescription="Submerged-arc tapping paired with 6,000 MT/month AOD decarburisation and traceable spectrographic testing."
      />

      {/* 06 / PROCESS — Pinned Desktop Manufacturing Sequence (#process) */}
      <ManufacturingScrollStory />

      {/* 07 / QUALITY — Systems, Ratings, ET Edge 2026 & Chemistry Table */}
      <section
        id="quality"
        aria-labelledby="technical-confidence-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F1F6FB] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                07 / Quality & Recognition
              </p>
              <h2
                id="technical-confidence-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              >
                Verified elemental limits & institutional credentials
              </h2>
              <p className="text-base text-[#465C72] dark:text-[#B5C5D7] leading-relaxed max-w-[60ch]">
                Steelmaking furnaces rely on predictable chemistry, controlled residual phosphorus and sulfur, and verified particle sizing. Berry Alloys publishes grade tolerances across ten product series while maintaining quality, safety, environmental, and carbon reporting systems.
              </p>

              {/* ISO Standards */}
              <div className="border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 pt-5 space-y-4">
                <h3 className="font-mono-tabular text-xs uppercase tracking-wider text-[#10243A] dark:text-[#F4F8FC]">
                  Website-Reported ISO Management Systems
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {CERTIFICATIONS.map((c) => (
                    <SpotlightSurface
                      key={c.code}
                      className="border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-white dark:bg-[#12243B] p-3.5"
                    >
                      <AnimatedTooltip
                        variant="graphite"
                        label={c.code}
                        sublabel={c.scope}
                      >
                        <p
                          tabIndex={0}
                          className="font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC] underline decoration-dotted underline-offset-4 cursor-help focus-visible:outline-none"
                        >
                          {c.code}
                        </p>
                      </AnimatedTooltip>
                      <p className="text-[#465C72] dark:text-[#B5C5D7] mt-0.5">{c.scope}</p>
                    </SpotlightSurface>
                  ))}
                </div>
              </div>

              {/* Displayed Credentials + Official ET Edge 2026 Crest */}
              <div className="border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 pt-5 space-y-4">
                <h3 className="font-mono-tabular text-xs uppercase tracking-wider text-[#10243A] dark:text-[#F4F8FC]">
                  Displayed Ratings, Awards & Affiliations
                </h3>

                <div className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0 bg-[#FFFFFF] border border-[#10243A]/10 p-1.5 flex items-center justify-center">
                    <img
                      src={ASSETS.awardEtEdge2026.src}
                      alt={ASSETS.awardEtEdge2026.alt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                      ET Edge Best Organization to Work 2026
                    </p>
                    <p className="text-[#465C72] dark:text-[#B5C5D7]">
                      Workplace recognition displayed on Berry Alloys Limited’s official website alongside credit ratings CRISIL A- & ICRA AA-.
                    </p>
                  </div>
                </div>

                <ul className="divide-y divide-[#10243A]/10 dark:divide-[#F4F8FC]/10 border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-white dark:bg-[#12243B] text-xs">
                  {CREDENTIALS_AND_AWARDS.map((item) => (
                    <li
                      key={item.title}
                      className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                    >
                      <span className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                        {item.title}
                      </span>
                      <span className="text-[#465C72] dark:text-[#B5C5D7] sm:text-right">
                        {item.detail}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Industry affiliations displayed on the company site: {MEMBERSHIPS.map((m) => `${m.name} (${m.role})`).join('; ')}. Homepage also references steelmaker client POSCO. Rating instruments and certificate archives remain pending audit confirmation.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <figure className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden">
                <ImageReveal direction="left" className="aspect-video bg-[#10243A]">
                  <ResilientImage
                    src={ASSETS.qualityLab.src}
                    alt={ASSETS.qualityLab.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#465C72] dark:text-[#B5C5D7] border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                  {ASSETS.qualityLab.caption}
                </figcaption>
              </figure>

              {/* Representative Chemistry Extract Across All 4 Alloy Families */}
              <div className="bg-white dark:bg-[#12243B] border border-[#10243A]/15 dark:border-[#F4F8FC]/14 overflow-hidden">
                <div className="px-5 py-3.5 bg-[#FFFFFF] dark:bg-[#0D1B2E] border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 flex items-center justify-between gap-4">
                  <span className="font-mono-tabular text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Representative Grade Extract Across All 4 Alloy Families
                  </span>
                  <Link
                    to="/products"
                    className="group relative inline-flex items-center gap-1 pb-0.5 text-xs font-semibold text-brand dark:text-[#69C5F5] whitespace-nowrap transition-colors duration-300"
                  >
                    <span>All 10 Tables</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[1.5px] bg-brand dark:bg-[#69C5F5] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px] text-xs">
                    <thead>
                      <tr className="border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 text-[#465C72] dark:text-[#B5C5D7]">
                        <th className="py-2.5 px-4 font-semibold">Grade Series</th>
                        <th className="py-2.5 px-3 font-semibold">Primary Element</th>
                        <th className="py-2.5 px-3 font-semibold">C (max)</th>
                        <th className="py-2.5 px-3 font-semibold">P (max)</th>
                        <th className="py-2.5 px-3 font-semibold">S (max)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#10243A]/10 dark:divide-[#F4F8FC]/10 font-mono-tabular">
                      <tr>
                        <td className="py-2.5 px-4 font-sans font-medium text-[#10243A] dark:text-[#F4F8FC]">
                          <Link
                            to="/products/high-carbon-ferro-manganese"
                            className="hover:text-brand dark:hover:text-[#69C5F5] underline-offset-2 hover:underline"
                          >
                            HC FeMn · 78%
                          </Link>
                        </td>
                        <td className="py-2.5 px-3">Mn 78% min</td>
                        <td className="py-2.5 px-3">6–8%</td>
                        <td className="py-2.5 px-3">0.30%</td>
                        <td className="py-2.5 px-3">0.03%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-sans font-medium text-[#10243A] dark:text-[#F4F8FC]">
                          <Link
                            to="/products/high-carbon-ferro-manganese"
                            className="hover:text-brand dark:hover:text-[#69C5F5] underline-offset-2 hover:underline"
                          >
                            HC FeMn · Low Phos
                          </Link>
                        </td>
                        <td className="py-2.5 px-3">Mn 65–76% min</td>
                        <td className="py-2.5 px-3">6–8%</td>
                        <td className="py-2.5 px-3">0.1%</td>
                        <td className="py-2.5 px-3">0.02%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-sans font-medium text-[#10243A] dark:text-[#F4F8FC]">
                          <Link
                            to="/products/high-carbon-silico-manganese"
                            className="hover:text-brand dark:hover:text-[#69C5F5] underline-offset-2 hover:underline"
                          >
                            HC SiMn · 65 / 16
                          </Link>
                        </td>
                        <td className="py-2.5 px-3">Mn 65% min · Si 16%*</td>
                        <td className="py-2.5 px-3">2–2.20%</td>
                        <td className="py-2.5 px-3">0.30%</td>
                        <td className="py-2.5 px-3">0.04%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-sans font-medium text-[#10243A] dark:text-[#F4F8FC]">
                          <Link
                            to="/products/low-medium-carbon-ferro-chrome"
                            className="hover:text-brand dark:hover:text-[#69C5F5] underline-offset-2 hover:underline"
                          >
                            LC FeCr · 60-65
                          </Link>
                        </td>
                        <td className="py-2.5 px-3">Cr 60–65% min</td>
                        <td className="py-2.5 px-3">0.1%</td>
                        <td className="py-2.5 px-3">0.04%</td>
                        <td className="py-2.5 px-3">0.03%</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-sans font-medium text-[#10243A] dark:text-[#F4F8FC]">
                          <Link
                            to="/products/ferro-silicon"
                            className="hover:text-brand dark:hover:text-[#69C5F5] underline-offset-2 hover:underline"
                          >
                            FeSi · 72
                          </Link>
                        </td>
                        <td className="py-2.5 px-3">Si 72% min</td>
                        <td className="py-2.5 px-3">0.15%</td>
                        <td className="py-2.5 px-3">0.04%</td>
                        <td className="py-2.5 px-3">0.02%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="px-4 py-2.5 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 bg-[#FFFFFF]/60 dark:bg-[#0D1B2E] text-[11px] text-[#465C72] dark:text-[#B5C5D7]">
                  *Preserves source-reported Si column qualifiers verbatim. Full elemental tables and sizing notes are available per grade series.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 4x2 Stacked Credential Hover Grid */}
          <div className="pt-10 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Interactive Institutional Matrix
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Standards, Credit Ratings & Industry Bodies
                </h3>
              </div>
              <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                Cells cycle automatically across paired ISO systems, ratings, and export credentials.
              </p>
            </div>
            <CredentialStackedMatrix />
          </div>

          {/* 3D Perspective Plate Deck */}
          <div className="pt-10 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14">
            <PerspectiveCarousel
              slides={QA_PERSPECTIVE_SLIDES}
              heading="QA Lab & Certified Specimen Plates"
            />
          </div>
        </div>
      </section>

      {/* 08 / RESPONSIBILITY — Sustainability Scope & Visual Grassroots CSR */}
      <section
        id="responsibility"
        aria-labelledby="responsibility-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#FFFFFF] text-[#10243A] dark:bg-[#0D1B2E] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-20">
          {/* Part 1: Energy & Environmental Stewardship */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  08 / Sustainability & Community Stewardship
                </p>
                <h2
                  id="responsibility-heading"
                  className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
                >
                  Energy disclosure kept distinct from future expansion
                </h2>
                <GooeyTextReveal>
                  <p
                    data-gooey-reveal-item=""
                    className="text-sm sm:text-base text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed max-w-[60ch]"
                  >
                    Smelting ferro alloys is energy-intensive. Berry Alloys separates documented operational renewable generation from planned Ghatsila waste heat recovery projects and exploratory biomass evaluations rather than combining unverified figures.
                  </p>
                </GooeyTextReveal>
              </div>

              <div className="border-t border-b border-[#10243A]/14 dark:border-[#F4F8FC]/14 divide-y divide-[#10243A]/12 dark:divide-[#F4F8FC]/12">
                <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                  <div className="sm:col-span-4">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                      Reported Operational
                    </p>
                    <p className="font-display text-2xl font-bold text-[#10243A] dark:text-[#F4F8FC] mt-0.5">
                      83 MW Solar · 29.6 MW Wind
                    </p>
                  </div>
                  <p className="sm:col-span-8 text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    Disclosed on the company sustainability page; reported separately from the 2.6 MW homepage solar installation notice pending scope reconciliation.
                  </p>
                </div>

                <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                  <div className="sm:col-span-4">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                      Planned Project Scope
                    </p>
                    <p className="font-display text-2xl font-bold text-[#10243A] dark:text-[#F4F8FC] mt-0.5">
                      90 MW WHR + 2 × 1,000 TPD DRI
                    </p>
                  </div>
                  <p className="sm:col-span-8 text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    Planned waste heat recovery and direct reduced iron expansion at Ghatsila alongside existing 24 MVA furnace operations.
                  </p>
                </div>

                <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                  <div className="sm:col-span-4">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                      Exploratory Research
                    </p>
                    <p className="font-display text-2xl font-bold text-[#10243A] dark:text-[#F4F8FC] mt-0.5">
                      Biomass Reductants
                    </p>
                  </div>
                  <p className="sm:col-span-8 text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    Early-stage exploration of biomass carbon substitutes alongside AOD low-carbon ferro alloy grades and Q4 2023 CBAM reporting; no commercial substitution volume claimed.
                  </p>
                </div>
              </div>

              <div>
                <IndustrialButton to="/sustainability" variant="primary">
                  Full Sustainability Disclosures
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </IndustrialButton>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pt-6">
              <figure className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden">
                <ImageReveal direction="up" className="aspect-video bg-[#10243A]">
                  <ResilientImage
                    src={ASSETS.officialSolarRoof.src}
                    alt={ASSETS.officialSolarRoof.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#465C72] dark:text-[#B5C5D7] border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                  {ASSETS.officialSolarRoof.caption}
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Part 2: Grassroots CSR Photography & Featured Camp */}
          <div className="pt-14 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden">
              <div className="lg:col-span-6 bg-[#10243A] aspect-video lg:aspect-auto min-h-[260px]">
                <ResilientImage
                  src={ASSETS.csrMedicalCamp.src}
                  alt={ASSETS.csrMedicalCamp.alt}
                  containerClassName="w-full h-full"
                />
              </div>
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                    Community & Workforce Welfare · {featuredCamp.dateOrLocation}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                    {featuredCamp.title}
                  </h3>
                  <p className="text-sm text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed">
                    {featuredCamp.summary}
                  </p>
                  <ul className="space-y-2 pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-xs text-[#465C72] dark:text-[#B5C5D7]">
                    {featuredCamp.details.map((detail) => (
                      <li key={detail} className="leading-relaxed">
                        — {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    to="/community"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand hover:text-[#10243A] dark:text-[#69C5F5] dark:hover:text-[#F4F8FC] transition-colors"
                  >
                    All Community & CSR Programmes
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Interactive Diagonal Fieldwork Carousel */}
            <DiagonalCarousel
              slides={CSR_DIAGONAL_SLIDES}
              eyebrow="Grassroots CSR & Community Fieldwork"
            />

            {/* Additional Documented Memorial & Education Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {csrSecondaryStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-5 space-y-1.5"
                >
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                    {story.category} · {story.dateOrLocation}
                  </p>
                  <h4 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {story.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {story.summary}
                  </p>
                </article>
              ))}
            </div>

            {/* Part 3: Life & Culture at Berry Alloys (ImageScatter) + Pointer Image Trail */}
            <div className="pt-10 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/12 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                    Life & Culture at Berry Alloys
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    Workplace Pride, Medical Camps & Ecological Care
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <Link
                    to="/community"
                    className="text-brand dark:text-[#69C5F5] hover:underline"
                  >
                    Community Programs →
                  </Link>
                  <Link
                    to="/careers"
                    className="text-[#10243A] dark:text-[#F4F8FC] hover:underline"
                  >
                    Workplace & Careers →
                  </Link>
                </div>
              </div>

              <ImageScatter imageSets={LIFE_CULTURE_SCATTER_SETS} />

              <PixelatedImageTrail
                images={GALLERY_ITEMS.slice(0, 8).map((a) => a.src)}
                className="bg-[#07111F] text-[#F4F8FC] border border-[#10243A]/18 dark:border-[#F4F8FC]/14 bg-[radial-gradient(circle_at_20%_20%,rgba(40,148,204,0.16),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(201,35,59,0.10),transparent_50%)] p-6 sm:p-10 lg:p-14 min-h-[480px] sm:min-h-[560px] lg:min-h-[680px] flex flex-col justify-between"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                  <span>Interactive Archive Trail</span>
                  <span className="inline-flex items-center gap-2 text-[#B5C5D7]">
                    <span aria-hidden="true" className="relative inline-flex h-2 w-2">
                      <span className="hero-breathe absolute inline-flex h-full w-full rounded-full bg-[#FF8091] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF8091]" />
                    </span>
                    Move your cursor or drag a finger across the surface to reveal works &amp; people frames
                  </span>
                </div>
                <div className="py-6 space-y-4 max-w-2xl bg-gradient-to-r from-[#07111F]/85 via-[#07111F]/60 to-transparent -mx-2 px-2">
                  <h4 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#F4F8FC] leading-[0.95]">
                    People, Plant Infrastructure & Community Fieldwork
                  </h4>
                  <p className="text-sm text-[#F4F8FC]/82 leading-relaxed">
                    Every tonne shipped from Bobbili and Dhalbhumgarh reflects plant engineers, laboratory analysts, safety stewards, and regional community partnerships.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#69C5F5] hover:underline"
                  >
                    Explore Workplace & Roles
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <a
                    href="#plant-gallery"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToChapter('plant-gallery');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F4F8FC]/85 hover:underline"
                  >
                    Inspect Full Plant Gallery
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </PixelatedImageTrail>
            </div>
          </div>
        </div>
      </section>

      {/* 09 / PRESENCE — Interactive Indian Facilities & Port Corridor */}
      <section
        id="presence"
        aria-labelledby="presence-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F1F6FB] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/12">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                09 / Global Presence
              </p>
              <h2
                id="presence-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              >
                Engineered in India. Connected to the world.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] max-w-md leading-relaxed">
              Berry Alloys manufactures in India and exports to around 35 countries (ICRA, August 2026). The globe shows the Indian works and port, plus every export country named in published sources.
            </p>
          </div>

          <GlobalPresenceSection />

          <LogisticsJourney />

          <FacilityCorridorMap />

          <div className="pt-8 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/12 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Interactive Site Directory
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Works, Export Gateways & Corporate Hubs
                </h3>
              </div>
              <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                Hover or focus any site row to unveil facility preview imagery.
              </p>
            </div>
            <ImageRevealList items={PLANT_REVEAL_ROWS} />
          </div>
        </div>
      </section>

      {/* 10 / UPDATES — Plant Gallery & Editorial Company Updates */}
      <section
        id="updates"
        aria-labelledby="news-heading"
        className="scroll-mt-20 bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC]"
      >
        <PlantMediaGallery embedded />

        <div className="py-20 lg:py-24 bg-[#FFFFFF] dark:bg-[#07111F] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
            <ImageTrail
              images={GALLERY_ITEMS.slice(0, 6).map((item) => ({ src: item.src, alt: item.alt }))}
              className="border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-[#F1F6FB]/55 dark:bg-[#0D1B2E]/70 p-6 sm:p-8 mb-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5] mb-2">
                    10 / News & Technical Articles · Hover Banner for Field Trail
                  </p>
                  <h2
                    id="news-heading"
                    className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
                  >
                    Recent company announcements & metallurgy notes
                  </h2>
                </div>
                <Link
                  to="/news"
                  className="group relative inline-flex items-center gap-1.5 pb-1 text-xs font-semibold uppercase tracking-wider text-[#10243A] hover:text-brand dark:text-[#F4F8FC] dark:hover:text-[#69C5F5] transition-colors duration-300 whitespace-nowrap"
                >
                  <span>{`All Updates (${NEWS_ITEMS.length})`}</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[1.5px] bg-brand dark:bg-[#69C5F5] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </Link>
              </div>
            </ImageTrail>

            <div className="divide-y divide-[#10243A]/12 dark:divide-[#F4F8FC]/12 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
              {curatedUpdates.map((item) => (
                <article
                  key={item.slug}
                  className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline group"
                >
                  <div className="lg:col-span-3 flex items-center gap-3 text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                    <time>{item.date}</time>
                    <span aria-hidden="true">/</span>
                    <span className="text-brand dark:text-[#69C5F5] font-medium">
                      {item.type}
                    </span>
                  </div>
                  <div className="lg:col-span-7 space-y-1.5">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC] group-hover:text-brand dark:group-hover:text-[#69C5F5] transition-colors">
                      <Link to={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="lg:col-span-2 lg:text-right">
                    <Link
                      to={`/news/${item.slug}`}
                      className="group/link relative inline-flex items-center gap-1.5 pb-0.5 text-xs font-semibold text-[#10243A] hover:text-brand dark:text-[#F4F8FC] dark:hover:text-[#69C5F5] transition-colors duration-300 whitespace-nowrap"
                    >
                      <span>Read Summary</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-1"
                        aria-hidden="true"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[1.5px] bg-brand dark:bg-[#69C5F5] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11 / FAQ — Concise Pre-Enquiry Questions */}
      <HomeFaqSection />

      <InsightsPreview />

      {/* 12 / ENQUIRY — Commercial Quotation Desk & Offices */}
      <section
        id="enquiry"
        aria-labelledby="home-enquiry-heading"
        className="scroll-mt-20 relative overflow-hidden bg-[#FFFFFF] text-[#10243A] dark:bg-[#10243A] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 py-20 lg:py-28"
      >
        <div className="hidden dark:block absolute inset-0 opacity-85 pointer-events-none">
          <MetallicShaderCanvas />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Sourced Offices & Direct Commercial Channels */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  12 / Commercial Quotation Desk
                </p>
                <h2
                  id="home-enquiry-heading"
                  className="font-display fluid-statement font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]"
                >
                  Specify your alloy chemistry, lump sizing, and dispatch schedule.
                </h2>
                <p className="text-sm sm:text-base text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed">
                  Submit a product quotation or commercial enquiry directly below, or reach our offices in Kolkata, Visakhapatnam, and Dhalbhumgarh.
                </p>
              </div>

              <div className="divide-y divide-[#10243A]/12 dark:divide-[#F4F8FC]/12 border-t border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
                {OFFICES.map((office) => (
                  <div key={office.id} className="py-4 space-y-1.5">
                    <h3 className="font-display text-lg font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] flex items-center gap-2">
                      <MapPin
                        className="w-4 h-4 text-brand dark:text-[#69C5F5] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{office.label}</span>
                    </h3>
                    <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed pl-6">
                      {office.address}
                    </p>
                    <div className="pl-6 flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono-tabular text-[#10243A]/85 dark:text-[#F4F8FC]/85">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone
                          className="w-3.5 h-3.5 text-brand dark:text-[#69C5F5]"
                          aria-hidden="true"
                        />
                        {office.phone}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail
                          className="w-3.5 h-3.5 text-brand dark:text-[#69C5F5]"
                          aria-hidden="true"
                        />
                        {office.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-[#0D1B2E]/90 border border-[#10243A]/14 dark:border-[#F4F8FC]/15 p-4 space-y-1">
                <p className="text-xs font-semibold text-brand dark:text-[#69C5F5]">
                  {UPCOMING_OFFICE_NOTICE.title}: {UPCOMING_OFFICE_NOTICE.address}
                </p>
                <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  {UPCOMING_OFFICE_NOTICE.note}
                </p>
              </div>
            </div>

            {/* Live Interactive Quotation & General Enquiry Form */}
            <div className="lg:col-span-7">
              <EnquiryFormPanel
                selectedProductSlug={enquiryProductSlug}
                onProductChange={setEnquiryProductSlug}
                variant="auto"
                idPrefix="home-enquiry"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
