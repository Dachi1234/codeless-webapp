# The Build — from idea to launch

**Section:** `#how` ·
[`apps/web/src/components/sections/HowItWorks.tsx`](../../apps/web/src/components/sections/HowItWorks.tsx)

A horizontal, scroll-scrubbed journey through the five phases of a real product
cycle. Each phase is a **distinct, believable, animated product artifact** — you
watch one coherent sample app (a delivery-style app) get built and shipped.

| # | Phase | Artifact | Motion when active |
| --- | --- | --- | --- |
| 01 | Idea | Brainstorm board: central "Product idea" card (mascot) + sticky notes | notes pop/rotate in, lightbulb pulse |
| 02 | Requirements | A **BRD** doc: "v1.2 · APPROVED / SIGNED OFF", user stories with P0/P1/P2 tags | rows reveal, checkboxes tick |
| 03 | Design | A **Figma-style canvas**: Layers panel, colored app mockup, Styles/swatches + type scale | artboard builds wireframe→color |
| 04 | Development | A **kanban** (To do / In progress / Done) + terminal `pnpm build` | card lands in Done, build → `✓ built in 4.2s · tests passed` |
| 05 | Launch | A **live browser** (`🔒 codeless.ge`, "DEPLOYED · LIVE") + the finished app + analytics | deploy toast, "Active users" counts up, chart grows |

## Behavior by tier

| Tier | Experience |
| --- | --- |
| `full` | Pinned viewport; a horizontal **filmstrip** of the five panels scrubs via GSAP `ScrollTrigger` (`xPercent`, `end: (n-1)*100%`). A sticky **pipeline stepper** (01→05, connector fills to the active step) sits below the nav. The centered panel's artifact triggers its internal animation via an `active` prop. |
| `lite` | [`HowItWorksImmersiveMobile`](../../apps/web/src/components/how/HowItWorksImmersiveMobile.tsx) — a `position: sticky` stage where **vertical** scroll advances the five artifacts one at a time (horizontal pinning is awkward on touch). Same `StageVisual` artifacts + a compact pipeline stepper; driven by `useScrollProgress`, no canvas, lazy-loaded (`ssr:false`). |
| `static` | The same five artifacts stacked vertically (`active`), each paired with its number/title/description — believable visuals, no pinning. |

## Why it was rebuilt

The old section reused **one** abstract browser-wireframe that only grew in
fidelity, so every step looked the same and nothing read as a real phase. The
rebuild gives each phase its own artifact. We chose **hand-built, branded
DOM/SVG artifacts over stock illustrations** — they read as real product tools,
stay on-brand, and are crisp at any size. A single coherent sample app threads
through Design → Launch so the build feels continuous.

## Structure

- [`StageVisual.tsx`](../../apps/web/src/components/how/StageVisual.tsx) — the
  five artifacts (`IdeaBoard`, `RequirementsDoc`, `DesignCanvas`, `DevBoard`,
  `LaunchScreen`) plus shared `AppScreen` (the sample app, wire→live), a small
  `CountUp`, and the framed per-stage wrapper. All internal motion is CSS
  transitions keyed off `active` (one rAF counter for the launch metric).
- `Pipeline` (in the section) — the stepper, offset `top-16` to clear the fixed
  nav (see [motion-system.md](../motion-system.md) → nav offset).
- [`HowItWorksImmersiveMobile.tsx`](../../apps/web/src/components/how/HowItWorksImmersiveMobile.tsx)
  — the `lite`-tier sticky stage (reuses `StageVisual` + a compact stepper).
- Copy: `how.steps` in `messages/en.json` / `ka.json`.

> Removed in this pass: `ProductMock.tsx` and `HowItWorksVertical.tsx` (replaced
> by `StageVisual` on both the immersive and fallback paths).

## Customizing

The threaded sample app is a delivery-style screen; swap the labels/blocks in
`AppScreen` and the story copy to re-theme it. Artifacts are self-contained, so
phases can be added/reordered by editing `how.steps` and the `switch` in
`StageVisual`.
