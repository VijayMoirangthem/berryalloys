import { ASSETS } from './assets';
import type { BookCfg } from '../components/ui/BooksShowcase';
import type { DiagonalCarouselSlide } from '../components/ui/DiagonalCarousel';
import type { ImageRevealItem } from '../components/ui/ImageRevealList';
import type { ScatterImageSet } from '../components/ui/ImageScatter';
import type { InteractiveBookPage } from '../components/ui/InteractiveBook';
import type { PerspectiveSlide } from '../components/ui/PerspectiveCarousel';

export const LIFE_CULTURE_SCATTER_SETS: ScatterImageSet[] = [
  {
    id: 'workplace-culture',
    label: 'People & Operations',
    subtitle:
      'ET Edge Best Organization to Work 2026 culture — furnace crews, QA analysts, safety teams, and plant operations.',
    images: [
      {
        src: ASSETS.teamFurnaceEngineers.src,
        alt: ASSETS.teamFurnaceEngineers.alt,
        caption: 'Furnace Engineering Crew',
      },
      {
        src: ASSETS.awardEtEdge2026.src,
        alt: ASSETS.awardEtEdge2026.alt,
        caption: 'ET Edge 2026 Recognition',
        isEmblem: true,
      },
      {
        src: ASSETS.teamSafetyHuddle.src,
        alt: ASSETS.teamSafetyHuddle.alt,
        caption: 'ISO 45001 Shift Safety',
      },
      {
        src: ASSETS.teamMetallurgyLab.src,
        alt: ASSETS.teamMetallurgyLab.alt,
        caption: 'QA & Assay Specialists',
      },
      {
        src: ASSETS.csrPlantation.src,
        alt: ASSETS.csrPlantation.alt,
        caption: 'Employee Green Drive',
      },
      {
        src: ASSETS.newCorporateOffice.src,
        alt: ASSETS.newCorporateOffice.alt,
        caption: '56 Chowringhee Office',
      },
    ],
  },
  {
    id: 'workforce-health',
    label: 'Health & Medical Camps',
    subtitle:
      'Multi-specialty health screening in collaboration with Abhaya Hospital supporting 200+ plant personnel.',
    images: [
      {
        src: ASSETS.csrMedicalCamp.src,
        alt: ASSETS.csrMedicalCamp.alt,
        caption: 'Abhaya Health Camp 2026',
      },
      {
        src: ASSETS.teamSafetyHuddle.src,
        alt: ASSETS.teamSafetyHuddle.alt,
        caption: 'Zero Harm Shift Briefing',
      },
      {
        src: ASSETS.csrWater.src,
        alt: ASSETS.csrWater.alt,
        caption: 'RO Clean Water Stations',
      },
      {
        src: ASSETS.officialPlantOverview.src,
        alt: ASSETS.officialPlantOverview.alt,
        caption: 'Bobbili Plant Corridor',
      },
      {
        src: ASSETS.csrPlantation.src,
        alt: ASSETS.csrPlantation.alt,
        caption: 'Workforce Sapling Drive',
      },
      {
        src: ASSETS.csrSchool.src,
        alt: ASSETS.csrSchool.alt,
        caption: 'Community Outreach Desk',
      },
    ],
  },
  {
    id: 'education-civic',
    label: 'Schools & Civic Water',
    subtitle:
      'Classroom construction, computer infrastructure, educational family stipends, and drinking water systems.',
    images: [
      {
        src: ASSETS.csrSchool.src,
        alt: ASSETS.csrSchool.alt,
        caption: 'Rural School Support',
      },
      {
        src: ASSETS.csrWater.src,
        alt: ASSETS.csrWater.alt,
        caption: 'Bobbili Drinking Water',
      },
      {
        src: ASSETS.csrPlantation.src,
        alt: ASSETS.csrPlantation.alt,
        caption: 'Team Plantation Drive',
      },
      {
        src: ASSETS.csrMedicalCamp.src,
        alt: ASSETS.csrMedicalCamp.alt,
        caption: 'Community Health Screening',
      },
      {
        src: ASSETS.officialGreenBelt.src,
        alt: ASSETS.officialGreenBelt.alt,
        caption: 'Ecological Buffer Belt',
      },
      {
        src: ASSETS.corporateHouse.src,
        alt: ASSETS.corporateHouse.alt,
        caption: 'CSR Governance Committee',
      },
    ],
  },
  {
    id: 'solar-green',
    label: 'Solar & Plant Growth',
    subtitle:
      'Rooftop solar generation, native sapling drives, and capacity milestones across 2010–2026.',
    images: [
      {
        src: ASSETS.officialSolarRoof.src,
        alt: ASSETS.officialSolarRoof.alt,
        caption: 'Rooftop Photovoltaic Array',
      },
      {
        src: ASSETS.csrPlantation.src,
        alt: ASSETS.csrPlantation.alt,
        caption: 'Native Sapling Plantation',
      },
      {
        src: ASSETS.milestone2025Visual.src,
        alt: ASSETS.milestone2025Visual.alt,
        caption: '2025 Scaling Phase',
      },
      {
        src: ASSETS.milestone2010Visual.src,
        alt: ASSETS.milestone2010Visual.alt,
        caption: '2010 Commissioning',
      },
      {
        src: ASSETS.officialAerialComplex.src,
        alt: ASSETS.officialAerialComplex.alt,
        caption: 'Solar Shed Roofs · Bobbili',
      },
      {
        src: ASSETS.solarPlant.src,
        alt: ASSETS.solarPlant.alt,
        caption: 'Industrial Solar Complex',
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
    image: ASSETS.officialAerialComplex.src,
    alt: ASSETS.officialAerialComplex.alt,
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
    image: ASSETS.portLogistics.src,
    alt: ASSETS.portLogistics.alt,
    to: '/contact',
  },
  {
    id: 'kolkata-hq',
    index: '04',
    label: 'Kolkata Head Office & Chowringhee',
    category: '21A Shakespeare Sarani · 56 Chowringhee',
    subtitle: 'Registered corporate headquarters under RoC Kolkata (CIN U27310WB2006PLC145016)',
    image: ASSETS.newCorporateOffice.src,
    alt: ASSETS.newCorporateOffice.alt,
    to: '/about',
  },
  {
    id: 'solar-stewardship',
    index: '05',
    label: 'Captive Solar, Wind & Green Belt',
    category: 'ISO 14067 · CBAM · Clean Power',
    subtitle: '83 MW solar & 29.6 MW wind sustainability disclosures with planted ecological buffers',
    image: ASSETS.sustainabilityFeature.src,
    alt: ASSETS.sustainabilityFeature.alt,
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
    image: ASSETS.corporateHouse.src,
    imageAlt: ASSETS.corporateHouse.alt,
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
    image: ASSETS.officialPlantGate.src,
    imageAlt: ASSETS.officialPlantGate.alt,
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
    image: ASSETS.officialAerialComplex.src,
    imageAlt: ASSETS.officialAerialComplex.alt,
  },
  {
    pageNumber: 4,
    kicker: 'Ratings, Quality & Future Expansion',
    title: 'Ratings & 2026+ Milestones',
    paragraphs: [
      'Published company credentials highlight Three Star Export House status, ISO 9001/14001/45001/14067 systems, Q4 2023 CBAM reporting, CRISIL A- and ICRA AA- ratings, and ET Edge Best Organization to Work 2026 recognition.',
      'Listed expansions cover ₹1,200 crore (93.43 acres) at Bobbili Growth Centre, Unit-2 Kadambera DRI & 90 MW waste heat recovery plans, and the announced 56 Chowringhee Road corporate office.',
    ],
    metrics: [
      { label: 'Export Status', value: 'Three Star' },
      { label: 'Credit Strip', value: 'CRISIL A- / ICRA AA-' },
    ],
    image: ASSETS.milestone2025Visual.src,
    imageAlt: ASSETS.milestone2025Visual.alt,
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
    image: ASSETS.csrSchool.src,
    alt: ASSETS.csrSchool.alt,
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
    title: 'Native Sapling Plantation & Green Belt Drives',
    summary:
      'Plant personnel and CSR volunteers maintain woodland buffer belts alongside elder-care and gaushala animal welfare assistance.',
    image: ASSETS.csrPlantation.src,
    alt: ASSETS.csrPlantation.alt,
    to: '/sustainability',
    actionLabel: 'View Environmental Scope',
  },
  {
    id: 'csr-health-slide',
    category: 'Workforce & Family Health',
    location: '7 Jan 2026 · Bobbili Works',
    title: 'Abhaya Hospital Multi-Specialty Check-Up Camp',
    summary:
      'Preventive health screening conducted with Abhaya Hospital physicians covering more than 200 plant personnel on-site.',
    image: ASSETS.csrMedicalCamp.src,
    alt: ASSETS.csrMedicalCamp.alt,
    to: '/community',
    actionLabel: 'Read Camp Report',
  },
];

export const QA_PERSPECTIVE_SLIDES: PerspectiveSlide[] = [
  {
    id: 'qa-plate-lab',
    title: 'Spectrometric Assay & Sieve Verification',
    subtitle: 'Metallurgical QA chemists verifying Mn, Si, Cr, C, P, S, and ppm-level boron/nitrogen tolerances.',
    badge: 'ISO 9001 · QA Team',
    image: ASSETS.teamMetallurgyLab.src,
    alt: ASSETS.teamMetallurgyLab.alt,
    to: '/manufacturing',
    actionLabel: 'Inspect QA Route',
  },
  {
    id: 'qa-plate-femn',
    title: 'Ferro Manganese Series (HC, MC, LC & ULC)',
    subtitle: 'High Carbon (70–78% Mn, Low Phos & Low Boron) paired with 6,000 MT/mo AOD refined grades.',
    badge: '4 Grade Series',
    image: ASSETS.officialProdFeMn.src,
    alt: ASSETS.officialProdFeMn.alt,
    specimenPlate: true,
    to: '/products/high-carbon-ferro-manganese',
    actionLabel: 'Open FeMn Tables',
  },
  {
    id: 'qa-plate-simn',
    title: 'Silico Manganese Series (HC, MC & LC)',
    subtitle: 'Primary deoxidizer & manganese-silicon alloying agent covering 55–70% Mn bands.',
    badge: '3 Grade Series',
    image: ASSETS.officialProdSiMn.src,
    alt: ASSETS.officialProdSiMn.alt,
    specimenPlate: true,
    to: '/products/high-carbon-silico-manganese',
    actionLabel: 'Open SiMn Tables',
  },
  {
    id: 'qa-plate-fecr',
    title: 'Low & Medium Carbon Ferro Chrome',
    subtitle: 'Silicothermic & vacuum-treated 60–65% Cr min alloy for stainless and heat-resistant steels.',
    badge: '2 Grade Series',
    image: ASSETS.officialProdFeCr.src,
    alt: ASSETS.officialProdFeCr.alt,
    specimenPlate: true,
    to: '/products/low-medium-carbon-ferro-chrome',
    actionLabel: 'Open FeCr Tables',
  },
  {
    id: 'qa-plate-fesi',
    title: 'Ferro Silicon (FeSi 70 & FeSi 72)',
    subtitle: 'High-silicon ladle deoxidizer (70–72% Si min) engineered for electric-arc & integrated mills.',
    badge: 'FeSi 70 / 72',
    image: ASSETS.officialProdFeSi.src,
    alt: ASSETS.officialProdFeSi.alt,
    specimenPlate: true,
    to: '/products/ferro-silicon',
    actionLabel: 'Open FeSi Tables',
  },
];

