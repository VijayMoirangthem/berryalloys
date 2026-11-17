import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ImageRevealItem {
  id: string;
  index?: string;
  label: string;
  category?: string;
  subtitle?: string;
  image: string;
  alt: string;
  to?: string;
}

interface ImageRevealListProps {
  items: ImageRevealItem[];
  className?: string;
}

/**
 * ImageRevealList — Editorial numbered directory that unveils a framed floating
 * photograph when hovering or focusing each row, with compact inline fallback on mobile.
 */
export function ImageRevealList({ items, className }: ImageRevealListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewY, setPreviewY] = useState<number>(24);

  const activeItem = items.find((i) => i.id === hoveredId) ?? null;

  const handleActivateRow = (id: string, el: HTMLElement | null) => {
    setHoveredId(id);
    if (!containerRef.current || !el) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const rowRect = el.getBoundingClientRect();
    const centerOffset = rowRect.top - containerRect.top + rowRect.height * 0.5 - 108;
    const maxOffset = Math.max(0, containerRect.height - 236);
    setPreviewY(Math.max(0, Math.min(maxOffset, centerOffset)));
  };

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => setHoveredId(null)}
      className={cn('relative', className)}
    >
      <ul className="divide-y divide-[#141618]/14 dark:divide-[#F3F0E9]/14 border-t border-b border-[#141618]/14 dark:border-[#F3F0E9]/14">
        {items.map((item, idx) => {
          const isHovered = hoveredId === item.id;
          const RowTag = item.to ? Link : 'div';
          const rowProps = item.to ? { to: item.to } : {};

          return (
            <li key={item.id}>
              {/* @ts-expect-error polymorphic link or div */}
              <RowTag
                {...rowProps}
                tabIndex={item.to ? undefined : 0}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) =>
                  handleActivateRow(item.id, e.currentTarget)
                }
                onFocus={(e: React.FocusEvent<HTMLElement>) =>
                  handleActivateRow(item.id, e.currentTarget)
                }
                className={cn(
                  'group grid grid-cols-12 items-center gap-4 py-4 px-2 sm:px-4 transition-colors duration-300 focus-visible:outline-none',
                  isHovered
                    ? 'bg-[#ECE8DF]/75 dark:bg-[#20242A]/90'
                    : 'hover:bg-[#ECE8DF]/50 dark:hover:bg-[#191C20]'
                )}
              >
                <div className="col-span-2 sm:col-span-1 font-mono-tabular text-xs font-semibold text-[#9E4B28] dark:text-[#EC743C]">
                  {item.index ?? String(idx + 1).padStart(2, '0')}
                </div>

                <div className="col-span-8 sm:col-span-6 space-y-0.5">
                  <p className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#141618] dark:text-[#F3F0E9] group-hover:text-[#9E4B28] dark:group-hover:text-[#EC743C] transition-colors">
                    {item.label}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-[#4A5054] dark:text-[#A1A7AB] line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <div className="hidden sm:block sm:col-span-4 text-xs font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
                  {item.category}
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2">
                  <div className="md:hidden w-12 h-9 shrink-0 overflow-hidden bg-[#141618] border border-[#141618]/15">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ArrowUpRight
                    className="hidden md:block w-4 h-4 text-[#9E4B28] dark:text-[#EC743C] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    aria-hidden="true"
                  />
                </div>
              </RowTag>
            </li>
          );
        })}
      </ul>

      {/* Floating Desktop Preview Window (bounds-clamped to container) */}
      <div
        aria-hidden={!activeItem}
        style={{
          transform: `translate3d(0, ${previewY}px, 0)`,
        }}
        className={cn(
          'hidden md:block pointer-events-none absolute right-6 top-0 z-20 w-[290px] lg:w-[330px] border border-[#141618]/20 dark:border-[#F3F0E9]/20 bg-[#FFFFFF] dark:bg-[#191C20] shadow-[0_24px_60px_rgba(0,0,0,0.22)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          activeItem ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        {activeItem && (
          <div>
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#141618]">
              <img
                src={activeItem.image}
                alt={activeItem.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-3.5 py-2.5 border-t border-[#141618]/10 dark:border-[#F3F0E9]/10 flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
              <span className="text-[#9E4B28] dark:text-[#EC743C] truncate">
                {activeItem.category ?? 'Operational Visual'}
              </span>
              <span className="text-[#4A5054] dark:text-[#A1A7AB] shrink-0">
                {activeItem.index ?? 'Inspect'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageRevealList;
