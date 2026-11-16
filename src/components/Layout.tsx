import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Compass, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OFFICIAL_BRAND_MARK } from '../data/assets';
import { HOME_CHAPTERS } from '../data/chapters';
import { COMPANY_INFO, OFFICES, UPCOMING_OFFICE_NOTICE } from '../data/company';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const PRIMARY_NAV = [
  { label: 'Products', to: '/products' },
  { label: 'Manufacturing', to: '/manufacturing' },
  { label: 'Sustainability', to: '/sustainability' },
  { label: 'About', to: '/about' },
  { label: 'News', to: '/news' },
];

const MOBILE_ALL_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products & Specifications', to: '/products' },
  { label: 'Manufacturing & Quality', to: '/manufacturing' },
  { label: 'Sustainability', to: '/sustainability' },
  { label: 'About, Legacy & Leadership', to: '/about' },
  { label: 'Community & CSR', to: '/community' },
  { label: 'News & Media', to: '/news' },
  { label: 'Careers', to: '/careers' },
  { label: 'Corporate Documents', to: '/documents' },
  { label: 'FAQs & Product Guide', to: '/faq' },
  { label: 'Contact & Quotation', to: '/contact' },
];

export function Layout({ children }: LayoutProps) {
  const { pathname, search, hash } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionsMenuOpen, setSectionsMenuOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sectionsTriggerRef = useRef<HTMLButtonElement>(null);
  const sectionsPopoverRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';
  const darkHeroOverlayHeader = isHome && !scrolledPastHero;

  useEffect(() => {
    setMobileMenuOpen(false);
    setSectionsMenuOpen(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#141618] dark:bg-[#121417] dark:text-[#F3F0E9] transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#141618] focus:text-[#F3F0E9] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Compact 3-Zone Single-Row Sticky Top Bar */}
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
          darkHeroOverlayHeader
            ? 'bg-[#121417]/92 backdrop-blur-sm border-[#F3F0E9]/14 text-[#F3F0E9]'
            : 'bg-[#F6F4EF]/95 dark:bg-[#121417]/95 backdrop-blur-sm border-[#141618]/12 dark:border-[#F3F0E9]/14 text-[#141618] dark:text-[#F3F0E9]'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6 relative">
          {/* Zone 1: Brand Emblem + Single-line Wordmark */}
          <Link
            to="/"
            className="font-display font-bold text-base sm:text-xl tracking-tight uppercase whitespace-nowrap shrink-0 flex items-center gap-2 sm:gap-2.5"
          >
            <span
              className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 p-0.5 shrink-0 ${
                darkHeroOverlayHeader
                  ? 'bg-[#F6F4EF]'
                  : 'bg-[#FFFFFF] border border-[#141618]/10 dark:border-transparent'
              }`}
            >
              <img
                src={OFFICIAL_BRAND_MARK}
                alt="Berry Alloys emblem"
                className="w-full h-full object-contain"
              />
            </span>
            <span>
              Berry Alloys<span className="hidden min-[400px]:inline"> Limited</span>
            </span>
          </Link>

          {/* Zone 2: 5 concise single-line nav links (Desktop lg+) */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                    isActive
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
                      className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        darkHeroOverlayHeader
                          ? 'bg-[#EC743C]'
                          : 'bg-[#9E4B28] dark:bg-[#EC743C]'
                      } ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'}`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Theme Switcher + Explore Sections (< xl) + Primary CTA + Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
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
      </header>

      {/* Mobile Navigation Drawer */}
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
            transition={{ duration: 0.18 }}
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
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm bg-[#F6F4EF] dark:bg-[#141618] text-[#141618] dark:text-[#F3F0E9] h-full overflow-y-auto p-6 flex flex-col justify-between border-l border-[#141618]/15 dark:border-[#F3F0E9]/14"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
                  <span className="font-display font-bold text-lg uppercase tracking-tight">
                    Berry Alloys Limited
                  </span>
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

                <nav aria-label="Mobile navigation" className="py-5 flex flex-col gap-1">
                  {MOBILE_ALL_LINKS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `min-h-[44px] flex items-center px-3 py-2.5 text-base font-medium border-b border-[#141618]/8 dark:border-[#F3F0E9]/8 transition-colors ${
                          isActive
                            ? 'text-[#9E4B28] bg-[#ECE8DF] dark:text-[#EC743C] dark:bg-[#20242A]'
                            : 'text-[#141618]/85 hover:text-[#141618] hover:bg-[#ECE8DF]/60 dark:text-[#F3F0E9]/85 dark:hover:text-[#F3F0E9] dark:hover:bg-[#20242A]'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
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

      {/* Dual-Theme Architectural Footer */}
      <footer className="bg-[#ECE8DF] text-[#141618] dark:bg-[#0D0F12] dark:text-[#F3F0E9] border-t border-[#141618]/15 dark:border-[#F3F0E9]/14 transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#141618]/14 dark:border-[#F3F0E9]/12">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-[#FFFFFF] border border-[#141618]/12 p-1 shrink-0">
                  <img
                    src={OFFICIAL_BRAND_MARK}
                    alt="Berry Alloys Limited emblem"
                    className="w-full h-full object-contain"
                  />
                </span>
                <span className="font-display font-bold text-2xl uppercase tracking-tight">
                  Berry Alloys Limited
                </span>
              </div>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-sm">
                DKG Group flagship ferro alloy producer delivering Manganese, Silicon, and Chromium grades from eastern and coastal India to global steelmakers.
              </p>
              <div className="pt-2 space-y-1 text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                <p>CIN: {COMPANY_INFO.cin}</p>
                <p>Commercial Desk: marketing@berryalloys.in</p>
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
