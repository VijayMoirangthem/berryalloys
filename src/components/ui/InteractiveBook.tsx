import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { animate, motion, useReducedMotion } from 'motion/react';
import { useDrag } from '@use-gesture/react';
import { OFFICIAL_BRAND_MARK_DARK } from '../../data/assets';
import { cn } from '../../lib/utils';

export interface BookPageMetric {
  label: string;
  value: string;
}

export interface InteractiveBookPage {
  pageNumber: number;
  kicker: string;
  title: string;
  paragraphs: string[];
  metrics?: BookPageMetric[];
  image?: string;
  imageAlt?: string;
}

export interface InteractiveBookProps {
  coverKicker?: string;
  coverTitle: string;
  coverSubtitle?: string;
  coverMeta?: string;
  pages: InteractiveBookPage[];
  className?: string;
}

/* ------------------------------------------------------------------------------------------------
 * Page-turn engine
 *
 * A turning page is a real "leaf": it hinges on the spine and rotates through 180° in 3D. To make the paper
 * bend instead of staying rigid, the leaf is split into three nested strips; each strip adds a small extra
 * rotation relative to the one before it (a curl that trails on the way up and leads on the way down).
 * Both faces of the leaf carry real page content, the face turning away darkens as it goes edge-on, and the
 * pages underneath receive a soft cast shadow. All of it is driven by one eased progress value and written
 * straight to the DOM, so React does not re-render on every frame.
 * --------------------------------------------------------------------------------------------- */

const STRIPS = 3;
const CURL_DEG = 9;
const TURN_EASE: [number, number, number, number] = [0.645, 0.045, 0.355, 1];
const DURATION = { page: 1.6, jump: 1.35, cover: 2.1 } as const;

type Hinge = 'left' | 'right';

interface LeafHandle {
  /** theta: rotation of the whole leaf; delta: extra rotation added per strip (the curl). */
  update: (theta: number, delta: number) => void;
}

interface LeafProps {
  hinge: Hinge;
  width: number;
  height: number;
  front: ReactNode;
  back: ReactNode;
}

const Leaf = forwardRef<LeafHandle, LeafProps>(function Leaf({ hinge, width, height, front, back }, ref) {
  const stripRefs = useRef<Array<HTMLDivElement | null>>([]);
  const frontShade = useRef<Array<HTMLDivElement | null>>([]);
  const backShade = useRef<Array<HTMLDivElement | null>>([]);
  const s = width / STRIPS;

  useImperativeHandle(
    ref,
    () => ({
      update(theta, delta) {
        for (let k = 0; k < STRIPS; k++) {
          const el = stripRefs.current[k];
          if (!el) continue;
          el.style.transform = `rotateY(${k === 0 ? theta : delta}deg)`;
          // Absolute angle of this strip drives how dark each face is.
          const a = Math.min(180, Math.abs(theta + k * delta));
          const f = a < 90 ? 0.34 * Math.pow(a / 90, 1.6) : 0.34;
          const b = a > 90 ? 0.34 * Math.pow((180 - a) / 90, 1.6) : 0.34;
          if (frontShade.current[k]) frontShade.current[k]!.style.opacity = String(f);
          if (backShade.current[k]) backShade.current[k]!.style.opacity = String(b);
        }
      },
    }),
    []
  );

  const frontOffset = (k: number) => (hinge === 'left' ? -k * s : -(width - (k + 1) * s));
  const backOffset = (k: number) => (hinge === 'left' ? (k + 1) * s - width : -k * s);
  // Light falls from the spine side, so the shade gradient follows the hinge.
  const shadeDir = hinge === 'left' ? 'to right' : 'to left';

  const strip = (k: number): ReactNode => {
    const stripWidth = k === STRIPS - 1 ? s : s + 2; // overlap hides sub-pixel seams between strips
    return (
      <div
        key={k}
        ref={(el) => {
          stripRefs.current[k] = el;
        }}
        style={{
          position: 'absolute',
          top: 0,
          [hinge === 'left' ? 'left' : 'right']: k === 0 ? 0 : '100%',
          width: stripWidth,
          height,
          transformOrigin: `${hinge} center`,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div
          style={{ position: 'absolute', inset: 0, overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width, height, transform: `translateX(${frontOffset(k)}px)` }}>
            {front}
          </div>
          <div
            ref={(el) => {
              frontShade.current[k] = el;
            }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              pointerEvents: 'none',
              background: `linear-gradient(${shadeDir}, rgba(8,20,36,0.85), rgba(8,20,36,0.25))`,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width, height, transform: `translateX(${backOffset(k)}px)` }}>
            {back}
          </div>
          <div
            ref={(el) => {
              backShade.current[k] = el;
            }}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              pointerEvents: 'none',
              background: `linear-gradient(${shadeDir === 'to right' ? 'to left' : 'to right'}, rgba(8,20,36,0.85), rgba(8,20,36,0.25))`,
            }}
          />
        </div>
        {k < STRIPS - 1 && strip(k + 1)}
      </div>
    );
  };

  return (
    <div
      inert
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        height,
        width,
        zIndex: 30,
        transformStyle: 'preserve-3d',
        pointerEvents: 'none',
      }}
      data-leaf-hinge={hinge}
    >
      {strip(0)}
    </div>
  );
});

/* ------------------------------ Pages ------------------------------ */

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function NarrativePage({
  page,
  compact = false,
}: {
  page: InteractiveBookPage;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        'h-full flex flex-col justify-between bg-[#FBFDFF] dark:bg-[#10243A]',
        compact ? 'p-3.5 gap-2.5 overflow-y-auto' : 'p-6 sm:p-8 gap-5'
      )}
    >
      <div className={compact ? 'space-y-1.5' : 'space-y-3'}>
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
          <span className="truncate">{page.kicker}</span>
          <span className="text-[#465C72] dark:text-[#B5C5D7] shrink-0">Folio 0{page.pageNumber}</span>
        </div>
        <h3
          className={cn(
            'font-display font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]',
            compact ? 'text-[21px] leading-[1.08]' : 'text-2xl sm:text-3xl'
          )}
        >
          {page.title}
        </h3>
        <div
          className={cn(
            'text-[#465C72] dark:text-[#F4F8FC]/84',
            compact ? 'space-y-1.5 text-[12px] leading-[1.44]' : 'space-y-3 text-xs sm:text-sm leading-relaxed'
          )}
        >
          {page.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      {page.metrics && page.metrics.length > 0 && (
        <dl
          className={cn(
            'grid grid-cols-2 gap-3 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 shrink-0',
            compact ? 'pt-2.5' : 'pt-4'
          )}
        >
          {page.metrics.map((m) => (
            <div key={m.label}>
              <dt className="text-[9.5px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                {m.label}
              </dt>
              <dd
                className={cn(
                  'font-display font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]',
                  compact ? 'text-base leading-tight mt-0.5' : 'text-lg'
                )}
              >
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

interface PlateProps {
  page: InteractiveBookPage;
  pages: InteractiveBookPage[];
  activeIndex: number;
  interactive: boolean;
  onJump: (index: number) => void;
  onNext: () => void;
}

function PlatePage({ page, pages, activeIndex, interactive, onJump, onNext }: PlateProps) {
  const nextPage = pages[activeIndex + 1];
  return (
    <div className="h-full p-6 sm:p-8 flex flex-col justify-between gap-5 bg-[#F1F6FB] dark:bg-[#0D1B2E]">
      {page.image && (
        <figure className="border border-[#10243A]/14 dark:border-[#F4F8FC]/14 bg-[#10243A] overflow-hidden">
          <div className="aspect-[16/10] overflow-hidden">
            <img src={page.image} alt={page.imageAlt ?? page.title} className="w-full h-full object-cover" draggable={false} />
          </div>
        </figure>
      )}

      <div className="space-y-3">
        <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-brand">Dossier Contents · Jump to Chapter</p>
        <div className="grid grid-cols-2 gap-1.5">
          {pages.map((p, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                key={p.pageNumber}
                type="button"
                tabIndex={interactive ? 0 : -1}
                onClick={() => onJump(idx)}
                className={cn(
                  'text-left px-2.5 py-2 text-[11px] border transition-colors duration-300',
                  interactive ? 'cursor-pointer' : 'pointer-events-none',
                  selected
                    ? 'bg-[#10243A] text-[#FFFFFF] border-[#10243A] dark:bg-[#0A6AA1] dark:border-[#0A6AA1] dark:text-[#F4F8FC]'
                    : 'bg-white dark:bg-[#12243B] text-[#465C72] dark:text-[#B5C5D7] border-[#10243A]/12 dark:border-[#F4F8FC]/12 hover:border-brand'
                )}
              >
                <span className="font-mono-tabular block text-[9px] opacity-75">0{p.pageNumber}</span>
                <span className="font-semibold line-clamp-1">{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {nextPage && (
        <button
          type="button"
          tabIndex={interactive ? 0 : -1}
          onClick={onNext}
          className={cn(
            'w-full flex items-center justify-between pt-3 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12 text-xs font-semibold text-brand hover:underline',
            interactive ? 'cursor-pointer' : 'pointer-events-none'
          )}
        >
          <span>
            Turn to 0{nextPage.pageNumber}: {nextPage.title}
          </span>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

interface CoverProps {
  coverKicker: string;
  coverTitle: string;
  coverSubtitle: string;
  coverMeta: string;
  fill: boolean;
  compact?: boolean;
}

function Cover({ coverKicker, coverTitle, coverSubtitle, coverMeta, fill, compact = false }: CoverProps) {
  return (
    <div
      className={cn(
        'relative h-full min-h-[inherit] w-full overflow-hidden bg-[#10243A] text-[#F4F8FC] border border-[#69C5F5]/35 group',
        compact ? 'p-5' : 'p-6 sm:p-8',
        fill ? '' : 'max-w-[380px] mx-auto'
      )}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#0B0C0E] via-[#262B32] to-transparent border-r border-[#F4F8FC]/10" />
      <span aria-hidden="true" className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand via-[#69C5F5] to-brand" />
      {/* Subtle layered page-block edge on the right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1.5 right-0 w-[3px] bg-gradient-to-b from-[#E5EDF5] via-[#C8D6E4] to-[#E5EDF5] opacity-75"
      />
      <div className="pl-3 h-full flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-2">
          <img src={OFFICIAL_BRAND_MARK_DARK} alt="Berry Alloys Limited emblem" className="h-6 sm:h-7 w-auto object-contain" draggable={false} />
          <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#69C5F5]">2006–2026</span>
        </div>
        <div className={cn('space-y-2 border-y border-[#F4F8FC]/14', compact ? 'py-3' : 'py-4')}>
          <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#B5C5D7]">{coverKicker}</p>
          <h3 className={cn('font-display font-bold uppercase tracking-tight text-[#F4F8FC]', compact ? 'text-2xl' : 'text-3xl sm:text-4xl')}>
            {coverTitle}
          </h3>
          <p className="text-xs text-[#F4F8FC]/78 leading-relaxed line-clamp-3">{coverSubtitle}</p>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#B5C5D7]">
          <span className="truncate">{coverMeta}</span>
          <span className="text-[#69C5F5] shrink-0">{compact ? 'Swipe / Tap →' : 'Open Book →'}</span>
        </div>
      </div>
    </div>
  );
}

/** Blank ruled paper back face on a single-sheet mobile turn. */
function PaperBack() {
  return (
    <div className="h-full w-full bg-[#EFF4FA] dark:bg-[#0B1728] bg-[repeating-linear-gradient(0deg,transparent_0,transparent_25px,rgba(16,36,58,0.06)_26px)] border border-[#10243A]/15 dark:border-[#F4F8FC]/12">
      <div className="h-full w-full bg-gradient-to-r from-[#10243A]/14 via-transparent to-transparent" />
    </div>
  );
}

/** Inside navy endpaper visible on the reverse side of the opening cover. */
function CoverInside() {
  return (
    <div className="h-full w-full bg-[#0C1C30] border border-[#69C5F5]/20 p-5 flex flex-col justify-between text-[#F4F8FC]/55">
      <span className="text-[9px] font-mono-tabular uppercase tracking-widest">DKG Group · Corporate Archive</span>
      <span className="text-[9px] font-mono-tabular uppercase tracking-widest self-end">Berry Alloys Limited</span>
    </div>
  );
}

interface MobileSheetProps {
  page: InteractiveBookPage;
  hasNext: boolean;
  onTapNext?: () => void;
}

function MobileSheet({ page, hasNext, onTapNext }: MobileSheetProps) {
  return (
    <div className="relative h-full w-full flex flex-col bg-[#FBFDFF] dark:bg-[#10243A] border border-[#10243A]/20 dark:border-[#F4F8FC]/16 overflow-hidden select-none">
      {/* Left bound spine fold */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3.5 z-10 bg-gradient-to-r from-[#10243A]/20 via-[#10243A]/06 to-transparent dark:from-black/45 dark:via-black/15"
      />
      {/* Stacked page fore-edge lines on right edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[3px] z-10 bg-[repeating-linear-gradient(0deg,rgba(16,36,58,0.16)_0,rgba(16,36,58,0.16)_1px,transparent_1px,transparent_3px)]"
      />

      {page.image && (
        <div className="relative h-[96px] w-full shrink-0 overflow-hidden bg-[#10243A] border-b border-[#10243A]/14 dark:border-[#F4F8FC]/12">
          <img
            src={page.image}
            alt={page.imageAlt ?? page.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#07111F]/70 via-transparent to-transparent"
          />
          <span className="absolute bottom-2 left-3.5 text-[9.5px] font-mono-tabular uppercase tracking-widest text-[#F4F8FC]/92">
            Plate 0{page.pageNumber} · Official Archive
          </span>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        <NarrativePage page={page} compact />
      </div>

      {/* Tactile corner curl tap zone for next page */}
      {hasNext && onTapNext && (
        <button
          type="button"
          onClick={onTapNext}
          aria-label={`Turn to folio 0${page.pageNumber + 1}`}
          className="group absolute bottom-0 right-0 z-20 flex items-end justify-end w-16 h-12 cursor-pointer focus:outline-none"
        >
          <span
            aria-hidden="true"
            className="w-9 h-9 bg-gradient-to-tl from-[#D9E5F0] via-[#EEF4FA] to-transparent dark:from-[#1B3A5C] dark:via-[#142D49] border-t border-l border-[#10243A]/18 dark:border-[#69C5F5]/30 shadow-[-3px_-3px_8px_rgba(16,36,58,0.14)] transition-transform duration-200 group-hover:scale-110 flex items-center justify-center"
            style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
          />
        </button>
      )}
    </div>
  );
}

/* ------------------------------ Book ------------------------------ */

interface Turn {
  from: number; // -1 = closed cover
  to: number;
  dir: 'fwd' | 'back';
  kind: 'cover' | 'page' | 'jump';
  manual?: boolean;
}

const MOBILE_BOOK_HEIGHT = 396;

/**
 * InteractiveBook — a corporate heritage dossier with a genuine 3-strip curved 3D leaf turn:
 * spread view on tablet/desktop and a compact, touch-swipe / finger-drag single-sheet book on mobile.
 */
export function InteractiveBook({
  coverKicker = 'Corporate Heritage Dossier · CIN U27310WB2006PLC145016',
  coverTitle,
  coverSubtitle = 'DKG Group Ethos, Eastern India Smelting Corridor & Export Milestones',
  coverMeta = 'Berry Alloys Limited · 2006–2026',
  pages,
  className,
}: InteractiveBookProps) {
  const prefersReduced = useReducedMotion();
  const total = pages.length;
  const [pos, setPos] = useState(-1); // -1 closed, 0..total-1 folio
  const [turn, setTurn] = useState<Turn | null>(null);
  const [spread, setSpread] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftLayerRef = useRef<HTMLDivElement>(null);
  const shadeLeftRef = useRef<HTMLDivElement>(null);
  const shadeRightRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<LeafHandle>(null);
  const turnRef = useRef<Turn | null>(null);
  const animRef = useRef<{ stop: () => void } | null>(null);
  const didDragRef = useRef(false);
  const lastDragProgressRef = useRef(0);

  const turning = turn !== null;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setSpread(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [spread, pos, turn]);

  useEffect(
    () => () => {
      animRef.current?.stop();
    },
    []
  );

  const pageW = spread ? size.w / 2 : size.w;
  const pageH = spread ? size.h : Math.max(size.h, MOBILE_BOOK_HEIGHT);

  /* Content for each side of a given position. */
  const leftOf = (p: number): ReactNode =>
    p < 0 ? null : <NarrativePage page={pages[p]} />;
  const rightOf = (p: number, interactive: boolean): ReactNode =>
    p < 0 ? (
      <Cover coverKicker={coverKicker} coverTitle={coverTitle} coverSubtitle={coverSubtitle} coverMeta={coverMeta} fill />
    ) : (
      <PlatePage page={pages[p]} pages={pages} activeIndex={p} interactive={interactive} onJump={goTo} onNext={() => goTo(p + 1)} />
    );

  const mobileSheetOf = (p: number, interactive: boolean): ReactNode =>
    p < 0 ? (
      <Cover
        coverKicker={coverKicker}
        coverTitle={coverTitle}
        coverSubtitle={coverSubtitle}
        coverMeta={coverMeta}
        fill
        compact
      />
    ) : (
      <MobileSheet
        page={pages[p]}
        hasNext={p < total - 1}
        onTapNext={interactive ? () => step(1) : undefined}
      />
    );

  /* Drives one turn: eased progress 0→1 written directly to the DOM. */
  const apply = useCallback(
    (p: number) => {
      const t = turnRef.current;
      if (!t) return;
      const fwd = t.dir === 'fwd';
      let theta: number;
      let delta: number;
      if (spread) {
        theta = fwd ? -180 * p : 180 * p;
        delta = (fwd ? 1 : -1) * CURL_DEG * Math.sin(2 * Math.PI * p);
      } else {
        const pe = fwd ? p : 1 - p; // on phones the previous sheet swings back in
        theta = -180 * pe;
        delta = (CURL_DEG + 4) * Math.sin(2 * Math.PI * pe);
      }
      leafRef.current?.update(theta, delta);

      // Cast shadows on the pages under the leaf.
      const rise = 0.42 * Math.sin(Math.PI * Math.min(1, p)) * (1 - smooth(0.42, 0.62, p));
      const land = 0.42 * smooth(0.38, 0.72, p) * (1 - smooth(0.88, 1, p));
      const under = spread ? (fwd ? [land, rise] : [rise, land]) : [0, fwd ? rise : land];
      if (shadeLeftRef.current) shadeLeftRef.current.style.opacity = String(under[0]);
      if (shadeRightRef.current) shadeRightRef.current.style.opacity = String(under[1]);

      // Desktop cover opens and re-centres the spread.
      if (spread && t.kind === 'cover' && stageRef.current) {
        const closedness = t.to === -1 ? p : 1 - p;
        stageRef.current.style.transform = `translateX(${-25 * closedness}%)`;
        if (leftLayerRef.current) {
          leftLayerRef.current.style.opacity = String(t.to === -1 ? 1 - smooth(0.55, 0.95, p) : smooth(0, 0.4, p));
        }
      }
    },
    [spread]
  );

  const startTurn = useCallback(
    (to: number, kind?: Turn['kind']) => {
      if (turnRef.current || to === pos || to < -1 || to > total - 1) return;
      const dir: Turn['dir'] = to > pos ? 'fwd' : 'back';
      const k: Turn['kind'] = kind ?? (pos === -1 || to === -1 ? 'cover' : Math.abs(to - pos) > 1 ? 'jump' : 'page');

      if (prefersReduced) {
        setPos(to);
        return;
      }

      const t: Turn = { from: pos, to, dir, kind: k, manual: false };
      turnRef.current = t;
      setTurn(t);
    },
    [pos, total, prefersReduced]
  );

  // Auto-play timed page turn when not driven manually by live finger drag.
  useLayoutEffect(() => {
    if (!turn || turn.manual) return;
    apply(0);
    const desktopDuration = DURATION[turn.kind];
    const duration = spread
      ? desktopDuration
      : turn.kind === 'cover'
        ? 0.85
        : turn.kind === 'jump'
          ? 0.62
          : 0.72;
    const controls = animate(0, 1, {
      duration,
      ease: spread ? TURN_EASE : [0.22, 1, 0.36, 1],
      onUpdate: apply,
      onComplete: () => {
        apply(1);
        animRef.current = null;
        turnRef.current = null;
        setPos(turn.to);
        setTurn(null);
      },
    });
    animRef.current = controls;
    return () => {
      controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  // Apply initial drag progress immediately once the manual Turn mounts the Leaf.
  useLayoutEffect(() => {
    if (turn?.manual) {
      apply(lastDragProgressRef.current);
    }
  }, [turn, apply]);

  function goTo(index: number) {
    startTurn(index);
  }
  const step = (delta: 1 | -1) => startTurn(pos + delta);
  const isOpen = pos >= 0 || (turn !== null && turn.to >= 0);
  const folio = turn ? turn.to : pos;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  /* Interactive live finger-drag / swipe page peel via @use-gesture/react */
  const bindMobileDrag = useDrag(
    ({ first, last, active, movement: [mx], velocity: [vx], direction: [dxDir], memo }) => {
      if (spread || prefersReduced) return memo;

      if (first) {
        if (turnRef.current && !turnRef.current.manual) return { ignore: true };
        animRef.current?.stop();
        animRef.current = null;
        didDragRef.current = false;
        return { engaged: false, ignore: false };
      }

      if (memo?.ignore) return memo;

      if (!memo.engaged) {
        if (Math.abs(mx) < 4) return memo;
        const dir: Turn['dir'] = mx < 0 ? 'fwd' : 'back';
        const targetPos = dir === 'fwd' ? pos + 1 : pos - 1;
        if (targetPos < -1 || targetPos > total - 1) {
          return { ...memo, ignore: true };
        }
        memo.engaged = true;
        didDragRef.current = true;
        const kind: Turn['kind'] = pos === -1 || targetPos === -1 ? 'cover' : 'page';
        const manualTurn: Turn = { from: pos, to: targetPos, dir, kind, manual: true };
        turnRef.current = manualTurn;
        setTurn(manualTurn);
      }

      const activeTurn = turnRef.current;
      if (!activeTurn || !activeTurn.manual) return memo;

      const dragSpan = Math.max(140, (pageW || 320) * 0.65);
      const directionalDx = activeTurn.dir === 'fwd' ? -mx : mx;
      const p = Math.min(0.96, Math.max(0.02, directionalDx / dragSpan));
      lastDragProgressRef.current = p;
      apply(p);

      if (last || !active) {
        const flickCommit =
          activeTurn.dir === 'fwd' ? vx > 0.25 && dxDir < 0 : vx > 0.25 && dxDir > 0;
        const commit = p >= 0.2 || flickCommit;
        const targetEnd = commit ? 1 : 0;
        const rem = Math.abs(targetEnd - p);

        const controls = animate(p, targetEnd, {
          duration: Math.max(0.16, rem * 0.44),
          ease: [0.22, 1, 0.36, 1],
          onUpdate: apply,
          onComplete: () => {
            apply(targetEnd);
            animRef.current = null;
            turnRef.current = null;
            if (commit) {
              setPos(activeTurn.to);
            }
            setTurn(null);
          },
        });
        animRef.current = controls;
      }

      return memo;
    },
    {
      enabled: !spread && !prefersReduced,
      axis: 'x',
      filterTaps: true,
      threshold: 8,
      pointer: { touch: true },
    }
  );

  if (total === 0) return null;

  /* What sits under the leaf, and what the leaf carries. */
  const t = turn;
  const underLeft = t ? (t.dir === 'fwd' ? t.from : t.to) : pos;
  const underRight = t ? (t.dir === 'fwd' ? t.to : t.from) : pos;

  const restClosed = pos === -1 && !t;
  const stageStyle: React.CSSProperties = {
    transform: spread && restClosed ? 'translateX(-25%)' : undefined,
  };
  const perspectiveStyle: React.CSSProperties = {
    perspective: spread ? 2600 : 1850,
    perspectiveOrigin: spread ? '50% 38%' : '50% 42%',
  };

  const renderMobileBook = () => {
    const underMobilePos = t ? (t.dir === 'fwd' ? t.to : t.from) : pos;
    const leafFrontPos = t ? (t.dir === 'fwd' ? t.from : t.to) : pos;
    const leafBackIsCoverInside = t ? t.from === -1 || t.to === -1 : false;

    return (
      <div
        className="relative h-[396px] shadow-[0_22px_40px_-20px_rgba(7,17,31,0.52)]"
        style={perspectiveStyle}
      >
        {/* Base sheet (underneath during a turn, or resting top page) */}
        <div className="relative h-full w-full overflow-hidden">
          {underMobilePos < 0 && !t ? (
            <button
              type="button"
              onClick={() => startTurn(0, 'cover')}
              aria-label="Open the dossier"
              className="block w-full h-full text-left cursor-pointer"
            >
              <Cover
                coverKicker={coverKicker}
                coverTitle={coverTitle}
                coverSubtitle={coverSubtitle}
                coverMeta={coverMeta}
                fill
                compact
              />
            </button>
          ) : (
            mobileSheetOf(Math.max(0, underMobilePos), !t)
          )}
          {/* Cast shadow onto base sheet while leaf passes over */}
          <div
            ref={shadeRightRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-r from-[#07111F]/65 via-[#07111F]/22 to-transparent"
          />
        </div>

        {/* Real 3-strip curved turning 3D leaf on mobile */}
        {t && pageW > 0 && pageH > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: pageW,
              transformStyle: 'preserve-3d',
              pointerEvents: 'none',
            }}
          >
            <Leaf
              ref={leafRef}
              hinge="left"
              width={pageW}
              height={pageH}
              front={mobileSheetOf(leafFrontPos, false)}
              back={leafBackIsCoverInside ? <CoverInside /> : <PaperBack />}
            />
          </div>
        )}
      </div>
    );
  };

  const renderDesktopSpread = () => (
    <div className="relative grid grid-cols-2 shadow-[0_30px_60px_-28px_rgba(7,17,31,0.55)]" style={perspectiveStyle}>
      {/* Left page */}
      <div
        ref={leftLayerRef}
        className="relative min-h-[560px] border border-r-0 border-[#10243A]/20 dark:border-[#F4F8FC]/16 overflow-hidden bg-[#FBFDFF] dark:bg-[#10243A]"
        style={{ opacity: restClosed ? 0 : 1 }}
      >
        {leftOf(underLeft)}
        <div ref={shadeLeftRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-r from-black/20 via-black/10 to-black/55" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[repeating-linear-gradient(0deg,rgba(16,36,58,0.18)_0,rgba(16,36,58,0.18)_1px,transparent_1px,transparent_3px)]" />
      </div>
      {/* Right page */}
      <div className="relative min-h-[560px] border border-[#10243A]/20 dark:border-[#F4F8FC]/16 overflow-hidden">
        {rightOf(underRight, !t)}
        <div ref={shadeRightRef} aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 bg-gradient-to-r from-black/55 via-black/10 to-black/20" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-[repeating-linear-gradient(0deg,rgba(16,36,58,0.18)_0,rgba(16,36,58,0.18)_1px,transparent_1px,transparent_3px)]" />
      </div>

      {/* Spine gutter */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 z-20 bg-gradient-to-r from-transparent via-[#10243A]/22 to-transparent dark:via-black/55"
        style={{ opacity: restClosed ? 0 : 1 }}
      />

      {/* The turning leaf */}
      {t && pageW > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            [t.dir === 'fwd' ? 'left' : 'right']: '50%',
            width: pageW,
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
        >
          <Leaf
            ref={leafRef}
            hinge={t.dir === 'fwd' ? 'left' : 'right'}
            width={pageW}
            height={size.h}
            front={t.dir === 'fwd' ? rightOf(t.from, false) : leftOf(t.from)}
            back={t.dir === 'fwd' ? leftOf(t.to) : rightOf(t.to, false)}
          />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0.25, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'w-full max-w-[920px] mx-auto bg-[#F1F6FB]/75 dark:bg-[#0D1B2E] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-3.5 sm:p-8 overflow-x-clip',
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
        <div className="space-y-0.5 min-w-0">
          <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            Interactive Heritage Book
          </p>
          <p className="text-[11.5px] sm:text-xs text-[#465C72] dark:text-[#B5C5D7] truncate" aria-live="polite">
            {isOpen
              ? `Folio 0${Math.max(1, folio + 1)} of 0${total} · ${spread ? 'turn pages with controls or arrow keys' : 'swipe page left / right'}`
              : spread
                ? 'Select the cover to open the bound Berry Alloys chronicle'
                : 'Swipe left or tap cover to open'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isOpen ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={turning || pos <= 0}
                aria-label="Previous dossier folio"
                className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border border-[#10243A]/20 dark:border-[#F4F8FC]/20 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] disabled:opacity-40 hover:border-brand transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={turning || pos >= total - 1}
                aria-label="Next dossier folio"
                className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 border border-[#10243A]/20 dark:border-[#F4F8FC]/20 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] disabled:opacity-40 hover:border-brand transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => startTurn(-1, 'cover')}
                disabled={turning}
                className="inline-flex items-center gap-1 min-h-[32px] sm:min-h-[36px] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold border border-[#10243A]/20 dark:border-[#F4F8FC]/20 bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A] transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Close</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => startTurn(0, 'cover')}
              disabled={turning}
              className="inline-flex items-center gap-1.5 min-h-[36px] sm:min-h-[40px] px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A] transition-colors duration-300 cursor-pointer disabled:opacity-60"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Compact Mobile Chapter Tabs Strip (only when open on phone) */}
      {!spread && isOpen && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1">
          {pages.map((p, idx) => {
            const selected = idx === Math.max(0, folio);
            return (
              <button
                key={p.pageNumber}
                type="button"
                disabled={turning}
                onClick={() => goTo(idx)}
                className={cn(
                  'min-h-[32px] px-2.5 py-1 text-[10.5px] font-mono-tabular uppercase tracking-wider border whitespace-nowrap shrink-0 cursor-pointer transition-colors disabled:opacity-60',
                  selected
                    ? 'bg-[#10243A] text-[#FFFFFF] border-[#10243A] dark:bg-[#0A6AA1] dark:border-[#0A6AA1]'
                    : 'bg-white dark:bg-[#12243B] text-[#465C72] dark:text-[#B5C5D7] border-[#10243A]/14 dark:border-[#F4F8FC]/14'
                )}
              >
                0{p.pageNumber} · {p.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* Stage */}
      <div
        className={cn(spread ? 'pt-6' : 'pt-3')}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-label="Heritage book pages"
        aria-busy={turning}
      >
        <motion.div
          ref={(el) => {
            stageRef.current = el;
            frameRef.current = el;
          }}
          key={prefersReduced ? `rm-${pos}` : 'stage'}
          initial={prefersReduced ? { opacity: 0.4 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ ...stageStyle, touchAction: spread ? undefined : 'pan-y' }}
          {...(spread ? {} : bindMobileDrag())}
          onClickCapture={(e) => {
            if (didDragRef.current) {
              didDragRef.current = false;
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="relative"
        >
          {!spread ? (
            renderMobileBook()
          ) : restClosed && spread ? (
            <div className="relative grid grid-cols-2 min-h-[560px]">
              <div aria-hidden="true" />
              <button
                type="button"
                onClick={() => startTurn(0, 'cover')}
                aria-label="Open the dossier"
                className="block h-full text-left cursor-pointer shadow-[0_26px_50px_-22px_rgba(7,17,31,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
              >
                <Cover coverKicker={coverKicker} coverTitle={coverTitle} coverSubtitle={coverSubtitle} coverMeta={coverMeta} fill />
              </button>
            </div>
          ) : (
            renderDesktopSpread()
          )}
        </motion.div>

        {!spread && (
          <div className="pt-2.5 flex items-center justify-between text-[10.5px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
            <span>
              {isOpen ? 'Drag or swipe horizontally across sheet to turn' : 'Swipe left across cover to peel open'}
            </span>
            <span className="text-brand dark:text-[#69C5F5]">
              {isOpen ? `0${Math.max(1, folio + 1)} / 0${total}` : 'Cover'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default InteractiveBook;
