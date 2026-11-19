import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDrag } from '@use-gesture/react';
import { GROWTH_TIMELINE, GrowthMilestone } from '../data/company';

interface MilestoneTelemetry {
  scalePercent: number;
  corridor: string;
  keyMetric: string;
  metricUnit: string;
  tags: string[];
}

const YEAR_TELEMETRY: Record<string, MilestoneTelemetry> = {
  '2010': {
    scalePercent: 12,
    corridor: 'Bobbili · Vizianagaram',
    keyMetric: '36,000',
    metricUnit: 'TPA · 2 × 10 MVA',
    tags: ['First Commissioning', 'Submerged-Arc', 'Phase 01'],
  },
  '2016': {
    scalePercent: 28,
    corridor: 'Bobbili Complex · AP',
    keyMetric: '72,000',
    metricUnit: 'TPA · Furnace Addition',
    tags: ['Capacity Doubling', 'Manganese Alloys', 'Phase 02'],
  },
  '2017': {
    scalePercent: 40,
    corridor: 'Bobbili Complex · AP',
    keyMetric: '1,08,000',
    metricUnit: 'TPA · Multi-Furnace',
    tags: ['12 MVA Furnaces', 'Bulk Alloy Sizing', 'Phase 03'],
  },
  '2020': {
    scalePercent: 54,
    corridor: 'Eastern & Coastal Belt',
    keyMetric: '1,65,000',
    metricUnit: 'TPA · Export Scaling',
    tags: ['Visakhapatnam Port', 'Global Steelmakers', 'Phase 04'],
  },
  '2021': {
    scalePercent: 68,
    corridor: 'Bobbili & Jharkhand',
    keyMetric: '2,25,000',
    metricUnit: 'TPA · Multi-Unit',
    tags: ['Dhalbhumgarh Works', '24 MVA Operations', 'Phase 05'],
  },
  '2022': {
    scalePercent: 82,
    corridor: 'AP & Jharkhand Corridor',
    keyMetric: '2,80,000',
    metricUnit: 'TPA · Integrated Smelting',
    tags: ['Renewable Power', 'ISO Systems', 'Phase 06'],
  },
  '2023': {
    scalePercent: 92,
    corridor: 'Bobbili · AOD & Export',
    keyMetric: '3,20,000',
    metricUnit: 'TPA + 6,000 MT/mo AOD',
    tags: ['Three Star Export House', 'AOD Converter', 'CBAM Q4 2023'],
  },
  '2025': {
    scalePercent: 96,
    corridor: 'Ghatsila · Kadambera',
    keyMetric: '2 × 30 MVA',
    metricUnit: '+ 1,000 TPD DRI Scope',
    tags: ['DRI Integration', '90 MW WHR Plan', 'Phase 08'],
  },
  '2026+': {
    scalePercent: 100,
    corridor: 'Bobbili · 93.43 Acres',
    keyMetric: '₹1,200 Cr',
    metricUnit: 'Announced Expansion',
    tags: ['AP SIPB Disclosure', '56 Chowringhee Office', 'Next Horizon'],
  },
};

export function GrowthChronicle() {
  const prefersReduced = useReducedMotion();
  const [selectedYear, setSelectedYear] = useState<string>(GROWTH_TIMELINE[0].year);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prevIdxRef = useRef<number>(0);

  const activeIdx = Math.max(
    0,
    GROWTH_TIMELINE.findIndex((m) => m.year === selectedYear)
  );
  const activeItem: GrowthMilestone = GROWTH_TIMELINE[activeIdx] ?? GROWTH_TIMELINE[0];
  const activeTelemetry: MilestoneTelemetry = YEAR_TELEMETRY[activeItem.year] ?? {
    scalePercent: Math.round(((activeIdx + 1) / GROWTH_TIMELINE.length) * 100),
    corridor: 'Bobbili · Dhalbhumgarh · Vizag',
    keyMetric: activeItem.capacitySummary.split('·')[0].trim(),
    metricUnit: activeItem.sourceStage,
    tags: ['Berry Alloys Timeline'],
  };

  const selectMilestone = useCallback((year: string) => {
    const nextIdx = GROWTH_TIMELINE.findIndex((m) => m.year === year);
    if (nextIdx >= 0 && nextIdx !== prevIdxRef.current) {
      setDirection(nextIdx > prevIdxRef.current ? 1 : -1);
      prevIdxRef.current = nextIdx;
    }
    setSelectedYear(year);
  }, []);

  const stepMilestone = useCallback(
    (delta: 1 | -1) => {
      const nextIdx = (activeIdx + delta + GROWTH_TIMELINE.length) % GROWTH_TIMELINE.length;
      setDirection(delta);
      prevIdxRef.current = nextIdx;
      setSelectedYear(GROWTH_TIMELINE[nextIdx].year);
    },
    [activeIdx]
  );

  const bindSwipe = useDrag(
    ({ active, movement: [mx], velocity: [vx], direction: [dx], memo }) => {
      if (active) {
        if (!memo?.swiped && (Math.abs(mx) > 42 || (vx > 0.35 && Math.abs(mx) > 18))) {
          stepMilestone(mx < 0 || dx < 0 ? 1 : -1);
          return { swiped: true };
        }
        return memo ?? { swiped: false };
      }
      return { swiped: false };
    },
    {
      axis: 'x',
      filterTaps: true,
      threshold: 5,
      preventScroll: true,
      pointer: { capture: false },
    }
  );

  const progressRatio = (activeIdx + 1) / Math.max(1, GROWTH_TIMELINE.length);

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0.25, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 sm:space-y-10"
    >
      {/* Horizontal Year Selector Strip */}
      <div className="space-y-3">
        <div
          role="tablist"
          aria-label="Select milestone year in Berry Alloys growth story"
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2"
        >
          {GROWTH_TIMELINE.map((milestone) => {
            const isSelected = milestone.year === activeItem.year;
            return (
              <motion.button
                key={milestone.year}
                type="button"
                role="tab"
                aria-selected={isSelected}
                whileTap={prefersReduced ? undefined : { scale: 0.96 }}
                onClick={() => selectMilestone(milestone.year)}
                className={`relative min-h-[48px] px-3 py-2.5 text-left border transition-colors cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-[#10243A] text-[#F4F8FC] border-[#10243A] dark:bg-[#0A6AA1] dark:text-[#F4F8FC] dark:border-[#69C5F5]'
                    : 'bg-white text-[#10243A] border-[#10243A]/15 hover:border-brand dark:bg-[#12243B] dark:text-[#F4F8FC]/80 dark:border-[#F4F8FC]/14 dark:hover:border-[#69C5F5]'
                }`}
              >
                <span
                  className={`block font-mono-tabular text-xs font-semibold ${
                    isSelected
                      ? 'text-[#69C5F5] dark:text-[#F4F8FC]'
                      : 'text-brand dark:text-[#69C5F5]'
                  }`}
                >
                  {milestone.year}
                </span>
                <span
                  className={`block text-[11px] truncate mt-0.5 ${
                    isSelected
                      ? 'text-[#F4F8FC]/85'
                      : 'text-[#465C72] dark:text-[#B5C5D7]'
                  }`}
                >
                  {milestone.capacitySummary.split('·')[0].trim()}
                </span>
                {isSelected && (
                  <motion.span
                    layoutId="chronicle-active-tab-bar"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-accent-red"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Continuous Timeline Scrubber Progress + Quick Prev/Next Controls */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex-1 h-[3px] bg-[#10243A]/12 dark:bg-[#F4F8FC]/14 overflow-hidden">
            <motion.div
              className="h-full w-full origin-left bg-gradient-to-r from-brand via-[#69C5F5] to-accent-red"
              initial={false}
              animate={{ scaleX: progressRatio }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7] mr-1">
              0{activeIdx + 1} / 0{GROWTH_TIMELINE.length}
            </span>
            <button
              type="button"
              onClick={() => stepMilestone(-1)}
              aria-label="Previous milestone"
              className="inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 border border-[#10243A]/18 dark:border-[#F4F8FC]/18 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] hover:border-brand transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => stepMilestone(1)}
              aria-label="Next milestone"
              className="inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 border border-[#10243A]/18 dark:border-[#F4F8FC]/18 bg-white dark:bg-[#12243B] text-[#10243A] dark:text-[#F4F8FC] hover:border-brand transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Milestone Focus + Architectural Capacity Telemetry Plate (Swipeable on Touch Screens) */}
      <div
        {...bindSwipe()}
        style={{ touchAction: 'pan-y' }}
        className="bg-white dark:bg-[#12243B] border border-[#10243A]/14 dark:border-[#F4F8FC]/14 overflow-hidden select-none"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeItem.year}
            custom={direction}
            initial={
              prefersReduced
                ? false
                : { opacity: 0.2, x: direction * 26 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              prefersReduced
                ? undefined
                : { opacity: 0.2, x: direction * -26 }
            }
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#10243A]/12 dark:border-[#F4F8FC]/12 pb-3">
                  <span className="font-mono-tabular text-xs font-semibold text-brand dark:text-[#69C5F5]">
                    Milestone {activeItem.year}
                  </span>
                  <span className="text-[11px] font-mono-tabular text-[#465C72] dark:text-[#B5C5D7]">
                    {activeItem.sourceStage}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#10243A] dark:text-[#F4F8FC]">
                  {activeItem.headline}
                </h3>

                <p className="font-mono-tabular text-xs sm:text-sm font-semibold text-brand dark:text-[#69C5F5]">
                  {activeItem.capacitySummary}
                </p>

                <p className="text-sm sm:text-base text-[#465C72] dark:text-[#F4F8FC]/82 leading-relaxed">
                  {activeItem.details}
                </p>
              </div>

              <div className="pt-4 border-t border-[#10243A]/10 dark:border-[#F4F8FC]/10 space-y-1">
                <p className="lg:hidden text-[10.5px] font-mono-tabular uppercase tracking-wider text-brand dark:text-[#69C5F5]">
                  Swipe card left / right to step through milestones
                </p>
                <p className="text-[11px] text-[#465C72] dark:text-[#B5C5D7] leading-relaxed">
                  Milestones 2010–2025 transcribe Berry Alloys’ published website growth timeline verbatim; 2026 entries reflect dated news and AP SIPB disclosures rather than completed installed tonnage.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#10243A] text-[#F4F8FC] border-t lg:border-t-0 lg:border-l border-[#10243A]/14 dark:border-[#F4F8FC]/14 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 relative overflow-hidden">
              <span aria-hidden="true" className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B]" />
              <div className="flex items-center justify-between gap-3 text-[11px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
                <span>{activeTelemetry.corridor}</span>
                <span>0{activeIdx + 1} / 0{GROWTH_TIMELINE.length}</span>
              </div>

              <div className="space-y-3 py-2">
                <p className="font-display text-6xl sm:text-7xl font-bold leading-none text-[#F4F8FC]/14 select-none">
                  {activeItem.year}
                </p>
                <div className="-mt-5 space-y-1">
                  <p className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-[#F4F8FC]">
                    {activeTelemetry.keyMetric}
                  </p>
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-[#69C5F5]">
                    {activeTelemetry.metricUnit}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10.5px] font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                    <span>Trajectory Progression</span>
                    <span>{activeTelemetry.scalePercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F4F8FC]/12 overflow-hidden">
                    <motion.div
                      initial={prefersReduced ? false : { scaleX: 0 }}
                      animate={{ scaleX: activeTelemetry.scalePercent / 100 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full w-full origin-left bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4F8FC]/14 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono-tabular text-[#B5C5D7]">
                  {activeTelemetry.tags.map((tag, i) => (
                    <span key={tag} className="inline-flex items-center gap-2">
                      {i > 0 && <span aria-hidden="true" className="text-[#69C5F5]/45">/</span>}
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scannable Compact Growth Index Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#10243A]/12 dark:bg-[#F4F8FC]/14 border border-[#10243A]/12 dark:border-[#F4F8FC]/14">
        {GROWTH_TIMELINE.map((item, idx) => {
          const active = item.year === activeItem.year;
          return (
            <motion.button
              key={item.year}
              type="button"
              initial={prefersReduced ? false : { opacity: 0.35, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.035, 0.25), ease: [0.22, 1, 0.36, 1] }}
              whileTap={prefersReduced ? undefined : { scale: 0.985 }}
              onClick={() => selectMilestone(item.year)}
              className={`relative text-left p-5 transition-colors cursor-pointer ${
                active
                  ? 'bg-[#F1F6FB] dark:bg-[#0D1B2E]'
                  : 'bg-white hover:bg-[#FFFFFF] dark:bg-[#12243B] dark:hover:bg-[#0D1B2E]/80'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="chronicle-grid-active-mark"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] bg-brand dark:bg-[#69C5F5]"
                />
              )}
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="font-display text-2xl font-bold text-brand dark:text-[#69C5F5]">
                  {item.year}
                </span>
                <span className="font-mono-tabular text-[11px] text-[#465C72] dark:text-[#B5C5D7]">
                  {item.capacitySummary.split('·')[0]}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#10243A] dark:text-[#F4F8FC] leading-snug">
                {item.headline}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
