import { cn } from '../../lib/utils';

export function SkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('berry-skeleton', className)} />;
}

export function MediaCardSkeleton() {
  return (
    <div className="border border-subtle bg-card overflow-hidden">
      <SkeletonBlock className="aspect-[16/10] w-full" />
      <div className="p-5 space-y-3">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-6 w-3/4" />
        <div className="space-y-2 pt-1">
          <SkeletonBlock className="h-3.5 w-full" />
          <SkeletonBlock className="h-3.5 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function SpecTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-subtle bg-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-subtle flex items-center justify-between gap-4">
        <SkeletonBlock className="h-4 w-56" />
        <SkeletonBlock className="h-4 w-24" />
      </div>
      <div className="divide-y divide-subtle">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-5 py-3.5 grid grid-cols-5 gap-4">
            <SkeletonBlock className="h-3.5 col-span-2" />
            <SkeletonBlock className="h-3.5" />
            <SkeletonBlock className="h-3.5" />
            <SkeletonBlock className="h-3.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full-page architectural skeleton shown by React Suspense whenever a lazy route
 * chunk is loading or network latency delays the next page view.
 */
export function PageContentSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      data-page-skeleton="true"
      className="bg-canvas text-ink min-h-[72vh]"
    >
      {/* Top linear shimmer accent */}
      <div className="h-[2.5px] w-full overflow-hidden bg-band">
        <div className="h-full w-full bg-gradient-to-r from-[#006393] via-[#69C5F5] to-[#C9233B] route-progress-bar" />
      </div>

      {/* Subnav bar skeleton */}
      <div className="border-b border-subtle bg-band/60">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-6">
          <SkeletonBlock className="h-3.5 w-24" />
          <SkeletonBlock className="h-3.5 w-28" />
          <SkeletonBlock className="h-3.5 w-20" />
          <SkeletonBlock className="h-3.5 w-24 hidden sm:block" />
        </div>
      </div>

      {/* Editorial header & media split skeleton */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-4">
            <SkeletonBlock className="h-3 w-36" />
            <SkeletonBlock className="h-11 w-11/12" />
            <SkeletonBlock className="h-11 w-3/4" />
            <div className="space-y-2.5 pt-2 max-w-xl">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-10/12" />
              <SkeletonBlock className="h-4 w-8/12" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <SkeletonBlock className="aspect-[16/10] w-full border border-subtle" />
          </div>
        </div>

        {/* 3-card content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-subtle">
          <MediaCardSkeleton />
          <MediaCardSkeleton />
          <MediaCardSkeleton />
        </div>
      </div>

      <span className="sr-only">Loading Berry Alloys view…</span>
    </div>
  );
}
