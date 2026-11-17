import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/** Mobile hero cue: a bobbing chevron that invites the first scroll, then gets out of the way. */
export function ScrollCue({ label = 'Scroll' }: { label?: string }) {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setGone(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-1 z-20 flex flex-col items-center gap-1 text-[10px] font-mono-tabular uppercase tracking-[0.3em] text-ink-2 transition-opacity duration-500 sm:hidden ${gone ? 'opacity-0' : 'opacity-100'}`}
    >
      <span>{label}</span>
      <span className="scroll-cue-bob inline-flex h-8 w-5 items-start justify-center rounded-full border border-control pt-1.5">
        <span className="scroll-cue-dot block h-1.5 w-1 rounded-full bg-accent-red" />
      </span>
      <ChevronDown className="scroll-cue-bob h-3.5 w-3.5 text-brand" />
    </div>
  );
}
