import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SocialChannelItem {
  id: string;
  letter: string;
  label: string;
  href?: string;
  to?: string;
  external?: boolean;
  note: string;
  icon: ReactNode;
}

export interface SocialFlipButtonProps {
  heading?: string;
  className?: string;
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.21 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
    </svg>
  );
}

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
      <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M13.5 22V13.1H16.5L16.95 9.6H13.5V7.37C13.5 6.36 13.78 5.67 15.23 5.67H17.07V2.54C16.75 2.5 15.66 2.4 14.38 2.4C11.72 2.4 9.9 4.02 9.9 7V9.6H6.9V13.1H9.9V22H13.5Z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="fill-current" />
    </svg>
  );
}

function YouTubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M21.58 7.19C21.35 6.33 20.67 5.65 19.81 5.42C18.25 5 12 5 12 5C12 5 5.75 5 4.19 5.42C3.33 5.65 2.65 6.33 2.42 7.19C2 8.75 2 12 2 12C2 12 2 15.25 2.42 16.81C2.65 17.67 3.33 18.35 4.19 18.58C5.75 19 12 19 12 19C12 19 18.25 19 19.81 18.58C20.67 18.35 21.35 17.67 21.58 16.81C22 15.25 22 12 22 12C22 12 22 8.75 21.58 7.19ZM10 15V9L15.2 12L10 15Z" />
    </svg>
  );
}

const CONNECT_TILES: SocialChannelItem[] = [
  {
    id: 'portal',
    letter: 'C',
    label: 'Official Portal (berryalloys.com)',
    href: 'https://berryalloys.com/',
    external: true,
    note: 'Opening published corporate website berryalloys.com',
    icon: <Globe className="w-4 h-4" aria-hidden="true" />,
  },
  {
    id: 'email',
    letter: 'O',
    label: 'Commercial Desk Email (marketing@berryalloys.in)',
    href: 'mailto:marketing@berryalloys.in',
    note: 'Direct trade email: marketing@berryalloys.in',
    icon: <Mail className="w-4 h-4" aria-hidden="true" />,
  },
  {
    id: 'linkedin',
    letter: 'N',
    label: 'LinkedIn Corporate Enquiry Routing',
    to: '/contact?tab=general',
    note: 'Corporate network channel routed to general commercial desk (dedicated LinkedIn URL not archived)',
    icon: <LinkedInGlyph />,
  },
  {
    id: 'x-updates',
    letter: 'N',
    label: 'News & Announcements Desk (X)',
    to: '/news',
    note: 'Company press releases & SIPB notices indexed under News & Media',
    icon: <XGlyph />,
  },
  {
    id: 'facebook',
    letter: 'E',
    label: 'Community & CSR Channel (Facebook)',
    to: '/community',
    note: 'Workforce welfare & grassroots CSR archive indexed under Community',
    icon: <FacebookGlyph />,
  },
  {
    id: 'instagram',
    letter: 'C',
    label: 'Plant Photography Archive (Instagram)',
    to: '/#plant-gallery',
    note: 'Smelting complexes, solar roofs & alloy plates indexed in Media Gallery',
    icon: <InstagramGlyph />,
  },
  {
    id: 'youtube',
    letter: 'T',
    label: 'Manufacturing Process Overview (YouTube)',
    to: '/manufacturing',
    note: 'SAF smelting & AOD decarburisation overview on Manufacturing & QA',
    icon: <YouTubeGlyph />,
  },
];

/**
 * SocialFlipButton — Interactive 7-tile 3D letter-to-icon flip bar spelling CONNECT,
 * connecting Berry Alloys Limited direct channels and internal sections without dead links.
 */
export function SocialFlipButton({
  heading = 'Channels & Connect',
  className,
}: SocialFlipButtonProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  return (
    <div className={cn('space-y-2.5', className)}>
      <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
        {heading}
      </p>

      <div
        className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white dark:bg-[#191C20] border border-[#141618]/15 dark:border-[#F3F0E9]/14"
        style={{ perspective: '1000px' }}
      >
        {CONNECT_TILES.map((item) => {
          const tileContent = (
            <span className="relative block w-9 h-9 preserve-3d transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-y-180 group-focus-visible:rotate-y-180 motion-reduce:transition-none motion-reduce:group-hover:rotate-y-0">
              {/* Front Face — Letter */}
              <span className="backface-hidden absolute inset-0 flex items-center justify-center bg-[#ECE8DF] dark:bg-[#20242A] border border-[#141618]/12 dark:border-[#F3F0E9]/12 font-display text-sm font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
                {item.letter}
              </span>
              {/* Back Face — Social / Contact Glyph */}
              <span className="backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center bg-[#9E4B28] dark:bg-[#EC743C] text-[#F6F4EF] dark:text-[#141618]">
                {item.icon}
              </span>
            </span>
          );

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                title={item.label}
                aria-label={item.label}
                onMouseEnter={() => setActiveNote(item.note)}
                onFocus={() => setActiveNote(item.note)}
                onClick={() => setActiveNote(item.note)}
                className="group block cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EC743C]"
              >
                {tileContent}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.to ?? '/contact'}
              title={item.label}
              aria-label={item.label}
              onMouseEnter={() => setActiveNote(item.note)}
              onFocus={() => setActiveNote(item.note)}
              onClick={() => setActiveNote(item.note)}
              className="group block cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EC743C]"
            >
              {tileContent}
            </Link>
          );
        })}
      </div>

      {activeNote && (
        <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB] leading-snug max-w-sm">
          {activeNote}
        </p>
      )}
    </div>
  );
}

export default SocialFlipButton;
