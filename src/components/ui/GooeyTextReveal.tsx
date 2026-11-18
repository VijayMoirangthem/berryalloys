import React, { forwardRef, useCallback, useEffect, useId, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GsapSplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, GsapSplitText);

export type GooeyTextRevealMode = 'immediate' | 'scroll' | 'scrub';
export type GooeyTextRevealScroller =
  | string
  | HTMLElement
  | React.RefObject<HTMLElement | null>;

export interface GooeyTextRevealProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  mode?: GooeyTextRevealMode;
  delay?: number;
  duration?: number;
  stagger?: number;
  blurAmount?: number;
  ease?: string;
  start?: string;
  end?: string;
  scroller?: GooeyTextRevealScroller;
  once?: boolean;
  disabled?: boolean;
  onComplete?: () => void;
}

const LINE_EDGE_BLUR = 0.35;

function wrapLine(line: HTMLElement) {
  const inner = document.createElement('span');
  inner.dataset.gooeyRevealInner = '';
  inner.style.display = 'inline-block';
  inner.style.willChange = 'filter';

  while (line.firstChild) {
    inner.appendChild(line.firstChild);
  }

  line.appendChild(inner);
  return inner;
}

function getRevealTargets(container: HTMLDivElement) {
  const explicitTargets = Array.from(
    container.querySelectorAll<HTMLElement>('[data-gooey-reveal-item]')
  );
  if (explicitTargets.length > 0) return explicitTargets;

  const directChildren = Array.from(container.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement
  );
  return directChildren.length > 0 ? directChildren : [container];
}

/**
 * GooeyTextReveal — GSAP SplitText line-by-line gooey threshold focus reveal
 * with safe resize re-splitting and reduced-motion bypass.
 */
export const GooeyTextReveal = forwardRef<HTMLDivElement, GooeyTextRevealProps>(
  function GooeyTextReveal(
    {
      children,
      mode = 'scroll',
      delay = 0,
      duration = 1.15,
      stagger = 0.08,
      blurAmount = 0.32,
      ease = 'power3.out',
      start = 'top 86%',
      end = 'bottom 75%',
      scroller,
      once = true,
      disabled = false,
      onComplete,
      ...props
    },
    forwardedRef
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const reactId = useId();
    const filterId = useMemo(
      () => `gooey-text-reveal-${reactId.replace(/:/g, '')}`,
      [reactId]
    );

    const setContainerRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container || disabled) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      const isCompact = window.matchMedia('(max-width: 767px)').matches;
      if (isCompact) {
        const targets = getRevealTargets(container);
        targets.forEach((el, i) => {
          el.style.opacity = '0.32';
          el.style.transform = 'translate3d(0, 12px, 0)';
          el.style.transition = `opacity 520ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms, transform 560ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms`;
        });

        let revealed = false;
        const hasEnteredOrPassed = () => container.getBoundingClientRect().top <= window.innerHeight * 0.94;

        const reveal = () => {
          if (revealed) return;
          revealed = true;
          targets.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'translate3d(0, 0, 0)';
          });
          io.disconnect();
          window.removeEventListener('scroll', onScrollOrResize);
          window.removeEventListener('resize', onScrollOrResize);
        };

        const onScrollOrResize = () => {
          if (hasEnteredOrPassed()) reveal();
        };

        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting || e.boundingClientRect.top <= window.innerHeight * 0.94)) {
              reveal();
            }
          },
          { threshold: 0.08, rootMargin: '40px 0px' }
        );
        io.observe(container);
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });

        let raf1 = 0;
        let raf2 = 0;
        raf1 = window.requestAnimationFrame(() => {
          raf2 = window.requestAnimationFrame(() => {
            if (hasEnteredOrPassed()) reveal();
          });
        });

        return () => {
          window.cancelAnimationFrame(raf1);
          window.cancelAnimationFrame(raf2);
          io.disconnect();
          window.removeEventListener('scroll', onScrollOrResize);
          window.removeEventListener('resize', onScrollOrResize);
          targets.forEach((el) => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
          });
        };
      }

      let splits: GsapSplitText[] = [];
      let tween: gsap.core.Tween | null = null;
      let animationFrame = 0;
      let measuredWidth = container.getBoundingClientRect().width;
      let disposed = false;

      const revert = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = null;
        splits.forEach((split) => split.revert());
        splits = [];
      };

      const build = () => {
        if (disposed) return;
        revert();

        const layers: HTMLElement[] = [];

        getRevealTargets(container).forEach((target) => {
          const split = GsapSplitText.create(target, {
            type: 'lines',
            linesClass: 'gooey-text-reveal-line',
            aria: 'auto',
          });

          split.lines.forEach((line) => {
            const lineElement = line as HTMLElement;
            lineElement.style.display = 'block';
            lineElement.style.filter = `url(#${filterId}) blur(${LINE_EDGE_BLUR}px)`;
            lineElement.style.willChange = 'filter';
            layers.push(wrapLine(lineElement));
          });

          splits.push(split);
        });

        if (layers.length === 0) return;

        gsap.set(layers, { filter: `blur(${blurAmount}em)` });

        const resolvedScroller =
          typeof scroller === 'string' || scroller instanceof HTMLElement
            ? scroller
            : scroller?.current ?? undefined;

        const animation: gsap.TweenVars = {
          filter: 'blur(0em)',
          duration,
          ease,
          stagger,
          onComplete,
        };

        if (mode === 'scrub') {
          animation.scrollTrigger = {
            trigger: container,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
            scroller: resolvedScroller,
          };
        } else if (mode === 'scroll') {
          animation.delay = delay;
          animation.scrollTrigger = {
            trigger: container,
            start,
            once,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
            invalidateOnRefresh: true,
            scroller: resolvedScroller,
          };
        } else {
          animation.delay = delay;
        }

        tween = gsap.to(layers, animation);
      };

      build();

      if (document.fonts && document.fonts.status !== 'loaded') {
        document.fonts.ready.then(() => {
          if (!disposed) build();
        });
      }

      const resizeObserver = new ResizeObserver(([entry]) => {
        const nextWidth = entry.contentRect.width;
        if (Math.abs(nextWidth - measuredWidth) < 2) return;
        measuredWidth = nextWidth;
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(build);
      });

      resizeObserver.observe(container);

      return () => {
        disposed = true;
        resizeObserver.disconnect();
        window.cancelAnimationFrame(animationFrame);
        revert();
      };
    }, [
      mode,
      delay,
      duration,
      stagger,
      blurAmount,
      ease,
      start,
      end,
      scroller,
      once,
      disabled,
      onComplete,
      filterId,
    ]);

    return (
      <>
        <div ref={setContainerRef} {...props}>
          {children}
        </div>

        <svg
          aria-hidden="true"
          focusable="false"
          width="0"
          height="0"
          style={{ position: 'absolute', pointerEvents: 'none' }}
        >
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
              />
            </filter>
          </defs>
        </svg>
      </>
    );
  }
);

GooeyTextReveal.displayName = 'GooeyTextReveal';

export default GooeyTextReveal;
