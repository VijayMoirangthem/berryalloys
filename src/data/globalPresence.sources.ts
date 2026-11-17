/**
 * INTERNAL — source and verification notes for `globalPresence.ts`.
 * This file is documentation only. It is deliberately not imported by any UI module,
 * so none of it is shipped in the public interface.
 */
export const PRESENCE_SOURCE_NOTES: Record<string, { source: string; verification: string; coordinates: string }> = {
  vizianagaram: {
    source: 'FACILITY_NODES (company.ts) — Bobbili Growth Centre, highlighted on the company website.',
    verification: 'Facility named on company website; expansion figures reported by the company.',
    coordinates: 'Bobbili town centre, approximate (18.57N, 83.36E). Not a surveyed site position.',
  },
  'visakhapatnam-port': {
    source: 'FACILITY_NODES / OFFICES — Visakhapatnam Harbour Port export gateway and Director Office (530003).',
    verification: 'Dispatch via Visakhapatnam Harbour Port stated on the company website.',
    coordinates: 'Visakhapatnam port area, approximate (17.69N, 83.29E).',
  },
  dhalbhumgarh: {
    source: 'FACILITY_NODES / OFFICES — Kadambeda Village, Post Dhalbhumgarh 832302, Singhbhum East.',
    verification: 'Plant address published on the company website.',
    coordinates: 'Dhalbhumgarh area, approximate (22.42N, 86.45E).',
  },
  ghatsila: {
    source: 'FACILITY_NODES — company sustainability records (24 MVA operations, planned DRI/WHR).',
    verification: 'Expansion is reported by the company, not independently verified.',
    coordinates: 'Ghatsila town, approximate (22.58N, 86.47E). About 20 km from Dhalbhumgarh, so the globe draws one shared marker.',
  },
  kolkata: {
    source: 'OFFICES — Head Office, 21A Shakespeare Sarani, Kolkata 700017.',
    verification: 'Registered Head Office per company records. Announced future office at 56 Chowringhee Road is not yet confirmed operational.',
    coordinates: 'Central Kolkata, approximate (22.55N, 88.36E).',
  },
};

/**
 * Export-market evidence (researched 17 Nov 2026). Public labels used in the UI are in globalPresence.ts.
 *
 * - Berry Alloys website, "Global Presence" on https://berryalloys.com/ferro-alloys-manufacturers-in-india/ (self-reported):
 *   Japan, South Korea, Vietnam, Australia, UAE, Europe, USA & Canada. FAQ: "Asia, Europe, the Middle East, and North America".
 * - ICRA rationale, 13 Aug 2026 (https://www.icra.in/Rating/ShowRationalReportFilePdfViewer/144916): exports ~56% of FY2026 sales
 *   "aided by strong demand from markets such as Japan, Korea, West Asia and Europe"; "exporting to around 35 countries".
 * - ICRA rationale, 2 Apr 2026 (ShowRationalReportFilePdfViewer/142202): "around 38 countries"; Japan, Korea, Middle East, Europe.
 * - ICRA rationale, 30 Dec 2025 (ShowRationalReportFilePdf/140038): "around 35 countries".
 * - ICRA rationale, Apr 2025 (ShowRationalReportFilePdf/134434 and GetRationalReportFilePdf?id=134538): "Europe, Middle East, Korea,
 *   Japan, Thailand etc." = 41% of sales in 10M FY2025.
 * - ICRA rationale, Mar 2023 (ShowRationalReportFilePdf/119148): "Bangladesh, Nigeria, South Africa, Sri Lanka, and West Asia countries".
 * - Volza shipment records (third-party aggregator, indicative only): Korea (HC ferro manganese), Netherlands (ferro silico manganese).
 *   The page was blocked (HTTP 403) for direct fetch; details come from search snippets.
 *
 * Not used: any claim of "50+ countries". It was not found in any primary source reviewed.
 * Count gap: ICRA says ~35-38 countries; only the 13 above are named publicly. The remainder needs the company's own approved list.
 * Positions are representative country positions, not premises. Flags: flag-icons (MIT) copied to public/flags.
 */
export const EXPORT_MARKET_NOTE =
  'Only countries named in published material are shown. Ask the company for its approved full destination list to complete the globe.';
