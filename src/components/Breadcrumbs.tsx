import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  dark?: boolean;
}

export function Breadcrumbs({ items, dark = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-xs ${
          dark ? 'text-[#B5C5D7]' : 'text-[#465C72] dark:text-[#B5C5D7]'
        }`}
      >
        <li>
          <Link
            to="/"
            className={`transition-colors hover:underline ${
              dark ? 'hover:text-[#F4F8FC]' : 'hover:text-[#10243A] dark:hover:text-[#F4F8FC]'
            }`}
          >
            Home
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
            {item.to && idx < items.length - 1 ? (
              <Link
                to={item.to}
                className={`transition-colors hover:underline ${
                  dark ? 'hover:text-[#F4F8FC]' : 'hover:text-[#10243A] dark:hover:text-[#F4F8FC]'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={`font-medium ${dark ? 'text-[#F4F8FC]' : 'text-[#10243A] dark:text-[#F4F8FC]'}`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
