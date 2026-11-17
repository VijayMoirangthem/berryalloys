import { SpotlightNavbar } from './ui/SpotlightNavbar';

interface SubNavLink {
  label: string;
  to: string;
}

interface SubNavProps {
  links: SubNavLink[];
  ariaLabel: string;
}

export function SubNav({ links, ariaLabel }: SubNavProps) {
  return <SpotlightNavbar items={links} ariaLabel={ariaLabel} />;
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
