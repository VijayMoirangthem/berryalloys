import { useEffect } from 'react';

/**
 * Enhances every `.m-rail` (CSS makes it a horizontal snap rail on phones):
 *  - pagination dots that follow the scroll position and are tappable,
 *  - a one-time "peek" nudge the first time the rail scrolls into view (teaches the swipe),
 *  - slow auto-advance while on screen (paused by touch, hidden tab, or reduced motion).
 * Purely additive: the rail works with plain touch scrolling if any of this is skipped.
 */
const mobile = () => window.matchMedia('(max-width: 767px)').matches;

export function useMobileRails() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const setup = new WeakSet<HTMLElement>();
    const cleanups: Array<() => void> = [];

    const enhance = (rail: HTMLElement) => {
      if (setup.has(rail)) return;
      setup.add(rail);
      const kids = () => Array.from(rail.children).filter((n) => !(n as HTMLElement).classList.contains('m-rail-dots')) as HTMLElement[];
      if (kids().length < 2) return;

      const dots = document.createElement('div');
      dots.className = 'm-rail-dots';
      dots.setAttribute('role', 'tablist');
      dots.style.color = 'inherit';
      const buttons: HTMLButtonElement[] = [];
      kids().forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Go to item ${i + 1}`);
        b.addEventListener('click', () => {
          const k = kids()[i];
          if (k) rail.scrollTo({ left: k.offsetLeft - rail.offsetLeft - 16, behavior: 'smooth' });
        });
        dots.appendChild(b);
        buttons.push(b);
      });
      rail.insertAdjacentElement('afterend', dots);

      let active = 0;
      const paint = () => {
        const list = kids();
        const center = rail.scrollLeft + 16;
        let best = 0;
        let bd = Infinity;
        list.forEach((k, i) => {
          const d = Math.abs(k.offsetLeft - rail.offsetLeft - center);
          if (d < bd) { bd = d; best = i; }
        });
        active = best;
        buttons.forEach((b, i) => b.setAttribute('aria-current', i === best ? 'true' : 'false'));
      };
      paint();
      rail.addEventListener('scroll', paint, { passive: true });

      let userTouched = false;
      let visible = false;
      let peeked = false;
      let timer = 0;
      const stop = () => { userTouched = true; };
      rail.addEventListener('touchstart', stop, { passive: true });
      rail.addEventListener('pointerdown', stop, { passive: true });

      const next = () => {
        if (!mobile() || userTouched || !visible || document.hidden || reduced) return;
        const list = kids();
        const i = (active + 1) % list.length;
        rail.scrollTo({ left: i === 0 ? 0 : list[i].offsetLeft - rail.offsetLeft - 16, behavior: 'smooth' });
      };

      const io = new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        visible = e.isIntersecting && e.intersectionRatio > 0.35;
        if (visible && !peeked && !reduced && mobile()) {
          peeked = true;
          window.setTimeout(() => {
            if (userTouched) return;
            rail.scrollTo({ left: 56, behavior: 'smooth' });
            window.setTimeout(() => !userTouched && rail.scrollTo({ left: 0, behavior: 'smooth' }), 650);
          }, 350);
        }
      }, { threshold: [0, 0.35, 0.6] });
      io.observe(rail);
      timer = window.setInterval(next, 4200);

      cleanups.push(() => {
        io.disconnect();
        window.clearInterval(timer);
        rail.removeEventListener('scroll', paint);
        dots.remove();
      });
    };

    const scan = () => document.querySelectorAll<HTMLElement>('.m-rail').forEach(enhance);
    let t = 0;
    const mo = new MutationObserver(() => {
      if (t) return;
      t = window.setTimeout(() => { t = 0; scan(); }, 250);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    scan();
    return () => { mo.disconnect(); window.clearTimeout(t); cleanups.forEach((c) => c()); };
  }, []);
}
