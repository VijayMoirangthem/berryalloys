import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { VisualAsset } from '../data/assets';
import { useMotion } from '../context/MotionContext';

/** Honest provenance label: only items flagged as official photography are described as such. */
export function describeProvenance(item: VisualAsset): { label: string; caption: string } {
  if (item.isOfficialPhoto) return { label: 'Company-published image', caption: item.caption };
  const already = /^(illustrative|representative)/i.test(item.caption);
  return {
    label: 'Illustrative image — not factory documentation',
    caption: already ? item.caption : `Illustrative — ${item.caption}`,
  };
}

interface GalleryLightboxProps {
  items: VisualAsset[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
  /** Element that opened the viewer; focus returns here on close. */
  returnFocusEl: HTMLElement | null;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function GalleryLightbox({ items, index, onIndexChange, onClose, returnFocusEl }: GalleryLightboxProps) {
  const { reducedMotion } = useMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;
  const fallbackFocus = useRef<HTMLElement | null>(
    typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null
  );

  const go = useCallback(
    (delta: 1 | -1) => {
      setDirection(delta);
      onIndexChange((indexRef.current + delta + items.length) % items.length);
    },
    [items.length, onIndexChange]
  );

  // Scroll lock, initial focus, and scroll/focus restoration.
  useEffect(() => {
    const savedScrollY = window.scrollY;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    const target = returnFocusEl ?? fallbackFocus.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      if (Math.abs(window.scrollY - savedScrollY) > 2) {
        window.scrollTo({ top: savedScrollY, behavior: 'auto' });
      }
      window.requestAnimationFrame(() => {
        if (target && document.contains(target)) {
          target.focus({ preventScroll: true });
        }
      });
    };
  }, [returnFocusEl]);

  // Keyboard: Escape, arrows, Home/End and a Tab focus trap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Tab' && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // Preload neighbours for smooth transitions.
  useEffect(() => {
    [1, -1].forEach((d) => {
      const img = new Image();
      img.src = items[(index + d + items.length) % items.length].src;
    });
  }, [index, items]);

  const item = items[index];
  const info = describeProvenance(item);
  const slide = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : {
        initial: { opacity: 0, x: direction * 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction * -28 },
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.16 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#07111F]/90 backdrop-blur-sm p-0 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Image viewer, ${index + 1} of ${items.length}`}
        className="flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border-subtle bg-card text-ink sm:h-auto sm:max-h-[94dvh] sm:border"
      >
        <div className="flex items-center justify-between gap-3 border-b border-subtle px-4 py-2.5 sm:px-5">
          <p className="font-mono-tabular text-xs text-brand">
            <span aria-live="polite">
              Fig. {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <span className="text-ink-2"> · {item.category}</span>
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="inline-flex h-11 w-11 items-center justify-center text-ink hover:bg-band transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          className="relative min-h-0 flex-1 overflow-hidden bg-band"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={(e) => {
            swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
          }}
          onPointerUp={(e) => {
            const s = swipe.current;
            swipe.current = null;
            if (!s || s.id !== e.pointerId) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            swipe.current = null;
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.id}
              {...slide}
              className={`flex h-[58dvh] w-full items-center justify-center sm:h-[64dvh] ${
                item.specimenPlate ? 'bg-white p-4 sm:p-8' : ''
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                draggable={false}
                className="h-full w-full object-contain select-none"
              />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-control bg-card/90 text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-control bg-card/90 text-ink hover:border-brand hover:text-brand transition-colors cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-1 border-t border-subtle px-4 py-3 sm:px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <p className="text-sm text-ink leading-relaxed">{info.caption}</p>
          <p className="font-mono-tabular text-[10px] uppercase tracking-wider text-ink-muted">{info.label}</p>
        </div>
      </div>
    </motion.div>
  );
}
