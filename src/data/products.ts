export type AlloyFamily =
  | 'Ferro Manganese'
  | 'Silico Manganese'
  | 'Ferro Chrome'
  | 'Ferro Silicon';

export interface ChemistryColumn {
  key: string;
  label: string;
  qualifier: string;
}

export interface ChemistryTable {
  title: string;
  columns: ChemistryColumn[];
  rows: Array<Record<string, string>>;
  sourceNote?: string;
}

export interface AlloyComparisonProfile {
  primaryElementLabel: string;
  primaryElementRange: string;
  siliconLabel: string;
  siliconRange: string;
  carbonLabel: string;
  carbonRange: string;
  phosphorusLabel: string;
  phosphorusRange: string;
  sulfurLabel: string;
  sulfurRange: string;
  traceElementLabel?: string;
  traceElementRange?: string;
}

export interface AlloyProduct {
  slug: string;
  name: string;
  shortName: string;
  family: AlloyFamily;
  carbonTier: 'High Carbon' | 'Medium Carbon' | 'Low / Ultra Low Carbon' | 'Standard';
  lowPhosphorusOption: boolean;
  summary: string;
  productionProcess: string;
  applications: string[];
  supportedBenefits: string[];
  comparison: AlloyComparisonProfile;
  tables: ChemistryTable[];
  sourceUrl: string;
  hasVerifiedDownload: boolean;
}

export const ALLOY_FAMILIES: AlloyFamily[] = [
  'Ferro Manganese',
  'Silico Manganese',
  'Ferro Chrome',
  'Ferro Silicon',
];

export const PRODUCTS: AlloyProduct[] = [
  {
    slug: 'high-carbon-ferro-manganese',
    name: 'High Carbon Ferro Manganese',
    shortName: 'HC FeMn',
    family: 'Ferro Manganese',
    carbonTier: 'High Carbon',
    lowPhosphorusOption: true,
    summary:
      'Bulk manganese alloying and deoxidising input for carbon, alloy, and structural steelmaking, supplied in standard, low-phosphorus, and low-boron grades.',
    productionProcess:
      'Produced through submerged-arc smelting, refining, and controlled casting. Size and packing are supplied to customer specifications.',
    applications: [
      'Construction and structural long steels',
      'Automotive and commercial vehicle steel grades',
      'Railway rails and heavy engineering forgings',
      'Primary steelmaking deoxidation and manganese adjustment',
    ],
    supportedBenefits: [
      'Contributes mechanical strength, hardness, toughness, and wear resistance in finished steel',
      'Available in dedicated Low Phosphorus (0.1% max) and Low Boron (50 ppm max) variants',
      'Sized and packed according to steelmaker furnace charging requirements',
    ],
    comparison: {
      primaryElementLabel: 'Mn (min / range)',
      primaryElementRange: '65% – 78% min',
      siliconLabel: 'Si (max)',
      siliconRange: '1.5% – 2.0% max',
      carbonLabel: 'C (max / range)',
      carbonRange: '6–8% max',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.1% – 0.30% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.02% – 0.03% max',
      traceElementLabel: 'B (ppm, Low Boron)',
      traceElementRange: '50 ppm max',
    },
    tables: [
      {
        title: 'Standard & Low Phosphorus Grades',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Nominal' },
          { key: 'mn', label: 'MN', qualifier: '(min)' },
          { key: 'si', label: 'Si', qualifier: '(max)' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'p', label: 'P', qualifier: '(max)' },
          { key: 's', label: 'S', qualifier: '(max)' },
        ],
        rows: [
          { category: 'High Carbon', grade: '78%', mn: '78%', si: '1.5%', c: '6-8%', p: '0.30%', s: '0.03%' },
          { category: 'High Carbon', grade: '76%', mn: '76%', si: '1.5%', c: '6-8%', p: '0.30%', s: '0.03%' },
          { category: 'High Carbon', grade: '73%', mn: '73%', si: '1.5%', c: '6-8%', p: '0.30%', s: '0.03%' },
          { category: 'High Carbon', grade: '70%', mn: '70%', si: '2.0%', c: '6-8%', p: '0.30%', s: '0.03%' },
          { category: 'High Carbon', grade: '65%', mn: '65%', si: '2.0%', c: '6-8%', p: '0.30%', s: '0.03%' },
          { category: 'Low Phos', grade: '65-76%', mn: '65-76%', si: '1.5-2%', c: '6-8%', p: '0.1%', s: '0.02%' },
        ],
      },
      {
        title: 'Low Boron Grade',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Nominal' },
          { key: 'mn', label: 'MN', qualifier: '(min)' },
          { key: 'si', label: 'Si', qualifier: '(max)' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'b', label: 'B', qualifier: '(ppm)' },
          { key: 's', label: 'S', qualifier: '(max)' },
        ],
        rows: [
          { category: 'Low Boron', grade: '65-76%', mn: '65-76%', si: '1.5-2%', c: '6-8%', b: '50', s: '0.02%' },
        ],
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/high-carbon-ferro-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'medium-carbon-ferro-manganese',
    name: 'Medium Carbon Ferro Manganese',
    shortName: 'MC FeMn',
    family: 'Ferro Manganese',
    carbonTier: 'Medium Carbon',
    lowPhosphorusOption: true,
    summary:
      'Refined manganese ferro alloy with controlled carbon limits (1.5%–2.0% max) plus Low Phosphorus and Low Silicon & Phosphorus grades for tighter steel chemistry control.',
    productionProcess:
      'Refined from high-carbon melt to limit carbon pickup while preserving manganese recovery. Size and packing are tailored to customer specification.',
    applications: [
      'Low- and medium-carbon structural and automotive steels',
      'Alloy and special bar quality steels sensitive to carbon pickup',
      'Foundry and engineering steel applications',
    ],
    supportedBenefits: [
      'Lower carbon addition compared with high-carbon ferro manganese grades (company site notes 80–93% lower carbon addition across MC/LC FeMn; verify per charge calculation)',
      'Dedicated Low Phos (0.10% max) and Low Si & P (0.6% Si max, 0.10% P max) specifications',
      'Consistent sizing and bulk or bag packing per mill requirement',
    ],
    comparison: {
      primaryElementLabel: 'Mn (min / range)',
      primaryElementRange: '75% – 80% min',
      siliconLabel: 'Si (max)',
      siliconRange: '0.6% – 1% max',
      carbonLabel: 'C (max)',
      carbonRange: '1.5% – 2.0% max',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.10% – 0.25% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.03% max',
      traceElementLabel: 'N (ppm)',
      traceElementRange: '100 – 200 ppm (standard rows)',
    },
    tables: [
      {
        title: 'Medium Carbon, Low Phos & Low Si/P Specifications',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Nominal' },
          { key: 'mn', label: 'MN', qualifier: '(min)' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'p', label: 'P', qualifier: '(max)' },
          { key: 'si', label: 'Si', qualifier: '(max)' },
          { key: 's', label: 'S', qualifier: '(max)' },
          { key: 'n', label: 'N', qualifier: '(ppm)' },
        ],
        rows: [
          { category: 'Medium Carbon', grade: '75/1.5%', mn: '75%', c: '1.5%', p: '0.25%', si: '1%', s: '0.03%', n: '100 – 200' },
          { category: 'Medium Carbon', grade: '78/1.5%', mn: '78%', c: '1.5%', p: '0.25%', si: '1%', s: '0.03%', n: '100 – 200' },
          { category: 'Medium Carbon', grade: '80/1.5%', mn: '80%', c: '1.5%', p: '0.25%', si: '1%', s: '0.03%', n: '100 – 200' },
          { category: 'Medium Carbon', grade: '75/2%', mn: '75%', c: '2.0%', p: '0.25%', si: '1%', s: '0.03%', n: '100 – 200' },
          { category: 'Medium Carbon', grade: '78/2%', mn: '78%', c: '2.0%', p: '0.25%', si: '1%', s: '0.03%', n: '100 – 200' },
          { category: 'Medium Carbon', grade: '80/2%', mn: '80%', c: '2.0%', p: '0.25%', si: '1%', s: '0.03%', n: '100 – 200' },
          { category: 'Low Phos', grade: '75-80/1.5-2%/0.1%', mn: '75 – 80%', c: '1.5 – 2%', p: '0.10%', si: '1%', s: '0.03%', n: '—' },
          { category: 'Low Si & P', grade: '75-80/1.5-2%/0.6%', mn: '75 – 80%', c: '1.5 – 2%', p: '0.10%', si: '0.6%', s: '0.03%', n: '—' },
        ],
        sourceNote: 'Nitrogen cells left blank in Low Phos and Low Si & P rows indicate unspecified values in source records, not zero.',
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/medium-carbon-ferro-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'low-ultra-low-carbon-ferro-manganese',
    name: 'Low & Ultra Low Carbon Ferro Manganese',
    shortName: 'LC / ULC FeMn',
    family: 'Ferro Manganese',
    carbonTier: 'Low / Ultra Low Carbon',
    lowPhosphorusOption: true,
    summary:
      'AOD-purified ferro manganese engineered for high-grade automotive, stainless, and specialty flat steels requiring ultra-tight carbon and nitrogen control.',
    productionProcess:
      'Produced using Argon Oxygen Decarburisation (AOD) purification to reduce carbon and trace impurities while maintaining high manganese concentration.',
    applications: [
      'Interstitial-free and high-formability automotive sheet steels',
      'Speciality stainless and tool steels',
      'Low-nitrogen flat and line-pipe steel grades',
      'Welding electrode and precision engineering metallurgy',
    ],
    supportedBenefits: [
      'Carbon levels down to 0.5% in standard Low Carbon rows, plus dedicated Low Phos and Low Nitrogen variants',
      'Positioned by the company for lower-carbon steelmaking pathways',
      'Supplied to custom lump size and export-ready packaging',
    ],
    comparison: {
      primaryElementLabel: 'Mn (source)',
      primaryElementRange: '78% – 80%',
      siliconLabel: 'Si (max)',
      siliconRange: '0.06 – 1% max',
      carbonLabel: 'C (source)',
      carbonRange: '0.5% – 1%',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.10% – 0.25% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.03% max',
      traceElementLabel: 'N (source)',
      traceElementRange: '100–200 (unit unspec.) / 100PPM',
    },
    tables: [
      {
        title: 'Low Carbon, Low Phos & Low Nitrogen Grades',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Label' },
          { key: 'mn', label: 'MN', qualifier: '(source)' },
          { key: 'c', label: 'C', qualifier: '(source)' },
          { key: 'p', label: 'P', qualifier: '(MAX)' },
          { key: 'si', label: 'Si', qualifier: '(MAX)' },
          { key: 's', label: 'S', qualifier: '(MAX)' },
          { key: 'n', label: 'N', qualifier: '(source)' },
        ],
        rows: [
          { category: 'Low Carbon', grade: '78/1%', mn: '78%', c: '1 %', p: '0.25% MAX', si: '1% MAX', s: '0.03% MAX', n: '100-200' },
          { category: 'Low Carbon', grade: '80/1%', mn: '80%', c: '1%', p: '0.25% MAX', si: '1% MAX', s: '0.03% MAX', n: '100-200' },
          { category: 'Low Carbon', grade: '78/0.8%', mn: '78%', c: '0.8%', p: '0.25% MAX', si: '1% MAX', s: '0.03% MAX', n: '100-200' },
          { category: 'Low Carbon', grade: '80/0.8%', mn: '80%', c: '0.8%', p: '0.25% MAX', si: '1% MAX', s: '0.03% MAX', n: '100-200' },
          { category: 'Low Carbon', grade: '78/0.5%', mn: '78%', c: '0.5%', p: '0.25% MAX', si: '1% MAX', s: '0.03% MAX', n: '100-200' },
          { category: 'Low Carbon', grade: '80/0.5%', mn: '80%', c: '0.5%', p: '0.25% MAX', si: '1% MAX', s: '0.03% MAX', n: '100-200' },
          { category: 'Low Phos', grade: '78-80/0.5-1/06%', mn: '78 – 80%', c: '0.5 – 1%', p: '0.10% MAX', si: '1% MAX', s: '0.03% MAX', n: '—' },
          { category: 'Low Nitrogen', grade: '78-80/0.5-1/100PPM', mn: '78 – 80%', c: '0.5 – 1%', p: '0.20% MAX', si: '0.06-1% MAX', s: '—', n: '100PPM' },
        ],
        sourceNote: 'Source table lists 100-200 under N without an explicit unit (comparable Medium Carbon table uses ppm). Missing N in Low Phos and S in Low Nitrogen reflect source omissions rather than zero.',
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/low-ultra-low-carbon-ferro-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'high-carbon-silico-manganese',
    name: 'High Carbon Silico Manganese',
    shortName: 'HC SiMn',
    family: 'Silico Manganese',
    carbonTier: 'High Carbon',
    lowPhosphorusOption: true,
    summary:
      'Dual-action iron, silicon, and manganese alloy delivering combined deoxidation and alloying across carbon, alloy, and structural steel melts.',
    productionProcess:
      'Smelted in submerged-arc furnaces with controlled slag basicity to maintain manganese and silicon balance. Custom sizing and packing available.',
    applications: [
      'Carbon and low-alloy structural steelmaking',
      'Rebar, wire rod, and long products',
      'Alloy and tool steel secondary metallurgy',
    ],
    supportedBenefits: [
      'Combines manganese and silicon deoxidation in a single ladle or furnace addition',
      'Website notes typical 4–6% productivity improvement during decarburisation and improved furnace lining life',
      'Offered in standard 0.30% P max and Low Phos 0.10% P max series',
    ],
    comparison: {
      primaryElementLabel: 'Mn (min)',
      primaryElementRange: '60% – 70% min',
      siliconLabel: 'Si (source header: max)',
      siliconRange: '14% – 17%',
      carbonLabel: 'C (max)',
      carbonRange: '2.00% – 2.50% max',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.10% – 0.30% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.04% max',
    },
    tables: [
      {
        title: 'High Carbon & Low Phos Silico Manganese Grades',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Mn/Si' },
          { key: 'mn', label: 'MN', qualifier: '(min)' },
          { key: 'si', label: 'Si', qualifier: '(max)*' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'p', label: 'P', qualifier: '(max)' },
          { key: 's', label: 'S', qualifier: '(max)' },
        ],
        rows: [
          { category: 'High Carbon', grade: '60 /14', mn: '60%', si: '14%', c: '2.50%', p: '0.30%', s: '0.04%' },
          { category: 'High Carbon', grade: '65 /15', mn: '65%', si: '15%', c: '2.2 – 2.5%', p: '0.30%', s: '0.04%' },
          { category: 'High Carbon', grade: '65 /16', mn: '65%', si: '16%', c: '2-2.20%', p: '0.30%', s: '0.04%' },
          { category: 'High Carbon', grade: '65 /17', mn: '65%', si: '17%', c: '2-2.20%', p: '0.30%', s: '0.04%' },
          { category: 'High Carbon', grade: '70 /15', mn: '70%', si: '15%', c: '2-2.20%', p: '0.30%', s: '0.04%' },
          { category: 'High Carbon', grade: '70 /16', mn: '70%', si: '16%', c: '2-2.20%', p: '0.30%', s: '0.04%' },
          { category: 'Low Phos', grade: '60 /14', mn: '60%', si: '14%', c: '2.50%', p: '0.10%', s: '0.04%' },
          { category: 'Low Phos', grade: '65 /15-17', mn: '65%', si: '15-17%', c: '2.00%', p: '0.10%', s: '0.04%' },
          { category: 'Low Phos', grade: '70 /15-16', mn: '70%', si: '15%', c: '2.20%', p: '0.10%', s: '0.04%' },
        ],
        sourceNote: '*Column header Si (max) is preserved verbatim from the source table; verify min/typical silicon specification in final sales contract.',
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/high-carbon-silico-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'high-carbon-low-phosphorus-silico-manganese',
    name: 'High Carbon Low Phosphorus Silico Manganese',
    shortName: 'HC LP SiMn',
    family: 'Silico Manganese',
    carbonTier: 'High Carbon',
    lowPhosphorusOption: true,
    summary:
      'Dedicated low-phosphorus (0.10% max) silico manganese grade engineered for steel melts requiring cleaner inclusion profiles and reduced phosphorus loading.',
    productionProcess:
      'Smelted with low-phosphorus manganese ore blends and controlled slag chemistry. Supplied in custom lump sizes and export packaging.',
    applications: [
      'Alloy and special steelmaking requiring controlled phosphorus',
      'Automotive, forging, and wire rod grades',
      'Combined deoxidation where phosphorus pickup must be capped at 0.10%',
    ],
    supportedBenefits: [
      'Capped phosphorus at 0.10% max with 60–70% min Mn and 14–17% min Si',
      'Supports cleaner grain boundaries and impact toughness in downstream rolled steel',
    ],
    comparison: {
      primaryElementLabel: 'Mn (MIN)',
      primaryElementRange: '60 – 70% MIN',
      siliconLabel: 'Si (MIN)',
      siliconRange: '14 – 17% MIN',
      carbonLabel: 'C (MAX)',
      carbonRange: '1.8 – 2.5% MAX',
      phosphorusLabel: 'P (MAX)',
      phosphorusRange: '0.10% MAX',
      sulfurLabel: 'S (MAX)',
      sulfurRange: '0.03/0.04% MAX',
    },
    tables: [
      {
        title: 'All-Grade Specification',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Scope' },
          { key: 'mn', label: 'MN', qualifier: '(MIN)' },
          { key: 'si', label: 'Si', qualifier: '(MIN)' },
          { key: 'c', label: 'C', qualifier: '(MAX)' },
          { key: 'p', label: 'P', qualifier: '(MAX)' },
          { key: 's', label: 'S', qualifier: '(MAX)' },
        ],
        rows: [
          {
            category: 'High Carbon Low Phos',
            grade: 'All Grade',
            mn: '60 – 70% MIN',
            si: '14 – 17% MIN',
            c: '1.8 – 2.5% MAX',
            p: '0.10% MAX',
            s: '0.03/0.04% MAX',
          },
        ],
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/high-carbon-low-phosphorus-silico-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'medium-carbon-silico-manganese',
    name: 'Medium Carbon Silico Manganese',
    shortName: 'MC SiMn',
    family: 'Silico Manganese',
    carbonTier: 'Medium Carbon',
    lowPhosphorusOption: true,
    summary:
      'Low-phosphorus (0.10% max) medium-carbon silico manganese balancing 58–60% manganese with high silicon (25–22% in source record) and 0.2–0.5% carbon.',
    productionProcess:
      'Produced via controlled silicothermic/refining steps to suppress carbon below 0.5% while maintaining low phosphorus and sulfur.',
    applications: [
      '200-series stainless steelmaking',
      'Specialised foundry melts and welding electrode coatings',
      'Medium- and low-carbon alloy steel refining',
    ],
    supportedBenefits: [
      'Enables simultaneous manganese and silicon alloying with minimal carbon addition',
      'Low phosphorus (0.10% max) and ultra-low sulfur (0.02% max)',
    ],
    comparison: {
      primaryElementLabel: 'Mn (min)',
      primaryElementRange: '58 – 60% min',
      siliconLabel: 'Si (source: max)',
      siliconRange: '25-22%',
      carbonLabel: 'C (max)',
      carbonRange: '0.2-0.5% max',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.10% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.02% max',
    },
    tables: [
      {
        title: 'Medium Carbon Specification',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Nominal' },
          { key: 'mn', label: 'MN', qualifier: '(min)' },
          { key: 'si', label: 'Si', qualifier: '(max)*' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'p', label: 'P', qualifier: '(max)' },
          { key: 's', label: 'S', qualifier: '(max)' },
        ],
        rows: [
          {
            category: 'Medium Carbon',
            grade: '58–60/25-22/0.2-05',
            mn: '58 – 60%',
            si: '25-22%',
            c: '0.2-0.5%',
            p: '0.10%',
            s: '0.02%',
          },
        ],
        sourceNote: '*Reversed silicon range (25-22%) and column qualifier Si (max) are preserved verbatim from source records; confirm exact Si tolerance before order release.',
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/medium-carbon-silico-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'low-carbon-silico-manganese',
    name: 'Low Carbon Silico Manganese',
    shortName: 'LC SiMn',
    family: 'Silico Manganese',
    carbonTier: 'Low / Ultra Low Carbon',
    lowPhosphorusOption: true,
    summary:
      'High-silicon, low-carbon manganese alloy (0.10% C max) tailored for stainless steel, specialty foundries, and low-carbon alloy grades.',
    productionProcess:
      'Refined to cap carbon at 0.10% max with low sulfur (0.02% max) and phosphorus (0.10% max). Supplied to customer lump sizing.',
    applications: [
      '200-series and austenitic stainless steel production',
      'Welding electrode flux and wire formulations',
      'Specialised low-carbon foundry and engineering steels',
    ],
    supportedBenefits: [
      'Carbon constrained to 0.10% max avoids unwanted carburisation during late-stage ladle trimming',
      'Low sulfur (0.02% max) supports clean stainless steel surface quality',
    ],
    comparison: {
      primaryElementLabel: 'Mn (min)',
      primaryElementRange: '58-60% min',
      siliconLabel: 'Si (source: max)',
      siliconRange: '27%',
      carbonLabel: 'C (max)',
      carbonRange: '0.10% max',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.10% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.02% max',
    },
    tables: [
      {
        title: 'Low Carbon Specification',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Nominal' },
          { key: 'mn', label: 'MN', qualifier: '(min)' },
          { key: 'si', label: 'Si', qualifier: '(max)*' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'p', label: 'P', qualifier: '(max)' },
          { key: 's', label: 'S', qualifier: '(max)' },
        ],
        rows: [
          {
            category: 'Low Carbon',
            grade: '55-60/27/0.1',
            mn: '58-60%',
            si: '27%',
            c: '0.10%',
            p: '0.10%',
            s: '0.02%',
          },
        ],
        sourceNote: '*Grade label 55-60/27/0.1 differs slightly from the Mn specification cell (58-60%), and Si header states (max); preserved verbatim pending datasheet confirmation.',
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/low-carbon-silico-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'low-carbon-low-phosphorus-silico-manganese',
    name: 'Low Carbon Low Phosphorus Silico Manganese',
    shortName: 'LC LP SiMn',
    family: 'Silico Manganese',
    carbonTier: 'Low / Ultra Low Carbon',
    lowPhosphorusOption: true,
    summary:
      'Dual low-carbon and low-phosphorus (0.10% P max) silico manganese designed for clean stainless and speciality low-carbon steel chemistries.',
    productionProcess:
      'Refined from selected low-impurity charge materials to control both carbon and phosphorus simultaneously.',
    applications: [
      '200-series and speciality stainless steels',
      'Clean low-carbon alloy steels with strict phosphorus ceilings',
      'Foundry and electrode manufacturing',
    ],
    supportedBenefits: [
      'Simultaneously restricts phosphorus (0.10% max), sulfur (0.02% max), and carbon (0.2–0.1% max in source)',
      'Custom crushed sizing and export-grade packaging',
    ],
    comparison: {
      primaryElementLabel: 'Mn (source)',
      primaryElementRange: '55 – 60%',
      siliconLabel: 'Si (source)',
      siliconRange: '25-27% MAX',
      carbonLabel: 'C (source)',
      carbonRange: '0.2 – 0.1% MAX',
      phosphorusLabel: 'P (MAX)',
      phosphorusRange: '0.10% MAX',
      sulfurLabel: 'S (MAX)',
      sulfurRange: '0.02% MAX',
    },
    tables: [
      {
        title: 'Low Carbon Low Phosphorus Specification',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Range' },
          { key: 'mn', label: 'MN', qualifier: '(source)' },
          { key: 'si', label: 'Si', qualifier: '(MAX)' },
          { key: 'c', label: 'C', qualifier: '(MAX)' },
          { key: 'p', label: 'P', qualifier: '(MAX)' },
          { key: 's', label: 'S', qualifier: '(MAX)' },
        ],
        rows: [
          {
            category: 'Low Carbon Low Phos',
            grade: '55 – 60%',
            mn: '55 – 60%',
            si: '25-27% MAX',
            c: '0.2 – 0.1% MAX',
            p: '0.10% MAX',
            s: '0.02% MAX',
          },
        ],
        sourceNote: 'Carbon notation (0.2 – 0.1% MAX) and Si (25-27% MAX) reflect source table phrasing verbatim.',
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/low-carbon-low-phosphorus-silico-manganese/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'low-medium-carbon-ferro-chrome',
    name: 'Low & Medium Carbon Ferro Chrome (LC & MC)',
    shortName: 'LC / MC FeCr',
    family: 'Ferro Chrome',
    carbonTier: 'Low / Ultra Low Carbon',
    lowPhosphorusOption: false,
    summary:
      'Chromium alloying input (60–65% Cr min) with low and medium carbon tiers (0.1%, 0.25%, 0.5% C max) for stainless, heat-resistant, and specialty steels.',
    productionProcess:
      'Produced via silicothermic reduction with optional vacuum treatment to achieve low carbon residuals without sacrificing chromium recovery.',
    applications: [
      'Austenitic stainless steels including 304L and 316L',
      'Nickel-base and iron-base superalloys',
      'Chemical processing equipment and heat-resistant castings',
    ],
    supportedBenefits: [
      'Supplies controlled chromium to impart corrosion, oxidation, heat, and wear resistance',
      'Three distinct carbon max tiers (0.5%, 0.25%, 0.1%) at 60–65% minimum chromium',
      'Low sulfur (0.03% max) and phosphorus (0.04% max)',
    ],
    comparison: {
      primaryElementLabel: 'Cr (min — Chromium)',
      primaryElementRange: '60-65% min',
      siliconLabel: 'Si (max)',
      siliconRange: '1.50% max',
      carbonLabel: 'C (max)',
      carbonRange: '0.1% / 0.25% / 0.5% max',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.04% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.03% max',
    },
    tables: [
      {
        title: 'Low & Medium Carbon Ferro Chrome Grades',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Nominal' },
          { key: 'cr', label: 'Cr', qualifier: '(min)' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'si', label: 'Si', qualifier: '(max)' },
          { key: 'p', label: 'P', qualifier: '(max)' },
          { key: 's', label: 'S', qualifier: '(max)' },
        ],
        rows: [
          { category: 'Medium & Low Carbon', grade: '60-65', cr: '60-65%', c: '0.5%', si: '1.50%', p: '0.04%', s: '0.03%' },
          { category: 'Medium & Low Carbon', grade: '60-65', cr: '60-65%', c: '0.25%', si: '1.50%', p: '0.04%', s: '0.03%' },
          { category: 'Medium & Low Carbon', grade: '60-65', cr: '60-65%', c: '0.1%', si: '1.50%', p: '0.04%', s: '0.03%' },
        ],
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/low-medium-carbon-ferro-chrome/',
    hasVerifiedDownload: false,
  },
  {
    slug: 'ferro-silicon',
    name: 'Ferro Silicon',
    shortName: 'FeSi 70 / 72',
    family: 'Ferro Silicon',
    carbonTier: 'Standard',
    lowPhosphorusOption: false,
    summary:
      'High-purity silicon alloy (70% and 72% Si min) engineered for steel deoxidation, silicon alloying, electrical steel, and cast iron inoculation.',
    productionProcess:
      'Carbothermic reduction of quartz with iron sources in electric submerged-arc furnaces, followed by controlled crushing and screening.',
    applications: [
      'Carbon, alloy, and stainless steelmaking',
      'Grain-oriented and non-oriented electrical steels (motor & transformer cores)',
      'Foundry cast iron inoculation and nodularisation base',
      'Corrosion- and heat-resistant ferrous alloys',
    ],
    supportedBenefits: [
      'Consistent silicon recovery (70% and 72% minimum grades) with low carbon (0.15% max)',
      'Controlled aluminium (1.5–2% max), phosphorus (0.04% max), and sulfur (0.02% max)',
      'Sized and packed per steel mill or foundry specification',
    ],
    comparison: {
      primaryElementLabel: 'Si (min — Silicon)',
      primaryElementRange: '70% / 72% min',
      siliconLabel: 'Si (min — Primary)',
      siliconRange: '70% – 72% min',
      carbonLabel: 'C (max)',
      carbonRange: '0.15% max',
      phosphorusLabel: 'P (max)',
      phosphorusRange: '0.04% max',
      sulfurLabel: 'S (max)',
      sulfurRange: '0.02% max',
      traceElementLabel: 'Al (max)',
      traceElementRange: '1.5-2% max',
    },
    tables: [
      {
        title: 'Ferro Silicon Specifications',
        columns: [
          { key: 'category', label: 'Variant', qualifier: 'Series' },
          { key: 'grade', label: 'Grade', qualifier: 'Nominal' },
          { key: 'si', label: 'Si', qualifier: '(min)' },
          { key: 'al', label: 'Al', qualifier: '(max)' },
          { key: 'c', label: 'C', qualifier: '(max)' },
          { key: 'p', label: 'P', qualifier: '(max)' },
          { key: 's', label: 'S', qualifier: '(max)' },
        ],
        rows: [
          { category: 'Ferro Silicon', grade: '70', si: '70%', al: '1.5-2%', c: '0.15%', p: '0.04%', s: '0.02%' },
          { category: 'Ferro Silicon', grade: '72', si: '72%', al: '1.5-2%', c: '0.15%', p: '0.04%', s: '0.02%' },
        ],
      },
    ],
    sourceUrl: 'https://berryalloys.com/product/ferro-silicon/',
    hasVerifiedDownload: false,
  },
];

export function getProductBySlug(slug: string): AlloyProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
