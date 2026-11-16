import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Compass,
  Grid,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { KNOWLEDGE_BASE, KNOWLEDGE_CATEGORIES } from '../data/knowledgeBase';
import { useGuide } from '../context/GuideContext';

const MAX_INPUT_LENGTH = 360;

export function BerryAlloysGuide() {
  const prefersReduced = useReducedMotion();
  const {
    isOpen,
    messages,
    latestAnnouncement,
    launcherRef,
    openGuide,
    closeGuide,
    resetConversation,
    sendMessage,
    selectSuggestion,
    executeAction,
  } = useGuide();

  const [draft, setDraft] = useState('');
  const [inputNotice, setInputNotice] = useState<string | null>(null);
  const [topicBrowserOpen, setTopicBrowserOpen] = useState(false);
  const [hasUnseenMessage, setHasUnseenMessage] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevMsgCountRef = useRef(messages.length);

  // Body scroll lock & Escape / Focus Trap inside modal dialog
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeGuide();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeGuide]);

  // Smart scroll: scroll smoothly to new messages only if near bottom, else show affordance
  useEffect(() => {
    if (!isOpen) {
      prevMsgCountRef.current = messages.length;
      return;
    }

    if (messages.length > prevMsgCountRef.current) {
      const el = scrollContainerRef.current;
      if (el) {
        if (isNearBottomRef.current) {
          window.requestAnimationFrame(() => {
            el.scrollTo({
              top: el.scrollHeight,
              behavior: prefersReduced ? 'auto' : 'smooth',
            });
          });
          setHasUnseenMessage(false);
        } else {
          setHasUnseenMessage(true);
        }
      }
    }
    prevMsgCountRef.current = messages.length;
  }, [messages.length, isOpen, prefersReduced]);

  const handleScrollStream = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 72;
    isNearBottomRef.current = nearBottom;
    if (nearBottom) {
      setHasUnseenMessage(false);
    }
  };

  const scrollToLatest = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
    isNearBottomRef.current = true;
    setHasUnseenMessage(false);
  };

  const submitDraft = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setInputNotice('Type a question or pick one of the topic buttons above.');
      return;
    }
    if (trimmed.length > MAX_INPUT_LENGTH) {
      setInputNotice(`Please keep questions under ${MAX_INPUT_LENGTH} characters.`);
      return;
    }
    setInputNotice(null);
    setTopicBrowserOpen(false);
    isNearBottomRef.current = true;
    sendMessage(trimmed);
    setDraft('');
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitDraft();
  };

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitDraft();
    }
  };

  return (
    <>
      {/* Bottom-Right Architectural Launcher (Hidden while modal open to avoid duplicate focusable control) */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
          <button
            ref={launcherRef}
            type="button"
            onClick={() => openGuide()}
            aria-label="Open Berry Alloys Guide for product help and FAQs"
            className="group inline-flex items-center gap-2.5 min-h-[46px] px-4 py-2.5 bg-[#141618] text-[#F6F4EF] border border-[#141618] hover:bg-[#9E4B28] hover:border-[#9E4B28] dark:bg-[#20242A] dark:text-[#F3F0E9] dark:border-[#EC743C]/45 dark:hover:bg-[#A95632] dark:hover:border-[#EC743C] shadow-xl transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EC743C] focus-visible:outline-offset-2"
          >
            <Compass
              className="w-4 h-4 text-[#EC743C] group-hover:text-[#F6F4EF] shrink-0 transition-colors"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
              <span className="sm:hidden">Ask Berry</span>
              <span className="hidden sm:inline">Berry Alloys Guide</span>
            </span>
          </button>
        </div>
      )}

      {/* Modal Guide Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeGuide();
              }
            }}
            className="fixed inset-0 z-50 bg-[#141618]/50 backdrop-blur-[1px] flex items-end sm:items-end justify-end sm:p-6"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="berry-guide-title"
              aria-describedby="berry-guide-disclosure"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: 8 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-[100dvh] sm:h-[min(660px,calc(100dvh-3rem))] sm:w-[420px] sm:max-w-[calc(100vw-3rem)] bg-[#F6F4EF] dark:bg-[#141618] text-[#141618] dark:text-[#F3F0E9] border-t sm:border border-[#141618]/20 dark:border-[#F3F0E9]/20 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="shrink-0 px-4 sm:px-5 py-3.5 bg-[#141618] text-[#F3F0E9] border-b border-[#F3F0E9]/14 flex items-start justify-between gap-3 pt-[max(0.875rem,env(safe-area-inset-top))]">
                <div className="min-w-0 space-y-1">
                  <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#EC743C]">
                    Automated Guide · Prepared Company Information
                  </p>
                  <h2
                    id="berry-guide-title"
                    className="font-display text-xl font-bold uppercase tracking-tight text-[#F3F0E9]"
                  >
                    Berry Alloys Guide
                  </h2>
                  <p
                    id="berry-guide-disclosure"
                    className="text-[11px] text-[#A1A7AB] leading-snug"
                  >
                    Helps navigate alloys, specs, plants, and enquiries using published records.
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTopicBrowserOpen(false);
                      setInputNotice(null);
                      resetConversation();
                    }}
                    aria-label="Reset conversation"
                    title="Reset conversation"
                    className="inline-flex items-center justify-center w-10 h-10 text-[#A1A7AB] hover:text-[#F3F0E9] hover:bg-[#20242A] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={closeGuide}
                    aria-label="Close Berry Alloys Guide"
                    title="Close (Esc)"
                    className="inline-flex items-center justify-center w-10 h-10 text-[#F3F0E9] hover:text-[#EC743C] hover:bg-[#20242A] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Polite Screen-Reader Live Region for Latest Response Only */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {latestAnnouncement}
              </div>

              {/* Scrollable Conversation Area */}
              <div className="relative flex-1 min-h-0 flex flex-col">
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScrollStream}
                  className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4"
                >
                  {topicBrowserOpen ? (
                    <div className="space-y-4 pb-2">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#141618]/12 dark:border-[#F3F0E9]/12">
                        <div>
                          <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C] font-semibold">
                            Browse All Prepared Topics
                          </p>
                          <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB]">
                            Select any question below to view the full answer in chat.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTopicBrowserOpen(false)}
                          className="min-h-[36px] px-3 py-1 text-xs font-semibold border border-[#141618]/20 dark:border-[#F3F0E9]/20 hover:border-[#9E4B28] dark:hover:border-[#EC743C] transition-colors cursor-pointer shrink-0"
                        >
                          Back to Chat
                        </button>
                      </div>

                      {KNOWLEDGE_CATEGORIES.map((category) => {
                        const entries = KNOWLEDGE_BASE.filter(
                          (e) => e.category === category
                        );
                        if (entries.length === 0) return null;
                        return (
                          <div key={category} className="space-y-1.5">
                            <h3 className="text-[11px] font-mono-tabular uppercase tracking-wider font-semibold text-[#4A5054] dark:text-[#A1A7AB]">
                              {category}
                            </h3>
                            <div className="space-y-1.5">
                              {entries.map((entry) => (
                                <button
                                  key={entry.id}
                                  type="button"
                                  onClick={() => {
                                    setTopicBrowserOpen(false);
                                    isNearBottomRef.current = true;
                                    selectSuggestion({
                                      label: entry.question,
                                      entryId: entry.id,
                                    });
                                  }}
                                  className="w-full text-left px-3 py-2.5 min-h-[40px] text-xs font-medium bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 hover:border-[#9E4B28] dark:hover:border-[#EC743C] text-[#141618] dark:text-[#F3F0E9] transition-colors cursor-pointer flex items-center justify-between gap-2"
                                >
                                  <span>{entry.question}</span>
                                  <ArrowRight
                                    className="w-3.5 h-3.5 text-[#9E4B28] dark:text-[#EC743C] shrink-0"
                                    aria-hidden="true"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isLatestGuide =
                        msg.sender === 'guide' && idx === messages.length - 1;
                      const payload = msg.payload;

                      if (msg.sender === 'user') {
                        return (
                          <div key={msg.id} className="flex justify-end">
                            <div className="max-w-[85%] bg-[#141618] text-[#F6F4EF] dark:bg-[#A95632] dark:text-[#F3F0E9] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed">
                              {msg.text}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={msg.id} className="space-y-2.5">
                          <div className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/14 p-3.5 sm:p-4 space-y-2.5">
                            {payload?.title && (
                              <h3 className="font-display text-base font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                                {payload.title}
                              </h3>
                            )}

                            <p className="text-xs sm:text-sm text-[#141618] dark:text-[#F3F0E9]/90 leading-relaxed">
                              {msg.text}
                            </p>

                            {payload?.specHighlights &&
                              payload.specHighlights.length > 0 && (
                                <dl className="grid grid-cols-2 gap-2 pt-2 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 text-[11px]">
                                  {payload.specHighlights.map((spec) => (
                                    <div
                                      key={spec.label}
                                      className="bg-[#F6F4EF] dark:bg-[#141618] px-2.5 py-1.5"
                                    >
                                      <dt className="text-[#4A5054] dark:text-[#A1A7AB] truncate">
                                        {spec.label}
                                      </dt>
                                      <dd className="font-mono-tabular font-semibold text-[#141618] dark:text-[#F3F0E9] mt-0.5">
                                        {spec.value}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              )}

                            {payload?.detailNote && (
                              <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                                {payload.detailNote}
                              </p>
                            )}

                            {payload?.checklist && payload.checklist.length > 0 && (
                              <ul className="space-y-1 text-xs text-[#141618] dark:text-[#F3F0E9]/88 pt-1">
                                {payload.checklist.map((item) => (
                                  <li
                                    key={item}
                                    className="flex items-start gap-2"
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="font-mono-tabular text-[#9E4B28] dark:text-[#EC743C] font-bold"
                                    >
                                      ·
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {payload?.actions && payload.actions.length > 0 && (
                              <div className="pt-2 flex flex-wrap gap-2">
                                {payload.actions.map((action) => (
                                  <button
                                    key={`${action.label}-${action.to}`}
                                    type="button"
                                    onClick={() => executeAction(action)}
                                    className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer text-left ${
                                      action.variant === 'primary'
                                        ? 'bg-[#9E4B28] text-[#F6F4EF] hover:bg-[#823B1D] dark:bg-[#A95632] dark:hover:bg-[#EC743C] dark:hover:text-[#141618]'
                                        : 'bg-[#ECE8DF] text-[#141618] hover:bg-[#D8D1C3] dark:bg-[#141618] dark:text-[#F3F0E9] dark:border dark:border-[#F3F0E9]/20 dark:hover:border-[#EC743C]'
                                    }`}
                                  >
                                    <span>{action.label}</span>
                                    <ArrowRight
                                      className="w-3.5 h-3.5 shrink-0"
                                      aria-hidden="true"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Contextual Follow-Up & Starter Question Chips (Latest Guide Turn) */}
                          {isLatestGuide &&
                            payload?.followUps &&
                            payload.followUps.length > 0 && (
                              <div className="space-y-1.5 pt-0.5">
                                <p className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#4A5054] dark:text-[#A1A7AB]">
                                  Suggested next
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {payload.followUps.map((chip) => (
                                    <button
                                      key={chip.label}
                                      type="button"
                                      onClick={() => {
                                        isNearBottomRef.current = true;
                                        selectSuggestion(chip);
                                      }}
                                      className="min-h-[40px] px-3 py-2 text-left text-xs font-medium bg-[#ECE8DF]/80 hover:bg-[#ECE8DF] text-[#141618] border border-[#141618]/15 hover:border-[#9E4B28] dark:bg-[#191C20] dark:text-[#F3F0E9] dark:border-[#F3F0E9]/18 dark:hover:border-[#EC743C] transition-colors cursor-pointer"
                                    >
                                      {chip.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* New Message Jump Affordance when user scrolled up reading history */}
                {hasUnseenMessage && !topicBrowserOpen && (
                  <button
                    type="button"
                    onClick={scrollToLatest}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 text-xs font-semibold bg-[#141618] text-[#F6F4EF] dark:bg-[#EC743C] dark:text-[#141618] shadow-lg cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    New message
                  </button>
                )}
              </div>

              {/* Input & Browse Topics Dock */}
              <div className="shrink-0 bg-white dark:bg-[#191C20] border-t border-[#141618]/14 dark:border-[#F3F0E9]/14 px-4 sm:px-5 py-3 space-y-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTopicBrowserOpen((prev) => !prev)}
                    aria-expanded={topicBrowserOpen}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#9E4B28] dark:text-[#EC743C] hover:underline cursor-pointer min-h-[28px]"
                  >
                    <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                    {topicBrowserOpen ? 'Return to conversation' : 'Browse topics'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      executeAction({ label: 'All FAQs', to: '/faq' })
                    }
                    className="inline-flex items-center gap-1 text-[#4A5054] dark:text-[#A1A7AB] hover:text-[#141618] dark:hover:text-[#F3F0E9] transition-colors cursor-pointer min-h-[28px]"
                  >
                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                    All FAQs
                  </button>
                </div>

                {inputNotice && (
                  <p role="alert" className="text-[11px] text-[#9E4B28] dark:text-[#EC743C]">
                    {inputNotice}
                  </p>
                )}

                <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <label htmlFor="berry-guide-input" className="sr-only">
                      Ask a question about Berry Alloys products, specifications, or enquiries
                    </label>
                    <textarea
                      ref={inputRef}
                      id="berry-guide-input"
                      rows={1}
                      maxLength={MAX_INPUT_LENGTH}
                      value={draft}
                      onChange={(e) => {
                        setDraft(e.target.value);
                        if (inputNotice) setInputNotice(null);
                      }}
                      onKeyDown={handleTextareaKeyDown}
                      placeholder="Ask about alloys, specs, plants, or quotes…"
                      className="w-full min-h-[44px] max-h-28 px-3 py-2.5 text-sm bg-[#F6F4EF] dark:bg-[#121417] border border-[#141618]/20 dark:border-[#F3F0E9]/20 text-[#141618] dark:text-[#F3F0E9] placeholder:text-[#4A5054]/70 dark:placeholder:text-[#A1A7AB]/70 focus:border-[#9E4B28] dark:focus:border-[#EC743C] focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3.5 bg-[#9E4B28] text-[#F6F4EF] hover:bg-[#823B1D] dark:bg-[#A95632] dark:text-[#F3F0E9] dark:hover:bg-[#EC743C] dark:hover:text-[#141618] transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>

                <div className="flex items-center justify-between gap-2 text-[10px] text-[#4A5054] dark:text-[#A1A7AB]">
                  <span>Enter to send · Shift+Enter for new line</span>
                  {draft.length > 260 && (
                    <span className="font-mono-tabular">
                      {draft.length}/{MAX_INPUT_LENGTH}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
