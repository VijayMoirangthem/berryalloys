import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { DICTIONARIES } from '../i18n';
import { LOCALES, LOCALE_META } from '../i18n/locales';
import { RfqFlow } from '../rfq/RfqFlow';
import { STARTER_KEYS } from './provider';
import { useAssistant } from './AssistantContext';

/** Assistant-language selector: independent of the website language. */
export function AssistantLanguageSelect() {
  const { lang, setLang } = useAssistant();
  const t = DICTIONARIES[lang];
  return (
    <label className="flex items-center gap-1.5 text-[10px] text-[#B5C5D7]">
      <span className="sr-only">{t.compass.assistantLanguage}</span>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as typeof lang)}
        aria-label={t.compass.assistantLanguage}
        className="min-h-[32px] border border-[#F4F8FC]/25 bg-[#07111F] px-1.5 text-xs font-semibold text-[#F4F8FC] focus:border-[#69C5F5] focus:outline-none cursor-pointer"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} lang={LOCALE_META[l].htmlLang}>
            {LOCALE_META[l].native}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Body of the Berry Compass panel for every language. Messages are stored as stable keys and re-rendered from the
 * dictionary, so switching the assistant language re-renders prepared content; the visitor's own typed text stays as typed.
 */
export function LocalizedCompassBody() {
  const { lang, messages, view, setView, pending, sendText, sendStarter } = useAssistant();
  const t = DICTIONARIES[lang];
  const meta = LOCALE_META[lang];
  const reduced = useReducedMotion();
  const [draft, setDraft] = useState('');
  const scroller = useRef<HTMLDivElement>(null);
  const last = messages[messages.length - 1];

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [messages.length, pending, view, reduced]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (pending || !draft.trim()) return;
    sendText(draft);
    setDraft('');
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const bubble = 'max-w-[92%] px-3.5 py-2.5 text-sm leading-relaxed';
  const reply = (key: string) => (key === 'welcome' ? t.compass.welcome : (t.compass.replies as Record<string, string>)[key]);

  return (
    <div lang={meta.htmlLang} dir={meta.dir} className="relative flex min-h-0 flex-1 flex-col">
      <div className="sr-only" role="status" aria-live="polite">
        {pending ? t.compass.preparing : last?.role === 'assistant' ? reply(last.reply) : ''}
      </div>

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
        {view === 'rfq' ? (
          <div className="space-y-3">
            <button type="button" onClick={() => setView('chat')} className="inline-flex min-h-[32px] items-center gap-1.5 text-xs font-semibold text-brand hover:underline cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              {t.compass.backToChat}
            </button>
            <RfqFlow lang={lang} compact onAskQuestion={() => setView('chat')} />
          </div>
        ) : (
          <>
            {messages.map((m) => {
              if (m.role === 'assistant') {
                return (
                  <motion.div key={m.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className={`${bubble} border border-subtle bg-card text-ink`}>
                    {reply(m.reply)}
                  </motion.div>
                );
              }
              const text = m.role === 'user' ? m.text : t.compass.starters[m.starter];
              return (
                <motion.div key={m.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className={`${bubble} ms-auto bg-brand text-on-brand`} dir="auto">
                  {text}
                </motion.div>
              );
            })}
            {pending && (
              <div className={`${bubble} inline-flex items-center gap-2 border border-subtle bg-card text-ink-2`} aria-hidden="true">
                <span className="inline-flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 bg-brand" style={reduced ? undefined : { animation: `compass-pulse-dot 0.9s ${i * 0.16}s infinite ease-in-out` }} />
                  ))}
                </span>
                {t.compass.preparing}
              </div>
            )}
            {!pending && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-ink-muted">{t.compass.suggested}</p>
                <div className="flex flex-wrap gap-2">
                  {STARTER_KEYS.map((k) => (
                    <button key={k} type="button" onClick={() => sendStarter(k)} className="min-h-[40px] border border-control bg-card px-3 py-1.5 text-start text-xs font-medium text-ink hover:border-brand transition-colors cursor-pointer">
                      {t.compass.starters[k]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {view === 'chat' && (
        <form onSubmit={submit} className="shrink-0 space-y-2 border-t border-subtle bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          <div className="flex items-end gap-2">
            <label htmlFor="loc-compass-input" className="sr-only">{t.compass.placeholder}</label>
            <textarea
              id="loc-compass-input"
              rows={1}
              maxLength={400}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              placeholder={t.compass.placeholder}
              dir="auto"
              className="max-h-28 min-h-[44px] w-full resize-none border border-control bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
            />
            <button type="submit" disabled={pending} aria-label={t.compass.sendLabel} className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center bg-brand text-on-brand hover:bg-brand-hover disabled:opacity-50 cursor-pointer">
              <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
