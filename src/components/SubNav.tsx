import { NavLink } from 'react-router-dom';

interface SubNavLink {
  label: string;
  to: string;
}

interface SubNavProps {
  links: SubNavLink[];
  ariaLabel: string;
}

export function SubNav({ links, ariaLabel }: SubNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="border-b border-[#141618]/12 dark:border-[#F3F0E9]/12 bg-[#ECE8DF]/80 dark:bg-[#191C20]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `min-h-[44px] flex items-center py-2.5 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'border-[#9E4B28] text-[#141618] font-semibold dark:border-[#EC743C] dark:text-[#F3F0E9]'
                  : 'border-transparent text-[#4A5054] hover:text-[#141618] dark:text-[#A1A7AB] dark:hover:text-[#F3F0E9]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export const CORPORATE_SUBNAV_LINKS: SubNavLink[] = [
  { label: 'About, Legacy & Leadership', to: '/about' },
  { label: 'Community & CSR', to: '/community' },
  { label: 'Careers', to: '/careers' },
  { label: 'Corporate Documents', to: '/documents' },
  { label: 'FAQs & Guide', to: '/faq' },
];

export const OPERATIONS_SUBNAV_LINKS: SubNavLink[] = [
  { label: 'Manufacturing & Quality', to: '/manufacturing' },
  { label: 'Sustainability', to: '/sustainability' },
];
