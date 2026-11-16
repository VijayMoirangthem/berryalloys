export interface OfficeLocation {
  id: string;
  label: string;
  address: string;
  phone: string;
  email: string;
  note?: string;
}

export interface FacilityNode {
  id: string;
  name: string;
  region: string;
  role: string;
  status: 'Active / Highlighted' | 'Documented Office' | 'Reported Expansion';
  detail: string;
  coordinates: { x: number; y: number };
}

export interface GrowthMilestone {
  year: string;
  headline: string;
  capacitySummary: string;
  details: string;
  sourceStage: 'Official Website Growth Story' | 'Company News & SIPB Disclosure';
}

export const GROWTH_TIMELINE: GrowthMilestone[] = [
  {
    year: '2010',
    headline: 'First Submerged-Arc Furnaces Commissioned',
    capacitySummary: '2 × 10 MVA · 36,000 TPA',
    details:
      'Started commercial ferro alloy smelting operations with 2 × 10 MVA capacity, establishing an initial total output of 36,000 TPA.',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2016',
    headline: 'First Capacity Expansion Wave',
    capacitySummary: '+1 × 10 MVA · 54,000 TPA',
    details:
      'Added 1 × 10 MVA submerged-arc furnace capacity, scaling total alloy production capacity to 54,000 TPA.',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2017',
    headline: 'Twin Furnace Addition',
    capacitySummary: '+2 × 10 MVA · 90,000 TPA',
    details:
      'Expanded smelting bays with 2 × 10 MVA furnaces, taking total metallurgical output capacity to 90,000 TPA.',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2020',
    headline: 'Government of India Star Export House',
    capacitySummary: 'Export Recognition',
    details:
      'Awarded Star Export House status by the Government of India in recognition of consistent overseas bulk alloy shipments through Visakhapatnam Port.',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2021',
    headline: 'High-Rating Scale-Up & 12 MVA Furnaces',
    capacitySummary: '+2 × 12 MVA · 1,35,000 TPA',
    details:
      'Commissioned 2 × 12 MVA furnaces to lift production capacity to 1,35,000 TPA. Timeline notes CRISIL milestone (homepage credentials also show CRISIL A- and ICRA AA-).',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2022',
    headline: 'Multi-Furnace Scaling Across Complexes',
    capacitySummary: '+2 × 12 MVA & +4 × 8.25 MVA · 3,20,000 TPA',
    details:
      'Added 2 × 12 MVA and 4 × 8.25 MVA furnaces, bringing total company-reported timeline capacity to 3,20,000 TPA.',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2023',
    headline: 'AOD Converter, ISO 14067 & Three Star Export House',
    capacitySummary: '6,000 MT/mo MC/LC Converter · CBAM Q4 2023',
    details:
      'Added a 6,000 MT/month converter for Medium/Low Carbon Ferro Manganese, obtained ISO 14067:2018 carbon footprint certification, published Q4 2023 CBAM reporting, and earned Three Star Export House recognition.',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2025',
    headline: 'DRI Integration, 30 MVA Works & R&D Lab',
    capacitySummary: '1,000 TPD DRI & 2 × 30 MVA Initiated · LC SiMn',
    details:
      'Initiated work on 1,000 MT/day DRI integration and 2 × 30 MVA smelting expansion alongside establishment of an in-house R&D laboratory and Low Carbon Silico Manganese production.',
    sourceStage: 'Official Website Growth Story',
  },
  {
    year: '2026+',
    headline: 'ET Edge 2026, ₹1,200 Cr Bobbili & Unit-2 Jharkhand',
    capacitySummary: '₹1,200 Cr AP Project · Unit-2 DRI · 56 Chowringhee',
    details:
      'Named an ET Edge Best Organization to Work 2026; listed ₹1,200 crore (93.43 acres, projected 813 jobs) project allocation at Bobbili Growth Centre and Kadambera Unit-2 (2 × 1,000 TPD DRI + 90 MW WHR), alongside announced future office at 56 Chowringhee Road, Kolkata.',
    sourceStage: 'Company News & SIPB Disclosure',
  },
];

export const COMPANY_INFO = {
  legalName: 'Berry Alloys Limited',
  shortName: 'Berry Alloys',
  cin: 'U27310WB2006PLC145016',
  incorporationDate: '29 September 2006',
  incorporationYearNote: 'CIN U27310WB2006PLC145016 confirms public limited incorporation on 29 September 2006 under RoC Kolkata, West Bengal.',
  primaryWebsite: 'https://berryalloys.com/',
  mission:
    'To deliver dependable, specification-grade bulk ferro alloys through disciplined smelting operations, technical precision, continuous employee development, and enduring customer trust.',
  vision:
    'To strengthen India’s position in global ferro alloy supply while advancing responsible resource stewardship, workplace safety, and measurable community upliftment.',
  legacyNarrative: {
    groupName: 'DKG Group Heritage',
    founderName: 'Late Shri Dashrath Kumar Gupta',
    founderNote:
      'Rooted in the industrial ethos of Late Shri Dashrath Kumar Gupta, founder of the DKG Group, Berry Alloys Limited translates multi-generational trading and manufacturing discipline into high-temperature metallurgical execution.',
    alliedEnterprise:
      'Within the broader promoter entrepreneurial footprint—including Captain Steel India co-founded by Managing Director Shri Vijay Gupta—the group built deep institutional relationships across primary steelmaking, raw ore procurement, and East Coast export logistics.',
    geographyStory:
      'From first submerged-arc furnaces commissioned in 2010 to multi-unit operations spanning Bobbili Growth Centre (Vizianagaram, Andhra Pradesh) and Kadambeda Village / Dhalbhumgarh (Singhbhum East, Jharkhand), the company links eastern India’s mineral belt directly to global vessels via Visakhapatnam Harbour Port.',
  },
  values: [
    {
      title: 'Integrity & Transparency',
      description: 'Ethical governance, statutory compliance, and straightforward commercial conduct across every trade contract and regulatory filing.',
    },
    {
      title: 'Metallurgical Excellence',
      description: 'Disciplined submerged-arc furnace control, AOD decarburisation precision, and exact sieve-sizing for steelmakers.',
    },
    {
      title: 'Safety & Occupational Health',
      description: 'ISO 45001-aligned shopfloor protocols paired with regular multi-specialty medical camps for plant personnel.',
    },
    {
      title: 'Sustainability & Green Stewardship',
      description: 'Captive solar and wind integration, carbon footprint measurement (ISO 14067), CBAM transparency, and green-belt plantations.',
    },
    {
      title: 'Teamwork & Empowerment',
      description: 'Collaborative engineering, inclusive equal-opportunity recruitment, and employee family welfare programs.',
    },
    {
      title: 'Customer-First Accountability',
      description: 'Traceable assay verification and reliable port-to-mill dispatch scheduling across domestic and international markets.',
    },
  ],
  leadershipTeam: [
    {
      name: 'Shri Sanjay Gupta',
      role: 'Chairman, Berry Alloys Limited',
      summary:
        'Guides corporate governance, strategic capital allocation across smelting complexes, and long-term banking and institutional partnerships.',
    },
    {
      name: 'Shri Vijay Gupta',
      role: 'Managing Director & Founder',
      summary:
        'Second-generation industrialist with over 25 years across ferro alloys, steel (co-founder of Captain Steel India), real estate, and international exports.',
    },
  ],
  managingDirector: {
    name: 'Shri Vijay Gupta',
    role: 'Managing Director',
    attributionNote: 'Consolidated from published company profiles and CSR memorial records.',
    bio: [
      'Shri Vijay Gupta leads Berry Alloys Limited as Managing Director, bringing over 25 years of industrial and commercial experience spanning steel, ferro alloys, real estate, and international exports.',
      'A second-generation industrialist and philanthropist from the DKG Group lineage, he founded Berry Alloys Limited and previously co-founded Captain Steel India, shaping long-term metallurgical manufacturing and export capabilities across eastern and coastal India.',
    ],
    recognitionClaim:
      'Named “Visionary & Outstanding Entrepreneur of the Year 2025 – India” in company disclosures (certificate archive pending independent confirmation).',
  },
};

export const OFFICES: OfficeLocation[] = [
  {
    id: 'head-office',
    label: 'Head Office (Kolkata)',
    address: '21A, Shakespeare Sarani, Shakespear Court, 5th Floor, Kolkata 700017, West Bengal',
    phone: '+91 33 40112525',
    email: 'marketing@berryalloys.in',
  },
  {
    id: 'director-office',
    label: 'Director Office & Vizag Logistics (Visakhapatnam)',
    address: 'GF-1, Siri Avenue, Latha Hospital Lane, Visakhapatnam 530003, Andhra Pradesh',
    phone: '0891 2514800',
    email: 'marketing@berryalloys.in',
  },
  {
    id: 'jamshedpur-plant',
    label: 'Jamshedpur Plant (Dhalbhumgarh)',
    address: 'Kadambeda Village, Post Dhalbhumgarh, Singhbhum East district, Jharkhand 832302',
    phone: '+91 33 40112525',
    email: 'marketing@berryalloys.in',
  },
];

export const UPCOMING_OFFICE_NOTICE = {
  title: 'Announced Future Corporate Office',
  address: '56, Chowringhee Road, Kolkata 700071, West Bengal',
  note: 'Announced on the company homepage alongside Berry Corporate House; operational move date and active contact transition await formal confirmation. Current Head Office remains 21A, Shakespeare Sarani.',
};

export const FACILITY_NODES: FacilityNode[] = [
  {
    id: 'vizianagaram',
    name: 'Vizianagaram / Bobbili Works',
    region: 'Andhra Pradesh',
    role: 'Primary highlighted ferro alloy manufacturing complex (Bobbili Growth Centre)',
    status: 'Active / Highlighted',
    detail: 'Core smelting and AOD refining hub highlighted on the company website for bulk manganese and silicon alloy production, plus announced ₹1,200 Cr / 93.43-acre expansion project.',
    coordinates: { x: 268, y: 278 },
  },
  {
    id: 'visakhapatnam-port',
    name: 'Visakhapatnam Harbour Port & Director Office',
    region: 'Andhra Pradesh',
    role: 'Deep-water export gateway & Director Office (Visakhapatnam 530003)',
    status: 'Active / Highlighted',
    detail: 'Coastal maritime logistics corridor supporting Three Star Export House containerised and bulk shipments alongside regional executive coordination.',
    coordinates: { x: 245, y: 312 },
  },
  {
    id: 'dhalbhumgarh',
    name: 'Dhalbhumgarh / Kadambeda Plant',
    region: 'Singhbhum East, Jharkhand',
    role: 'Manufacturing facility (Kadambeda Village, Dhalbhumgarh 832302)',
    status: 'Active / Highlighted',
    detail: 'Eastern India smelting complex with reported Unit-2 Kadambera expansion plans announced in August 2026.',
    coordinates: { x: 356, y: 158 },
  },
  {
    id: 'ghatsila',
    name: 'Ghatsila Operations & Expansion',
    region: 'Jharkhand',
    role: 'Existing 24 MVA furnace operations & planned DRI/WHR integration site',
    status: 'Reported Expansion',
    detail: 'Company sustainability records report existing 24 MVA furnace operations alongside planned two 1,000 TPD DRI plants and 90 MW waste heat recovery.',
    coordinates: { x: 380, y: 170 },
  },
  {
    id: 'kolkata',
    name: 'Kolkata Head Office',
    region: 'West Bengal',
    role: 'Registered Head Office (21A, Shakespeare Sarani, Kolkata 700017)',
    status: 'Documented Office',
    detail: 'Corporate governance, finance, MIS, and commercial marketing headquarters; future corporate office announced at 56 Chowringhee Road.',
    coordinates: { x: 432, y: 184 },
  },
];

export const CERTIFICATIONS = [
  { code: 'ISO 9001:2015', scope: 'Quality Management Systems (website-reported)' },
  { code: 'ISO 14001:2015', scope: 'Environmental Management Systems (website-reported)' },
  { code: 'ISO 45001:2018', scope: 'Occupational Health & Safety Management (website-reported)' },
  { code: 'ISO 14067:2018', scope: 'Carbon Footprint of Products framework & 2023 certification' },
];

export const CREDENTIALS_AND_AWARDS = [
  { title: 'CRISIL A-', detail: 'Credit rating badge displayed on company homepage (rating instrument/date pending audit archive)' },
  { title: 'ICRA AA-', detail: 'Credit rating badge displayed on company homepage (rating instrument/date pending audit archive)' },
  { title: 'Three Star Export House', detail: 'Awarded in 2023 Growth Story and listed in company news (13 August 2025)' },
  { title: 'ET Edge Best Organization 2026', detail: 'Best Organization to Work 2026 recognition displayed on homepage & June 2026 news' },
  { title: 'Vizag Steel Award', detail: 'Displayed on company homepage partner & award strip' },
];

export const MEMBERSHIPS = [
  { name: 'IMnI', role: 'International Manganese Institute' },
  { name: 'IFAPA', role: 'Indian Ferro Alloy Producers Association' },
  { name: 'Fastmarkets', role: 'Platinum Sponsorship (as displayed on homepage)' },
  { name: 'CRU', role: 'Industry analytics & market affiliation' },
];

export interface SustainabilityInitiative {
  id: string;
  title: string;
  stage: 'Reported / Operational' | 'Planned' | 'Exploratory';
  metric: string;
  description: string;
  verificationNote: string;
}

export const SUSTAINABILITY_INITIATIVES: SustainabilityInitiative[] = [
  {
    id: 'solar-sustainability-83',
    title: 'Solar Power Capacity (Sustainability Scope)',
    stage: 'Reported / Operational',
    metric: '83 MW',
    description:
      'Reported on the company sustainability page as part of renewable energy integration across manufacturing operations.',
    verificationNote: 'Scope distinction between this 83 MW figure and the 2.6 MW homepage project is not reconciled in source documents; figures are kept separate.',
  },
  {
    id: 'wind-29-6',
    title: 'Installed Wind Power Capacity',
    stage: 'Reported / Operational',
    metric: '29.6 MW',
    description:
      'Installed wind power capacity reported on the company sustainability page to offset grid power demand in energy-intensive smelting.',
    verificationNote: 'Company-reported figure; generation telemetry and PPA certificates pending audit.',
  },
  {
    id: 'solar-home-2-6',
    title: 'Plant Rooftop Solar Installation (Homepage Announcement)',
    stage: 'Reported / Operational',
    metric: '2.6 MW',
    description:
      'Highlighted on the company homepage alongside rooftop solar visuals as an installation lowering direct operational grid reliance.',
    verificationNote: 'Commissioning date and exact facility allocation kept distinct pending reconciliation with the 83 MW figure.',
  },
  {
    id: 'ghatsila-whr',
    title: 'Ghatsila Waste Heat Recovery & DRI Expansion',
    stage: 'Planned',
    metric: '90 MW WHR + 2 × 1,000 TPD DRI',
    description:
      'Planned expansion at Ghatsila, Jharkhand alongside existing 24 MVA furnace operations to capture process thermal energy for power generation.',
    verificationNote: 'Project stage and commissioning timeline subject to statutory and engineering milestones.',
  },
  {
    id: 'low-carbon-alloys',
    title: 'Low-Carbon Ferro Alloy & CBAM Pathways',
    stage: 'Reported / Operational',
    metric: '6,000 MT/mo AOD · ISO 14067',
    description:
      'Converter capacity for Medium/Low Carbon Ferro Manganese and Low Carbon Silico Manganese alongside ISO 14067:2018 verification and Q4 2023 CBAM reporting.',
    verificationNote: 'Product carbon content alone does not establish an externally audited Life-Cycle Assessment (LCA); full ISO 14067 certificates pending archive.',
  },
  {
    id: 'biomass-exploration',
    title: 'Biomass Reductant & Fuel Exploration',
    stage: 'Exploratory',
    metric: 'Research Phase',
    description:
      'Exploration of biomass-derived carbon alternatives to supplement conventional fossil reductants in metallurgical processes.',
    verificationNote: 'Explicitly categorized as an exploratory option; no commercial substitution volume claimed.',
  },
];
