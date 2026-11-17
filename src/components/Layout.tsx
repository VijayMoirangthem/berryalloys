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
import { AnimatedFooterCanvas } from './ui/AnimatedFooterCanvas';
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
      'Explore statutory filings, promoter stewardship since 2006, and community welfare initiatives surrounding plant belts.',
    spotlightCta: { label: 'Read Corporate Profile', to: '/about' },
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
  const darkHeroOverlayHeader = isHome && !scrolledPastHero;

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
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#141618] dark:bg-[#121417] dark:text-[#F3F0E9] transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#141618] focus:text-[#F3F0E9] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Compact 3-Zone Single-Row Sticky Top Bar + Desktop MegaMenuNavbar */}
      <header
        ref={headerRef}
        onMouseLeave={scheduleCloseMegaMenu}
        className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
          darkHeroOverlayHeader
            ? 'bg-[#121417]/92 backdrop-blur-sm border-[#F3F0E9]/14 text-[#F3F0E9]'
            : 'bg-[#F6F4EF]/95 dark:bg-[#121417]/95 backdrop-blur-sm border-[#141618]/12 dark:border-[#F3F0E9]/14 text-[#141618] dark:text-[#F3F0E9]'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-5 relative">
          {/* Zone 1: Brand Emblem + Single-line Architectural Lockup */}
          <Link
            to="/"
            aria-label="Berry Alloys Limited — Home"
            className="whitespace-nowrap shrink-0 flex items-center focus-visible:outline-2 focus-visible:outline-[#EC743C] focus-visible:outline-offset-2"
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
                            ? 'text-[#EC743C]'
                            : 'text-[#9E4B28] dark:text-[#EC743C]'
                          : darkHeroOverlayHeader
                          ? 'text-[#F3F0E9]/85 hover:text-[#F3F0E9]'
                          : 'text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
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
                              ? 'bg-[#EC743C]'
                              : 'bg-[#9E4B28] dark:bg-[#EC743C]'
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
                        megaOpen ? 'rotate-180 text-[#9E4B28] dark:text-[#EC743C]' : 'opacity-70 hover:opacity-100'
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
                  ? 'border-[#F3F0E9]/22 bg-[#121417]/60 text-[#F3F0E9] hover:border-[#EC743C] hover:text-[#EC743C]'
                  : 'border-[#141618]/20 bg-[#FFFFFF]/70 text-[#141618] hover:border-[#9E4B28] hover:text-[#9E4B28] dark:border-[#F3F0E9]/22 dark:bg-[#191C20] dark:text-[#F3F0E9] dark:hover:border-[#EC743C] dark:hover:text-[#EC743C]'
              }`}
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden xl:inline font-mono-tabular text-[11px] opacity-80">⌘K</span>
            </button>

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
                  ? 'border-[#F3F0E9]/22 text-[#F3F0E9] hover:border-[#EC743C]'
                  : 'border-[#141618]/20 text-[#141618] hover:border-[#9E4B28] dark:border-[#F3F0E9]/22 dark:text-[#F3F0E9] dark:hover:border-[#EC743C]'
              }`}
            >
              <Compass
                className={`w-3.5 h-3.5 ${
                  darkHeroOverlayHeader
                    ? 'text-[#EC743C]'
                    : 'text-[#9E4B28] dark:text-[#EC743C]'
                }`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Explore sections</span>
              <span className="sm:hidden">Chapters</span>
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
                  ? 'bg-[#A95632] text-[#F3F0E9] hover:bg-[#EC743C] hover:text-[#141618]'
                  : 'bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#EC743C] dark:hover:text-[#141618]'
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
                  ? 'text-[#F3F0E9] hover:bg-[#191C20]'
                  : 'text-[#141618] hover:bg-[#ECE8DF] dark:text-[#F3F0E9] dark:hover:bg-[#191C20]'
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
                className="xl:hidden absolute right-4 sm:right-6 lg:right-8 top-full mt-1 w-76 max-w-[calc(100vw-2rem)] bg-[#FFFFFF] dark:bg-[#141618] text-[#141618] dark:text-[#F3F0E9] border border-[#141618]/18 dark:border-[#F3F0E9]/18 shadow-2xl p-3 z-50 max-h-[75vh] overflow-y-auto"
              >
                <p className="px-2 py-1.5 text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C] border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
                  Story Chapters ({HOME_CHAPTERS.length})
                </p>
                <ul className="py-1.5 divide-y divide-[#141618]/8 dark:divide-[#F3F0E9]/8">
                  {HOME_CHAPTERS.map((chapter) => (
                    <li key={chapter.id}>
                      <Link
                        to={`/#${chapter.id}`}
                        onClick={() => handleSectionSelect(chapter.id)}
                        className="flex items-center justify-between gap-3 px-2 py-2 min-h-[40px] text-xs hover:bg-[#ECE8DF] dark:hover:bg-[#20242A] transition-colors"
                      >
                        <span className="flex items-center gap-2.5 font-medium text-[#141618] dark:text-[#F3F0E9]">
                          <span className="font-mono-tabular text-[11px] text-[#9E4B28] dark:text-[#EC743C]">
                            {chapter.number}
                          </span>
                          <span>{chapter.label}</span>
                        </span>
                        <span className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB] truncate max-w-[135px]">
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
              className="hidden lg:block absolute inset-x-0 top-full border-b border-[#141618]/15 dark:border-[#F3F0E9]/14 bg-[#FFFFFF]/96 dark:bg-[#141618]/96 backdrop-blur-xl text-[#141618] dark:text-[#F3F0E9] shadow-2xl z-50"
            >
              <div className="max-w-[1360px] mx-auto px-6 lg:px-8 py-7 grid grid-cols-12 gap-8 items-start">
                <div className="col-span-8 grid grid-cols-2 gap-8">
                  {activeMegaItem.columns?.map((col) => (
                    <div key={col.heading} className="space-y-3">
                      <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C] pb-2 border-b border-[#141618]/10 dark:border-[#F3F0E9]/10">
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
                              className="group block px-3 py-2 border border-transparent hover:border-[#141618]/12 dark:hover:border-[#F3F0E9]/14 hover:bg-[#F6F4EF] dark:hover:bg-[#20242A] transition-colors"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-[#141618] dark:text-[#F3F0E9] group-hover:text-[#9E4B28] dark:group-hover:text-[#EC743C] transition-colors">
                                  {link.label}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#9E4B28] dark:text-[#EC743C] transition-all -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
                              </div>
                              <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB] mt-0.5">
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
                <div className="col-span-4 bg-[#ECE8DF]/75 dark:bg-[#20242A]/90 border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-5 space-y-3">
                  <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                    Berry Alloys Reference
                  </p>
                  <p className="font-display text-2xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                    {activeMegaItem.spotlightTitle}
                  </p>
                  <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                    {activeMegaItem.spotlightSummary}
                  </p>
                  {activeMegaItem.spotlightCta && (
                    <Link
                      to={activeMegaItem.spotlightCta.to}
                      onClick={() => setActiveMegaKey(null)}
                      className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline"
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
            className="fixed inset-0 z-50 lg:hidden bg-[#141618]/65 backdrop-blur-xs flex justify-end"
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
              className="w-full max-w-sm bg-[#F6F4EF] dark:bg-[#141618] text-[#141618] dark:text-[#F3F0E9] h-full overflow-y-auto p-6 flex flex-col justify-between border-l border-[#141618]/15 dark:border-[#F3F0E9]/14"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
                  <BrandLockup variant="drawer" surface="auto" />
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      menuButtonRef.current?.focus();
                    }}
                    aria-label="Close navigation menu"
                    className="inline-flex items-center justify-center w-11 h-11 text-[#141618] dark:text-[#F3F0E9] hover:bg-[#ECE8DF] dark:hover:bg-[#20242A] transition-colors cursor-pointer"
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
                  className="w-full min-h-[44px] px-3.5 py-2.5 flex items-center justify-between bg-[#FFFFFF] dark:bg-[#20242A] border border-[#141618]/16 dark:border-[#F3F0E9]/18 text-xs font-medium text-[#4A5054] dark:text-[#A1A7AB] cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#9E4B28] dark:text-[#EC743C]" aria-hidden="true" />
                    Search Alloys, FAQs & Filings…
                  </span>
                  <span className="font-mono-tabular text-[10px] opacity-75">⌘K</span>
                </button>

                <nav aria-label="Mobile navigation" className="space-y-1">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `min-h-[44px] flex items-center px-3 py-2 text-sm font-semibold border-b border-[#141618]/8 dark:border-[#F3F0E9]/8 ${
                        isActive
                          ? 'text-[#9E4B28] dark:text-[#EC743C]'
                          : 'text-[#141618] dark:text-[#F3F0E9]'
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
                        className="border-b border-[#141618]/10 dark:border-[#F3F0E9]/10"
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenMobileGroup(isOpen ? null : group.id)}
                          className="w-full min-h-[44px] px-3 py-2.5 flex items-center justify-between text-sm font-semibold text-[#141618] dark:text-[#F3F0E9] cursor-pointer"
                        >
                          <span>{group.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-150 ${
                              isOpen ? 'rotate-180 text-[#9E4B28] dark:text-[#EC743C]' : ''
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
                                      ? 'text-[#9E4B28] bg-[#ECE8DF] dark:text-[#EC743C] dark:bg-[#20242A]'
                                      : 'text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
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

              <div className="pt-6 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 space-y-4">
                <Link
                  to="/#enquiry"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold bg-[#9E4B28] dark:bg-[#A95632] text-[#F3F0E9] hover:bg-[#823B1D] transition-colors"
                >
                  Request Alloy Quotation
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] font-mono-tabular">
                  CIN: {COMPANY_INFO.cin}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Dual-Theme Architectural Footer + Animated ASCII Reveal */}
      <footer className="bg-[#ECE8DF] text-[#141618] dark:bg-[#0D0F12] dark:text-[#F3F0E9] border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 transition-colors duration-200">
        <AnimatedFooterCanvas />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#141618]/14 dark:border-[#F3F0E9]/12">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center">
                <BrandLockup variant="footer" surface="auto" />
              </div>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-sm">
                DKG Group flagship ferro alloy producer delivering Manganese, Silicon, and Chromium grades from eastern and coastal India to global steelmakers.
              </p>
              <div className="pt-2 space-y-1 text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                <p>CIN: {COMPANY_INFO.cin}</p>
                <p>Commercial Desk: marketing@berryalloys.in</p>
              </div>
              <div className="pt-2">
                <SocialFlipButton heading="Connect & Direct Channels" />
              </div>

              <div className="pt-2">
                <Link
                  to="/contact?tab=quote"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#823B1D] transition-colors"
                >
                  Open Dedicated Quotation Page
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-mono-tabular text-xs font-medium tracking-wider uppercase text-[#9E4B28] dark:text-[#EC743C]">
                Homepage Story
              </h2>
              <ul className="space-y-1.5 text-xs text-[#4A5054] dark:text-[#F3F0E9]/80">
                {HOME_CHAPTERS.map((ch) => (
                  <li key={ch.id}>
                    <Link
                      to={`/#${ch.id}`}
                      className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors"
                    >
                      {ch.number}. {ch.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-mono-tabular text-xs font-medium tracking-wider uppercase text-[#9E4B28] dark:text-[#EC743C]">
                Detailed Pages
              </h2>
              <ul className="space-y-2.5 text-sm text-[#4A5054] dark:text-[#F3F0E9]/80">
                <li>
                  <Link to="/products" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    All Product Specs
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    Company & Leadership
                  </Link>
                </li>
                <li>
                  <Link to="/manufacturing" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    Manufacturing & Quality
                  </Link>
                </li>
                <li>
                  <Link to="/sustainability" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    Community & CSR
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    News & Media
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/documents" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    Corporate Documents
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                    FAQs & Product Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-mono-tabular text-xs font-medium tracking-wider uppercase text-[#9E4B28] dark:text-[#EC743C]">
                Offices & Works
              </h2>
              <div className="space-y-4 text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                {OFFICES.map((office) => (
                  <div key={office.id}>
                    <p className="font-semibold text-[#141618] dark:text-[#F3F0E9]">{office.label}</p>
                    <p>{office.address}</p>
                    <p className="font-mono-tabular text-[#141618]/75 dark:text-[#F3F0E9]/70 mt-0.5">{office.phone}</p>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#141618]/12 dark:border-[#F3F0E9]/10">
                  <p className="font-semibold text-[#141618] dark:text-[#F3F0E9]/90">{UPCOMING_OFFICE_NOTICE.title}</p>
                  <p>{UPCOMING_OFFICE_NOTICE.address}</p>
                  <p className="text-[#4A5054] dark:text-[#A1A7AB] mt-0.5">
                    Move timeline pending formal confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#4A5054] dark:text-[#A1A7AB]">
            <p>© 2026 Berry Alloys Limited. Presentation prototype.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/faq" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                FAQs
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/documents" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                Statutory Disclosures
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/contact" className="hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors">
                Dedicated Contact Page
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
