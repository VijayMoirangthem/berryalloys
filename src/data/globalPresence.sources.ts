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

export const EXPORT_MARKET_STATUS =
  'No overseas market list has been approved for publication. The globe shows confirmed Indian locations only. ' +
  'Add approved countries to CONFIRMED_EXPORT_MARKETS with the approval source recorded here.';
