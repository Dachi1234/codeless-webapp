# Motion system

Every immersive section is built on a few shared primitives (mostly in
[`apps/web/src/lib/motion`](../apps/web/src/lib/motion)). They exist so the
"wow" experiences degrade cleanly instead of shipping a broken canvas to a
phone or a reduced-motion user.

## 1. Tiers — `useMotionTier()`

[`useMotionTier.ts`](../apps/web/src/lib/motion/useMotionTier.ts) classifies the
client into one of three tiers:

| Tier | Who gets it | What it ships |
| --- | --- | --- |
| `static` | `prefers-reduced-motion`, Save-Data, or no WebGL | Plain, fully accessible DOM. No canvas, no scroll effects. |
| `lite` | touch / narrow (`≤768px`) / low-power (`≤4GB` **and** `≤4` cores) | Touch-native experiences: horizontal **swipe carousels** for storytelling sections and a compact WebGL orbit for the team. Capped DPR, canvas paused off-screen. |
| `full` | desktop with a capable GPU | The heavyweight pinned/scrubbed experiences (GSAP, R3F orbit). |

Notes:

- **SSR-safe:** returns `static` on the server and until the client can measure,
  so first paint is always the safe fallback (no hydration mismatch, no canvas
  flash).
- Re-evaluates on `matchMedia` changes (reduced-motion, breakpoint, pointer),
  so rotating a tablet or toggling OS motion settings re-tiers live.
- Capability signals: `prefers-reduced-motion`, `connection.saveData`, WebGL
  context probe, `(pointer: coarse)`, `(max-width: 768px)`, `deviceMemory`,
  `hardwareConcurrency`.

```tsx
const tier = useMotionTier();
if (tier === "static") return <Fallback />;
if (tier === "lite") return <MobileImmersive />;
return <DesktopImmersive />;
```

## 2. Swipe carousel — `SwipeCarousel`

[`components/shared/SwipeCarousel.tsx`](../apps/web/src/components/shared/SwipeCarousel.tsx)
is the `lite`-tier storytelling primitive: a **native horizontal swipe carousel**
(CSS `scroll-snap` + real finger momentum, no scroll hijacking). The snapped
panel index is derived from `scrollLeft` and passed to the header, footer and
each panel so steppers, dots and per-panel animations can react.

- `count` + `renderPanel(index, active)` — one full-width snap panel each.
- `renderHeader(active)` / `renderFooter(active)` — e.g. a pipeline stepper or
  the shared `CarouselDots`.
- Used by the `lite` **Compare** and **How It Works** sections.

## 3. GSAP helpers — `gsap.ts`

[`gsap.ts`](../apps/web/src/lib/motion/gsap.ts) centralizes GSAP +
ScrollTrigger registration (`ensureScrollTrigger()`) and
`refreshScrollTriggers()`, so the `full`-tier sections (Compare, How It Works)
share one registration path and consistent refresh behavior. Each section wraps
its timeline in a `gsap.context()` and reverts it on cleanup to survive
navigation and HMR.

## 4. Pointer tilt — `usePointerTilt()`

[`usePointerTilt.ts`](../apps/web/src/lib/motion/usePointerTilt.ts) maps cursor
position over an element to a 3D `rotateX/rotateY`, used by the Outcomes CV card.
Disabled on mobile / reduced-motion by the caller.

## Fixed-nav offset gotcha

The site header is `fixed top-0 z-50 h-16`. Any pinned full-screen stage sits at
`top: 0` and therefore _under_ the nav. Sticky in-stage headers (the Compare
title bar, the How-It-Works pipeline) must offset by the nav height (`top-16`)
and the content padded below them — otherwise they render behind the nav once
the section pins.
