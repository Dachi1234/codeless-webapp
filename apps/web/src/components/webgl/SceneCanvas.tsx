"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Suspense } from "react";
import { ShaderBackground } from "./ShaderBackground";
import { usePrefersReducedMotion, useIsMobile } from "@/lib/useMediaQuery";

/**
 * Fixed full-viewport WebGL backdrop that lives behind all DOM content.
 * Falls back to a pure-CSS radial gradient when the user prefers reduced
 * motion (and uses a lighter configuration on mobile).
 */
export function SceneCanvas() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-radial-navy"
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 1], fov: 50 }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <ShaderBackground />
          <Sparkles
            count={isMobile ? 40 : 90}
            scale={[8, 6, 2]}
            size={2.2}
            speed={0.35}
            opacity={0.5}
            color="#FF8A5C"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
