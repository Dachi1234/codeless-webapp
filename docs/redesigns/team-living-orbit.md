# Living Orbit — the AI team

**Section:** `#team` ·
[`apps/web/src/components/sections/Team.tsx`](../../apps/web/src/components/sections/Team.tsx)

The learner sits at the center as the PM; the five AI roles (Analyst, Designer,
Developer, QA, Stakeholder) orbit around a central **"PM experience" hub**,
connected by animated energy channels over a WebGL backdrop.

## Behavior by tier

| Tier | Experience |
| --- | --- |
| `full` | [`TeamOrbit`](../../apps/web/src/components/team/TeamOrbit.tsx) — a 2.5D elliptical orbit. Role cards are positioned every frame (rAF) with depth-based scale, opacity, blur and z-index for real perspective; animated SVG connectors link each role to the hub; hover/focus pulls a card forward and lights its channel; the orbit assembles on scroll-in. Behind it, [`TeamEnergyField`](../../apps/web/src/components/team/TeamEnergyField.tsx) renders a pulsing core, rotating rays and drifting sparks. Lazy-loaded (`next/dynamic`, `ssr:false`) with a skeleton. |
| `lite` | [`TeamImmersiveMobile`](../../apps/web/src/components/team/TeamImmersiveMobile.tsx) — a `position: sticky` stage that keeps the PM hub and the (cheap) `TeamEnergyField` centered while vertical scroll **spotlights one role at a time**, each connected to the hub with an accent channel. Touch-friendly (scroll, not hover); driven by `useScrollProgress`; lazy-loaded (`ssr:false`). |
| `static` | `TeamSpine` — a clean vertical timeline: the PM hub at the top, each role as a color-dotted node with name/role/description. |

## Why it was rebuilt

The previous version used abstract 3D geometric shapes and a geometric center
that didn't read as "a team." The rebuild makes every node **meaningful**:

- Abstract shapes → **role-specific icons** with a consistent accent palette
  ([`roleIcons.tsx`](../../apps/web/src/components/team/roleIcons.tsx):
  `TEAM_ACCENTS` + `RoleIcon` for Analyst / Designer / Developer / QA /
  Stakeholder). `Team.tsx` and the orbit share the same `TEAM_ACCENTS` so colors
  never drift.
- A real **PM hub** at the center (the bracket-face mascot + label), later
  enlarged for presence, with contents scaled proportionally.
- The "wow": depth-sorted 2.5D motion + energy-field backdrop + live connectors,
  instead of static geometry.

## Notes

- The orbit background is intentionally semi-transparent so the global WebGL
  backdrop shows through slightly. During dev, stale ScrollTrigger/HMR state from
  the adjacent pinned section can momentarily bleed through — a hard reload
  clears it; it is not a production layout bug.
- The `full` orbit ([`TeamOrbit.tsx`](../../apps/web/src/components/team/TeamOrbit.tsx))
  and the `lite` stage ([`TeamImmersiveMobile.tsx`](../../apps/web/src/components/team/TeamImmersiveMobile.tsx))
  share `TEAM_ACCENTS`, `RoleIcon` and `TeamEnergyField`.
- Members/copy: `team.members` + `team.center` in `messages/en.json` / `ka.json`.
- The canvas is `aria-hidden`; the `TeamSpine` fallback carries the full,
  readable team content for assistive tech and low-power devices.
