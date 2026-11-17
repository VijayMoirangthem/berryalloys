import { CLIENT_LOGOS } from '../data/logos';
import { LogoSlider } from './ui/LogoSlider';

/**
 * Client logo strip. Original colours and proportions are preserved: logos sit on light tiles in both themes and no
 * filter is ever applied. Desktop gets a slow marquee (pauses on hover, stops under reduced motion or when ambient motion
 * is paused; the seamless clone is aria-hidden inside LogoSlider). Phones get a plain grid, which needs no motion.
 */
export function ClientLogoStrip({ title, note, className = '' }: { title: string; note?: string; className?: string }) {
  const tile = (l: (typeof CLIENT_LOGOS)[number]) => (
    <figure key={l.id} className="flex h-20 w-48 shrink-0 items-center justify-center border border-subtle bg-white px-4">
      <img src={l.assetPath} alt={l.alt} width={l.width} height={l.height} loading="lazy" decoding="async" className="max-h-12 w-auto max-w-full object-contain" />
    </figure>
  );
  return (
    <section aria-label={title} className={className}>
      <div className="mb-3 space-y-1">
        <h2 className="text-xs font-semibold text-ink-2">{title}</h2>
        {note && <p className="text-[11px] text-ink-muted">{note}</p>}
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden">
        {CLIENT_LOGOS.map((l) => (
          <li key={l.id} className="flex h-20 items-center justify-center border border-subtle bg-white px-3">
            <img src={l.assetPath} alt={l.alt} width={l.width} height={l.height} loading="lazy" decoding="async" className="max-h-11 w-auto max-w-full object-contain" />
          </li>
        ))}
      </ul>

      <div className="hidden lg:block">
        <LogoSlider items={CLIENT_LOGOS.map(tile)} speed={42} gap="1rem" logoHeight="5rem" pauseOnHover />
      </div>
    </section>
  );
}
