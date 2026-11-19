import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Layers } from 'lucide-react';
import { cn } from '../lib/utils';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  disableSkeleton?: boolean;
}

/**
 * ResilientImage — Renders photography with a non-blocking architectural shimmer
 * while genuinely loading, synchronous cached-image detection via useLayoutEffect,
 * and a bounded failsafe reveal so no image can ever get stuck invisible/blank white.
 */
export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  disableSkeleton = false,
}: ResilientImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Synchronously reveal cached/already-decoded images before paint
  useLayoutEffect(() => {
    setHasError(false);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  // Safety cap: never leave a skeleton stuck over an image (e.g. inside transformed/lazy containers)
  useEffect(() => {
    if (loaded || disableSkeleton) return;
    const timer = window.setTimeout(() => {
      setLoaded(true);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [src, loaded, disableSkeleton]);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2E] via-[#19314B] to-[#10243A] text-[#F4F8FC]/80 p-6',
          containerClassName || 'w-full h-full'
        )}
      >
        <Layers className="w-8 h-8 text-[#69C5F5] mb-3" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-xs font-mono-tabular text-center max-w-xs leading-relaxed text-[#F4F8FC]/70">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'relative block overflow-hidden bg-[#E7F0F8]/60 dark:bg-[#0D1B2E]/80',
        containerClassName || 'w-full h-full'
      )}
    >
      {!disableSkeleton && !loaded && (
        <span
          aria-hidden="true"
          data-skeleton="image"
          className="berry-skeleton pointer-events-none absolute inset-0 z-10 block"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        referrerPolicy="no-referrer"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(true);
          setHasError(true);
        }}
        className={cn(
          className,
          'block transition-opacity duration-250 ease-out',
          loaded || disableSkeleton ? 'opacity-100' : 'opacity-95'
        )}
      />
    </span>
  );
}
