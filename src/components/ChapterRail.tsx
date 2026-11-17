import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  PanelRightClose,
  PanelRightOpen,
  Search,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HOME_CHAPTERS } from '../data/chapters';
import { useSearch } from '../context/SearchContext';
import { cn } from '../lib/utils';

const RAIL_STORAGE_KEY = 'berry-rail-expanded';

/**
 * ChapterRail — GlassDock collapsible right-edge architectural navigator.
 * Combines frosted glassmorphic dock mechanics with magnetic neighbor hover
 * response, quick search trigger, and 12-chapter story index drawer.
 */
export function ChapterRail() {
  const prefersReduced = useReducedMotion();
  const { openSearch } = useSearch();
  const [activeId, setActiveId] = useState<string>(HOME_CHAPTERS[0].id);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
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

  const getDockWidth = (idx: number, isActive: boolean) => {
    if (prefersReduced || hoveredIdx === null) {
      return isActive ? 22 : 10;
    }
    const dist = Math.abs(hoveredIdx - idx);
    if (dist === 0) return 26;
    if (dist === 1) return 18;
    if (dist === 2) return 14;
    return isActive ? 22 : 10;
  };

  return (
    <aside
      ref={asideRef}
      aria-label="Homepage chapters GlassDock"
      className="hidden xl:flex fixed right-3 top-[44%] -translate-y-1/2 z-30 pointer-events-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          <motion.nav
            key="rail-collapsed"
            id="chapter-rail-nav"
            aria-label="Collapsed GlassDock chapter navigation"
            initial={prefersReduced ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, x: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => handleRailEntered('expand')}
            className="pointer-events-auto w-[42px] bg-[#FFFFFF]/78 dark:bg-[#10243A]/78 backdrop-blur-xl border border-[#10243A]/18 dark:border-[#F4F8FC]/20 shadow-[0_12px_36px_rgba(18,20,23,0.18)] flex flex-col items-center relative"
          >
            {/* Subtle Glass Top Specular Line */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#69C5F5]/60 to-transparent"
            />

            {/* Expand Trigger */}
            <button
              ref={expandBtnRef}
              type="button"
              onClick={() => handleToggleExpand(true)}
              aria-expanded={false}
              aria-controls="chapter-rail-nav"
              aria-label="Expand story chapter navigation"
              title="Expand GlassDock Chapter Index"
              className="group relative w-full h-9 flex items-center justify-center border-b border-[#10243A]/12 dark:border-[#F4F8FC]/14 text-[#10243A] dark:text-[#F4F8FC] hover:bg-[#F1F6FB]/75 dark:hover:bg-[#12243B]/85 hover:text-brand dark:hover:text-[#69C5F5] transition-colors cursor-pointer"
            >
              <PanelRightOpen className="w-4 h-4 transition-transform group-hover:scale-110" aria-hidden="true" />
              <span
                role="tooltip"
                className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-150 absolute right-full mr-2.5 px-2.5 py-1 bg-[#10243A] text-[#F4F8FC] dark:bg-[#F4F8FC] dark:text-[#10243A] text-[11px] font-medium whitespace-nowrap shadow-md border border-[#10243A]/20 dark:border-[#F4F8FC]/20 flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3 text-[#69C5F5] dark:text-brand" aria-hidden="true" />
                Expand Index
              </span>
            </button>

            {/* Quick Global Search Dock Icon */}
            <button
              type="button"
              onClick={openSearch}
              aria-label="Open global search palette (Cmd+K)"
              title="Quick Search (⌘K)"
              className="group relative w-full h-9 flex items-center justify-center border-b border-[#10243A]/12 dark:border-[#F4F8FC]/14 text-[#465C72] dark:text-[#B5C5D7] hover:bg-[#F1F6FB]/75 dark:hover:bg-[#12243B]/85 hover:text-brand dark:hover:text-[#69C5F5] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 transition-transform group-hover:scale-110" aria-hidden="true" />
              <span
                role="tooltip"
                className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-150 absolute right-full mr-2.5 px-2.5 py-1 bg-[#10243A] text-[#F4F8FC] dark:bg-[#F4F8FC] dark:text-[#10243A] text-[11px] font-medium whitespace-nowrap shadow-md border border-[#10243A]/20 dark:border-[#F4F8FC]/20 flex items-center gap-1.5"
              >
                <span>Quick Search</span>
                <span className="font-mono-tabular text-[10px] opacity-75">⌘K</span>
              </span>
            </button>

            {/* Interactive GlassDock Chapter Ticks with Magnetic Neighbors */}
            <ol
              onMouseLeave={() => setHoveredIdx(null)}
              className="w-full py-2 flex flex-col items-center"
            >
              {HOME_CHAPTERS.map((chapter, idx) => {
                const isActive = chapter.id === activeId;
                const barWidth = getDockWidth(idx, isActive);
                return (
                  <li key={chapter.id} className="w-full">
                    <a
                      href={`#${chapter.id}`}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onFocus={() => setHoveredIdx(idx)}
                      onBlur={() => setHoveredIdx(null)}
                      onClick={(e) => handleAnchorClick(e, chapter.id)}
                      aria-current={isActive ? 'location' : undefined}
                      aria-label={`${chapter.number}. ${chapter.label} — ${chapter.summary}`}
                      className="group relative w-full py-1.5 px-1.5 flex items-center justify-end pr-2 focus-visible:outline-2 focus-visible:outline-[#69C5F5] focus-visible:outline-offset-[-2px]"
                    >
                      <motion.span
                        aria-hidden="true"
                        animate={prefersReduced ? undefined : { width: barWidth }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        style={prefersReduced ? { width: barWidth } : undefined}
                        className={cn(
                          'block h-[2.5px] transition-colors duration-150',
                          isActive
                            ? 'bg-accent-red'
                            : hoveredIdx === idx
                            ? 'bg-[#10243A] dark:bg-[#F4F8FC]'
                            : 'bg-[#10243A]/28 dark:bg-[#F4F8FC]/28'
                        )}
                      />

                      {/* Floating Spring Dock Tooltip */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 translate-x-1.5 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-150 absolute right-full mr-2.5 px-2.5 py-1.5 bg-[#FFFFFF]/95 dark:bg-[#0D1B2E]/95 backdrop-blur-md text-[#10243A] dark:text-[#F4F8FC] border border-[#10243A]/18 dark:border-[#F4F8FC]/18 shadow-xl text-[11px] whitespace-nowrap flex items-center gap-2"
                      >
                        <span className="font-mono-tabular text-[10px] font-semibold text-brand dark:text-[#69C5F5]">
                          {chapter.number}
                        </span>
                        <span className="font-semibold">{chapter.label}</span>
                        <span className="text-[#465C72] dark:text-[#B5C5D7] text-[10px]">
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
              className="w-full py-2 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/14 flex flex-col items-center justify-center text-[10px] font-mono-tabular font-semibold text-brand dark:text-[#69C5F5] hover:bg-[#F1F6FB]/75 dark:hover:bg-[#12243B]/85 transition-colors cursor-pointer"
            >
              <span>{activeChapter.number}</span>
              <span className="text-[9px] font-normal text-[#465C72] dark:text-[#B5C5D7]">
                /{HOME_CHAPTERS.length}
              </span>
            </button>
          </motion.nav>
        ) : (
          <motion.nav
            key="rail-expanded"
            id="chapter-rail-nav"
            aria-label="Expanded GlassDock chapter index"
            initial={prefersReduced ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, x: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => handleRailEntered('collapse')}
            className="pointer-events-auto w-[252px] bg-[#FFFFFF]/88 dark:bg-[#10243A]/88 backdrop-blur-xl border border-[#10243A]/20 dark:border-[#F4F8FC]/22 shadow-2xl flex flex-col relative"
          >
            {/* Subtle Glass Top Specular Line */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#69C5F5]/65 to-transparent"
            />

            {/* Header Bar */}
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-[#F1F6FB]/65 dark:bg-[#0D1B2E]/75">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono-tabular text-[10px] uppercase tracking-widest font-semibold text-brand dark:text-[#69C5F5]">
                  GlassDock Index
                </span>
                <span className="font-mono-tabular text-[10px] text-[#465C72] dark:text-[#B5C5D7]">
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
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] hover:bg-[#FFFFFF] dark:hover:bg-[#12243B] border border-transparent hover:border-[#10243A]/14 dark:hover:border-[#F4F8FC]/14 transition-colors cursor-pointer"
              >
                <span>Hide</span>
                <PanelRightClose className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Chapter List */}
            <ol className="py-1.5 px-1.5 space-y-0.5 max-h-[48vh] overflow-y-auto">
              {HOME_CHAPTERS.map((chapter) => {
                const isActive = chapter.id === activeId;
                return (
                  <li key={chapter.id}>
                    <a
                      href={`#${chapter.id}`}
                      onClick={(e) => handleAnchorClick(e, chapter.id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'group flex items-center justify-between gap-2.5 px-2.5 py-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#69C5F5] focus-visible:outline-offset-1',
                        isActive
                          ? 'bg-[#FFFFFF]/90 text-[#10243A] dark:bg-[#12243B]/95 dark:text-[#F4F8FC] border border-[#10243A]/10 dark:border-[#F4F8FC]/10'
                          : 'text-[#465C72] hover:text-[#10243A] hover:bg-[#FFFFFF]/55 dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC] dark:hover:bg-[#12243B]/55 border border-transparent'
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span
                            className={cn(
                              'font-mono-tabular text-[10px] shrink-0',
                              isActive
                                ? 'font-semibold text-brand dark:text-[#69C5F5]'
                                : 'text-[#465C72] dark:text-[#B5C5D7] group-hover:text-brand dark:group-hover:text-[#69C5F5]'
                            )}
                          >
                            {chapter.number}
                          </span>
                          <span
                            className={cn(
                              'text-xs truncate',
                              isActive ? 'font-semibold' : 'font-medium'
                            )}
                          >
                            {chapter.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#465C72] dark:text-[#B5C5D7] truncate pl-5">
                          {chapter.summary}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'h-[2px] shrink-0 transition-all duration-200',
                          isActive
                            ? 'w-4 bg-accent-red'
                            : 'w-2 bg-[#10243A]/20 group-hover:w-3 group-hover:bg-[#10243A]/60 dark:bg-[#F4F8FC]/25 dark:group-hover:bg-[#F4F8FC]/70'
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ol>

            {/* Quick Actions Dock Footer */}
            <div className="px-2.5 py-2 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/14 bg-[#F1F6FB]/55 dark:bg-[#0D1B2E]/70 flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={handleScrollTop}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" aria-hidden="true" />
                Top
              </button>
              <button
                type="button"
                onClick={openSearch}
                title="Search Site (⌘K)"
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#465C72] dark:text-[#B5C5D7] hover:text-brand dark:hover:text-[#69C5F5] transition-colors cursor-pointer"
              >
                <Search className="w-3 h-3" aria-hidden="true" />
                <span>⌘K</span>
              </button>
              <a
                href="#enquiry"
                onClick={(e) => handleAnchorClick(e, 'enquiry')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-brand text-[#FFFFFF] hover:bg-brand-hover dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A] transition-colors"
              >
                Quote
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </aside>
  );
}
