import { useEffect, useState } from 'react';

/**
 * Reactive viewport check for mobile / compact viewports (< breakpointPx, default 768px)
 * so desktop-heavy WebGL, 3D book-turn, and complex hover experiences can cleanly swap to
 * fast, touch-native mobile alternatives without breaking SSR or desktop behaviour.
 */
export function useIsCompactMobile(maxWidthPx = 767): boolean {
  const [compact, setCompact] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`);
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [maxWidthPx]);

  return compact;
}

/**
 * Reactive check for coarse-pointer (touch-primary) devices where hover-only tooltips/trails
 * have no natural hover trigger.
 */
export function useIsCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(hover: none) and (pointer: coarse)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return coarse;
}
