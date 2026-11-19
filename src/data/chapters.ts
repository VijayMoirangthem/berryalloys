export interface HomeChapter {
  id: string;
  number: string;
  label: string;
  summary: string;
}

export const HOME_CHAPTERS: HomeChapter[] = [
  {
    id: 'overview',
    number: '01',
    label: 'Overview',
    summary: 'Berry Alloys Limited · Heat to precision',
  },
  {
    id: 'legacy',
    number: '02',
    label: 'Legacy',
    summary: 'DKG Group roots & founding story',
  },
  {
    id: 'chronicle',
    number: '03',
    label: 'Chronicle',
    summary: '2010–2026+ smelting & export milestones',
  },
  {
    id: 'leadership',
    number: '04',
    label: 'People & Leadership',
    summary: 'Promoters, stewards & core values',
  },
  {
    id: 'alloys',
    number: '05',
    label: 'Alloys',
    summary: 'Interactive family & grade explorer',
  },
  {
    id: 'process',
    number: '06',
    label: 'Process',
    summary: 'From smelting to port dispatch',
  },
  {
    id: 'quality',
    number: '07',
    label: 'Quality',
    summary: 'ISO systems, QA deck & sample chemistry',
  },
  {
    id: 'awards',
    number: '08',
    label: 'Awards',
    summary: 'Brand, workplace, social & export honours',
  },
  {
    id: 'responsibility',
    number: '09',
    label: 'Stewardship',
    summary: 'Clean power disclosure & grassroots CSR',
  },
  {
    id: 'presence',
    number: '10',
    label: 'Presence',
    summary: 'Global globe, corridors & site directory',
  },
  {
    id: 'updates',
    number: '11',
    label: 'Updates',
    summary: '3D plant gallery & recent announcements',
  },
  {
    id: 'careers-life',
    number: '12',
    label: 'Careers & Life',
    summary: 'Workplace polaroid deck & career tracks',
  },
  {
    id: 'compendium',
    number: '13',
    label: 'Compendium',
    summary: '3D statutory filings & alloy handbooks',
  },
  {
    id: 'faq',
    number: '14',
    label: 'FAQs',
    summary: 'Prepared answers & buyer insights',
  },
  {
    id: 'enquiry',
    number: '15',
    label: 'Contact',
    summary: 'Commercial quotation & office directory',
  },
];
