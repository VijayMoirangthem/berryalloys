import { ScrollTrigger } from 'gsap/ScrollTrigger';

export type LoaderStatus = 'pending' | 'ready' | 'skipped' | 'recovered';

export interface CanvasTelemetryEntry {
  id: string;
  label: string;
  mode: 'webgl' | '2d-canvas' | 'css-fallback' | 'paused' | 'unmounted';
  status: 'active' | 'context-lost' | 'restored' | 'deferred' | 'failed';
  width: number;
  height: number;
  dpr: number;
  frames: number;
  renderer?: string;
}

export interface RuntimeErrorEntry {
  at: string;
  source: string;
  message: string;
}

export type MotionInitValue =
  | 'idle'
  | 'active'
  | 'skipped'
  | 'reduced-motion'
  | 'skipped-desktop'
  | 'skipped-reduced-motion'
  | 'webgl-ready'
  | 'canvas-2d'
  | 'webgl-context-lost'
  | 'fallback-dom'
  | string;

export interface MotionInitStatuses {
  industrialReveals: MotionInitValue;
  mobileCountups: MotionInitValue;
  heroGsap: MotionInitValue;
  directorPortrait: MotionInitValue;
  heroParticles: MotionInitValue;
  interactiveBook: MotionInitValue;
  manufacturingStory: MotionInitValue;
}

export interface CanvasTelemetryPatch extends Partial<CanvasTelemetryEntry> {
  backend?: 'webgl' | 'canvas-2d' | 'fallback-css' | 'fallback-2d' | 'paused' | 'unmounted';
  contextLost?: boolean;
}

export interface MotionDiagnosticsSnapshot {
  loaderStatus: LoaderStatus;
  loaderReason: string;
  motionInit: MotionInitStatuses;
  canvases: Record<string, CanvasTelemetryEntry>;
  errors: RuntimeErrorEntry[];
  webglCapable: boolean | null;
  webglRenderer: string;
}

const MAX_ERRORS = 12;

const state: MotionDiagnosticsSnapshot = {
  loaderStatus: 'pending',
  loaderReason: 'Initializing',
  motionInit: {
    industrialReveals: 'idle',
    mobileCountups: 'idle',
    heroGsap: 'idle',
    directorPortrait: 'idle',
    heroParticles: 'idle',
    interactiveBook: 'idle',
    manufacturingStory: 'idle',
  },
  canvases: {},
  errors: [],
  webglCapable: null,
  webglRenderer: '',
};

const listeners = new Set<() => void>();
const loaderWaiters = new Set<(status: LoaderStatus) => void>();
const heroRippleWaiters = new Set<() => void>();
let heroRippleFiredAt = 0;
let errorHooksInstalled = false;

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore subscriber errors
    }
  });
}

function formatErrorMessage(messageOrErr: unknown): string {
  if (messageOrErr instanceof Error) {
    return messageOrErr.message || messageOrErr.name || 'Error';
  }
  if (typeof messageOrErr === 'string') {
    return messageOrErr;
  }
  try {
    return JSON.stringify(messageOrErr);
  } catch {
    return String(messageOrErr || 'Unknown error');
  }
}

export function installRuntimeErrorCapture() {
  if (errorHooksInstalled || typeof window === 'undefined') return;
  errorHooksInstalled = true;

  window.addEventListener('error', (event) => {
    recordRuntimeError('error', event.error || event.message || 'Unknown script error');
  });
  window.addEventListener('unhandledrejection', (event) => {
    recordRuntimeError('unhandledrejection', event.reason ?? 'Unhandled promise rejection');
  });
}

export function recordRuntimeError(source: string, messageOrErr: unknown) {
  const clean = formatErrorMessage(messageOrErr).slice(0, 180) || 'Unknown error';
  state.errors = [
    { at: new Date().toISOString().slice(11, 19), source, message: clean },
    ...state.errors,
  ].slice(0, MAX_ERRORS);
  notify();
}

export function setLoaderState(status: LoaderStatus, reason: string) {
  if (state.loaderStatus === status && state.loaderReason === reason) return;
  state.loaderStatus = status;
  state.loaderReason = reason;
  if (status !== 'pending') {
    loaderWaiters.forEach((cb) => {
      try {
        cb(status);
      } catch {
        // ignore
      }
    });
    loaderWaiters.clear();
  }
  notify();
}

export function isLoaderCleared(): boolean {
  if (state.loaderStatus !== 'pending') return true;
  if (typeof document === 'undefined') return true;
  return !document.querySelector('[data-berry-splash="active"]');
}

export function onLoaderCleared(cb: (status: LoaderStatus) => void): () => void {
  if (isLoaderCleared()) {
    cb(state.loaderStatus === 'pending' ? 'ready' : state.loaderStatus);
    return () => undefined;
  }
  loaderWaiters.add(cb);
  return () => {
    loaderWaiters.delete(cb);
  };
}

export function triggerHeroEntranceRipple() {
  heroRippleFiredAt = performance.now();
  heroRippleWaiters.forEach((cb) => {
    try {
      cb();
    } catch {
      // ignore
    }
  });
}

export function onHeroEntranceRipple(cb: () => void): () => void {
  heroRippleWaiters.add(cb);
  // If fired within the last 250ms before the hero listener attached, replay immediately.
  if (heroRippleFiredAt > 0 && performance.now() - heroRippleFiredAt < 250) {
    cb();
  }
  return () => {
    heroRippleWaiters.delete(cb);
  };
}

export function setMotionInitStatus<K extends keyof MotionInitStatuses>(
  key: K,
  value: MotionInitStatuses[K]
) {
  if (state.motionInit[key] === value) return;
  state.motionInit[key] = value;
  notify();
}

export function reportWebGLInfo(capable: boolean, renderer = '') {
  state.webglCapable = capable;
  if (renderer) state.webglRenderer = renderer;
  notify();
}

function normalizeCanvasMode(
  backend?: CanvasTelemetryPatch['backend'],
  explicitMode?: CanvasTelemetryEntry['mode'],
  fallbackMode?: CanvasTelemetryEntry['mode']
): CanvasTelemetryEntry['mode'] {
  if (explicitMode) return explicitMode;
  if (backend === 'canvas-2d') return '2d-canvas';
  if (backend === 'fallback-css' || backend === 'fallback-2d') return 'css-fallback';
  if (backend === 'webgl') return 'webgl';
  if (backend === 'paused') return 'paused';
  if (backend === 'unmounted') return 'unmounted';
  return fallbackMode ?? 'webgl';
}

function normalizeCanvasStatus(
  contextLost?: boolean,
  explicitStatus?: CanvasTelemetryEntry['status'],
  fallbackStatus?: CanvasTelemetryEntry['status']
): CanvasTelemetryEntry['status'] {
  if (explicitStatus) return explicitStatus;
  if (contextLost === true) return 'context-lost';
  if (contextLost === false) return 'active';
  return fallbackStatus ?? 'active';
}

export function upsertCanvasTelemetry(
  idOrEntry: string | (CanvasTelemetryPatch & { id: string }),
  patchArg?: CanvasTelemetryPatch
) {
  const id = typeof idOrEntry === 'string' ? idOrEntry : idOrEntry.id;
  const patch: CanvasTelemetryPatch =
    typeof idOrEntry === 'string' ? patchArg ?? {} : idOrEntry;

  const prev = state.canvases[id];
  const dprDefault =
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  state.canvases[id] = {
    id,
    label: patch.label ?? prev?.label ?? id,
    mode: normalizeCanvasMode(patch.backend, patch.mode, prev?.mode),
    status: normalizeCanvasStatus(patch.contextLost, patch.status, prev?.status),
    width: patch.width ?? prev?.width ?? 0,
    height: patch.height ?? prev?.height ?? 0,
    dpr: patch.dpr ?? prev?.dpr ?? dprDefault,
    frames: patch.frames ?? prev?.frames ?? 0,
    renderer: patch.renderer ?? prev?.renderer,
  };
  notify();
}

export function incrementCanvasFrame(id: string) {
  const entry = state.canvases[id];
  if (!entry) return;
  entry.frames += 1;
}

export function getDiagnosticsSnapshot(): MotionDiagnosticsSnapshot {
  return {
    loaderStatus: state.loaderStatus,
    loaderReason: state.loaderReason,
    motionInit: { ...state.motionInit },
    canvases: { ...state.canvases },
    errors: [...state.errors],
    webglCapable: state.webglCapable,
    webglRenderer: state.webglRenderer,
  };
}

export function subscribeDiagnostics(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getActiveScrollTriggerCount(): number {
  try {
    return ScrollTrigger.getAll().length;
  } catch {
    return 0;
  }
}

export function probeWebGLAvailability(): { available: boolean; renderer: string } {
  if (state.webglCapable !== null) {
    return { available: state.webglCapable, renderer: state.webglRenderer };
  }
  try {
    const c = document.createElement('canvas');
    const gl =
      (c.getContext('webgl2') as WebGL2RenderingContext | null) ||
      (c.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) {
      state.webglCapable = false;
      return { available: false, renderer: 'unavailable' };
    }
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : 'WebGL standard';
    state.webglCapable = true;
    state.webglRenderer = renderer;
    return { available: true, renderer };
  } catch {
    state.webglCapable = false;
    return { available: false, renderer: 'error' };
  }
}
