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

/**
 * Confirmed overseas export markets.
 *
 * Intentionally empty: no approved country list exists yet, and the site must not imply markets that
 * are not documented. When the company approves a list, add entries here with
 * `kind: 'export-market'`, `precision: 'country'` and a representative country position — the globe,
 * legend, selector, flags and port-to-market routes pick them up without further code changes.
 * Place the matching flag at `public/flags/<countryCode>.svg`.
 */
export const CONFIRMED_EXPORT_MARKETS: PresenceLocation[] = [];

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
