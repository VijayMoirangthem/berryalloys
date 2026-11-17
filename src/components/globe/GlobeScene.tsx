import { useEffect, useMemo, useRef } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ThreeGlobe from 'three-globe';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import worldTopo from 'world-atlas/countries-110m.json';
import type { PresenceLocation, PresenceRoute } from '../../data/globalPresence';
import { KIND_LABEL } from '../../data/globalPresence';
import { FlagIcon } from './FlagIcon';
import { cn } from '../../lib/utils';

/**
 * GlobeScene — adapted from the Aceternity "globe" component (three-globe core: hex-polygon land, arcs, rings).
 *
 * Differences from the reference implementation, all deliberate:
 *  - plain Three.js + OrbitControls instead of @react-three/fiber / drei (no extra renderer, one Three.js copy)
 *  - loaded through React.lazy by the parent instead of next/dynamic
 *  - countries come from the `world-atlas` 110m TopoJSON package
 *  - deterministic arc colours, supported company data only (no sample arcs, no Math.random)
 *  - HTML markers projected every frame: they rotate with the globe, hide behind it and stay aligned on resize
 */

type Theme = 'light' | 'dark';

interface ThemePalette {
  ocean: string;
  emissive: string;
  land: string;
  india: string;
  atmosphere: string;
  arcA: string;
  arcB: string;
  active: string;
  ring: string;
  ambientLight: string;
}

const PALETTE: Record<Theme, ThemePalette> = {
  light: {
    ocean: '#0F5C94',
    emissive: '#08416C',
    land: 'rgba(205,229,248,1)',
    india: 'rgba(255,255,255,1)',
    atmosphere: '#2E8FD0',
    arcA: '#8FD8FF',
    arcB: '#4FB0F0',
    active: '#FF5C73',
    ring: '255,255,255',
    ambientLight: '#E4F1FB',
  },
  dark: {
    ocean: '#0A2748',
    emissive: '#07203B',
    land: 'rgba(104,170,222,0.92)',
    india: 'rgba(214,242,255,1)',
    atmosphere: '#69C5F5',
    arcA: '#69C5F5',
    arcB: '#9AD9FA',
    active: '#FF8091',
    ring: '105,197,245',
    ambientLight: '#7FBDE8',
  },
};

type CountryFeature = {
  id?: string | number;
  geometry: { type: 'Polygon'; coordinates: number[][][] } | { type: 'MultiPolygon'; coordinates: number[][][][] };
};

const rawCountries = feature(
  worldTopo as unknown as Topology,
  (worldTopo as unknown as { objects: { countries: Topology['objects'][string] } }).objects.countries
) as unknown as { features: CountryFeature[] };

/**
 * The 110m dataset contains a degenerate 4-point sliver inside North Korea's MultiPolygon that makes the
 * H3 hex fill throw ("operation failed, code 1") and abort the whole land layer. Drop polygons that have no area.
 */
const countries = {
  features: rawCountries.features.flatMap((f) => {
    const g = f.geometry;
    if (g.type === 'Polygon') return g.coordinates[0].length > 4 ? [f] : [];
    const polys = g.coordinates.filter((p) => p[0].length > 4);
    return polys.length ? [{ ...f, geometry: { type: 'MultiPolygon' as const, coordinates: polys } }] : [];
  }),
};

const INDIA_ID = '356';
const GLOBE_RADIUS = 100;
const INITIAL_VIEW = { lat: 21, lng: 82 };

export interface FocusRequest {
  id: string;
  nonce: number;
}

export interface GlobeSceneProps {
  locations: PresenceLocation[];
  routes: PresenceRoute[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  /** Visitor started dragging the globe — the parent treats this as inspection and pauses rotation. */
  onInteract: () => void;
  theme: Theme;
  autoRotate: boolean;
  /** Ambient decorative motion (route flow, pulses). */
  ambient: boolean;
  reducedMotion: boolean;
  focusRequest: FocusRequest | null;
  onReady: () => void;
  onError: (reason: string) => void;
}

interface SceneApi {
  applyTheme: () => void;
  applyData: () => void;
  focus: (lat: number, lng: number) => void;
}

function markerOwner(loc: PresenceLocation) {
  return loc.markerGroup ?? loc.id;
}

export default function GlobeScene(props: GlobeSceneProps) {
  const { locations, routes, selectedId, hoveredId, onSelect, onHover } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef(new Map<string, HTMLButtonElement>());
  const apiRef = useRef<SceneApi | null>(null);
  const live = useRef(props);
  live.current = props;

  // One drawn marker per marker group.
  const markers = useMemo(() => locations.filter((l) => !l.markerGroup), [locations]);
  const groupSelected = (m: PresenceLocation) => {
    const sel = locations.find((l) => l.id === selectedId);
    return sel ? markerOwner(sel) === m.id : false;
  };
  const groupHovered = (m: PresenceLocation) => {
    const h = locations.find((l) => l.id === hoveredId);
    return h ? markerOwner(h) === m.id : false;
  };

  useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    if (!root || !host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      live.current.onError('webgl-unavailable');
      return;
    }
    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const softwareGl = /(swiftshader|llvmpipe|software|softpipe)/i.test(dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, softwareGl ? 1 : 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    host.appendChild(canvas);

    const scene = new Scene();
    const camera = new PerspectiveCamera(36, 1, 50, 2000);
    const ambientLight = new AmbientLight(PALETTE[live.current.theme].ambientLight, 1.35);
    const leftLight = new DirectionalLight('#ffffff', 1.1);
    leftLight.position.set(-400, 100, 400);
    const topLight = new DirectionalLight('#ffffff', 0.8);
    topLight.position.set(-200, 500, 200);
    const point = new PointLight('#ffffff', 0.7);
    point.position.set(-200, 500, 200);
    scene.add(ambientLight, leftLight, topLight, point);

    const globe = new ThreeGlobe({ animateIn: !live.current.reducedMotion });
    scene.add(globe);

    let camDistance = 320;
    const fitCamera = (w: number, h: number) => {
      // Fit the globe (plus atmosphere) inside the smaller dimension.
      const fov = (camera.fov * Math.PI) / 180;
      const fitH = (GLOBE_RADIUS * 1.22) / Math.tan(fov / 2);
      const fitW = (GLOBE_RADIUS * 1.22) / (Math.tan(fov / 2) * Math.max(0.2, w / h));
      camDistance = Math.max(fitH, fitW);
    };

    const dirFor = (lat: number, lng: number) => {
      const c = globe.getCoords(lat, lng, 0);
      return new Vector3(c.x, c.y, c.z).normalize();
    };

    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    controls.autoRotateSpeed = 0.55;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.8;
    // OrbitControls forces touch-action:none; restore vertical page scrolling on touch screens.
    canvas.style.touchAction = 'pan-y';

    const setCameraDir = (dir: Vector3) => {
      camera.position.copy(dir).multiplyScalar(camDistance);
      camera.lookAt(0, 0, 0);
      controls.update();
    };

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w < 2 || h < 2) return; // never initialise against a zero-sized container
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const dir = camera.position.lengthSq() > 0 ? camera.position.clone().normalize() : dirFor(INITIAL_VIEW.lat, INITIAL_VIEW.lng);
      fitCamera(w, h);
      setCameraDir(dir);
    };

    // ----- globe styling & data -----
    const ownerPoints = () =>
      live.current.locations.filter((l) => !l.markerGroup).map((l) => ({ lat: l.lat, lng: l.lng }));

    const pal = () => PALETTE[live.current.theme];

    const applyTheme = () => {
      const p = pal();
      const mat = globe.globeMaterial() as unknown as { color: Color; emissive: Color; emissiveIntensity: number; shininess: number };
      mat.color = new Color(p.ocean);
      mat.emissive = new Color(p.emissive);
      mat.emissiveIntensity = 0.28;
      mat.shininess = 0.7;
      ambientLight.color = new Color(p.ambientLight);
      globe
        .showAtmosphere(true)
        .atmosphereColor(p.atmosphere)
        .atmosphereAltitude(0.16)
        .hexPolygonColor((d: object) => ((d as { id?: string | number }).id?.toString() === INDIA_ID ? p.india : p.land));
      applyData();
    };

    const sel = () => live.current.locations.find((l) => l.id === live.current.selectedId);

    function applyData() {
      const p = pal();
      const { routes: rts, ambient, reducedMotion } = live.current;
      const selected = sel();
      const owner = selected ? markerOwner(selected) : null;
      const byId = new Map(live.current.locations.map((l) => [l.id, l]));
      const arcs = rts
        .map((r) => {
          const a = byId.get(r.from);
          const b = byId.get(r.to);
          if (!a || !b) return null;
          const active = owner !== null && (markerOwner(a) === owner || markerOwner(b) === owner);
          return { id: r.id, startLat: a.lat, startLng: a.lng, endLat: b.lat, endLng: b.lng, active };
        })
        .filter(Boolean) as Array<{ id: string; startLat: number; startLng: number; endLat: number; endLng: number; active: boolean }>;

      const flowing = ambient && !reducedMotion;
      globe
        .arcsData(arcs)
        .arcStartLat('startLat')
        .arcStartLng('startLng')
        .arcEndLat('endLat')
        .arcEndLng('endLng')
        .arcColor((d: object) => ((d as { active: boolean }).active ? [p.active, p.active] : [p.arcA, p.arcB]))
        .arcAltitude((d: object) => ((d as { active: boolean }).active ? 0.1 : 0.07))
        .arcStroke((d: object) => ((d as { active: boolean }).active ? 0.7 : 0.45))
        .arcDashLength(flowing ? 0.45 : 1)
        .arcDashGap(flowing ? 1.2 : 0)
        .arcDashInitialGap(() => 0)
        .arcDashAnimateTime(flowing ? 2800 : 0);

      globe
        .pointsData(ownerPoints().map((pt) => ({ ...pt })))
        .pointColor(() => p.arcA)
        .pointAltitude(0.004)
        .pointRadius(0.35)
        .pointsMerge(true);

      globe
        .ringsData(flowing ? ownerPoints() : [])
        .ringColor(() => (t: number) => `rgba(${p.ring},${(1 - t) * 0.85})`)
        .ringMaxRadius(3.2)
        .ringPropagationSpeed(1.6)
        .ringRepeatPeriod(1900);
    }

    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.5)
      .hexPolygonAltitude(0.004);

    applyTheme();

    // ----- camera tween toward a location -----
    const tween = { active: false, t0: 0, dur: 900, from: new Vector3(), q: new Quaternion() };
    const focus = (lat: number, lng: number) => {
      const target = dirFor(lat, lng);
      const from = camera.position.clone().normalize();
      if (live.current.reducedMotion) {
        tween.active = false;
        setCameraDir(target);
        return;
      }
      tween.from.copy(from);
      tween.q.setFromUnitVectors(from, target);
      tween.t0 = performance.now();
      tween.dur = 900;
      tween.active = true;
    };
    const qStep = new Quaternion();
    const identity = new Quaternion();
    const stepTween = (now: number) => {
      if (!tween.active) return;
      const t = Math.min(1, (now - tween.t0) / tween.dur);
      const e = 1 - Math.pow(1 - t, 3);
      qStep.copy(identity).slerp(tween.q, e);
      setCameraDir(tween.from.clone().applyQuaternion(qStep));
      if (t >= 1) tween.active = false;
    };

    apiRef.current = { applyTheme, applyData, focus };

    // ----- markers: project every frame, hide behind the globe -----
    const v = new Vector3();
    const view = new Vector3();
    const positions = new Map<string, Vector3>();
    const updateMarkers = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      view.copy(camera.position).normalize();
      for (const loc of live.current.locations) {
        if (loc.markerGroup) continue;
        const el = markerRefs.current.get(loc.id);
        if (!el) continue;
        let p = positions.get(loc.id);
        if (!p) {
          const c = globe.getCoords(loc.lat, loc.lng, 0.012);
          p = new Vector3(c.x, c.y, c.z);
          positions.set(loc.id, p);
        }
        const facing = p.clone().normalize().dot(view);
        if (facing < 0.1) {
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
          continue;
        }
        v.copy(p).project(camera);
        const x = (v.x * 0.5 + 0.5) * w;
        const y = (-v.y * 0.5 + 0.5) * h;
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
        el.style.opacity = String(Math.min(1, (facing - 0.1) * 5));
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    // ----- loop: only while on screen and the tab is visible -----
    let raf = 0;
    let visible = true;
    let disposed = false;
    let readyFired = false;
    let firstRender = true;
    const frame = (now: number) => {
      if (disposed) return;
      raf = window.requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const { autoRotate } = live.current;
      stepTween(now);
      controls.autoRotate = autoRotate && !tween.active && !live.current.reducedMotion;
      controls.update();
      renderer.render(scene, camera);
      updateMarkers();
      if (firstRender) {
        firstRender = false;
        if (!readyFired) {
          readyFired = true;
          live.current.onReady();
        }
      }
    };

    const onStart = () => {
      tween.active = false;
      live.current.onInteract();
    };
    controls.addEventListener('start', onStart);

    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1]?.isIntersecting ?? true;
    });
    io.observe(root);
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onLost = (e: Event) => {
      e.preventDefault();
      live.current.onError('context-lost');
    };
    canvas.addEventListener('webglcontextlost', onLost);

    resize();
    setCameraDir(dirFor(INITIAL_VIEW.lat, INITIAL_VIEW.lng));
    const selectedAtStart = sel();
    if (selectedAtStart) focus(selectedAtStart.lat, selectedAtStart.lng);
    raf = window.requestAnimationFrame(frame);

    return () => {
      disposed = true;
      apiRef.current = null;
      window.cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      controls.removeEventListener('start', onStart);
      controls.dispose();
      canvas.removeEventListener('webglcontextlost', onLost);
      globe.arcsData([]).ringsData([]).pointsData([]).hexPolygonsData([]);
      scene.traverse((obj) => {
        const mesh = obj as unknown as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | Array<{ dispose: () => void }> };
        mesh.geometry?.dispose?.();
        if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
        else mesh.material?.dispose?.();
      });
      renderer.dispose();
      if (canvas.parentNode === host) host.removeChild(canvas);
    };
    // The scene is created once; later prop changes flow through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apiRef.current?.applyTheme();
  }, [props.theme]);

  useEffect(() => {
    apiRef.current?.applyData();
  }, [props.selectedId, props.ambient, props.reducedMotion, routes, locations]);

  useEffect(() => {
    const req = props.focusRequest;
    if (!req) return;
    const loc = locations.find((l) => l.id === req.id);
    if (loc) apiRef.current?.focus(loc.lat, loc.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focusRequest]);

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div ref={hostRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      {markers.map((m) => {
        const isSel = groupSelected(m);
        const isHot = isSel || groupHovered(m);
        const label = locations.find((l) => l.id === selectedId && markerOwner(l) === m.id) ?? m;
        return (
          <button
            key={m.id}
            type="button"
            ref={(el) => {
              if (el) markerRefs.current.set(m.id, el);
              else markerRefs.current.delete(m.id);
            }}
            onClick={() => onSelect(label.id)}
            onPointerEnter={() => onHover(m.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(m.id)}
            onBlur={() => onHover(null)}
            aria-label={`${label.name} — ${KIND_LABEL[label.kind]}${isSel ? ' (selected)' : ''}`}
            aria-pressed={isSel}
            className="absolute left-0 top-0 z-10 flex h-9 w-9 items-center justify-center focus-visible:outline-none cursor-pointer"
            style={{ visibility: 'hidden' }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'block rounded-full border-2 transition-all duration-200',
                m.kind === 'port' ? 'h-3 w-3' : 'h-2.5 w-2.5',
                isSel
                  ? 'scale-150 border-white bg-accent-red shadow-[0_0_0_4px_rgba(255,92,115,0.35)]'
                  : isHot
                    ? 'scale-125 border-white bg-brand shadow-[0_0_0_4px_rgba(105,197,245,0.35)]'
                    : 'border-white/90 bg-brand'
              )}
            />
            <span
              className={cn(
                'pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap border border-subtle bg-card px-2 py-1 text-[11px] font-semibold text-ink shadow-md transition-opacity duration-150',
                isHot ? 'opacity-100' : 'opacity-0'
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <FlagIcon code={label.countryCode} className="h-3 w-4" />
                {label.name.split(' / ')[0]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
