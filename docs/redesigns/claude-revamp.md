# Claude-design revamp — content + interactions, on brand

This pass adopted the content, sections and scroll interactions from the
"Claude design" prototype (`claude-design/WebGL design review request/`) **without
changing the existing branding, colors, fonts, logo or mascot**. It also fixed a
set of layout/behaviour bugs found during QA and reworked the mobile experience
so the immersive sections render the same way they do on desktop (matching the
prototype) instead of degrading to simplified variants.

See also: [`../motion-system.md`](../motion-system.md) for the `static` / `lite` /
`full` motion-tier model these sections build on.

## Section changes

| Section | What changed |
| --- | --- |
| **Hero** (`sections/Hero.tsx`) | New headline + strikethrough line and a stats row driven by the updated content model. |
| **Problem** (`sections/Problem.tsx`) | Chat schema switched from `time` → `role`; 5 role-colored avatars. |
| **Compare — the shredder** (`compare/CompareShredder.tsx`) | Canvas paper-shred: the `typical_syllabus.pdf` sheet feeds through a shredder bar and bursts into confetti as you scroll, then the "here's what's left" outcomes reveal. Uses CSS `position: sticky` + `ScrollTrigger` progress (not GSAP `pin`) so it plays nicely with the Lenis smooth-scroll wrapper. |
| **How it works** (`sections/HowItWorks.tsx`) | Dual-track 6-node rail + "you leave with" pills. Single responsive component (2-col on mobile → 6-col on desktop). |
| **Team — the relay** (`team/TeamRelay.tsx`) | SVG "snake" thread with 5 handoff nodes (Analyst → Designer → Developer → QA → You·PM). The thread draws, a token rides it, and each node lights up as scroll progresses. |
| **Register** (`sections/Register.tsx`) | Rewritten as the prototype's minimal card: glowing radial-gradient panel, heading + subtitle, single email field + "Apply now". |

## Key fixes made this pass

### 1. Corrupted `.next` / vendor-chunk error
`Cannot find module './vendor-chunks/framer-motion@…js'` was caused by running a
production `build` and the `dev` server against the same `apps/web/.next`
directory concurrently. Fix: stop both, delete `apps/web/.next`, restart `dev`.
Rule of thumb: never run `build` and `dev` on the same app at the same time.

### 2. Team relay "snake" dimensions (desktop)
The thread was distorted because it had been crammed into a small centered
`aspect-[1000/820] max-h-[62vh] max-w-2xl` box. Rewrote it to match the prototype:
the SVG stage **fills the sticky viewport** (`absolute inset-x-0 …`), the SVG uses
`preserveAspectRatio="none"`, and nodes are placed by percentage — so the thread
and nodes stay aligned at any size. Also added a narrow-viewport path swap
(gentler near-vertical snake) that recomputes on resize.

### 3. Team relay final "You · PM" node getting clipped
The thread ran almost to the very bottom of the stage, so the last node's card was
cut off. Raised the stage's bottom edge (`bottom-[13vh]`) and trimmed the top
offset so the final node has room for its card.

### 4. Registration = the prototype's minimal design
Replaced the multi-field lead form with an email-only card. It still writes to the
`Lead` table via the `registerLead` server action; the non-null `name` column is
satisfied by deriving a value from the email's local part (no schema migration).
The spam honeypot, success and error states are preserved.

### 5. Mobile: immersive sections match the prototype
Previously mobile swapped to simplified variants via the motion-tier system. Now
the `lite` (mobile/touch) tier renders the **real** experiences, like the
prototype:

- **Compare** — the full canvas shredder runs on mobile.
- **Team** — the real snake renders on mobile, using the near-vertical path with
  cards centered under each node.

The `static` tier (reduced-motion / no-WebGL / save-data) still gets the
accessible fallbacks (`CompareShredderStatic`, `TeamRelayStatic`).

### 6. Mobile relay card polish
On the narrow snake the cards were overlapping and mis-sized. Fixed by:

- **Single-card expansion** — only the *current* node's description expands;
  passed nodes collapse to a name-only pill (no overlapping stack).
- **Explicit card width** (`w-[min(230px,66vw)]`) — cards had only `max-width`
  inside a zero-width node anchor, so they collapsed to the longest word.
- **Last-node card opens upward** (`bottom-6` instead of `top-6`) so the "You·PM"
  description isn't clipped at the viewport bottom.

## Files touched

**Modified**
- `apps/web/messages/en.json`, `apps/web/messages/ka.json` — all new copy + Georgian translations
- `apps/web/tailwind.config.ts` — `paper` color token for the shredded sheet
- `apps/web/src/app/[locale]/page.tsx` — section order
- `apps/web/src/components/motion/Reveal.tsx` — accept a `style` prop
- `apps/web/src/components/sections/{Hero,Problem,HowItWorks,Compare,Team,Register}.tsx`

**New**
- `apps/web/src/components/compare/CompareShredder.tsx` — full/lite/static shredder
- `apps/web/src/components/team/TeamRelay.tsx` — full SVG+GSAP relay (desktop + mobile snake)
- `apps/web/src/components/team/TeamRelayMobile.tsx` — vertical-rail variants
- `apps/web/src/components/team/relayShared.ts` — shared node data
- `apps/web/src/components/sections/Curriculum.tsx` — built, currently not mounted in the page

## Follow-ups / notes

- **Dead code:** `CompareShredderLite` (in `CompareShredder.tsx`) and
  `TeamRelayMobile.tsx` are no longer used now that mobile runs the full
  experiences; kept in place but safe to delete. `Curriculum.tsx` exists but was
  removed from the page — can be remounted if wanted.
- `claude-design/` (the prototype reference, incl. a PDF) is intentionally **not**
  committed — it's design input, not shipped code.
- Verify with `pnpm --filter @codeless/web typecheck` and a single `dev` server
  (avoid running `build` concurrently).
