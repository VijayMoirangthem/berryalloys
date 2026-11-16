import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ASSETS, OFFICIAL_BRAND_MARK } from '../data/assets';
import {
  CERTIFICATIONS,
  COMPANY_INFO,
  CREDENTIALS_AND_AWARDS,
  MEMBERSHIPS,
  OFFICES,
  UPCOMING_OFFICE_NOTICE,
} from '../data/company';
import { CSR_STORIES, NEWS_ITEMS } from '../data/communityNewsCareersDocs';
import { PRODUCTS } from '../data/products';
import { useGuide } from '../context/GuideContext';
import { ChapterRail } from '../components/ChapterRail';
import { EnquiryFormPanel } from '../components/EnquiryFormPanel';
import { FacilityCorridorMap } from '../components/FacilityCorridorMap';
import { GrowthChronicle } from '../components/GrowthChronicle';
import { HomeAlloyShowcase } from '../components/HomeAlloyShowcase';
import { HomeFaqSection } from '../components/HomeFaqSection';
import { ManufacturingScrollStory } from '../components/ManufacturingScrollStory';
import { MetallicShaderCanvas } from '../components/MetallicShaderCanvas';
import { PlantMediaGallery } from '../components/PlantMediaGallery';
import { ResilientImage } from '../components/ResilientImage';
import { ImageReveal } from '../components/motion/ImageReveal';
import { ScrollReveal } from '../components/motion/ScrollReveal';
import { SplitText } from '../components/motion/SplitText';
import { IndustrialButton } from '../components/ui/IndustrialButton';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
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
        stagger: 0.1,
        delay: 0.2,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      if (heroMediaRef.current) {
        gsap.to(heroMediaRef.current, {
          yPercent: 10,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
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

  const featuredCamp = CSR_STORIES[0];
  const csrVisualCards = [
    { story: CSR_STORIES[2], image: ASSETS.csrSchool },
    { story: CSR_STORIES[3], image: ASSETS.csrWater },
    { story: CSR_STORIES[5], image: ASSETS.csrPlantation },
  ];
  const csrSecondaryStories = [CSR_STORIES[1], CSR_STORIES[4]];

  const curatedUpdates = [
    ...NEWS_ITEMS.filter((item) => item.type === 'News').slice(0, 4),
    ...NEWS_ITEMS.filter((item) => item.type === 'Article').slice(0, 2),
  ];

  return (
    <div className="relative">
      <ChapterRail />

      {/* 01 / OVERVIEW — Cinematic Plant Hero Opening */}
      <section
        id="overview"
        ref={heroSectionRef}
        aria-labelledby="hero-heading"
        className="scroll-mt-20 relative bg-[#121417] text-[#F3F0E9] overflow-hidden"
      >
        <div className="relative min-h-[clamp(620px,calc(100vh-4rem),880px)] flex flex-col justify-between">
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
            className="absolute inset-0 bg-gradient-to-t from-[#121417] via-[#121417]/68 to-[#121417]/48"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#121417]/92 via-[#121417]/55 to-transparent"
          />

          <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 pt-8 sm:pt-12 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-widest text-[#F3F0E9]/80">
            <span>01 / DKG Group Industrial Enterprise · Est. 2006</span>
            <span>Bobbili · Dhalbhumgarh · Visakhapatnam Port</span>
          </div>

          <div className="relative z-10 max-w-[1360px] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 space-y-6">
                <SplitText
                  id="hero-heading"
                  text="Strength begins with precision."
                  as="h1"
                  className="font-display fluid-hero-title font-bold uppercase text-[#F3F0E9] max-w-4xl"
                />

                <p className="hero-reveal text-base sm:text-lg text-[#F3F0E9]/88 leading-relaxed max-w-2xl">
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

              <div className="hero-reveal lg:col-span-4 lg:text-right space-y-2 border-t lg:border-t-0 lg:border-l border-[#F3F0E9]/20 pt-4 lg:pt-0 lg:pl-6">
                <div className="inline-flex items-center gap-2 bg-[#F6F4EF] px-2.5 py-1.5 lg:ml-auto">
                  <img
                    src={OFFICIAL_BRAND_MARK}
                    alt="Berry Alloys emblem"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-[#141618]">
                    Berry Alloys Limited
                  </span>
                </div>
                <p className="text-xs font-mono-tabular text-[#EC743C]">
                  CIN {COMPANY_INFO.cin}
                </p>
                <p className="text-xs text-[#F3F0E9]/75">
                  Three Star Export House · Incorporated Sept 2006
                </p>
                <p className="text-[11px] text-[#A1A7AB]">
                  Aerial plant view: Berry Alloys complex
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / LEGACY — DKG Group Roots, Founding Heritage & Expansion Geography */}
      <section
        id="legacy"
        aria-labelledby="legacy-statement-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F6F4EF] text-[#141618] dark:bg-[#121417] dark:text-[#F3F0E9]"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7 space-y-7">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                02 / DKG Group Heritage & Founding Story
              </p>

              <ScrollReveal
                id="legacy-statement-heading"
                text="Built on generational steel and ferro alloy stewardship linking mineral belts to deep-water trade."
                as="h2"
                className="font-display fluid-statement font-bold uppercase text-[#141618] dark:text-[#F3F0E9] max-w-3xl"
              />

              <div className="space-y-4 text-base text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed max-w-[65ch]">
                <p>{COMPANY_INFO.legacyNarrative.founderNote}</p>
                <p>{COMPANY_INFO.legacyNarrative.alliedEnterprise}</p>
                <p>{COMPANY_INFO.legacyNarrative.geographyStory}</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9] dark:hover:text-[#EC743C] transition-colors"
                >
                  Read Complete Corporate Profile
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9] transition-colors"
                >
                  Statutory Filings (MGT-7 & CSR)
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Official Aerial Complex + Corporate House Pair */}
            <div className="lg:col-span-5 space-y-6">
              <figure className="bg-[#ECE8DF] dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 overflow-hidden">
                <ImageReveal direction="up" className="aspect-[16/10] bg-[#141618]">
                  <ResilientImage
                    src={ASSETS.officialAerialComplex.src}
                    alt={ASSETS.officialAerialComplex.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#4A5054] dark:text-[#A1A7AB] border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
                  {ASSETS.officialAerialComplex.caption}
                </figcaption>
              </figure>

              <figure className="bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 grid grid-cols-12 overflow-hidden items-center">
                <div className="col-span-5 aspect-[4/3] bg-[#141618] overflow-hidden">
                  <ResilientImage
                    src={ASSETS.corporateHouse.src}
                    alt={ASSETS.corporateHouse.alt}
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="col-span-7 p-4 space-y-1">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                    Corporate Infrastructure
                  </p>
                  <p className="text-xs font-semibold text-[#141618] dark:text-[#F3F0E9]">
                    Kolkata Registered Office & Announced Chowringhee Hub
                  </p>
                  <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                    Active headquarters at 21A, Shakespeare Sarani; upcoming office announced at 56, Chowringhee Road, Kolkata.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Factual Heritage Strip */}
          <dl className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#141618]/15 dark:border-[#F3F0E9]/14 divide-y md:divide-y-0 md:divide-x divide-[#141618]/15 dark:divide-[#F3F0E9]/14">
            <div className="py-6 md:pr-8">
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                Founding Pillar
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mt-1">
                {COMPANY_INFO.legacyNarrative.founderName}
              </dd>
              <dd className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1">
                Visionary founder of the DKG Group whose industrial discipline anchors Berry Alloys Limited.
              </dd>
            </div>
            <div className="py-6 md:px-8">
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                Public Incorporation
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mt-1">
                {COMPANY_INFO.incorporationDate}
              </dd>
              <dd className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1">
                Registered under CIN {COMPANY_INFO.cin} (RoC Kolkata, West Bengal).
              </dd>
            </div>
            <div className="py-6 md:pl-8">
              <dt className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                Eastern & Coastal Corridor
              </dt>
              <dd className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9] mt-1">
                Bobbili · Dhalbhumgarh
              </dd>
              <dd className="text-xs text-[#4A5054] dark:text-[#A1A7AB] mt-1">
                Smelting works across Andhra Pradesh and Jharkhand connected directly to Visakhapatnam Port.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 03 / CHRONICLE — Interactive 2010–2026+ Growth Story */}
      <section
        id="chronicle"
        aria-labelledby="chronicle-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#ECE8DF] text-[#141618] dark:bg-[#191C20] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#141618]/14 dark:border-[#F3F0E9]/12">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                03 / Growth Chronicle (2010–2026+)
              </p>
              <h2
                id="chronicle-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
              >
                From 2 × 10 MVA smelting bays to Three Star Export House scale
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] max-w-md leading-relaxed">
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
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F6F4EF] text-[#141618] dark:bg-[#121417] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Framed Portrait of Shri Vijay Gupta */}
            <div className="lg:col-span-5">
              <figure className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 overflow-hidden">
                <div className="aspect-[4/4] bg-gradient-to-b from-[#ECE8DF] via-[#E1DCD0] to-[#CFC8B8] dark:from-[#252A31] dark:via-[#1D2127] dark:to-[#121417] flex items-end justify-center pt-6 px-4 overflow-hidden">
                  <ResilientImage
                    src={ASSETS.vijayGuptaPortrait.src}
                    alt={ASSETS.vijayGuptaPortrait.alt}
                    className="w-full h-full object-contain object-bottom"
                    containerClassName="w-full h-full"
                  />
                </div>
                <figcaption className="p-5 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 space-y-1">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                    Founder & Managing Director
                  </p>
                  <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {COMPANY_INFO.managingDirector.name}
                  </p>
                  <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
                    25+ years across ferro alloys, Captain Steel India, exports & industrial development.
                  </p>
                </figcaption>
              </figure>
            </div>

            {/* Right: Promoter Story, Chairman, Mission & Vision */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                  04 / Leadership & Operating Principles
                </p>
                <h2
                  id="leadership-section-heading"
                  className="font-display fluid-statement font-bold uppercase text-[#141618] dark:text-[#F3F0E9]"
                >
                  Second-generation industrialists driving operational accountability.
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMPANY_INFO.leadershipTeam.map((leader) => (
                  <div
                    key={leader.name}
                    className="bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-5 space-y-2"
                  >
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                      {leader.role}
                    </p>
                    <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                      {leader.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                      {leader.summary}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-5 space-y-2 text-xs text-[#4A5054] dark:text-[#A1A7AB]">
                <p className="text-[#141618] dark:text-[#F3F0E9] font-medium leading-relaxed">
                  {COMPANY_INFO.managingDirector.recognitionClaim}
                </p>
                <p>{COMPANY_INFO.managingDirector.attributionNote}</p>
              </div>

              {/* Mission & Vision Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#141618]/14 dark:border-[#F3F0E9]/14">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                    Operational Mission
                  </p>
                  <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
                    {COMPANY_INFO.mission}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                    Long-Term Vision
                  </p>
                  <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
                    {COMPANY_INFO.vision}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Core Values Ledger */}
          <div className="pt-10 border-t border-[#141618]/14 dark:border-[#F3F0E9]/14 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                Six Core Operating Values
              </h3>
              <Link
                to="/about"
                className="text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline"
              >
                Explore Full Governance →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {COMPANY_INFO.values.map((val, idx) => (
                <div
                  key={val.title}
                  className="bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-5 space-y-2"
                >
                  <span className="font-mono-tabular text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C]">
                    0{idx + 1}
                  </span>
                  <h4 className="font-display text-xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {val.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 05 / ALLOYS — Interactive Alloy Explorer (#alloys) */}
      <HomeAlloyShowcase onEnquireAlloy={handleEnquireAlloy} />

      {/* 06 / PROCESS — Pinned Desktop Manufacturing Sequence (#process) */}
      <ManufacturingScrollStory />

      {/* 07 / QUALITY — Systems, Ratings, ET Edge 2026 & Chemistry Table */}
      <section
        id="quality"
        aria-labelledby="technical-confidence-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#ECE8DF] text-[#141618] dark:bg-[#121417] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-6 space-y-6">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                07 / Quality & Recognition
              </p>
              <h2
                id="technical-confidence-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
              >
                Verified elemental limits & institutional credentials
              </h2>
              <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-[60ch]">
                Steelmaking furnaces rely on predictable chemistry, controlled residual phosphorus and sulfur, and verified particle sizing. Berry Alloys publishes grade tolerances across ten product series while maintaining quality, safety, environmental, and carbon reporting systems.
              </p>

              {/* ISO Standards */}
              <div className="border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 pt-5 space-y-4">
                <h3 className="font-mono-tabular text-xs uppercase tracking-wider text-[#141618] dark:text-[#F3F0E9]">
                  Website-Reported ISO Management Systems
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {CERTIFICATIONS.map((c) => (
                    <div
                      key={c.code}
                      className="border border-[#141618]/12 dark:border-[#F3F0E9]/14 bg-white dark:bg-[#20242A] p-3.5"
                    >
                      <p className="font-mono-tabular font-semibold text-[#141618] dark:text-[#F3F0E9]">
                        {c.code}
                      </p>
                      <p className="text-[#4A5054] dark:text-[#A1A7AB] mt-0.5">{c.scope}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Displayed Credentials + Official ET Edge 2026 Crest */}
              <div className="border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 pt-5 space-y-4">
                <h3 className="font-mono-tabular text-xs uppercase tracking-wider text-[#141618] dark:text-[#F3F0E9]">
                  Displayed Ratings, Awards & Affiliations
                </h3>

                <div className="bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 shrink-0 bg-[#F6F4EF] border border-[#141618]/10 p-1.5 flex items-center justify-center">
                    <img
                      src={ASSETS.awardEtEdge2026.src}
                      alt={ASSETS.awardEtEdge2026.alt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-semibold text-[#141618] dark:text-[#F3F0E9]">
                      ET Edge Best Organization to Work 2026
                    </p>
                    <p className="text-[#4A5054] dark:text-[#A1A7AB]">
                      Workplace recognition displayed on Berry Alloys Limited’s official website alongside credit ratings CRISIL A- & ICRA AA-.
                    </p>
                  </div>
                </div>

                <ul className="divide-y divide-[#141618]/10 dark:divide-[#F3F0E9]/10 border border-[#141618]/12 dark:border-[#F3F0E9]/14 bg-white dark:bg-[#20242A] text-xs">
                  {CREDENTIALS_AND_AWARDS.map((item) => (
                    <li
                      key={item.title}
                      className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                    >
                      <span className="font-semibold text-[#141618] dark:text-[#F3F0E9]">
                        {item.title}
                      </span>
                      <span className="text-[#4A5054] dark:text-[#A1A7AB] sm:text-right">
                        {item.detail}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                  Industry affiliations displayed on the company site: {MEMBERSHIPS.map((m) => `${m.name} (${m.role})`).join('; ')}. Homepage also references steelmaker client POSCO. Rating instruments and certificate archives remain pending audit confirmation.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <figure className="bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 overflow-hidden">
                <ImageReveal direction="left" className="aspect-video bg-[#141618]">
                  <ResilientImage
                    src={ASSETS.qualityLab.src}
                    alt={ASSETS.qualityLab.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#4A5054] dark:text-[#A1A7AB] border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
                  {ASSETS.qualityLab.caption}
                </figcaption>
              </figure>

              {/* Representative Chemistry Extract Across All 4 Alloy Families */}
              <div className="bg-white dark:bg-[#20242A] border border-[#141618]/15 dark:border-[#F3F0E9]/14 overflow-hidden">
                <div className="px-5 py-3.5 bg-[#F6F4EF] dark:bg-[#191C20] border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 flex items-center justify-between gap-4">
                  <span className="font-mono-tabular text-xs font-semibold text-[#141618] dark:text-[#F3F0E9]">
                    Representative Grade Extract Across All 4 Alloy Families
                  </span>
                  <Link
                    to="/products"
                    className="text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline whitespace-nowrap"
                  >
                    All 10 Tables →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px] text-xs">
                    <thead>
                      <tr className="border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 text-[#4A5054] dark:text-[#A1A7AB]">
                        <th className="py-2.5 px-4 font-semibold">Grade Series</th>
                        <th className="py-2.5 px-3 font-semibold">Primary Element</th>
                        <th className="py-2.5 px-3 font-semibold">C (max)</th>
                        <th className="py-2.5 px-3 font-semibold">P (max)</th>
                        <th className="py-2.5 px-3 font-semibold">S (max)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141618]/10 dark:divide-[#F3F0E9]/10 font-mono-tabular">
                      <tr>
                        <td className="py-2.5 px-4 font-sans font-medium text-[#141618] dark:text-[#F3F0E9]">
                          <Link
                            to="/products/high-carbon-ferro-manganese"
                            className="hover:text-[#9E4B28] dark:hover:text-[#EC743C] underline-offset-2 hover:underline"
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
                        <td className="py-2.5 px-4 font-sans font-medium text-[#141618] dark:text-[#F3F0E9]">
                          <Link
                            to="/products/high-carbon-ferro-manganese"
                            className="hover:text-[#9E4B28] dark:hover:text-[#EC743C] underline-offset-2 hover:underline"
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
                        <td className="py-2.5 px-4 font-sans font-medium text-[#141618] dark:text-[#F3F0E9]">
                          <Link
                            to="/products/high-carbon-silico-manganese"
                            className="hover:text-[#9E4B28] dark:hover:text-[#EC743C] underline-offset-2 hover:underline"
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
                        <td className="py-2.5 px-4 font-sans font-medium text-[#141618] dark:text-[#F3F0E9]">
                          <Link
                            to="/products/low-medium-carbon-ferro-chrome"
                            className="hover:text-[#9E4B28] dark:hover:text-[#EC743C] underline-offset-2 hover:underline"
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
                        <td className="py-2.5 px-4 font-sans font-medium text-[#141618] dark:text-[#F3F0E9]">
                          <Link
                            to="/products/ferro-silicon"
                            className="hover:text-[#9E4B28] dark:hover:text-[#EC743C] underline-offset-2 hover:underline"
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
                <p className="px-4 py-2.5 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 bg-[#F6F4EF]/60 dark:bg-[#191C20] text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">
                  *Preserves source-reported Si column qualifiers verbatim. Full elemental tables and sizing notes are available per grade series.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 08 / RESPONSIBILITY — Sustainability Scope & Visual Grassroots CSR */}
      <section
        id="responsibility"
        aria-labelledby="responsibility-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#F6F4EF] text-[#141618] dark:bg-[#191C20] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-20">
          {/* Part 1: Energy & Environmental Stewardship */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                  08 / Sustainability & Community Stewardship
                </p>
                <h2
                  id="responsibility-heading"
                  className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
                >
                  Energy disclosure kept distinct from future expansion
                </h2>
                <p className="text-sm sm:text-base text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed max-w-[60ch]">
                  Smelting ferro alloys is energy-intensive. Berry Alloys separates documented operational renewable generation from planned Ghatsila waste heat recovery projects and exploratory biomass evaluations rather than combining unverified figures.
                </p>
              </div>

              <div className="border-t border-b border-[#141618]/14 dark:border-[#F3F0E9]/14 divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12">
                <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                  <div className="sm:col-span-4">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                      Reported Operational
                    </p>
                    <p className="font-display text-2xl font-bold text-[#141618] dark:text-[#F3F0E9] mt-0.5">
                      83 MW Solar · 29.6 MW Wind
                    </p>
                  </div>
                  <p className="sm:col-span-8 text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                    Disclosed on the company sustainability page; reported separately from the 2.6 MW homepage solar installation notice pending scope reconciliation.
                  </p>
                </div>

                <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                  <div className="sm:col-span-4">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                      Planned Project Scope
                    </p>
                    <p className="font-display text-2xl font-bold text-[#141618] dark:text-[#F3F0E9] mt-0.5">
                      90 MW WHR + 2 × 1,000 TPD DRI
                    </p>
                  </div>
                  <p className="sm:col-span-8 text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                    Planned waste heat recovery and direct reduced iron expansion at Ghatsila alongside existing 24 MVA furnace operations.
                  </p>
                </div>

                <div className="py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-baseline">
                  <div className="sm:col-span-4">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#4A5054] dark:text-[#A1A7AB]">
                      Exploratory Research
                    </p>
                    <p className="font-display text-2xl font-bold text-[#141618] dark:text-[#F3F0E9] mt-0.5">
                      Biomass Reductants
                    </p>
                  </div>
                  <p className="sm:col-span-8 text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
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
              <figure className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 overflow-hidden">
                <ImageReveal direction="up" className="aspect-video bg-[#141618]">
                  <ResilientImage
                    src={ASSETS.officialSolarRoof.src}
                    alt={ASSETS.officialSolarRoof.alt}
                    containerClassName="w-full h-full"
                  />
                </ImageReveal>
                <figcaption className="px-4 py-3 text-xs text-[#4A5054] dark:text-[#A1A7AB] border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
                  {ASSETS.officialSolarRoof.caption}
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Part 2: Grassroots CSR Photography & Featured Camp */}
          <div className="pt-14 border-t border-[#141618]/14 dark:border-[#F3F0E9]/12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 overflow-hidden">
              <div className="lg:col-span-6 bg-[#141618] aspect-video lg:aspect-auto min-h-[260px]">
                <ResilientImage
                  src={ASSETS.csrMedicalCamp.src}
                  alt={ASSETS.csrMedicalCamp.alt}
                  containerClassName="w-full h-full"
                />
              </div>
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                    Community & Workforce Welfare · {featuredCamp.dateOrLocation}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                    {featuredCamp.title}
                  </h3>
                  <p className="text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
                    {featuredCamp.summary}
                  </p>
                  <ul className="space-y-2 pt-3 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 text-xs text-[#4A5054] dark:text-[#A1A7AB]">
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
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E4B28] hover:text-[#141618] dark:text-[#EC743C] dark:hover:text-[#F3F0E9] transition-colors"
                  >
                    All Community & CSR Programmes
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 3 Visual CSR Photo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {csrVisualCards.map(({ story, image }) => (
                <article
                  key={story.id}
                  className="bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 overflow-hidden flex flex-col"
                >
                  <div className="aspect-[16/10] bg-[#141618] overflow-hidden">
                    <ResilientImage
                      src={image.src}
                      alt={image.alt}
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="p-5 space-y-2 flex-1">
                    <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                      {story.category}
                    </p>
                    <h4 className="font-display text-xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                      {story.title}
                    </h4>
                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                      {story.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Additional Documented Memorial & Education Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {csrSecondaryStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#ECE8DF] dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-5 space-y-1.5"
                >
                  <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                    {story.category} · {story.dateOrLocation}
                  </p>
                  <h4 className="font-display text-xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                    {story.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                    {story.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 09 / PRESENCE — Interactive Indian Facilities & Port Corridor */}
      <section
        id="presence"
        aria-labelledby="presence-heading"
        className="scroll-mt-20 py-20 lg:py-28 bg-[#ECE8DF] text-[#141618] dark:bg-[#121417] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/10"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#141618]/15 dark:border-[#F3F0E9]/12">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                09 / Manufacturing & Port Corridor
              </p>
              <h2
                id="presence-heading"
                className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
              >
                Indian plants linked to deep-water export logistics
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] max-w-md leading-relaxed">
              Interactive overview of documented Indian works, offices, and Visakhapatnam Harbour Port. Unverified overseas destination country lists are intentionally omitted.
            </p>
          </div>

          <FacilityCorridorMap />
        </div>
      </section>

      {/* 10 / UPDATES — Plant Gallery & Editorial Company Updates */}
      <section
        id="updates"
        aria-labelledby="news-heading"
        className="scroll-mt-20 bg-[#F6F4EF] text-[#141618] dark:bg-[#121417] dark:text-[#F3F0E9]"
      >
        <PlantMediaGallery embedded />

        <div className="py-20 lg:py-24 bg-[#F6F4EF] dark:bg-[#121417] border-t border-[#141618]/12 dark:border-[#F3F0E9]/12">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#141618]/18 dark:border-[#F3F0E9]/14">
              <div>
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C] mb-2">
                  10 / News & Technical Articles
                </p>
                <h2
                  id="news-heading"
                  className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
                >
                  Recent company announcements & metallurgy notes
                </h2>
              </div>
              <Link
                to="/news"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9] dark:hover:text-[#EC743C] transition-colors whitespace-nowrap"
              >
                All Updates ({NEWS_ITEMS.length})
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
              {curatedUpdates.map((item) => (
                <article
                  key={item.slug}
                  className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline group"
                >
                  <div className="lg:col-span-3 flex items-center gap-3 text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                    <time>{item.date}</time>
                    <span aria-hidden="true">/</span>
                    <span className="text-[#9E4B28] dark:text-[#EC743C] font-medium">
                      {item.type}
                    </span>
                  </div>
                  <div className="lg:col-span-7 space-y-1.5">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] group-hover:text-[#9E4B28] dark:group-hover:text-[#EC743C] transition-colors">
                      <Link to={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="lg:col-span-2 lg:text-right">
                    <Link
                      to={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9] dark:hover:text-[#EC743C] whitespace-nowrap"
                    >
                      Read Summary
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
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

      {/* 12 / ENQUIRY — Commercial Quotation Desk & Offices */}
      <section
        id="enquiry"
        aria-labelledby="home-enquiry-heading"
        className="scroll-mt-20 relative overflow-hidden bg-[#F6F4EF] text-[#141618] dark:bg-[#141618] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 py-20 lg:py-28"
      >
        <div className="hidden dark:block absolute inset-0 opacity-85 pointer-events-none">
          <MetallicShaderCanvas />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Sourced Offices & Direct Commercial Channels */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                  12 / Commercial Quotation Desk
                </p>
                <h2
                  id="home-enquiry-heading"
                  className="font-display fluid-statement font-bold uppercase text-[#141618] dark:text-[#F3F0E9]"
                >
                  Specify your alloy chemistry, lump sizing, and dispatch schedule.
                </h2>
                <p className="text-sm sm:text-base text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
                  Submit a product quotation or commercial enquiry directly below, or reach our offices in Kolkata, Visakhapatnam, and Dhalbhumgarh.
                </p>
              </div>

              <div className="divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12 border-t border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
                {OFFICES.map((office) => (
                  <div key={office.id} className="py-4 space-y-1.5">
                    <h3 className="font-display text-lg font-bold uppercase text-[#141618] dark:text-[#F3F0E9] flex items-center gap-2">
                      <MapPin
                        className="w-4 h-4 text-[#9E4B28] dark:text-[#EC743C] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{office.label}</span>
                    </h3>
                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed pl-6">
                      {office.address}
                    </p>
                    <div className="pl-6 flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono-tabular text-[#141618]/85 dark:text-[#F3F0E9]/85">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone
                          className="w-3.5 h-3.5 text-[#9E4B28] dark:text-[#EC743C]"
                          aria-hidden="true"
                        />
                        {office.phone}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail
                          className="w-3.5 h-3.5 text-[#9E4B28] dark:text-[#EC743C]"
                          aria-hidden="true"
                        />
                        {office.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-[#1B1E21]/90 border border-[#141618]/14 dark:border-[#F3F0E9]/15 p-4 space-y-1">
                <p className="text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C]">
                  {UPCOMING_OFFICE_NOTICE.title}: {UPCOMING_OFFICE_NOTICE.address}
                </p>
                <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
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
