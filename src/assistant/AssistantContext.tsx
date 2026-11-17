import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_LOCALE, parseLocalePath, type LocaleCode } from '../i18n/locales';
import { preparedProvider, starterToResult, type ReplyKey, type StarterKey } from './provider';

/**
 * A conversation message stores a stable reply KEY (or the visitor's own typed text), never rendered prose.
 * That is what lets the assistant language change re-render prepared content in the new language, while a visitor's own
 * free text stays exactly as typed (it is never claimed to be translated).
 */
export type AssistantMessage =
  | { id: string; role: 'assistant'; reply: ReplyKey }
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'user-key'; starter: StarterKey };

interface AssistantContextValue {
  lang: LocaleCode;
  setLang: (l: LocaleCode) => void;
  messages: AssistantMessage[];
  view: 'chat' | 'rfq';
  setView: (v: 'chat' | 'rfq') => void;
  pending: boolean;
  sendText: (text: string) => void;
  sendStarter: (key: StarterKey) => void;
  reset: () => void;
}

const Ctx = createContext<AssistantContextValue | null>(null);
let counter = 0;
const nid = () => `m${++counter}`;
const WELCOME: AssistantMessage = { id: 'welcome', role: 'assistant', reply: 'welcome' };

/** Short interface pacing only (no simulated research). Under reduced motion replies are immediate. */
const PACING_MS = 520;

export function AssistantProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const routeLocale = parseLocalePath(pathname).locale;
  const [lang, setLangState] = useState<LocaleCode>(routeLocale ?? DEFAULT_LOCALE);
  const manual = useRef(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([WELCOME]);
  const [view, setView] = useState<'chat' | 'rfq'>('chat');
  const [pending, setPending] = useState(false);
  const timer = useRef<number | null>(null);
  const seq = useRef(0);

  // Default to the website language; a manual choice wins until the visitor navigates to a different website language.
  const lastRoute = useRef(routeLocale);
  useEffect(() => {
    if (routeLocale && routeLocale !== lastRoute.current) {
      manual.current = false;
      setLangState(routeLocale);
    }
    lastRoute.current = routeLocale;
  }, [routeLocale]);

  const setLang = useCallback((l: LocaleCode) => {
    manual.current = true;
    setLangState(l);
  }, []);

  const clearTimer = useCallback(() => {
    seq.current += 1;
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    setPending(false);
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const push = useCallback(
    (userMsg: AssistantMessage, result: { reply: ReplyKey; startRfq?: boolean }) => {
      if (pending) return;
      setMessages((m) => [...m, userMsg]);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const commit = () => {
        setMessages((m) => [...m, { id: nid(), role: 'assistant', reply: result.reply }]);
        if (result.startRfq) setView('rfq');
        setPending(false);
      };
      if (reduced) return commit();
      const mine = ++seq.current;
      setPending(true);
      timer.current = window.setTimeout(() => {
        if (seq.current === mine) commit();
      }, PACING_MS);
    },
    [pending]
  );

  const sendText = useCallback(
    (text: string) => {
      const clean = text.trim().slice(0, 400);
      if (!clean) return;
      push({ id: nid(), role: 'user', text: clean }, preparedProvider.respond({ text: clean, lang }));
    },
    [push, lang]
  );

  const sendStarter = useCallback(
    (starter: StarterKey) => push({ id: nid(), role: 'user-key', starter }, starterToResult(starter)),
    [push]
  );

  const reset = useCallback(() => {
    clearTimer();
    setMessages([WELCOME]);
    setView('chat');
  }, [clearTimer]);

  const value = useMemo(
    () => ({ lang, setLang, messages, view, setView, pending, sendText, sendStarter, reset }),
    [lang, setLang, messages, view, pending, sendText, sendStarter, reset]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssistant(): AssistantContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAssistant must be used inside AssistantProvider');
  return v;
}
