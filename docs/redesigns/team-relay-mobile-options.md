# Team relay — mobile visual options

## Problem

The desktop Team section is a **pinned, scroll-scrubbed SVG "snake"** (`TeamRelay`).
Ported to mobile it keeps breaking, because a pinned scroll-scrub is inherently
fragile on phones:

- The snake needs **horizontal room** for its S-curves *and* **vertical room** for
  node spacing — those fight each other on a narrow, tall screen.
- Pinning depends on viewport height. Mobile browsers have a **dynamic address /
  toolbar**, so `100vh` (`h-screen`) refers to the *large* viewport behind the
  toolbar; the pinned stage ends up taller than what's visible and its lower
  content (PM node, token) gets pushed off-screen.
- `svh` fixes the height math but the **pin + scrub pattern itself** (plus Lenis
  smooth-scroll) is the real weak link, so it still feels/looks "all over the
  place" on real devices (tested: Samsung A55, iPhone 14 Pro Max).

**Direction:** keep the snake on **desktop** (`full` tier) and swap the **mobile**
(`lite` tier) to a phone-native visual. This fits the existing motion-tier system
(`static` / `lite` / `full` — see [`../motion-system.md`](../motion-system.md)),
so only the mobile branch changes.

## Options (best-fit first)

### 1. Vertical timeline / stepper — recommended
Straight vertical line down the side; each role is a full-width card stacked
top→bottom (Analyst → Designer → Developer → QA → You·PM). The line fills orange as
you scroll and cards reveal in. (Essentially the pre-snake `TeamRelayMobile`,
polished.)

- **Pros:** rock-solid (no pinning, no `vh` tricks); every card fully readable;
  natural scrolling; keeps the relay/handoff story + brand; cheap.
- **Cons:** less "wow" than the animated snake; familiar pattern.

### 2. Swipe card deck — strong alternative
Horizontal swipe carousel of role cards with a small relay progress bar / connected
dots underneath (reuses the existing `SwipeCarousel`). One big role card at a time.

- **Pros:** native, interactive touch feel; one focused card at a time; no
  vertical-space problems; on-brand.
- **Cons:** users must swipe to see all roles (less at-a-glance).

### 3. Tap-to-expand list — lightweight
Compact vertical list of the 5 roles; tap one to expand its description (matches the
existing "tap a role to see what they do" hint). Small connecting line down the side.

- **Pros:** very compact, robust, accessible, minimal motion.
- **Cons:** least visually rich; static until tapped.

### 4. Keep the snake on mobile (if desired) — more finicky
- **JS-measured pin height:** set the sticky container height to the real
  `window.innerHeight` (updated on resize) instead of any CSS `vh` unit. Bulletproof
  for mobile toolbars, but adds JS and can flicker as the toolbar shows/hides.
- **Non-pinned scroll-through snake:** render the snake as a tall, un-pinned SVG you
  scroll past, thread drawing via IntersectionObserver. Keeps the look, drops the
  fragile pin — but a tall narrow snake still leaves awkward side gaps and cramped
  cards.

## Recommendation

Use the **vertical timeline** (Option 1) for mobile — most reliable and readable,
still tells the handoff story on brand. If more interactivity is wanted, the **swipe
card deck** (Option 2) is the fun pick. Both keep the full desktop snake untouched.
