import {
  ALLOY_FAMILIES,
  AlloyFamily,
  AlloyProduct,
  PRODUCTS,
} from './products';
import {
  CERTIFICATIONS,
  COMPANY_INFO,
  OFFICES,
  UPCOMING_OFFICE_NOTICE,
} from './company';
import {
  CAREERS_DEPARTMENTS,
  CORPORATE_DOCUMENT_GROUPS,
  JOB_VACANCIES,
} from './communityNewsCareersDocs';
import { CONFIRMED_EXPORT_MARKETS, EXPORT_SUMMARY } from './globalPresence';

export type KnowledgeCategory =
  | 'Company'
  | 'Products and specifications'
  | 'Manufacturing and quality'
  | 'Quotations and enquiries'
  | 'Sustainability and CSR'
  | 'Documents and careers';

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  'Company',
  'Products and specifications',
  'Manufacturing and quality',
  'Quotations and enquiries',
  'Sustainability and CSR',
  'Documents and careers',
];

export interface KnowledgeAction {
  label: string;
  to: string;
  variant?: 'primary' | 'secondary';
  /** If set, carries this product slug directly into the Commercial Quotation form */
  enquiryProductSlug?: string;
}

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  question: string;
  alternativePhrases: string[];
  keywords: string[];
  answer: string;
  expandedExplanation?: string;
  relatedIds: string[];
  productSlug?: string;
  productFamily?: AlloyFamily;
  actions: KnowledgeAction[];
  featuredOnHome?: boolean;
  /** Internal curation & approval provenance — never rendered in public UI */
  internalSourceNote: string;
}

const headOffice = OFFICES.find((o) => o.id === 'head-office') ?? OFFICES[0];
const vizagOffice = OFFICES.find((o) => o.id === 'director-office') ?? OFFICES[1];
const jharkhandPlant = OFFICES.find((o) => o.id === 'jamshedpur-plant') ?? OFFICES[2];

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // =========================================================================
  // 1. COMPANY
  // =========================================================================
  {
    id: 'what-berry-manufactures',
    category: 'Company',
    question: 'What does Berry Alloys manufacture?',
    alternativePhrases: [
      'What products does Berry Alloys make?',
      'Which bulk ferro alloys do you supply?',
      'Overview of Berry Alloys manufacturing portfolio',
    ],
    keywords: [
      'manufacture',
      'produce',
      'portfolio',
      'ferro alloys',
      'manganese',
      'silicon',
      'chrome',
      'steelmaking',
      'bulk',
    ],
    answer: `Berry Alloys Limited manufactures four core bulk ferro alloy families across ${PRODUCTS.length} documented grade series: ${ALLOY_FAMILIES.join(', ')}. These inputs support deoxidation, manganese/silicon/chromium alloying, and controlled low-carbon or low-phosphorus steelmaking.`,
    expandedExplanation:
      'Grades span High, Medium, Low, and Ultra Low Carbon Ferro Manganese; High, Medium, and Low Carbon Silico Manganese (including dedicated Low Phosphorus series); Low & Medium Carbon Ferro Chrome (60–65% Cr min); and Ferro Silicon (FeSi 70 and FeSi 72). Sizing and packing are supplied to customer specification.',
    relatedIds: [
      'available-alloy-families',
      'where-see-specifications',
      'manufacturing-processes',
    ],
    actions: [
      { label: 'Explore Alloy Portfolio', to: '/products', variant: 'primary' },
      { label: 'View Homepage Alloy Explorer', to: '/#alloys', variant: 'secondary' },
    ],
    featuredOnHome: true,
    internalSourceNote: 'Derived from PRODUCTS and ALLOY_FAMILIES in products.ts.',
  },
  {
    id: 'company-legacy-overview',
    category: 'Company',
    question: 'Where can I learn about Berry Alloys Limited and its legacy?',
    alternativePhrases: [
      'Who founded Berry Alloys?',
      'Tell me about DKG Group and company leadership',
      'Company history and background',
    ],
    keywords: [
      'about',
      'legacy',
      'founder',
      'dkg group',
      'dashrath kumar gupta',
      'vijay gupta',
      'sanjay gupta',
      'history',
      '2006',
      'cin',
      'captain steel',
    ],
    answer: `${COMPANY_INFO.legalName} (incorporated ${COMPANY_INFO.incorporationDate}, CIN ${COMPANY_INFO.cin}) is rooted in the DKG Group founded by ${COMPANY_INFO.legacyNarrative.founderName}. Corporate governance is led by Chairman Shri Sanjay Gupta and Managing Director Shri Vijay Gupta.`,
    expandedExplanation:
      'Since commissioning its first submerged-arc furnaces (2 × 10 MVA) in 2010, the company has scaled across Bobbili Growth Centre (Andhra Pradesh) and Dhalbhumgarh / Ghatsila (Jharkhand), earning Three Star Export House status and expanding into AOD refining and DRI integration.',
    relatedIds: [
      'facilities-offices-locations',
      'manufacturing-processes',
      'corporate-documents-filings',
    ],
    actions: [
      { label: 'About, Legacy & Leadership', to: '/about', variant: 'primary' },
      { label: 'Read Growth Chronicle (2010–2026+)', to: '/#chronicle', variant: 'secondary' },
    ],
    internalSourceNote: 'Derived from COMPANY_INFO and GROWTH_TIMELINE in company.ts.',
  },
  {
    id: 'facilities-offices-locations',
    category: 'Company',
    question: 'Where are Berry Alloys’ manufacturing plants and offices located?',
    alternativePhrases: [
      'Plant locations in Andhra Pradesh and Jharkhand',
      'Head office address in Kolkata and Visakhapatnam',
      'Where is the factory or export port?',
    ],
    keywords: [
      'location',
      'locations',
      'office',
      'offices',
      'plant',
      'plants',
      'factory',
      'bobbili',
      'vizianagaram',
      'visakhapatnam',
      'vizag',
      'dhalbhumgarh',
      'jamshedpur',
      'ghatsila',
      'kolkata',
      'chowringhee',
      'address',
    ],
    answer: `Published operations span manufacturing facilities in Bobbili Growth Centre (Vizianagaram, Andhra Pradesh) and ${jharkhandPlant.address}, supported by the ${headOffice.label} (${headOffice.address}) and ${vizagOffice.label} (${vizagOffice.address}).`,
    expandedExplanation: `Overseas containerised and bulk shipments route through Visakhapatnam Harbour Port. The company website also announces an upcoming corporate office at ${UPCOMING_OFFICE_NOTICE.address}; active commercial headquarters remain at 21A, Shakespeare Sarani pending formal move confirmation.`,
    relatedIds: ['how-contact-company', 'company-legacy-overview', 'how-request-quotation'],
    actions: [
      { label: 'View Offices & Contact Page', to: '/contact', variant: 'primary' },
      { label: 'Inspect Facility Corridor Map', to: '/#presence', variant: 'secondary' },
    ],
    featuredOnHome: true,
    internalSourceNote: 'Derived from OFFICES, FACILITY_NODES, and UPCOMING_OFFICE_NOTICE in company.ts.',
  },

  {
    id: 'export-markets-countries',
    category: 'Company',
    question: 'Which countries does Berry Alloys export to?',
    alternativePhrases: [
      'Export markets and destination countries',
      'Does Berry Alloys export to Japan, Korea, Europe or the Middle East?',
      'Where do you ship ferro alloys internationally?',
    ],
    keywords: [
      'export',
      'exports',
      'exporting',
      'countries',
      'country',
      'markets',
      'international',
      'overseas',
      'global',
      'abroad',
      'destination',
      'japan',
      'korea',
      'vietnam',
      'thailand',
      'australia',
      'uae',
      'europe',
      'netherlands',
      'bangladesh',
      'nigeria',
      'africa',
      'canada',
      'usa',
    ],
    answer: `Berry Alloys exports to around ${EXPORT_SUMMARY.approxCountries} countries (${EXPORT_SUMMARY.source}). Countries named in published company and credit-rating sources include ${CONFIRMED_EXPORT_MARKETS.map((m) => m.name).join(', ')}.`,
    expandedExplanation: `Europe, West Asia and North America are also referenced at region level. The list reflects countries named in published material rather than every destination, and shipments leave through Visakhapatnam Harbour Port. For a specific destination or Incoterm, please send an enquiry.`,
    relatedIds: ['facilities-offices-locations', 'how-request-quotation', 'how-contact-company'],
    actions: [
      { label: 'See Export Globe', to: '/#presence', variant: 'primary' },
      { label: 'Request an Export Quotation', to: '/contact?tab=quote', variant: 'secondary' },
    ],
    featuredOnHome: false,
    internalSourceNote:
      'Countries named on berryalloys.com ferro-alloys page (self-reported), ICRA rationales (Mar 2023, Apr 2025, Dec 2025, Apr 2026, Aug 2026: ~35-38 countries) and Volza shipment records (Korea, Netherlands). See globalPresence.sources.ts.',
  },

  // =========================================================================
  // 2. PRODUCTS AND SPECIFICATIONS
  // =========================================================================
  {
    id: 'available-alloy-families',
    category: 'Products and specifications',
    question: 'Which alloy families and grade series are available?',
    alternativePhrases: [
      'List all ferro alloy categories',
      'What carbon tiers and phosphorus grades do you offer?',
      'Do you produce low carbon ferro manganese or ferro chrome?',
    ],
    keywords: [
      'families',
      'grades',
      'series',
      'femn',
      'simn',
      'fecr',
      'fesi',
      'ferro manganese',
      'silico manganese',
      'ferro chrome',
      'ferro silicon',
      'low carbon',
      'low phosphorus',
    ],
    answer:
      'Four alloy families are documented: (1) Ferro Manganese (High Carbon, Medium Carbon, Low & Ultra Low Carbon), (2) Silico Manganese (High Carbon, High Carbon Low Phos, Medium Carbon, Low Carbon, Low Carbon Low Phos), (3) Low & Medium Carbon Ferro Chrome, and (4) Ferro Silicon (70 & 72).',
    expandedExplanation:
      'Specialized trace-controlled options include Low Boron HC FeMn (50 ppm B max), Low Phosphorus HC/MC/LC FeMn and SiMn (0.10% P max), and Low Nitrogen LC FeMn (100 ppm N).',
    relatedIds: [
      'where-see-specifications',
      'compare-alloy-products',
      'enquire-particular-alloy',
    ],
    actions: [
      { label: 'Browse All 10 Grade Series', to: '/products', variant: 'primary' },
      { label: 'Interactive Alloy Showcase', to: '/#alloys', variant: 'secondary' },
    ],
    featuredOnHome: true,
    internalSourceNote: 'Derived from PRODUCTS in products.ts.',
  },
  {
    id: 'where-see-specifications',
    category: 'Products and specifications',
    question: 'Where can I view chemical composition and specification tables?',
    alternativePhrases: [
      'Show Mn Si Cr C P S percentages',
      'Chemical analysis tables for each ferro alloy',
      'Where are technical chemistry specs listed?',
    ],
    keywords: [
      'specification',
      'specifications',
      'specs',
      'chemistry',
      'chemical',
      'composition',
      'table',
      'percentage',
      'mn',
      'si',
      'cr',
      'phosphorus',
      'carbon',
      'sulfur',
      'boron',
      'nitrogen',
      'aluminium',
    ],
    answer:
      'Every product detail page under Specifications displays exact source chemistry tables—covering primary metal content alongside Si, C, P, S, and documented trace limits (B, N, or Al)—with source min/max qualifiers preserved verbatim.',
    expandedExplanation:
      'Where an original company specification cell is blank or carries a specific notation (such as nitrogen in Low Phos MC FeMn or Si header notes in HC SiMn), the table retains a clear source note rather than guessing or interpolating values.',
    relatedIds: [
      'compare-alloy-products',
      'product-related-documents',
      'available-alloy-families',
    ],
    actions: [
      { label: 'Open Specifications Directory', to: '/products', variant: 'primary' },
      {
        label: 'View HC FeMn Chemistry',
        to: '/products/high-carbon-ferro-manganese',
        variant: 'secondary',
      },
    ],
    featuredOnHome: true,
    internalSourceNote: 'Derived from AlloyProduct tables schema in products.ts.',
  },
  {
    id: 'compare-alloy-products',
    category: 'Products and specifications',
    question: 'How can I compare differences between alloy products side by side?',
    alternativePhrases: [
      'Compare two or three grades together',
      'Difference between High Carbon and Low Carbon FeMn or SiMn',
      'How does comparison matrix work?',
    ],
    keywords: [
      'compare',
      'comparison',
      'difference',
      'differences',
      'versus',
      'vs',
      'matrix',
      'side by side',
    ],
    answer:
      'You can select 2 or 3 products in either the Homepage Alloy Explorer or the Full Catalogue and open the side-by-side Comparison Matrix to inspect primary metal range, Si, C, P, S, and trace element limits together.',
    expandedExplanation:
      'Each compared product also retains a direct Quotation action so once you narrow down a carbon or phosphorus tier, you can transfer that grade directly into the quotation form.',
    relatedIds: [
      'available-alloy-families',
      'where-see-specifications',
      'enquire-particular-alloy',
    ],
    actions: [
      { label: 'Compare on Products Catalogue', to: '/products', variant: 'primary' },
      { label: 'Open Homepage Alloy Comparison', to: '/#alloys', variant: 'secondary' },
    ],
    internalSourceNote: 'Reflects CompareModal functionality in HomeAlloyShowcase.tsx and AlloyExplorer.tsx.',
  },
  {
    id: 'enquire-particular-alloy',
    category: 'Products and specifications',
    question: 'How do I enquire or prepare a quote request for a specific alloy?',
    alternativePhrases: [
      'Start an enquiry for Ferro Chrome or Silico Manganese',
      'Pass selected product into quotation form',
      'Order or enquire about a particular grade',
    ],
    keywords: [
      'enquire',
      'inquire',
      'enquiry',
      'select grade',
      'particular alloy',
      'specific product',
    ],
    answer:
      'On any product detail page, the Homepage Alloy Explorer, or inside Berry Compass, selecting a product’s quotation action pre-fills that alloy and its available grade options directly inside the Commercial Quotation Desk.',
    expandedExplanation:
      'You can also specify preferred lump sizing, packing format, and tonnage directly in the quotation form alongside the pre-selected product.',
    relatedIds: [
      'how-request-quotation',
      'what-to-include-enquiry',
      'pricing-moq-leadtime-shipping',
    ],
    actions: [
      { label: 'Open Quotation Desk', to: '/contact?tab=quote', variant: 'primary' },
      { label: 'Jump to Homepage Quotation Desk', to: '/#enquiry', variant: 'secondary' },
    ],
    internalSourceNote: 'Reflects EnquiryFormPanel pre-fill mechanism via URL param / state sync.',
  },

  // =========================================================================
  // 3. MANUFACTURING AND QUALITY
  // =========================================================================
  {
    id: 'manufacturing-processes',
    category: 'Manufacturing and quality',
    question: 'What manufacturing and smelting processes are documented?',
    alternativePhrases: [
      'How does Berry Alloys smelt its alloys?',
      'Submerged-arc furnace, AOD converter, and silicothermic routes',
      'What furnace capacities are reported?',
    ],
    keywords: [
      'manufacturing',
      'process',
      'smelting',
      'furnace',
      'submerged-arc',
      'saf',
      'aod',
      'converter',
      'decarburisation',
      'silicothermic',
      'vacuum',
      'crushing',
      'mva',
      'tpa',
    ],
    answer:
      'Berry Alloys uses three primary documented routes: submerged-arc electric furnace smelting (for HC FeMn, HC SiMn, and FeSi 70/72), a 6,000 MT/month Argon Oxygen Decarburisation (AOD) converter (for MC/LC FeMn), and silicothermic/vacuum refining (for LC & MC Ferro Chrome).',
    expandedExplanation:
      'Growth disclosures report capacity progression from 2 × 10 MVA furnaces in 2010 to multi-unit scaling by 2022, AOD commissioning in 2023, and 2025–2026 initiatives covering 1,000 TPD DRI and 30 MVA expansions alongside 24 MVA existing operations documented at Ghatsila.',
    relatedIds: [
      'quality-standards-testing',
      'facilities-offices-locations',
      'what-berry-manufactures',
    ],
    actions: [
      { label: 'View Manufacturing & Quality Page', to: '/manufacturing', variant: 'primary' },
      { label: 'See Homepage Process Sequence', to: '/#process', variant: 'secondary' },
    ],
    internalSourceNote: 'Derived from ManufacturingPage.tsx and GROWTH_TIMELINE in company.ts.',
  },
  {
    id: 'quality-standards-testing',
    category: 'Manufacturing and quality',
    question: 'Where can I find quality control and ISO certification information?',
    alternativePhrases: [
      'ISO 9001, ISO 14001, ISO 45001, ISO 14067 status',
      'How is batch chemistry tested?',
      'Credit ratings and quality credentials',
    ],
    keywords: [
      'quality',
      'qa',
      'qc',
      'testing',
      'lab',
      'spectroscopic',
      'assay',
      'iso',
      '9001',
      '14001',
      '45001',
      '14067',
      'certification',
      'certifications',
      'standards',
    ],
    answer: `Every alloy family is verified against customer chemical bands (including trace limits like boron and nitrogen where listed). Website disclosures list ${CERTIFICATIONS.map((c) => c.code).join(', ')}.`,
    expandedExplanation:
      'Source records note these ISO standards and credit ratings (CRISIL A-, ICRA AA-) as website-reported; individual scanned certificate PDFs and third-party assay audit archives are pending local attachment and can be requested via commercial contact.',
    relatedIds: [
      'product-related-documents',
      'manufacturing-processes',
      'sustainability-renewables-cbam',
    ],
    actions: [
      { label: 'Quality Assurance Details', to: '/manufacturing', variant: 'primary' },
      { label: 'Homepage Quality Section', to: '/#quality', variant: 'secondary' },
    ],
    featuredOnHome: true,
    internalSourceNote: 'Derived from CERTIFICATIONS and CREDENTIALS_AND_AWARDS in company.ts.',
  },
  {
    id: 'product-related-documents',
    category: 'Manufacturing and quality',
    question: 'Are downloadable product datasheets or test certificates available here?',
    alternativePhrases: [
      'Download product PDF brochure or spec sheet',
      'Where do I get mill test certificates (MTC) or COAs?',
      'Specification downloads',
    ],
    keywords: [
      'datasheet',
      'datasheets',
      'brochure',
      'pdf',
      'download',
      'certificate',
      'mtc',
      'coa',
      'mill test',
      'product document',
    ],
    answer:
      'Downloadable product specification PDFs or sample Mill Test Certificates (MTCs) are not bundled inside this website prototype. All documented chemistry tables are viewable directly online per grade, and specification documents can be requested through our commercial team.',
    expandedExplanation:
      'Separately, statutory corporate filings (Form MGT-7 annual returns, CSR schedules, and governance policies) are indexed with links to the official company portal on the Documents page.',
    relatedIds: [
      'where-see-specifications',
      'corporate-documents-filings',
      'how-request-quotation',
    ],
    actions: [
      { label: 'Request Datasheet via Quotation Desk', to: '/contact?tab=general', variant: 'primary' },
      { label: 'View Online Spec Tables', to: '/products', variant: 'secondary' },
    ],
    internalSourceNote: 'Follows PRODUCTS.hasVerifiedDownload = false policy; never fabricate PDF links.',
  },

  // =========================================================================
  // 4. QUOTATIONS AND ENQUIRIES
  // =========================================================================
  {
    id: 'how-request-quotation',
    category: 'Quotations and enquiries',
    question: 'How do I request a quotation?',
    alternativePhrases: [
      'Submit an RFQ or quote request',
      'Where is the quotation form?',
      'How do buyers initiate a commercial enquiry?',
    ],
    keywords: [
      'quote',
      'quotation',
      'rfq',
      'request',
      'submit',
      'form',
      'commercial enquiry',
    ],
    answer:
      'Use the Product Quotation tab on either the Dedicated Contact page or the Homepage Quotation Desk (#enquiry). Select your alloy product, preferred grade or "Custom Grade Specification", add sizing/packing notes, and enter your contact details.',
    expandedExplanation:
      'Please note that on this frontend website prototype, submitting the quotation form validates fields locally and shows a reviewable preview (intended production route: marketing@berryalloys.in) without dispatching an email or storing personal data.',
    relatedIds: [
      'what-to-include-enquiry',
      'pricing-moq-leadtime-shipping',
      'how-contact-company',
    ],
    actions: [
      { label: 'Open Quotation Page', to: '/contact?tab=quote', variant: 'primary' },
      { label: 'Scroll to Homepage Enquiry Desk', to: '/#enquiry', variant: 'secondary' },
    ],
    featuredOnHome: true,
    internalSourceNote: 'Matches EnquiryFormPanel demo behavior and prototype disclosure.',
  },
  {
    id: 'what-to-include-enquiry',
    category: 'Quotations and enquiries',
    question: 'What details are helpful to include in a product enquiry?',
    alternativePhrases: [
      'What information does the sales team need for a quote?',
      'Should I include sizing, tonnage, and destination?',
      'Preparing an ferro alloy RFQ',
    ],
    keywords: [
      'include',
      'information needed',
      'details',
      'tonnage',
      'quantity',
      'sizing',
      'lump',
      'packing',
      'jumbo bag',
      'destination',
      'port',
      'application',
      'prepare',
    ],
    answer:
      'While the commercial form only requires your name, business email, phone number, and a brief requirement note to preview, sharing these details helps prepare a clearer commercial enquiry: preferred alloy/grade, lump size range, packing (such as 1 MT jumbo bags or bulk), estimated tonnage, destination or export port, and target application.',
    expandedExplanation:
      'Notice these specification hints are helpful commercial suggestions rather than rigid mandatory minimums; if your grade selection is not finalized, you can indicate general requirements in your message.',
    relatedIds: [
      'how-request-quotation',
      'pricing-moq-leadtime-shipping',
      'enquire-particular-alloy',
    ],
    actions: [
      { label: 'Prepare Quotation Request', to: '/contact?tab=quote', variant: 'primary' },
      { label: 'Explore Alloy Grades', to: '/products', variant: 'secondary' },
    ],
    internalSourceNote: 'Derived strictly from EnquiryFormPanel fields without inventing mandatory MOQ policies.',
  },
  {
    id: 'how-contact-company',
    category: 'Quotations and enquiries',
    question: 'How do I contact Berry Alloys Limited directly?',
    alternativePhrases: [
      'Phone number and email address for Berry Alloys',
      'Marketing email and Kolkata / Vizag numbers',
      'Reach commercial desk',
    ],
    keywords: [
      'contact',
      'email',
      'phone',
      'telephone',
      'call',
      'reach',
      'marketing',
      'sales',
      'number',
    ],
    answer: `Published commercial email across all offices is ${headOffice.email}. Phone numbers listed for Berry Alloys Limited are ${headOffice.phone} (Head Office, Kolkata & Jharkhand plant coordination) and ${vizagOffice.phone} (Director Office, Visakhapatnam).`,
    expandedExplanation: `Head Office: ${headOffice.address}. Director Office & Vizag Logistics: ${vizagOffice.address}. Jharkhand Plant: ${jharkhandPlant.address}.`,
    relatedIds: [
      'facilities-offices-locations',
      'how-request-quotation',
      'careers-openings-departments',
    ],
    actions: [
      { label: 'Open Contact Directory', to: '/contact', variant: 'primary' },
      { label: 'Go to Homepage Enquiry Desk', to: '/#enquiry', variant: 'secondary' },
    ],
    internalSourceNote: 'Values pulled directly from OFFICES array in company.ts.',
  },
  {
    id: 'pricing-moq-leadtime-shipping',
    category: 'Quotations and enquiries',
    question: 'Are pricing, minimum order quantities, stock availability, lead times, payment terms, shipping, samples, or custom grades listed online?',
    alternativePhrases: [
      'How much per ton / MT?',
      'What is the MOQ or minimum order?',
      'Current inventory stock availability and dispatch lead time',
      'Payment terms LC credit, FOB CIF shipping rates, free samples, bespoke custom grade',
    ],
    keywords: [
      'price',
      'pricing',
      'cost',
      'rate',
      'quote price',
      'moq',
      'minimum order',
      'availability',
      'stock',
      'inventory',
      'lead time',
      'delivery time',
      'payment',
      'terms',
      'credit',
      'shipping',
      'freight',
      'fob',
      'cif',
      'sample',
      'samples',
      'custom grade',
      'custom specification',
    ],
    answer:
      'Specific commercial pricing, minimum order quantities (MOQ), live stock availability, production lead times, payment terms, freight/shipping terms, physical sample dispatch rules, and custom non-standard chemistries are not published in Berry Compass or on this website.',
    expandedExplanation:
      'Because ferro alloy contracts vary by market index, lot sizing, destination port (e.g., Visakhapatnam FOB vs. domestic ex-works), and customer trace tolerances, please submit a quotation enquiry with your requirement notes for confirmation by the commercial team.',
    relatedIds: ['how-request-quotation', 'what-to-include-enquiry', 'how-contact-company'],
    actions: [
      { label: 'Submit Requirement via Quotation Desk', to: '/contact?tab=quote', variant: 'primary' },
      { label: 'Direct Office Contacts', to: '/contact?tab=general', variant: 'secondary' },
    ],
    internalSourceNote: 'Mandatory honest boundary for unverified/unapproved commercial terms.',
  },

  // =========================================================================
  // 5. SUSTAINABILITY AND CSR
  // =========================================================================
  {
    id: 'sustainability-renewables-cbam',
    category: 'Sustainability and CSR',
    question: 'Where can I find sustainability, renewable power, and CBAM information?',
    alternativePhrases: [
      'Solar and wind power capacity',
      'What is Berry Alloys doing on carbon footprint and green energy?',
      'Ghatsila WHR waste heat recovery and biomass',
    ],
    keywords: [
      'sustainability',
      'renewable',
      'solar',
      'wind',
      '83 mw',
      '2.6 mw',
      '29.6 mw',
      'cbam',
      'carbon',
      'emissions',
      'whr',
      'waste heat',
      'biomass',
      'iso 14067',
      'green',
    ],
    answer:
      'The Sustainability section documents operational renewables (29.6 MW wind reported on the sustainability page; 83 MW solar in sustainability disclosures kept distinct from the 2.6 MW homepage rooftop solar announcement), Q4 2023 CBAM reporting, ISO 14067:2018 carbon footprint framework, planned 90 MW WHR at Ghatsila, and exploratory biomass research.',
    expandedExplanation:
      'Initiatives are categorized transparently as Reported / Operational, Planned, or Exploratory without merging un-reconciled solar scope numbers or claiming audited full lifecycle (LCA) inventories.',
    relatedIds: ['csr-community-initiatives', 'quality-standards-testing'],
    actions: [
      { label: 'Explore Sustainability Disclosures', to: '/sustainability', variant: 'primary' },
      { label: 'Homepage Stewardship Section', to: '/#responsibility', variant: 'secondary' },
    ],
    internalSourceNote: 'Derived from SUSTAINABILITY_INITIATIVES in company.ts with strict scope separation.',
  },
  {
    id: 'csr-community-initiatives',
    category: 'Sustainability and CSR',
    question: 'Where can I learn about CSR and community welfare activities?',
    alternativePhrases: [
      'Medical camp, school upgrades, drinking water, and gaushala programmes',
      'Community support in Bobbili and Srikakulam',
      'Corporate social responsibility work',
    ],
    keywords: [
      'csr',
      'community',
      'social',
      'medical camp',
      'abhaya hospital',
      'school',
      'scholarship',
      'water',
      'ro',
      'plantation',
      'trees',
      'gaushala',
      'st joseph',
      'marathon',
    ],
    answer: `Documented community initiatives include the 7 January 2026 multi-specialty medical camp with Abhaya Hospital (200+ employees screened), merit scholarships and bicycles for employee families, rural school upgrades, Bobbili RO drinking water and civic works, St Joseph’s Old Age Home memorial luncheon, sapling plantations, and Srikakulam Gaushala support.`,
    expandedExplanation:
      'Statutory CSR Committee composition, policy charters, and annual CSR project schedules from FY 2021–22 through FY 2025–26 are also indexed on the Corporate Documents page.',
    relatedIds: ['corporate-documents-filings', 'sustainability-renewables-cbam'],
    actions: [
      { label: 'View Community & CSR Page', to: '/community', variant: 'primary' },
      { label: 'CSR Governance Index', to: '/documents', variant: 'secondary' },
    ],
    internalSourceNote: 'Derived from CSR_STORIES in communityNewsCareersDocs.ts.',
  },

  // =========================================================================
  // 6. DOCUMENTS AND CAREERS
  // =========================================================================
  {
    id: 'corporate-documents-filings',
    category: 'Documents and careers',
    question: 'Where are statutory corporate documents, MGT-7 returns, and policies?',
    alternativePhrases: [
      'Annual returns FY 2019 to 2026',
      'Vigil mechanism whistleblower policy and remuneration policy',
      'CSR policy and governance filings',
    ],
    keywords: [
      'document',
      'documents',
      'filing',
      'filings',
      'annual return',
      'mgt-7',
      'policy',
      'policies',
      'vigil',
      'whistleblower',
      'remuneration',
      'governance',
      'statutory',
      'csr policy',
    ],
    answer: `The Corporate Documents page indexes ${CORPORATE_DOCUMENT_GROUPS.length} statutory categories: Form MGT-7 Annual Returns (FY 2019–20 through FY 2025–26), CSR Governance & Annual Schedules, and Board Policies (Remuneration, Vigil Mechanism / Whistleblower, and Independent Director Appointment Terms).`,
    expandedExplanation:
      'Local PDF binaries are not stored in this prototype; each document group links directly to the verified index URLs on berryalloys.com.',
    relatedIds: ['product-related-documents', 'csr-community-initiatives', 'company-legacy-overview'],
    actions: [
      { label: 'Open Corporate Documents Page', to: '/documents', variant: 'primary' },
    ],
    internalSourceNote: 'Derived from CORPORATE_DOCUMENT_GROUPS in communityNewsCareersDocs.ts.',
  },
  {
    id: 'careers-openings-departments',
    category: 'Documents and careers',
    question: 'How can I find careers information or listed job openings?',
    alternativePhrases: [
      'Jobs at Berry Alloys in Visakhapatnam, Kolkata, or Dhalbhumgarh',
      'Which departments hire at Berry Alloys?',
      'Apply for a role or send CV',
    ],
    keywords: [
      'career',
      'careers',
      'job',
      'jobs',
      'vacancy',
      'vacancies',
      'opening',
      'openings',
      'hiring',
      'recruit',
      'apply',
      'cv',
      'resume',
      'mis executive',
      'facilities manager',
    ],
    answer: `The Careers page lists ${JOB_VACANCIES.length} sourced roles (${JOB_VACANCIES.map((v) => `${v.title} — ${v.location}`).join('; ')}) across ${CAREERS_DEPARTMENTS.length} operational departments including Production, QA/QC, Engineering, R&D, Purchase, and Sales & Marketing.`,
    expandedExplanation:
      'Active vacancy status is marked as requiring HR confirmation, and the online careers application form operates as a frontend validation demonstration rather than dispatching an email.',
    relatedIds: ['facilities-offices-locations', 'how-contact-company'],
    actions: [
      { label: 'Explore Careers & Roles', to: '/careers', variant: 'primary' },
      { label: 'Direct Office Contacts', to: '/contact', variant: 'secondary' },
    ],
    internalSourceNote: 'Derived from JOB_VACANCIES and CAREERS_DEPARTMENTS in communityNewsCareersDocs.ts.',
  },
];

export const FEATURED_HOME_FAQS: KnowledgeEntry[] = KNOWLEDGE_BASE.filter(
  (entry) => entry.featuredOnHome
);

export function getKnowledgeById(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_BASE.find((entry) => entry.id === id);
}

export function getProductBySlugOrThrow(slug: string): AlloyProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
