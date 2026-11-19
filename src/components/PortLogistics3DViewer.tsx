import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Anchor,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Play,
  RotateCcw,
  Ship,
  Truck,
} from 'lucide-react';
import { cn } from '../lib/utils';

type LogisticsPhase = 'auto' | 'load' | 'drive' | 'unload' | 'crane';
type CameraPreset = 'overview' | 'truck' | 'crane' | 'ship';

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number]; label: string }
> = {
  overview: { pos: [14.0, 9.2, 16.8], target: [0.8, 2.2, 0.4], label: 'Overview' },
  truck: { pos: [-2.4, 4.9, 9.8], target: [0.6, 2.1, 1.4], label: 'Tipper Truck' },
  crane: { pos: [2.6, 8.4, 11.8], target: [1.6, 3.6, 0.6], label: 'Port Crane' },
  ship: { pos: [13.2, 6.2, 10.8], target: [6.2, 2.2, -1.2], label: 'Bulk Ship' },
};

const PHASE_META: Record<
  LogisticsPhase,
  { label: string; caption: string }
> = {
  auto: {
    label: 'Auto Cycle',
    caption: 'Continuous automated sequence: Silo Fill → Quay Haulage → Rear Hydraulic Tip → Gantry Crane to Ship Hold',
  },
  load: {
    label: 'Load Truck',
    caption: 'Overhead smelter silo chute discharges assayed Ferro-Manganese lumps into the 35-MT tipper bed.',
  },
  drive: {
    label: 'Drive To Berth',
    caption: 'Loaded tipper truck backs neatly to the dockside hopper facing Visakhapatnam Harbour Berth.',
  },
  unload: {
    label: 'Unload & Tip',
    caption: 'Front hydraulic piston lifts the dump bed skyward to 42°, opening the rear tailgate directly into the hopper.',
  },
  crane: {
    label: 'Crane To Ship',
    caption: 'Rail-mounted port gantry crane hoists 1-MT FIBC bulk alloy bags directly into M.V. Berry Export.',
  },
};

// Reusable module-scope math helpers (zero GC inside animation loop)
const _vPos = new THREE.Vector3();
const _vTarget = new THREE.Vector3();
const _spherical = new THREE.Spherical();
const _dummy = new THREE.Object3D();

function makeQuayStripeTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#253140';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.fillStyle = '#EAB308';
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillStyle = '#18212C';
  for (let x = -32; x < 544; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 20, 0);
    ctx.lineTo(x + 6, 18);
    ctx.lineTo(x - 14, 18);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(244,248,252,0.52)';
  for (let x = 20; x < 512; x += 64) {
    ctx.fillRect(x, 260, 34, 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function makeHullLabelTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0D2238';
  ctx.fillRect(0, 0, 1024, 170);
  ctx.fillStyle = '#A61C31';
  ctx.fillRect(0, 170, 1024, 86);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 165, 1024, 6);

  ctx.fillStyle = '#F4F8FC';
  ctx.font = '700 54px "Barlow Condensed", sans-serif';
  ctx.fillText('M.V. BERRY EXPORT', 80, 104);
  ctx.fillStyle = '#69C5F5';
  ctx.font = '600 24px "IBM Plex Mono", monospace';
  ctx.fillText('VISAKHAPATNAM PORT · FERRO ALLOYS BULK CARRIER', 82, 140);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function makeTruckBannerTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#006393';
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#C9233B';
  ctx.fillRect(0, 198, 512, 20);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 56px "Barlow Condensed", sans-serif';
  ctx.fillText('BERRY ALLOYS', 38, 110);
  ctx.fillStyle = '#CFEAF8';
  ctx.font = '600 24px "IBM Plex Mono", monospace';
  ctx.fillText('35 MT FERRO-MANGANESE TIPPER', 40, 158);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * PortLogistics3DViewer — Interactive 3D Three.js Visakhapatnam Port & Smelter Dispatch Simulator.
 *
 * Mechanical Alignment (Verified):
 * - Cab faces inland (-X) so the rear hydraulic dump chute (+X) backs directly over the dockside
 *   intake hopper (x = +3.55), just like real harbour bulk-unloading operations.
 * - dumpBedPivot sits at rear hinge (+2.42, 0.92, 0). Rotating around +Z by -bedAngle raises the
 *   front of the bed (at x = -3.06 behind the cab) cleanly SKYWARD while the rear tailgate at +X
 *   swings outward (+tailgateAngle) and discharges alloy lumps straight down into the hopper.
 */
export function PortLogistics3DViewer({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<LogisticsPhase>('auto');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [manualBedTilt, setManualBedTilt] = useState(0); // 0..1
  const [manualCranePos, setManualCranePos] = useState(0.15); // 0..1
  const [manualOverride, setManualOverride] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [telemetry, setTelemetry] = useState({
    stageLabel: 'Auto Sequence Active',
    cargoTonnes: 24,
    shipHoldPct: 48,
  });

  const stateRef = useRef({
    phase: 'auto' as LogisticsPhase,
    manualOverride: false,
    manualBedTilt: 0,
    manualCranePos: 0.15,
    cameraTargetPreset: 'overview' as CameraPreset | null,
  });

  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    stateRef.current.phase = phase;
  }, [phase]);

  useEffect(() => {
    stateRef.current.manualOverride = manualOverride;
    stateRef.current.manualBedTilt = manualBedTilt;
    stateRef.current.manualCranePos = manualCranePos;
  }, [manualOverride, manualBedTilt, manualCranePos]);

  const selectPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    stateRef.current.cameraTargetPreset = preset;
  };

  const selectPhase = (nextPhase: LogisticsPhase) => {
    setManualOverride(false);
    setPhase(nextPhase);
    if (nextPhase === 'load' || nextPhase === 'unload') {
      selectPreset('truck');
    } else if (nextPhase === 'crane') {
      selectPreset('crane');
    } else if (nextPhase === 'auto') {
      selectPreset('overview');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const STEP = Math.PI / 14;
    let dTheta = 0;
    let dPhi = 0;
    if (e.key === 'ArrowLeft') dTheta = -STEP;
    else if (e.key === 'ArrowRight') dTheta = STEP;
    else if (e.key === 'ArrowUp') dPhi = -STEP;
    else if (e.key === 'ArrowDown') dPhi = STEP;
    else return;

    e.preventDefault();
    stateRef.current.cameraTargetPreset = null;
    _vPos.copy(controls.object.position).sub(controls.target);
    _spherical.setFromVector3(_vPos);
    _spherical.theta += dTheta;
    _spherical.phi = THREE.MathUtils.clamp(_spherical.phi + dPhi, 0.25, Math.PI / 2.15);
    _vPos.setFromSpherical(_spherical);
    controls.object.position.copy(controls.target).add(_vPos);
    controls.update();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initW = Math.max(320, container.clientWidth);
    const initH = Math.max(420, container.clientHeight);
    renderer.setSize(initW, initH);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0B1B2E');
    scene.fog = new THREE.FogExp2('#0B1B2E', 0.015);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(42, initW / initH, 0.2, 160);
    camera.position.set(...CAMERA_PRESETS.overview.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2.08;
    controls.minPolarAngle = 0.2;
    controls.minDistance = 6.5;
    controls.maxDistance = 34;
    controls.addEventListener('start', () => {
      stateRef.current.cameraTargetPreset = null;
    });
    controlsRef.current = controls;

    // 3-Point Warm/Cool Lighting Rig
    const hemi = new THREE.HemisphereLight('#8FD3FA', '#162436', 0.88);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight('#FFF3DC', 2.45);
    sun.position.set(16, 22, 14);
    sun.castShadow = !isSoftwareGl;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 60;
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight('#69C5F5', 0.92);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    // Shared PBR Materials
    const quayTex = makeQuayStripeTexture(maxAniso);
    const hullTex = makeHullLabelTexture(maxAniso);
    const truckBannerTex = makeTruckBannerTexture(maxAniso);

    const matQuay = new THREE.MeshStandardMaterial({
      map: quayTex,
      roughness: 0.84,
      metalness: 0.08,
    });
    const matSteelDark = new THREE.MeshStandardMaterial({
      color: '#1A2D42',
      roughness: 0.38,
      metalness: 0.78,
    });
    const matBrandBlue = new THREE.MeshStandardMaterial({
      color: '#006393',
      roughness: 0.28,
      metalness: 0.45,
    });
    const matCrimson = new THREE.MeshStandardMaterial({
      color: '#C9233B',
      roughness: 0.34,
      metalness: 0.35,
    });
    const matChrome = new THREE.MeshPhysicalMaterial({
      color: '#E2EBF2',
      roughness: 0.14,
      metalness: 0.94,
      clearcoat: 0.6,
    });
    const matTire = new THREE.MeshStandardMaterial({
      color: '#141920',
      roughness: 0.92,
      metalness: 0.05,
    });
    const matAlloyLump = new THREE.MeshStandardMaterial({
      color: '#8898AA',
      roughness: 0.26,
      metalness: 0.88,
    });
    const matGlass = new THREE.MeshPhysicalMaterial({
      color: '#193954',
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.76,
    });
    const matAmber = new THREE.MeshStandardMaterial({
      color: '#F59E0B',
      emissive: '#F59E0B',
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });
    const matHeadlight = new THREE.MeshStandardMaterial({
      color: '#FEF3C7',
      emissive: '#FDE68A',
      emissiveIntensity: 1.4,
      roughness: 0.1,
    });
    const matJumboBag = new THREE.MeshStandardMaterial({
      color: '#EEF4F8',
      roughness: 0.72,
      metalness: 0.04,
    });

    // ─── 1. HARBOUR ENVIRONMENT: Concrete Quay Deck & Animated Ocean Water ───
    const quayDeck = new THREE.Mesh(new THREE.BoxGeometry(26, 2.2, 13), matQuay);
    quayDeck.position.set(-5.5, -1.1, 2.2);
    quayDeck.receiveShadow = true;
    scene.add(quayDeck);

    // Rubber port fenders along dock wall (x = 7.5 facing ocean)
    for (let z = -3.2; z <= 7.2; z += 2.6) {
      const fender = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 1.4, 12),
        matTire
      );
      fender.position.set(7.55, -0.5, z);
      scene.add(fender);

      const bollard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.18, 0.45, 12),
        matAmber
      );
      bollard.position.set(6.95, 0.22, z);
      bollard.castShadow = true;
      scene.add(bollard);
    }

    // Animated Ocean Plane (Bay of Bengal)
    const waterGeo = new THREE.PlaneGeometry(110, 110, 48, 48);
    waterGeo.rotateX(-Math.PI / 2);
    const matWater = new THREE.MeshStandardMaterial({
      color: '#083354',
      roughness: 0.22,
      metalness: 0.62,
    });
    const waterMesh = new THREE.Mesh(waterGeo, matWater);
    waterMesh.position.set(16, -0.85, -4);
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);
    const waterPosAttr = waterGeo.attributes.position as THREE.BufferAttribute;
    const waterBaseY = new Float32Array(waterPosAttr.count);
    for (let i = 0; i < waterPosAttr.count; i++) {
      waterBaseY[i] = waterPosAttr.getY(i);
    }

    // Crane Steel Rails embedded on quay
    for (const rx of [-0.8, 5.8]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 12.2), matChrome);
      rail.position.set(rx, 0.04, 2.0);
      scene.add(rail);
    }

    // ─── 2. SMELTER OVERHEAD LOADING SILO HOPPER (Left Quay x = -8.8) ───
    const siloGroup = new THREE.Group();
    siloGroup.position.set(-8.8, 0, 1.4);
    scene.add(siloGroup);

    for (const sx of [-1.55, 1.55]) {
      for (const sz of [-1.55, 1.55]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 5.6, 0.24), matSteelDark);
        leg.position.set(sx, 2.8, sz);
        leg.castShadow = true;
        siloGroup.add(leg);
      }
    }
    const siloBody = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.55, 2.6, 20),
      matBrandBlue
    );
    siloBody.position.set(0, 6.2, 0);
    siloBody.castShadow = true;
    siloGroup.add(siloBody);

    const siloFunnel = new THREE.Mesh(
      new THREE.ConeGeometry(1.55, 1.8, 20),
      matSteelDark
    );
    siloFunnel.rotation.x = Math.PI;
    siloFunnel.position.set(0, 4.0, 0);
    siloFunnel.castShadow = true;
    siloGroup.add(siloFunnel);

    // Dockside Unloading Intake Hopper (x = +3.55, z = 1.4 — right beneath crane pick-up)
    const dockHopper = new THREE.Group();
    dockHopper.position.set(3.55, 0, 1.4);
    scene.add(dockHopper);
    const hopperWalls = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 0.88, 1.2, 4),
      matSteelDark
    );
    hopperWalls.rotation.y = Math.PI / 4;
    hopperWalls.position.y = 0.6;
    hopperWalls.castShadow = true;
    dockHopper.add(hopperWalls);
    const hopperRim = new THREE.Mesh(
      new THREE.BoxGeometry(2.15, 0.14, 2.15),
      matAmber
    );
    hopperRim.position.y = 1.22;
    dockHopper.add(hopperRim);
    const hopperAlloyPile = new THREE.Mesh(
      new THREE.ConeGeometry(1.0, 0.68, 9),
      matAlloyLump
    );
    hopperAlloyPile.position.y = 0.85;
    dockHopper.add(hopperAlloyPile);

    // ─── 3. COMPOSITE 12-PART HEAVY INDUSTRIAL TIPPER TRUCK ───
    // Cab sits at -X (facing inland) and Rear Dump Tailgate sits at +X (backing cleanly up to Dock Hopper)
    const TRUCK_LOAD_X = -9.65;
    const TRUCK_UNLOAD_X = 0.25;
    const truckGroup = new THREE.Group();
    truckGroup.position.set(TRUCK_LOAD_X, 0, 1.4);
    scene.add(truckGroup);

    // Chassis Frame
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.32, 1.65), matSteelDark);
    chassis.position.set(0.2, 0.72, 0);
    chassis.castShadow = true;
    truckGroup.add(chassis);

    // Fuel Tank
    const fuelTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 1.1, 14),
      matChrome
    );
    fuelTank.rotation.z = Math.PI / 2;
    fuelTank.position.set(-0.35, 0.62, 0.84);
    truckGroup.add(fuelTank);

    // Cab Lower + Hood on -X side (facing inland away from quay wall)
    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.52, 1.88), matBrandBlue);
    cabBody.position.set(-1.65, 1.62, 0);
    cabBody.castShadow = true;
    truckGroup.add(cabBody);

    const cabNose = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.92, 1.78), matBrandBlue);
    cabNose.position.set(-2.68, 1.32, 0);
    cabNose.castShadow = true;
    truckGroup.add(cabNose);

    // Front Radiator Grille & Chrome Bumper on -X nose
    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.62, 1.32), matSteelDark);
    grille.position.set(-3.02, 1.32, 0);
    truckGroup.add(grille);

    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 1.98), matChrome);
    bumper.position.set(-3.04, 0.72, 0);
    truckGroup.add(bumper);

    // Headlights on -X nose
    for (const hz of [-0.66, 0.66]) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.26), matHeadlight);
      lamp.position.set(-3.02, 1.02, hz);
      truckGroup.add(lamp);
    }

    // Cab Windshield facing -X
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.62, 1.64), matGlass);
    windshield.position.set(-2.44, 1.94, 0);
    windshield.rotation.z = 0.14;
    truckGroup.add(windshield);

    // Roof Safety Beacon & Dual Chrome Exhaust Stacks behind cab
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 12), matAmber);
    beacon.position.set(-1.65, 2.48, 0);
    truckGroup.add(beacon);

    for (const ez of [-0.88, 0.88]) {
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.55, 10), matChrome);
      stack.position.set(-0.76, 1.88, ez);
      truckGroup.add(stack);
    }

    // 6 Multi-Part Rotating Wheels (Rubber Tire + Chrome Rim + Crimson Lug Bar)
    const wheelMeshes: THREE.Group[] = [];
    const wheelXPositions = [-1.95, 0.82, 1.95];
    for (const wx of wheelXPositions) {
      for (const wz of [-0.94, 0.94]) {
        const wheelGrp = new THREE.Group();
        wheelGrp.position.set(wx, 0.48, wz);
        const tire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.48, 0.48, 0.34, 18),
          matTire
        );
        tire.rotation.x = Math.PI / 2;
        tire.castShadow = true;
        wheelGrp.add(tire);
        const rim = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.25, 0.36, 12),
          matChrome
        );
        rim.rotation.x = Math.PI / 2;
        wheelGrp.add(rim);
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.07, 0.38), matCrimson);
        wheelGrp.add(spoke);
        truckGroup.add(wheelGrp);
        wheelMeshes.push(wheelGrp);
      }
    }

    // Articulated Hydraulic Dump Bed — pivots cleanly at REAR HINGE (+2.42, 0.92, 0)
    const dumpBedPivot = new THREE.Group();
    dumpBedPivot.position.set(2.42, 0.92, 0);
    truckGroup.add(dumpBedPivot);

    // Rear hinge trunnion pin visual
    const hingePin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 2.04, 12),
      matChrome
    );
    hingePin.rotation.x = Math.PI / 2;
    dumpBedPivot.add(hingePin);

    const matBedSide = new THREE.MeshStandardMaterial({
      map: truckBannerTex,
      roughness: 0.35,
      metalness: 0.42,
    });
    const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.16, 1.94), matSteelDark);
    bedFloor.position.set(-1.55, 0.08, 0);
    bedFloor.castShadow = true;
    dumpBedPivot.add(bedFloor);

    // Side walls with Berry Alloys livery
    for (const bz of [-0.92, 0.92]) {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(3.15, 1.05, 0.12), matBedSide);
      sideWall.position.set(-1.55, 0.62, bz);
      sideWall.castShadow = true;
      dumpBedPivot.add(sideWall);
    }
    // Front bulkhead wall (behind cab at x = -3.06 relative to hinge)
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.18, 1.94), matSteelDark);
    frontWall.position.set(-3.06, 0.68, 0);
    frontWall.castShadow = true;
    dumpBedPivot.add(frontWall);

    // Hinged Rear Tailgate (at x = 0 facing the Dock Hopper; swings OUTWARD toward +X when tipping!)
    const tailgatePivot = new THREE.Group();
    tailgatePivot.position.set(-0.02, 1.12, 0);
    dumpBedPivot.add(tailgatePivot);
    const tailgate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.02, 1.84), matCrimson);
    tailgate.position.set(0, -0.5, 0);
    tailgate.castShadow = true;
    tailgatePivot.add(tailgate);

    // Cargo Pile inside Dump Bed (slides slightly toward rear chute and empties cleanly on tip)
    const bedCargoMesh = new THREE.Mesh(
      new THREE.ConeGeometry(1.15, 0.95, 7),
      matAlloyLump
    );
    bedCargoMesh.scale.set(1.22, 1, 0.78);
    bedCargoMesh.position.set(-1.55, 0.66, 0);
    dumpBedPivot.add(bedCargoMesh);

    // Telescopic Hydraulic Cylinder (dynamically spans chassis base to underside of raised bed front)
    const hydraulicPiston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.12, 1.0, 12),
      matChrome
    );
    truckGroup.add(hydraulicPiston);

    // ─── 4. COMPOSITE 10-PART BULK CARRIER SHIP (M.V. BERRY EXPORT) ───
    const shipGroup = new THREE.Group();
    shipGroup.position.set(11.6, -0.4, 0.8);
    scene.add(shipGroup);

    const matHull = new THREE.MeshStandardMaterial({
      map: hullTex,
      roughness: 0.42,
      metalness: 0.48,
    });
    const hullMain = new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.5, 14.2), matHull);
    hullMain.position.set(0, 0.6, 0);
    hullMain.castShadow = true;
    hullMain.receiveShadow = true;
    shipGroup.add(hullMain);

    const bow = new THREE.Mesh(
      new THREE.ConeGeometry(3.4, 3.6, 4),
      new THREE.MeshStandardMaterial({ color: '#0D2238', roughness: 0.4, metalness: 0.5 })
    );
    bow.rotation.x = -Math.PI / 2;
    bow.rotation.z = Math.PI / 4;
    bow.scale.set(0.82, 1, 0.52);
    bow.position.set(0, 0.62, -8.8);
    shipGroup.add(bow);

    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(5.4, 0.16, 13.8),
      new THREE.MeshStandardMaterial({ color: '#33485E', roughness: 0.72, metalness: 0.25 })
    );
    deck.position.set(0, 1.9, 0);
    shipGroup.add(deck);

    const holdCoaming = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.65, 5.8), matSteelDark);
    holdCoaming.position.set(0, 2.25, -1.0);
    shipGroup.add(holdCoaming);

    const shipCargoMound = new THREE.Mesh(
      new THREE.BoxGeometry(3.3, 0.55, 5.2),
      matAlloyLump
    );
    shipCargoMound.position.set(0, 2.22, -1.0);
    shipGroup.add(shipCargoMound);

    const matBridgeWhite = new THREE.MeshStandardMaterial({
      color: '#F1F5F9',
      roughness: 0.45,
      metalness: 0.12,
    });
    const bridgeBase = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.1, 2.9), matBridgeWhite);
    bridgeBase.position.set(0, 2.95, 4.9);
    bridgeBase.castShadow = true;
    shipGroup.add(bridgeBase);

    const bridgeTop = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.82, 1.7), matBridgeWhite);
    bridgeTop.position.set(0, 4.35, 4.65);
    bridgeTop.castShadow = true;
    shipGroup.add(bridgeTop);

    const bridgeGlass = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.42, 1.78), matGlass);
    bridgeGlass.position.set(0, 4.42, 4.6);
    shipGroup.add(bridgeGlass);

    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.58, 1.65, 16), matBrandBlue);
    funnel.position.set(0, 4.85, 5.85);
    shipGroup.add(funnel);
    const funnelBand = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.49, 0.35, 16), matCrimson);
    funnelBand.position.set(0, 5.22, 5.85);
    shipGroup.add(funnelBand);

    const radarMast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.7, 8), matChrome);
    radarMast.position.set(0, 5.6, 4.5);
    shipGroup.add(radarMast);

    // ─── 5. COMPOSITE 8-PART RAIL-MOUNTED PORT GANTRY CRANE ───
    const craneGroup = new THREE.Group();
    craneGroup.position.set(2.5, 0, 1.4);
    scene.add(craneGroup);

    for (const lx of [-3.3, 3.3]) {
      for (const lz of [-2.4, 2.4]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.36, 7.6, 0.36), matBrandBlue);
        leg.position.set(lx, 3.8, lz);
        leg.castShadow = true;
        craneGroup.add(leg);
      }
      const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 5.1), matCrimson);
      crossBeam.position.set(lx, 3.4, 0);
      craneGroup.add(crossBeam);
    }

    const boom = new THREE.Mesh(new THREE.BoxGeometry(17.8, 0.56, 1.45), matBrandBlue);
    boom.position.set(3.2, 7.6, 0);
    boom.castShadow = true;
    craneGroup.add(boom);

    const boomStripe = new THREE.Mesh(new THREE.BoxGeometry(17.9, 0.14, 1.52), matCrimson);
    boomStripe.position.set(3.2, 7.9, 0);
    craneGroup.add(boomStripe);

    // Moving Crane Trolley (local x = 1.05 aligns directly over dock hopper x = 3.55; x = 9.1 aligns over ship hold x = 11.6)
    const trolleyGroup = new THREE.Group();
    trolleyGroup.position.set(1.05, 7.22, 0);
    craneGroup.add(trolleyGroup);

    const trolleyBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 1.58), matAmber);
    trolleyBox.castShadow = true;
    trolleyGroup.add(trolleyBox);

    const cableMat = new THREE.MeshStandardMaterial({ color: '#CBD5E1', metalness: 0.85, roughness: 0.25 });
    const hoistCable = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 8), cableMat);
    trolleyGroup.add(hoistCable);

    const spreaderGroup = new THREE.Group();
    trolleyGroup.add(spreaderGroup);

    const spreaderBar = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 1.15), matCrimson);
    spreaderGroup.add(spreaderBar);

    const fibcBag = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.05, 0.95), matJumboBag);
    fibcBag.position.y = -0.68;
    fibcBag.castShadow = true;
    spreaderGroup.add(fibcBag);
    const fibcBand = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.18, 0.98), matBrandBlue);
    fibcBand.position.y = -0.68;
    spreaderGroup.add(fibcBand);

    // ─── 6. INSTANCED METALLIC FERRO-ALLOY LUMP PARTICLES ───
    const PARTICLE_COUNT = 38;
    const lumpGeo = new THREE.DodecahedronGeometry(0.14, 0);
    const lumpInst = new THREE.InstancedMesh(lumpGeo, matAlloyLump, PARTICLE_COUNT);
    lumpInst.frustumCulled = false;
    scene.add(lumpInst);

    const particleSeeds = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      phaseOffset: i / PARTICLE_COUNT,
      jx: ((i * 37) % 100) / 100 - 0.5,
      jz: ((i * 53) % 100) / 100 - 0.5,
      rotSpeed: 2 + ((i * 19) % 5),
    }));

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let elapsed = 0;
    let truckX = TRUCK_LOAD_X;
    let bedAngle = 0;
    let tailgateAngle = 0;
    let cargoFill = 0.65;
    let craneX = 1.05;
    let hoistLen = 2.4;
    let carryBag = true;
    let shipFill = 0.5;
    let lastUiSync = 0;
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(0.05, clock.getDelta());
      elapsed += dt;

      for (let i = 0; i < waterPosAttr.count; i++) {
        const vx = waterPosAttr.getX(i);
        const vz = waterPosAttr.getZ(i);
        waterPosAttr.setY(
          i,
          waterBaseY[i] + Math.sin(vx * 0.22 + elapsed * 1.4) * 0.1 + Math.cos(vz * 0.25 + elapsed * 1.1) * 0.08
        );
      }
      waterPosAttr.needsUpdate = true;

      shipGroup.position.y = -0.35 - shipFill * 0.18 + Math.sin(elapsed * 1.1) * 0.08;
      shipGroup.rotation.z = Math.sin(elapsed * 0.85) * 0.015;

      const st = stateRef.current;
      let targetTruckX = TRUCK_LOAD_X;
      let targetBedAngle = 0;
      let targetCargoFill = 0.7;
      let targetCraneX = 1.05;
      let targetHoistLen = 2.6;
      let activeFlow: 'none' | 'silo' | 'unload' = 'none';
      let stageText = 'Operating';

      if (st.manualOverride) {
        targetTruckX = TRUCK_UNLOAD_X;
        targetBedAngle = st.manualBedTilt * 0.72;
        targetCargoFill = Math.max(0.08, 1 - st.manualBedTilt * 0.85);
        targetCraneX = THREE.MathUtils.lerp(1.05, 9.1, st.manualCranePos);
        targetHoistLen = 2.0 + Math.sin(st.manualCranePos * Math.PI) * 1.2 + (st.manualCranePos > 0.85 ? 2.0 : 0);
        carryBag = st.manualCranePos < 0.94;
        activeFlow = st.manualBedTilt > 0.32 ? 'unload' : 'none';
        stageText = 'Manual Operator Control';
      } else {
        let activePhase: Exclude<LogisticsPhase, 'auto'> = 'load';
        let localT = 0;

        if (st.phase === 'auto') {
          const cycle = elapsed % 16;
          if (cycle < 3.6) {
            activePhase = 'load';
            localT = cycle / 3.6;
          } else if (cycle < 7.2) {
            activePhase = 'drive';
            localT = (cycle - 3.6) / 3.6;
          } else if (cycle < 11.4) {
            activePhase = 'unload';
            localT = (cycle - 7.2) / 4.2;
          } else {
            activePhase = 'crane';
            localT = (cycle - 11.4) / 4.6;
          }
        } else {
          activePhase = st.phase;
          localT = (elapsed % 4.5) / 4.5;
        }

        if (activePhase === 'load') {
          targetTruckX = TRUCK_LOAD_X;
          targetBedAngle = 0;
          targetCargoFill = 0.15 + localT * 0.85;
          targetCraneX = 1.05;
          targetHoistLen = 2.2;
          carryBag = false;
          activeFlow = 'silo';
          stageText = 'Loading Assayed Ferro-Alloys at Silo';
        } else if (activePhase === 'drive') {
          targetTruckX = THREE.MathUtils.lerp(TRUCK_LOAD_X, TRUCK_UNLOAD_X, Math.min(1, localT * 1.15));
          targetBedAngle = 0;
          targetCargoFill = 1.0;
          targetCraneX = 1.05;
          targetHoistLen = 2.3;
          carryBag = false;
          stageText = 'Backing 35 MT Tipper to Visakhapatnam Berth Hopper';
        } else if (activePhase === 'unload') {
          targetTruckX = TRUCK_UNLOAD_X;
          const liftWave = Math.sin(Math.min(1, localT) * Math.PI);
          targetBedAngle = liftWave * 0.72;
          targetCargoFill = Math.max(0.08, 1 - localT * 0.92);
          targetCraneX = 1.05;
          targetHoistLen = 2.4;
          carryBag = false;
          activeFlow = liftWave > 0.32 ? 'unload' : 'none';
          stageText = 'Rear Hydraulic Tipping Into Export Berth Hopper';
        } else if (activePhase === 'crane') {
          targetTruckX =
            st.phase === 'auto'
              ? THREE.MathUtils.lerp(TRUCK_UNLOAD_X, TRUCK_LOAD_X, Math.min(1, localT * 1.1))
              : TRUCK_UNLOAD_X;
          targetBedAngle = 0;
          targetCargoFill = 0.12;
          if (localT < 0.22) {
            targetCraneX = 1.05;
            targetHoistLen = THREE.MathUtils.lerp(2.2, 4.9, localT / 0.22);
            carryBag = localT > 0.14;
          } else if (localT < 0.65) {
            const p = (localT - 0.22) / 0.43;
            targetCraneX = THREE.MathUtils.lerp(1.05, 9.1, p);
            targetHoistLen = 2.0;
            carryBag = true;
          } else if (localT < 0.85) {
            const p = (localT - 0.65) / 0.2;
            targetCraneX = 9.1;
            targetHoistLen = THREE.MathUtils.lerp(2.0, 4.5, p);
            carryBag = p < 0.75;
            shipFill = Math.min(1, 0.4 + p * 0.55);
          } else {
            const p = (localT - 0.85) / 0.15;
            targetCraneX = THREE.MathUtils.lerp(9.1, 1.05, p);
            targetHoistLen = 2.2;
            carryBag = false;
          }
          stageText = 'Gantry Crane Hoisting Bulk Bags Into M.V. Berry Export';
        }
      }

      // Smooth damped mechanical kinematics
      const prevTruckX = truckX;
      truckX = THREE.MathUtils.damp(truckX, targetTruckX, 4.2, dt);
      bedAngle = THREE.MathUtils.damp(bedAngle, targetBedAngle, 5.2, dt);
      tailgateAngle = THREE.MathUtils.damp(tailgateAngle, bedAngle > 0.14 ? bedAngle * 0.92 : 0, 6.5, dt);
      cargoFill = THREE.MathUtils.damp(cargoFill, targetCargoFill, 4.0, dt);
      craneX = THREE.MathUtils.damp(craneX, targetCraneX, 4.8, dt);
      hoistLen = THREE.MathUtils.damp(hoistLen, targetHoistLen, 5.2, dt);

      truckGroup.position.x = truckX;
      const wheelDelta = -(truckX - prevTruckX) / 0.48;
      for (const w of wheelMeshes) {
        w.rotation.z += wheelDelta;
      }

      beacon.rotation.y += dt * 4.5;

      // VERIFIED KINEMATICS:
      // With rear hinge at +2.42 and bed extending along -X toward cab,
      // rotation.z = -bedAngle lifts the cab-side front wall UPWARD (+Y),
      // while tailgatePivot.rotation.z = +tailgateAngle swings the rear door OPEN outward toward +X (the dock hopper)!
      dumpBedPivot.rotation.z = -bedAngle;
      tailgatePivot.rotation.z = tailgateAngle;
      bedCargoMesh.scale.y = Math.max(0.06, cargoFill);
      bedCargoMesh.position.x = -1.55 + bedAngle * 0.72;
      bedCargoMesh.visible = cargoFill > 0.09;

      // Exact Telescopic Hydraulic Cylinder linking chassis mount to underside of rising bed front
      const baseX = -0.35;
      const baseY = 0.86;
      const attachLocalX = -2.45; // local to dumpBedPivot
      const tipX = 2.42 + attachLocalX * Math.cos(-bedAngle);
      const tipY = 0.92 + attachLocalX * Math.sin(-bedAngle);
      const dxP = tipX - baseX;
      const dyP = tipY - baseY;
      const cylLen = Math.max(0.25, Math.hypot(dxP, dyP));
      hydraulicPiston.position.set((baseX + tipX) * 0.5, (baseY + tipY) * 0.5, 0);
      hydraulicPiston.scale.set(1, cylLen, 1);
      hydraulicPiston.rotation.z = Math.atan2(dyP, dxP) - Math.PI / 2;

      // Apply crane trolley, hoist cable, and spreader bag
      trolleyGroup.position.x = craneX;
      hoistCable.scale.y = hoistLen;
      hoistCable.position.y = -hoistLen / 2;
      spreaderGroup.position.y = -hoistLen;
      fibcBag.visible = carryBag;
      fibcBand.visible = carryBag;

      shipCargoMound.scale.y = 0.45 + shipFill * 1.3;
      hopperAlloyPile.scale.setScalar(activeFlow === 'unload' ? 1.18 : 0.94);

      // Update cascading InstancedMesh Ferro-Alloy lumps
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const seed = particleSeeds[i];
        if (activeFlow === 'silo') {
          const p = (elapsed * 1.25 + seed.phaseOffset) % 1;
          _dummy.position.set(
            -8.8 + seed.jx * 0.55,
            THREE.MathUtils.lerp(3.2, 1.45, p * p),
            1.4 + seed.jz * 0.55
          );
          _dummy.scale.setScalar(0.85 + (i % 3) * 0.18);
        } else if (activeFlow === 'unload') {
          const p = (elapsed * 1.55 + seed.phaseOffset) % 1;
          // Spill cleanly out of the OPEN REAR TAILGATE (+X side at truckX + 2.42) straight into Dock Hopper (x = 3.55)!
          const chuteX = truckX + 2.42;
          _dummy.position.set(
            THREE.MathUtils.lerp(chuteX + 0.08, 3.55 + seed.jx * 0.55, p),
            THREE.MathUtils.lerp(1.42, 0.72, p * p),
            1.4 + seed.jz * 0.72
          );
          _dummy.scale.setScalar(0.85 + (i % 3) * 0.2);
        } else {
          _dummy.position.set(0, -40, 0);
          _dummy.scale.setScalar(0.001);
        }
        _dummy.rotation.set(elapsed * seed.rotSpeed, elapsed * 1.7, i);
        _dummy.updateMatrix();
        lumpInst.setMatrixAt(i, _dummy.matrix);
      }
      lumpInst.instanceMatrix.needsUpdate = true;

      if (st.cameraTargetPreset) {
        const presetCfg = CAMERA_PRESETS[st.cameraTargetPreset];
        _vPos.set(...presetCfg.pos);
        _vTarget.set(...presetCfg.target);
        camera.position.lerp(_vPos, 1 - Math.exp(-3.8 * dt));
        controls.target.lerp(_vTarget, 1 - Math.exp(-4.5 * dt));
        if (
          camera.position.distanceTo(_vPos) < 0.08 &&
          controls.target.distanceTo(_vTarget) < 0.08
        ) {
          st.cameraTargetPreset = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (elapsed - lastUiSync > 0.28) {
        lastUiSync = elapsed;
        setTelemetry({
          stageLabel: stageText,
          cargoTonnes: Math.round(cargoFill * 35),
          shipHoldPct: Math.round(45 + shipFill * 45),
        });
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(300, container.clientWidth);
      const h = Math.max(420, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      ro.disconnect();
      controls.dispose();
      envTex.dispose();
      quayTex.dispose();
      hullTex.dispose();
      truckBannerTex.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Interactive 3D Visakhapatnam port logistics simulator. Drag to orbit or use arrow keys to rotate."
      className={cn(
        'relative w-full h-[540px] sm:h-[600px] lg:h-[640px] overflow-hidden border border-[#10243A]/18 dark:border-[#F4F8FC]/16 bg-[#0B1B2E] outline-none focus-visible:ring-2 focus-visible:ring-brand',
        className
      )}
    >
      {/* Dedicated WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Minimal Top-Left Spec Badge (No Backdrop Blur over WebGL) */}
      <div className="pointer-events-none absolute top-4 left-4 z-20 bg-[#07111F]/90 border border-[#F4F8FC]/16 px-3.5 py-2.5 max-w-[82vw] sm:max-w-md">
        <p className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#69C5F5]">
          Interactive 3D Port &amp; Tipper Simulator · Visakhapatnam Corridor
        </p>
        <p className="font-display text-lg sm:text-xl font-bold uppercase text-[#F4F8FC] leading-tight mt-0.5">
          {telemetry.stageLabel}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1 text-[10px] font-mono-tabular text-[#B5C5D7]">
          <span>Truck Payload: {telemetry.cargoTonnes} MT</span>
          <span aria-hidden="true">/</span>
          <span>Vessel Hold: {telemetry.shipHoldPct}%</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#69C5F5]">Drag to Orbit · Scroll to Zoom</span>
        </div>
      </div>

      {/* Unified Collapsible Bottom Control Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(920px,94%)] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((c) => !c)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#07111F]/94 border border-b-0 border-[#F4F8FC]/20 text-[10px] font-mono-tabular uppercase tracking-widest text-[#69C5F5] hover:text-[#FFFFFF] cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              Show 3D Controls
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              Hide Controls
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="w-full bg-[#07111F]/94 border border-[#F4F8FC]/20 p-3 sm:p-4 space-y-3 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'auto', icon: Play },
                    { id: 'load', icon: PackageCheck },
                    { id: 'drive', icon: Truck },
                    { id: 'unload', icon: RotateCcw },
                    { id: 'crane', icon: Ship },
                  ] as Array<{ id: LogisticsPhase; icon: typeof Play }>
                ).map(({ id, icon: Icon }) => {
                  const active = !manualOverride && phase === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectPhase(id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 min-h-[34px] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer',
                        active
                          ? 'bg-[#006393] text-[#FFFFFF] border-[#69C5F5]'
                          : 'bg-[#10243A] text-[#B5C5D7] border-[#F4F8FC]/16 hover:text-[#FFFFFF] hover:border-[#69C5F5]/60'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{PHASE_META[id].label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[9px] font-mono-tabular uppercase tracking-widest text-[#B5C5D7] mr-1 hidden sm:inline">
                  Camera:
                </span>
                {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectPreset(key)}
                    className={cn(
                      'min-h-[30px] px-2.5 py-1 text-[10px] font-mono-tabular uppercase tracking-wider border transition-colors cursor-pointer',
                      cameraPreset === key
                        ? 'bg-[#C9233B] text-[#FFFFFF] border-[#FF8091]/60'
                        : 'bg-[#0D1B2E] text-[#B5C5D7] border-[#F4F8FC]/14 hover:text-[#FFFFFF]'
                    )}
                  >
                    {CAMERA_PRESETS[key].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F4F8FC]/12">
              <label className="flex items-center gap-3 text-[10px] font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                <span className="shrink-0 text-[#69C5F5] inline-flex items-center gap-1">
                  <Truck className="w-3 h-3" aria-hidden="true" />
                  Hydraulic Tip ({Math.round(manualBedTilt * 42)}°)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(manualBedTilt * 100)}
                  onChange={(e) => {
                    setManualOverride(true);
                    setManualBedTilt(Number(e.target.value) / 100);
                  }}
                  className="w-full accent-[#69C5F5] cursor-pointer"
                />
              </label>

              <label className="flex items-center gap-3 text-[10px] font-mono-tabular uppercase tracking-wider text-[#B5C5D7]">
                <span className="shrink-0 text-[#69C5F5] inline-flex items-center gap-1">
                  <Anchor className="w-3 h-3" aria-hidden="true" />
                  Crane Trolley ({Math.round(manualCranePos * 100)}%)
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(manualCranePos * 100)}
                  onChange={(e) => {
                    setManualOverride(true);
                    setManualCranePos(Number(e.target.value) / 100);
                  }}
                  className="w-full accent-[#69C5F5] cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortLogistics3DViewer;
