import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ASSETS, VisualAsset } from '../data/assets';
import { ResilientImage } from './ResilientImage';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  fact: string;
  image: VisualAsset;
}

const PROCESS_STAGES: ProcessStage[] = [
  {
    number: '01',
    title: 'Submerged-Arc Smelting',
    subtitle: 'Bobbili / Vizianagaram & Dhalbhumgarh Works',
    description:
      'Manganese, chrome, and quartz raw materials are reduced in submerged-arc electric furnaces under controlled slag basicity to establish target alloy chemistry.',
    fact: 'Capacity scaled from 2 × 10 MVA in 2010 across 12 MVA and 8.25 MVA furnaces plus existing 24 MVA operations.',
    image: ASSETS.furnaceElectrodes,
  },
  {
    number: '02',
    title: 'Refining & Decarburisation',
    subtitle: 'AOD Converter & Silicothermic Control',
    description:
      'Molten heats undergo Argon Oxygen Decarburisation (AOD) in our 6,000 MT/month converter for Medium & Low Carbon Ferro Manganese, or silicothermic and vacuum treatment for LC/MC Ferro Chrome.',
    fact: 'Dedicated Low Phosphorus, Low Boron, and Low Nitrogen specialty grades.',
    image: ASSETS.heroSmelting,
  },
  {
    number: '03',
    title: 'Assay & ISO Verification',
    subtitle: 'Laboratory Verification & Carbon Accounting',
    description:
      'Batch samples are verified across manganese, silicon, chromium, carbon, phosphorus, sulfur, and trace elements while maintaining ISO 9001, 14001, 45001, and ISO 14067:2018 CFP systems.',
    fact: 'Verified Q4 2023 CBAM emission data reporting readiness.',
    image: ASSETS.qualityLab,
  },
  {
    number: '04',
    title: 'Crushing, Sizing & Port Dispatch',
    subtitle: 'Three Star Export House Logistics Corridor',
    description:
      'Solidified alloy slabs are crushed, screened, and packed to steelmaker lump-size and jumbo-bagging specifications for domestic rail/road transport and vessel dispatch via Visakhapatnam Harbour Port.',
    fact: 'Direct coastal corridor connecting Andhra Pradesh smelting bays with international shipping lanes.',
    image: ASSETS.portLogistics,
  },
];

export function ManufacturingScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastStageRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (prefersReducedMotion || !isDesktop || !pinTargetRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinTargetRef.current,
        start: 'top 64px',
        end: '+=180%',
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const nextIdx = Math.min(
            PROCESS_STAGES.length - 1,
            Math.floor(self.progress * PROCESS_STAGES.length)
          );
          if (nextIdx !== lastStageRef.current) {
            lastStageRef.current = nextIdx;
            setActiveStage(nextIdx);
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${Math.max(0.08, self.progress)})`;
          }
        },
      });
    }, sectionRef);

    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleManualStageSelect = (idx: number) => {
    lastStageRef.current = idx;
    setActiveStage(idx);
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = `scaleX(${(idx + 1) / PROCESS_STAGES.length})`;
    }
  };

  const current = PROCESS_STAGES[activeStage];

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby={prefersReducedMotion ? 'process-story-heading-static' : 'process-story-heading'}
      className="scroll-mt-20 bg-[#F6F4EF] text-[#141618] dark:bg-[#191C20] dark:text-[#F3F0E9] border-t border-[#141618]/12 dark:border-[#F3F0E9]/10"
    >
      {/* Desktop Pinned Stage (lg+, disabled automatically under prefers-reduced-motion) */}
      {!prefersReducedMotion && (
        <div
          ref={pinTargetRef}
          className="hidden lg:flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12"
        >
          <div className="max-w-[1360px] w-full mx-auto px-8 xl:px-14 2xl:px-8 space-y-8">
            <div className="flex items-end justify-between gap-6 pb-5 border-b border-[#141618]/14 dark:border-[#F3F0E9]/12">
              <div className="space-y-2">
                <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
                  06 / Manufacturing Process
                </p>
                <h2
                  id="process-story-heading"
                  className="font-display fluid-section-title font-bold uppercase tracking-tight"
                >
                  From heat to precision dispatch
                </h2>
              </div>

              <div className="flex items-end gap-8 shrink-0">
                <Link
                  to="/manufacturing"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9]/85 dark:hover:text-[#EC743C] transition-colors pb-0.5 whitespace-nowrap"
                >
                  Process & Quality Detail
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <div className="w-48 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                    <span>Stage {current.number}</span>
                    <span>04</span>
                  </div>
                  <div className="h-[2px] w-full bg-[#141618]/14 dark:bg-[#F3F0E9]/15 overflow-hidden">
                    <div
                      ref={progressBarRef}
                      className="h-full w-full bg-[#9E4B28] dark:bg-[#EC743C] origin-left transition-transform duration-150"
                      style={{ transform: `scaleX(${(activeStage + 1) / PROCESS_STAGES.length})` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-10 items-stretch">
              {/* Stage Index & Active Copy */}
              <div className="col-span-5 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  {PROCESS_STAGES.map((stage, idx) => {
                    const isActive = idx === activeStage;
                    return (
                      <button
                        key={stage.number}
                        type="button"
                        onClick={() => handleManualStageSelect(idx)}
                        aria-pressed={isActive}
                        className={`w-full text-left px-4 py-3.5 border transition-colors duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-white border-[#9E4B28] dark:bg-[#20242A] dark:border-[#EC743C]/70'
                            : 'bg-transparent border-[#141618]/12 hover:border-[#141618]/35 dark:border-[#F3F0E9]/10 dark:hover:border-[#F3F0E9]/30'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="flex items-baseline gap-3">
                            <span
                              className={`font-mono-tabular text-xs ${
                                isActive
                                  ? 'text-[#9E4B28] dark:text-[#EC743C]'
                                  : 'text-[#4A5054] dark:text-[#A1A7AB]'
                              }`}
                            >
                              {stage.number}
                            </span>
                            <span
                              className={`font-display text-xl font-bold uppercase tracking-tight ${
                                isActive
                                  ? 'text-[#141618] dark:text-[#F3F0E9]'
                                  : 'text-[#141618]/60 dark:text-[#F3F0E9]/60'
                              }`}
                            >
                              {stage.title}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono-tabular text-[#9E4B28] dark:text-[#EC743C]">
                            {isActive ? 'Active' : ''}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/12 p-6 space-y-3">
                  <p className="text-xs font-mono-tabular text-[#9E4B28] dark:text-[#EC743C]">
                    {current.subtitle}
                  </p>
                  <p className="text-sm text-[#141618]/85 dark:text-[#F3F0E9]/85 leading-relaxed">
                    {current.description}
                  </p>
                  <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] pt-3 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
                    {current.fact}
                  </p>
                </div>
              </div>

              {/* Coordinated Large Media Viewport */}
              <div className="col-span-7 flex flex-col">
                <div className="relative flex-1 min-h-[420px] bg-[#141618] border border-[#141618]/20 dark:border-[#F3F0E9]/14 overflow-hidden">
                  {PROCESS_STAGES.map((stage, idx) => {
                    const isActive = activeStage === idx;
                    return (
                      <div
                        key={stage.number}
                        aria-hidden={!isActive}
                        className={`absolute inset-0 transition-[clip-path,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
                          isActive
                            ? 'opacity-100 scale-100 z-10 [clip-path:inset(0%_0%_0%_0%)]'
                            : 'opacity-0 scale-[1.05] z-0 [clip-path:inset(10%_0%_0%_0%)] pointer-events-none'
                        }`}
                      >
                        <ResilientImage
                          src={stage.image.src}
                          alt={stage.image.alt}
                          loading="eager"
                          containerClassName="w-full h-full"
                        />
                      </div>
                    );
                  })}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#121417]/92 via-[#121417]/45 to-transparent z-20 pointer-events-none" />
                  <p className="absolute bottom-4 left-5 right-5 z-30 text-xs font-mono-tabular text-[#F3F0E9]/90">
                    Stage {current.number} — {current.image.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile & Desktop Reduced-Motion Unpinned Sequence */}
      <div
        className={`${
          prefersReducedMotion ? 'block' : 'lg:hidden'
        } max-w-[1360px] mx-auto py-16 px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-8 space-y-10`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#141618]/14 dark:border-[#F3F0E9]/12">
          <div className="space-y-2">
            <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              06 / Manufacturing Process
            </p>
            <h2
              id="process-story-heading-static"
              className="font-display text-3xl lg:text-4xl font-bold uppercase tracking-tight"
            >
              From heat to precision dispatch
            </h2>
          </div>
          <Link
            to="/manufacturing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#141618] hover:text-[#9E4B28] dark:text-[#F3F0E9]/85 dark:hover:text-[#EC743C] transition-colors whitespace-nowrap"
          >
            Process & Quality Detail
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PROCESS_STAGES.map((stage) => (
            <article
              key={stage.number}
              className="bg-white dark:bg-[#20242A] border border-[#141618]/14 dark:border-[#F3F0E9]/12 overflow-hidden flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-[#141618]">
                <ResilientImage
                  src={stage.image.src}
                  alt={stage.image.alt}
                  loading="eager"
                  containerClassName="w-full h-full"
                />
              </div>
              <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono-tabular text-xs text-[#9E4B28] dark:text-[#EC743C]">
                      {stage.number}
                    </span>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9]">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                    {stage.subtitle}
                  </p>
                  <p className="text-sm text-[#4A5054] dark:text-[#F3F0E9]/85 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
                <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] pt-3 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10">
                  {stage.fact}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
