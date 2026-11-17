import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useMotion } from '../context/MotionContext';
import {
  HAS_EXPORT_MARKETS,
  KIND_LABEL,
  PRESENCE_LOCATIONS,
  PRESENCE_ROUTES,
  PresenceKind,
  PresenceLocation,
} from '../data/globalPresence';
import { FlagIcon } from './globe/FlagIcon';
import type { FocusRequest } from './globe/GlobeScene';
import { cn } from '../lib/utils';

// next/dynamic in the reference example becomes React.lazy + Suspense in this Vite project.
const GlobeScene = lazy(() => import('./globe/GlobeScene'));
const PresenceFallbackMap = lazy(() => import('./globe/PresenceFallbackMap'));

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const PRECISION_NOTE: Record<PresenceLocation['precision'], string> = {
  'site-area': 'Marker shows the surrounding area, not an exact plant boundary.',
  city: 'Marker shows the town or city, not an exact premises.',
  country: 'Market markers are country-level representations, not company premises.',
};

const KIND_DOT: Record<PresenceKind, string> = {
  facility: 'bg-brand',
  office: 'bg-ink',
  port: 'bg-brand ring-2 ring-offset-1 ring-brand ring-offset-card',
  'export-market': 'bg-accent-red',
};

const GROUP_ORDER: PresenceKind[] = ['facility', 'port', 'office', 'export-market'];

function GlobePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-busy="true">
      <div className="relative aspect-square w-[78%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#2B7FB8,#0E4A75_55%,#06233F)] shadow-[0_0_60px_rgba(46,143,208,0.35)]">
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono-tabular uppercase tracking-widest text-white/80">
          Loading globe…
        </span>
      </div>
    </div>
  );
}

export function GlobalPresenceSection() {
  const { theme } = useTheme();
  const { ambientActive, reducedMotion } = useMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [webgl] = useState(detectWebGL);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const nonce = useRef(0);

  // Create the scene only when the section is about to be seen, so it never initialises against a hidden container.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Entries can queue up ([false, true]); any intersecting entry means the section is near the viewport.
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selected = useMemo(() => PRESENCE_LOCATIONS.find((l) => l.id === selectedId) ?? null, [selectedId]);
  const hoveredOwnerLoc = useMemo(() => PRESENCE_LOCATIONS.find((l) => l.id === hoveredId) ?? null, [hoveredId]);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    setInspecting(true);
    nonce.current += 1;
    setFocusRequest({ id, nonce: nonce.current });
  }, []);

  const resume = useCallback(() => {
    setInspecting(false);
    setSelectedId(null);
  }, []);

  const useFallback = !webgl || sceneFailed;
  const autoRotate = ambientActive && !inspecting && !hoveredId;
  const grouped = GROUP_ORDER.map((k) => ({ kind: k, items: PRESENCE_LOCATIONS.filter((l) => l.kind === k) })).filter((g) => g.items.length);

  const goEnquiry = () => {
    document.getElementById('enquiry')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div ref={wrapRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      {/* Globe */}
      <div className="lg:col-span-7 order-1 min-w-0">
        <div className="relative mx-auto aspect-square w-full max-w-[640px] overflow-hidden border border-subtle bg-band lg:max-h-[640px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_srgb,var(--brand-primary)_16%,transparent),transparent_68%)]"
          />
          <div className="absolute inset-0">
            {!mounted ? (
              <GlobePlaceholder />
            ) : (
              <Suspense fallback={<GlobePlaceholder />}>
                {useFallback ? (
                  <PresenceFallbackMap
                    locations={PRESENCE_LOCATIONS}
                    routes={PRESENCE_ROUTES}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={select}
                    onHover={setHoveredId}
                    ambient={ambientActive}
                  />
                ) : (
                  <GlobeScene
                    locations={PRESENCE_LOCATIONS}
                    routes={PRESENCE_ROUTES}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={select}
                    onHover={setHoveredId}
                    onInteract={() => setInspecting(true)}
                    theme={theme}
                    autoRotate={autoRotate}
                    ambient={ambientActive}
                    reducedMotion={reducedMotion}
                    focusRequest={focusRequest}
                    onReady={() => undefined}
                    onError={() => setSceneFailed(true)}
                  />
                )}
              </Suspense>
            )}
          </div>

          <div className="absolute left-3 bottom-3 right-3 flex flex-wrap items-center justify-between gap-2">
            <p className="max-w-[58%] bg-[#07111F]/60 px-2 py-1 text-[11px] font-mono-tabular text-white/90">
              {useFallback
                ? 'Map view — 3D globe is unavailable on this device.'
                : 'Drag to rotate · select a marker or use the list'}
            </p>
            {!useFallback && ambientActive && inspecting && (
              <button
                type="button"
                onClick={resume}
                className="inline-flex min-h-[40px] items-center gap-1.5 border border-white/60 bg-[#07111F]/80 px-3 text-xs font-semibold text-white hover:bg-[#07111F] transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Resume rotation
              </button>
            )}
            {!useFallback && ambientActive && !inspecting && (
              <button
                type="button"
                onClick={() => setInspecting(true)}
                className="inline-flex min-h-[40px] items-center gap-1.5 border border-white/60 bg-[#07111F]/80 px-3 text-xs font-semibold text-white hover:bg-[#07111F] transition-colors cursor-pointer"
              >
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                Pause rotation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selector, legend, details */}
      <div className="lg:col-span-5 order-2 space-y-6 min-w-0">
        <p className="text-sm sm:text-base text-ink-2 leading-relaxed max-w-xl">
          Ferro alloys are smelted in Andhra Pradesh and Jharkhand and dispatched through Visakhapatnam Harbour Port. Choose a
          location to see its role, or select its marker on the globe.
        </p>

        <div className="space-y-4" role="group" aria-label="Locations">
          {grouped.map((g) => (
            <div key={g.kind} className="space-y-2">
              <h3 className="flex items-center gap-2 text-[11px] font-mono-tabular uppercase tracking-widest text-ink-2">
                <span aria-hidden="true" className={cn('inline-block h-2.5 w-2.5 rounded-full', KIND_DOT[g.kind])} />
                {KIND_LABEL[g.kind]}
              </h3>
              <ul className="grid grid-cols-1 gap-2">
                {g.items.map((loc) => {
                  const isSel = selectedId === loc.id;
                  return (
                    <li key={loc.id} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => select(loc.id)}
                        aria-pressed={isSel}
                        onPointerEnter={() => setHoveredId(loc.markerGroup ?? loc.id)}
                        onPointerLeave={() => setHoveredId(null)}
                        className={cn(
                          'flex w-full min-h-[48px] items-center justify-between gap-3 border px-3 py-2 text-left transition-colors cursor-pointer',
                          isSel ? 'border-brand bg-brand-soft text-ink' : 'border-subtle bg-card text-ink hover:border-brand'
                        )}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <FlagIcon code={loc.countryCode} className="h-3.5 w-5" />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-tight truncate">{loc.name}</span>
                            <span className="block text-[11px] text-ink-2">{loc.region}</span>
                          </span>
                        </span>
                        <ArrowRight className={cn('h-4 w-4 shrink-0 transition-transform', isSel ? 'text-brand translate-x-0.5' : 'text-ink-muted')} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Selected-location details (announced politely once per selection) */}
        <div className="border border-subtle bg-card p-4 sm:p-5" aria-live="polite">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand">{KIND_LABEL[selected.kind]}</p>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">{selected.name}</h3>
                </div>
                <span className="shrink-0 border border-accent-red/60 bg-accent-red-soft px-2 py-1 text-[10px] font-mono-tabular uppercase tracking-wider text-accent-red-hover dark:text-accent-red">
                  {selected.status}
                </span>
              </div>
              <p className="text-sm text-ink leading-relaxed">{selected.role}</p>
              <p className="text-sm text-ink-2 leading-relaxed">{selected.detail}</p>
              <p className="text-[11px] text-ink-muted">{PRECISION_NOTE[selected.precision]}</p>
              <button
                type="button"
                onClick={goEnquiry}
                className="inline-flex min-h-[44px] items-center gap-2 bg-brand px-5 text-xs font-semibold text-on-brand hover:bg-brand-hover transition-colors cursor-pointer"
              >
                Enquire about {selected.kind === 'port' ? 'dispatch from this port' : 'this location'}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink-2 leading-relaxed">
              {hoveredOwnerLoc
                ? `${hoveredOwnerLoc.name} — ${KIND_LABEL[hoveredOwnerLoc.kind]}. Select it for details.`
                : 'Select a location to see its role, status and how to enquire.'}
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-[11px] text-ink-muted leading-relaxed">
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-brand" />
            Route lines join plants to the dispatch port named in company records. They are schematic, not shipping lanes.
          </p>
          <p>
            Markers show towns or areas, not exact premises.{' '}
            {HAS_EXPORT_MARKETS
              ? 'Market markers are country-level representations.'
              : 'Overseas markets appear here once they are approved for publication.'}
          </p>
        </div>
      </div>
    </div>
  );
}
