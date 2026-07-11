"use client";

import { useEffect, useState } from "react";

/**
 * Progressive-enhancement tiers shared by every immersive section.
 *
 * - `static` — reduced motion, save-data, or no WebGL. Ships the plain,
 *   accessible fallback (no canvas, no scroll effects).
 * - `lite`   — touch / mobile / lower-power devices. WebGL is allowed but must
 *   stay cheap: native sticky + scroll progress, capped DPR, canvas paused
 *   while off-screen.
 * - `full`   — desktop with a capable GPU. The heavyweight pinned/scrubbed
 *   experiences (GSAP, R3F orbit) run here.
 */
export type MotionTier = "static" | "lite" | "full";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function computeTier(): MotionTier {
  if (typeof window === "undefined") return "static";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return "static";
  if (!hasWebGL()) return "static";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;

  // Phones/tablets get the lightweight WebGL path. So do underpowered laptops.
  if (coarse || narrow) return "lite";
  if (lowMemory && lowCores) return "lite";

  return "full";
}

export function useMotionTier(): MotionTier {
  // SSR-safe default: render the static fallback until the client can measure.
  const [tier, setTier] = useState<MotionTier>("static");

  useEffect(() => {
    const update = () => setTier(computeTier());
    update();

    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(max-width: 768px)"),
      window.matchMedia("(pointer: coarse)"),
    ];
    queries.forEach((mql) => mql.addEventListener("change", update));
    return () => queries.forEach((mql) => mql.removeEventListener("change", update));
  }, []);

  return tier;
}
