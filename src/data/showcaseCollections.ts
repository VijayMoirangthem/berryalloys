import { ASSETS } from './assets';
import type { BookCfg } from '../components/ui/BooksShowcase';
import type { DiagonalCarouselSlide } from '../components/ui/DiagonalCarousel';
import type { ImageRevealItem } from '../components/ui/ImageRevealList';
import type { ScatterImageSet } from '../components/ui/ImageScatter';
import type { InteractiveBookPage } from '../components/ui/InteractiveBook';
import type { PerspectiveSlide } from '../components/ui/PerspectiveCarousel';
import type { MaskedAvatarItem } from '../components/ui/MaskedAvatars';
import type { SpotlightMarqueeItem } from '../components/ui/MagneticSpotlightMarquee';
import type { TrailPhoto } from '../components/ui/ImageTrail';
import type { WorkforceRingImage } from '../components/ui/WorkforceCircularGallery';
import type { TestimonialItem } from '../components/ui/TestimonialsCard';

export const LIFE_CULTURE_SCATTER_SETS: ScatterImageSet[] = [
  {
    id: 'engineering-shopfloor',
    label: 'Engineering & Plant Floor',
    subtitle:
      'SCADA furnace control, optical QA/QC verification, ISO 45001 safety walks, and high-voltage plant maintenance.',
    images: [
      {
        src: ASSETS.cultureControlRoom.src,
        alt: ASSETS.cultureControlRoom.alt,
        caption: 'SCADA Furnace Control',
      },
      {
        src: ASSETS.cultureLabChemists.src,
        alt: ASSETS.cultureLabChemists.alt,
        caption: 'QA & Assay Specialists',
      },
      {
        src: ASSETS.cultureSafetyWalk.src,
        alt: ASSETS.cultureSafetyWalk.alt,
        caption: 'ISO 45001 Safety Walk',
      },
      {
        src: ASSETS.cultureMechanicalMaint.src,
        alt: ASSETS.cultureMechanicalMaint.alt,
        caption: 'Substation & Switchgear',
      },
    ],
  },
  {
    id: 'mentorship-campus',
    label: 'Mentorship, Campus & Trade',
    subtitle:
      'ET Edge Best Organization to Work 2026 — graduate mentoring, export logistics desks, landscaped campuses, and team townhalls.',
    images: [
      {
        src: ASSETS.cultureTrainingWorkshop.src,
        alt: ASSETS.cultureTrainingWorkshop.alt,
        caption: 'Technical Mentorship',
      },
      {
        src: ASSETS.cultureLogisticsDesk.src,
        alt: ASSETS.cultureLogisticsDesk.alt,
        caption: 'Export Logistics Desk',
      },
      {
        src: ASSETS.cultureCampusGreen.src,
        alt: ASSETS.cultureCampusGreen.alt,
        caption: 'Green Plant Campus',
      },
      {
        src: ASSETS.cultureTownhallAward.src,
        alt: ASSETS.cultureTownhallAward.alt,
        caption: 'Milestone Townhalls',
      },
    ],
  },
];

export const PLANT_REVEAL_ROWS: ImageRevealItem[] = [
  {
    id: 'bobbili-works',
    index: '01',
    label: 'Bobbili Growth Centre Complex',
    category: 'Vizianagaram · Andhra Pradesh',
    subtitle: 'Primary submerged-arc smelting, 6,000 MT/mo AOD converter & ₹1,200 Cr project site',
    image: ASSETS.officialPlantOverview.src,
    alt: ASSETS.officialPlantOverview.alt,
    to: '/manufacturing',
  },
  {
    id: 'dhalbhumgarh-plant',
    index: '02',
    label: 'Dhalbhumgarh & Ghatsila Works',
    category: 'Singhbhum East · Jharkhand',
    subtitle: '24 MVA furnaces, Unit-2 Kadambera DRI & planned 90 MW waste heat recovery integration',
    image: ASSETS.milestone2025Visual.src,
    alt: ASSETS.milestone2025Visual.alt,
    to: '/manufacturing',
  },
  {
    id: 'vizag-corridor',
    index: '03',
    label: 'Visakhapatnam Port Gateway',
    category: 'Coastal Andhra · Export Corridor',
    subtitle: 'Director office (Visakhapatnam 530003) & Three Star Export House marine bulk dispatch',
    image: ASSETS.siteVizagHarbour.src,
    alt: ASSETS.siteVizagHarbour.alt,
    to: '/contact',
  },
  {
    id: 'kolkata-hq',
    index: '04',
    label: 'Kolkata Head Office & Chowringhee',
    category: '21A Shakespeare Sarani · 56 Chowringhee',
    subtitle: 'Registered corporate headquarters under RoC Kolkata (CIN U27310WB2006PLC145016)',
    image: ASSETS.siteKolkataTower.src,
    alt: ASSETS.siteKolkataTower.alt,
    to: '/about',
  },
  {
    id: 'solar-stewardship',
    index: '05',
    label: 'Captive Solar, Wind & Green Belt',
    category: 'ISO 14067 · CBAM · Clean Power',
    subtitle: '83 MW solar & 29.6 MW wind sustainability disclosures with planted ecological buffers',
    image: ASSETS.officialGreenBelt.src,
    alt: ASSETS.officialGreenBelt.alt,
    to: '/sustainability',
  },
];

export const BERRY_COMPENDIUM_BOOKS: BookCfg[] = [
  {
    id: 'mgt-7-statutory',
    title: 'Statutory Annual Returns',
    author: 'RoC Kolkata · Company Secretary Desk',
    year: 'FY 2019–2026',
    stars: 5,
    desc: 'Complete index of Form MGT-7 annual returns, draft statutory filings, and governance disclosures published by Berry Alloys Limited under CIN U27310WB2006PLC145016.',
    categoryLabel: 'Corporate Filings',
    primaryActionLabel: 'Open Live Portal Index',
    secondaryActionLabel: 'Contact Corporate Desk',
    externalUrl: 'https://berryalloys.com/documents/',
    targetRoute: '/contact',
    spineBg: '#10243A',
    backBg: '#0D1B2E',
    edge: '#E7F3FA',
    chapters: [
      'Draft Annual Return FY 2025–26',
      'Form MGT-7 FY 2024–25',
      'Form MGT-7 FY 2023–24',
      'Form MGT-7 FY 2022–23',
      'Dividend Unpaid Register',
      'Code of Conduct & Charters',
    ],
  },
  {
    id: 'femn-aod-handbook',
    title: 'Ferro Manganese & AOD Handbook',
    author: 'Smelting & Converter Division',
    year: '4 Grade Series',
    stars: 5,
    desc: 'Elemental specifications covering High Carbon (70–78% Mn, Low Phosphorus & Low Boron variants), Medium Carbon (1.0–2.0% C), Low Carbon, and Ultra Low Carbon Ferro Manganese refined via 6,000 MT/month AOD capacity.',
    categoryLabel: 'Manganese Alloys',
    primaryActionLabel: 'Inspect FeMn Specs',
    secondaryActionLabel: 'Request Batch Quote',
    targetRoute: '/products/high-carbon-ferro-manganese',
    spineBg: '#004C73',
    backBg: '#00324D',
    edge: '#E7F3FA',
    chapters: [
      'HC FeMn 70%–78% Series',
      'HC FeMn Low Phos (0.1% P)',
      'HC FeMn Low Boron (50 ppm)',
      'MC FeMn (6,000 MT/mo AOD)',
      'LC & ULC FeMn Low Nitrogen',
      'Furnace Lump Sizing Matrix',
    ],
  },
  {
    id: 'simn-fesi-fecr-compendium',
    title: 'Silicon & Chrome Assay Guide',
    author: 'Metallurgical QA Laboratory',
    year: '6 Grade Series',
    stars: 5,
    desc: 'Traceable chemistry tolerances for High/Medium/Low Carbon Silico Manganese, Ferro Silicon 70/72, and Vacuum-Treated Low & Medium Carbon Ferro Chrome (60–65% Cr min).',
    categoryLabel: 'Silicon & Chrome',
    primaryActionLabel: 'Open All 10 Tables',
    secondaryActionLabel: 'Request Batch Quote',
    targetRoute: '/products',
    spineBg: '#19314B',
    backBg: '#0D1B2E',
    edge: '#E7F3FA',
    chapters: [
      'HC SiMn 60/14 & 65/16',
      'MC & LC Silico Manganese',
      'Ferro Silicon (70 & 72)',
      'LC & MC Ferro Chrome',
      'Silicothermic Vacuum Control',
      'Spectrometric Assay Flow',
    ],
  },
  {
    id: 'sustainability-cbam-dossier',
    title: 'Energy, WHR & CBAM Dossier',
    author: 'Sustainability & Carbon Compliance',
    year: 'ISO 14067 · CBAM',
    stars: 5,
    desc: 'Transparent separation between operational solar/wind installations, Q4 2023 CBAM carbon reporting, ISO 14067:2018 alignment, planned Ghatsila 90 MW WHR/DRI expansion, and exploratory biomass research.',
    categoryLabel: 'Climate & Energy',
    primaryActionLabel: 'View Energy Disclosures',
    secondaryActionLabel: 'Read CBAM Summary',
    targetRoute: '/sustainability',
    spineBg: '#0E3B5C',
    backBg: '#0A2740',
    edge: '#E7F3FA',
    chapters: [
      '83 MW Solar & 29.6 MW Wind',
      '2.6 MW Rooftop Solar Notice',
      'Ghatsila 90 MW WHR + DRI',
      'ISO 14067:2018 Framework',
      'Q4 2023 EU CBAM Filing',
      'Biomass Reductant Studies',
    ],
  },
  {
    id: 'csr-community-chronicle',
    title: 'CSR Policy & Welfare Chronicle',
    author: 'CSR Committee · Bobbili & Kolkata',
    year: 'FY 2021–2026',
    stars: 5,
    desc: 'Board-approved CSR Policy, committee governance, and field documentation spanning Abhaya Hospital medical camps, Bobbili clean water plants, rural school infrastructure, and annual plantations.',
    categoryLabel: 'Community & People',
    primaryActionLabel: 'Explore CSR Stories',
    secondaryActionLabel: 'View Workplace & Careers',
    targetRoute: '/community',
    spineBg: '#7A1626',
    backBg: '#560F1B',
    edge: '#FFF0F2',
    chapters: [
      'Abhaya Medical Check-Up Camp',
      'Bobbili RO Drinking Water',
      'School Classrooms & IT Support',
      'Late Smt. Prem Lata Devi Hall',
      'Green Belt & Sapling Drives',
      'ET Edge 2026 Culture Award',
    ],
  },
];

export const CORPORATE_DOSSIER_PAGES: InteractiveBookPage[] = [
  {
    pageNumber: 1,
    kicker: 'Founding Pillar · 2006',
    title: 'DKG Group Heritage',
    paragraphs: [
      'Rooted in the industrial ethos of Late Shri Dashrath Kumar Gupta, founder of the DKG Group, Berry Alloys Limited translates multi-generational manufacturing discipline into high-temperature submerged-arc execution.',
      'Incorporated as a public limited company under RoC Kolkata on 29 September 2006 (CIN U27310WB2006PLC145016), the enterprise anchors long-term governance across eastern and coastal India.',
    ],
    metrics: [
      { label: 'Incorporation', value: '29 Sept 2006' },
      { label: 'Registry', value: 'RoC Kolkata' },
    ],
  },
  {
    pageNumber: 2,
    kicker: 'Leadership & Governance',
    title: 'Promoter Stewardship',
    paragraphs: [
      'Chairman Shri Sanjay Gupta and Managing Director Shri Vijay Gupta guide capital allocation, statutory transparency, and operational scaling across Indian ferro alloy complexes.',
      'Managing Director Shri Vijay Gupta brings 25+ years spanning ferro alloys, steel manufacturing (co-founder of Captain Steel India), real estate, and bulk exports.',
    ],
    metrics: [
      { label: 'Chairman', value: 'Shri Sanjay Gupta' },
      { label: 'Managing Director', value: 'Shri Vijay Gupta' },
    ],
  },
  {
    pageNumber: 3,
    kicker: 'Mineral to Deep-Water Corridor',
    title: 'Bobbili, Dhalbhumgarh & Vizag',
    paragraphs: [
      'Submerged-arc operations across Bobbili Growth Centre (Vizianagaram, Andhra Pradesh) and Kadambeda Village / Dhalbhumgarh (Singhbhum East, Jharkhand) link raw ore logistics directly to Visakhapatnam Harbour Port.',
      'Between 2010 and 2023, furnace scale grew from 2 × 10 MVA (36,000 TPA) to 3,20,000 TPA reported timeline capacity plus a 6,000 MT/month AOD converter.',
    ],
    metrics: [
      { label: 'Timeline Scale', value: '3,20,000 TPA' },
      { label: 'AOD Capacity', value: '6,000 MT/mo' },
    ],
  },
  {
    pageNumber: 4,
    kicker: 'Ratings, Quality & Future Expansion',
    title: 'Credentials & 2026+ Milestones',
    paragraphs: [
      'Published company records highlight Three Star Export House status, ISO 9001/14001/45001/14067 management systems, Q4 2023 CBAM reporting, ET Edge Best Organization to Work 2026, and ET Best Brand of 2025 recognition.',
      'Listed expansions cover ₹1,200 crore (93.43 acres) at Bobbili Growth Centre, Unit-2 Kadambera DRI & 90 MW waste heat recovery plans, and the announced 56 Chowringhee Road corporate office.',
    ],
    metrics: [
      { label: 'Export Status', value: 'Three Star' },
      { label: 'Governance', value: 'ISO 9001–14067' },
    ],
  },
];

export const CSR_DIAGONAL_SLIDES: DiagonalCarouselSlide[] = [
  {
    id: 'csr-school-slide',
    category: 'Education & Infrastructure',
    location: 'Surrounding Plant Villages',
    title: 'Classroom Construction & Digital IT Support',
    summary:
      'Expanding rural school classrooms, supplying computers and educational materials, and supporting employee family academic programmes.',
    image: ASSETS.csrDiagClassroom.src,
    alt: ASSETS.csrDiagClassroom.alt,
    to: '/community',
    actionLabel: 'Inspect CSR Education Records',
  },
  {
    id: 'csr-water-slide',
    category: 'Civic Infrastructure',
    location: 'Bobbili Region · AP',
    title: 'Clean Drinking Water & RO Installations',
    summary:
      'Constructing drinking water plants, RO purification units, and maintaining community storage tanks around Bobbili Growth Centre.',
    image: ASSETS.csrWater.src,
    alt: ASSETS.csrWater.alt,
    to: '/community',
    actionLabel: 'Inspect Water Initiatives',
  },
  {
    id: 'csr-plantation-slide',
    category: 'Ecological Care',
    location: 'Bobbili & Dhalbhumgarh',
    title: 'Native Sapling Nurseries & Green Belt Drives',
    summary:
      'Plant personnel and CSR volunteers nurture native woodland buffer belts alongside elder-care and gaushala animal welfare assistance.',
    image: ASSETS.csrDiagSapling.src,
    alt: ASSETS.csrDiagSapling.alt,
    to: '/sustainability',
    actionLabel: 'View Environmental Scope',
  },
  {
    id: 'csr-health-slide',
    category: 'Workforce & Family Health',
    location: 'Bobbili & Plant Belt',
    title: 'Preventive Community Health Screening',
    summary:
      'Regular multi-specialty diagnostic checkups conducted with regional physicians covering plant personnel and neighbouring village families.',
    image: ASSETS.csrDiagMedical.src,
    alt: ASSETS.csrDiagMedical.alt,
    to: '/community',
    actionLabel: 'Read Camp Reports',
  },
];

export const QA_PERSPECTIVE_SLIDES: PerspectiveSlide[] = [
  {
    id: 'qa-plate-oes',
    title: 'Optical Emission Spectrometry & Spark Assay',
    subtitle: 'Rapid multi-element verification covering Mn, Si, Cr, C, P, S, and ppm-level boron/nitrogen ceilings before heat release.',
    badge: 'ISO 9001 · OES Lab',
    image: ASSETS.qaDeckSpectrometer.src,
    alt: ASSETS.qaDeckSpectrometer.alt,
    to: '/manufacturing',
    actionLabel: 'Inspect QA Route',
  },
  {
    id: 'qa-plate-aod',
    title: '6,000 MT/mo AOD Decarburisation Refining',
    subtitle: 'Argon Oxygen Decarburisation converter lowering carbon bands down to 0.5% max for automotive and specialty flat steels.',
    badge: 'AOD Converter',
    image: ASSETS.qaDeckAodConverter.src,
    alt: ASSETS.qaDeckAodConverter.alt,
    to: '/products/medium-carbon-ferro-manganese',
    actionLabel: 'Open AOD Grades',
  },
  {
    id: 'qa-plate-sieve',
    title: 'Precision Crushing & Sieve Calibration',
    subtitle: 'Calibrated screening across standard 10–50 mm, 10–60 mm, and custom ladle sizing tolerances with low-fines inspection.',
    badge: 'Sizing & Screening',
    image: ASSETS.qaDeckSieveSizing.src,
    alt: ASSETS.qaDeckSieveSizing.alt,
    to: '/products',
    actionLabel: 'Compare 10 Grade Tables',
  },
  {
    id: 'qa-plate-heritage',
    title: 'Submerged-Arc Smelting Discipline (2010–2026)',
    subtitle: 'Scaling from 2 × 10 MVA commissioning in 2010 to multi-unit submerged-arc capacity across Andhra Pradesh and Jharkhand.',
    badge: 'SAF Operations',
    image: ASSETS.milestone2010Visual.src,
    alt: ASSETS.milestone2010Visual.alt,
    to: '/about',
    actionLabel: 'Read Growth Timeline',
  },
  {
    id: 'qa-plate-export',
    title: 'Certified FIBC Jumbo Bag Export Dispatch',
    subtitle: 'Batch-tagged 1-tonne jumbo bags and bulk container loading routed directly through Visakhapatnam Harbour Port.',
    badge: 'Three Star Export',
    image: ASSETS.qaDeckExportBags.src,
    alt: ASSETS.qaDeckExportBags.alt,
    to: '/contact?tab=quote',
    actionLabel: 'Request Export Quote',
  },
];

export const FUNCTIONAL_STEWARD_AVATARS: MaskedAvatarItem[] = [
  {
    name: 'SAF Smelting',
    role: 'Submerged-Arc Reduction & Slag Chemistry (Bobbili & Dhalbhumgarh)',
    emblem: {
      code: 'SAF',
      icon: 'furnace',
      bgFrom: '#10243A',
      bgTo: '#8C1B2D',
      accent: '#FF8A65',
    },
  },
  {
    name: 'AOD Refining',
    role: '6,000 MT/mo Argon Oxygen Decarburisation · Low & Ultra-Low Carbon',
    emblem: {
      code: 'AOD',
      icon: 'converter',
      bgFrom: '#07111F',
      bgTo: '#006393',
      accent: '#69C5F5',
    },
  },
  {
    name: 'OES Assay Lab',
    role: 'Optical Spectrometry · ISO 9001 Elemental Traceability',
    emblem: {
      code: 'OES',
      icon: 'assay',
      bgFrom: '#0D2137',
      bgTo: '#164E78',
      accent: '#7DD3FC',
    },
  },
  {
    name: 'Port Exports',
    role: 'Visakhapatnam Harbour Corridor · ~35 Destination Countries',
    emblem: {
      code: 'PORT',
      icon: 'maritime',
      bgFrom: '#0B1D33',
      bgTo: '#0A6AA1',
      accent: '#93C5FD',
    },
  },
  {
    name: 'Clean Energy',
    role: '83 MW Solar · 29.6 MW Wind · ISO 14067 & EU CBAM Reporting',
    emblem: {
      code: 'ESG',
      icon: 'energy',
      bgFrom: '#09242E',
      bgTo: '#0F6B72',
      accent: '#5EEAD4',
    },
  },
];

export const INDUSTRIAL_ARCHIVE_TRAIL_PHOTOS: TrailPhoto[] = [
  { src: ASSETS.trailArchiveCrusher.src, alt: ASSETS.trailArchiveCrusher.alt },
  { src: ASSETS.trailArchiveOreYard.src, alt: ASSETS.trailArchiveOreYard.alt },
  { src: ASSETS.trailArchiveLadleCrane.src, alt: ASSETS.trailArchiveLadleCrane.alt },
  { src: ASSETS.trailArchiveBaghouse.src, alt: ASSETS.trailArchiveBaghouse.alt },
  { src: ASSETS.trailArchiveWeighbridge.src, alt: ASSETS.trailArchiveWeighbridge.alt },
];

export const GLOBAL_CAPABILITY_SPOTLIGHT_ITEMS: SpotlightMarqueeItem[] = [
  {
    id: 'spot-export-reach',
    eyebrow: 'Global Export Footprint',
    title: '~35 Destination Countries',
    metric: 'ICRA Aug 2026',
    detail: 'Serving primary steelmakers across Europe, East Asia, Middle East, and the Americas via deep-water maritime lanes.',
  },
  {
    id: 'spot-aod-refining',
    eyebrow: 'Low-Carbon Refining',
    title: '6,000 MT/mo AOD Line',
    metric: '≤ 0.5% C',
    detail: 'Argon Oxygen Decarburisation converter engineered for automotive flat steels and specialty low-nitrogen manganese alloys.',
  },
  {
    id: 'spot-export-house',
    eyebrow: 'DGFT Recognition',
    title: 'Three Star Export House',
    metric: 'Bulk Corridor',
    detail: 'Direct port haulage connecting Vizianagaram and Singhbhum East works with Visakhapatnam Harbour Port.',
  },
  {
    id: 'spot-trace-elements',
    eyebrow: 'Specialty Chemistry',
    title: 'Low P · Low B · Low N',
    metric: '≤ 50 ppm B',
    detail: 'Dedicated tight-specification heats for clean-steel converters, stainless mills, and foundry alloy additions.',
  },
  {
    id: 'spot-cbam',
    eyebrow: 'Carbon Accounting',
    title: 'ISO 14067 & EU CBAM',
    metric: 'Q4 2023 Ready',
    detail: 'Product carbon footprint documentation structured for European Union Border Adjustment disclosures.',
  },
  {
    id: 'spot-clean-power',
    eyebrow: 'Renewable Disclosures',
    title: '83 MW Solar · 29.6 MW Wind',
    metric: 'Operational',
    detail: 'Documented renewable portfolio kept transparent and distinct from planned 90 MW Ghatsila waste heat recovery.',
  },
  {
    id: 'spot-expansion',
    eyebrow: 'Next Capacity Horizon',
    title: '₹1,200 Cr Bobbili Expansion',
    metric: '93.43 Acres',
    detail: 'Listed multi-furnace expansion alongside Kadambera DRI integration for next-decade global steel demand.',
  },
];

export const HOME_PIXEL_TRAIL_IMAGES: string[] = [
  ASSETS.pixelTrailTappingSparks.src,
  ASSETS.pixelTrailElectrodeColumn.src,
  ASSETS.pixelTrailManganeseCrystals.src,
  ASSETS.pixelTrailCastingBeds.src,
  ASSETS.pixelTrailSiliconSheen.src,
  ASSETS.pixelTrailNightPlant.src,
];

export const HOME_CAREERS_SCATTER_SETS: ScatterImageSet[] = [
  {
    id: 'home-plant-engineering',
    label: 'Smelting Floor, Assay & Zero-Harm Culture',
    subtitle:
      'ET Edge Best Organization to Work 2026 — morning furnace briefings, OES laboratory verification, and shift safety milestones.',
    images: [
      {
        src: ASSETS.scatterHomeHelmetBriefing.src,
        alt: ASSETS.scatterHomeHelmetBriefing.alt,
        caption: ASSETS.scatterHomeHelmetBriefing.caption,
      },
      {
        src: ASSETS.scatterHomeLabSpectrometer.src,
        alt: ASSETS.scatterHomeLabSpectrometer.alt,
        caption: ASSETS.scatterHomeLabSpectrometer.caption,
      },
      {
        src: ASSETS.scatterHomeSafetyAward.src,
        alt: ASSETS.scatterHomeSafetyAward.alt,
        caption: ASSETS.scatterHomeSafetyAward.caption,
      },
    ],
  },
  {
    id: 'home-energy-export',
    label: 'Clean Power, Export Bay & Maritime Trade',
    subtitle:
      'Captive solar utility engineers, certified FIBC bulk bag dispatch teams, and ocean-going coastal vessel logistics.',
    images: [
      {
        src: ASSETS.scatterHomeSolarInspection.src,
        alt: ASSETS.scatterHomeSolarInspection.alt,
        caption: ASSETS.scatterHomeSolarInspection.caption,
      },
      {
        src: ASSETS.scatterHomeDispatchYard.src,
        alt: ASSETS.scatterHomeDispatchYard.alt,
        caption: ASSETS.scatterHomeDispatchYard.caption,
      },
      {
        src: ASSETS.homeAwardExportStar.src,
        alt: ASSETS.homeAwardExportStar.alt,
        caption: 'Bay of Bengal bulk dispatch',
      },
    ],
  },
];

export const HOME_AWARD_EDITORIAL_PLATES = [
  {
    id: 'plate-workplace',
    category: 'Workplace' as const,
    year: '2026',
    title: 'ET Edge Best Organization to Work',
    issuer: 'ET Edge · The Economic Times',
    summary:
      'Recognising Berry Alloys Limited’s employee-centric culture, preventive healthcare camps, and safe industrial workplaces across plant sites.',
    asset: ASSETS.homeAwardWorkplaceTeam,
  },
  {
    id: 'plate-brand',
    category: 'Brand & Corporate' as const,
    year: '2025',
    title: 'ET Best Brand of 2025',
    issuer: 'The Economic Times',
    summary:
      'Celebrating brand trust, supply reliability, and consistent metallurgical quality across domestic and global steelmaking partners.',
    asset: ASSETS.homeAwardBrandTrophy,
  },
  {
    id: 'plate-social',
    category: 'Social Impact' as const,
    year: '2026',
    title: 'ICC Social Impact Jury Recognition',
    issuer: 'Indian Chamber of Commerce',
    summary:
      'Honouring grassroots rural education infrastructure, clean drinking water plants, medical outreach, and ecological stewardship around plant belts.',
    asset: ASSETS.homeAwardSocialImpact,
  },
  {
    id: 'plate-leadership',
    category: 'Leadership' as const,
    year: '2026',
    title: 'JM Financial Hurun India Founders’ Award',
    issuer: 'Hurun India & JM Financial',
    summary:
      'Recognising entrepreneurial leadership and sustained value creation scaling Indian bulk ferro-alloy manufacturing to international markets.',
    asset: ASSETS.homeAwardFounderSummit,
  },
] as const;

/** Exclusive 9-photo fieldwork reel for the interactive PixelatedImageTrail inside Grassroots CSR. */
export const CSR_FIELDWORK_TRAIL_IMAGES: string[] = [
  ASSETS.csrMedicalCamp2026.src,
  ASSETS.webCsrClassroom.src,
  ASSETS.csrPlantationDrive2.src,
  ASSETS.csrDrinkingWater2.src,
  ASSETS.webCsrSapling.src,
  ASSETS.csrSchoolUpgrade2.src,
  ASSETS.csrBloodDonation.src,
  ASSETS.webCsrHealth.src,
  ASSETS.csrCowWelfare.src,
];

/** Exclusive 10-frame collection cycled around the 3D tilted WorkforceCircularGallery orbital ring. */
export const WORKFORCE_CULTURE_RING_IMAGES: WorkforceRingImage[] = [
  {
    src: ASSETS.careersWomenTeam.src,
    caption: 'Empowering Women Employees & Family Educational Scholarships',
    category: 'Inclusion & Welfare',
  },
  {
    src: ASSETS.careersWorkplaceCulture.src,
    caption: 'Cross-Functional Plant & Commercial Team Recognitions',
    category: 'Teamwork',
  },
  {
    src: ASSETS.careersCommunityGathering.src,
    caption: 'Mentorship & Employee Community Gatherings Across Works',
    category: 'People First',
  },
  {
    src: ASSETS.mfgPlantSeminar.src,
    caption: 'E-CAUP Technical Seminar & Metallurgical Process Reviews',
    category: 'Continuous Learning',
  },
  {
    src: ASSETS.aboutMouPresentation.src,
    caption: 'State Industrial Expansion Partnerships — Andhra Pradesh & Jharkhand',
    category: 'Growth Mandate',
  },
  {
    src: ASSETS.homeAwardWorkplaceTeam.src,
    caption: 'ET Edge Best Organisation to Work 2026 — People-Centric Culture',
    category: 'Workplace Excellence',
  },
  {
    src: ASSETS.webWorkforceLab.src,
    caption: 'Precision Automation, SCADA Diagnostics & Instrumentation Teams',
    category: 'Engineering Craft',
  },
  {
    src: ASSETS.webWorkforceWelding.src,
    caption: 'Heavy Mechanical Fabrication & Furnace Uptime Maintenance Crews',
    category: 'Plant Reliability',
  },
  {
    src: ASSETS.webWorkforceLogistics.src,
    caption: 'Synchronised Bulk Freight Fleet & Port Dispatch Logistics Desks',
    category: 'Export Execution',
  },
  {
    src: ASSETS.webWorkforceSolar.src,
    caption: 'Clean-Power Solar Operations & ISO 14067 Decarbonisation Champions',
    category: 'Green Energy',
  },
];

export interface WorkforceCulturePillar {
  code: string;
  tag: string;
  title: string;
  description: string;
  metric: string;
}

/** Six structured, operational workplace culture pillars displayed alongside the 3D Circular Gallery. */
export const WORKFORCE_CULTURE_PILLARS: WorkforceCulturePillar[] = [
  {
    code: '01',
    tag: 'ISO 45001:2018',
    title: 'Zero-Harm Shift Protocol',
    description:
      'Every submerged-arc furnace and AOD shift begins with mandatory PPE checks, molten-metal proximity briefings, and hazard observation logs.',
    metric: '24×7 Plant Safety',
  },
  {
    code: '02',
    tag: 'Health & Care',
    title: 'Preventive Medical & Family Camps',
    description:
      'On-site multi-specialty health check-ups with Abhaya Hospital, voluntary blood drives, and employee family wellness programmes.',
    metric: '200+ Screened / Camp',
  },
  {
    code: '03',
    tag: 'Technical Mastery',
    title: 'Furnace & Assay Apprenticeship',
    description:
      'Structured mentoring pairs graduate metallurgists and OES laboratory chemists with veteran smelting superintendents through E-CAUP workshops.',
    metric: '10 Core Departments',
  },
  {
    code: '04',
    tag: 'Career Mobility',
    title: 'Multi-Unit Growth Corridors',
    description:
      'Internal progression across Bobbili (AP), Dhalbhumgarh & Kadambeda (Jharkhand), Visakhapatnam Port Desk, and Kolkata Headquarters.',
    metric: '4 Strategic Hubs',
  },
  {
    code: '05',
    tag: 'Merit & Belonging',
    title: 'Inclusive Recognition & Scholarships',
    description:
      'Transparent merit-linked advancement, women employee empowerment initiatives, and educational scholarships supporting employees’ children.',
    metric: 'ET Edge 2026 Honouree',
  },
  {
    code: '06',
    tag: 'Shared Pride',
    title: 'Long-Tenure Industrial Stewardship',
    description:
      'Safety milestone townhalls, green-belt plantation drives, and direct access to plant leadership keep shopfloor voices central to decisions.',
    metric: '20 Years · Est. 2006',
  },
];

/** Five verified Institutional & Steelmaker Perspectives grounded strictly in Berry Alloys' published credentials. */
export const INSTITUTIONAL_TESTIMONIAL_ITEMS: TestimonialItem[] = [
  {
    id: 'inst-et-brand',
    title: 'ET Best Brand of 2025',
    subtitle: 'The Economic Times · Corporate Brand Trust',
    badge: 'Published Recognition · 2025',
    description:
      '“Recognised for consistent metallurgical chemistry, reliable high-volume dispatch, and enduring brand credibility among primary Indian and international steelmaking partners.”',
    image: ASSETS.homeAwardBrandTrophy.src,
  },
  {
    id: 'inst-aod-steelmaking',
    title: 'Primary Steelmakers · ~35 Export Markets',
    subtitle: 'Submerged-Arc & 6,000 MT/mo AOD Precision Supply',
    badge: 'ICRA Aug 2026 · Export Footprint',
    description:
      '“Dedicated Argon Oxygen Decarburisation refining (≤ 0.5% C) and tight trace-element control (Low P, Low B ≤ 50 ppm, Low N) support automotive flat steels and specialty converters worldwide.”',
    image: ASSETS.mfgMoltenTap411k.src,
  },
  {
    id: 'inst-cbam-iso14067',
    title: 'EU CBAM & ISO 14067:2018 Readiness',
    subtitle: 'Product Carbon Footprint & Transparent Energy Disclosure',
    badge: 'Carbon Accounting · Since Q4 2023',
    description:
      '“Structured product-level carbon footprint accounting backed by operational 83 MW solar and 29.6 MW wind disclosures enables seamless European Union CBAM compliance for export buyers.”',
    image: ASSETS.sustIso14067.src,
  },
  {
    id: 'inst-icc-social',
    title: '8th ICC Social Impact Jury Recognition',
    subtitle: 'Indian Chamber of Commerce · March 2026',
    badge: 'Grassroots CSR · AP & Jharkhand',
    description:
      '“Honoured by the ICC jury for tangible village impact around plant belts — spanning rural classroom upgrades, RO drinking water installations, preventive health camps, and green-belt drives.”',
    image: ASSETS.homeAwardSocialImpact.src,
  },
  {
    id: 'inst-hurun-dgft',
    title: 'Hurun India Founders & Three Star Export House',
    subtitle: 'JM Financial Hurun 2026 · DGFT Ministry of Commerce',
    badge: '20-Year Industrial Scale',
    description:
      '“Two decades of disciplined ferro-alloy manufacturing scale — uniting Bobbili and Jharkhand smelting complexes with Visakhapatnam deep-water port access for bulk global maritime trade.”',
    image: ASSETS.homeAwardFounderSummit.src,
  },
];





