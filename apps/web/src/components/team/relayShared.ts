export type RelayRole = { name: string; desc: string };

/**
 * Each handoff node: position along the thread (0..1), which side the card sits
 * on (desktop), and its brand accent. Shared by the full/lite/static variants so
 * the heavy GSAP `TeamRelay` module isn't pulled into the lighter tiers.
 */
export const RELAY_NODES = [
  { at: 0.06, side: "r" as const, accent: "#FF6B3D" },
  { at: 0.3, side: "l" as const, accent: "#FF7A45" },
  { at: 0.5, side: "r" as const, accent: "#5B8DEF" },
  { at: 0.72, side: "l" as const, accent: "#3DDC84" },
  { at: 0.94, side: "r" as const, accent: "#F4F6FB" },
];
