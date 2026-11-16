import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HOME_CHAPTERS } from '../data/chapters';

const RAIL_STORAGE_KEY = 'berry-rail-expanded';

/**
 * ChapterRail — Collapsible architectural right-edge story navigator (11 chapters).
 * Defaults to a minimal 38px edge index dock so page layouts breathe full-width;
 * expands cleanly into a full 244px chapter index drawer on demand.
 */
export function ChapterRail() {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(HOME_CHAPTERS[0].id);
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(RAIL_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const asideRef = useRef<HTMLElement>(null);
  const expandBtnRef = useRef<HTMLButtonElement>(null);
  const collapseBtnRef = useRef<HTMLButtonElement>(null);
  const pendingFocusRef = useRef<'expand' | 'collapse' | null>(null);

  const activeIndex = Math.max(
    0,
    HOME_CHAPTERS.findIndex((c) => c.id === activeId)
  );
  const activeChapter = HOME_CHAPTERS[activeIndex] ?? HOME_CHAPTERS[0];

  useEffect(() => {
    try {
      window.localStorage.setItem(RAIL_STORAGE_KEY, String(isExpanded));
    } catch {
      // Ignore storage failures
    }
  }, [isExpanded]);

  useEffect(() => {
    const updateActiveChapter = () => {
      const triggerY = window.innerHeight * 0.34;
      let current = HOME_CHAPTERS[0].id;

      for (const chapter of HOME_CHAPTERS) {
        const el = document.getElementById(chapter.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY) {
          current = chapter.id;
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120
      ) {
        current = HOME_CHAPTERS[HOME_CHAPTERS.length - 1].id;
      }

      setActiveId(current);
    };

    updateActiveChapter();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveChapter();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveChapter, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveChapter);
    };
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (!asideRef.current?.contains(e.target as Node)) {
        pendingFocusRef.current = null;
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        pendingFocusRef.current = 'expand';
        setIsExpanded(false);
        if (prefersReduced) {
          window.requestAnimationFrame(() => {
            expandBtnRef.current?.focus();
            pendingFocusRef.current = null;
          });
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, prefersReduced]);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce =
      prefersReduced ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
    setActiveId(id);
  };

  const handleScrollTop = () => {
    const reduce =
      prefersReduced ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const handleToggleExpand = (next: boolean) => {
    pendingFocusRef.current = next ? 'collapse' : 'expand';
    setIsExpanded(next);
    if (prefersReduced) {
      window.requestAnimationFrame(() => {
        if (next) {
          collapseBtnRef.current?.focus();
        } else {
          expandBtnRef.current?.focus();
        }
        pendingFocusRef.current = null;
      });
    }
  };

  const handleRailEntered = (mode: 'expand' | 'collapse') => {
    if (pendingFocusRef.current !== mode) return;
    pendingFocusRef.current = null;
    if (mode === 'collapse') {
      collapseBtnRef.current?.focus();
    } else {
      expandBtnRef.current?.focus();
    }
  };

  return (
    <aside
      ref={asideRef}
      aria-label="Homepage chapters"
      className="hidden xl:flex fixed right-2.5 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          <motion.nav
            key="rail-collapsed"
            id="chapter-rail-nav"
            aria-label="Collapsed chapter index"
            initial={prefersReduced ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, x: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => handleRailEntered('expand')}
            className="pointer-events-auto w-[38px] bg-[#F6F4EF]/94 dark:bg-[#141618]/92 backdrop-blur-md border border-[#141618]/16 dark:border-[#F3F0E9]/18 shadow-lg flex flex-col items-center"
          >
            {/* Expand Trigger */}
            <button
              ref={expandBtnRef}
              type="button"
              onClick={() => handleToggleExpand(true)}
              aria-expanded={false}
              aria-controls="chapter-rail-nav"
              aria-label="Expand story chapter navigation"
              title="Expand Chapter Index"
              className="group relative w-full h-9 flex items-center justify-center border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 text-[#141618] dark:text-[#F3F0E9] hover:bg-[#ECE8DF] dark:hover:bg-[#20242A] hover:text-[#9E4B28] dark:hover:text-[#EC743C] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EC743C] focus-visible:outline-offset-[-2px]"
            >
              <PanelRightOpen className="w-4 h-4" aria-hidden="true" />
              <span
                role="tooltip"
                className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-150 absolute right-full mr-2 px-2.5 py-1 bg-[#141618] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#141618] text-[11px] font-medium whitespace-nowrap shadow-md border border-[#141618]/20 dark:border-[#F3F0E9]/20 flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3 text-[#EC743C] dark:text-[#9E4B28]" aria-hidden="true" />
                Expand Index
              </span>
            </button>

            {/* 11 Interactive Micro-Tick Indicators */}
            <ol className="w-full py-2 flex flex-col items-center">
              {HOME_CHAPTERS.map((chapter) => {
                const isActive = chapter.id === activeId;
                return (
                  <li key={chapter.id} className="w-full">
                    <a
                      href={`#${chapter.id}`}
                      onClick={(e) => handleAnchorClick(e, chapter.id)}
                      aria-current={isActive ? 'location' : undefined}
                      aria-label={`${chapter.number}. ${chapter.label} — ${chapter.summary}`}
                      className="group relative w-full py-1.5 px-1.5 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#EC743C] focus-visible:outline-offset-[-2px]"
                    >
                      <span
                        aria-hidden="true"
                        className={`block transition-all duration-200 ${
                          isActive
                            ? 'w-5 h-[2.5px] bg-[#9E4B28] dark:bg-[#EC743C]'
                            : 'w-2.5 h-[2px] bg-[#141618]/26 dark:bg-[#F3F0E9]/28 group-hover:w-4 group-hover:bg-[#141618]/75 dark:group-hover:bg-[#F3F0E9]/80'
                        }`}
                      />
                      {/* Hover/Focus Architectural Callout Tag */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-150 absolute right-full mr-2 px-2.5 py-1 bg-[#FFFFFF] dark:bg-[#191C20] text-[#141618] dark:text-[#F3F0E9] border border-[#141618]/18 dark:border-[#F3F0E9]/18 shadow-lg text-[11px] whitespace-nowrap flex items-center gap-2"
                      >
                        <span className="font-mono-tabular text-[10px] font-semibold text-[#9E4B28] dark:text-[#EC743C]">
                          {chapter.number}
                        </span>
                        <span className="font-semibold">{chapter.label}</span>
                        <span className="text-[#4A5054] dark:text-[#A1A7AB] text-[10px]">
                          · {chapter.summary}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>

            {/* Active Chapter Number Indicator */}
            <button
              type="button"
              onClick={() => handleToggleExpand(true)}
              aria-label={`Current chapter ${activeChapter.number} of ${HOME_CHAPTERS.length}. Click to open chapter drawer.`}
              className="w-full py-2 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 flex flex-col items-center justify-center text-[10px] font-mono-tabular font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:bg-[#ECE8DF] dark:hover:bg-[#20242A] transition-colors cursor-pointer"
            >
              <span>{activeChapter.number}</span>
              <span className="text-[9px] font-normal text-[#4A5054] dark:text-[#A1A7AB]">
                /{HOME_CHAPTERS.length}
              </span>
            </button>
          </motion.nav>
        ) : (
          <motion.nav
            key="rail-expanded"
            id="chapter-rail-nav"
            aria-label="Expanded chapter index"
            initial={prefersReduced ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, x: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => handleRailEntered('collapse')}
            className="pointer-events-auto w-[244px] bg-[#F6F4EF]/96 dark:bg-[#141618]/96 backdrop-blur-md border border-[#141618]/18 dark:border-[#F3F0E9]/20 shadow-2xl flex flex-col"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-[#141618]/12 dark:border-[#F3F0E9]/14 bg-[#ECE8DF]/70 dark:bg-[#191C20]/80">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono-tabular text-[10px] uppercase tracking-widest font-semibold text-[#9E4B28] dark:text-[#EC743C]">
                  Story Index
                </span>
                <span className="font-mono-tabular text-[10px] text-[#4A5054] dark:text-[#A1A7AB]">
                  {activeChapter.number}/{HOME_CHAPTERS.length}
                </span>
              </div>
              <button
                ref={collapseBtnRef}
                type="button"
                onClick={() => handleToggleExpand(false)}
                aria-expanded={true}
                aria-controls="chapter-rail-nav"
                aria-label="Collapse story chapter navigation"
                title="Collapse Chapter Index (Esc)"
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] hover:bg-[#FFFFFF] dark:hover:bg-[#20242A] border border-transparent hover:border-[#141618]/14 dark:hover:border-[#F3F0E9]/14 transition-colors cursor-pointer"
              >
                <span>Hide</span>
                <PanelRightClose className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Chapter List */}
            <ol className="py-1.5 px-1.5 space-y-0.5 max-h-[64vh] overflow-y-auto">
              {HOME_CHAPTERS.map((chapter) => {
                const isActive = chapter.id === activeId;
                return (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      onClick={(e) => handleAnchorClick(e, chapter.id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`group flex items-center justify-between gap-2.5 px-2.5 py-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#EC743C] focus-visible:outline-offset-1 ${
                        isActive
                          ? 'bg-[#ECE8DF] text-[#141618] dark:bg-[#20242A] dark:text-[#F3F0E9]'
                          : 'text-[#4A5054] hover:text-[#141618] hover:bg-[#ECE8DF]/55 dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9] dark:hover:bg-[#20242A]/55'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`font-mono-tabular text-[10px] shrink-0 ${
                              isActive
                                ? 'font-semibold text-[#9E4B28] dark:text-[#EC743C]'
                                : 'text-[#4A5054] dark:text-[#A1A7AB] group-hover:text-[#9E4B28] dark:group-hover:text-[#EC743C]'
                            }`}
                          >
                            {chapter.number}
                          </span>
                          <span
                            className={`text-xs truncate ${
                              isActive ? 'font-semibold' : 'font-medium'
                            }`}
                          >
                            {chapter.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4A5054] dark:text-[#A1A7AB] truncate pl-5">
                          {chapter.summary}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className={`h-[2px] shrink-0 transition-all duration-200 ${
                          isActive
                            ? 'w-4 bg-[#9E4B28] dark:bg-[#EC743C]'
                            : 'w-2 bg-[#141618]/20 group-hover:w-3 group-hover:bg-[#141618]/60 dark:bg-[#F3F0E9]/25 dark:group-hover:bg-[#F3F0E9]/70'
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ol>

            {/* Quick Actions Footer */}
            <div className="px-2.5 py-2 border-t border-[#141618]/12 dark:border-[#F3F0E9]/14 bg-[#ECE8DF]/45 dark:bg-[#191C20]/65 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleScrollTop}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" aria-hidden="true" />
                Top
              </button>
              <a
                href="#enquiry"
                onClick={(e) => handleAnchorClick(e, 'enquiry')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-[#9E4B28] text-[#F6F4EF] hover:bg-[#823B1D] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#EC743C] dark:hover:text-[#141618] transition-colors"
              >
                Request Quote
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </aside>
  );
}
