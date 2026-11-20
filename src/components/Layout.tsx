import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Compass,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOME_CHAPTERS } from '../data/chapters';
import { COMPANY_INFO, OFFICES, UPCOMING_OFFICE_NOTICE } from '../data/company';
import { PRODUCTS } from '../data/products';
import { useSearch } from '../context/SearchContext';
import { BrandLockup } from './BrandLockup';
import { ThemeToggle } from './ThemeToggle';
import { AmbientMotionToggle } from './AmbientMotionToggle';
import { LanguageSelector } from './localized/LanguageSelector';
import { ScrollProgress } from './motion/ScrollProgress';
import { useTapTargets } from './motion/useTapTargets';
import { useMobileRails } from './motion/useMobileRails';
import { AnimatedFooterCanvas } from './ui/AnimatedFooterCanvas';
import { triggerReplayIntro } from './ui/KineticLoader';
import { RouteTransitionLoader } from './ui/RouteTransitionLoader';
import { SocialFlipButton } from './ui/SocialFlipButton';

interface LayoutProps {
  children: ReactNode;
}

interface MegaMenuColumn {
  heading: string;
  links: Array<{ label: string; meta: string; to: string }>;
}

interface MegaMenuItem {
  key: string;
  label: string;
  to: string;
  columns?: MegaMenuColumn[];
  spotlightTitle?: string;
  spotlightSummary?: string;
  spotlightCta?: { label: string; to: string };
}

const PRIMARY_NAV: MegaMenuItem[] = [
  {
    key: 'products',
    label: 'Products',
    to: '/products',
    columns: [
      {
        heading: 'Manganese & Silicon Families',
        links: [
          {
            label: 'Ferro Manganese Series',
            meta: 'HC, MC, LC & ULC · Low-P & Low-B',
            to: '/products/high-carbon-ferro-manganese',
          },
          {
            label: 'Silico Manganese Series',
            meta: 'HC, MC & LC · 55–70% Mn',
            to: '/products/high-carbon-silico-manganese',
          },
          {
            label: 'Ferro Silicon (70 / 72)',
            meta: '70–72% Si min · Steel deoxidation',
            to: '/products/ferro-silicon',
          },
        ],
      },
      {
        heading: 'Chromium & Spec Comparison',
        links: [
          {
            label: 'Low / Medium Carbon Ferro Chrome',
            meta: '60–65% Cr min · Vacuum refined',
            to: '/products/low-medium-carbon-ferro-chrome',
          },
          {
            label: 'Full 10-Grade Product Catalogue',
            meta: 'Side-by-side matrix & elemental tables',
            to: '/products',
          },
        ],
      },
    ],
    spotlightTitle: '4 Alloy Families · 10 Documented Grades',
    spotlightSummary:
      'Compare chemistry tolerances, residual phosphorus & sulfur limits, and furnace applications before requesting quotation.',
    spotlightCta: { label: 'Open Product Catalogue', to: '/products' },
  },
  {
    key: 'manufacturing',
    label: 'Manufacturing',
    to: '/manufacturing',
    columns: [
      {
        heading: 'Smelting & Refining',
        links: [
          {
            label: 'Manufacturing & Quality Systems',
            meta: 'SAF smelting, AOD 6,000 MT/mo & ISO standards',
            to: '/manufacturing',
          },
          {
            label: 'Facility & Visakhapatnam Port Corridor',
            meta: 'Bobbili · Dhalbhumgarh / Ghatsila · Harbour Export',
            to: '/#presence',
          },
        ],
      },
      {
        heading: 'Stewardship & Compliance',
        links: [
          {
            label: 'Energy & Sustainability Disclosures',
            meta: 'Solar, wind, planned 90 MW WHR & CBAM',
            to: '/sustainability',
          },
          {
            label: 'FAQs & Metallurgical Guide',
            meta: 'Interactive specification Q&A',
            to: '/faq',
          },
        ],
      },
    ],
    spotlightTitle: 'From Heat to Precision',
    spotlightSummary:
      'Connecting eastern mineral corridors and submerged-arc converter capacity directly to Visakhapatnam Harbour export gates.',
    spotlightCta: { label: 'Inspect Plant & QA', to: '/manufacturing' },
  },
  {
    key: 'sustainability',
    label: 'Sustainability',
    to: '/sustainability',
  },
  {
    key: 'about',
    label: 'About',
    to: '/about',
    columns: [
      {
        heading: 'Heritage & Governance',
        links: [
          {
            label: 'Company Legacy & Leadership',
            meta: 'DKG Group ethos & Shri Vijay Gupta',
            to: '/about',
          },
          {
            label: 'Awards & Achievements',
            meta: 'ET Best Brand 2025, ET Edge 2026, ICC & Export House',
            to: '/awards-achievements',
          },
          {
            label: 'Corporate Filings (MGT-7 & Policies)',
            meta: 'Annual returns FY 2019–26 & charters',
            to: '/documents',
          },
        ],
      },
      {
        heading: 'People & Impact',
        links: [
          {
            label: 'Community & Grassroots CSR',
            meta: 'Abhaya health camps, Bobbili water & schools',
            to: '/community',
          },
          {
            label: 'Careers & Plant Engineering Roles',
            meta: 'Production, QA/QC, MIS & administration',
            to: '/careers',
          },
        ],
      },
    ],
    spotlightTitle: 'ET Edge Best Organization to Work 2026',
    spotlightSummary:
      'Explore published brand, workplace, social impact, and export recognitions alongside statutory filings and promoter stewardship since 2006.',
    spotlightCta: { label: 'View Awards & Achievements', to: '/awards-achievements' },
  },
  {
    key: 'awards',
    label: 'Awards',
    to: '/awards-achievements',
  },
  {
    key: 'news',
    label: 'News',
    to: '/news',
  },
];

const MOBILE_ACCORDION_GROUPS = [
  {
    id: 'alloys',
    label: 'Alloy Products & Specs',
    links: [
      { label: 'All 10 Product Series', to: '/products' },
      ...PRODUCTS.slice(0, 4).map((p) => ({
        label: `${p.shortName} — ${p.name}`,
        to: `/products/${p.slug}`,
      })),
    ],
  },
  {
    id: 'operations',
    label: 'Operations & Environment',
    links: [
      { label: 'Manufacturing & Quality', to: '/manufacturing' },
      { label: 'Sustainability Disclosures', to: '/sustainability' },
      { label: 'FAQs & Product Guide', to: '/faq' },
    ],
  },
  {
    id: 'corporate',
    label: 'Corporate, CSR & Filings',
    links: [
      { label: 'About, Legacy & Leadership', to: '/about' },
      { label: 'Awards & Achievements', to: '/awards-achievements' },
      { label: 'Community & CSR', to: '/community' },
      { label: 'News & Technical Articles', to: '/news' },
      { label: 'Careers', to: '/careers' },
      { label: 'Corporate Documents (MGT-7)', to: '/documents' },
      { label: 'Contact & Quotation', to: '/contact' },
    ],
  },
];

export function Layout({ children }: LayoutProps) {
  const { pathname, search, hash } = useLocation();
  const { openSearch } = useSearch();
  useTapTargets();
  useMobileRails();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionsMenuOpen, setSectionsMenuOpen] = useState(false);
  const [activeMegaKey, setActiveMegaKey] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>('alloys');
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sectionsTriggerRef = useRef<HTMLButtonElement>(null);
  const sectionsPopoverRef = useRef<HTMLDivElement>(null);
  const closeMegaTimerRef = useRef<number | null>(null);

  const isHome = pathname === '/';
  // The particle hero now follows the active theme, so the header never needs a forced-dark overlay state.
  const darkHeroOverlayHeader = false;

  const activeMegaItem =
    PRIMARY_NAV.find((item) => item.key === activeMegaKey && item.columns) ?? null;

  useEffect(() => {
    setMobileMenuOpen(false);
    setSectionsMenuOpen(false);
    setActiveMegaKey(null);
  }, [pathname, search, hash]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hash) {
      const targetId = hash.slice(1);
      let cancelled = false;

      const alignToHash = async (smooth: boolean) => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
        if (cancelled) return;
        ScrollTrigger.refresh();
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        const targetTop = Math.max(
          0,
          targetEl.getBoundingClientRect().top + window.scrollY - 68
        );
        window.scrollTo({
          top: targetTop,
          behavior: smooth && !prefersReduced ? 'smooth' : ('auto' as ScrollBehavior),
        });
      };

      const rafId = window.requestAnimationFrame(() => {
        void alignToHash(false);
      });
      return () => {
        cancelled = true;
        window.cancelAnimationFrame(rafId);
      };
    }

    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : ('instant' as ScrollBehavior) });
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!activeMegaKey) return;

    const handleOutside = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setActiveMegaKey(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaKey(null);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [activeMegaKey]);

  useEffect(() => {
    if (!sectionsMenuOpen) return;

    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        sectionsPopoverRef.current?.contains(target) ||
        sectionsTriggerRef.current?.contains(target)
      ) {
        return;
      }
      setSectionsMenuOpen(false);
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSectionsMenuOpen(false);
        sectionsTriggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [sectionsMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleSectionSelect = (id: string) => {
    setSectionsMenuOpen(false);
    setMobileMenuOpen(false);
    setActiveMegaKey(null);
    if (isHome) {
      const targetEl = document.getElementById(id);
      if (targetEl) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetEl.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    }
  };

  const openMegaMenu = (key: string | null) => {
    if (closeMegaTimerRef.current) {
      window.clearTimeout(closeMegaTimerRef.current);
      closeMegaTimerRef.current = null;
    }
    setActiveMegaKey(key);
  };

  const scheduleCloseMegaMenu = () => {
    if (closeMegaTimerRef.current) {
      window.clearTimeout(closeMegaTimerRef.current);
    }
    closeMegaTimerRef.current = window.setTimeout(() => {
      setActiveMegaKey(null);
    }, 140);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] transition-colors duration-200">
      <RouteTransitionLoader />
      <ScrollProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#10243A] focus:text-[#F4F8FC] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Compact 3-Zone Single-Row Sticky Top Bar + Desktop MegaMenuNavbar */}
      <header
        ref={headerRef}
        onMouseLeave={scheduleCloseMegaMenu}
        className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
          darkHeroOverlayHeader
            ? 'bg-[#07111F]/92 backdrop-blur-sm border-[#F4F8FC]/14 text-[#F4F8FC]'
            : 'bg-[#FFFFFF]/95 dark:bg-[#07111F]/95 backdrop-blur-sm border-[#10243A]/12 dark:border-[#F4F8FC]/14 text-[#10243A] dark:text-[#F4F8FC]'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-5 relative">
          {/* Zone 1: Brand Emblem + Single-line Architectural Lockup */}
          <Link
            to="/"
            aria-label="Berry Alloys Limited — Home"
            className="whitespace-nowrap shrink-0 flex items-center focus-visible:outline-2 focus-visible:outline-[#69C5F5] focus-visible:outline-offset-2"
          >
            <BrandLockup
              variant="header"
              surface={darkHeroOverlayHeader ? 'dark' : 'auto'}
            />
          </Link>

          {/* Zone 2: 5 concise single-line nav links with MegaMenu triggers */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6">
            {PRIMARY_NAV.map((item) => {
              const hasMega = Boolean(item.columns);
              const megaOpen = activeMegaKey === item.key;

              return (
                <div
                  key={item.to}
                  onMouseEnter={() => openMegaMenu(hasMega ? item.key : null)}
                  className="relative flex items-center gap-1"
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                        isActive || megaOpen
                          ? darkHeroOverlayHeader
                            ? 'text-[#69C5F5]'
                            : 'text-brand dark:text-[#69C5F5]'
                          : darkHeroOverlayHeader
                          ? 'text-[#F4F8FC]/85 hover:text-[#F4F8FC]'
                          : 'text-[#465C72] hover:text-[#10243A] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            darkHeroOverlayHeader
                              ? 'bg-[#69C5F5]'
                              : 'bg-brand dark:bg-[#69C5F5]'
                          } ${
                            isActive || megaOpen
                              ? 'scale-x-100'
                              : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>

                  {hasMega && (
                    <button
                      type="button"
                      aria-expanded={megaOpen}
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() => openMegaMenu(megaOpen ? null : item.key)}
                      className={`p-0.5 transition-transform duration-150 cursor-pointer ${
                        megaOpen ? 'rotate-180 text-brand dark:text-[#69C5F5]' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Zone 3: Search Modal Trigger + Theme Switcher + Explore Sections (< xl) + Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open global search modal (Cmd+K)"
              title="Search Alloys, FAQs & Filings (⌘K)"
              className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                darkHeroOverlayHeader
                  ? 'border-[#F4F8FC]/22 bg-[#07111F]/60 text-[#F4F8FC] hover:border-[#69C5F5] hover:text-[#69C5F5]'
                  : 'border-[#10243A]/20 bg-[#FFFFFF]/70 text-[#10243A] hover:border-brand hover:text-brand dark:border-[#F4F8FC]/22 dark:bg-[#0D1B2E] dark:text-[#F4F8FC] dark:hover:border-[#69C5F5] dark:hover:text-[#69C5F5]'
              }`}
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden xl:inline font-mono-tabular text-[11px] opacity-80">⌘K</span>
            </button>

            <LanguageSelector className="hidden lg:block" />
            <ThemeToggle overDarkHero={darkHeroOverlayHeader} />

            {/* Compact "Explore sections" menu for screens below xl */}
            <button
              ref={sectionsTriggerRef}
              type="button"
              onClick={() => setSectionsMenuOpen((prev) => !prev)}
              aria-expanded={sectionsMenuOpen}
              aria-controls="explore-sections-menu"
              className={`xl:hidden inline-flex items-center gap-1 sm:gap-1.5 min-h-[40px] px-2 sm:px-3 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                darkHeroOverlayHeader
                  ? 'border-[#F4F8FC]/22 text-[#F4F8FC] hover:border-[#69C5F5]'
                  : 'border-[#10243A]/20 text-[#10243A] hover:border-brand dark:border-[#F4F8FC]/22 dark:text-[#F4F8FC] dark:hover:border-[#69C5F5]'
              }`}
            >
              <Compass
                className={`w-3.5 h-3.5 ${
                  darkHeroOverlayHeader
                    ? 'text-[#69C5F5]'
                    : 'text-brand dark:text-[#69C5F5]'
                }`}
                aria-hidden="true"
              />
              <span className="hidden lg:inline">Explore sections</span>
              <span className="lg:hidden">Chapters</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  sectionsMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <Link
              to="/#enquiry"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault();
                  handleSectionSelect('enquiry');
                }
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-150 whitespace-nowrap shrink-0 ${
                darkHeroOverlayHeader
                  ? 'bg-[#0A6AA1] text-[#F4F8FC] hover:bg-[#004C73] hover:text-[#F4F8FC]'
                  : 'bg-brand text-on-brand hover:bg-brand-hover'
              }`}
            >
              Request Quote
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label="Open navigation menu"
              className={`lg:hidden inline-flex items-center justify-center w-10 h-10 transition-colors cursor-pointer ${
                darkHeroOverlayHeader
                  ? 'text-[#F4F8FC] hover:bg-[#0D1B2E]'
                  : 'text-[#10243A] hover:bg-[#F1F6FB] dark:text-[#F4F8FC] dark:hover:bg-[#0D1B2E]'
              }`}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Explore Sections Dropdown (< xl screens) */}
          <AnimatePresence>
            {sectionsMenuOpen && (
              <motion.div
                ref={sectionsPopoverRef}
                id="explore-sections-menu"
                role="region"
                aria-label="Homepage chapters"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="xl:hidden absolute right-4 sm:right-6 lg:right-8 top-full mt-1 w-76 max-w-[calc(100vw-2rem)] bg-[#FFFFFF] dark:bg-[#10243A] text-[#10243A] dark:text-[#F4F8FC] border border-[#10243A]/18 dark:border-[#F4F8FC]/18 shadow-2xl p-3 z-50 max-h-[75vh] overflow-y-auto"
              >
                <p className="px-2 py-1.5 text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5] border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
                  Story Chapters ({HOME_CHAPTERS.length})
                </p>
                <ul className="py-1.5 divide-y divide-[#10243A]/8 dark:divide-[#F4F8FC]/8">
                  {HOME_CHAPTERS.map((chapter) => (
                    <li key={chapter.id}>
                      <Link
                        to={`/#${chapter.id}`}
                        onClick={() => handleSectionSelect(chapter.id)}
                        className="flex items-center justify-between gap-3 px-2 py-2 min-h-[40px] text-xs hover:bg-[#F1F6FB] dark:hover:bg-[#12243B] transition-colors"
                      >
                        <span className="flex items-center gap-2.5 font-medium text-[#10243A] dark:text-[#F4F8FC]">
                          <span className="font-mono-tabular text-[11px] text-brand dark:text-[#69C5F5]">
                            {chapter.number}
                          </span>
                          <span>{chapter.label}</span>
                        </span>
                        <span className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] truncate max-w-[135px]">
                          {chapter.summary}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop MegaMenuNavbar Panel */}
        <AnimatePresence>
          {activeMegaItem && (
            <motion.div
              key={activeMegaItem.key}
              onMouseEnter={() => openMegaMenu(activeMegaItem.key)}
              onMouseLeave={scheduleCloseMegaMenu}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block absolute inset-x-0 top-full border-b border-[#10243A]/15 dark:border-[#F4F8FC]/14 bg-[#FFFFFF]/96 dark:bg-[#10243A]/96 backdrop-blur-xl text-[#10243A] dark:text-[#F4F8FC] shadow-2xl z-50"
            >
              <div className="max-w-[1360px] mx-auto px-6 lg:px-8 py-7 grid grid-cols-12 gap-8 items-start">
                <div className="col-span-8 grid grid-cols-2 gap-8">
                  {activeMegaItem.columns?.map((col) => (
                    <div key={col.heading} className="space-y-3">
                      <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-brand dark:text-[#69C5F5] pb-2 border-b border-[#10243A]/10 dark:border-[#F4F8FC]/10">
                        {col.heading}
                      </p>
                      <ul className="space-y-1.5">
                        {col.links.map((link) => (
                          <li key={link.to}>
                            <Link
                              to={link.to}
                              onClick={() => {
                                setActiveMegaKey(null);
                                if (link.to.startsWith('/#')) {
                                  handleSectionSelect(link.to.replace('/#', ''));
                                }
                              }}
                              className="group block px-3 py-2 border border-transparent hover:border-[#10243A]/12 dark:hover:border-[#F4F8FC]/14 hover:bg-[#FFFFFF] dark:hover:bg-[#12243B] transition-colors"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-[#10243A] dark:text-[#F4F8FC] group-hover:text-brand dark:group-hover:text-[#69C5F5] transition-colors">
                                  {link.label}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand dark:text-[#69C5F5] transition-all -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
                              </div>
                              <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] mt-0.5">
                                {link.meta}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Mega Menu Editorial Callout Box */}
                <div className="col-span-4 bg-[#F1F6FB]/75 dark:bg-[#12243B]/90 border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-5 space-y-3">
                  <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-brand dark:text-[#69C5F5]">
                    Berry Alloys Reference
                  </p>
                  <p className="font-display text-2xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                    {activeMegaItem.spotlightTitle}
                  </p>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                    {activeMegaItem.spotlightSummary}
                  </p>
                  {activeMegaItem.spotlightCta && (
                    <Link
                      to={activeMegaItem.spotlightCta.to}
                      onClick={() => setActiveMegaKey(null)}
                      className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-brand dark:text-[#69C5F5] hover:underline"
                    >
                      <span>{activeMegaItem.spotlightCta.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation Drawer with Accordion Groups */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden bg-[#10243A]/65 backdrop-blur-xs flex justify-end"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setMobileMenuOpen(false);
                menuButtonRef.current?.focus();
              }
            }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm bg-[#FFFFFF] dark:bg-[#10243A] text-[#10243A] dark:text-[#F4F8FC] h-full overflow-y-auto p-6 flex flex-col justify-between border-l border-[#10243A]/15 dark:border-[#F4F8FC]/14"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
                  <BrandLockup variant="drawer" surface="auto" />
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      menuButtonRef.current?.focus();
                    }}
                    aria-label="Close navigation menu"
                    className="inline-flex items-center justify-center w-11 h-11 text-[#10243A] dark:text-[#F4F8FC] hover:bg-[#F1F6FB] dark:hover:bg-[#12243B] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Mobile Search Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSearch();
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2.5 flex items-center justify-between bg-[#FFFFFF] dark:bg-[#12243B] border border-[#10243A]/16 dark:border-[#F4F8FC]/18 text-xs font-medium text-[#465C72] dark:text-[#B5C5D7] cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2">
                    <Search className="w-4 h-4 text-brand dark:text-[#69C5F5]" aria-hidden="true" />
                    Search Alloys, FAQs & Filings…
                  </span>
                  <span className="font-mono-tabular text-[10px] opacity-75">⌘K</span>
                </button>

                <div className="pb-3">
                  <LanguageSelector align="start" />
                </div>
                <nav aria-label="Mobile navigation" className="space-y-1">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold border-b border-[#10243A]/8 dark:border-[#F4F8FC]/8 ${
                        isActive
                          ? 'text-brand dark:text-[#69C5F5]'
                          : 'text-[#10243A] dark:text-[#F4F8FC]'
                      }`
                    }
                  >
                    Home
                  </NavLink>

                  {MOBILE_ACCORDION_GROUPS.map((group) => {
                    const isOpen = openMobileGroup === group.id;
                    return (
                      <div
                        key={group.id}
                        className="border-b border-[#10243A]/10 dark:border-[#F4F8FC]/10"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenMobileGroup(isOpen ? null : group.id)}
                          className="w-full min-h-[44px] px-3 py-2.5 flex items-center justify-between text-sm font-semibold text-[#10243A] dark:text-[#F4F8FC] cursor-pointer"
                        >
                          <span>{group.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-150 ${
                              isOpen ? 'rotate-180 text-brand dark:text-[#69C5F5]' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                        {isOpen && (
                          <div className="pb-2 pl-4 space-y-0.5">
                            {group.links.map((link) => (
                              <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                  `block px-3 py-2 text-xs font-medium ${
                                    isActive
                                      ? 'text-brand bg-[#F1F6FB] dark:text-[#69C5F5] dark:bg-[#12243B]'
                                      : 'text-[#465C72] hover:text-[#10243A] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC]'
                                  }`
                                }
                              >
                                {link.label}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 space-y-4">
                <Link
                  to="/#enquiry"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-brand dark:bg-[#0A6AA1] text-[#F4F8FC] hover:bg-brand-hover transition-colors"
                >
                  Request Alloy Quotation
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <p className="text-xs text-[#465C72] dark:text-[#B5C5D7] font-mono-tabular">
                  CIN: {COMPANY_INFO.cin}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content — intentionally free of transform/filter wrappers so GSAP ScrollTrigger pinning & position:sticky remain viewport-anchored */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Dual-Theme Architectural Footer + Animated ASCII Reveal */}
      <footer className="bg-[#F1F6FB] text-[#10243A] dark:bg-[#07111F] dark:text-[#F4F8FC] border-t border-[#10243A]/15 dark:border-[#F4F8FC]/14 transition-colors duration-200">
        <AnimatedFooterCanvas />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#10243A]/14 dark:border-[#F4F8FC]/12">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center">
                <BrandLockup variant="footer" surface="auto" />
              </div>
              <p className="text-sm text-[#465C72] dark:text-[#B5C5D7] leading-relaxed max-w-sm">
                DKG Group flagship ferro alloy producer delivering Manganese, Silicon, and Chromium grades from eastern and coastal India to global steelmakers.
              </p>
              <div className="pt-2 space-y-1 text-xs font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                <p>CIN: {COMPANY_INFO.cin}</p>
                <p>Commercial Desk: marketing@berryalloys.in</p>
              </div>
              <div className="pt-2">
                <SocialFlipButton heading="Connect & Direct Channels" />
              </div>

              <div className="pt-2">
                <Link
                  to="/contact?tab=quote"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#004C73] transition-colors"
                >
                  Open Dedicated Quotation Page
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-mono-tabular text-xs font-medium tracking-wider uppercase text-brand dark:text-[#69C5F5]">
                Homepage Story
              </h2>
              <ul className="space-y-1.5 text-xs text-[#465C72] dark:text-[#F4F8FC]/80">
                {HOME_CHAPTERS.map((ch) => (
                  <li key={ch.id}>
                    <Link
                      to={`/#${ch.id}`}
                      className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors"
                    >
                      {ch.number}. {ch.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-mono-tabular text-xs font-medium tracking-wider uppercase text-brand dark:text-[#69C5F5]">
                Detailed Pages
              </h2>
              <ul className="space-y-2.5 text-sm text-[#465C72] dark:text-[#F4F8FC]/80">
                <li>
                  <Link to="/products" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    All Product Specs
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    Company &amp; Leadership
                  </Link>
                </li>
                <li>
                  <Link to="/awards-achievements" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    Awards &amp; Achievements
                  </Link>
                </li>
                <li>
                  <Link to="/manufacturing" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    Manufacturing & Quality
                  </Link>
                </li>
                <li>
                  <Link to="/sustainability" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    Community & CSR
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    News & Media
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/documents" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    Corporate Documents
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                    FAQs & Product Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-mono-tabular text-xs font-medium tracking-wider uppercase text-brand dark:text-[#69C5F5]">
                Offices & Works
              </h2>
              <div className="space-y-4 text-xs text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                {OFFICES.map((office) => (
                  <div key={office.id}>
                    <p className="font-semibold text-[#10243A] dark:text-[#F4F8FC]">{office.label}</p>
                    <p>{office.address}</p>
                    <p className="font-mono-tabular text-[#10243A]/75 dark:text-[#F4F8FC]/70 mt-0.5">{office.phone}</p>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/10">
                  <p className="font-semibold text-[#10243A] dark:text-[#F4F8FC]/90">{UPCOMING_OFFICE_NOTICE.title}</p>
                  <p>{UPCOMING_OFFICE_NOTICE.address}</p>
                  <p className="text-[#465C72] dark:text-[#B5C5D7] mt-0.5">
                    Move timeline pending formal confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 pb-24 sm:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#465C72] dark:text-[#B5C5D7]">
            <p>© 2026 Berry Alloys Limited. Presentation prototype.</p>
            <div className="flex flex-wrap items-center gap-4">
              <AmbientMotionToggle />
              <button
                type="button"
                onClick={triggerReplayIntro}
                className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors cursor-pointer"
              >
                Replay intro
              </button>
              <span aria-hidden="true">·</span>
              <Link to="/faq" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                FAQs
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/insights" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                Buyer Guides
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/en/" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                International Buyers
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/documents" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                Statutory Disclosures
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/contact" className="hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors">
                Dedicated Contact Page
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
