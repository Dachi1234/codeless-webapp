"use client";

import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uProgress;   // 0..1 across the whole section
  uniform float uStages;     // number of stages (e.g. 3)
  uniform vec2  uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    float t = uTime * 0.05;

    // Base navy gradient.
    vec3 top = vec3(0.118, 0.173, 0.302);
    vec3 bottom = vec3(0.043, 0.070, 0.129);
    vec3 col = mix(bottom, top, smoothstep(-0.1, 0.9, uv.y));

    // Per-stage transition pulse (peaks halfway between stages).
    float stageF = uProgress * max(uStages - 1.0, 1.0);
    float frac = fract(stageF);
    float transition = smoothstep(0.32, 0.5, frac) * smoothstep(0.68, 0.5, frac);

    // Central seam; widens a touch during transitions.
    float seam = 0.5;
    float gap = 0.004 + transition * 0.028;
    float rightMask = smoothstep(seam - gap, seam + gap, uv.x);
    float leftMask = 1.0 - rightMask;

    vec3 orange = vec3(1.0, 0.42, 0.24);

    // RIGHT: drifting orange bloom that rises as you progress.
    vec2 c1 = vec2(0.22 * aspect * sin(t * 1.1), 0.12 - uProgress * 0.18);
    float g1 = smoothstep(0.72, 0.0, length(p - c1)) * (0.55 + 0.25 * sin(t * 2.0));
    col += orange * g1 * 0.4 * rightMask;

    // RIGHT: procedural floating particles.
    float particles = 0.0;
    for (int i = 0; i < 14; i++) {
      float fi = float(i);
      float seed = hash(vec2(fi, 3.0));
      vec2 pos = vec2(
        0.55 + 0.42 * hash(vec2(fi, 1.0)),
        fract(hash(vec2(fi, 2.0)) + uTime * (0.02 + seed * 0.05))
      );
      float d = length((uv - pos) * vec2(aspect, 1.0));
      particles += smoothstep(0.012, 0.0, d) * (0.5 + 0.5 * sin(uTime * 2.0 + fi));
    }
    col += orange * particles * 0.6 * rightMask;

    // LEFT: cold desaturated wash.
    vec3 cold = vec3(0.55, 0.62, 0.72);
    col += cold * 0.035 * leftMask;

    // LEFT: horizontal glitch scan bands that flare during transitions.
    float band = step(0.62, fract(uv.y * 22.0 + floor(uTime * 8.0) * 0.35));
    float glitch = transition * leftMask * band;
    col.r += glitch * 0.10;
    col.b += glitch * 0.06;

    // Seam glow line.
    float line = smoothstep(gap + 0.006, 0.0, abs(uv.x - seam));
    col += orange * line * (0.35 + 0.4 * transition);

    // Grain + vignette.
    float grain = noise(uv * uResolution.xy * 0.5 + uTime) - 0.5;
    col += grain * 0.02;
    float vig = smoothstep(1.3, 0.35, length(p));
    col *= mix(0.82, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

function SplitMaterial({
  progressRef,
  stages,
}: {
  progressRef: MutableRefObject<number>;
  stages: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uStages: { value: stages },
    uResolution: {
      value: new THREE.Vector2(size.width * viewport.dpr, size.height * viewport.dpr),
    },
  });

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    uniforms.current.uTime.value += delta;
    // Ease the progress a little for a fluid feel without coupling to scroll libs.
    const target = progressRef.current;
    uniforms.current.uProgress.value +=
      (target - uniforms.current.uProgress.value) * Math.min(1, delta * 8);
    uniforms.current.uResolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export function CompareSplitScene({
  progressRef,
  stages,
  active,
}: {
  progressRef: MutableRefObject<number>;
  stages: number;
  active: boolean;
}) {
  return (
    <Canvas
      aria-hidden
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1], fov: 50 }}
      frameloop={active ? "always" : "never"}
    >
      <SplitMaterial progressRef={progressRef} stages={stages} />
    </Canvas>
  );
}
