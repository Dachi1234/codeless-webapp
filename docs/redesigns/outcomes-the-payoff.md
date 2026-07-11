# The Payoff — outcomes

**Section:** `#outcomes` ·
[`apps/web/src/components/sections/Outcomes.tsx`](../../apps/web/src/components/sections/Outcomes.tsx)

The closing argument: an oversized kinetic headline, animated outcome counters,
and a cursor-tilting 3D "portfolio / CV" card — what the learner walks away with.

## Pieces

- **Kinetic headline.** The title is split into words and revealed on scroll
  (`framer-motion`, staggered rise + de-blur). The last four words use the
  brand gradient (`.text-gradient`) for emphasis.
- **Counters.**
  [`OutcomeCounters`](../../apps/web/src/components/outcomes/OutcomeCounters.tsx)
  count up when scrolled into view (e.g. weeks, products shipped, AI teammates).
  Copy: `outcomes.stats`.
- **Portfolio / CV card.**
  [`PortfolioTiltCard`](../../apps/web/src/components/outcomes/PortfolioTiltCard.tsx)
  is a 3D card that tilts toward the cursor
  ([`usePointerTilt`](../../apps/web/src/lib/motion/usePointerTilt.ts)), framing
  the shipped product as a real résumé line. Copy: `outcomes.portfolio` +
  the point titles as highlights.
- **Numbered points.** `outcomes.points` slide in beside the counters.

## Accessibility / fallbacks

This section gates on `usePrefersReducedMotion()` and `useIsMobile()` (it is
lightweight enough not to need the full WebGL tier system):

- **Reduced motion:** word/point animations are skipped (rendered in their final
  state) and the tilt is disabled — everything is present and readable.
- **Mobile:** the pointer tilt is disabled (no hover), the card renders flat.

Copy for the whole section lives under `outcomes.*` in `messages/en.json` and
`ka.json`.
