/**
 * Logo manifest. Every file below was downloaded from Berry Alloys' own website (https://berryalloys.com/) and matched by
 * eye to the company name before use. Nothing was substituted or redrawn.
 *
 * Categories are kept strictly apart:
 *  - client         steel producers featured on the Berry Alloys website. Featured is not endorsed.
 *  - rating         a credit-rating agency badge. A rating is not a customer relationship.
 *  - membership / sponsorship / certification are reserved: a sponsor logo is NOT a customer endorsement, and a
 *    certification mark does not prove every product shares the same certification scope. None of these are shown as clients.
 */
export type LogoCategory = 'client' | 'membership' | 'sponsorship' | 'certification' | 'rating';
export type LogoApproval = 'sourced-from-company-website' | 'approved-by-client';

export interface LogoEntry {
  id: string;
  name: string;
  assetPath: string;
  width: number;
  height: number;
  alt: string;
  category: LogoCategory;
  source: string;
  sourceUrl: string;
  approval: LogoApproval;
  /** Only set when the logo legitimately links somewhere (clients do not). */
  destination?: string;
}

const SITE = 'https://berryalloys.com/';
const client = (id: string, name: string, file: string, upload: string): LogoEntry => ({
  id,
  name,
  assetPath: `/logos/${file}`,
  width: 300,
  height: 80,
  alt: `${name} logo`,
  category: 'client',
  source: 'Client logo carousel on the Berry Alloys homepage',
  sourceUrl: `${SITE}wp-content/uploads/${upload}`,
  approval: 'sourced-from-company-website',
});

/** Order follows the reference strip. Vizag Steel appears once. */
export const CLIENT_LOGOS: LogoEntry[] = [
  client('vizag-steel', 'Vizag Steel (Rashtriya Ispat Nigam Limited)', 'vizag-steel.png', '2025/04/img-2-2-removebg-preview.png'),
  client('sail', 'SAIL (Steel Authority of India Limited)', 'sail.png', '2025/04/img-1-1-removebg-preview.png'),
  client('posco', 'POSCO', 'posco.png', '2025/05/posco.png'),
  client('stanco', 'STANCO', 'stanco.png', '2025/05/stanco.png'),
  client('jindal-steel-power', 'Jindal Steel & Power', 'jindal-steel-power.png', '2025/04/img-5-removebg-preview.png'),
  client('tata-steel', 'Tata Steel', 'tata-steel.png', '2025/04/img-4-removebg-preview.png'),
  client('jsw-steel', 'JSW Steel', 'jsw-steel.png', '2025/04/img-3-1-removebg-preview.png'),
];

export const RATING_LOGOS: LogoEntry[] = [
  {
    id: 'icra-rating', name: 'ICRA', assetPath: '/logos/icra.png', width: 350, height: 210, alt: 'ICRA credit rating badge',
    category: 'rating', source: 'ICRA badge on the Berry Alloys homepage', sourceUrl: `${SITE}wp-content/uploads/2026/02/ICRA.png`, approval: 'sourced-from-company-website',
  },
];

/**
 * Assets still unavailable (none of these are fabricated or substituted).
 * - Vector / high-resolution originals of every client logo (the website serves 300x80 PNGs).
 * - Industry-membership logos (IMnI, IFAPA) and any sponsorship logos: not collected in this iteration.
 * - Written approval from each featured company for use in international marketing material.
 */
export const MISSING_LOGO_ASSETS = [
  'High-resolution or vector originals of all seven client logos',
  'IMnI and IFAPA membership marks',
  'Written permission from each featured company for use in international marketing',
];
