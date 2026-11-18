import { CLIENT_LOGOS } from '../data/logos';
import { LogoSlider } from './ui/LogoSlider';

/**
 * Client logo strip. Original colours and proportions are preserved: logos sit on light tiles in both themes and no
 * filter is ever applied. Renders the continuous horizontal auto-scrolling marquee across all viewports (pauses on hover,
 * stops under reduced motion or when ambient motion is paused; the seamless clone is aria-hidden inside LogoSlider).
 */
export function ClientLogoStrip({ title, note, className = '' }: { title: string; note?: string; className?: string }) {
  const tile = (l: (typeof CLIENT_LOGOS)[number]) => (
    <figure key={l.id} className="flex h-16 sm:h-20 w-40 sm:w-48 shrink-0 items-center justify-center border border-subtle bg-white px-3 sm:px-4">
      <img src={l.assetPath} alt={l.alt} width={l.width} height={l.height} loading="lazy" decoding="async" className="max-h-10 sm:max-h-12 w-auto max-w-full object-contain" />
    </figure>
  );
  return (
    <section aria-label={title} className={className}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-xs font-semibold text-ink-2">{title}</h2>
          {note && <p className="text-[11px] text-ink-muted">{note}</p>}
        </div>
        <span className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
          <span className="lg:hidden">Tap Ribbon To Pause</span>
          <span className="hidden lg:inline">Hover Ribbon To Pause</span>
        </span>
      </div>

      <LogoSlider items={CLIENT_LOGOS.map(tile)} speed={32} gap="1rem" logoHeight="5rem" pauseOnHover />
    </section>
  );
}
