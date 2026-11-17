import { Pause, Play } from 'lucide-react';
import { useMotion } from '../context/MotionContext';
import { cn } from '../lib/utils';

/** Clear user control for decorative, continuously running motion (does not affect interaction feedback). */
export function AmbientMotionToggle({ className }: { className?: string }) {
  const { ambientPaused, reducedMotion, toggleAmbient } = useMotion();
  const paused = ambientPaused || reducedMotion;
  return (
    <button
      type="button"
      onClick={toggleAmbient}
      disabled={reducedMotion}
      aria-pressed={paused}
      title={reducedMotion ? 'Reduced motion is enabled in your system settings' : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 min-h-[32px] px-2.5 text-xs font-medium border border-control text-ink-2 hover:text-ink hover:border-brand transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default',
        className
      )}
    >
      {paused ? <Play className="w-3 h-3" aria-hidden="true" /> : <Pause className="w-3 h-3" aria-hidden="true" />}
      {paused ? 'Resume ambient motion' : 'Pause ambient motion'}
    </button>
  );
}
