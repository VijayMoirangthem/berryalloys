import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'berry-ambient-paused';

interface MotionContextValue {
  /** The visitor's OS-level "reduce motion" preference (live). */
  reducedMotion: boolean;
  /** The visitor chose to pause decorative, continuously running motion. */
  ambientPaused: boolean;
  /** True when ambient/decorative loops may run. */
  ambientActive: boolean;
  toggleAmbient: () => void;
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [ambientPaused, setAmbientPaused] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : readPaused()
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.ambient = reducedMotion || ambientPaused ? 'paused' : 'running';
  }, [reducedMotion, ambientPaused]);

  const toggleAmbient = useCallback(() => {
    setAmbientPaused((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ reducedMotion, ambientPaused, ambientActive: !reducedMotion && !ambientPaused, toggleAmbient }),
    [reducedMotion, ambientPaused, toggleAmbient]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionContextValue {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotion must be used inside MotionProvider');
  return ctx;
}

/** Small hook: is the element on screen and the tab visible? Used to pause offscreen scenes. */
export function useInViewActive(ref: React.RefObject<Element | null>, rootMargin = '120px'): boolean {
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === 'undefined' || !document.hidden);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Use the most recent entry: queued entries arrive oldest-first.
    const io = new IntersectionObserver((entries) => setInView(entries[entries.length - 1]?.isIntersecting ?? false), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return inView && tabVisible;
}
