import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  Factory,
  FileText,
  HelpCircle,
  Layers,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HOME_CHAPTERS } from '../data/chapters';
import { CORPORATE_DOCUMENT_GROUPS, NEWS_ITEMS } from '../data/communityNewsCareersDocs';
import { OFFICES } from '../data/company';
import { KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { PRODUCTS } from '../data/products';
import { useGuide } from '../context/GuideContext';
import { useSearch } from '../context/SearchContext';
import { cn } from '../lib/utils';

type SearchCategory = 'All' | 'Alloys' | 'FAQs' | 'Operations' | 'Updates & Filings';

interface SearchResultItem {
  id: string;
  category: Exclude<SearchCategory, 'All'>;
  title: string;
  subtitle: string;
  badge: string;
  searchBlob: string;
  onSelect: () => void;
}

const CATEGORIES: SearchCategory[] = [
  'All',
  'Alloys',
  'FAQs',
  'Operations',
  'Updates & Filings',
];

/**
 * SearchCommandModal — Adapted from VengeanceUI SearchModal.
 * Global Cmd/Ctrl+K command modal searching verified Berry Alloys products,
 * technical FAQs, manufacturing facilities, chapters, news, corporate filings, and actions.
 */
export function SearchCommandModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const { openGuide } = useGuide();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Array<Exclude<SearchCategory, 'All'>>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    setSelectedIndex(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onEsc);
    };
  }, [isSearchOpen, closeSearch]);

  const allItems: SearchResultItem[] = useMemo(() => {
    const go = (to: string) => {
      closeSearch();
      navigate(to);
    };

    const alloyItems: SearchResultItem[] = PRODUCTS.map((p) => ({
      id: `alloy-${p.slug}`,
      category: 'Alloys',
      title: p.name,
      subtitle: `${p.family} · ${p.comparison.primaryElementLabel}: ${p.comparison.primaryElementRange}`,
      badge: p.shortName,
      searchBlob: [
        p.name,
        p.shortName,
        p.family,
        p.carbonTier,
        p.summary,
        ...p.applications,
      ]
        .join(' ')
        .toLowerCase(),
      onSelect: () => go(`/products/${p.slug}`),
    }));

    const faqItems: SearchResultItem[] = KNOWLEDGE_BASE.map((f) => ({
      id: `faq-${f.id}`,
      category: 'FAQs',
      title: f.question,
      subtitle: f.answer,
      badge: f.category,
      searchBlob: [
        f.question,
        f.answer,
        f.category,
        ...f.keywords,
        ...f.alternativePhrases,
      ]
        .join(' ')
        .toLowerCase(),
      onSelect: () => go(`/faq#${f.id}`),
    }));

    const operationItems: SearchResultItem[] = [
      ...OFFICES.map((o) => ({
        id: `office-${o.id}`,
        category: 'Operations' as const,
        title: o.label,
        subtitle: `${o.address} · ${o.phone}`,
        badge: 'Facility / Office',
        searchBlob: `${o.label} ${o.address} ${o.email} ${o.phone}`.toLowerCase(),
        onSelect: () => go('/manufacturing'),
      })),
      ...HOME_CHAPTERS.map((ch) => ({
        id: `chapter-${ch.id}`,
        category: 'Operations' as const,
        title: `Chapter ${ch.number}: ${ch.label}`,
        subtitle: ch.summary,
        badge: 'Homepage Story',
        searchBlob: `chapter ${ch.number} ${ch.label} ${ch.summary}`.toLowerCase(),
        onSelect: () => go(`/#${ch.id}`),
      })),
    ];

    const docItems: SearchResultItem[] = [
      ...NEWS_ITEMS.map((n) => ({
        id: `news-${n.slug}`,
        category: 'Updates & Filings' as const,
        title: n.title,
        subtitle: `${n.date} · ${n.excerpt}`,
        badge: n.type,
        searchBlob: `${n.title} ${n.date} ${n.type} ${n.excerpt}`.toLowerCase(),
        onSelect: () => go(`/news/${n.slug}`),
      })),
      ...CORPORATE_DOCUMENT_GROUPS.map((g) => ({
        id: `doc-${g.id}`,
        category: 'Updates & Filings' as const,
        title: g.type,
        subtitle: g.description,
        badge: `${g.items.length} Records`,
        searchBlob: `${g.type} ${g.description} ${g.items.map((i) => `${i.title} ${i.yearOrScope}`).join(' ')}`.toLowerCase(),
        onSelect: () => go('/documents'),
      })),
    ];

    return [...alloyItems, ...faqItems, ...operationItems, ...docItems];
  }, [closeSearch, navigate]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const parts = q.split(/\s+/).filter(Boolean);

    return allItems
      .filter((item) => {
        if (
          activeCategories.length > 0 &&
          !activeCategories.includes(item.category)
        ) {
          return false;
        }
        if (parts.length === 0) return true;
        return parts.every((p) => item.searchBlob.includes(p));
      })
      .slice(0, 18);
  }, [allItems, query, activeCategories]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategories.length]);

  const toggleCategoryTag = (cat: SearchCategory) => {
    if (cat === 'All') {
      setActiveCategories([]);
      return;
    }
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length === 0
          ? 0
          : (prev - 1 + filteredItems.length) % filteredItems.length
      );
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].onSelect();
    }
  };

  const categoryIcon = (cat: Exclude<SearchCategory, 'All'>) => {
    switch (cat) {
      case 'Alloys':
        return <Layers className="w-4 h-4 text-brand dark:text-[#69C5F5]" aria-hidden="true" />;
      case 'FAQs':
        return <HelpCircle className="w-4 h-4 text-brand dark:text-[#69C5F5]" aria-hidden="true" />;
      case 'Operations':
        return <Factory className="w-4 h-4 text-brand dark:text-[#69C5F5]" aria-hidden="true" />;
      case 'Updates & Filings':
        return <FileText className="w-4 h-4 text-brand dark:text-[#69C5F5]" aria-hidden="true" />;
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Global Berry Alloys search palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[65] bg-[#07111F]/70 backdrop-blur-xs flex items-start justify-center pt-[8vh] sm:pt-[11vh] px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#0D1B2E] text-[#10243A] dark:text-[#F4F8FC] border border-[#10243A]/20 dark:border-[#F4F8FC]/20 shadow-2xl overflow-hidden flex flex-col max-h-[78vh]"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 bg-[#FFFFFF] dark:bg-[#10243A]">
              <Search className="w-4 h-4 text-brand dark:text-[#69C5F5] shrink-0" aria-hidden="true" />
              <label htmlFor="global-search-input" className="sr-only">
                Search alloy grades, FAQs, plants, filings, and chapters
              </label>
              <input
                ref={inputRef}
                id="global-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search FeMn, SiMn, Low Phosphorus, Bobbili, MGT-7, ISO 9001…"
                className="flex-1 bg-transparent text-sm text-[#10243A] dark:text-[#F4F8FC] placeholder:text-[#465C72]/70 dark:placeholder:text-[#B5C5D7]/70 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search text"
                  className="p-1 text-[#465C72] hover:text-[#10243A] dark:text-[#B5C5D7] dark:hover:text-[#F4F8FC] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search modal"
                className="px-2 py-1 text-[10px] font-mono-tabular uppercase tracking-wider border border-[#10243A]/18 dark:border-[#F4F8FC]/18 text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] cursor-pointer"
              >
                Esc
              </button>
            </div>

            {/* Category Tag Filters */}
            <div className="px-4 py-2.5 border-b border-[#10243A]/10 dark:border-[#F4F8FC]/10 flex items-center gap-1.5 overflow-x-auto bg-[#FFFFFF]/50 dark:bg-[#10243A]/60">
              {CATEGORIES.map((cat) => {
                const selected =
                  cat === 'All'
                    ? activeCategories.length === 0
                    : activeCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategoryTag(cat)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border whitespace-nowrap shrink-0 transition-colors cursor-pointer',
                      selected
                        ? 'bg-brand text-on-brand border-brand dark:bg-[#0A6AA1] dark:border-brand/60'
                        : 'bg-[#FFFFFF] text-[#465C72] border-[#10243A]/14 hover:border-brand dark:bg-[#12243B] dark:text-[#B5C5D7] dark:border-[#F4F8FC]/14 dark:hover:border-[#69C5F5]'
                    )}
                  >
                    <span>{cat}</span>
                    {cat !== 'All' && selected && <X className="w-3 h-3" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#10243A]/8 dark:divide-[#F4F8FC]/8">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center space-y-4">
                  <p className="font-display text-xl font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">
                    No direct matches for “{query}”
                  </p>
                  <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                    Try querying Berry Compass or resetting category filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const q = query.trim();
                      closeSearch();
                      openGuide({ query: q || undefined });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-brand text-on-brand hover:bg-brand-hover transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                    Ask Berry Compass
                  </button>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const active = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={item.onSelect}
                      className={cn(
                        'w-full text-left px-4 py-3 flex items-center justify-between gap-4 transition-colors cursor-pointer',
                        active
                          ? 'bg-[#F1F6FB] dark:bg-[#12243B]'
                          : 'hover:bg-[#FFFFFF] dark:hover:bg-[#12243B]/55'
                      )}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-0.5 shrink-0">{categoryIcon(item.category)}</span>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-[#10243A] dark:text-[#F4F8FC] truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] line-clamp-1">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline font-mono-tabular text-[10px] px-2 py-0.5 bg-[#FFFFFF] dark:bg-[#10243A] border border-[#10243A]/12 dark:border-[#F4F8FC]/14 text-[#465C72] dark:text-[#B5C5D7]">
                          {item.badge}
                        </span>
                        <ArrowRight
                          className={cn(
                            'w-3.5 h-3.5 transition-transform',
                            active
                              ? 'text-brand dark:text-[#69C5F5] translate-x-0.5'
                              : 'text-[#465C72]/50 dark:text-[#B5C5D7]/50'
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Quick Action Footer */}
            <div className="px-4 py-2.5 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 bg-[#FFFFFF] dark:bg-[#10243A] flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeSearch();
                    navigate('/contact?tab=quote');
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 font-semibold bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  Request Quote
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeSearch();
                    openGuide();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 font-medium border border-[#10243A]/18 dark:border-[#F4F8FC]/18 hover:border-brand dark:hover:border-[#69C5F5] transition-colors cursor-pointer"
                >
                  <Compass className="w-3 h-3 text-brand dark:text-[#69C5F5]" aria-hidden="true" />
                  Berry Compass
                </button>
              </div>
              <span className="hidden sm:inline font-mono-tabular text-[10px] text-[#465C72] dark:text-[#B5C5D7]">
                ↑↓ navigate · ↵ open · esc close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
