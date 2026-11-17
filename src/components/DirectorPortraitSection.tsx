import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ASSETS } from '../data/assets';
import { COMPANY_INFO } from '../data/company';

gsap.registerPlugin(ScrollTrigger);

interface DirectorPortraitSectionProps {
  variant?: 'home' | 'about';
}

/**
 * DirectorPortraitSection — Architectural 5-layer depth composition for Shri Vijay Gupta:
 *   Layer 1: Static section canvas (inherited from parent section)
 *   Layer 2: Restrained architectural backdrop frame (counter-translates subtly on pointer)
 *   Layer 3: Soft radial/elliptical depth shadow behind the silhouette
 *   Layer 4: Original intact RGBA portrait (`vijay_gupta_md_clean.png`, NO blend modes)
 *   Layer 5: Fine copper foreground corner bracket & baseline coordinate rule
 *
 * Scroll entrance runs once on an outer GSAP wrapper; fine-pointer rAF tilt runs cleanly
 * on inner layers so scroll and cursor transforms never collide.
 */
export function DirectorPortraitSection({ variant = 'home' }: DirectorPortraitSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const portraitEntranceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameLayerRef = useRef<HTMLDivElement>(null);
  const shadowLayerRef = useRef<HTMLDivElement>(null);
  const portraitLayerRef = useRef<HTMLDivElement>(null);
  const accentLayerRef = useRef<HTMLDivElement>(null);

  // Subtle ~1s staggered scroll entrance on dedicated wrapper elements (respects reduced motion)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (frameLayerRef.current) {
        gsap.from(frameLayerRef.current, {
          opacity: 0,
          scale: 0.97,
          duration: 0.78,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            once: true,
          },
        });
      }

      if (portraitEntranceRef.current) {
        gsap.from(portraitEntranceRef.current, {
          y: 26,
          opacity: 0,
          duration: 0.95,
          delay: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            once: true,
          },
        });
      }

      const editorialItems = root.querySelectorAll('.director-editorial-stagger');
      if (editorialItems.length > 0) {
        gsap.from(editorialItems, {
          y: 16,
          opacity: 0,
          duration: 0.72,
          stagger: 0.09,
          delay: 0.14,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: root,
            start: 'top 82%',
            once: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  // Desktop fine-pointer damped rAF 5-layer depth parallax (never updates React state on pointermove)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReduced || !finePointer) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const applyTransforms = (nx: number, ny: number) => {
      // Layer 4: Intact portrait (max ±2.8deg tilt, ±5px subtle shift; baseline +8px prevents bottom seam exposure)
      if (portraitLayerRef.current) {
        const rotY = nx * 2.8;
        const rotX = -ny * 2.2;
        const tx = nx * 5.5;
        const ty = ny * 4.5;
        portraitLayerRef.current.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(3)}deg) rotateY(${rotY.toFixed(3)}deg) translate3d(${tx.toFixed(2)}px, ${(8 + ty).toFixed(2)}px, 0)`;
      }

      // Layer 2: Background architectural frame shifts smoothly in opposite direction
      if (frameLayerRef.current) {
        const fx = -nx * 5;
        const fy = -ny * 4;
        const fRotY = -nx * 1.1;
        const fRotX = ny * 0.9;
        frameLayerRef.current.style.transform = `perspective(1200px) rotateX(${fRotX.toFixed(3)}deg) rotateY(${fRotY.toFixed(3)}deg) translate3d(${fx.toFixed(2)}px, ${fy.toFixed(2)}px, 0)`;
      }

      // Layer 3: Soft depth shadow behind portrait shifts independently to reinforce separation
      if (shadowLayerRef.current) {
        const sx = -nx * 9 + 4;
        const sy = -ny * 6 + 10;
        shadowLayerRef.current.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`;
      }

      // Layer 5: Minimal foreground copper bracket moves subtly forward
      if (accentLayerRef.current) {
        const ax = nx * 7.5;
        const ay = ny * 6;
        accentLayerRef.current.style.transform = `translate3d(${ax.toFixed(2)}px, ${ay.toFixed(2)}px, 0)`;
      }
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;
      applyTransforms(currentX, currentY);

      if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentX = targetX;
        currentY = targetY;
        applyTransforms(currentX, currentY);
        rafId = 0;
      }
    };

    const ensureLoop = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (window.innerWidth < 768) return;
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const rawX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const rawY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = Math.max(-1, Math.min(1, rawX));
      targetY = Math.max(-1, Math.min(1, rawY));
      ensureLoop();
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      ensureLoop();
    };

    stage.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true });

    return () => {
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={rootRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      {/* Left: Sculptural 5-Layer Architectural Portrait Composition */}
      <div className="lg:col-span-5">
        <figure className="relative">
          {/* Stage Area: portrait head rises slightly above the architectural backdrop frame */}
          <div
            ref={stageRef}
            className="relative pt-7 sm:pt-9 px-3 sm:px-5 overflow-hidden select-none"
          >
            {/* Layer 2: Restrained Background Architectural Frame (inset from top so head overlaps above edge) */}
            <div
              ref={frameLayerRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-14 sm:top-18 inset-x-3 sm:inset-x-5 bottom-0 bg-gradient-to-br from-[#EAE5DA] via-[#E2DDD0] to-[#D4CEC0] dark:from-[#232830] dark:via-[#1B1F26] dark:to-[#13161B] border border-[#141618]/14 dark:border-[#F3F0E9]/14 transition-[border-color] duration-500 will-change-transform"
            >
              {/* Restrained horizontal copper accent hairline inside top edge of backdrop frame */}
              <div className="h-[2px] w-16 bg-[#9E4B28] dark:bg-[#EC743C] mt-4 ml-4" />
              {/* Subtle drafting coordinate index inside backdrop frame */}
              <span className="hidden sm:block absolute top-3.5 right-4 text-[10px] font-mono-tabular uppercase tracking-widest text-[#141618]/38 dark:text-[#F3F0E9]/32">
                DKG · EST. 2006
              </span>
              {/* Fine horizontal drafting grid lines */}
              <div className="absolute inset-x-5 bottom-1/3 h-px bg-[#141618]/8 dark:bg-[#F3F0E9]/8" />
            </div>

            {/* Layer 3: Soft Depth Shadow behind portrait silhouette */}
            <div
              ref={shadowLayerRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[68%] h-[76%] rounded-full bg-[#141618]/24 dark:bg-black/65 blur-2xl will-change-transform"
            />

            {/* Layer 4 (Outer GSAP Entrance -> Inner rAF Tilt): Intact Original Cutout Portrait */}
            <div ref={portraitEntranceRef} className="relative z-10 flex justify-center">
              <div
                ref={portraitLayerRef}
                className="w-full max-w-[360px] sm:max-w-[390px] translate-y-[8px] will-change-transform"
              >
                <img
                  src={ASSETS.vijayGuptaPortrait.src}
                  alt={ASSETS.vijayGuptaPortrait.alt}
                  width={1107}
                  height={1799}
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-auto max-h-[460px] sm:max-h-[500px] object-contain object-bottom drop-shadow-[0_14px_24px_rgba(20,22,24,0.18)] dark:drop-shadow-[0_18px_32px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>

            {/* Layer 5: Restrained Copper Foreground Architectural Bracket */}
            <div
              ref={accentLayerRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-5 sm:right-7 z-20 will-change-transform"
            >
              <div className="w-6 h-6 border-r-2 border-b-2 border-[#9E4B28] dark:border-[#EC743C]" />
            </div>
          </div>

          {/* Crisp Architectural Base Plinth Caption */}
          <figcaption className="mx-3 sm:mx-5 pt-4 pb-3 px-4 bg-white dark:bg-[#191C20] border border-[#141618]/14 dark:border-[#F3F0E9]/14 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                Managing Director & Founder
              </p>
              <p className="font-display text-2xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                {COMPANY_INFO.managingDirector.name}
              </p>
            </div>
            <span className="text-[11px] font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB] whitespace-nowrap">
              25+ Yrs Experience
            </span>
          </figcaption>
        </figure>
      </div>

      {/* Right: Editorial Leadership Narrative & Verified Company Context */}
      <div className="lg:col-span-7 space-y-7">
        <div className="space-y-4">
          <div className="director-editorial-stagger flex items-center gap-3">
            <span className="inline-block w-8 h-[2px] bg-[#9E4B28] dark:bg-[#EC743C]" aria-hidden="true" />
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              {variant === 'home' ? '04 / Leadership & Operating Principles' : 'Promoters & Governance Leadership'}
            </p>
          </div>

          <h2
            id={variant === 'home' ? 'leadership-section-heading' : 'leadership-heading'}
            className="director-editorial-stagger font-display fluid-statement font-bold uppercase text-[#141618] dark:text-[#F3F0E9]"
          >
            {variant === 'home'
              ? 'Second-generation industrialists driving operational accountability.'
              : 'Chairman Shri Sanjay Gupta & MD Shri Vijay Gupta'}
          </h2>
        </div>

        {/* Fine Copper Rule + Confirmed MD Biography */}
        <div className="director-editorial-stagger pt-5 border-t border-[#141618]/14 dark:border-[#F3F0E9]/14 space-y-3.5 max-w-[64ch]">
          {COMPANY_INFO.managingDirector.bio.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm sm:text-base text-[#4A5054] dark:text-[#F3F0E9]/84 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Verified Promoters & Attribution Grid */}
        <div className="director-editorial-stagger grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMPANY_INFO.leadershipTeam.map((leader) => (
            <div
              key={leader.name}
              className="bg-white dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-5 space-y-2"
            >
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                {leader.role}
              </p>
              <h3 className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                {leader.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#A1A7AB] leading-relaxed">
                {leader.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Recognition Disclosure Note */}
        <div className="director-editorial-stagger bg-[#ECE8DF] dark:bg-[#191C20] border border-[#141618]/12 dark:border-[#F3F0E9]/14 p-4 sm:p-5 space-y-1.5 text-xs text-[#4A5054] dark:text-[#A1A7AB]">
          <p className="text-[#141618] dark:text-[#F3F0E9] font-medium leading-relaxed">
            {COMPANY_INFO.managingDirector.recognitionClaim}
          </p>
          <p>{COMPANY_INFO.managingDirector.attributionNote}</p>
        </div>

        {variant === 'home' && (
          <div className="director-editorial-stagger grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-[#141618]/14 dark:border-[#F3F0E9]/14">
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                Operational Mission
              </p>
              <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
                {COMPANY_INFO.mission}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E4B28] dark:text-[#EC743C]">
                Long-Term Vision
              </p>
              <p className="text-xs sm:text-sm text-[#4A5054] dark:text-[#F3F0E9]/82 leading-relaxed">
                {COMPANY_INFO.vision}
              </p>
            </div>
          </div>
        )}

        {variant === 'home' && (
          <div className="director-editorial-stagger pt-1">
            <Link
              to="/about"
              className="group relative inline-flex items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9] dark:hover:text-[#EC743C] transition-colors duration-300"
            >
              <span>Inspect Leadership & Corporate Governance</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#9E4B28] dark:bg-[#EC743C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
