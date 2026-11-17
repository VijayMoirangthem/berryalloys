import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '../../lib/utils';

export interface BookCfg {
  id: string;
  title: string;
  author: string;
  year: string;
  stars: number;
  desc: string;
  categoryLabel?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  targetRoute?: string;
  externalUrl?: string;

  front?: (x: CanvasRenderingContext2D, w: number, h: number) => void;
  back?: (x: CanvasRenderingContext2D, w: number, h: number) => void;
  spine?: (x: CanvasRenderingContext2D, w: number, h: number) => void;

  images?: {
    front?: string;
    back?: string;
    spine?: string;
  };
  coverURL?: string | null;

  edge?: string;
  backBg?: string;
  backInk?: string;
  spineBg?: string;
  spineInk?: string;
  spineFont?: string;
  chapters?: string[];
}

export interface BooksShowcaseProps {
  books: BookCfg[];
  heroTitle?: string;
  navTitle?: string;
  showNav?: boolean;
  showDetailPanel?: boolean;
  showCarousel?: boolean;
  themeColors?: {
    navy?: string;
    pink?: string;
    cream?: string;
    lav?: string;
    peri?: string;
    bg?: string;
    bgLight?: string;
    bgDark?: string;
    foregroundLight?: string;
    foregroundDark?: string;
  };
  className?: string;
  onBookSelect?: (book: BookCfg | null) => void;
  onPrimaryAction?: (book: BookCfg) => void;
  onSecondaryAction?: (book: BookCfg) => void;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const OPEN_BTN_OFF = ['opacity-0', 'scale-[0.94]'];
const OPEN_BTN_ON = ['opacity-100', 'scale-100'];

/**
 * BooksShowcase — Interactive 3D Three.js hardcover showcase with spring-physics
 * peeling covers, orbit inspection, keyboard controls, and Berry Alloys document/spec actions.
 */
export function BooksShowcase({
  books = [],
  heroTitle = 'Archive',
  navTitle = 'Compendia & Filings',
  showNav = true,
  showDetailPanel = true,
  showCarousel = true,
  themeColors,
  className,
  onBookSelect,
  onPrimaryAction,
  onSecondaryAction,
}: BooksShowcaseProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dpRef = useRef<HTMLDivElement | null>(null);
  const shiftCarouselRef = useRef<(dir: 1 | -1) => void>(() => {});
  const openBookIndexRef = useRef<(idx: number) => void>(() => {});

  const onBookSelectRef = useRef(onBookSelect);
  useEffect(() => {
    onBookSelectRef.current = onBookSelect;
  }, [onBookSelect]);

  const [uiMode, setUiMode] = useState<'hero' | 'opening' | 'detail' | 'closing'>('hero');
  const [selectedCfg, setSelectedCfg] = useState<BookCfg | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvasEl = canvasRef.current;
    if (!root || !canvasEl || books.length === 0) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const setT = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
      return id;
    };

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice =
      RM ||
      window.matchMedia('(max-width: 900px)').matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    class Spring {
      v: number;
      t: number;
      vel: number;
      k: number;
      d: number;
      constructor(v: number, k?: number, d?: number) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        this.k = k || 120;
        this.d = d || 14;
      }
      set(v: number) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        return this;
      }
      update(dt: number) {
        const a = this.k * (this.t - this.v) - this.d * this.vel;
        this.vel += a * dt;
        this.v += this.vel * dt;
        return this.v;
      }
    }

    function mkCanvas(w: number, h: number) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }

    function drawSpaced(x: CanvasRenderingContext2D, text: string, cx: number, y: number, ls: number) {
      const prev = x.textAlign;
      x.textAlign = 'left';
      const chars = [...text];
      let tot = 0;
      const ws = chars.map((ch) => {
        const w = x.measureText(ch).width;
        tot += w;
        return w;
      });
      tot += ls * (chars.length - 1);
      let px = cx - tot / 2;
      chars.forEach((ch, i) => {
        x.fillText(ch, px, y);
        px += ws[i] + ls;
      });
      x.textAlign = prev;
    }

    function rr(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) {
      x.beginPath();
      x.moveTo(px + r, py);
      x.arcTo(px + w, py, px + w, py + h, r);
      x.arcTo(px + w, py + h, px, py + h, r);
      x.arcTo(px, py + h, px, py, r);
      x.arcTo(px, py, px + w, py, r);
      x.closePath();
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !lowPowerDevice, alpha: true });
    } catch {
      return;
    }

    const glCtx = renderer.getContext();
    const dbgExt = glCtx.getExtension('WEBGL_debug_renderer_info');
    const gpuStr = dbgExt ? String(glCtx.getParameter(dbgExt.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /(swiftshader|llvmpipe|software|softpipe)/i.test(gpuStr);
    const effLowPower = lowPowerDevice || isSoftwareGl;

    const dims = { w: 0, h: 0 };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, effLowPower ? 1 : 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    renderer.shadowMap.enabled = !effLowPower;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const ANISO = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0, 0.1, 9.6);

    function envBlob(x: CanvasRenderingContext2D, cx: number, cy: number, r: number, rgb: string, a: number) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(cx, cy, r, 0, 6.2832);
      x.fill();
    }
    (function buildEnv() {
      const c = mkCanvas(512, 256);
      const x = c.getContext('2d')!;
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#444b54');
      g.addColorStop(0.55, '#1e2329');
      g.addColorStop(1, '#101216');
      x.fillStyle = g;
      x.fillRect(0, 0, 512, 256);
      envBlob(x, 140, 66, 95, '255,255,255', 0.95);
      envBlob(x, 405, 84, 55, '40,148,204', 0.52);
      envBlob(x, 256, 150, 120, '244,248,252', 0.25);
      const tx = new THREE.CanvasTexture(c);
      tx.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(tx).texture;
      tx.dispose();
      pmrem.dispose();
    })();

    const hemi = new THREE.HemisphereLight(0xf3f0e9, 0x121417, 0.42);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(3.5, 5, 6);
    key.castShadow = !effLowPower;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    scene.add(key);
    const fillLight = new THREE.DirectionalLight(0xec743c, 0.24);
    fillLight.position.set(-4, 1, 4);
    scene.add(fillLight);
    const rim = new THREE.DirectionalLight(0xf3f0e9, 0.3);
    rim.position.set(-2, 3, -5);
    scene.add(rim);

    const bookRoot = new THREE.Group();
    scene.add(bookRoot);

    function tex(c: HTMLCanvasElement) {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = ANISO;
      return t;
    }

    function loadOrPaint(material: THREE.MeshStandardMaterial, imageURL: string | null | undefined, paintFallback: () => HTMLCanvasElement) {
      material.map = tex(paintFallback());
      material.needsUpdate = true;
      if (!imageURL) return;
      new THREE.TextureLoader().setCrossOrigin('anonymous').load(
        imageURL,
        (t) => {
          if (cancelled) return;
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = ANISO;
          material.map = t;
          material.needsUpdate = true;
        },
        undefined,
        () => {}
      );
    }

    function noiseTexture(base: number, amp: number, scratches: boolean) {
      const s = 256;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d')!;
      const img = x.createImageData(s, s);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = base + (Math.random() - 0.5) * 2 * amp;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      if (scratches) {
        x.strokeStyle = 'rgba(200,200,200,.25)';
        x.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          x.beginPath();
          const y = Math.random() * s;
          x.moveTo(0, y);
          x.lineTo(s, y + (Math.random() - 0.5) * 22);
          x.stroke();
        }
      }
      return new THREE.CanvasTexture(c);
    }
    const laminateBump = noiseTexture(128, 10, true);
    const clothBump = (() => {
      const s = 128;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d')!;
      x.fillStyle = '#808080';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < s; i += 2) {
        x.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.22)';
        x.fillRect(i, 0, 1, s);
        x.fillRect(0, i, s, 1);
      }
      return new THREE.CanvasTexture(c);
    })();

    function striationTexture(vertical: boolean) {
      const s = 512;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d')!;
      x.fillStyle = '#E7F3FA';
      x.fillRect(0, 0, s, s);
      let p = 0;
      while (p < s) {
        const w = 1 + Math.random() * 2.4;
        const tone = Math.random();
        x.fillStyle =
          tone < 0.12 ? 'rgba(140,125,95,.5)' : tone < 0.5 ? 'rgba(255,255,252,.55)' : 'rgba(190,178,150,.45)';
        if (vertical) x.fillRect(p, 0, w, s);
        else x.fillRect(0, p, s, w);
        p += w + 0.6 + Math.random() * 1.6;
      }
      for (let i = 0; i < 2000; i++) {
        x.fillStyle = 'rgba(120,108,84,' + (Math.random() * 0.1).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
      }
      return tex(c);
    }
    const striV = striationTexture(true);
    const striH = striationTexture(false);

    const endpaperTex = (() => {
      const s = 512;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d')!;
      x.fillStyle = '#F1F6FB';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < 1200; i++) {
        x.fillStyle = 'rgba(120,105,70,' + (0.04 + Math.random() * 0.08).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
      }
      const g = x.createLinearGradient(0, 0, s, 0);
      g.addColorStop(0, 'rgba(0,0,0,.07)');
      g.addColorStop(0.12, 'rgba(0,0,0,0)');
      g.addColorStop(0.88, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,.07)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return tex(c);
    })();

    const blobTex = (() => {
      const s = 256;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d')!;
      const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(0,0,0,.85)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    })();

    function paintDefaultFront(
      x: CanvasRenderingContext2D,
      w: number,
      h: number,
      o: { title: string; author: string; bg: string; year: string }
    ) {
      x.fillStyle = o.bg;
      x.fillRect(0, 0, w, h);

      // Subtle architectural grid rules
      x.strokeStyle = 'rgba(40,148,204,0.22)';
      x.lineWidth = 2;
      x.strokeRect(56, 56, w - 112, h - 112);

      // Top metadata label
      x.fillStyle = '#69C5F5';
      x.textAlign = 'left';
      x.font = '600 30px "IBM Plex Mono", monospace';
      x.fillText(`BERRY ALLOYS · ${o.year}`, 104, 148);

      // Title block
      x.fillStyle = '#F4F8FC';
      x.textAlign = 'left';
      x.font = '700 84px "Barlow Condensed", Georgia, sans-serif';
      const words = o.title.toUpperCase().split(' ');
      let line = '';
      const lines: string[] = [];
      words.forEach((word) => {
        const test = line ? line + ' ' + word : word;
        if (x.measureText(test).width > w - 210 && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);
      const startY = h * 0.4;
      lines.forEach((l, i) => x.fillText(l, 104, startY + i * 94));

      // Divider copper bar
      x.fillStyle = '#69C5F5';
      x.fillRect(104, startY + lines.length * 94 + 34, 140, 8);

      x.fillStyle = 'rgba(244,248,252,0.78)';
      x.font = '500 36px "Plus Jakarta Sans", Arial, sans-serif';
      x.fillText(o.author, 104, h - 140);
    }

    function paintBack(x: CanvasRenderingContext2D, w: number, h: number, o: { backBg: string; backInk: string }) {
      x.fillStyle = o.backBg;
      x.fillRect(0, 0, w, h);
      const ink = o.backInk;
      x.fillStyle = 'rgba(' + ink + ',.5)';
      rr(x, 150, 190, w - 460, 28, 14);
      x.fill();
      for (let i = 0; i < 9; i++) {
        const lw = i === 8 ? w - 560 : w - 300 - Math.random() * 180;
        x.fillStyle = 'rgba(' + ink + ',.2)';
        rr(x, 150, 300 + i * 56, lw, 15, 7);
        x.fill();
      }
      x.fillStyle = 'rgba(' + ink + ',.45)';
      x.beginPath();
      x.arc(178, h - 186, 26, 0, 6.2832);
      x.fill();
      x.fillStyle = '#fff';
      rr(x, w - 330, h - 262, 236, 152, 8);
      x.fill();
      x.fillStyle = '#111';
      let bx = w - 310;
      while (bx < w - 118) {
        const bw = 2 + Math.random() * 6;
        if (Math.random() > 0.42) x.fillRect(bx, h - 242, bw, 96);
        bx += bw + 2 + Math.random() * 4;
      }
      x.font = '500 21px monospace';
      x.textAlign = 'center';
      x.fillText('CIN U27310WB2006PLC145016', w - 212, h - 124);
      x.textAlign = 'left';
    }

    function paintSpine(
      x: CanvasRenderingContext2D,
      w: number,
      h: number,
      o: { spineBg: string; spineInk: string; spineFont: string; title: string; author: string }
    ) {
      x.fillStyle = o.spineBg;
      x.fillRect(0, 0, w, h);
      x.save();
      x.translate(w / 2, h / 2);
      x.rotate(Math.PI / 2);
      x.fillStyle = o.spineInk;
      x.font = o.spineFont;
      drawSpaced(x, o.title.toUpperCase().slice(0, 26), -h * 0.1, 15, 4);
      x.globalAlpha = 0.85;
      x.font = '600 22px monospace';
      drawSpaced(x, o.author.toUpperCase().slice(0, 20), h * 0.325, 9, 3);
      x.globalAlpha = 1;
      x.restore();
      x.fillStyle = '#69C5F5';
      x.globalAlpha = 0.75;
      x.fillRect(w / 2 - 26, 92, 52, 4);
      x.fillRect(w / 2 - 26, h - 95, 52, 4);
      x.globalAlpha = 1;
    }

    function trimToWidth(x: CanvasRenderingContext2D, text: string, maxW: number) {
      if (x.measureText(text).width <= maxW) return text;
      let t = text;
      while (t.length > 1 && x.measureText(t + '...').width > maxW) t = t.slice(0, -1);
      return t + '...';
    }

    function makeIndexPageTex(chapters?: string[]) {
      const w = 1024;
      const h = 1536;
      const c = mkCanvas(w, h);
      const x = c.getContext('2d')!;
      x.fillStyle = '#F1F6FB';
      x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(130,110,80,0.07)';
      for (let i = 0; i < 1400; i++) x.fillRect(Math.random() * w, Math.random() * h, 1.1, 1.1);
      x.fillStyle = '#10243A';
      x.textAlign = 'center';
      x.font = '700 76px "Barlow Condensed", Georgia, sans-serif';
      x.fillText('CONTENTS INDEX', w / 2, 190);
      x.fillStyle = '#006393';
      x.fillRect(220, 225, w - 440, 4);

      const list =
        chapters && chapters.length
          ? chapters
          : ['Corporate Identity', 'Ferro Manganese Specs', 'Silico Manganese Specs', 'AOD & Refining', 'Statutory Governance', 'Contact Desk'];
      x.textAlign = 'left';
      x.font = '500 42px Georgia';
      let y = 318;
      for (let i = 0; i < list.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        const pageNo = String(4 + i * 8).padStart(3, ' ');
        const left = n + '. ' + trimToWidth(x, list[i], 650);
        x.fillStyle = '#10243A';
        x.fillText(left, 140, y);
        x.textAlign = 'right';
        x.fillStyle = '#006393';
        x.fillText(pageNo, w - 140, y);
        x.textAlign = 'left';
        x.globalAlpha = 0.22;
        x.fillStyle = '#10243A';
        x.fillRect(140, y + 16, w - 280, 2);
        x.globalAlpha = 1;
        y += 112;
      }
      return tex(c);
    }

    const N = books.length;
    const VISIBLE = Math.min(3, N);

    const W = 1.42;
    const H = 2.14;
    const T = 0.34;
    const CT = 0.032;
    const OV = 0.05;
    const PAGE_N = effLowPower ? 6 : 10;
    const BACK_PAGE_N = effLowPower ? 3 : 5;
    const PW = W - 0.02;
    const PH = H - 0.02;
    const BLOCK_D = 0.245;
    const BLOCK_Z = -0.0205;
    const PIVOT_Z = T / 2 + CT / 2;
    const BPIVOT_Z = -(T / 2 + CT / 2);
    const HINGE_OVERLAP = 0.05;

    const coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
    const blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
    const pageGeo = new THREE.PlaneGeometry(PW, PH);
    const spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
    const hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
    const blobGeo = new THREE.PlaneGeometry(1, 1);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    function std(o: THREE.MeshStandardMaterialParameters) {
      return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.04 }, o));
    }

    const paperFlat = std({ color: 0xf2ecdd, roughness: 0.95, envMapIntensity: 0.2 });
    const striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    const striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    const endpaperMat = std({ map: endpaperTex, roughness: 0.9, envMapIntensity: 0.25 });
    const pageMats = [0xf4eee0, 0xf1ebdb, 0xf6f0e3].map((c) =>
      std({ color: c, roughness: 0.92, envMapIntensity: 0.22, side: THREE.DoubleSide })
    );

    type Book = {
      cfg: BookCfg;
      index: number;
      root: THREE.Group;
      float: THREE.Group;
      pivot: THREE.Group;
      backPivot: THREE.Group;
      frontMesh: THREE.Mesh;
      spine: THREE.Mesh;
      block: THREE.Mesh;
      pages: THREE.Group[];
      pageF: number[];
      pagesB: THREE.Group[];
      pageFB: number[];
      hit: THREE.Mesh;
      springs: Record<string, Spring>;
      phase: number;
      slotScale: number;
      hitEdge: number | null;
      scr: { x: number; y: number };
      orbY: number;
      orbYv: number;
      orbPhase: string;
      orbTarget: number;
      orbXs: Spring;
      exit: { segs: Array<{ d: number; from: number; to: number; ease: (t: number) => number; end?: () => void }>; i: number; t: number } | null;
    };

    const bookInstances: Book[] = [];
    const hitMeshes: THREE.Mesh[] = [];

    function buildBook(cfg: BookCfg, index: number): Book {
      const root = new THREE.Group();
      const float = new THREE.Group();
      root.add(float);
      bookRoot.add(root);

      const indexPageMat = std({ map: makeIndexPageTex(cfg.chapters), roughness: 0.92, envMapIntensity: 0.2, side: THREE.DoubleSide });

      const edgeColor = cfg.edge ?? '#E7F3FA';
      const mEdge = std({ color: edgeColor, bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.68, envMapIntensity: 0.3 });
      const mFront = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.48, envMapIntensity: 0.32 });
      const mBack = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.56, envMapIntensity: 0.28 });
      const mSpine = std({ bumpMap: clothBump, bumpScale: 0.006, roughness: 0.74, envMapIntensity: 0.24 });

      loadOrPaint(mFront, cfg.images?.front ?? cfg.coverURL ?? null, () => {
        const c = mkCanvas(1024, 1536);
        const ctx = c.getContext('2d')!;
        if (cfg.front) cfg.front(ctx, 1024, 1536);
        else
          paintDefaultFront(ctx, 1024, 1536, {
            title: cfg.title,
            author: cfg.author,
            bg: cfg.spineBg ?? cfg.backBg ?? '#0D1B2E',
            year: cfg.year,
          });
        return c;
      });
      loadOrPaint(mBack, cfg.images?.back ?? null, () => {
        const c = mkCanvas(1024, 1536);
        const ctx = c.getContext('2d')!;
        if (cfg.back) cfg.back(ctx, 1024, 1536);
        else paintBack(ctx, 1024, 1536, { backBg: cfg.backBg ?? '#0D1B2E', backInk: cfg.backInk ?? '244,248,252' });
        return c;
      });
      loadOrPaint(mSpine, cfg.images?.spine ?? null, () => {
        const c = mkCanvas(220, 1536);
        const ctx = c.getContext('2d')!;
        if (cfg.spine) cfg.spine(ctx, 220, 1536);
        else
          paintSpine(ctx, 220, 1536, {
            spineBg: cfg.spineBg ?? cfg.backBg ?? '#0D1B2E',
            spineInk: cfg.spineInk ?? '#F4F8FC',
            spineFont: cfg.spineFont ?? '700 36px "Barlow Condensed", Georgia',
            title: cfg.title,
            author: cfg.author,
          });
        return c;
      });

      const backPivot = new THREE.Group();
      backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
      const backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
      backMesh.position.x = (W + OV) / 2;
      backMesh.castShadow = backMesh.receiveShadow = !effLowPower;
      backPivot.add(backMesh);
      float.add(backPivot);

      const pivot = new THREE.Group();
      pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
      const frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
      frontMesh.position.x = (W + OV) / 2;
      frontMesh.castShadow = frontMesh.receiveShadow = !effLowPower;
      pivot.add(frontMesh);
      float.add(pivot);

      const spine = new THREE.Mesh(spineGeo, mSpine);
      spine.position.set(-W / 2 - 0.013, 0, 0);
      spine.castShadow = !effLowPower;
      float.add(spine);

      const block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
      block.position.set(-0.0075, 0, BLOCK_Z);
      block.castShadow = block.receiveShadow = !effLowPower;
      float.add(block);

      const pages: THREE.Group[] = [];
      const pageF: number[] = [];
      for (let i = 0; i < PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, 0.166 - i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, i === 0 ? indexPageMat : pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        float.add(pp);
        pages.push(pp);
        pageF.push(0.3 * Math.pow(1 - i / PAGE_N, 2.6));
      }

      const pagesB: THREE.Group[] = [];
      const pageFB: number[] = [];
      for (let i = 0; i < BACK_PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, -0.166 + i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        float.add(pp);
        pagesB.push(pp);
        pageFB.push(0.3 * Math.pow(1 - i / BACK_PAGE_N, 2.6));
      }

      const blob = new THREE.Mesh(
        blobGeo,
        new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.42, depthWrite: false })
      );
      blob.scale.set(3.1, 3.9, 1);
      blob.position.set(0.1, -0.3, -0.85);
      blob.renderOrder = -5;
      root.add(blob);

      const hit = new THREE.Mesh(hitGeo, hitMat);
      float.add(hit);

      const springs: Record<string, Spring> = {
        px: new Spring(0, 17, 6.8),
        py: new Spring(0, 17, 6.8),
        pz: new Spring(0, 17, 6.8),
        rx: new Spring(0, 17, 6.8),
        ry: new Spring(0, 17, 6.8),
        rz: new Spring(0, 17, 6.8),
        sc: new Spring(1, 17, 6.8),
        tiltX: new Spring(0, 120, 13),
        tiltY: new Spring(0, 120, 13),
        lift: new Spring(0, 120, 13),
        cover: new Spring(0, 90, 12),
        coverB: new Spring(0, 90, 12),
        drag: new Spring(0, 160, 16),
      };

      const b: Book = {
        cfg,
        index,
        root,
        float,
        pivot,
        backPivot,
        frontMesh,
        spine,
        block,
        pages,
        pageF,
        pagesB,
        pageFB,
        hit,
        springs,
        phase: Math.random() * 6.28,
        slotScale: 1,
        hitEdge: null,
        scr: { x: 0, y: 0 },
        orbY: 0,
        orbYv: 0,
        orbPhase: 'idle',
        orbTarget: 0,
        orbXs: new Spring(0, 60, 12),
        exit: null,
      };
      bookInstances.push(b);
      return b;
    }
    books.forEach(buildBook);
    const bookByHit = (m: THREE.Object3D) => bookInstances.find((b) => b.hit === m)!;

    const state: {
      mode: 'hero' | 'opening' | 'detail' | 'closing';
      selected: Book | null;
      hovered: Book | null;
      pillLock: Book | null;
      kbIndex: number;
    } = { mode: 'hero', selected: null, hovered: null, pillLock: null, kbIndex: -1 };

    type Slot = { p: [number, number, number]; r: [number, number, number]; s: number };
    const SLOTS: { hero: Slot[]; detail: Slot | null; portrait: boolean } = { hero: [], detail: null, portrait: false };

    function computeSlots() {
      const a = dims.w / Math.max(1, dims.h);
      const portrait = a < 0.85;
      const fit = portrait ? clamp(a / 1.08, 0.38, 0.74) : clamp(a / 1.62, 0.52, 1);
      bookRoot.scale.setScalar(fit);
      bookRoot.position.y = -(1 - fit) * 0.28;
      SLOTS.portrait = portrait;

      SLOTS.hero = SLOTS.portrait
        ? [
            { p: [-1.36, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.25 },
            { p: [0.2, -0.22, 0.6], r: [-0.05, -0.1, -0.035], s: 1.35 },
            { p: [1.62, -0.62, -0.34], r: [-0.045, -0.42, -0.17], s: 1.25 },
          ]
        : [
            { p: [-2.05, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.22 },
            { p: [0.25, -0.36, 0.6], r: [-0.05, -0.1, -0.035], s: 1.32 },
            { p: [2.35, -0.64, -0.34], r: [-0.045, -0.42, -0.17], s: 1.22 },
          ];

      if (!showDetailPanel) {
        SLOTS.detail = { p: [0, -0.05, 0.75], r: [0.02, -0.34, 0.05], s: SLOTS.portrait ? 0.94 : 1.08 };
        return;
      }

      if (SLOTS.portrait) {
        const el = dpRef.current;
        const panelH = el && el.offsetHeight > 40 ? el.offsetHeight : dims.h * 0.44;
        const gap = dims.h * 0.035;
        const navB = dims.h * 0.1;
        const freeTop = navB;
        const freeBot = Math.max(dims.h - panelH - gap, freeTop + 140);
        const midPx = (freeTop + freeBot) / 2;
        const T13 = 0.23087;
        const camZp = 9.9;
        const zw = 0.8 * fit;
        const rootY = -(1 - fit) * 0.28;
        const yw = 0.1 + (1 - (2 * midPx) / dims.h) * T13 * (camZp - zw);
        const availW = (((freeBot - freeTop) * 0.92) / dims.h) * 2 * T13 * (camZp - zw);
        const s = clamp(availW / fit / 2.65, 0.42, 0.92);
        SLOTS.detail = { p: [0, (yw - rootY) / fit, 0.8], r: [-0.02, -0.4, 0.06], s };
      } else {
        SLOTS.detail = { p: [-1.68, 0.0, 0.85], r: [0.02, -0.44, 0.08], s: 1.06 };
      }
    }

    function setTargets(b: Book, slot: Slot) {
      const s = b.springs;
      s.px.t = slot.p[0];
      s.py.t = slot.p[1];
      s.pz.t = slot.p[2];
      s.rx.t = slot.r[0];
      s.ry.t = slot.r[1];
      s.rz.t = slot.r[2];
      b.slotScale = slot.s;
    }

    const EASE = {
      hold: () => 1,
      outQuad: (t: number) => 1 - (1 - t) * (1 - t),
      outQuint: (t: number) => 1 - Math.pow(1 - t, 5),
      inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
    };
    const LIFT = 0.38;
    const CLEAR = 4.2;

    function playY(b: Book, segs: Array<{ d: number; from: number; to: number; ease: (t: number) => number; end?: () => void }>) {
      b.exit = { segs, i: 0, t: 0 };
    }
    function stepY(b: Book, dt: number) {
      const ex = b.exit!;
      const s = b.springs;
      ex.t += dt;
      let seg = ex.segs[ex.i];
      while (seg && ex.t >= seg.d) {
        ex.t -= seg.d;
        s.py.v = seg.to;
        if (seg.end) seg.end();
        seg = ex.segs[++ex.i];
      }
      if (seg) s.py.v = seg.from + (seg.to - seg.from) * seg.ease(ex.t / seg.d);
      else b.exit = null;
      s.py.t = s.py.v;
      s.py.vel = 0;
    }
    function pinInPlace(b: Book) {
      const s = b.springs;
      s.px.t = s.px.v;
      s.pz.t = s.pz.v;
      s.rx.t = s.rx.v;
      s.ry.t = s.ry.v;
      s.rz.t = s.rz.v;
    }
    function sendOut(b: Book, i: number, delay: number) {
      const y0 = SLOTS.hero[i].p[1];
      const here = b.springs.py.v;
      const apex = y0 + LIFT;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 0.28, from: here, to: apex, ease: EASE.outQuad },
        { d: 0.9, from: apex, to: y0 - CLEAR, ease: EASE.inOutSine, end: () => { b.root.visible = false; } },
      ]);
    }
    function bringBack(b: Book, i: number, delay: number) {
      const here = b.springs.py.v;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 1.0, from: here, to: SLOTS.hero[i].p[1], ease: EASE.outQuint },
      ]);
    }

    function windowIndices(start: number, total: number, count: number) {
      const arr: number[] = [];
      for (let i = 0; i < count; i++) arr.push((start + i) % total);
      return arr;
    }
    let carouselStart = 0;
    let currentWindow: number[] = windowIndices(0, N, VISIBLE);
    let carouselBusy = false;

    function rebuildHitMeshes() {
      hitMeshes.length = 0;
      currentWindow.forEach((bi) => hitMeshes.push(bookInstances[bi].hit));
    }

    function applyMode() {
      if (state.mode === 'hero' || state.mode === 'closing') {
        currentWindow.forEach((bi, i) => {
          const slot = SLOTS.hero[i];
          if (slot) setTargets(bookInstances[bi], slot);
        });
      } else if (state.selected && SLOTS.detail) {
        setTargets(state.selected, SLOTS.detail);
      }
    }

    function shiftCarousel(dir: 1 | -1) {
      if (carouselBusy || state.mode !== 'hero' || N <= VISIBLE) return;
      carouselBusy = true;
      const outgoing = currentWindow;
      carouselStart = (((carouselStart + dir) % N) + N) % N;
      const incoming = windowIndices(carouselStart, N, VISIBLE);

      const toHide = outgoing.filter((bi) => !incoming.includes(bi));
      toHide.forEach((bi) => {
        const oldIdx = outgoing.indexOf(bi);
        const slot = SLOTS.hero[oldIdx];
        const b = bookInstances[bi];
        if (slot) b.springs.px.t = slot.p[0] - dir * 6.5;
      });
      setT(() => toHide.forEach((bi) => { bookInstances[bi].root.visible = false; }), 650);

      incoming.forEach((bi, i) => {
        const slot = SLOTS.hero[i];
        if (!slot) return;
        const b = bookInstances[bi];
        const alreadyOnScreen = outgoing.includes(bi);
        b.root.visible = true;
        if (!alreadyOnScreen) {
          b.springs.px.set(slot.p[0] + dir * 6.5);
          b.springs.py.set(slot.p[1]);
          b.springs.pz.set(slot.p[2]);
          b.springs.rx.set(slot.r[0]);
          b.springs.ry.set(slot.r[1]);
          b.springs.rz.set(slot.r[2]);
          b.springs.sc.set(slot.s * 0.92);
        }
        setTargets(b, slot);
      });

      currentWindow = incoming;
      rebuildHitMeshes();
      setT(() => { carouselBusy = false; }, 700);
    }
    shiftCarouselRef.current = shiftCarousel;

    const camX = new Spring(0, 13, 6.5);
    const camY = new Spring(0.1, 13, 6.5);
    const camZ = new Spring(9.6, 13, 6.5);
    const lookX = new Spring(0, 13, 6.5);
    const lookY = new Spring(0, 13, 6.5);
    const parX = new Spring(0, 60, 10);
    const parY = new Spring(0, 60, 10);

    function camTo(mode: string) {
      if (mode === 'detail') {
        camX.t = SLOTS.portrait ? 0 : -0.25;
        camZ.t = SLOTS.portrait ? 10.4 : 9.6;
        lookX.t = SLOTS.portrait ? 0 : -0.35;
        lookY.t = SLOTS.portrait ? 0 : 0.15;
      } else {
        camX.t = 0;
        camZ.t = 9.6;
        lookX.t = 0;
        lookY.t = 0;
      }
    }

    const pillX = new Spring(0, 190, 23);
    const pillY = new Spring(0, 190, 23);
    let pillOn = false;
    function showPill() {
      const el = openBtnRef.current;
      if (!el) return;
      el.classList.remove(...OPEN_BTN_OFF);
      el.classList.add(...OPEN_BTN_ON);
      pillOn = true;
    }
    function hidePill() {
      const el = openBtnRef.current;
      if (el) {
        el.classList.remove(...OPEN_BTN_ON);
        el.classList.add(...OPEN_BTN_OFF);
      }
      pillOn = false;
    }

    function open(book: Book | null) {
      if (state.mode !== 'hero' || !book) return;
      state.mode = 'opening';
      setUiMode('opening');
      state.selected = book;
      state.pillLock = null;
      state.kbIndex = -1;
      hidePill();
      book.exit = null;
      root!.classList.add('bs-transit');
      setSelectedCfg(book.cfg);
      onBookSelectRef.current?.(book.cfg);
      computeSlots();

      let out = 0;
      currentWindow.forEach((bi, i) => {
        const b = bookInstances[bi];
        if (b !== book) sendOut(b, i, out++ * 0.08);
      });

      setT(() => {
        if (state.mode !== 'opening' && state.mode !== 'detail') return;
        book.orbY = RM ? 0 : -6.2832;
        book.orbYv = RM ? 0 : 3;
        book.orbPhase = 'return';
        book.orbTarget = 0;
        book.orbXs.set(0);
        applyMode();
        camTo('detail');
      }, 640);
      setT(() => {
        if (state.mode === 'opening') {
          currentWindow.forEach((bi) => {
            const sibling = bookInstances[bi];
            if (sibling !== book) {
              sibling.exit = null;
              sibling.root.visible = false;
            }
          });
          root!.classList.add('bs-detail-open');
          state.mode = 'detail';
          setUiMode('detail');
        }
      }, 1150);
    }

    function close() {
      if (state.mode !== 'detail') return;
      state.mode = 'closing';
      setUiMode('closing');
      root!.classList.remove('bs-detail-open');
      onBookSelectRef.current?.(null);
      orbit.drag = false;
      const b = state.selected;
      if (b) {
        b.orbTarget = Math.round(b.orbY / 6.2832) * 6.2832 + 6.2832;
        b.orbYv = Math.max(b.orbYv, 3);
        b.orbPhase = 'return';
        b.orbXs.t = 0;
      }
      setT(() => {
        root!.classList.remove('bs-transit');
        applyMode();
        camTo('hero');
        let back = 0;
        currentWindow.forEach((bi, i) => {
          const bk = bookInstances[bi];
          if (bk !== b) bringBack(bk, i, 0.72 + back++ * 0.1);
        });
      }, 220);
      setT(() => {
        if (state.mode === 'closing') {
          state.mode = 'hero';
          setUiMode('hero');
          state.selected = null;
          setSelectedCfg(null);
        }
      }, 1350);
    }

    const onCloseClick = () => close();
    closeBtnRef.current?.addEventListener('click', onCloseClick);
    openBookIndexRef.current = (idx: number) => {
      const target = bookInstances[idx];
      if (!target) return;
      if (state.mode === 'hero') {
        open(target);
      }
    };

    const ptr = {
      ndcX: 0,
      ndcY: 0,
      cx: 0,
      cy: 0,
      lastX: 0,
      lastY: 0,
      down: false,
      downX: 0,
      downY: 0,
      moved: 0,
      t0: 0,
      type: 'mouse',
      seen: false,
      id: null as number | null,
    };
    const isTouch = () => ptr.type === 'touch' || ptr.type === 'pen';
    let dragBook: Book | null = null;
    let rayBook: Book | null = null;
    const orbit = { drag: false, dxAcc: 0, dyAcc: 0 };
    const ray = new THREE.Raycaster();
    const tmpV = new THREE.Vector3();

    const canvas = canvasEl;
    const onContextMenu = (e: Event) => e.preventDefault();
    canvas.addEventListener('contextmenu', onContextMenu);

    const onPointerLeave = () => {
      rayBook = null;
      state.pillLock = null;
      state.kbIndex = -1;
    };
    canvas.addEventListener('pointerleave', onPointerLeave);

    const localXY = (e: PointerEvent) => {
      const r = root!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      const { x: cx, y: cy } = localXY(e);
      const dxN = (cx - ptr.lastX) / dims.w;
      const dyN = (cy - ptr.lastY) / dims.h;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      if (ptr.down && dragBook) {
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
        dragBook.springs.drag.t = clamp(((ptr.downX - cx) / dims.w) * 3.4, 0, 1.0);
      }
      if (ptr.down && orbit.drag) {
        orbit.dxAcc += dxN;
        orbit.dyAcc += dyN;
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
      }
    };
    canvas.addEventListener('pointermove', onPointerMove);

    const onPointerDown = (e: PointerEvent) => {
      if (ptr.id !== null) return;
      root.focus({ preventScroll: true });
      ptr.id = e.pointerId;
      const { x: cx, y: cy } = localXY(e);
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      castRay();
      if (state.mode === 'hero' && rayBook) {
        ptr.down = true;
        dragBook = rayBook;
        ptr.downX = cx;
        ptr.downY = cy;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else if (state.mode === 'detail' && rayBook === state.selected) {
        ptr.down = true;
        orbit.drag = true;
        orbit.dxAcc = 0;
        orbit.dyAcc = 0;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else {
        state.pillLock = null;
        state.kbIndex = -1;
      }
    };
    canvas.addEventListener('pointerdown', onPointerDown);

    const onPointerUp = (e: PointerEvent) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      orbit.drag = false;
      if (dragBook) {
        const slop = isTouch() ? 26 : 14;
        const limit = isTouch() ? 650 : 450;
        const wasDrag = ptr.moved > slop;
        dragBook.springs.drag.t = 0;
        if (!wasDrag && state.mode === 'hero' && performance.now() - ptr.t0 < limit) open(dragBook);
        dragBook = null;
      }
      ptr.down = false;
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointerup', onPointerUp);

    const cancelPointer = (e?: PointerEvent) => {
      if (e && ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      ptr.down = false;
      orbit.drag = false;
      if (dragBook) {
        dragBook.springs.drag.t = 0;
        dragBook = null;
      }
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointercancel', cancelPointer as EventListener);
    canvas.addEventListener('lostpointercapture', cancelPointer as EventListener);

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (state.mode !== 'hero') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.shiftKey) {
          shiftCarousel(e.key === 'ArrowRight' ? 1 : -1);
        } else {
          const d = e.key === 'ArrowRight' ? 1 : -1;
          state.kbIndex = ((state.kbIndex < 0 ? (d > 0 ? -1 : 1) : state.kbIndex) + d + VISIBLE) % VISIBLE;
          state.pillLock = null;
        }
        e.preventDefault();
      }
      if (e.key === 'Enter' && state.hovered) open(state.hovered);
    };
    root.addEventListener('keydown', onKeydown);

    function castRay() {
      ray.setFromCamera({ x: ptr.ndcX, y: ptr.ndcY } as THREE.Vector2, camera);
      const hits = ray.intersectObjects(hitMeshes, false);
      if (hits.length) {
        rayBook = bookByHit(hits[0].object);
        const lp = rayBook.hit.worldToLocal(hits[0].point.clone());
        rayBook.hitEdge = clamp((lp.x / 0.9) * 0.5 + 0.5, 0, 1);
      } else {
        rayBook = null;
      }
    }

    const timer = new THREE.Timer();
    timer.connect(document);
    const idle = RM ? 0 : 1;
    const DETAIL_OPEN_ANGLE = 0.88;
    const DETAIL_OPEN_SWAY = 0.035;

    function screenPos(b: Book) {
      b.root.getWorldPosition(tmpV).project(camera);
      b.scr.x = (tmpV.x * 0.5 + 0.5) * dims.w;
      b.scr.y = (-tmpV.y * 0.5 + 0.5) * dims.h;
    }

    function tickBook(b: Book, dt: number, t: number) {
      const s = b.springs;
      const isHov = state.hovered === b;
      const inDetail = state.mode === 'detail' && state.selected === b;
      const orbitActive = state.selected === b && state.mode !== 'hero';

      let activity = 0;
      if (orbitActive) {
        if (orbit.drag && inDetail) {
          const step = orbit.dxAcc * 6.5;
          orbit.dxAcc = 0;
          b.orbY += step;
          b.orbYv = clamp(b.orbYv * 0.5 + (step / Math.max(dt, 0.001)) * 0.5, -14, 14);
          b.orbXs.t = clamp(b.orbXs.t + orbit.dyAcc * 3.2, -0.55, 0.55);
          orbit.dyAcc = 0;
          b.orbPhase = 'drag';
        } else {
          b.orbXs.t = 0;
          if (b.orbPhase === 'drag') {
            if (Math.abs(b.orbYv) > 0.6) b.orbPhase = 'spin';
            else {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          }
          if (b.orbPhase === 'spin') {
            b.orbYv *= Math.exp(-0.9 * dt);
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbYv) < 0.5) {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          } else if (b.orbPhase === 'return') {
            const acc = 16 * (b.orbTarget - b.orbY) - 8 * b.orbYv;
            b.orbYv += acc * dt;
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbTarget - b.orbY) < 0.002 && Math.abs(b.orbYv) < 0.01) {
              b.orbY = b.orbTarget;
              b.orbYv = 0;
              b.orbPhase = 'idle';
            }
          }
        }
        const distRest = Math.abs(b.orbY - Math.round(b.orbY / 6.2832) * 6.2832);
        activity = clamp(Math.abs(b.orbYv) * 1.5 + (orbit.drag ? 1 : 0) + distRest * 2, 0, 1);
      }
      b.orbXs.update(dt);

      let coverBase = 0;
      if (inDetail) coverBase = DETAIL_OPEN_ANGLE + Math.sin(t * 0.8 + b.phase) * DETAIL_OPEN_SWAY * idle;
      const fan = orbitActive ? clamp(b.orbYv * 0.16, 0, 0.75) : 0;
      const fanB = orbitActive ? clamp(-b.orbYv * 0.16, 0, 0.75) : 0;
      let coverBBase = 0;
      if (inDetail) coverBBase = 0.2 + Math.sin(t * 0.8 + b.phase + 1.7) * 0.02 * idle;

      if (isHov && ptr.seen && state.mode === 'hero') {
        const dxN = (ptr.cx - b.scr.x) / (dims.w * 0.25);
        const dyN = (b.scr.y - ptr.cy) / (dims.h * 0.3);
        s.tiltY.t = clamp(dxN * 0.28, -0.15, 0.15);
        s.tiltX.t = clamp(-dyN * 0.1, -0.09, 0.1);
        s.lift.t = 0.3;
        coverBase = 0;
      } else {
        s.tiltY.t = 0;
        s.tiltX.t = 0;
        s.lift.t = 0;
      }
      s.cover.t = coverBase + fan;
      s.coverB.t = coverBBase + fanB;
      s.sc.t = b.slotScale * (isHov && state.mode === 'hero' ? 1.09 : 1);

      s.px.update(dt);
      if (b.exit) stepY(b, dt);
      else s.py.update(dt);
      s.pz.update(dt);
      s.rx.update(dt);
      s.ry.update(dt);
      s.rz.update(dt);
      s.sc.update(dt);
      s.tiltX.update(dt);
      s.tiltY.update(dt);
      s.lift.update(dt);
      s.cover.update(dt);
      s.coverB.update(dt);
      s.drag.update(dt);

      b.float.position.y = Math.sin(t * 0.7 + b.phase) * 0.035 * idle;
      b.float.rotation.z = Math.sin(t * 0.9 + b.phase * 1.7) * 0.006 * idle;

      b.root.position.set(s.px.v, s.py.v, s.pz.v + s.lift.v);
      const sway = inDetail ? Math.sin(t * 0.45 + b.phase) * 0.035 * idle * (1 - activity) : 0;
      const swing = clamp(-s.px.vel * 0.12, -0.5, 0.5);
      b.root.rotation.set(s.rx.v + s.tiltX.v + b.orbXs.v, s.ry.v + s.tiltY.v + b.orbY + sway + swing, s.rz.v);
      b.root.scale.setScalar(Math.max(s.sc.v, 0.001));

      const ang = Math.max(0, s.cover.v + s.drag.v);
      const angB = Math.max(0, s.coverB.v);
      b.pivot.rotation.y = -ang;
      b.pivot.position.z = PIVOT_Z + ang * 0.022;
      b.backPivot.rotation.y = angB;
      b.backPivot.position.z = BPIVOT_Z - angB * 0.022;
      b.spine.rotation.y = -ang * 0.16 + angB * 0.16;
      b.block.scale.z = 1 - (ang + angB) * 0.05;
      b.block.position.z = BLOCK_Z - ang * 0.006 + angB * 0.006;
      for (let i = 0; i < PAGE_N; i++) {
        const fl = idle * Math.sin(t * 1.15 + b.phase + i * 0.6) * 0.006 * (1 - i / PAGE_N);
        b.pages[i].rotation.y = -(ang * b.pageF[i] + Math.max(0, fl));
      }
      for (let i = 0; i < BACK_PAGE_N; i++) b.pagesB[i].rotation.y = angB * b.pageFB[i];
    }

    let rafId = 0;
    let isInViewport = true;
    let lastFrameTime = 0;
    const frameInterval = 1000 / (effLowPower ? 18 : 30);
    function animate(timestamp = performance.now()) {
      if (cancelled || !isInViewport || document.hidden) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;
      timer.update(timestamp);
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();

      if (ptr.seen && (ptr.type === 'mouse' || ptr.down)) castRay();
      let hov: Book | null = null;
      if (state.mode === 'hero') {
        const kb = state.kbIndex >= 0 ? bookInstances[currentWindow[state.kbIndex]] : null;
        hov = rayBook || state.pillLock || kb || null;
      } else if (state.mode === 'detail') {
        hov = rayBook === state.selected ? rayBook : null;
      }
      state.hovered = hov;
      let cur = 'default';
      if (state.mode === 'hero' && hov) cur = 'pointer';
      else if (state.mode === 'detail' && state.selected) {
        if (orbit.drag) cur = 'grabbing';
        else if (rayBook === state.selected) cur = 'grab';
      }
      canvas.style.cursor = cur;

      bookInstances.forEach((b) => screenPos(b));
      bookInstances.forEach((b) => tickBook(b, dt, t));

      parX.t = RM ? 0 : ptr.ndcX * 0.02;
      parY.t = RM ? 0 : -ptr.ndcY * 0.012;
      bookRoot.rotation.y = parX.update(dt);
      bookRoot.rotation.x = parY.update(dt);

      camera.position.set(camX.update(dt), camY.update(dt), camZ.update(dt));
      camera.lookAt(lookX.update(dt), lookY.update(dt), 0);

      if (state.mode === 'hero' && state.hovered && ptr.seen && !isTouch() && !(ptr.down && ptr.moved > 14)) {
        const tx = ptr.cx;
        const ty = ptr.cy + 34;
        if (!pillOn) {
          pillX.set(tx);
          pillY.set(ty);
        }
        pillX.t = tx;
        pillY.t = ty;
        if (openBtnRef.current) {
          openBtnRef.current.style.left = pillX.update(dt) + 'px';
          openBtnRef.current.style.top = pillY.update(dt) + 'px';
        }
        if (!pillOn) showPill();
      } else {
        hidePill();
      }

      renderer.render(scene, camera);
    }

    function resumeAnimation() {
      if (!rafId && !cancelled && isInViewport && !document.hidden) animate();
    }

    function relayout() {
      const r = root!.getBoundingClientRect();
      dims.w = Math.max(1, Math.round(r.width));
      dims.h = Math.max(1, Math.round(r.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, effLowPower ? 1 : 1.25));
      renderer.setSize(dims.w, dims.h);
      camera.aspect = dims.w / dims.h;
      camera.updateProjectionMatrix();
      computeSlots();
      applyMode();
      camTo(state.mode === 'detail' || state.mode === 'opening' ? 'detail' : 'hero');
    }

    relayout();
    currentWindow.forEach((bi, i) => {
      const b = bookInstances[bi];
      const slot = SLOTS.hero[i];
      const s = b.springs;
      s.px.set(slot.p[0]);
      s.py.set(slot.p[1] - 3.9);
      s.pz.set(slot.p[2]);
      s.rx.set(slot.r[0]);
      s.ry.set(slot.r[1]);
      s.rz.set(slot.r[2] + 0.35 * (i === 1 ? -1 : Math.sign(slot.p[0])));
      s.sc.set(slot.s);
      b.slotScale = slot.s;
      setT(() => setTargets(b, slot), 240 + i * 150);
    });
    bookInstances.forEach((b, idx) => {
      if (!currentWindow.includes(idx)) b.root.visible = false;
    });
    rebuildHitMeshes();
    camTo('hero');
    animate();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) resumeAnimation();
        else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '160px' }
    );
    visibilityObserver.observe(root);

    const onVisibilityChange = () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        resumeAnimation();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const ro = new ResizeObserver(() => relayout());
    ro.observe(root);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      timeouts.forEach((id) => clearTimeout(id));
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      timer.dispose();
      ro.disconnect();
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', cancelPointer as EventListener);
      root.removeEventListener('keydown', onKeydown);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('lostpointercapture', cancelPointer as EventListener);
      closeBtnRef.current?.removeEventListener('click', onCloseClick);

      scene.traverse((obj: THREE.Object3D) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => {
              if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose();
            });
            m.dispose();
          });
        }
      });
      scene.environment?.dispose();
      scene.environment = null;
      renderer.dispose();
    };
  }, [books, showDetailPanel]);

  const themeVars = {
    '--bs-navy': themeColors?.navy ?? '#10243A',
    '--bs-pink': themeColors?.pink ?? '#69C5F5',
    '--bs-cream': themeColors?.cream ?? '#FFFFFF',
    '--bs-lav': themeColors?.lav ?? '#D4DFEB',
    '--bs-peri': themeColors?.peri ?? '#0A6AA1',
    '--bs-bg-light': themeColors?.bgLight ?? themeColors?.bg ?? '#F1F6FB',
    '--bs-bg-dark': themeColors?.bgDark ?? themeColors?.bg ?? '#0D1B2E',
    '--bs-fg-light': themeColors?.foregroundLight ?? '#10243A',
    '--bs-fg-dark': themeColors?.foregroundDark ?? '#F4F8FC',
  } as React.CSSProperties;

  const panelVisible = uiMode === 'detail';
  const heroWordVisible = mounted && uiMode === 'hero';
  const canCarousel = showCarousel && books.length > 3;

  const delayMap: Record<number, string> = {
    50: 'delay-[50ms]',
    130: 'delay-[130ms]',
    210: 'delay-[210ms]',
    270: 'delay-[270ms]',
    330: 'delay-[330ms]',
  };

  const dpChild = (delayMs: number) =>
    panelVisible
      ? `opacity-100 translate-y-0 transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${delayMap[delayMs] || ''}`
      : 'opacity-0 translate-y-[28px] transition-[opacity,transform] duration-[280ms] ease-out';

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-label={`${heroTitle} interactive volume showcase`}
      data-state={uiMode}
      className={cn(
        'book-showcase relative isolate h-[540px] sm:h-[620px] overflow-hidden border border-[#10243A]/15 dark:border-[#F4F8FC]/14 outline-none [container-type:size]',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#69C5F5]',
        'transition-colors duration-500 ease-out',
        uiMode === 'hero'
          ? 'bg-[var(--bs-bg-light)] text-[var(--bs-fg-light)] dark:bg-[var(--bs-bg-dark)] dark:text-[var(--bs-fg-dark)]'
          : 'bg-[var(--bs-navy)] text-[var(--bs-cream)]',
        className
      )}
      style={themeVars}
    >
      {/* Background Watermark Headline */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[16%] z-[1] -translate-x-1/2 select-none transition-all duration-500 ease-out ${
          heroWordVisible ? 'translate-y-0 opacity-15' : 'translate-y-8 opacity-0'
        }`}
      >
        <span className="font-display block whitespace-nowrap uppercase text-current text-[clamp(4rem,20cqw,14rem)] font-bold leading-[0.85] tracking-tight">
          {heroTitle}
        </span>
      </div>

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-[2] block h-full w-full touch-none" />

      {showNav && (
        <div
          aria-hidden={uiMode !== 'hero'}
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 transition-opacity duration-300',
            uiMode === 'hero' ? 'opacity-100' : 'opacity-0'
          )}
        >
          <p className="font-mono-tabular text-xs uppercase tracking-widest text-brand dark:text-[#69C5F5]">
            {navTitle}
          </p>
          <p className="hidden sm:block font-mono-tabular text-[11px] text-[#465C72] dark:text-[#B5C5D7]">
            Click any 3D volume to inspect contents index
          </p>
        </div>
      )}

      {canCarousel && (
        <>
          <button
            type="button"
            aria-label="Previous volumes"
            onClick={() => shiftCarouselRef.current(-1)}
            className={`absolute left-3 top-1/2 z-30 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center border border-[#10243A]/20 bg-[#FFFFFF]/90 text-[#10243A] shadow-lg transition-all duration-200 hover:border-brand cursor-pointer ${
              uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next volumes"
            onClick={() => shiftCarouselRef.current(1)}
            className={`absolute right-3 top-1/2 z-30 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center border border-[#10243A]/20 bg-[#FFFFFF]/90 text-[#10243A] shadow-lg transition-all duration-200 hover:border-brand cursor-pointer ${
              uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Trailing Cursor Badge */}
      <button
        ref={openBtnRef}
        tabIndex={-1}
        aria-hidden="true"
        className={
          'absolute left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2 px-4 py-2 ' +
          'text-xs font-mono-tabular font-bold uppercase tracking-widest text-on-brand bg-brand shadow-xl pointer-events-none ' +
          'transition-[opacity,transform] duration-200 will-change-[left,top,opacity,transform] ' +
          OPEN_BTN_OFF.join(' ')
        }
      >
        Open Volume
      </button>

      {/* Close Volume Detail Control */}
      <button
        ref={closeBtnRef}
        type="button"
        aria-hidden={uiMode !== 'detail'}
        tabIndex={uiMode === 'detail' ? 0 : -1}
        aria-label="Close volume inspection"
        className={`absolute right-5 top-5 z-40 inline-flex h-11 px-4 items-center justify-center gap-2 border border-[#F4F8FC]/35 bg-[#07111F]/90 text-xs font-mono-tabular uppercase tracking-wider text-[#F4F8FC] transition-opacity duration-300 hover:border-[#69C5F5] hover:text-[#69C5F5] cursor-pointer ${
          uiMode === 'detail' ? 'visible pointer-events-auto opacity-100' : 'invisible pointer-events-none opacity-0'
        }`}
      >
        Close ✕
      </button>

      {/* Bottom Accessible Volume Selector Bar */}
      {books.length > 0 && uiMode === 'hero' && (
        <div className="absolute inset-x-0 bottom-4 z-30 flex flex-wrap items-center justify-center gap-1.5 px-4">
          {books.map((bk, idx) => (
            <button
              key={bk.id}
              type="button"
              onClick={() => openBookIndexRef.current(idx)}
              className="min-h-[34px] px-3 py-1 text-[11px] font-mono-tabular bg-[#FFFFFF]/92 dark:bg-[#07111F]/92 text-[#10243A] dark:text-[#F4F8FC] border border-[#10243A]/20 dark:border-[#F4F8FC]/22 hover:border-brand hover:text-brand dark:hover:border-[#69C5F5] dark:hover:text-[#69C5F5] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              0{idx + 1} · {bk.title}
            </button>
          ))}
        </div>
      )}

      {/* Selected Book Detail Overlay */}
      {showDetailPanel && (
        <div
          ref={dpRef}
          aria-live="polite"
          className={`absolute right-[6%] top-1/2 z-[15] w-[min(520px,46%)] -translate-y-1/2 pointer-events-none @max-[760px]:right-auto @max-[760px]:left-1/2 @max-[760px]:top-auto @max-[760px]:bottom-[5%] @max-[760px]:w-[92cqw] @max-[760px]:-translate-x-1/2 @max-[760px]:translate-y-0 ${
            panelVisible ? 'visible' : 'invisible delay-[400ms]'
          }`}
        >
          <p className={`font-mono-tabular text-xs uppercase tracking-widest text-[var(--bs-pink)] mb-2 ${dpChild(50)}`}>
            {selectedCfg?.categoryLabel ?? 'Berry Alloys Compendium'} · {selectedCfg?.year}
          </p>
          <h2 className={`font-display m-0 uppercase text-[#F4F8FC] text-[clamp(32px,4cqw,56px)] font-bold leading-[0.98] ${dpChild(50)}`}>
            {selectedCfg?.title}
          </h2>
          <p className={`mt-4 max-w-[54ch] text-[#D4DFEB] text-sm sm:text-base leading-relaxed @max-[760px]:line-clamp-3 ${dpChild(130)}`}>
            {selectedCfg?.desc}
          </p>
          <div className={`mt-5 pt-4 border-t border-[#F4F8FC]/16 text-xs font-mono-tabular text-[#B5C5D7] flex flex-wrap items-center justify-between gap-2 ${dpChild(210)}`}>
            <span>Author / Scope: {selectedCfg?.author}</span>
            <span className="text-[#69C5F5]">CIN {selectedCfg?.year === 'FY 2019–2026' ? 'U27310WB2006PLC145016' : 'Published Record'}</span>
          </div>

          <div className={`pointer-events-auto mt-6 flex flex-wrap items-center gap-3 ${dpChild(330)}`}>
            {selectedCfg && (
              <>
                <button
                  type="button"
                  onClick={() => onPrimaryAction?.(selectedCfg)}
                  className="inline-flex min-h-[44px] items-center gap-2 bg-[#0A6AA1] px-5 py-2.5 text-xs font-semibold text-[#F4F8FC] hover:bg-[#004C73] hover:text-[#F4F8FC] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {selectedCfg.primaryActionLabel ?? 'Open Reference'}
                </button>
                <button
                  type="button"
                  onClick={() => onSecondaryAction?.(selectedCfg)}
                  className="inline-flex min-h-[44px] items-center gap-2 border border-[#F4F8FC]/30 bg-[#0D1B2E] px-5 py-2.5 text-xs font-semibold text-[#F4F8FC] hover:border-[#69C5F5] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {selectedCfg.secondaryActionLabel ?? 'Request Quote'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksShowcase;
