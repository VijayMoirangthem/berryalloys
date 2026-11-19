import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Briefcase, FileText, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ASSETS } from '../data/assets';
import { AWARD_RECORDS } from '../data/awards';
import {
  CERTIFICATIONS,
  COMPANY_INFO,
  MEMBERSHIPS,
  OFFICES,
  UPCOMING_OFFICE_NOTICE,
} from '../data/company';
import {
  CAREERS_DEPARTMENTS,
  CORPORATE_DOCUMENT_GROUPS,
  CSR_STORIES,
  JOB_VACANCIES,
  NEWS_ITEMS,
} from '../data/communityNewsCareersDocs';
import { CredentialLogoMarquee, CredentialStackedMatrix } from '../data/CredentialMatrices';
import {
  BERRY_COMPENDIUM_BOOKS,
  CORPORATE_DOSSIER_PAGES,
  CSR_DIAGONAL_SLIDES,
  FUNCTIONAL_STEWARD_AVATARS,
  GLOBAL_CAPABILITY_SPOTLIGHT_ITEMS,
  HOME_CAREERS_SCATTER_SETS,
  HOME_PIXEL_TRAIL_IMAGES,
  PLANT_REVEAL_ROWS,
  QA_PERSPECTIVE_SLIDES,
} from '../data/showcaseCollections';
import { useGuide } from '../context/GuideContext';
import { BerryMonogram } from '../components/BerryMonogram';
import { BrandLockup } from '../components/BrandLockup';
import { ChapterRail } from '../components/ChapterRail';
import { CleanEnergyJourney } from '../components/CleanEnergyJourney';
import { ClientLogoStrip } from '../components/ClientLogoStrip';
import { InsightsPreview } from '../components/InsightsPreview';
import { DirectorPortraitSection } from '../components/DirectorPortraitSection';
import { EnquiryFormPanel } from '../components/EnquiryFormPanel';
import { FacilityCorridorMap } from '../components/FacilityCorridorMap';
import { GlobalPresenceSection } from '../components/GlobalPresenceSection';
import { LogisticsJourney } from '../components/LogisticsJourney';
import { GrowthChronicle } from '../components/GrowthChronicle';
import { HomeAlloyShowcase } from '../components/HomeAlloyShowcase';
import { HomeAwardsSection } from '../components/HomeAwardsSection';
import { HomeFaqSection } from '../components/HomeFaqSection';
import { ManufacturingScrollStory } from '../components/ManufacturingScrollStory';
import { MetallicShaderCanvas } from '../components/MetallicShaderCanvas';
import { PlantMediaGallery } from '../components/PlantMediaGallery';
import { ResilientImage } from '../components/ResilientImage';
import { SmeltingRefiningJourney } from '../components/SmeltingRefiningJourney';
import { ImageReveal } from '../components/motion/ImageReveal';
import { ScrollReveal } from '../components/motion/ScrollReveal';
import { useIndustrialReveals } from '../components/motion/useIndustrialReveals';
import { useMobileMotion } from '../components/motion/useMobileMotion';
import { ScrollCue } from '../components/motion/ScrollCue';
import { SplitText } from '../components/motion/SplitText';
import { SpotlightSurface } from '../components/motion/SpotlightSurface';
import { AnimatedTooltip } from '../components/ui/AnimatedTooltip';
import { BookCfg, BooksShowcase } from '../components/ui/BooksShowcase';
import { CursorCard } from '../components/ui/CursorCard';
import { DiagonalCarousel } from '../components/ui/DiagonalCarousel';
import { FlipFadeText } from '../components/ui/FlipFadeText';
import { FlipText } from '../components/ui/FlipText';
import { GooeyTextReveal } from '../components/ui/GooeyTextReveal';
import { ImageRevealList } from '../components/ui/ImageRevealList';
import { ImageScatter } from '../components/ui/ImageScatter';
import { IndustrialButton } from '../components/ui/IndustrialButton';
import { InteractiveBook } from '../components/ui/InteractiveBook';
import { InteractiveParticles } from '../components/ui/InteractiveParticles';
import { MagneticSpotlightMarquee } from '../components/ui/MagneticSpotlightMarquee';
import { MaskedAvatars } from '../components/ui/MaskedAvatars';
import { MorphText } from '../components/ui/MorphText';
import { PerspectiveCarousel } from '../components/ui/PerspectiveCarousel';
import { PerspectiveGrid } from '../components/ui/PerspectiveGrid';
import { PixelatedImageTrail } from '../components/ui/PixelatedImageTrail';
import { ScrollDissolveReveal } from '../components/ui/ScrollDissolveReveal';
import { onLoaderCleared, setMotionInitStatus } from '../lib/motionDiagnostics';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const navigate = useNavigate();
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
    if (prefersReduced || !heroSectionRef.current) {
      setMotionInitStatus('heroGsap', prefersReduced ? 'reduced-motion' : 'skipped');
      return;
    }

    ScrollTrigger.config({ ignoreMobileResize: true });
    setMotionInitStatus('heroGsap', 'active');
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
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
    });

    mm.add('(max-width: 1023px)', () => {
      const heroRevealTween = gsap.from('.hero-reveal', {
        y: 14,
        opacity: 0.25,
        duration: 0.52,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top 95%',
          once: true,
          invalidateOnRefresh: true,
        },
      });

      if (heroMediaRef.current) {
        gsap.to(heroMediaRef.current, {
          yPercent: 6,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3,
          },
        });
      }

      const sweepHero = () => {
        if (!heroSectionRef.current) return;
        const rect = heroSectionRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.96 && heroRevealTween.progress() === 0) {
          heroRevealTween.play();
        }
      };
      window.addEventListener('scroll', sweepHero, { passive: true });
      const unsub = onLoaderCleared(() => {
        ScrollTrigger.refresh();
        sweepHero();
      });

      return () => {
        window.removeEventListener('scroll', sweepHero);
        unsub();
      };
    });

    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
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

  const handleBookPrimary = (book: BookCfg) => {
    if (book.targetRoute) {
      navigate(book.targetRoute);
      return;
    }
    navigate('/documents');
  };

  const handleBookSecondary = (book: BookCfg) => {
    if (book.id === 'femn-aod-handbook' || book.id === 'simn-fesi-fecr-compendium') {
      scrollToChapter('enquiry');
      return;
    }
    if (book.id === 'csr-community-chronicle') {
      navigate('/careers');
      return;
    }
    navigate(book.targetRoute ?? '/documents');
  };

  useIndustrialReveals(pageRootRef, ['overview', 'process', 'leadership', 'alloys']);
  useMobileMotion(pageRootRef);

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
        <div className="relative z-10 flex-1 flex items-center justify-center max-w-[1440px] w-full mx-auto px-2 sm:px-6 lg:px-8 pt-2 pb-14 sm:pb-12">
          <ScrollCue />
          <InteractiveParticles
            className="w-full h-[50svh] sm:h-[58svh] lg:h-[64svh] min-h-[300px] max-h-[620px]"
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
        <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 pb-20 sm:pb-7 pt-3 border-t border-accent-red/70 sm:pr-[116px] lg:pr-[220px] xl:pr-[220px] 2xl:pr-[220px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
              Interactive Particle Forging Field
            </p>
            <p className="text-xs text-ink-2">
              <span className="lg:hidden">Tap or swipe across the alloy typography to scatter particles · Bulk Ferro Alloys Manufacturer</span>
              <span className="hidden lg:inline">Move cursor or swipe across the alloy typography to scatter particles · Bulk Ferro Alloys Manufacturer</span>
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
                  triggerOnScroll
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
                    variant="smaug"
                    content="DGFT Three Star Export House"
                    sublabel="Sustained bulk export corridor"
                    accentColor="#69C5F5"
                    shapeColor="#07111F"
                    textColor="#F4F8FC"
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
            <span className="text-brand dark:text-[#69C5F5]">
              <span className="lg:hidden">Tap Ribbon To Pause</span>
              <span className="hidden lg:inline">Hover Ribbon To Pause</span>
            </span>
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
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Late Shri Dashrath Kumar Gupta
                  </strong>
                  , founder of the DKG Group, Berry Alloys Limited translates multi-generational trading and manufacturing discipline into high-temperature metallurgical execution.
                </p>
                <p>
                  Within the broader promoter entrepreneurial footprint—including{' '}
                  <strong className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                    Captain Steel India
                  </strong>{' '}
                  co-founded by Managing Director Shri Vijay Gupta—the group built deep institutional relationships across primary steelmaking, raw ore procurement, and East Coast export logistics.
                </p>
                <p>
                  From first submerged-arc furnaces commissioned in 2010 to multi-unit operations spanning{' '}
                  <CursorCard
                    image={ASSETS.cursorBobbiliSubstation.src}
                    imageAlt={ASSETS.cursorBobbiliSubstation.alt}
                    eyebrow="Andhra Pradesh · Primary Complex"
                    title="Bobbili Growth Centre"
                    badge="Captive 132kV Feed"
                    description="Primary submerged-arc smelting bays, 6,000 MT/mo AOD converter, and ₹1,200 Cr expansion hub in Vizianagaram."
                    to="/manufacturing"
                  >
                    Bobbili Growth Centre
                  </CursorCard>{' '}
                  (Vizianagaram, Andhra Pradesh) and{' '}
                  <CursorCard
                    image={ASSETS.cursorJharkhandFurnace.src}
                    imageAlt={ASSETS.cursorJharkhandFurnace.alt}
                    eyebrow="Jharkhand · Mineral Belt Works"
                    title="Kadambeda / Dhalbhumgarh"
                    badge="24 MVA + DRI Site"
                    description="Singhbhum East smelting complex positioned directly in eastern India's manganese and chrome mineral belt."
                    to="/manufacturing"
                  >
                    Kadambeda Village / Dhalbhumgarh
                  </CursorCard>{' '}
                  (Singhbhum East, Jharkhand), the company links eastern India’s mineral belt directly to global vessels via{' '}
                  <CursorCard
                    image={ASSETS.cursorVizagVessel.src}
                    imageAlt={ASSETS.cursorVizagVessel.alt}
                    eyebrow="Maritime Export Corridor"
                    title="Visakhapatnam Harbour Port"
                    badge="Three Star Export"
                    description="Deep-water east-coast berth routing containerised FIBC jumbo bags and bulk alloy shipments to ~35 countries."
                    to="/contact"
                  >
                    Visakhapatnam Harbour Port
                  </CursorCard>
                  .
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

            {/* Official Corporate House Feature + Statutory Registry Ledger */}
            <div className="lg:col-span-5 space-y-6">
              <figure className="bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden">
                <ImageReveal direction="up" className="aspect-[16/10] bg-[#10243A]">
                  <ResilientImage
                    src={ASSETS.corporateHouse.src}
                    alt={ASSETS.corporateHouse.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#465C72] dark:text-[#B5C5D7] border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                  {ASSETS.corporateHouse.caption}
                </figcaption>
              </figure>

              <div className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-5 space-y-3">
                <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                  Statutory &amp; Commercial Footprint
                </p>
                <dl className="divide-y divide-[#10243A]/10 dark:divide-[#F4F8FC]/10 text-xs">
                  <div className="py-2 flex items-baseline justify-between gap-4">
                    <dt className="text-[#465C72] dark:text-[#B5C5D7]">CIN</dt>
                    <dd className="font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC]">{COMPANY_INFO.cin}</dd>
                  </div>
                  <div className="py-2 flex items-baseline justify-between gap-4">
                    <dt className="text-[#465C72] dark:text-[#B5C5D7]">Registered HQ</dt>
                    <dd className="text-right text-[#10243A] dark:text-[#F4F8FC]">21A, Shakespeare Sarani, Kolkata</dd>
                  </div>
                  <div className="py-2 flex items-baseline justify-between gap-4">
                    <dt className="text-[#465C72] dark:text-[#B5C5D7]">Announced Hub</dt>
                    <dd className="text-right text-[#10243A] dark:text-[#F4F8FC]">56, Chowringhee Road, Kolkata</dd>
                  </div>
                  <div className="pt-2 flex items-baseline justify-between gap-4">
                    <dt className="text-[#465C72] dark:text-[#B5C5D7]">Port Gateway</dt>
                    <dd className="text-right text-[#10243A] dark:text-[#F4F8FC]">Visakhapatnam Harbour Port</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Factual Heritage Strip */}
          <dl className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14 divide-y md:divide-y-0 md:divide-x divide-[#10243A]/15 dark:divide-[#F4F8FC]/14">
            <motion.div
              initial={{ opacity: 0.35, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.45, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="py-6 md:pr-8"
            >
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                Founding Pillar
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-1">
                {COMPANY_INFO.legacyNarrative.founderName}
              </dd>
              <dd className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">
                Visionary founder of the DKG Group whose industrial discipline anchors Berry Alloys Limited.
              </dd>
            </motion.div>
            <motion.div
              initial={{ opacity: 0.35, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="py-6 md:px-8"
            >
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                Public Incorporation
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-1">
                {COMPANY_INFO.incorporationDate}
              </dd>
              <dd className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">
                Registered under CIN {COMPANY_INFO.cin} (RoC Kolkata, West Bengal).
              </dd>
            </motion.div>
            <motion.div
              initial={{ opacity: 0.35, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="py-6 md:pl-8"
            >
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                Eastern & Coastal Corridor
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC] mt-1">
                Bobbili · Dhalbhumgarh
              </dd>
              <dd className="text-xs text-[#465C72] dark:text-[#B5C5D7] mt-1">
                Smelting works across Andhra Pradesh and Jharkhand connected directly to Visakhapatnam Port.
              </dd>
            </motion.div>
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

            {/* VengeanceUI MaskedAvatars — Cross-Functional Operational Stewards */}
            <div className="bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-md">
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Cross-Functional Operational Stewards
                </p>
                <h4 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Five Engineering Disciplines Behind Every Heat
                </h4>
                <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Metallurgy, continuous furnace operations, optical spectrometry QA/QC, maritime export logistics, and clean-energy compliance work as one integrated chain.
                </p>
              </div>
              <MaskedAvatars
                avatars={FUNCTIONAL_STEWARD_AVATARS}
                size={76}
                column={46}
                border={7}
                ringed
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 divide-y sm:divide-y-0 sm:divide-x divide-[#10243A]/12 dark:divide-[#F4F8FC]/12 bg-white dark:bg-[#12243B]">
              {COMPANY_INFO.workforceStory.highlights.map((item, idx) => (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0.35, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{ duration: 0.42, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="p-4 sm:p-5 space-y-1"
                >
                  <p data-countup className="font-display text-xl sm:text-2xl font-bold uppercase text-brand dark:text-[#69C5F5]">
                    {item.metric}
                  </p>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {item.label}
                  </p>
                </motion.div>
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
              ].map((card, idx) => (
                <motion.figure
                  key={card.asset.id}
                  initial={{ opacity: 0.3, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 overflow-hidden flex flex-col"
                >
                  <ImageReveal direction="up" className="aspect-[16/10] bg-[#10243A]">
                    <ResilientImage
                      src={card.asset.src}
                      alt={card.asset.alt}
                      containerClassName="w-full h-full"
                    />
                  </ImageReveal>
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
                </motion.figure>
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
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0.3, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{ duration: 0.45, delay: idx * 0.055, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SpotlightSurface
                    className="h-full bg-white dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-5 space-y-2"
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05 / ALLOYS — Interactive Alloy Explorer (#alloys) */}
      <HomeAlloyShowcase onEnquireAlloy={handleEnquireAlloy} />

      {/* Restored WebGL Sobel-Edge + FBM Noise Scroll Dissolve Bridge: Molten Furnace Tap -> Deep-Water Export Berth */}
      <ScrollDissolveReveal
        image1={ASSETS.dissolveFurnaceTap.src}
        image2={ASSETS.dissolveRefinedAlloyShip.src}
        image1Alt={ASSETS.dissolveFurnaceTap.alt}
        image2Alt={ASSETS.dissolveRefinedAlloyShip.alt}
        edgeColor="#69C5F5"
        leftKicker="Stage A · Submerged-Arc Reduction"
        leftTitle="1,500°C Molten Alloy Tapping"
        leftDescription="Continuous high-temperature reduction across Bobbili and Dhalbhumgarh furnaces establishes primary manganese, silicon, and chromium alloy chemistry."
        rightKicker="Stage B · Deep-Water Maritime Berth"
        rightTitle="Precision Export Vessel Dispatch"
        rightDescription="Assayed, sized, and packed into certified FIBC jumbo bags and bulk lots for direct maritime export through Visakhapatnam Harbour Port."
      />

      {/* 06 / PROCESS — Pinned Desktop Manufacturing Sequence (#process) */}
      <ManufacturingScrollStory />

      {/* Restored Kinetic PixelatedImageTrail Interlude — Exclusive Furnace & Macro Photography */}
      <section
        aria-label="Interactive Furnace Floor & Alloy Macro Photographic Stage"
        className="relative bg-[#07111F] text-[#F4F8FC] border-t border-[#F4F8FC]/12"
      >
        <PixelatedImageTrail
          images={HOME_PIXEL_TRAIL_IMAGES}
          slices={4}
          className="min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] flex items-center justify-center bg-[#07111F]"
        >
          <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-5">
            <p className="text-[11px] font-mono-tabular uppercase tracking-[0.26em] text-[#69C5F5]">
              Kinetic Plant Floor &amp; Macro Metallurgy
            </p>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.96] text-[#F4F8FC]">
              Move Across Heat, Arc &amp; Crystalline Grain
            </h2>
            <p className="text-xs sm:text-sm text-[#B5C5D7] max-w-xl mx-auto leading-relaxed">
              Sweep your cursor or drag across the viewport to release sliced close-ups of submerged-arc tapping, Soderberg electrodes, cast alloy beds, and night smelter operations.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]/90">
              <span>6 Exclusive Furnace &amp; Alloy Plates</span>
              <span aria-hidden="true" className="text-[#F4F8FC]/30">/</span>
              <span>Pointer &amp; Touch Responsive</span>
            </div>
          </div>
        </PixelatedImageTrail>
      </section>

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
                  {CERTIFICATIONS.map((c, idx) => {
                    const bubbleVariants = ['dori', 'smaug', 'indis', 'sadoc'] as const;
                    const bubbleVariant = bubbleVariants[idx % bubbleVariants.length];
                    return (
                      <SpotlightSurface
                        key={c.code}
                        className="border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-white dark:bg-[#12243B] p-3.5"
                      >
                        <AnimatedTooltip
                          variant={bubbleVariant}
                          content={c.code}
                          sublabel="Audited Management System"
                          accentColor={idx % 2 === 0 ? '#006393' : '#C9233B'}
                          shapeColor="#10243A"
                          textColor="#F4F8FC"
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
                    );
                  })}
                </div>
              </div>

              {/* Concise Typographic Awards & Achievements Teaser (zero duplicate imagery; full archive on /awards-achievements) */}
              <div className="border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 pt-5 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-mono-tabular text-xs uppercase tracking-wider text-[#10243A] dark:text-[#F4F8FC]">
                    Awards &amp; Recognition Archive
                  </h3>
                  <Link
                    to="/awards-achievements"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                  >
                    <span>Explore Awards &amp; Achievements</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <ul className="divide-y divide-[#10243A]/10 dark:divide-[#F4F8FC]/10 border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-white dark:bg-[#12243B] text-xs">
                  {AWARD_RECORDS.slice(1, 6).map((award) => (
                    <li
                      key={award.id}
                      className="px-4 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">
                          {award.title}
                        </p>
                        <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7]">
                          {award.issuer}
                        </p>
                      </div>
                      <span className="font-mono-tabular text-[11px] text-brand dark:text-[#69C5F5] sm:text-right shrink-0">
                        {award.displayDate}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Industry affiliations displayed on the company site: {MEMBERSHIPS.map((m) => `${m.name} (${m.role})`).join('; ')}. Full traceable records, management system credentials, and credit-rating disclosures are documented on the{' '}
                  <Link to="/awards-achievements" className="text-brand dark:text-[#69C5F5] hover:underline font-medium">
                    Awards &amp; Achievements page
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              {/* Typographic Awards & Achievements Editorial Callout (No Ceremony Image Here) */}
              <div className="bg-[#10243A] text-[#F4F8FC] border border-[#10243A] dark:border-[#F4F8FC]/14 p-6 sm:p-8 space-y-5 relative overflow-hidden">
                <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B]" />
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                  <span>Published Recognition Ledger</span>
                  <span>Traceable Records</span>
                </div>
                <div className="space-y-2.5">
                  <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F4F8FC]">
                    Brand, Workplace, Social Impact &amp; Export Recognition
                  </h3>
                  <p className="text-sm text-[#B5C5D7] leading-relaxed">
                    Inspect dated public records covering ET Best Brand of 2025, ET Edge Best Organization to Work 2026, ICC Social Impact Jury Recognition, JM Financial Hurun India Founders’ Awards 2026, and Three Star Export House status—kept separate from ISO management systems and credit-rating disclosures.
                  </p>
                </div>
                <div className="pt-2">
                  <IndustrialButton to="/awards-achievements" variant="primary">
                    Open Awards &amp; Achievements Archive
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </IndustrialButton>
                </div>
              </div>

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

          {/* Restored Interactive 3D Perspective QA & Refining Inspection Deck */}
          <div className="pt-10 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  3D Quality &amp; Refining Deck
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  From Spectrometer Spark To Export Packaging
                </h3>
              </div>
              <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                Swipe or select any plate to inspect refining, sizing, and laboratory controls.
              </p>
            </div>
            <PerspectiveCarousel
              slides={QA_PERSPECTIVE_SLIDES}
              heading="QA, Refining & Export Inspection Deck"
            />
          </div>

          {/* Animated Metallurgical Process Schematic */}
          <div className="pt-10 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14">
            <SmeltingRefiningJourney />
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
        </div>
      </section>

      {/* 08 / AWARDS — Awards, Recognitions & Verified Achievements (#awards) */}
      <HomeAwardsSection />

      {/* 09 / RESPONSIBILITY — Sustainability Scope & Visual Grassroots CSR */}
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
                  09 / Sustainability & Community Stewardship
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

          {/* Interactive Clean Energy & Planned Waste-Heat Recovery Schematic */}
          <div className="pt-12 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/12">
            <CleanEnergyJourney />
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

            {/* Restored Interactive Diagonal CSR Fieldwork Carousel */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                    Grassroots CSR Fieldwork Sequence
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    Education, Clean Water, Green Belt &amp; Health
                  </h3>
                </div>
                <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                  Swipe or step through documented community programmes across plant belts.
                </p>
              </div>
              <DiagonalCarousel
                slides={CSR_DIAGONAL_SLIDES}
                eyebrow="CSR Fieldwork Archive"
              />
            </div>

            {/* Ecological Plantation Fieldwork + Memorial & Education Records */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <figure className="lg:col-span-6 bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden flex flex-col">
                <ImageReveal direction="up" className="aspect-[16/10] bg-[#10243A]">
                  <ResilientImage
                    src={ASSETS.csrPlantation.src}
                    alt={ASSETS.csrPlantation.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="p-5 space-y-1.5 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                      Ecological Stewardship · Bobbili &amp; Dhalbhumgarh
                    </p>
                    <h4 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                      Native Sapling Plantation &amp; Green Belt Drives
                    </h4>
                  </div>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {ASSETS.csrPlantation.caption}
                  </p>
                </figcaption>
              </figure>

              <div className="lg:col-span-6 flex flex-col justify-between gap-6">
                {csrSecondaryStories.map((story) => (
                  <article
                    key={story.id}
                    className="flex-1 bg-[#F1F6FB] dark:bg-[#12243B] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-6 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                        {story.category} · {story.dateOrLocation}
                      </p>
                      <h4 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                        {story.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                      <Link
                        to="/community"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                      >
                        Inspect CSR Archive
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 / PRESENCE — Interactive Indian Facilities & Port Corridor */}
      <section
        id="presence"
        aria-labelledby="presence-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F1F6FB] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#10243A]/15 dark:border-[#F4F8FC]/12">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                10 / Global Presence
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

          {/* VengeanceUI Magnetic Spotlight Marquee — Global Corridors & Metallurgical Benchmarks */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-widest text-[#465C72] dark:text-[#B5C5D7]">
              <span className="text-brand dark:text-[#69C5F5]">
                Magnetic Spotlight Corridors &amp; Export Capabilities
              </span>
              <span>Hover or touch any tile to illuminate &amp; pause</span>
            </div>
            <MagneticSpotlightMarquee
              items={GLOBAL_CAPABILITY_SPOTLIGHT_ITEMS}
              speedSeconds={40}
            />
          </div>

          <GlobalPresenceSection />

          <LogisticsJourney />

          <FacilityCorridorMap />

          {/* Restored Interactive Site Directory with Floating Hover/Tap Image Reveal */}
          <div className="pt-8 border-t border-[#10243A]/14 dark:border-[#F4F8FC]/12 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Interactive Site Directory
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  Works, Export Gateways &amp; Corporate Hubs
                </h3>
              </div>
              <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                Hover or tap any corridor row to unveil its site visual and inspect details.
              </p>
            </div>
            <div className="bg-white dark:bg-[#12243B]">
              <ImageRevealList items={PLANT_REVEAL_ROWS} />
            </div>
          </div>
        </div>
      </section>

      {/* 11 / UPDATES — Plant Gallery & Editorial Company Updates */}
      <section
        id="updates"
        aria-labelledby="news-heading"
        className="scroll-mt-20 bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC]"
      >
        <PlantMediaGallery embedded />

        <div className="py-20 lg:py-24 bg-[#FFFFFF] dark:bg-[#07111F] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
            <div className="border border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-[#F1F6FB]/55 dark:bg-[#0D1B2E]/70 p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5] mb-2">
                    11 / News &amp; Technical Articles
                  </p>
                  <h2
                    id="news-heading"
                    className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
                  >
                    Recent company announcements &amp; metallurgy notes
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
            </div>

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

      {/* 12 / CAREERS & LIFE — Restored ImageScatter Polaroid Stage & Published Openings */}
      <section
        id="careers-life"
        aria-labelledby="home-careers-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F1F6FB] text-[#10243A] dark:bg-[#0D1B2E] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#10243A]/14 dark:border-[#F4F8FC]/12">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                12 / People, Culture &amp; Careers
              </p>
              <h2
                id="home-careers-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              >
                Built by metallurgists, shift engineers &amp; export teams.
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-3 max-w-md">
              <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] sm:text-right leading-relaxed">
                From submerged-arc furnace shifts in Bobbili and Dhalbhumgarh to XRF spectroscopy labs and commercial desks in Kolkata and Visakhapatnam.
              </p>
              <IndustrialButton to="/careers" variant="outline-light">
                Explore Careers &amp; Apply
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </IndustrialButton>
            </div>
          </div>

          {/* Restored Interactive ImageScatter Polaroid Stage — 6 Exclusive Workplace & Export Photographs */}
          <div className="border border-[#10243A]/14 dark:border-[#F4F8FC]/14 bg-[#07111F] overflow-hidden">
            <ImageScatter
              imageSets={HOME_CAREERS_SCATTER_SETS}
              interval={5800}
              animationDuration={900}
            />
          </div>

          {/* Published Vacancies + Functional Disciplines */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5] inline-flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
                  Published Career Listings
                </p>
                <span className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                  HR-verified intake
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JOB_VACANCIES.map((role) => (
                  <article
                    key={role.id}
                    className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                        {role.department} · {role.experience}
                      </p>
                      <h3 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                        {role.title}
                      </h3>
                      <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand dark:text-[#69C5F5] shrink-0" aria-hidden="true" />
                        <span>{role.location}</span>
                      </p>
                      <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed pt-1">
                        {role.responsibilities[0]}.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#465C72] dark:text-[#B5C5D7]">
                        {role.qualification.split(' ')[0]} · Full-time
                      </span>
                      <Link
                        to="/careers"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline whitespace-nowrap"
                      >
                        Role Details
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6 space-y-4">
              <div className="space-y-1.5">
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  Core Operating Functions
                </p>
                <h3 className="font-display text-2xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                  {CAREERS_DEPARTMENTS.length} Technical &amp; Corporate Departments
                </h3>
                <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Qualified engineers, metallurgists, laboratory chemists, and commercial professionals may submit general applications directly via our careers desk.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {CAREERS_DEPARTMENTS.map((dept, i) => (
                  <div
                    key={dept}
                    className="flex items-center gap-2 px-3 py-2 border border-[#10243A]/10 dark:border-[#F4F8FC]/12 bg-[#F1F6FB]/55 dark:bg-[#0D1B2E]/60 text-xs text-[#10243A] dark:text-[#F4F8FC]"
                  >
                    <span className="text-[10px] font-mono-tabular text-brand dark:text-[#69C5F5]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate font-medium">{dept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13 / COMPENDIUM — Restored 3D Three.js BooksShowcase & Statutory Filings */}
      <section
        id="compendium"
        aria-labelledby="home-compendium-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#10243A]/14 dark:border-[#F4F8FC]/12">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                13 / Statutory Filings &amp; 3D Compendium
              </p>
              <h2
                id="home-compendium-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]"
              >
                Inspect bound technical handbooks &amp; MCA disclosures.
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-3 max-w-md">
              <p className="text-xs sm:text-sm text-[#465C72] dark:text-[#B5C5D7] sm:text-right leading-relaxed">
                Select any 3D hardcover volume below to inspect grade chemistry tables, AOD decarburisation notes, CSR chronicles, and Form MGT-7 disclosures (CIN {COMPANY_INFO.cin}).
              </p>
              <IndustrialButton to="/documents" variant="outline-light">
                Open Full Statutory Archive
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </IndustrialButton>
            </div>
          </div>

          {/* Restored Interactive 3D Three.js BooksShowcase */}
          <div className="border border-[#10243A]/15 dark:border-[#F4F8FC]/15 overflow-hidden">
            <BooksShowcase
              books={BERRY_COMPENDIUM_BOOKS}
              heroTitle="Compendia"
              navTitle="Berry Alloys Library"
              onPrimaryAction={handleBookPrimary}
              onSecondaryAction={handleBookSecondary}
            />
          </div>

          {/* Statutory Filing Groups Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORPORATE_DOCUMENT_GROUPS.map((group) => (
              <div
                key={group.id}
                className="bg-[#F1F6FB]/55 dark:bg-[#0D1B2E]/85 border border-[#10243A]/12 dark:border-[#F4F8FC]/14 p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      {group.items.length} Records
                    </span>
                    <span className="text-[10px] font-mono-tabular uppercase text-[#465C72] dark:text-[#B5C5D7]">
                      Public Index
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    {group.type}
                  </h3>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {group.description}
                  </p>
                  <ul className="pt-2 space-y-1.5 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                    {group.items.slice(0, 3).map((doc) => (
                      <li
                        key={doc.title}
                        className="flex items-baseline justify-between gap-2 text-xs text-[#10243A] dark:text-[#F4F8FC]/90"
                      >
                        <span className="truncate">{doc.title}</span>
                        <span className="text-[10px] font-mono-tabular text-brand dark:text-[#69C5F5] shrink-0">
                          {doc.yearOrScope}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                  <Link
                    to="/documents"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                  >
                    Inspect Filing Register
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14 / FAQ — Concise Pre-Enquiry Questions */}
      <HomeFaqSection />

      <InsightsPreview />

      {/* 15 / ENQUIRY — Commercial Quotation Desk & Offices */}
      <section
        id="enquiry"
        aria-labelledby="home-enquiry-heading"
        className="scroll-mt-20 relative overflow-hidden bg-[#FFFFFF] text-[#10243A] dark:bg-[#10243A] dark:text-[#F4F8FC] border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 py-20 lg:py-28"
      >
        {/* Interactive 3D PerspectiveGrid backdrop in light mode; MetallicShaderCanvas in dark mode */}
        <div className="dark:hidden absolute inset-0 opacity-75">
          <PerspectiveGrid
            gridSize={22}
            fadeRadius={74}
            accent="berry"
            className="[--fade-stop:#FFFFFF]"
          />
        </div>
        <div className="hidden dark:block absolute inset-0 opacity-85 pointer-events-none">
          <MetallicShaderCanvas />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Sourced Offices & Direct Commercial Channels */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                  15 / Commercial Quotation Desk
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
