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
    summary: 'Strength begins with precision',
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
    label: 'Leadership',
    summary: 'Promoters, core values & governance',
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
    summary: 'ISO systems, ratings & sample chemistry',
  },
  {
    id: 'responsibility',
    number: '08',
    label: 'Stewardship',
    summary: 'Clean power disclosure & grassroots CSR',
  },
  {
    id: 'presence',
    number: '09',
    label: 'Presence',
    summary: 'Plants, offices & Visakhapatnam Port',
  },
  {
    id: 'updates',
    number: '10',
    label: 'Updates',
    summary: 'Plant gallery & recent announcements',
  },
  {
    id: 'faq',
    number: '11',
    label: 'FAQs',
    summary: 'Prepared answers & guide',
  },
  {
    id: 'enquiry',
    number: '12',
    label: 'Contact',
    summary: 'Commercial quotation & office directory',
  },
];
