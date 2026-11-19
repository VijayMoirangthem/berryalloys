import { useEffect } from 'react';

/**
 * Touch screens need roughly 44px hit areas. Many editorial links/buttons here are visually small (12px text),
 * so on coarse pointers we extend only the *hit area* (an invisible ::after) without changing layout or look.
 */
export function useTapTargets() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    let timer = 0;
    const apply = () => {
      document.querySelectorAll<HTMLElement>('a[href], button').forEach((el) => {
        if (el.dataset.tapChecked === '1' || el.closest('[data-no-tap-pad]')) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        el.dataset.tapChecked = '1';
        if (r.height >= 40 && r.width >= 40) return;
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.classList.add('tap-pad');
        el.style.setProperty('--tap-y', `${Math.max(0, Math.ceil((44 - r.height) / 2))}px`);
        el.style.setProperty('--tap-x', `${Math.max(0, Math.ceil((44 - r.width) / 2))}px`);
      });
    };
    // Throttle (not debounce): constantly-mutating scenes must not starve the pass.
    const schedule = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        apply();
      }, 200);
    };
    schedule();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      window.clearTimeout(timer);
    };
  }, []);
}
