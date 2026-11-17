import {
  FormEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Grid,
  GripVertical,
  Pin,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { KNOWLEDGE_BASE, KNOWLEDGE_CATEGORIES } from '../data/knowledgeBase';
import { useGuide } from '../context/GuideContext';

const MAX_INPUT_LENGTH = 360;
const LAUNCHER_PREF_KEY = 'berry-compass-launcher-v1';

function isCompactViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 639px), (pointer: coarse)').matches;
}
const EDGE_SNAP_THRESHOLD = 22;
const TOP_SAFE_MARGIN = 76;
const BOTTOM_SAFE_MARGIN = 16;

type DockEdge = 'right' | 'left' | null;

interface LauncherState {
  docked: DockEdge;
  /** Viewport X ratio (0..1) within usable horizontal travel when floating */
  xRatio: number;
  /** Viewport Y ratio (0..1) within usable vertical travel [TOP_SAFE_MARGIN .. innerHeight - h - BOTTOM_SAFE_MARGIN] */
  yRatio: number;
}

function loadLauncherState(): LauncherState {
  try {
    const raw =
      window.localStorage.getItem(LAUNCHER_PREF_KEY) ??
      window.localStorage.getItem('berry-guide-launcher-v1');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LauncherState>;
      const docked: DockEdge =
        parsed.docked === 'right' || parsed.docked === 'left' ? parsed.docked : null;
      const xRatio =
        typeof parsed.xRatio === 'number' && Number.isFinite(parsed.xRatio)
          ? Math.min(1, Math.max(0, parsed.xRatio))
          : 1;
      const yRatio =
        typeof parsed.yRatio === 'number' && Number.isFinite(parsed.yRatio)
          ? Math.min(1, Math.max(0, parsed.yRatio))
          : 0.94;
      return { docked, xRatio, yRatio };
    }
  } catch {
    // Ignore storage read errors
  }
  return { docked: null, xRatio: 1, yRatio: 0.94 };
}

function clamp(val: number, min: number, max: number): number {
  if (max <= min) return min;
  return Math.min(max, Math.max(min, val));
}

export function BerryAlloysGuide() {
  const prefersReduced = useReducedMotion();
  const {
    isOpen,
    isPreparing,
    messages,
    preparingAnnouncement,
    latestAnnouncement,
    launcherRef,
    openGuide,
    closeGuide,
    resetConversation,
    sendMessage,
    selectSuggestion,
    executeAction,
  } = useGuide();

  const [draft, setDraft] = useState('');
  const [inputNotice, setInputNotice] = useState<string | null>(null);
  const [topicBrowserOpen, setTopicBrowserOpen] = useState(false);
  const [hasUnseenMessage, setHasUnseenMessage] = useState(false);

  // Draggable & edge-hidable launcher state
  const [launcherPref, setLauncherPref] = useState<LauncherState>(loadLauncherState);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapPreviewEdge, setSnapPreviewEdge] = useState<DockEdge>(null);
  const [isPeekRevealed, setIsPeekRevealed] = useState(false);
  const [isFocusWithinLauncher, setIsFocusWithinLauncher] = useState(false);

  const launcherDockRef = useRef<HTMLDivElement>(null);
  const justDraggedRef = useRef(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevMsgCountRef = useRef(messages.length);

  // Persist launcher dock/position preference
  useEffect(() => {
    try {
      window.localStorage.setItem(LAUNCHER_PREF_KEY, JSON.stringify(launcherPref));
    } catch {
      // Ignore storage write errors
    }
  }, [launcherPref]);

  // Resolve pixel coordinates from ratios cleanly on mount, resize, or dialog close
  const syncCoordsFromPref = useCallback(
    (pref: LauncherState) => {
      const el = launcherDockRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = el?.offsetWidth || 168;
      const height = el?.offsetHeight || 46;
      const sideMargin = vw < 640 ? 16 : 24;

      const minLeft = sideMargin;
      const maxLeft = Math.max(minLeft, vw - width - sideMargin);
      const minTop = TOP_SAFE_MARGIN;
      const maxTop = Math.max(minTop, vh - height - BOTTOM_SAFE_MARGIN);

      const dockedEdge = isCompactViewport() ? null : pref.docked;
      let resolvedLeft: number;
      if (dockedEdge === 'right') {
        resolvedLeft = vw - width;
      } else if (dockedEdge === 'left') {
        resolvedLeft = 0;
      } else {
        resolvedLeft = minLeft + pref.xRatio * (maxLeft - minLeft);
      }

      // Default initial bottom resting height sits cleanly near the bottom-right corner below ChapterRail
      const resolvedTop =
        pref.yRatio === 0.94 && !pref.docked && pref.xRatio === 1
          ? clamp(vh - height - (vw < 640 ? 24 : 32), minTop, maxTop)
          : minTop + pref.yRatio * (maxTop - minTop);

      setCoords({
        left: Math.round(resolvedLeft),
        top: Math.round(clamp(resolvedTop, minTop, maxTop)),
      });
    },
    []
  );

  useEffect(() => {
    if (isOpen || isDragging) return;
    const raf = window.requestAnimationFrame(() => syncCoordsFromPref(launcherPref));
    const onResize = () => syncCoordsFromPref(launcherPref);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen, isDragging, launcherPref, syncCoordsFromPref]);

  // Collapse peek-revealed launcher back to edge if user taps outside (helpful on touch screens)
  useEffect(() => {
    if (!launcherPref.docked || !isPeekRevealed || isDragging) return;
    const onOutsidePointerDown = (e: PointerEvent) => {
      if (!launcherDockRef.current?.contains(e.target as Node)) {
        setIsPeekRevealed(false);
      }
    };
    document.addEventListener('pointerdown', onOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', onOutsidePointerDown);
  }, [launcherPref.docked, isPeekRevealed, isDragging]);

  const handleLauncherPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    // Let secondary Dock/Undock button handle its own click without dragging
    if ((e.target as HTMLElement).closest('[data-launcher-dock-btn="true"]')) {
      return;
    }

    const dockEl = launcherDockRef.current;
    if (!dockEl) return;

    const rect = dockEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const originLeft = rect.left;
    const originTop = rect.top;
    const width = rect.width;
    const height = rect.height;

    let movedBeyondThreshold = false;
    let latestLeft = clamp(originLeft, 0, Math.max(0, window.innerWidth - width));
    let latestTop = originTop;
    let latestSnap: DockEdge = null;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (!movedBeyondThreshold && Math.hypot(dx, dy) < 6) {
        return;
      }

      if (!movedBeyondThreshold) {
        movedBeyondThreshold = true;
        setIsDragging(true);
        setIsPeekRevealed(true);
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      latestLeft = clamp(originLeft + dx, 0, Math.max(0, vw - width));
      latestTop = clamp(
        originTop + dy,
        TOP_SAFE_MARGIN,
        Math.max(TOP_SAFE_MARGIN, vh - height - BOTTOM_SAFE_MARGIN)
      );

      if (latestLeft >= vw - width - EDGE_SNAP_THRESHOLD) {
        latestSnap = 'right';
      } else if (latestLeft <= EDGE_SNAP_THRESHOLD) {
        latestSnap = 'left';
      } else {
        latestSnap = null;
      }

      setSnapPreviewEdge(latestSnap);
      setCoords({ left: Math.round(latestLeft), top: Math.round(latestTop) });
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    const onPointerUp = () => {
      cleanup();
      if (!movedBeyondThreshold) return;

      justDraggedRef.current = true;
      window.setTimeout(() => {
        justDraggedRef.current = false;
      }, 80);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sideMargin = vw < 640 ? 16 : 24;
      const minLeft = sideMargin;
      const maxLeft = Math.max(minLeft, vw - width - sideMargin);
      const minTop = TOP_SAFE_MARGIN;
      const maxTop = Math.max(minTop, vh - height - BOTTOM_SAFE_MARGIN);

      const nextYRatio = maxTop > minTop ? (latestTop - minTop) / (maxTop - minTop) : 0.85;
      const nextXRatio =
        maxLeft > minLeft ? clamp((latestLeft - minLeft) / (maxLeft - minLeft), 0, 1) : 1;

      setIsDragging(false);
      setSnapPreviewEdge(null);

      if (latestSnap) {
        setIsPeekRevealed(false);
        setIsFocusWithinLauncher(false);
        setLauncherPref({
          docked: latestSnap,
          xRatio: latestSnap === 'right' ? 1 : 0,
          yRatio: clamp(nextYRatio, 0, 1),
        });
      } else {
        setIsPeekRevealed(false);
        setLauncherPref({
          docked: null,
          xRatio: nextXRatio,
          yRatio: clamp(nextYRatio, 0, 1),
        });
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleHideToNearestEdge = () => {
    const el = launcherDockRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = el?.getBoundingClientRect();
    const minTop = TOP_SAFE_MARGIN;
    const maxTop = Math.max(minTop, vh - (rect?.height || 46) - BOTTOM_SAFE_MARGIN);
    const currentTop = rect ? rect.top : maxTop;
    const yRatio = maxTop > minTop ? clamp((currentTop - minTop) / (maxTop - minTop), 0, 1) : 0.85;
    const centerX = rect ? rect.left + rect.width / 2 : vw;
    const targetEdge: DockEdge = centerX < vw / 2 ? 'left' : 'right';

    setIsPeekRevealed(false);
    setIsFocusWithinLauncher(false);
    setLauncherPref({
      docked: targetEdge,
      xRatio: targetEdge === 'right' ? 1 : 0,
      yRatio,
    });
  };

  const handleUnpinToCanvas = () => {
    const isCurrentlyLeft = launcherPref.docked === 'left';
    setIsPeekRevealed(false);
    setLauncherPref((prev) => ({
      docked: null,
      xRatio: isCurrentlyLeft ? 0 : 1,
      yRatio: prev.yRatio,
    }));
  };

  // Track the visual viewport so the panel shrinks above the software keyboard on phones.
  const [visualHeight, setVisualHeight] = useState<number | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setVisualHeight(Math.round(vv.height));
    update();
    vv.addEventListener('resize', update);
    return () => {
      vv.removeEventListener('resize', update);
      setVisualHeight(null);
    };
  }, [isOpen]);

  // Body scroll lock & Escape / Focus Trap inside modal dialog
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeGuide();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeGuide]);

  // Smart scroll: keep bottom visible when new messages arrive or preparation bubble opens
  useEffect(() => {
    if (!isOpen) {
      prevMsgCountRef.current = messages.length;
      return;
    }

    if (messages.length > prevMsgCountRef.current || isPreparing) {
      const el = scrollContainerRef.current;
      if (el) {
        if (isNearBottomRef.current) {
          window.requestAnimationFrame(() => {
            el.scrollTo({
              top: el.scrollHeight,
              behavior: prefersReduced ? 'auto' : 'smooth',
            });
          });
          setHasUnseenMessage(false);
        } else if (messages.length > prevMsgCountRef.current) {
          setHasUnseenMessage(true);
        }
      }
    }
    prevMsgCountRef.current = messages.length;
  }, [messages.length, isOpen, isPreparing, prefersReduced]);

  const handleScrollStream = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 72;
    isNearBottomRef.current = nearBottom;
    if (nearBottom) {
      setHasUnseenMessage(false);
    }
  };

  const scrollToLatest = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
    isNearBottomRef.current = true;
    setHasUnseenMessage(false);
  };

  const submitDraft = () => {
    if (isPreparing) {
      setInputNotice('One moment — Berry Compass is still preparing the previous answer.');
      return;
    }
    const trimmed = draft.trim();
    if (!trimmed) {
      setInputNotice('Type a question or pick one of the topic buttons above.');
      return;
    }
    if (trimmed.length > MAX_INPUT_LENGTH) {
      setInputNotice(`Please keep questions under ${MAX_INPUT_LENGTH} characters.`);
      return;
    }
    setInputNotice(null);
    setTopicBrowserOpen(false);
    isNearBottomRef.current = true;
    sendMessage(trimmed);
    setDraft('');
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitDraft();
  };

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitDraft();
    }
  };

  return (
    <>
      {/* Draggable & Edge-Hidable Architectural Launcher (Hidden while modal open) */}
      {!isOpen && (() => {
        // On phones and touch devices the launcher always stays fully visible (no edge-hiding).
        const isDocked = launcherPref.docked !== null && !isCompactViewport();
        const isDockedLeft = launcherPref.docked === 'left';
        const isLeftHalf = isDocked ? isDockedLeft : launcherPref.xRatio < 0.5;
        const isRevealed = !isDocked || isPeekRevealed || isFocusWithinLauncher || isDragging;
        const isTucked = isDocked && !isRevealed;

        const tuckTransformClass = isTucked
          ? isDockedLeft
            ? '-translate-x-[calc(100%-22px)]'
            : 'translate-x-[calc(100%-22px)]'
          : 'translate-x-0';

        const transitionClass =
          isDragging || prefersReduced
            ? ''
            : 'transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]';

        return (
          <div
            ref={launcherDockRef}
            onPointerDown={handleLauncherPointerDown}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse' && isDocked) {
                setIsPeekRevealed(true);
              }
            }}
            onPointerMove={(e) => {
              if (e.pointerType === 'mouse' && isDocked && !isDragging && !isPeekRevealed) {
                setIsPeekRevealed(true);
              }
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === 'mouse' && isDocked && !isDragging) {
                setIsPeekRevealed(false);
              }
            }}
            onFocus={() => {
              if (isDocked) setIsFocusWithinLauncher(true);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setIsFocusWithinLauncher(false);
              }
            }}
            style={
              coords
                ? { left: `${coords.left}px`, top: `${coords.top}px`, touchAction: 'none' }
                : { touchAction: 'none' }
            }
            className={`fixed z-40 flex items-stretch shadow-xl select-none ${
              coords ? '' : 'bottom-[24px] sm:bottom-[32px] right-4 sm:right-6'
            } ${isDockedLeft ? 'flex-row-reverse' : 'flex-row'} ${tuckTransformClass} ${transitionClass}`}
          >
            {/* Invisible proximity hover halo when tucked at edge so moving cursor near edge slides it smoothly out */}
            {isDocked && (
              <span
                aria-hidden="true"
                className={`absolute inset-y-[-10px] w-7 pointer-events-auto ${
                  isDockedLeft ? '-right-7' : '-left-7'
                }`}
              />
            )}

            {/* Drag Snap Edge Hint */}
            {isDragging && snapPreviewEdge && (
              <span
                role="status"
                className={`pointer-events-none absolute -top-7 px-2 py-0.5 text-[10px] font-mono-tabular uppercase tracking-wider whitespace-nowrap bg-[#10243A] text-[#69C5F5] border border-[#69C5F5]/45 shadow-md ${
                  snapPreviewEdge === 'right' ? 'right-0' : 'left-0'
                }`}
              >
                Release to hide at {snapPreviewEdge} edge
              </span>
            )}

            {/* Primary Berry Compass Launcher */}
            <button
              ref={launcherRef}
              type="button"
              onClick={(e) => {
                if (justDraggedRef.current) {
                  e.preventDefault();
                  return;
                }
                if (isTucked) {
                  setIsPeekRevealed(true);
                  return;
                }
                setIsPeekRevealed(false);
                openGuide();
              }}
              aria-label={
                isTucked
                  ? 'Reveal hidden Berry Compass launcher'
                  : 'Open Berry Compass for products, specifications and enquiries (drag to move)'
              }
              title={
                isTucked
                  ? 'Hover or tap to reveal Berry Compass'
                  : 'Open Berry Compass · Drag to reposition'
              }
              className={`group relative inline-flex items-center gap-2 min-h-[46px] pr-3 pl-2.5 py-2.5 bg-[#10243A] text-[#FFFFFF] border border-[#10243A] hover:bg-brand hover:border-brand dark:bg-[#12243B] dark:text-[#F4F8FC] dark:border-[#69C5F5]/45 dark:hover:bg-[#0A6AA1] dark:hover:border-[#69C5F5] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#69C5F5] focus-visible:outline-offset-2 ${
                isDragging ? 'cursor-grabbing ring-2 ring-[#69C5F5]' : 'cursor-grab'
              } ${isDockedLeft ? 'flex-row-reverse pl-3 pr-2.5' : ''}`}
            >
              {/* Exposed Edge Peek Sliver Indicator (always visible 22px strip when docked) */}
              <span
                aria-hidden="true"
                className={`inline-flex items-center justify-center shrink-0 ${
                  isTucked
                    ? 'text-[#69C5F5]'
                    : 'text-[#B5C5D7] group-hover:text-[#FFFFFF]'
                }`}
              >
                {isTucked ? (
                  isDockedLeft ? (
                    <ChevronRight className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )
                ) : (
                  <GripVertical className="w-3.5 h-3.5" />
                )}
              </span>

              {/* Thin copper architectural edge line visible even at edge sliver */}
              {isTucked && (
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 w-[3px] bg-[#69C5F5] ${
                    isDockedLeft ? 'right-0' : 'left-0'
                  }`}
                />
              )}

              <Compass
                className="w-4 h-4 text-[#69C5F5] group-hover:text-[#FFFFFF] shrink-0 transition-colors"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                Berry Compass
              </span>
            </button>

            {/* Compact Dock / Pin Toggle Button */}
            <button
              type="button"
              data-launcher-dock-btn="true"
              style={isCompactViewport() ? { display: 'none' } : undefined}
              onClick={() => (isDocked ? handleUnpinToCanvas() : handleHideToNearestEdge())}
              aria-label={
                isDocked
                  ? 'Pin Berry Compass back onto page'
                  : 'Hide Berry Compass to nearest screen edge'
              }
              title={isDocked ? 'Keep visible on page' : 'Hide to screen edge'}
              className={`inline-flex items-center justify-center min-w-[34px] min-h-[46px] px-2 bg-[#1E2228] text-[#B5C5D7] hover:text-[#FFFFFF] hover:bg-[#29435F] border-y ${
                isDockedLeft ? 'border-l' : 'border-r'
              } border-[#10243A] dark:bg-[#0D1B2E] dark:border-[#69C5F5]/45 dark:hover:bg-[#29435F] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#69C5F5] focus-visible:outline-offset-[-2px]`}
            >
              {isDocked ? (
                <Pin className="w-3.5 h-3.5 text-[#69C5F5]" aria-hidden="true" />
              ) : isLeftHalf ? (
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        );
      })()}

      {/* Modal Guide Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeGuide();
              }
            }}
            className="fixed inset-0 z-50 bg-[#10243A]/50 backdrop-blur-[1px] flex items-end sm:items-end justify-end sm:p-6"
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="berry-guide-title"
              aria-describedby="berry-guide-disclosure"
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: 8 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              style={{ '--guide-vh': visualHeight ? `${visualHeight}px` : '100dvh' } as React.CSSProperties}
              className="w-full h-[var(--guide-vh)] sm:h-[min(660px,calc(100dvh-3rem))] sm:w-[420px] sm:max-w-[calc(100vw-3rem)] bg-[#FFFFFF] dark:bg-[#10243A] text-[#10243A] dark:text-[#F4F8FC] border-t sm:border border-[#10243A]/20 dark:border-[#F4F8FC]/20 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="shrink-0 px-4 sm:px-5 py-3.5 bg-[#10243A] text-[#F4F8FC] border-b border-[#F4F8FC]/14 flex items-start justify-between gap-3 pt-[max(0.875rem,env(safe-area-inset-top))]">
                <div className="min-w-0 space-y-1">
                  <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                    Automated product assistant · Answers from prepared company information.
                  </p>
                  <h2
                    id="berry-guide-title"
                    className="font-display text-xl font-bold uppercase tracking-tight text-[#F4F8FC]"
                  >
                    Berry Compass
                  </h2>
                  <p
                    id="berry-guide-disclosure"
                    className="text-[11px] text-[#B5C5D7] leading-snug"
                  >
                    Products, specifications and enquiries.
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setTopicBrowserOpen(false);
                      setInputNotice(null);
                      resetConversation();
                    }}
                    aria-label="Reset conversation"
                    title="Reset conversation"
                    className="inline-flex items-center justify-center w-10 h-10 text-[#B5C5D7] hover:text-[#F4F8FC] hover:bg-[#12243B] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={closeGuide}
                    aria-label="Close Berry Compass"
                    title="Close (Esc)"
                    className="inline-flex items-center justify-center w-10 h-10 text-[#F4F8FC] hover:text-[#69C5F5] hover:bg-[#12243B] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Polite Screen-Reader Statuses: announced once on preparation and once on final reply */}
              <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {preparingAnnouncement}
              </div>
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {latestAnnouncement}
              </div>

              {/* Scrollable Conversation Area */}
              <div className="relative flex-1 min-h-0 flex flex-col">
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScrollStream}
                  className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4"
                >
                  {topicBrowserOpen ? (
                    <div className="space-y-4 pb-2">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12">
                        <div>
                          <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5] font-semibold">
                            Browse All Prepared Topics
                          </p>
                          <p className="text-xs text-[#465C72] dark:text-[#B5C5D7]">
                            Select any question below to view the full answer in chat.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTopicBrowserOpen(false)}
                          className="min-h-[36px] px-3 py-1 text-xs font-semibold border border-[#10243A]/20 dark:border-[#F4F8FC]/20 hover:border-brand dark:hover:border-[#69C5F5] transition-colors cursor-pointer shrink-0"
                        >
                          Back to Chat
                        </button>
                      </div>

                      {KNOWLEDGE_CATEGORIES.map((category) => {
                        const entries = KNOWLEDGE_BASE.filter(
                          (e) => e.category === category
                        );
                        if (entries.length === 0) return null;
                        return (
                          <div key={category} className="space-y-1.5">
                            <h3 className="text-[11px] font-mono-tabular uppercase tracking-wider font-semibold text-[#465C72] dark:text-[#B5C5D7]">
                              {category}
                            </h3>
                            <div className="space-y-1.5">
                              {entries.map((entry) => (
                                <button
                                  key={entry.id}
                                  type="button"
                                  onClick={() => {
                                    setTopicBrowserOpen(false);
                                    isNearBottomRef.current = true;
                                    selectSuggestion({
                                      label: entry.question,
                                      entryId: entry.id,
                                    });
                                  }}
                                  className="w-full text-left px-3 py-2.5 min-h-[40px] text-xs font-medium bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 hover:border-brand dark:hover:border-[#69C5F5] text-[#10243A] dark:text-[#F4F8FC] transition-colors cursor-pointer flex items-center justify-between gap-2"
                                >
                                  <span>{entry.question}</span>
                                  <ArrowRight
                                    className="w-3.5 h-3.5 text-brand dark:text-[#69C5F5] shrink-0"
                                    aria-hidden="true"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, idx) => {
                        const isLatestGuide =
                          msg.sender === 'guide' && idx === messages.length - 1;
                        const payload = msg.payload;
                        const shouldAnimateIn = !prefersReduced && msg.id !== 'msg-welcome';

                        if (msg.sender === 'user') {
                          return (
                            <motion.div
                              key={msg.id}
                              initial={shouldAnimateIn ? { opacity: 0, y: 8 } : false}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                              className="flex justify-end"
                            >
                              <div className="max-w-[85%] bg-[#10243A] text-[#FFFFFF] dark:bg-[#0A6AA1] dark:text-[#F4F8FC] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed">
                                {msg.text}
                              </div>
                            </motion.div>
                          );
                        }

                        return (
                          <motion.div
                            key={msg.id}
                            initial={shouldAnimateIn ? { opacity: 0, y: 8 } : false}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-2.5"
                          >
                            <div className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-3.5 sm:p-4 space-y-2.5">
                              {payload?.title && (
                                <h3 className="font-display text-base font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                                  {payload.title}
                                </h3>
                              )}

                              <p className="text-xs sm:text-sm text-[#10243A] dark:text-[#F4F8FC]/90 leading-relaxed">
                                {msg.text}
                              </p>

                              {payload?.specHighlights &&
                                payload.specHighlights.length > 0 && (
                                  <dl className="grid grid-cols-2 gap-2 pt-2 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 text-[11px]">
                                    {payload.specHighlights.map((spec) => (
                                      <div
                                        key={spec.label}
                                        className="bg-[#FFFFFF] dark:bg-[#10243A] px-2.5 py-1.5"
                                      >
                                        <dt className="text-[#465C72] dark:text-[#B5C5D7] truncate">
                                          {spec.label}
                                        </dt>
                                        <dd className="font-mono-tabular font-semibold text-[#10243A] dark:text-[#F4F8FC] mt-0.5">
                                          {spec.value}
                                        </dd>
                                      </div>
                                    ))}
                                  </dl>
                                )}

                              {payload?.detailNote && (
                                <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                                  {payload.detailNote}
                                </p>
                              )}

                              {payload?.checklist && payload.checklist.length > 0 && (
                                <ul className="space-y-1 text-xs text-[#10243A] dark:text-[#F4F8FC]/88 pt-1">
                                  {payload.checklist.map((item) => (
                                    <li
                                      key={item}
                                      className="flex items-start gap-2"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="font-mono-tabular text-brand dark:text-[#69C5F5] font-bold"
                                      >
                                        ·
                                      </span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {payload?.actions && payload.actions.length > 0 && (
                                <div className="pt-2 flex flex-wrap gap-2">
                                  {payload.actions.map((action) => (
                                    <button
                                      key={`${action.label}-${action.to}`}
                                      type="button"
                                      onClick={() => executeAction(action)}
                                      className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer text-left ${
                                        action.variant === 'primary'
                                          ? 'bg-brand text-[#FFFFFF] hover:bg-brand-hover dark:bg-[#0A6AA1] dark:hover:bg-[#69C5F5] dark:hover:text-[#10243A]'
                                          : 'bg-[#F1F6FB] text-[#10243A] hover:bg-[#D4DFEB] dark:bg-[#10243A] dark:text-[#F4F8FC] dark:border dark:border-[#F4F8FC]/20 dark:hover:border-[#69C5F5]'
                                      }`}
                                    >
                                      <span>{action.label}</span>
                                      <ArrowRight
                                        className="w-3.5 h-3.5 shrink-0"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Contextual Follow-Up & Starter Question Buttons (Latest Guide Turn) */}
                            {!isPreparing &&
                              isLatestGuide &&
                              payload?.followUps &&
                              payload.followUps.length > 0 && (
                                <motion.div
                                  initial={
                                    shouldAnimateIn ? { opacity: 0, y: 6 } : false
                                  }
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.16,
                                    delay: shouldAnimateIn ? 0.06 : 0,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  className="space-y-1.5 pt-0.5"
                                >
                                  <p className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#465C72] dark:text-[#B5C5D7]">
                                    Suggested next
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {payload.followUps.map((chip, chipIdx) => (
                                      <motion.button
                                        key={chip.label}
                                        type="button"
                                        initial={
                                          shouldAnimateIn
                                            ? { opacity: 0, y: 4 }
                                            : false
                                        }
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          duration: 0.14,
                                          delay: shouldAnimateIn
                                            ? 0.08 + chipIdx * 0.035
                                            : 0,
                                          ease: [0.16, 1, 0.3, 1],
                                        }}
                                        onClick={() => {
                                          isNearBottomRef.current = true;
                                          selectSuggestion(chip);
                                        }}
                                        disabled={isPreparing}
                                        className="disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] px-3 py-2 text-left text-xs font-medium bg-[#F1F6FB]/80 hover:bg-[#F1F6FB] text-[#10243A] border border-[#10243A]/15 hover:border-brand dark:bg-[#0D1B2E] dark:text-[#F4F8FC] dark:border-[#F4F8FC]/18 dark:hover:border-brand transition-colors cursor-pointer"
                                      >
                                        {chip.label}
                                      </motion.button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                          </motion.div>
                        );
                      })}

                      {/* Compact Preparation Bubble */}
                      {isPreparing && (
                        <motion.div
                          key="berry-compass-preparing"
                          initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                          className="inline-flex items-center gap-2.5 bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 px-3.5 py-2.5 text-xs text-[#465C72] dark:text-[#B5C5D7]"
                        >
                          <span
                            className="inline-flex items-center gap-1 shrink-0"
                            aria-hidden="true"
                          >
                            {[0, 1, 2].map((dotIdx) =>
                              prefersReduced ? (
                                <span
                                  key={dotIdx}
                                  className="w-1.5 h-1.5 bg-brand dark:bg-[#69C5F5] opacity-75"
                                />
                              ) : (
                                <motion.span
                                  key={dotIdx}
                                  animate={{ opacity: [0.28, 1, 0.28] }}
                                  transition={{
                                    duration: 0.9,
                                    repeat: Infinity,
                                    delay: dotIdx * 0.16,
                                    ease: 'easeInOut',
                                  }}
                                  className="w-1.5 h-1.5 bg-brand dark:bg-[#69C5F5]"
                                />
                              )
                            )}
                          </span>
                          <span>Finding the relevant information…</span>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>

                {/* New Message Jump Affordance when user scrolled up reading history */}
                {hasUnseenMessage && !topicBrowserOpen && (
                  <button
                    type="button"
                    onClick={scrollToLatest}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 text-xs font-semibold bg-[#10243A] text-[#FFFFFF] dark:bg-[#69C5F5] dark:text-[#10243A] shadow-lg cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                    New message
                  </button>
                )}
              </div>

              {/* Input & Browse Topics Dock */}
              <div className="shrink-0 bg-white dark:bg-[#0D1B2E] border-t border-[#10243A]/14 dark:border-[#F4F8FC]/14 px-4 sm:px-5 py-3 space-y-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTopicBrowserOpen((prev) => !prev)}
                    aria-expanded={topicBrowserOpen}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand dark:text-[#69C5F5] hover:underline cursor-pointer min-h-[28px]"
                  >
                    <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                    {topicBrowserOpen ? 'Return to conversation' : 'Browse topics'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      executeAction({ label: 'All FAQs', to: '/faq' })
                    }
                    className="inline-flex items-center gap-1 text-[#465C72] dark:text-[#B5C5D7] hover:text-[#10243A] dark:hover:text-[#F4F8FC] transition-colors cursor-pointer min-h-[28px]"
                  >
                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                    All FAQs
                  </button>
                </div>

                {inputNotice && (
                  <p role="alert" className="text-[11px] text-brand dark:text-[#69C5F5]">
                    {inputNotice}
                  </p>
                )}

                <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <label htmlFor="berry-guide-input" className="sr-only">
                      Ask Berry Compass about alloys, specifications, plants, or enquiries
                    </label>
                    <textarea
                      ref={inputRef}
                      id="berry-guide-input"
                      rows={1}
                      maxLength={MAX_INPUT_LENGTH}
                      value={draft}
                      onChange={(e) => {
                        setDraft(e.target.value);
                        if (inputNotice) setInputNotice(null);
                      }}
                      onKeyDown={handleTextareaKeyDown}
                      placeholder="Ask Berry Compass about alloys, specs, plants, or quotes…"
                      className="w-full min-h-[44px] max-h-28 px-3 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#07111F] border border-[#10243A]/20 dark:border-[#F4F8FC]/20 text-[#10243A] dark:text-[#F4F8FC] placeholder:text-[#465C72]/70 dark:placeholder:text-[#B5C5D7]/70 focus:border-brand dark:focus:border-[#69C5F5] focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Send message to Berry Compass"
                    aria-busy={isPreparing}
                    disabled={isPreparing}
                    className="disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3.5 bg-brand text-[#FFFFFF] hover:bg-brand-hover dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:hover:bg-brand dark:hover:text-[#10243A] transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>

                <div className="flex items-center justify-between gap-2 text-[10px] text-[#465C72] dark:text-[#B5C5D7]">
                  <span>Enter to send · Shift+Enter for new line</span>
                  {draft.length > 260 && (
                    <span className="font-mono-tabular">
                      {draft.length}/{MAX_INPUT_LENGTH}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
