import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { DICTIONARIES } from '../../i18n';
import { LOCALES, LOCALE_META, equivalentPath, type LocaleCode } from '../../i18n/locales';
import { useLocale } from '../../i18n/useLocale';
import { cn } from '../../lib/utils';

/**
 * Language selector. Each option is a real link to the equivalent language URL, so switching works with back/forward,
 * refresh and direct loading; the URL stays the source of truth. Language names are shown, not national flags.
 */
export function LanguageSelector({ className, align = 'end' }: { className?: string; align?: 'start' | 'end' }) {
  const { locale, pathname, routeLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const label = DICTIONARIES[locale].common.languageLabel;
  // On legacy English routes the page itself is English even though no language prefix exists.
  const current: LocaleCode = routeLocale ?? 'en';

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${label}: ${LOCALE_META[current].native}`}
        className="inline-flex min-h-[40px] items-center gap-1.5 border border-control bg-card px-2.5 text-xs font-semibold text-ink hover:border-brand transition-colors cursor-pointer"
      >
        <Globe className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        <span lang={LOCALE_META[current].htmlLang}>{LOCALE_META[current].native}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <ul
          className={cn(
            'absolute top-full z-50 mt-1 min-w-[190px] border border-subtle bg-card py-1 shadow-xl',
            align === 'end' ? 'end-0' : 'start-0'
          )}
        >
          {LOCALES.map((l) => {
            const m = LOCALE_META[l];
            const active = l === current;
            return (
              <li key={l}>
                <Link
                  to={equivalentPath(pathname, l)}
                  lang={m.htmlLang}
                  hrefLang={m.htmlLang}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex min-h-[40px] items-center justify-between gap-3 px-3 text-sm hover:bg-band',
                    active ? 'font-semibold text-brand' : 'text-ink'
                  )}
                >
                  <span>
                    {m.native}
                    {m.native !== m.english && <span className="ms-2 text-[11px] font-normal text-ink-muted" lang="en">{m.english}</span>}
                  </span>
                  {active && <Check className="h-4 w-4" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
