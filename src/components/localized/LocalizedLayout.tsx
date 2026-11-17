import { Link, NavLink, Outlet } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { BrandLockup } from '../BrandLockup';
import { ThemeToggle } from '../ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { DICTIONARIES } from '../../i18n';
import { DEMO_PRODUCT_SLUG, LOCALE_META, insightsHref, localePath, type LocaleCode } from '../../i18n/locales';

/**
 * One shared layout for every localised route. The page header, navigation, footer and demonstration notices are fully
 * translated; secondary pages that are not translated are linked with an explicit "Available in English" label.
 */
export function LocalizedLayout({ locale }: { locale: LocaleCode }) {
  const t = DICTIONARIES[locale];
  const meta = LOCALE_META[locale];
  const links = [
    { to: localePath(locale), label: t.nav.buyers, end: true },
    { to: localePath(locale, `/products/${DEMO_PRODUCT_SLUG}`), label: t.nav.product },
    { to: localePath(locale, '/rfq'), label: t.nav.rfq },
    { to: insightsHref(locale), label: t.nav.insights },
  ];
  return (
    <div lang={meta.htmlLang} dir={meta.dir} className="loc-root min-h-screen flex flex-col bg-canvas text-ink">
      <a href="#loc-main" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-canvas">
        {t.common.skip}
      </a>
      <header className="sticky top-0 z-40 border-b border-subtle bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link to={localePath(locale)} aria-label="Berry Alloys Limited" className="shrink-0" dir="ltr">
            <BrandLockup variant="header" surface="auto" />
          </Link>
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-brand border-b-2 border-accent-red' : 'text-ink-2 hover:text-ink'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/" hrefLang="en" lang="en" className="hidden md:inline-flex min-h-[40px] items-center gap-1.5 px-2 text-xs font-medium text-ink-2 hover:text-brand">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.common.englishSite}</span>
            </Link>
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
        <nav aria-label="Primary (compact)" className="lg:hidden border-t border-subtle">
          <ul className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-3 [scrollbar-width:none]">
            {links.map((l) => (
              <li key={l.to} className="shrink-0">
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `inline-flex min-h-[44px] items-center px-3 text-sm font-medium ${isActive ? 'border-b-2 border-accent-red text-brand' : 'text-ink-2'}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="shrink-0 md:hidden">
              <Link to="/" hrefLang="en" lang="en" className="inline-flex min-h-[44px] items-center px-3 text-sm text-ink-2">
                {t.common.englishSite}
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main id="loc-main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-subtle bg-band">
        <div className="mx-auto max-w-[1200px] space-y-2 px-4 py-8 text-xs text-ink-2 sm:px-6">
          <p className="font-semibold text-ink">{t.footer.note}</p>
          {meta.reviewStatus === 'machine-draft' && <p role="note">{t.common.demoNotice}</p>}
          <p dir="ltr" lang="en" className="text-ink-muted">
            Berry Alloys Limited · CIN U27310WB2006PLC145016
          </p>
        </div>
      </footer>
    </div>
  );
}
