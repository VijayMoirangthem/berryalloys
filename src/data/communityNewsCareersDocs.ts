export interface CsrStory {
  id: string;
  category: string;
  title: string;
  dateOrLocation: string;
  summary: string;
  details: string[];
}

export const CSR_STORIES: CsrStory[] = [
  {
    id: 'medical-camp-2026',
    category: 'Healthcare & Employee Welfare',
    title: 'Multi-Specialty Medical Camp with Abhaya Hospital',
    dateOrLocation: '7 January 2026 · Plant Campus',
    summary:
      'A preventive health and diagnostic camp organised in partnership with Abhaya Hospital served more than 200 employees across ENT, orthopaedic, and general medicine consultations.',
    details: [
      'Over 200 employees screened across specialist consultations',
      'Supported alongside voluntary blood donation drives and the Sri Balaji Arogya Vara Prasadini healthcare assistance scheme',
    ],
  },
  {
    id: 'women-employee-education',
    category: 'Education & Recognition',
    title: 'Academic Scholarships & Support for Employee Families',
    dateOrLocation: 'Workforce Recognition Initiative',
    summary:
      'Women employees were recognised through educational support awarded to academically successful children, including scholarships, bicycles, and school bags.',
    details: [
      'Merit scholarships supporting continued schooling',
      'Bicycles and school supplies provided directly to students',
    ],
  },
  {
    id: 'school-infrastructure',
    category: 'Rural Education',
    title: 'School Classrooms & Digital Teaching Infrastructure',
    dateOrLocation: 'Surrounding Plant Communities',
    summary:
      'Community school upgrades encompassing structural building repairs, additional classrooms, digital teaching equipment, computers, and internet connectivity.',
    details: [
      'Additional classroom construction and structural maintenance',
      'Digital learning hardware and internet access for rural classrooms',
    ],
  },
  {
    id: 'bobbili-civic-water',
    category: 'Water & Civic Infrastructure',
    title: 'RO Drinking Water Systems & Bobbili Civic Works',
    dateOrLocation: 'Bobbili Region, Andhra Pradesh',
    summary:
      'Installation of RO drinking water systems, water tank and plumbing maintenance, and civic infrastructure improvements covering roads, sanitation, street lighting, and police station facilities.',
    details: [
      'RO drinking water units and local water-tank maintenance',
      'Road, sanitation, street lighting, and reception/waiting area repairs at local police stations',
    ],
  },
  {
    id: 'st-joseph-luncheon',
    category: 'Elder Care & Heritage',
    title: 'Memorial Luncheon at St Joseph’s Old Age Home',
    dateOrLocation: 'Honouring DKG Group Founder Dashrath Kumar Gupta',
    summary:
      'A community memorial luncheon hosted for approximately 60 residents and four sisters at St Joseph’s Old Age Home, featuring interactive games and a Bible quiz.',
    details: [
      'Community gathering honouring DKG Group founder Dashrath Kumar Gupta',
      'Hosted with ~60 residents and four sisters',
    ],
  },
  {
    id: 'environment-gaushala-marathon',
    category: 'Environment & Community',
    title: 'Plantation Drives, Srikakulam Gaushala & Women’s Marathon',
    dateOrLocation: 'Plant Belt & Srikakulam',
    summary:
      'Ongoing regional stewardship combining hundreds of native saplings planted across plant grounds, comprehensive Gaushala animal care in Srikakulam, and an annual women’s marathon.',
    details: [
      'Srikakulam Gaushala support: feed, shelters, water systems, veterinary care, flooring, ventilation, and boundary walls',
      'Plant tree-planting drives and annual community women’s marathon',
    ],
  },
];

export interface NewsItem {
  slug: string;
  date: string;
  type: 'News' | 'Article';
  title: string;
  excerpt: string;
  sourceUrl: string;
  unverifiedScopeNote?: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: 'manufacturing-sustainability-community-impact-award',
    date: '5 October 2026',
    type: 'News',
    title: 'Manufacturing Sustainability and Community Impact Award',
    excerpt:
      'Berry Alloys Limited listed recognition for manufacturing sustainability and regional community impact initiatives in its October 2026 news archive.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
    unverifiedScopeNote: 'Listing headline and date retrieved from company news index; full award citation was not archived in the reference bundle.',
  },
  {
    slug: 'unit-2-kadambera-jharkhand-expansion',
    date: '19 August 2026',
    type: 'News',
    title: 'Unit 2 Expansion at Kadambera, Jharkhand — Two 1,000 TPD DRI Plants',
    excerpt:
      'Company news excerpt reports a planned Unit 2 expansion at Kadambera, Jharkhand involving an approximate Rs. 1,000 crore investment and two 1,000 TPD DRI (sponge iron) plants.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
    unverifiedScopeNote: 'Reported from company news excerpt; full project schedule and statutory filing details require confirmation.',
  },
  {
    slug: 'bobbili-growth-centre-project',
    date: '15 July 2026',
    type: 'News',
    title: 'Rs. 1,200 Crore Industrial Project at Bobbili Growth Centre',
    excerpt:
      'News listing cites a Rs. 1,200 crore project allocation across 93.43 acres at Bobbili Growth Centre, Andhra Pradesh, with an expected 813 jobs.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
    unverifiedScopeNote: 'Figures reflect the 15 July 2026 news listing excerpt; formal DPR and commissioning timeline pending verification.',
  },
  {
    slug: 'et-edge-workplace-recognition-2026',
    date: '29 June 2026',
    type: 'News',
    title: 'ET Edge Workplace Recognition 2026',
    excerpt:
      'Berry Alloys Limited recorded ET Edge 2026 workplace recognition in its June 2026 news index and homepage credentials display.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
  },
  {
    slug: 'three-star-export-house-recognition',
    date: '13 August 2025',
    type: 'News',
    title: 'Three Star Export House Recognition',
    excerpt:
      'Company news listing records Three Star Export House status recognizing sustained overseas ferro alloy export performance.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
  },
  {
    slug: 'educational-article-ferro-manganese',
    date: '7 October 2026',
    type: 'Article',
    title: 'Ferro Manganese in Modern Steelmaking: Grades and Decarburisation Control',
    excerpt:
      'Technical overview covering high-, medium-, and low-carbon ferro manganese grades, AOD purification, and manganese recovery in structural and automotive steels.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
  },
  {
    slug: 'ferro-alloys-and-infrastructure',
    date: '10 July 2026',
    type: 'Article',
    title: 'Ferro Alloys and National Infrastructure Demand',
    excerpt:
      'Editorial perspective examining how bulk manganese, silicon, and chromium alloys underpin rail, bridge, and heavy construction steel supply chains.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
  },
  {
    slug: 'steel-strength-and-durability',
    date: '6 July 2026',
    type: 'Article',
    title: 'How Alloy Chemistry Governs Steel Strength and Durability',
    excerpt:
      'A primer on deoxidation, grain refinement, and corrosion resistance delivered by manganese, silicon, and chromium ferro alloys.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
  },
  {
    slug: 'role-of-ferro-alloys-in-steelmaking',
    date: '26 May 2026',
    type: 'Article',
    title: 'The Role of Ferro Alloys in Primary and Secondary Steelmaking',
    excerpt:
      'Explores furnace and ladle addition practices for silico manganese, ferro manganese, and ferro silicon across integrated and electric arc steel mills.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
  },
  {
    slug: 'indian-ferro-alloy-manufacturing',
    date: '23 April 2026',
    type: 'Article',
    title: 'Indian Ferro Alloy Manufacturing and Export Logistics',
    excerpt:
      'Examines mineral corridors in eastern and coastal India and port-linked export workflows through Visakhapatnam Harbour Port.',
    sourceUrl: 'https://berryalloys.com/ferro-alloys-news/',
  },
];

export interface JobVacancy {
  id: string;
  title: string;
  location: string;
  qualification: string;
  experience: string;
  department: string;
  responsibilities: string[];
  skills: string[];
  statusNotice: string;
}

export const JOB_VACANCIES: JobVacancy[] = [
  {
    id: 'admin-facilities-manager',
    title: 'Administration & Facilities Manager',
    location: 'Visakhapatnam, Andhra Pradesh',
    qualification: 'B.Com, BBA, B.Sc or equivalent graduate qualification',
    experience: '2–5 years',
    department: 'Administration',
    responsibilities: [
      'Oversee office facilities, housekeeping, and physical security operations',
      'Manage local vendors, office supplies, travel arrangements, and expense control',
      'Maintain accurate administrative registers and statutory compliance documentation',
    ],
    skills: ['Microsoft Excel & Word', 'Vendor negotiation', 'Clear written & verbal communication'],
    statusNotice: 'Sourced from company careers listing — active vacancy status requires HR confirmation.',
  },
  {
    id: 'mis-executive',
    title: 'MIS Executive',
    location: 'Head Office Kolkata & Dhalbhumgarh / Ghatsila, Jharkhand',
    qualification: 'Graduate or equivalent qualification',
    experience: '2–4 years in plant or factory MIS',
    department: 'Production / MIS',
    responsibilities: [
      'Maintain daily goods receipt and issue entries alongside shift reporting',
      'Compile production, dispatch, and stock reconciliation logs across plant units',
      'Coordinate cross-department reporting and execute SAP entries (training provided; prior SAP not required)',
    ],
    skills: ['Advanced Microsoft Excel', 'Factory inventory reconciliation', 'Cross-department coordination'],
    statusNotice: 'Sourced from company careers listing — active vacancy status requires HR confirmation.',
  },
];

export const CAREERS_DEPARTMENTS = [
  'Production',
  'Quality Assurance',
  'Quality Control',
  'Purchase',
  'Sales and Marketing',
  'Finance',
  'Administration',
  'HR',
  'Engineering',
  'Research and Development',
  'IT',
];

export interface CorporateDocGroup {
  id: string;
  type: 'Annual Returns (Form MGT-7)' | 'CSR Governance & Projects' | 'Corporate Policies';
  description: string;
  sourcePageUrl: string;
  items: Array<{
    title: string;
    yearOrScope: string;
    status: string;
  }>;
}

export const CORPORATE_DOCUMENT_GROUPS: CorporateDocGroup[] = [
  {
    id: 'annual-returns',
    type: 'Annual Returns (Form MGT-7)',
    description:
      'Statutory annual return filings indexed on the Berry Alloys Limited corporate website covering seven financial years.',
    sourcePageUrl: 'https://berryalloys.com/annual-return/',
    items: [
      { title: 'Form MGT-7 — Annual Return', yearOrScope: 'FY 2025–26', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Form MGT-7 — Annual Return', yearOrScope: 'FY 2024–25', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Form MGT-7 — Annual Return', yearOrScope: 'FY 2023–24', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Form MGT-7 — Annual Return', yearOrScope: 'FY 2022–23', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Form MGT-7 — Annual Return', yearOrScope: 'FY 2021–22', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Form MGT-7 — Annual Return', yearOrScope: 'FY 2020–21', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Form MGT-7 — Annual Return', yearOrScope: 'FY 2019–20', status: 'Linked on company portal (PDF pending local archive)' },
    ],
  },
  {
    id: 'csr-resources',
    type: 'CSR Governance & Projects',
    description:
      'Corporate Social Responsibility committee composition, policy charter, and annual project schedules.',
    sourcePageUrl: 'https://berryalloys.com/csr-policy-india/',
    items: [
      { title: 'CSR Committee Composition & Policy Charter', yearOrScope: 'Current Governance', status: 'Available via company CSR index' },
      { title: 'Annual CSR Projects Schedule', yearOrScope: 'FY 2025–26', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Annual CSR Projects Schedule', yearOrScope: 'FY 2024–25', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Annual CSR Projects Schedule', yearOrScope: 'FY 2023–24', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Annual CSR Projects Schedule', yearOrScope: 'FY 2022–23', status: 'Linked on company portal (PDF pending local archive)' },
      { title: 'Annual CSR Projects Schedule', yearOrScope: 'FY 2021–22', status: 'Linked on company portal (PDF pending local archive)' },
    ],
  },
  {
    id: 'governance-policies',
    type: 'Corporate Policies',
    description:
      'Board and statutory governance policies published for stakeholders and directors.',
    sourcePageUrl: 'https://berryalloys.com/vigil-mechanism-policy/',
    items: [
      {
        title: 'Remuneration Policy',
        yearOrScope: 'Board & Key Managerial Personnel',
        status: 'Index verified at berryalloys.com/remuneration-policy/',
      },
      {
        title: 'Vigil Mechanism / Whistleblower Policy',
        yearOrScope: 'Ethics & Compliance',
        status: 'Index verified at berryalloys.com/vigil-mechanism-policy/',
      },
      {
        title: 'Terms & Conditions of Appointment of Independent Directors',
        yearOrScope: 'Board Governance',
        status: 'Index verified at berryalloys.com/terms-and-conditions-of-appointment-of-the-independent-directors-2/',
      },
    ],
  },
];
