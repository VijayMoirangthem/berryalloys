# Berry Alloys — motion plan

One industrial story: **heat → forming → precision → dispatch → world.** Motion works at three levels and
never all at once.

| Level | Purpose | Tooling | Where |
| --- | --- | --- | --- |
| Ambient | Subtle life in a few scenes | CSS keyframes, SVG SMIL, Three.js loop | hero glow, globe rotation + route flow + pulses, logistics vehicles, gallery drift |
| Scroll storytelling | Reveal content in reading order, once | GSAP + ScrollTrigger | section eyebrows (red hairline), headings, card grids (`useIndustrialReveals`), manufacturing story, director portrait |
| Direct feedback | Respond to the visitor | Motion (`motion/react`), CSS transitions | alloy selection, Compass replies, gallery lift/outline, lightbox transitions, buttons |

## Moments

| Moment | Implementation |
| --- | --- |
| Particle hero formation | Three.js instanced particles. Entrance converges from scatter over 1.5 s (wall-clock). Pointer scatter, `touch-action: pan-y`. Colours are shader uniforms that follow the theme. |
| Heading / image reveals | `useIndustrialReveals` (GSAP, `once`), existing `ScrollReveal`, `ImageReveal`, `SplitText`. |
| Alloy selection | Existing `AnimatePresence` transitions in `HomeAlloyShowcase`. |
| Manufacturing stage changes | Existing pinned GSAP timeline on desktop, unpinned vertical story on phones. |
| Logistics diagram | `LogisticsJourney`: SVG, truck on the land path only, ship on the sea path only, stage discs light up in sequence. |
| Globe | three-globe: slow auto-rotation, route dash flow, location pulses, camera tween to a selected location. |
| Gallery | Orbital ring with drag inertia and settle, hover lift; swipe strip on touch; lightbox slide transitions. |
| Compass | 150–220 ms message transitions, 6–10 px rise, 450–900 ms preparation pacing (interface pacing only). |
| Footer / closing | Existing restrained ASCII footer canvas. |

## Rules

- `prefers-reduced-motion` is honoured from first render. Reveals are skipped, the globe jumps instead of
  sweeping, vehicles are drawn at fixed positions, Compass answers immediately.
- **Pause ambient motion** (footer, logistics and gallery controls; persisted) stops decorative loops only.
  Interaction feedback is unaffected.
- Offscreen scenes and hidden tabs pause (IntersectionObserver + `visibilitychange`). Observers read the most
  recent entry, because queued entries arrive oldest-first.
- Everything disposes on unmount. Content is visible in the DOM before any animation runs.
- Mobile keeps every effect; cost is reduced by simplifying (pixel ratio, particle step, no desktop pinning).

## Third-party patterns used

- React Bits: text-reveal pattern (`ScrollReveal`, existing).
- Aceternity globe: `three-globe` core and hex-polygon styling, adapted to plain Three.js (see `GlobeScene.tsx`).
- Vengeance UI: logo slider, stacked logos, flip text (existing).
