import { ASSETS } from './assets';

export type AwardCategory =
  | 'Brand & Workplace'
  | 'Sustainability & Social Impact'
  | 'Leadership'
  | 'Export & Customer';

export const AWARD_CATEGORIES: ReadonlyArray<AwardCategory> = [
  'Brand & Workplace',
  'Sustainability & Social Impact',
  'Leadership',
  'Export & Customer',
];

export interface AwardImageAsset {
  src: string;
  alt: string;
  caption: string;
  provenance: string;
}

export interface AwardRecord {
  id: string;
  title: string;
  recipient: string;
  category: AwardCategory;
  /** The year or period the recognition pertains to (null when not published in source). */
  awardYear: string | null;
  /** Published announcement or archive date on berryalloys.com (null when undated). */
  announcementDate: string | null;
  /** Primary display date in the chronological ledger. */
  displayDate: string;
  /** Sort order (newest published / recognised first). */
  sortOrder: number;
  issuer: string;
  distinctionLabel?: string;
  description: string;
  sourceUrl: string;
  sourceLabel: 'Company announcement' | 'Company website';
  verificationNote?: string;
  /** Only populated when an authentic, non-duplicate visual asset is verified for this record. */
  image?: AwardImageAsset;
}

/**
 * Verified public awards and recognition archive compiled strictly from berryalloys.com records.
 * Distinctions between award year vs. announcement date, Jury Recognition vs. Winner,
 * "selected" leadership language, unidentified issuers, and limited-detail listings are preserved verbatim.
 */
export const AWARD_RECORDS: AwardRecord[] = [
  {
    id: 'community-sustainability-manufacturing-2026',
    title: 'Community-Driven Sustainability Impact in Manufacturing — Winners Award',
    recipient: 'Berry Alloys Limited',
    category: 'Sustainability & Social Impact',
    awardYear: '2026',
    announcementDate: '5 October 2026',
    displayDate: '5 Oct 2026',
    sortOrder: 1,
    issuer: 'Issuer not named in published summary',
    distinctionLabel: 'Winners Award',
    description:
      'Published in the Berry Alloys news index as a Winners Award recognising community-driven sustainability initiatives linked to manufacturing operations. Kept strictly distinct from the ICC Social Impact Jury Recognition until full awarding-body documentation is attached.',
    sourceUrl: 'https://berryalloys.com/from-vision-to-reality-gajanan-ferros-integrated-steel-ferro-alloys-hub-copy/',
    sourceLabel: 'Company announcement',
    verificationNote:
      'The published company announcement features the ceremony presentation dated 5 October 2026 without specifying the awarding body in headline text. Kept separate from the March 2026 ICC Jury Recognition.',
    image: {
      src: ASSETS.awardSustainability2026.src,
      alt: ASSETS.awardSustainability2026.alt,
      caption: 'Berry Alloys leadership receiving the Winners Award for Community-Driven Sustainability Impact in Manufacturing.',
      provenance: 'Official ceremony photograph published on berryalloys.com (5 October 2026)',
    },
  },
  {
    id: 'et-edge-best-organization-to-work-2026',
    title: 'Best Organization to Work 2026',
    recipient: 'Berry Alloys Limited',
    category: 'Brand & Workplace',
    awardYear: '2026',
    announcementDate: '29 June 2026',
    displayDate: '29 Jun 2026',
    sortOrder: 2,
    issuer: 'ET Edge',
    distinctionLabel: 'Workplace Recognition',
    description:
      'ET Edge recognition highlighting workplace culture, cross-functional training, occupational safety protocols, and people-first operational practices across Berry Alloys Limited’s plant and corporate teams.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
    sourceLabel: 'Company announcement',
    image: {
      src: ASSETS.awardEtEdgeCeremony2026.src,
      alt: ASSETS.awardEtEdgeCeremony2026.alt,
      caption: 'Berry Alloys leadership accepting the ET Edge Best Organisations to Work 2026 honour on stage.',
      provenance: 'Official stage ceremony photograph published on berryalloys.com (29 June 2026)',
    },
  },
  {
    id: 'hurun-india-founders-awards-2026',
    title: "JM Financial Hurun India Founders' Awards 2026",
    recipient: 'Shri Vijay Gupta, Managing Director',
    category: 'Leadership',
    awardYear: '2026',
    announcementDate: '1 May 2026',
    displayDate: '1 May 2026',
    sortOrder: 3,
    issuer: 'JM Financial & Hurun India',
    distinctionLabel: 'Founder Felicitation',
    description:
      'Managing Director Shri Vijay Gupta was felicitated at the JM Financial Hurun India Founders’ Awards 2026 in recognition of entrepreneurial stewardship across ferro alloy smelting, steelmaking, and bulk exports.',
    sourceUrl: 'https://berryalloys.com/jm-financial-hurun-india-founders-awards-2026/',
    sourceLabel: 'Company announcement',
    verificationNote:
      'Official felicitation announcement published on berryalloys.com on 1 May 2026.',
    image: {
      src: ASSETS.awardHurun2026.src,
      alt: ASSETS.awardHurun2026.alt,
      caption: 'Managing Director Shri Vijay Gupta honoured on stage at the JM Financial Hurun India Founders’ Awards 2026.',
      provenance: 'Official felicitation photograph published on berryalloys.com (1 May 2026)',
    },
  },
  {
    id: 'et-best-brand-of-2025',
    title: 'Best Brand of 2025',
    recipient: 'Berry Alloys Limited (accepted by CMO Vandit Gupta)',
    category: 'Brand & Workplace',
    awardYear: '2025',
    announcementDate: '6 April 2026',
    displayDate: '6 Apr 2026',
    sortOrder: 4,
    issuer: 'ET Best Brands Awards',
    distinctionLabel: 'Brand Recognition · 2025 Cohort',
    description:
      'Berry Alloys Limited was honoured as Best Brand of 2025 in India at the ET Best Brands Awards, with Chief Marketing Officer Vandit Gupta accepting the recognition on behalf of the company.',
    sourceUrl: 'https://berryalloys.com/berry-alloys-limited-honoured-as-best-brand-of-2025-in-india/',
    sourceLabel: 'Company announcement',
    verificationNote:
      'Award covers the 2025 Best Brand cohort; published ceremony announcement on berryalloys.com is dated 6 April 2026.',
    image: {
      src: ASSETS.awardBestBrand2025.src,
      alt: ASSETS.awardBestBrand2025.alt,
      caption: 'Chief Marketing Officer Vandit Gupta accepting the ET Best Brand of 2025 trophy for Berry Alloys Limited.',
      provenance: 'Official ceremony photograph published on berryalloys.com (6 April 2026)',
    },
  },
  {
    id: 'icc-social-impact-jury-recognition-2026',
    title: 'ICC Social Impact Awards — Jury Recognition',
    recipient: 'Berry Alloys Limited',
    category: 'Sustainability & Social Impact',
    awardYear: '2026',
    announcementDate: '12 March 2026',
    displayDate: '12 Mar 2026',
    sortOrder: 5,
    issuer: 'Indian Chamber of Commerce (ICC)',
    distinctionLabel: 'Jury Recognition',
    description:
      'Received Jury Recognition at the 8th ICC Social Impact Summit & Awards, acknowledging grassroots community initiatives including preventive medical camps, rural school infrastructure, drinking water access, and environmental stewardship.',
    sourceUrl: 'https://berryalloys.com/berry-alloys-receives-recognition-award-at-icc-social-impact/',
    sourceLabel: 'Company announcement',
    verificationNote:
      'Preserved specifically as Jury Recognition in accordance with the published announcement dated 12 March 2026.',
    image: {
      src: ASSETS.awardIccSocial2026.src,
      alt: ASSETS.awardIccSocial2026.alt,
      caption: 'Berry Alloys representative receiving Jury Recognition at the 8th ICC Social Impact Summit & Awards.',
      provenance: 'Official ceremony photograph published on berryalloys.com (12 March 2026)',
    },
  },
  {
    id: 'visionary-outstanding-entrepreneur-2025',
    title: 'Visionary & Outstanding Entrepreneur of the Year 2025 – India',
    recipient: 'Shri Vijay Gupta, Managing Director',
    category: 'Leadership',
    awardYear: '2025',
    announcementDate: null,
    displayDate: '2025',
    sortOrder: 6,
    issuer: 'Published on company About profile',
    distinctionLabel: 'Leadership Selection',
    description:
      'Berry Alloys Limited’s official About page records that Managing Director Shri Vijay Gupta was selected as Visionary & Outstanding Entrepreneur of the Year 2025 – India.',
    sourceUrl: 'https://berryalloys.com/about-us-ferro-alloys-manufacturers-in-india/',
    sourceLabel: 'Company website',
    verificationNote:
      'Preserves the company About page wording ("selected") without adding an unverified awarding-body citation.',
  },
  {
    id: 'three-star-export-house',
    title: 'Three Star Export House',
    recipient: 'Berry Alloys Limited',
    category: 'Export & Customer',
    awardYear: '2023',
    announcementDate: '13 August 2025',
    displayDate: '2023 · Media 13 Aug 2025',
    sortOrder: 7,
    issuer: 'Government of India (DGFT Export Recognition)',
    distinctionLabel: 'Export Status',
    description:
      'Government of India export house status reflecting sustained bulk ferro alloy export volumes shipped via Visakhapatnam Harbour Port to steelmakers across international markets. Recorded on the 2023 company timeline and in the 13 August 2025 media archive.',
    sourceUrl: 'https://berryalloys.com/three-star-export-house/',
    sourceLabel: 'Company announcement',
    verificationNote:
      'Certificate validity period is not stated in published web pages and is omitted here pending official certificate copy.',
  },
  {
    id: 'vizag-steel-award',
    title: 'Vizag Steel Award',
    recipient: 'Berry Alloys Limited',
    category: 'Export & Customer',
    awardYear: null,
    announcementDate: null,
    displayDate: 'Published listing',
    sortOrder: 8,
    issuer: 'Vizag Steel (RINL)',
    distinctionLabel: 'Customer Recognition · Limited Detail',
    description:
      'Listed among customer and institutional recognitions on the Berry Alloys Limited website. Published web copy does not specify the award year, category, or formal citation text.',
    sourceUrl: 'https://berryalloys.com/about-us-ferro-alloys-manufacturers-in-india/',
    sourceLabel: 'Company website',
    verificationNote:
      'Year, award category, and plaque photography are not published online and are left unstated rather than inferred.',
  },
];

export interface ManagementCredential {
  code: string;
  standard: string;
  scope: string;
  statusNote: string;
}

/** Kept strictly separate from awards & recognitions. */
export const MANAGEMENT_CREDENTIALS: ManagementCredential[] = [
  {
    code: 'ISO 9001:2015',
    standard: 'Quality Management System',
    scope: 'Batch chemistry control, furnace operating procedures, and metallurgical testing discipline.',
    statusNote: 'Reported on berryalloys.com; certificate numbers and registrar validity pending document archive upload.',
  },
  {
    code: 'ISO 14001:2015',
    standard: 'Environmental Management System',
    scope: 'Plant environmental monitoring, emissions abatement, and resource stewardship across smelting complexes.',
    statusNote: 'Reported on berryalloys.com; certificate copy pending archive verification.',
  },
  {
    code: 'ISO 45001:2018',
    standard: 'Occupational Health & Safety Management',
    scope: 'Shopfloor safety briefings, high-temperature operational controls, and workforce health protocols.',
    statusNote: 'Reported on berryalloys.com; certificate copy pending archive verification.',
  },
  {
    code: 'ISO 14067:2018',
    standard: 'Carbon Footprint of Products (CFP)',
    scope: 'Product-level greenhouse gas quantification framework aligned with Q4 2023 EU CBAM emission reporting.',
    statusNote: 'Reported on berryalloys.com sustainability disclosures; third-party verification statement pending archive upload.',
  },
];

export interface CreditRatingDisclosureItem {
  agency: string;
  websiteMention: string;
  verificationRequirement: string;
}

/** Kept strictly separate from awards; avoids presenting unverified current badges as live agency ratings. */
export const CREDIT_RATING_DISCLOSURE: {
  heading: string;
  summary: string;
  agencies: CreditRatingDisclosureItem[];
} = {
  heading: 'Credit Rating Disclosure & Verification Status',
  summary:
    'Berry Alloys Limited’s public website references external credit ratings from CRISIL and ICRA. Because credit ratings are instrument-specific, dated, and subject to periodic agency surveillance, they are presented here as a verification disclosure rather than live rating badges until current agency rationales, facility instruments, and outlooks are attached.',
  agencies: [
    {
      agency: 'CRISIL Ratings',
      websiteMention: 'Referenced on company website credentials strip.',
      verificationRequirement: 'Requires latest dated CRISIL rating rationale, rated bank-loan instrument, and current outlook prior to live badge display.',
    },
    {
      agency: 'ICRA Limited',
      websiteMention: 'Referenced on company website credentials strip.',
      verificationRequirement: 'Requires latest dated ICRA press release, instrument scope, and active surveillance status prior to live badge display.',
    },
  ],
};
