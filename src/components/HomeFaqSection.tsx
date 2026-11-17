import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MessageSquare, Plus } from 'lucide-react';
import { FEATURED_HOME_FAQS, KNOWLEDGE_BASE } from '../data/knowledgeBase';
import { useGuide } from '../context/GuideContext';
import { cn } from '../lib/utils';
import { CreepyButton } from './ui/CreepyButton';
import { IndustrialButton } from './ui/IndustrialButton';

export function HomeFaqSection() {
  const { openGuide, executeAction } = useGuide();
  const [openId, setOpenId] = useState<string | null>(FEATURED_HOME_FAQS[0]?.id ?? null);

  return (
    <section
      id="faq"
      aria-labelledby="home-faq-heading"
      className="scroll-mt-20 py-20 lg:py-24 bg-[#ECE8DF] text-[#141618] dark:bg-[#191C20] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/12"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Editorial Summary & Actions */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-3">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                11 / Frequently Asked Questions
              </p>
              <h2
                id="home-faq-heading"
                className="font-display fluid-statement font-bold uppercase text-[#141618] dark:text-[#F3F0E9]"
              >
                Clear answers before you submit an enquiry.
              </h2>
              <p className="text-sm sm:text-base text-[#4A5054] dark:text-[#F3F0E9]/80 leading-relaxed">
                Essential guidance on alloy grades, chemistry tables, ISO status, plant locations, and quotation requests—sourced from verified company records.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <IndustrialButton to="/faq" variant="outline-light">
                View All FAQs ({KNOWLEDGE_BASE.length})
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </IndustrialButton>

              <CreepyButton
                type="button"
                variant="copper"
                onClick={(e) => openGuide({ returnFocusEl: e.currentTarget as HTMLElement })}
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                Open Berry Alloys Guide
              </CreepyButton>
            </div>
          </div>

          {/* Right Expandable FaqAccordion List (Smooth CSS Grid Row Expansion) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 divide-y divide-[#141618]/12 dark:divide-[#F3F0E9]/12">
            {FEATURED_HOME_FAQS.map((entry) => {
              const isOpen = openId === entry.id;
              const panelId = `home-faq-panel-${entry.id}`;
              const btnId = `home-faq-btn-${entry.id}`;

              return (
                <article
                  key={entry.id}
                  className={cn(
                    'transition-colors duration-200',
                    isOpen ? 'bg-[#F6F4EF]/55 dark:bg-[#191C20]/60' : ''
                  )}
                >
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : entry.id)}
                      className="w-full text-left px-5 sm:px-6 py-5 min-h-[56px] flex items-start justify-between gap-4 hover:bg-[#F6F4EF]/80 dark:hover:bg-[#191C20]/80 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="block text-[10px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                          {entry.category}
                        </span>
                        <span className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] block">
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
                            'w-4 h-4 transition-transform duration-350',
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
                      'grid transition-[grid-template-rows,opacity] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-1 space-y-4">
                        <p className="text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed max-w-[65ch]">
                          {entry.answer}
                        </p>
                        {entry.expandedExplanation && (
                          <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed max-w-[65ch]">
                            {entry.expandedExplanation}
                          </p>
                        )}
                        <div className="pt-1 flex flex-wrap items-center gap-3">
                          {entry.actions[0] && (
                            <Link
                              to={entry.actions[0].to}
                              tabIndex={isOpen ? 0 : -1}
                              onClick={(e) => {
                                if (
                                  entry.actions[0].enquiryProductSlug ||
                                  entry.actions[0].to.startsWith('/#')
                                ) {
                                  e.preventDefault();
                                  executeAction(entry.actions[0]);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 text-xs font-semibold bg-[#141618] text-[#F6F4EF] hover:bg-[#9E4B28] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#EC743C] dark:hover:text-[#141618] transition-colors"
                            >
                              {entry.actions[0].label}
                              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </Link>
                          )}

                          <button
                            type="button"
                            tabIndex={isOpen ? 0 : -1}
                            onClick={(e) =>
                              openGuide({
                                entryId: entry.id,
                                returnFocusEl: e.currentTarget,
                              })
                            }
                            className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-medium text-[#9E4B28] dark:text-[#EC743C] border border-[#141618]/15 dark:border-[#F3F0E9]/16 hover:border-[#9E4B28] dark:hover:border-[#EC743C] transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                            Ask the guide about this
                          </button>

                          <Link
                            to={`/faq#${entry.id}`}
                            tabIndex={isOpen ? 0 : -1}
                            className="text-xs text-[#4A5054] dark:text-[#A1A7AB] hover:underline ml-auto"
                          >
                            Direct FAQ link
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
