import { FACILITY_NODES } from './company';

/**
 * Typed geographic data for the global-presence globe and its SVG fallback.
 *
 * The four kinds are deliberately separate so that one can never be presented as another:
 *  - facility      manufacturing works
 *  - office        corporate / head office
 *  - port          port / logistics gateway
 *  - export-market confirmed overseas business country (country-level representation only)
 *
 * Source and verification notes live in `globalPresence.sources.ts`, which the UI never imports.
 */
export type PresenceKind = 'facility' | 'office' | 'port' | 'export-market';
export type CoordinatePrecision = 'site-area' | 'city' | 'country';

export interface PresenceLocation {
  id: string;
  name: string;
  kind: PresenceKind;
  region: string;
  country: string;
  /** ISO 3166-1 alpha-2, lower case. Used for the local flag asset. */
  countryCode: string;
  lat: number;
  lng: number;
  precision: CoordinatePrecision;
  status: string;
  role: string;
  detail: string;
  /** Marker is drawn by another location when two sit too close to separate on the globe. */
  markerGroup?: string;
  /** Short, public labels naming where this location or market is published. */
  sources?: string[];
}

export interface PresenceRoute {
  id: string;
  from: string;
  to: string;
  label: string;
}

export const KIND_LABEL: Record<PresenceKind, string> = {
  facility: 'Manufacturing facility',
  office: 'Office',
  port: 'Port / logistics gateway',
  'export-market': 'Confirmed export market',
};

interface GeoSeed {
  kind: PresenceKind;
  lat: number;
  lng: number;
  precision: CoordinatePrecision;
  markerGroup?: string;
}

/** Positions are area/city level — they are not surveyed site coordinates. */
const GEO: Record<string, GeoSeed> = {
  vizianagaram: { kind: 'facility', lat: 18.57, lng: 83.36, precision: 'city' },
  'visakhapatnam-port': { kind: 'port', lat: 17.69, lng: 83.29, precision: 'city' },
  dhalbhumgarh: { kind: 'facility', lat: 22.42, lng: 86.45, precision: 'site-area' },
  ghatsila: { kind: 'facility', lat: 22.58, lng: 86.47, precision: 'site-area', markerGroup: 'dhalbhumgarh' },
  kolkata: { kind: 'office', lat: 22.55, lng: 88.36, precision: 'city' },
};

export const INDIA_LOCATIONS: PresenceLocation[] = FACILITY_NODES.filter((n) => GEO[n.id]).map((n) => {
  const g = GEO[n.id];
  return {
    id: n.id,
    name: n.name,
    kind: g.kind,
    region: n.region,
    country: 'India',
    countryCode: 'in',
    lat: g.lat,
    lng: g.lng,
    precision: g.precision,
    markerGroup: g.markerGroup,
    status: n.status,
    role: n.role,
    detail: n.detail,
  };
});

const WEBSITE = 'Berry Alloys website';
const ICRA_2026 = 'ICRA rating report, Aug 2026';
const ICRA_2025 = 'ICRA rating report, Apr 2025';
const ICRA_2023 = 'ICRA rating report, Mar 2023';
const TRADE = 'Published shipment records';

function market(
  id: string,
  name: string,
  countryCode: string,
  region: string,
  lat: number,
  lng: number,
  sources: string[],
  detail: string
): PresenceLocation {
  return {
    id,
    name,
    kind: 'export-market',
    region,
    country: name,
    countryCode,
    lat,
    lng,
    precision: 'country',
    status: 'Export market',
    role: 'Export destination named in published company and credit-rating sources.',
    detail,
    sources,
  };
}

/**
 * Confirmed overseas export markets: every country below is named in a published source (see `sources`, and the
 * internal notes in globalPresence.sources.ts). Positions are representative country positions, not premises.
 * ICRA reports the company exports to around 35 countries in total, so this list is deliberately not exhaustive:
 * only countries named in published material are shown. Add further countries here once the company approves them,
 * and place the flag at public/flags/<countryCode>.svg.
 */
export const CONFIRMED_EXPORT_MARKETS: PresenceLocation[] = [
  market('japan', 'Japan', 'jp', 'East Asia', 36.2, 138.3, [WEBSITE, ICRA_2026], 'Listed as an export destination on the Berry Alloys website, and cited by ICRA as a market behind the rise in export demand.'),
  market('south-korea', 'South Korea', 'kr', 'East Asia', 36.4, 127.9, [WEBSITE, ICRA_2026, TRADE], 'Listed on the Berry Alloys website, cited by ICRA as a key export market, and present in published shipment records.'),
  market('vietnam', 'Vietnam', 'vn', 'South-East Asia', 15.9, 107.9, [WEBSITE], 'Listed as an export destination on the Berry Alloys website.'),
  market('thailand', 'Thailand', 'th', 'South-East Asia', 15.0, 101.0, [ICRA_2025], 'Named by ICRA among the company’s export markets.'),
  market('australia', 'Australia', 'au', 'Oceania', -25.5, 134.0, [WEBSITE], 'Listed as an export destination on the Berry Alloys website.'),
  market('uae', 'United Arab Emirates', 'ae', 'West Asia', 24.2, 54.4, [WEBSITE, ICRA_2026], 'Listed on the Berry Alloys website; ICRA also cites West Asia as a growing export region.'),
  market('bangladesh', 'Bangladesh', 'bd', 'South Asia', 23.8, 90.3, [ICRA_2023], 'Named by ICRA as an export market (earlier rating report).'),
  market('sri-lanka', 'Sri Lanka', 'lk', 'South Asia', 7.8, 80.7, [ICRA_2023], 'Named by ICRA as an export market (earlier rating report).'),
  market('nigeria', 'Nigeria', 'ng', 'West Africa', 9.1, 8.7, [ICRA_2023], 'Named by ICRA as an export market (earlier rating report).'),
  market('south-africa', 'South Africa', 'za', 'Southern Africa', -29.0, 24.7, [ICRA_2023], 'Named by ICRA as an export market (earlier rating report).'),
  market('netherlands', 'Netherlands', 'nl', 'Europe', 52.2, 5.5, [WEBSITE, TRADE], 'Europe is a named export market on the Berry Alloys website and in ICRA reports; the Netherlands appears in published shipment records.'),
  market('united-states', 'United States', 'us', 'North America', 39.5, -98.4, [WEBSITE], 'Listed on the Berry Alloys website as part of its USA & Canada export markets.'),
  market('canada', 'Canada', 'ca', 'North America', 56.0, -105.5, [WEBSITE], 'Listed on the Berry Alloys website as part of its USA & Canada export markets.'),
];

/** Region-level references that cannot be pinned to a single country, so they are noted rather than plotted. */
export const EXPORT_REGION_REFERENCES = ['Europe', 'West Asia', 'Middle East', 'North America'];

/** Headline export statement, attributed to its source. */
export const EXPORT_SUMMARY = {
  approxCountries: 35,
  source: 'ICRA rating report, 13 August 2026',
  exportShare: 'about 56% of FY2026 sales',
};

export const PRESENCE_LOCATIONS: PresenceLocation[] = [...INDIA_LOCATIONS, ...CONFIRMED_EXPORT_MARKETS];

const PORT_ID = 'visakhapatnam-port';

/** Routes only join places the company documents as linked: plants dispatching through Visakhapatnam. */
export const PRESENCE_ROUTES: PresenceRoute[] = [
  { id: 'route-vizianagaram-port', from: 'vizianagaram', to: PORT_ID, label: 'Bobbili Works to Visakhapatnam Harbour Port' },
  { id: 'route-dhalbhumgarh-port', from: 'dhalbhumgarh', to: PORT_ID, label: 'Dhalbhumgarh plant to Visakhapatnam Harbour Port' },
  ...CONFIRMED_EXPORT_MARKETS.map((m) => ({
    id: `route-port-${m.id}`,
    from: PORT_ID,
    to: m.id,
    label: `Visakhapatnam Harbour Port to ${m.name} (country-level)`,
  })),
];

export function getPresenceLocation(id: string): PresenceLocation | undefined {
  return PRESENCE_LOCATIONS.find((l) => l.id === id);
}

export const HAS_EXPORT_MARKETS = CONFIRMED_EXPORT_MARKETS.length > 0;
