# The Split — Others vs CodeLess

**Section:** `#compare` ·
[`apps/web/src/components/sections/Compare.tsx`](../../apps/web/src/components/sections/Compare.tsx)

A full-bleed diptych: a cold, grayscale "PM courses" half on the left and a warm,
orange "CodeLess" half on the right, separated by a glowing seam. The two sides
tell the same 3-stage story in opposite tones (learn theory → work on a real
product, pass a test → fail/fix/improve, get a certificate → ship it live).

## Behavior by tier

| Tier | Experience |
| --- | --- |
| `full` | Pinned, scroll-scrubbed **cross-fade** between chapters. GSAP `ScrollTrigger` pins the stage for ~one viewport per transition; visuals + copy rise/de-blur into place. |
| `lite` | [`CompareImmersiveMobile`](../../apps/web/src/components/compare/CompareImmersiveMobile.tsx) — a native horizontal **swipe carousel** ([`SwipeCarousel`](../../apps/web/src/components/shared/SwipeCarousel.tsx)): one course-vs-CodeLess diptych per screen, swipe through the story. DOM-only (no canvas), lazy-loaded (`ssr:false`). |
| `static` | `CompareFallback` — the same panels stacked as a plain, readable two-column list. |

## Why it was rebuilt

The first attempt hijacked scrolling (GSAP `Observer` + custom pause/resume
events). That produced the reported bugs: the scrollbar vanished, each stage
needed two scrolls, and cut-off text flashed before animating. The rebuild:

- Replaced hijacking with a standard **pin + `scrub: 0.6`** timeline — native
  scroll, visible scrollbar, one continuous gesture.
- **Cross-fades whole chapters** (`autoAlpha` tied to scroll) so a stage is
  never shown in a static half-state before it animates — killing the
  "cut-off text then it moves" glitch.
- Split desktop vs. mobile via `useMotionTier` instead of forcing one
  code path onto every device.
- Fixed Georgian readability with fluid `clamp()` type and generous
  `max-width`, and set `lang` on the section.

> The custom `codeless:scroll-pause/-resume` events were removed from
> `SmoothScroll.tsx` when the hijacking was dropped.

## Structure

- `StoryPanel` — one side of one chapter (eyebrow + progress rail, illustration
  with tone treatment, `NN / NN` counter, heading, caption). `data-compare-*`
  hooks let the timeline target visuals/copy. `compact` variant powers the
  fallback.
- `ProgressRail` — the per-stage pips (warm/cold).
- Assets: hand-built SVGs in
  [`apps/web/public/compare`](../../apps/web/public/compare) (`COURSE_ASSETS` /
  `CODELESS_ASSETS` in [`shared.ts`](../../apps/web/src/components/compare/shared.ts)).
- Copy: `compare.stages` in `messages/en.json` + `ka.json`.

## Accessibility

- Off-stage chapters are `aria-hidden`; a visually-hidden `<h2>` labels the
  section; an `aria-live` badge announces the current stage.
- The seam, particles and glow are decorative (`aria-hidden`); all text is real
  DOM.
