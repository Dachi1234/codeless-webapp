"use client";

import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uFocus;      // 0..1, rises when a role is focused
  uniform vec2  uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float r = length(p);

    vec3 orange = vec3(1.0, 0.42, 0.24);
    vec3 col = vec3(0.0);

    // Central energy core.
    float pulse = 0.5 + 0.28 * sin(uTime * 1.6);
    float core = smoothstep(0.42, 0.0, r);
    col += orange * pow(core, 1.8) * (pulse + uFocus * 0.6);

    // Slowly rotating soft rays radiating from the core.
    float ang = atan(p.y, p.x);
    float rays = 0.5 + 0.5 * sin(ang * 6.0 + uTime * 0.5);
    col += orange * rays * smoothstep(0.75, 0.05, r) * (0.10 + uFocus * 0.10);

    // Expanding energy rings.
    float ring = sin(r * 20.0 - uTime * 1.8);
    col += orange * smoothstep(0.85, 0.0, r) * max(ring, 0.0) * 0.05;

    // Faint drifting sparks.
    float sparks = 0.0;
    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      vec2 pos = vec2(
        (hash(vec2(fi, 1.0)) - 0.5) * 1.6 * aspect,
        (fract(hash(vec2(fi, 2.0)) + uTime * (0.03 + hash(vec2(fi, 5.0)) * 0.05)) - 0.5) * 1.4
      );
      sparks += smoothstep(0.02, 0.0, length(p - pos));
    }
    col += orange * sparks * 0.5;

    float alpha = smoothstep(1.0, 0.08, r);
    gl_FragColor = vec4(col, alpha * 0.95);
  }
`;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

function EnergyMaterial({ focusRef }: { focusRef: MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useRef({
    uTime: { value: 0 },
    uFocus: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(size.width * viewport.dpr, size.height * viewport.dpr),
    },
  });

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    uniforms.current.uTime.value += delta;
    uniforms.current.uFocus.value +=
      (focusRef.current - uniforms.current.uFocus.value) * Math.min(1, delta * 6);
    uniforms.current.uResolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export function TeamEnergyField({
  focusRef,
  active,
}: {
  focusRef: MutableRefObject<number>;
  active: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1], fov: 50 }}
      frameloop={active ? "always" : "never"}
    >
      <EnergyMaterial focusRef={focusRef} />
    </Canvas>
  );
}
