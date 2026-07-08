"use client";

import dynamic from "next/dynamic";

// Load the three.js scene only on the client, in its own chunk, so it never
// blocks first paint or runs during SSR.
const SceneCanvas = dynamic(
  () => import("./SceneCanvas").then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-radial-navy" />
    ),
  },
);

export function Background() {
  return <SceneCanvas />;
}
