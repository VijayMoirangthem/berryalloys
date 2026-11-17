import { useCallback, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { OFFICIAL_BRAND_MARK_DARK } from '../../data/assets';
import { cn } from '../../lib/utils';

export interface BookPageMetric {
  label: string;
  value: string;
}

export interface InteractiveBookPage {
  pageNumber: number;
  kicker: string;
  title: string;
  paragraphs: string[];
  metrics?: BookPageMetric[];
  image?: string;
  imageAlt?: string;
}

export interface InteractiveBookProps {
  coverKicker?: string;
  coverTitle: string;
  coverSubtitle?: string;
  coverMeta?: string;
  pages: InteractiveBookPage[];
  className?: string;
}

/**
 * InteractiveBook — Responsive 3D corporate heritage & metallurgical dossier
 * engineered without desktop overflow on mobile/tablet viewports.
 */
export function InteractiveBook({
  coverKicker = 'Corporate Heritage Dossier · CIN U27310WB2006PLC145016',
  coverTitle,
  coverSubtitle = 'DKG Group Ethos, Eastern India Smelting Corridor & Export Milestones',
  coverMeta = 'Berry Alloys Limited · 2006–2026',
  pages,
  className,
}: InteractiveBookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  const total = pages.length;
  const currentPage = pages[activeIndex] ?? pages[0];
  const nextPage = pages[(activeIndex + 1) % total];

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(0);
  }, []);

  const stepPage = useCallback(
    (delta: 1 | -1) => {
      if (!isOpen) {
        handleOpen();
        return;
      }
      setActiveIndex((prev) => {
        const next = prev + delta;
        if (next < 0) return 0;
        if (next >= total) return total - 1;
        return next;
      });
    },
    [isOpen, total, handleOpen]
  );

  if (!currentPage) return null;

  return (
    <div
      className={cn(
        'w-full max-w-[920px] mx-auto bg-[#ECE8DF]/75 dark:bg-[#191C20] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-5 sm:p-8 overflow-hidden',
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
        <div className="space-y-0.5">
          <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
            Interactive Heritage Book
          </p>
          <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
            {isOpen
              ? `Reading Folio 0${activeIndex + 1} of 0${total} — Turn pages using controls below`
              : 'Select cover to open the bound Berry Alloys Limited chronicle'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? (
            <>
              <button
                type="button"
                onClick={() => stepPage(-1)}
                disabled={activeIndex === 0}
                aria-label="Previous dossier folio"
                className="inline-flex items-center justify-center w-9 h-9 border border-[#141618]/20 dark:border-[#F3F0E9]/20 bg-white dark:bg-[#20242A] text-[#141618] dark:text-[#F3F0E9] disabled:opacity-40 hover:border-[#9E4B28] dark:hover:border-[#EC743C] transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => stepPage(1)}
                disabled={activeIndex === total - 1}
                aria-label="Next dossier folio"
                className="inline-flex items-center justify-center w-9 h-9 border border-[#141618]/20 dark:border-[#F3F0E9]/20 bg-white dark:bg-[#20242A] text-[#141618] dark:text-[#F3F0E9] disabled:opacity-40 hover:border-[#9E4B28] dark:hover:border-[#EC743C] transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs font-semibold border border-[#141618]/20 dark:border-[#F3F0E9]/20 bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:hover:bg-[#EC743C] dark:hover:text-[#141618] transition-colors duration-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Close Cover</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#EC743C] dark:hover:text-[#141618] transition-colors duration-300 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Stage: Closed Cover OR Open 2-Page Spread (stacks to single folio on mobile) */}
      <div className="pt-6">
        {!isOpen ? (
          <motion.button
            type="button"
            onClick={handleOpen}
            whileHover={prefersReduced ? undefined : { y: -5, rotateY: -4 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: '1400px' }}
            className="w-full max-w-[380px] mx-auto block text-left bg-[#141618] text-[#F3F0E9] border border-[#EC743C]/35 shadow-2xl p-6 sm:p-8 relative overflow-hidden cursor-pointer group"
          >
            {/* Hardcover spine groove */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#0B0C0E] via-[#262B32] to-transparent border-r border-[#F3F0E9]/10"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#9E4B28] via-[#EC743C] to-[#9E4B28]"
            />

            <div className="pl-3 space-y-6">
              <div className="flex items-center justify-between gap-2">
                <img
                  src={OFFICIAL_BRAND_MARK_DARK}
                  alt="Berry Alloys Limited emblem"
                  className="h-7 w-auto object-contain"
                />
                <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#EC743C]">
                  2006–2026
                </span>
              </div>

              <div className="space-y-2 py-4 border-y border-[#F3F0E9]/14">
                <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#A1A7AB]">
                  {coverKicker}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F3F0E9] group-hover:text-[#EC743C] transition-colors duration-500">
                  {coverTitle}
                </h3>
                <p className="text-xs text-[#F3F0E9]/78 leading-relaxed">{coverSubtitle}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#A1A7AB]">
                <span>{coverMeta}</span>
                <span className="text-[#EC743C] group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                  Open Book →
                </span>
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div
            key={activeIndex}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0.35, rotateY: 11, scale: 0.985 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: '2000px' }}
            className="grid grid-cols-1 md:grid-cols-2 border border-[#141618]/20 dark:border-[#F3F0E9]/16 shadow-2xl bg-[#FAF8F4] dark:bg-[#141618] relative"
          >
            {/* Central Binding Gutter */}
            <div
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-[#141618]/8 via-[#141618]/18 to-[#141618]/8 dark:from-black/30 dark:via-black/60 dark:to-black/30 z-10"
            />

            {/* Left Page — Active Folio Narrative */}
            <article className="p-6 sm:p-8 flex flex-col justify-between space-y-5 border-b md:border-b-0 md:border-r border-[#141618]/12 dark:border-[#F3F0E9]/12">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                  <span>{currentPage.kicker}</span>
                  <span className="text-[#4A5054] dark:text-[#A1A7AB]">
                    Folio 0{currentPage.pageNumber}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                  {currentPage.title}
                </h3>
                <div className="space-y-3 text-xs sm:text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
                  {currentPage.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              {currentPage.metrics && currentPage.metrics.length > 0 && (
                <dl className="grid grid-cols-2 gap-3 pt-4 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12">
                  {currentPage.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#4A5054] dark:text-[#A1A7AB]">
                        {m.label}
                      </dt>
                      <dd className="font-display text-lg font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>

            {/* Right Page — Visual Plate & Folio Index */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-[#F2EFE8] dark:bg-[#191C20]">
              {currentPage.image && (
                <figure className="border border-[#141618]/14 dark:border-[#F3F0E9]/14 bg-[#141618] overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={currentPage.image}
                      alt={currentPage.imageAlt ?? currentPage.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </figure>
              )}

              <div className="space-y-3">
                <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                  Dossier Contents · Jump to Chapter
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {pages.map((p, idx) => {
                    const selected = idx === activeIndex;
                    return (
                      <button
                        key={p.pageNumber}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          'text-left px-2.5 py-2 text-[11px] border transition-colors duration-300 cursor-pointer',
                          selected
                            ? 'bg-[#141618] text-[#F6F4EF] border-[#141618] dark:bg-[#A95632] dark:border-[#A95632] dark:text-[#F3F0E9]'
                            : 'bg-white dark:bg-[#20242A] text-[#4A5054] dark:text-[#A1A7AB] border-[#141618]/12 dark:border-[#F3F0E9]/12 hover:border-[#9E4B28] dark:hover:border-[#EC743C]'
                        )}
                      >
                        <span className="font-mono-tabular block text-[9px] opacity-75">
                          0{p.pageNumber}
                        </span>
                        <span className="font-semibold line-clamp-1">{p.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeIndex < total - 1 && nextPage && (
                <button
                  type="button"
                  onClick={() => stepPage(1)}
                  className="w-full flex items-center justify-between pt-3 border-t border-[#141618]/12 dark:border-[#F3F0E9]/12 text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline cursor-pointer"
                >
                  <span>Turn to 0{nextPage.pageNumber}: {nextPage.title}</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default InteractiveBook;
