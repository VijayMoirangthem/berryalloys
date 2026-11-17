import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Compass,
  Link2,
  MessageSquare,
  Plus,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import {
  getKnowledgeById,
  KNOWLEDGE_BASE,
  KNOWLEDGE_CATEGORIES,
  KnowledgeCategory,
  KnowledgeEntry,
} from '../data/knowledgeBase';
import { useGuide } from '../context/GuideContext';
import { cn } from '../lib/utils';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CORPORATE_SUBNAV_LINKS, SubNav } from '../components/SubNav';
import { SplitText } from '../components/motion/SplitText';
import { IndustrialButton } from '../components/ui/IndustrialButton';

type CategoryFilter = 'All' | KnowledgeCategory;

export function FaqPage() {
  const prefersReduced = useReducedMotion();
  const { hash } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openGuide, executeAction } = useGuide();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const populatedCategories = useMemo(
    () =>
      KNOWLEDGE_CATEGORIES.filter((cat) =>
        KNOWLEDGE_BASE.some((entry) => entry.category === cat)
      ),
    []
  );

  useEffect(() => {
    const rawTarget = (hash ? hash.slice(1) : searchParams.get('q')) ?? '';
    if (!rawTarget) return;
    const match = getKnowledgeById(rawTarget);
    if (!match) return;

    setSelectedCategory('All');
    setSearchTerm('');
    setOpenIds((prev) => ({ ...prev, [match.id]: true }));

    window.requestAnimationFrame(() => {
      const el = document.getElementById(match.id);
      if (el) {
        const reduce =
          prefersReduced ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 88);
        window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  }, [hash, prefersReduced, searchParams]);

  const filteredEntries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return KNOWLEDGE_BASE.filter((entry) => {
      if (selectedCategory !== 'All' && entry.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const searchable = [
        entry.question,
        entry.category,
        ...entry.alternativePhrases,
        ...entry.keywords,
        entry.answer,
        entry.expandedExplanation ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return q
        .split(/\s+/)
        .filter(Boolean)
        .every((part) => searchable.includes(part));
    });
  }, [searchTerm, selectedCategory]);

  const isFiltered = Boolean(searchTerm.trim()) || selectedCategory !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    if (searchParams.has('q')) {
      const next = new URLSearchParams(searchParams);
      next.delete('q');
      setSearchParams(next, { replace: true });
    }
  };

  const toggleEntry = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyDirectLink = async (id: string) => {
    const url = `${window.location.origin}/faq#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000);
    } catch {
      window.history.replaceState(null, '', `/faq#${id}`);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 2000);
    }
  };

  const renderEntryCard = (entry: KnowledgeEntry) => {
    const isOpen = Boolean(openIds[entry.id]);
    const panelId = `faq-panel-${entry.id}`;
    const btnId = `faq-btn-${entry.id}`;
    const isDirectHit =
      (hash && hash.slice(1) === entry.id) || searchParams.get('q') === entry.id;

    return (
      <article
        key={entry.id}
        id={entry.id}
        className={cn(
          'scroll-mt-24 transition-colors duration-200',
          isDirectHit || isOpen ? 'bg-[#ECE8DF]/45 dark:bg-[#191C20]/75' : ''
        )}
      >
        <h3>
          <button
            id={btnId}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => toggleEntry(entry.id)}
            className="w-full text-left px-5 sm:px-7 py-5 min-h-[58px] flex items-start justify-between gap-4 hover:bg-[#F6F4EF]/75 dark:hover:bg-[#191C20]/80 transition-colors cursor-pointer"
          >
            <div className="space-y-1">
              <span className="block text-[10px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                {entry.category}
              </span>
              <span className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] block">
                {entry.question}
              </span>
            </div>
            <span
              aria-hidden="true"
              className={cn(
                'w-7 h-7 shrink-0 mt-1 border flex items-center justify-center transition-colors duration-200',
                isOpen
                  ? 'bg-[#9E4B28] border-[#9E4B28] text-[#F6F4EF] dark:bg-[#EC743C] dark:border-[#EC743C] dark:text-[#141618]'
                  : 'border-[#141618]/18 dark:border-[#F3F0E9]/18 text-[#4A5054] dark:text-[#A1A7AB]'
              )}
            >
              <Plus
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  isOpen ? 'rotate-45' : ''
                )}
              />
            </span>
          </button>
        </h3>

        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          aria-hidden={!isOpen}
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          )}
        >
          <div className="overflow-hidden">
            <div className="px-5 sm:px-7 pb-7 pt-1 space-y-4">
              <p className="text-sm sm:text-base text-[#141618]/90 dark:text-[#F3F0E9]/88 leading-relaxed max-w-[68ch]">
                {entry.answer}
              </p>

              {entry.expandedExplanation && (
                <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-[68ch]">
                  {entry.expandedExplanation}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                {entry.actions.map((action) => (
                  <Link
                    key={`${entry.id}-${action.label}-${action.to}`}
                    to={action.to}
                    tabIndex={isOpen ? 0 : -1}
                    onClick={(e) => {
                      if (action.enquiryProductSlug || action.to.startsWith('/#')) {
                        e.preventDefault();
                        executeAction(action);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold transition-colors ${
                      action.variant === 'primary'
                        ? 'bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#EC743C] dark:hover:text-[#141618]'
                        : 'bg-[#ECE8DF] text-[#141618] hover:bg-[#D8D1C3] dark:bg-[#141618] dark:text-[#F3F0E9] dark:border dark:border-[#F3F0E9]/18 dark:hover:border-[#EC743C]'
                    }`}
                  >
                    {action.label}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                ))}

                <button
                  type="button"
                  tabIndex={isOpen ? 0 : -1}
                  onClick={(e) =>
                    openGuide({
                      entryId: entry.id,
                      returnFocusEl: e.currentTarget,
                    })
                  }
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 text-xs font-medium text-[#9E4B28] dark:text-[#EC743C] border border-[#141618]/18 dark:border-[#F3F0E9]/18 hover:border-[#9E4B28] dark:hover:border-[#EC743C] transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  Ask Berry Compass about this
                </button>

                <button
                  type="button"
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => copyDirectLink(entry.id)}
                  aria-label={`Copy direct link to "${entry.question}"`}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors cursor-pointer ml-auto"
                >
                  {copiedId === entry.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#9E4B28] dark:text-[#EC743C]" aria-hidden="true" />
                      <span>Link copied</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="bg-[#F6F4EF] dark:bg-[#121417] text-[#141618] dark:text-[#F3F0E9]">
      <SubNav links={CORPORATE_SUBNAV_LINKS} ariaLabel="Corporate navigation" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        {/* Editorial Intro Header */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[#141618]/14 dark:border-[#F3F0E9]/14">
          <div className="lg:col-span-8 space-y-4">
            <Breadcrumbs items={[{ label: 'FAQs & Product Guide' }]} />
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Frequently Asked Questions · Prepared Reference
            </p>
            <SplitText
              text="Clear answers. Better decisions."
              as="h1"
              className="font-display fluid-section-title font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]"
            />
            <p className="text-base text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-[65ch]">
              Structured answers across Berry Alloys’ manufacturing operations, bulk alloy families, quality frameworks, commercial quotation process, sustainability records, and statutory filings.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <IndustrialButton
              type="button"
              variant="primary"
              onClick={(e) => openGuide({ returnFocusEl: e.currentTarget })}
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              Open Berry Compass
            </IndustrialButton>
          </div>
        </header>

        {/* Search & Category Filter Controls */}
        <section aria-label="Filter questions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-7 relative">
              <label htmlFor="faq-search-input" className="sr-only">
                Search frequently asked questions
              </label>
              <Search
                className="w-4 h-4 text-[#4A5054] dark:text-[#A1A7AB] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="faq-search-input"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by alloy, specification, plant, ISO standard, or enquiry topic…"
                className="w-full min-h-[46px] pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-[#20242A] border border-[#141618]/20 dark:border-[#F3F0E9]/20 text-[#141618] dark:text-[#F3F0E9] placeholder:text-[#4A5054]/70 dark:placeholder:text-[#A1A7AB]/70 focus:border-[#9E4B28] dark:focus:border-[#EC743C] focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search query"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9] cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3 text-xs">
              <span
                role="status"
                aria-live="polite"
                className="font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]"
              >
                Showing {filteredEntries.length} of {KNOWLEDGE_BASE.length} answers
              </span>

              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 font-semibold text-[#9E4B28] dark:text-[#EC743C] border border-[#141618]/18 dark:border-[#F3F0E9]/18 hover:border-[#9E4B28] dark:hover:border-[#EC743C] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Scrollable Category Navigation */}
          <div
            role="tablist"
            aria-label="Filter FAQs by category"
            className="flex items-center gap-2 overflow-x-auto pb-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === 'All'}
              onClick={() => setSelectedCategory('All')}
              className={`min-h-[40px] px-4 py-2 text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#141618] text-[#F6F4EF] border-[#141618] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:border-[#A95632]'
                  : 'bg-white text-[#4A5054] border-[#141618]/15 hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:border-[#F3F0E9]/14 dark:hover:text-[#F3F0E9]'
              }`}
            >
              All Topics ({KNOWLEDGE_BASE.length})
            </button>

            {populatedCategories.map((cat) => {
              const active = selectedCategory === cat;
              const count = KNOWLEDGE_BASE.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] px-4 py-2 text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#141618] text-[#F6F4EF] border-[#141618] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:border-[#A95632]'
                      : 'bg-white text-[#4A5054] border-[#141618]/15 hover:text-[#141618] dark:bg-[#20242A] dark:text-[#A1A7AB] dark:border-[#F3F0E9]/14 dark:hover:text-[#F3F0E9]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* FAQ Accordion List or Helpful No-Results State */}
        <section aria-label="FAQ results">
          {filteredEntries.length === 0 ? (
            <div className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-8 sm:p-12 text-center space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                No prepared answers matched your search.
              </h2>
              <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] max-w-xl mx-auto leading-relaxed">
                Try broader metallurgy terms, reset your category filter, or check with Berry Compass or our commercial quotation desk for bespoke requirements.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <IndustrialButton
                  type="button"
                  variant="outline-light"
                  onClick={resetFilters}
                >
                  Reset Search & Filters
                </IndustrialButton>
                <IndustrialButton
                  type="button"
                  variant="primary"
                  onClick={(e) =>
                    openGuide({
                      query: searchTerm.trim() || undefined,
                      returnFocusEl: e.currentTarget,
                    })
                  }
                >
                  Ask Berry Compass
                </IndustrialButton>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12">
              {filteredEntries.map((entry) => renderEntryCard(entry))}
            </div>
          )}
        </section>

        {/* Bottom Contact Invitation */}
        <section
          aria-labelledby="faq-contact-cta"
          className="bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8 space-y-2">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Direct Commercial Requirements
            </p>
            <h2
              id="faq-contact-cta"
              className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]"
            >
              Need specific lot tonnage, sizing, or dispatch confirmation?
            </h2>
            <p className="text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-2xl">
              Commercial terms including pricing, MOQs, stock availability, lead times, and bespoke chemistry checks are handled directly by the commercial desk via quotation enquiry.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
            <IndustrialButton to="/contact?tab=quote" variant="primary">
              Request Quotation
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </IndustrialButton>
          </div>
        </section>
      </div>
    </div>
  );
}
