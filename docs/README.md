# CodeLess — engineering docs

Reference notes for the hardening pass and the immersive front-end redesign of
the public site (`apps/web`). Operational setup (env, deploy, migration
baseline, Vercel Firewall) lives in the root [`README.md`](../README.md); these
docs explain the _why_ and _how_ behind the code.

## Contents

| Doc | What it covers |
| --- | --- |
| [`hardening.md`](./hardening.md) | Security & reliability fixes: Prisma migration history, honeypot handling, IP rate limiting + Vercel Firewall, CSV formula-injection defense, hardening tests |
| [`motion-system.md`](./motion-system.md) | The progressive-enhancement motion tiers (`static` / `lite` / `full`), the scroll-progress hook, and the shared GSAP/ScrollTrigger helpers that every immersive section builds on |
| [`redesigns/compare-the-split.md`](./redesigns/compare-the-split.md) | "The Split" — the Others-vs-CodeLess diptych |
| [`redesigns/team-living-orbit.md`](./redesigns/team-living-orbit.md) | "Living Orbit" — the R3F team orbit around a PM hub |
| [`redesigns/how-it-works-the-build.md`](./redesigns/how-it-works-the-build.md) | "The Build" — the idea→launch horizontal filmstrip |
| [`redesigns/outcomes-the-payoff.md`](./redesigns/outcomes-the-payoff.md) | "The Payoff" — kinetic headline, counters, tilting CV card |

## Design principles shared across the redesigns

1. **Tier before flourish.** Every immersive section renders through
   [`useMotionTier()`](../apps/web/src/lib/motion/useMotionTier.ts). The heavy
   pinned/WebGL experience is the `full` branch; `lite` and `static` always have
   real, accessible fallbacks. Nothing depends on the animation running.
2. **DOM text stays real.** All copy is selectable DOM over the canvas, for
   readability, SEO and screen readers. WebGL is decoration (`aria-hidden`).
3. **No scroll hijacking.** Progress is driven by native scroll — GSAP
   `ScrollTrigger` pin+scrub on desktop, `position: sticky` +
   [`useScrollProgress`](../apps/web/src/lib/motion/useScrollProgress.ts) on
   touch — so the scrollbar and momentum always behave normally.
4. **Idle when off-screen.** rAF loops and WebGL canvases pause when their
   section leaves the viewport (IntersectionObserver).

## Verifying the whole thing

```bash
pnpm install
pnpm typecheck          # tsc across the workspace
pnpm lint               # next lint
pnpm test:hardening     # node:test — honeypot, CSV, migration presence
pnpm dev:web            # http://localhost:3000
```
