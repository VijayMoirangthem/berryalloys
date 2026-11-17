import { CERTIFICATIONS, CREDENTIALS_AND_AWARDS, MEMBERSHIPS } from './company';
import { StackedLogoItem } from '../components/ui/StackedLogos';
import { LogoSlider } from '../components/ui/LogoSlider';
import { StackedLogos } from '../components/ui/StackedLogos';

/**
 * Renders the continuous horizontal LogoSlider ribbon showcasing verified
 * ISO systems, institutional ratings, export recognitions, and industry bodies.
 */
export function CredentialLogoMarquee({ className = '' }: { className?: string }) {
  const badges = [
    ...CERTIFICATIONS.map((c) => ({
      code: c.code,
      label: 'Management Standard',
    })),
    { code: 'CRISIL A-', label: 'Homepage Displayed Rating' },
    { code: 'ICRA AA-', label: 'Homepage Displayed Rating' },
    { code: 'Three Star Export House', label: 'Govt. of India Recognition' },
    { code: 'ET Edge 2026', label: 'Best Organization to Work' },
    ...MEMBERSHIPS.map((m) => ({
      code: m.name,
      label: m.role,
    })),
    { code: 'POSCO', label: 'Referenced Steelmaker Client' },
    { code: 'Vizag Steel Award', label: 'Displayed Sector Recognition' },
  ];

  const sliderItems = badges.map((badge) => (
    <div
      key={badge.code}
      className="flex items-center gap-3 px-4 py-2 border border-[#141618]/14 dark:border-[#F3F0E9]/14 bg-[#FFFFFF]/85 dark:bg-[#20242A]/90 whitespace-nowrap"
    >
      <span className="w-1.5 h-1.5 bg-[#9E4B28] dark:bg-[#EC743C] shrink-0" aria-hidden="true" />
      <span className="font-display text-base font-bold uppercase tracking-wide text-[#141618] dark:text-[#F3F0E9]">
        {badge.code}
      </span>
      <span className="text-[11px] font-mono-tabular text-[#4A5054] dark:text-[#A1A7AB]">
        {badge.label}
      </span>
    </div>
  ));

  return (
    <LogoSlider
      items={sliderItems}
      speed={36}
      gap="1.25rem"
      logoHeight="3.75rem"
      pauseOnHover
      className={className}
    />
  );
}

/**
 * Renders the 4-column StackedLogos hover-glow matrix cycling pairs of
 * verified standards, ratings, industry bodies, and export credentials.
 */
export function CredentialStackedMatrix({ className = '' }: { className?: string }) {
  const groups: StackedLogoItem[][] = [
    [
      {
        id: 'iso-9001',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Quality System
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              ISO 9001:2015
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">Assay & Process Control</p>
          </div>
        ),
      },
      {
        id: 'iso-14001',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Environmental
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              ISO 14001:2015
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">Smelting Site Stewardship</p>
          </div>
        ),
      },
    ],
    [
      {
        id: 'iso-45001',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Occupational Safety
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              ISO 45001:2018
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">Workforce Shopfloor Safety</p>
          </div>
        ),
      },
      {
        id: 'iso-14067',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Product Carbon
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              ISO 14067:2018
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">CBAM Q4 2023 Aligned</p>
          </div>
        ),
      },
    ],
    [
      {
        id: 'crisil-icra',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Credit Ratings
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              CRISIL A- / ICRA AA-
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">Displayed Website Badges</p>
          </div>
        ),
      },
      {
        id: 'three-star-export',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              DGFT Status
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              3-Star Export House
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">Visakhapatnam Marine Dispatch</p>
          </div>
        ),
      },
    ],
    [
      {
        id: 'imni-ifapa',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Industry Bodies
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              IMnI · IFAPA
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">Fastmarkets · CRU</p>
          </div>
        ),
      },
      {
        id: 'et-edge-vizag',
        node: (
          <div className="space-y-1">
            <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#9E4B28] dark:text-[#EC743C]">
              Recognitions
            </p>
            <p className="font-display text-2xl font-bold uppercase text-[#141618] dark:text-[#F3F0E9]">
              {CREDENTIALS_AND_AWARDS[3].title.replace(' Best Organization 2026', ' 2026')}
            </p>
            <p className="text-[11px] text-[#4A5054] dark:text-[#A1A7AB]">Vizag Steel Award · POSCO</p>
          </div>
        ),
      },
    ],
  ];

  return <StackedLogos logoGroups={groups} duration={14} className={className} />;
}
