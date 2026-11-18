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
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
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

function NarrativePage({ page }: { page: InteractiveBookPage }) {
  return (
    <article className="h-full p-6 sm:p-8 flex flex-col justify-between gap-5 bg-[#FBFDFF] dark:bg-[#10243A]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono-tabular uppercase tracking-widest text-brand">
          <span>{page.kicker}</span>
          <span className="text-[#465C72] dark:text-[#B5C5D7]">Folio 0{page.pageNumber}</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
          {page.title}
        </h3>
        <div className="space-y-3 text-xs sm:text-sm text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed">
          {page.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      {page.metrics && page.metrics.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 pt-4 border-t border-[#10243A]/12 dark:border-[#F4F8FC]/12">
          {page.metrics.map((m) => (
            <div key={m.label}>
              <dt className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">{m.label}</dt>
              <dd className="font-display text-lg font-bold uppercase text-[#10243A] dark:text-[#F4F8FC]">{m.value}</dd>
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
}

function Cover({ coverKicker, coverTitle, coverSubtitle, coverMeta, fill }: CoverProps) {
  return (
    <div
      className={cn(
        'relative h-full min-h-[inherit] w-full overflow-hidden bg-[#10243A] text-[#F4F8FC] border border-[#69C5F5]/35 p-6 sm:p-8 group',
        fill ? '' : 'max-w-[380px] mx-auto'
      )}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#0B0C0E] via-[#262B32] to-transparent border-r border-[#F4F8FC]/10" />
      <span aria-hidden="true" className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand via-[#69C5F5] to-brand" />
      <div className="pl-3 h-full flex flex-col justify-between gap-6">
        <div className="flex items-center justify-between gap-2">
          <img src={OFFICIAL_BRAND_MARK_DARK} alt="Berry Alloys Limited emblem" className="h-7 w-auto object-contain" draggable={false} />
          <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#69C5F5]">2006–2026</span>
        </div>
        <div className="space-y-2 py-4 border-y border-[#F4F8FC]/14">
          <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#B5C5D7]">{coverKicker}</p>
          <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F4F8FC]">{coverTitle}</h3>
          <p className="text-xs text-[#F4F8FC]/78 leading-relaxed">{coverSubtitle}</p>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#B5C5D7]">
          <span>{coverMeta}</span>
          <span className="text-[#69C5F5]">Open Book →</span>
        </div>
      </div>
    </div>
  );
}

/** Blank paper: the reverse of a sheet that is turning away in single-page (phone) mode. */
function PaperBack() {
  return (
    <div className="h-full w-full bg-[#F4F8FC] dark:bg-[#0D1B2E] bg-[repeating-linear-gradient(0deg,transparent_0,transparent_27px,rgba(16,36,58,0.05)_28px)]" />
  );
}

/* ------------------------------ Book ------------------------------ */

interface Turn {
  from: number; // -1 = closed cover
  to: number;
  dir: 'fwd' | 'back';
  kind: 'cover' | 'page' | 'jump';
}

/**
 * InteractiveBook — a corporate heritage dossier with a genuine page-turn: a slow (about 1.6 s), curved leaf that hinges
 * on the spine, a cover that opens and re-centres the book, and soft shading. Spread layout on tablets and up; a
 * single turning sheet on phones. Under reduced motion pages change with a short cross-fade instead.
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

  /* Content for each side of a given position. */
  const leftOf = (p: number): ReactNode =>
    p < 0 ? null : <NarrativePage page={pages[p]} />;
  const rightOf = (p: number, interactive: boolean): ReactNode =>
    p < 0 ? (
      <Cover coverKicker={coverKicker} coverTitle={coverTitle} coverSubtitle={coverSubtitle} coverMeta={coverMeta} fill />
    ) : (
      <PlatePage page={pages[p]} pages={pages} activeIndex={p} interactive={interactive} onJump={goTo} onNext={() => goTo(p + 1)} />
    );
  const sheetOf = (p: number, interactive: boolean): ReactNode =>
    p < 0 ? (
      <Cover coverKicker={coverKicker} coverTitle={coverTitle} coverSubtitle={coverSubtitle} coverMeta={coverMeta} fill />
    ) : (
      <div className="flex flex-col bg-[#FBFDFF] dark:bg-[#10243A]">
        <NarrativePage page={pages[p]} />
        <PlatePage page={pages[p]} pages={pages} activeIndex={p} interactive={interactive} onJump={goTo} onNext={() => goTo(p + 1)} />
      </div>
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
        delta = CURL_DEG * Math.sin(2 * Math.PI * pe);
      }
      leafRef.current?.update(theta, delta);

      // Cast shadows on the pages under the leaf.
      const rise = 0.42 * Math.sin(Math.PI * Math.min(1, p)) * (1 - smooth(0.42, 0.62, p));
      const land = 0.42 * smooth(0.38, 0.72, p) * (1 - smooth(0.88, 1, p));
      const under = spread ? (fwd ? [land, rise] : [rise, land]) : [0, rise];
      if (shadeLeftRef.current) shadeLeftRef.current.style.opacity = String(under[0]);
      if (shadeRightRef.current) shadeRightRef.current.style.opacity = String(under[1]);

      // The closed book sits centred; opening/closing slides it across the table as the cover swings.
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

  const [turnDir, setTurnDir] = useState<'fwd' | 'back'>('fwd');

  const startTurn = useCallback(
    (to: number, kind?: Turn['kind']) => {
      if (turnRef.current || to === pos || to < -1 || to > total - 1) return;
      const dir: Turn['dir'] = to > pos ? 'fwd' : 'back';
      const k: Turn['kind'] = kind ?? (pos === -1 || to === -1 ? 'cover' : Math.abs(to - pos) > 1 ? 'jump' : 'page');
      setTurnDir(dir);

      // Mobile (!spread) uses a crisp directional 3D spine-hinge card flip in renderStatic; reduced motion swaps immediately
      if (prefersReduced || !spread) {
        setPos(to);
        return;
      }
      const t: Turn = { from: pos, to, dir, kind: k };
      turnRef.current = t;
      setTurn(t);
    },
    [pos, spread, total, prefersReduced]
  );

  // Once the leaf is mounted, run the animation.
  useLayoutEffect(() => {
    if (!turn) return;
    apply(0);
    const duration = DURATION[turn.kind];
    const controls = animate(0, 1, {
      duration,
      ease: TURN_EASE,
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

  if (total === 0) return null;

  /* What sits under the leaf, and what the leaf carries. */
  const t = turn;
  const underLeft = t ? (t.dir === 'fwd' ? t.from : t.to) : pos;
  const underRight = t ? (t.dir === 'fwd' ? t.to : t.from) : pos;

  const restClosed = pos === -1 && !t;
  const stageStyle: React.CSSProperties = {
    transform: spread && restClosed ? 'translateX(-25%)' : undefined,
  };
  // Perspective must sit on the element whose child is the 3D leaf.
  const perspectiveStyle: React.CSSProperties = { perspective: spread ? 2600 : 2200, perspectiveOrigin: '50% 38%' };

  const renderStatic = () => {
    if (!spread) {
      const currentPage = pages[Math.max(0, pos)] ?? pages[0];
      const enterRotateY = turnDir === 'fwd' ? 18 : -18;
      const exitRotateY = turnDir === 'fwd' ? -18 : 18;
      return (
        <div style={{ perspective: '1600px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-folio-${currentPage.pageNumber}`}
              initial={
                prefersReduced
                  ? false
                  : { opacity: 0.2, x: turnDir === 'fwd' ? 28 : -28, rotateY: enterRotateY, scale: 0.97 }
              }
              animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
              exit={
                prefersReduced
                  ? undefined
                  : { opacity: 0.15, x: turnDir === 'fwd' ? -28 : 28, rotateY: exitRotateY, scale: 0.97 }
              }
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              className="border border-[#10243A]/20 dark:border-[#F4F8FC]/16 bg-[#FBFDFF] dark:bg-[#10243A] shadow-lg overflow-hidden"
            >
              {/* Compact Chapter Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-3 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 bg-[#F1F6FB] dark:bg-[#0D1B2E]">
                {pages.map((p, idx) => {
                  const selected = idx === pos;
                  return (
                    <button
                      key={p.pageNumber}
                      type="button"
                      onClick={() => goTo(idx)}
                      className={cn(
                        'min-h-[38px] px-3 py-1.5 text-[11px] font-mono-tabular uppercase tracking-wider border whitespace-nowrap shrink-0 cursor-pointer transition-colors',
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

              {currentPage.image && (
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#10243A]">
                  <img
                    src={currentPage.image}
                    alt={currentPage.imageAlt ?? currentPage.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              )}

              <NarrativePage page={currentPage} />
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    return (
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
  };

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0.25, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'w-full max-w-[920px] mx-auto bg-[#F1F6FB]/75 dark:bg-[#0D1B2E] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-5 sm:p-8 overflow-hidden',
        className
      )}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
        <div className="space-y-0.5">
          <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-brand">Interactive Heritage Book</p>
          <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]" aria-live="polite">
            {isOpen
              ? `Reading Folio 0${folio + 1} of 0${total} — turn pages with the controls or arrow keys`
              : 'Select the cover to open the bound Berry Alloys Limited chronicle'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={turning || pos <= 0}
                aria-label="Previous dossier folio"
                className="inline-flex items-center justify-center w-9 h-9 border border-[#10243A]/20 dark:border-[#F4F8FC]/20 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] disabled:opacity-40 hover:border-brand transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={turning || pos >= total - 1}
                aria-label="Next dossier folio"
                className="inline-flex items-center justify-center w-9 h-9 border border-[#10243A]/20 dark:border-[#F4F8FC]/20 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] disabled:opacity-40 hover:border-brand transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => startTurn(-1, 'cover')}
                disabled={turning}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs font-semibold border border-[#10243A]/20 dark:border-[#F4F8FC]/20 bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A] transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Close Cover</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => startTurn(0, 'cover')}
              disabled={turning}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#10243A] text-[#FFFFFF] hover:bg-brand dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A] transition-colors duration-300 cursor-pointer disabled:opacity-60"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Stage */}
      <div className="pt-6" onKeyDown={onKeyDown} tabIndex={0} role="group" aria-label="Heritage book pages" aria-busy={turning}>
        <motion.div
          ref={(el) => {
            stageRef.current = el;
            frameRef.current = el;
          }}
          key={prefersReduced ? `rm-${pos}` : 'stage'}
          initial={prefersReduced ? { opacity: 0.4 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={stageStyle}
          className="relative"
        >
          {restClosed && !spread ? (
            <motion.button
              type="button"
              whileTap={prefersReduced ? undefined : { scale: 0.985, rotateY: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => startTurn(0, 'cover')}
              aria-label="Open the dossier"
              className="block w-full min-h-[440px] text-left cursor-pointer shadow-2xl"
              style={{ transformOrigin: 'left center', perspective: '1400px' }}
            >
              <Cover coverKicker={coverKicker} coverTitle={coverTitle} coverSubtitle={coverSubtitle} coverMeta={coverMeta} fill />
            </motion.button>
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
            renderStatic()
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default InteractiveBook;
