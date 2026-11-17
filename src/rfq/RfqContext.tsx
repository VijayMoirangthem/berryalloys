import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EMPTY_DRAFT, PERSISTED_KEYS, type RfqContact, type RfqDraft } from './rfq';

const KEY = 'berry-rfq-draft-v1';

interface RfqContextValue {
  draft: RfqDraft;
  patch: (next: Partial<RfqDraft>) => void;
  contact: RfqContact;
  setContact: (next: Partial<RfqContact>) => void;
  step: number;
  setStep: (n: number) => void;
  reset: () => void;
  hasProgress: boolean;
}

const Ctx = createContext<RfqContextValue | null>(null);

function loadDraft(): RfqDraft {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return { ...EMPTY_DRAFT };
}

/**
 * The RFQ draft lives above the router, so switching language (a route change) keeps every answer.
 * Only structured, non-free-text fields are written to sessionStorage (cleared when the tab closes).
 * Notes, free-text fields and contact details are held in memory only.
 */
export function RfqProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<RfqDraft>(() => (typeof window === 'undefined' ? { ...EMPTY_DRAFT } : loadDraft()));
  const [contact, setContactState] = useState<RfqContact>({ name: '', email: '', company: '' });
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const safe: Record<string, unknown> = {};
      for (const k of PERSISTED_KEYS) safe[k] = draft[k];
      window.sessionStorage.setItem(KEY, JSON.stringify(safe));
    } catch {
      /* ignore */
    }
  }, [draft]);

  const patch = useCallback((next: Partial<RfqDraft>) => setDraft((d) => ({ ...d, ...next })), []);
  const setContact = useCallback((next: Partial<RfqContact>) => setContactState((c) => ({ ...c, ...next })), []);
  const reset = useCallback(() => {
    setDraft({ ...EMPTY_DRAFT });
    setContactState({ name: '', email: '', company: '' });
    setStep(0);
  }, []);

  const hasProgress = useMemo(() => !!(draft.productSlug || draft.sizing || draft.quantity || draft.packaging || draft.country || draft.delivery), [draft]);
  const value = useMemo(() => ({ draft, patch, contact, setContact, step, setStep, reset, hasProgress }), [draft, patch, contact, setContact, step, reset, hasProgress]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRfq(): RfqContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useRfq must be used inside RfqProvider');
  return v;
}
