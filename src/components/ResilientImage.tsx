import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  loading = 'lazy',
  fetchPriority = 'auto',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1B2E] via-[#19314B] to-[#10243A] text-[#F4F8FC]/80 p-6 ${containerClassName}`}
      >
        <Layers className="w-8 h-8 text-[#69C5F5] mb-3" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-xs font-mono-tabular text-center max-w-xs leading-relaxed text-[#F4F8FC]/70">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
