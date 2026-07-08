"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uResolution;
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

  float glow(vec2 p, vec2 c, float r) {
    float d = length(p - c);
    return smoothstep(r, 0.0, d);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    // Deep navy vertical base gradient.
    vec3 top = vec3(0.118, 0.173, 0.302);
    vec3 bottom = vec3(0.043, 0.070, 0.129);
    vec3 col = mix(bottom, top, smoothstep(-0.1, 0.9, uv.y));

    float t = uTime * 0.05;
    float scroll = uScroll;

    // Two slow-moving orange blooms; they drift down as you scroll.
    vec3 orange = vec3(1.0, 0.42, 0.24);
    vec2 c1 = vec2(0.32 * aspect * sin(t * 1.1) + 0.05, 0.28 - scroll * 0.6);
    vec2 c2 = vec2(-0.30 * aspect * cos(t * 0.8) - 0.05, -0.34 + scroll * 0.5);

    float g1 = glow(p, c1, 0.75) * (0.55 + 0.25 * sin(t * 2.0));
    float g2 = glow(p, c2, 0.6) * (0.4 + 0.2 * cos(t * 1.7));

    col += orange * g1 * 0.28;
    col += orange * g2 * 0.18;

    // Subtle flowing noise haze.
    float n = noise(uv * 3.0 + vec2(t, -t));
    col += orange * 0.04 * n * smoothstep(0.0, 0.6, uv.y);

    // Fine film grain.
    float grain = noise(uv * uResolution.xy * 0.5 + uTime) - 0.5;
    col += grain * 0.025;

    // Vignette.
    float vig = smoothstep(1.25, 0.35, length(p));
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

export function ShaderBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  const uniforms = useRef({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(size.width * viewport.dpr, size.height * viewport.dpr),
    },
  });

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    scrollTarget.current = window.scrollY / maxScroll;
    // Ease toward the target for a fluid feel.
    scrollCurrent.current +=
      (scrollTarget.current - scrollCurrent.current) * Math.min(1, delta * 4);

    uniforms.current.uTime.value += delta;
    uniforms.current.uScroll.value = scrollCurrent.current;
    uniforms.current.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr,
    );
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
