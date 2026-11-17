// Real official images sourced from berryalloys.com alongside high-resolution metallurgical scenes
import logoBerryImg from '../assets/images/official/berry_logo_clean.png';
import logoBerryDarkImg from '../assets/images/official/berry_logo_dark.png';
import aboutPlantImg from '../assets/images/official/about_plant.jpeg';
import heroAerialPlantImg from '../assets/images/official/hero_slide_1.jpg';
import heroSolarRoofImg from '../assets/images/official/hero_slide_2.jpg';
import heroGreenBeltImg from '../assets/images/official/hero_slide_3.jpg';
import plantOverviewWideImg from '../assets/images/official/plant_overview_9.jpg';
import berryBuildingImg from '../assets/images/official/berry_building.png';
import heroNewOfficeImg from '../assets/images/official/hero_new_office.jpg';
import sustainabilityFeatureImg from '../assets/images/official/sustainability_feature.jpg';
import vijayGuptaMdImg from '../assets/images/official/vijay_gupta_md_portrait.webp';
import prodFeMnImg from '../assets/images/official/prod_femn_hc.jpg';
import prodSiMnImg from '../assets/images/official/prod_simn_hc.jpg';
import prodFeCrImg from '../assets/images/official/prod_fecr_lc.jpg';
import prodFeSiImg from '../assets/images/official/prod_fesi.jpg';
import csrMedicalCampImg from '../assets/images/official/csr_medical_camp.jpg';
import csrSchoolImg from '../assets/images/official/csr_school.jpg';
import csrPlantationImg from '../assets/images/official/csr_plantation.jpeg';
import csrWaterImg from '../assets/images/official/csr_water.jpg';
import awardEtEdgeImg from '../assets/images/official/award_et_edge_2026.png';
import newsBobbiliImg from '../assets/images/official/news_bobbili.jpg';
import milestone2010Img from '../assets/images/official/milestone_2010.png';
import milestone2025Img from '../assets/images/official/milestone_2025.jpg';

import heroSmeltingImg from '../assets/images/hero_furnace_smelting_1794767504582.jpg';
import qualityLabImg from '../assets/images/manufacturing_quality_lab_1794767505636.jpg';
import portLogisticsImg from '../assets/images/port_export_logistics_1794767505352.jpg';
import furnaceElectrodeImg from '../assets/images/furnace_electrode_casting_1794773264888.jpg';
import alloySamplesImg from '../assets/images/alloy_metallurgy_samples_1794767504087.jpg';
import ferroChromeImg from '../assets/images/ferro_chrome_crystals_1794773263273.jpg';
import ferroSiliconImg from '../assets/images/ferro_silicon_granules_1794773263704.jpg';
import silicoManganeseImg from '../assets/images/silico_manganese_ingots_1794773266157.jpg';
import solarPlantImg from '../assets/images/solar_industrial_plant_1794767506553.jpg';
import teamFurnaceEngineersImg from '../assets/images/team_furnace_engineers_1794897562809.jpg';
import teamMetallurgyLabImg from '../assets/images/team_metallurgy_lab_1794897574115.jpg';
import teamSafetyHuddleImg from '../assets/images/team_safety_huddle_1794897549727.jpg';

export interface VisualAsset {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category:
    | 'Plant Complex'
    | 'Smelting'
    | 'Material Specimen'
    | 'Quality Lab'
    | 'Logistics'
    | 'Energy'
    | 'People & Teams'
    | 'Community & CSR'
    | 'Corporate';
  isOfficialPhoto?: boolean;
  specimenPlate?: boolean;
}

export const OFFICIAL_BRAND_MARK = logoBerryImg;
export const OFFICIAL_BRAND_MARK_DARK = logoBerryDarkImg;

export const ASSETS = {
  officialPlantGate: {
    id: 'official-plant-gate',
    src: aboutPlantImg,
    alt: 'Berry Alloys Limited manufacturing complex aerial photograph showing plant gate with Indian flag, furnace bays, switchyard, and raw material yards',
    caption: 'Berry Alloys Limited smelting complex — furnace bays, raw material handling, and captive substation',
    category: 'Plant Complex',
    isOfficialPhoto: true,
  },
  officialAerialComplex: {
    id: 'official-aerial-complex',
    src: heroAerialPlantImg,
    alt: 'Aerial view of Berry Alloys ferro alloy works at Bobbili Growth Centre showing rooftop solar panels and production sheds',
    caption: 'Bobbili Works aerial perspective — integrated ferro alloy furnace sheds and solar roofing',
    category: 'Plant Complex',
    isOfficialPhoto: true,
  },
  officialPlantOverview: {
    id: 'official-plant-overview',
    src: plantOverviewWideImg,
    alt: 'Wide overview of Berry Alloys smelting operations, emissions stacks, switchyard, and surrounding hills in Vizianagaram district',
    caption: 'Bobbili Growth Centre complex spanning ferro alloy reduction bays and logistics yards',
    category: 'Plant Complex',
    isOfficialPhoto: true,
  },
  officialSolarRoof: {
    id: 'official-solar-roof',
    src: heroSolarRoofImg,
    alt: 'Industrial rooftop solar photovoltaic array installed at Berry Alloys manufacturing facility',
    caption: 'Captive industrial solar generation integrated across plant shed roofs',
    category: 'Energy',
    isOfficialPhoto: true,
  },
  officialGreenBelt: {
    id: 'official-green-belt',
    src: heroGreenBeltImg,
    alt: 'Woodland plantation canopy maintained as part of Berry Alloys environmental stewardship programme',
    caption: 'Green belt plantation stewardship surrounding manufacturing zones',
    category: 'Community & CSR',
    isOfficialPhoto: true,
  },
  corporateHouse: {
    id: 'corporate-house',
    src: berryBuildingImg,
    alt: 'Berry Alloys Corporate House architectural exterior',
    caption: 'Berry Alloys corporate presence supporting commercial operations and global trade',
    category: 'Corporate',
    isOfficialPhoto: true,
  },
  vijayGuptaPortrait: {
    id: 'vijay-gupta-md',
    src: vijayGuptaMdImg,
    alt: 'Shri Vijay Gupta, Managing Director of Berry Alloys Limited',
    caption: 'Shri Vijay Gupta — Managing Director, Berry Alloys Limited',
    category: 'Corporate',
    isOfficialPhoto: true,
  },
  awardEtEdge2026: {
    id: 'award-et-edge-2026',
    src: awardEtEdgeImg,
    alt: 'ET Edge Best Organization to Work 2026 award crest recognised by Berry Alloys Limited',
    caption: 'ET Edge Best Organization to Work 2026 workplace recognition badge',
    category: 'Corporate',
    isOfficialPhoto: true,
  },
  newsBobbiliVisual: {
    id: 'news-bobbili',
    src: newsBobbiliImg,
    alt: 'Aerial smelting facility site associated with the July 2026 Bobbili Growth Centre project announcement',
    caption: 'Bobbili Growth Centre corridor site featured in July 2026 project disclosures',
    category: 'Plant Complex',
    isOfficialPhoto: true,
  },
  milestone2010Visual: {
    id: 'milestone-2010',
    src: milestone2010Img,
    alt: 'Early submerged-arc furnace steelmaking operations representative of Berry Alloys 2010 commissioning',
    caption: 'Foundational smelting commissioning phase (2010 · 2 × 10 MVA)',
    category: 'Smelting',
    isOfficialPhoto: true,
  },
  milestone2025Visual: {
    id: 'milestone-2025',
    src: milestone2025Img,
    alt: 'Expanded modern smelting operations and logistics infrastructure active in 2025 expansion phase',
    caption: 'Multi-furnace complex scaling into 1,000 TPD DRI and 2 × 30 MVA expansion (2025)',
    category: 'Plant Complex',
    isOfficialPhoto: true,
  },
  officialProdFeMn: {
    id: 'official-prod-femn',
    src: prodFeMnImg,
    alt: 'Official Ferro Manganese metallic alloy lumps showing crystalline manganese fracture surfaces',
    caption: 'Berry Alloys Ferro Manganese (High, Medium, Low & Ultra-Low Carbon) specimen',
    category: 'Material Specimen',
    isOfficialPhoto: true,
    specimenPlate: true,
  },
  officialProdSiMn: {
    id: 'official-prod-simn',
    src: prodSiMnImg,
    alt: 'Official Silico Manganese alloy lumps with silvery-grey silica-manganese lustre',
    caption: 'Berry Alloys Silico Manganese (HC, MC & LC grades) specimen',
    category: 'Material Specimen',
    isOfficialPhoto: true,
    specimenPlate: true,
  },
  officialProdFeCr: {
    id: 'official-prod-fecr',
    src: prodFeCrImg,
    alt: 'Official Low and Medium Carbon Ferro Chrome crystalline alloy lumps',
    caption: 'Berry Alloys Low & Medium Carbon Ferro Chrome (60–65% Cr min) specimen',
    category: 'Material Specimen',
    isOfficialPhoto: true,
    specimenPlate: true,
  },
  officialProdFeSi: {
    id: 'official-prod-fesi',
    src: prodFeSiImg,
    alt: 'Official Ferro Silicon 70 and 72 metallic crystal lumps',
    caption: 'Berry Alloys Ferro Silicon (FeSi 70 & FeSi 72) specimen',
    category: 'Material Specimen',
    isOfficialPhoto: true,
    specimenPlate: true,
  },
  csrMedicalCamp: {
    id: 'csr-medical-camp',
    src: csrMedicalCampImg,
    alt: 'Multi-specialty medical camp banner organised by Berry Alloys Limited with Abhaya Hospital on 7 January 2026',
    caption: 'Free Medical Check-Up Camp with Abhaya Hospital — 7 January 2026 (200+ employees screened)',
    category: 'Community & CSR',
    isOfficialPhoto: true,
  },
  csrSchool: {
    id: 'csr-school',
    src: csrSchoolImg,
    alt: 'Berry Alloys rural school building upgrade and education infrastructure CSR initiative',
    caption: 'Community school classroom construction, digital education, and IT infrastructure support',
    category: 'Community & CSR',
    isOfficialPhoto: true,
  },
  csrPlantation: {
    id: 'csr-plantation',
    src: csrPlantationImg,
    alt: 'Sapling plantation drive led by plant personnel across Berry Alloys Limited premises',
    caption: 'Annual native sapling plantation drives across operational sites',
    category: 'Community & CSR',
    isOfficialPhoto: true,
  },
  csrWater: {
    id: 'csr-water',
    src: csrWaterImg,
    alt: 'RO clean drinking water facility and civic infrastructure supported by Berry Alloys around Bobbili',
    caption: 'Clean drinking water (RO) installations & community tank maintenance in Bobbili region',
    category: 'Community & CSR',
    isOfficialPhoto: true,
  },
  heroSmelting: {
    id: 'hero-smelting',
    src: heroSmeltingImg,
    alt: 'Illustrative submerged-arc electric furnace tapping molten ferro alloy into an industrial steel ladle',
    caption: 'Illustrative smelting bay — submerged-arc tapping and molten ladle transfer',
    category: 'Smelting',
  },
  furnaceElectrodes: {
    id: 'furnace-electrodes',
    src: furnaceElectrodeImg,
    alt: 'Illustrative submerged-arc furnace electrode columns and structural steel gantry in warm copper glow',
    caption: 'Illustrative submerged-arc electrode assembly under high-temperature reduction',
    category: 'Smelting',
  },
  alloySamples: {
    id: 'alloy-samples',
    src: alloySamplesImg,
    alt: 'Representative crystalline ferro-manganese metallic alloy lumps on dark matte basalt',
    caption: 'Representative Ferro Manganese fracture facets showing crystalline grain structure',
    category: 'Material Specimen',
  },
  silicoManganese: {
    id: 'silico-manganese',
    src: silicoManganeseImg,
    alt: 'Representative crushed silico-manganese alloy lumps staged in a heavy steel industrial hopper',
    caption: 'Representative Silico Manganese bulk crushed material staged for dispatch sizing',
    category: 'Material Specimen',
  },
  ferroChrome: {
    id: 'ferro-chrome',
    src: ferroChromeImg,
    alt: 'Representative bright silver low-carbon ferro chrome metallic crystals on dark stone',
    caption: 'Representative Low & Medium Carbon Ferro Chrome crystalline cleavage planes',
    category: 'Material Specimen',
  },
  ferroSilicon: {
    id: 'ferro-silicon',
    src: ferroSiliconImg,
    alt: 'Representative blue-grey ferro silicon 70 and 72 metallic alloy lumps with silicon crystal facets',
    caption: 'Representative Ferro Silicon 70/72 high-silicon metallic fracture surfaces',
    category: 'Material Specimen',
  },
  qualityLab: {
    id: 'quality-lab',
    src: qualityLabImg,
    alt: 'Illustrative metallurgical chemical analysis and optical emission spectrometer laboratory',
    caption: 'Illustrative metallurgical laboratory — spectroscopic verification of batch chemistry',
    category: 'Quality Lab',
  },
  portLogistics: {
    id: 'port-logistics',
    src: portLogisticsImg,
    alt: 'Illustrative deep-water coastal export harbour terminal with gantry cranes and containerised freight',
    caption: 'Illustrative deep-water coastal port gateway supporting containerised bulk alloy exports',
    category: 'Logistics',
  },
  solarPlant: {
    id: 'solar-plant',
    src: solarPlantImg,
    alt: 'Illustrative utility-scale solar photovoltaic array flanking an industrial smelting complex',
    caption: 'Illustrative industrial solar power generation adjacent to alloy manufacturing',
    category: 'Energy',
  },
  newCorporateOffice: {
    id: 'new-corporate-office',
    src: heroNewOfficeImg,
    alt: 'Berry Alloys Limited corporate office announcement featuring 56 Chowringhee Road, Kolkata',
    caption: 'Announced upcoming corporate office at 56, Chowringhee Road, Kolkata',
    category: 'Corporate',
    isOfficialPhoto: true,
  },
  sustainabilityFeature: {
    id: 'sustainability-feature',
    src: sustainabilityFeatureImg,
    alt: 'Berry Alloys Limited sustainability and clean-energy carbon footprint disclosure graphic',
    caption: 'Berry Alloys sustainability stewardship — ISO 14067:2018 & renewable integration',
    category: 'Energy',
    isOfficialPhoto: true,
  },
  teamFurnaceEngineers: {
    id: 'team-furnace-engineers',
    src: teamFurnaceEngineersImg,
    alt: 'Metallurgical furnace engineers and plant operators reviewing submerged-arc gauges on the smelting bay control desk',
    caption: 'Smelting engineering crew inspecting submerged-arc furnace instrumentation and charge logs',
    category: 'People & Teams',
  },
  teamMetallurgyLab: {
    id: 'team-metallurgy-lab',
    src: teamMetallurgyLabImg,
    alt: 'Quality assurance chemists and metallurgical analysts testing ferro manganese lumps beside an optical emission spectrometer',
    caption: 'Metallurgical QA/QC laboratory analysts verifying batch chemistry prior to dispatch',
    category: 'People & Teams',
  },
  teamSafetyHuddle: {
    id: 'team-safety-huddle',
    src: teamSafetyHuddleImg,
    alt: 'Plant safety officer, women engineers, and shopfloor technicians conducting an ISO 45001 shift safety briefing',
    caption: 'Cross-functional shift safety briefing upholding ISO 45001 shopfloor protocols',
    category: 'People & Teams',
  },
} as const satisfies Record<string, VisualAsset>;

export const GALLERY_ITEMS: VisualAsset[] = [
  ASSETS.officialPlantGate,
  ASSETS.officialAerialComplex,
  ASSETS.officialPlantOverview,
  ASSETS.teamFurnaceEngineers,
  ASSETS.teamMetallurgyLab,
  ASSETS.teamSafetyHuddle,
  ASSETS.heroSmelting,
  ASSETS.furnaceElectrodes,
  ASSETS.officialProdFeMn,
  ASSETS.officialProdSiMn,
  ASSETS.officialProdFeCr,
  ASSETS.officialProdFeSi,
  ASSETS.qualityLab,
  ASSETS.portLogistics,
  ASSETS.officialSolarRoof,
  ASSETS.newCorporateOffice,
  ASSETS.csrMedicalCamp,
  ASSETS.csrSchool,
  ASSETS.csrPlantation,
  ASSETS.csrWater,
];
