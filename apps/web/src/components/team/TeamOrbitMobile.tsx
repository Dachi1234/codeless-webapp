"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { RoleIcon, TEAM_ACCENTS } from "./roleIcons";
import { TeamEnergyField } from "./TeamEnergyField";
import type { TeamMember } from "./TeamOrbit";

const RADIUS_X = 34;
const RADIUS_Y = 24;
const CENTER = 50;

const baseAngle = (i: number, total: number) => -Math.PI / 2 + (Math.PI * 2 * i) / total;

/**
 * `lite`-tier (touch) experience for "Living Orbit" — a compact take on the
 * desktop orbit. Role icons orbit the PM hub over the WebGL energy field; it
 * auto-rotates as a showcase and the front-most role's details show below. Tap
 * a role to spin it to the front and lock focus (tap again to resume).
 */
export function TeamOrbitMobile({ members, center }: { members: TeamMember[]; center: string }) {
  const total = members.length;
  const [displayIndex, setDisplayIndex] = useState(0);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);

  const rotationRef = useRef(0);
  const targetRef = useRef(0);
  const lockedRef = useRef<number | null>(null);
  const enteredRef = useRef(false);
  const focusRef = useRef(0.4);

  const focusRole = (i: number) => {
    if (lockedRef.current === i) {
      lockedRef.current = null;
      setLockedIndex(null);
      return;
    }
    lockedRef.current = i;
    setLockedIndex(i);
    setDisplayIndex(i);
    // Rotate so role i lands at the front (bottom), taking the nearest turn.
    let target = Math.PI / 2 - baseAngle(i, total);
    while (target - rotationRef.current > Math.PI) target -= Math.PI * 2;
    while (target - rotationRef.current < -Math.PI) target += Math.PI * 2;
    targetRef.current = target;
  };

  useEffect(() => {
    focusRef.current = lockedIndex !== null ? 1 : 0.45;
  }, [lockedIndex]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) enteredRef.current = true;
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let running = true;

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (enteredRef.current) {
        if (lockedRef.current !== null) {
          rotationRef.current += (targetRef.current - rotationRef.current) * Math.min(1, delta * 5);
        } else {
          rotationRef.current += delta * 0.32;
        }
      }
      const rotation = rotationRef.current;

      let frontIndex = 0;
      let frontDepth = -1;
      for (let i = 0; i < total; i += 1) {
        const angle = baseAngle(i, total) + rotation;
        const depth = (Math.sin(angle) + 1) / 2; // 1 = front/bottom
        if (depth > frontDepth) {
          frontDepth = depth;
          frontIndex = i;
        }

        const x = CENTER + Math.cos(angle) * RADIUS_X;
        const y = CENTER + Math.sin(angle) * RADIUS_Y;
        const focused = lockedRef.current === i;
        const scale = (focused ? 1.15 : 0.66 + depth * 0.4).toFixed(3);
        const opacity = (0.4 + depth * 0.6).toFixed(3);

        const node = nodeRefs.current[i];
        if (node) {
          node.style.left = `${x}%`;
          node.style.top = `${y}%`;
          node.style.transform = `translate(-50%, -50%) scale(${scale})`;
          node.style.opacity = opacity;
          node.style.zIndex = String(Math.round(depth * 100) + (focused ? 200 : 0));
        }

        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute("x2", x.toFixed(2));
          line.setAttribute("y2", y.toFixed(2));
          line.style.opacity = (focused ? 0.9 : 0.2 + depth * 0.4).toFixed(3);
        }
      }

      const next = lockedRef.current !== null ? lockedRef.current : frontIndex;
      setDisplayIndex((current) => (current === next ? current : next));

      if (running) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [total]);

  const activeMember = members[displayIndex]!;
  const activeAccent = TEAM_ACCENTS[displayIndex % TEAM_ACCENTS.length]!;

  return (
    <div className="mx-auto max-w-md">
      <div
        ref={rootRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-navy-950/40 shadow-card"
      >
        {/* WebGL energy field */}
        <div aria-hidden className="absolute inset-0">
          <TeamEnergyField focusRef={focusRef} active={inView} />
        </div>

        {/* connectors */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {members.map((member, index) => (
            <line
              key={`line-${member.role}`}
              ref={(node) => {
                lineRefs.current[index] = node;
              }}
              x1={CENTER}
              y1={CENTER}
              x2={CENTER}
              y2={CENTER}
              stroke={TEAM_ACCENTS[index % TEAM_ACCENTS.length]}
              strokeWidth={0.35}
              vectorEffect="non-scaling-stroke"
              style={{ opacity: 0 }}
            />
          ))}
        </svg>

        {/* PM hub */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[150] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full border border-orange/30 [animation-duration:3s]" />
            <span className="absolute inset-0 rounded-full bg-orange/10 blur-lg" />
            <div className="relative flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-full border border-orange/50 bg-navy-950/90 shadow-glow">
              <Mascot glow className="h-5 w-auto" />
              <span className="px-1 text-center text-[8px] font-bold leading-tight text-ink">
                {center}
              </span>
            </div>
          </div>
        </div>

        {/* orbiting role icons */}
        {members.map((member, index) => {
          const accent = TEAM_ACCENTS[index % TEAM_ACCENTS.length]!;
          const focused = lockedIndex === index;
          return (
            <button
              key={`${member.name}-${member.role}`}
              ref={(node) => {
                nodeRefs.current[index] = node;
              }}
              type="button"
              aria-pressed={focused}
              aria-label={`${member.name}, ${member.role}`}
              onClick={() => focusRole(index)}
              style={{ left: "50%", top: "50%", color: accent }}
              className="absolute flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            >
              <span
                className="absolute inset-0 rounded-2xl border transition-opacity duration-300"
                style={{
                  borderColor: `${accent}66`,
                  backgroundColor: `${accent}1f`,
                  boxShadow: focused ? `0 0 20px ${accent}80` : "none",
                }}
              />
              <RoleIcon index={index} className="relative h-6 w-6" />
            </button>
          );
        })}
      </div>

      {/* details for the focused / front role */}
      <div className="relative mt-5 min-h-[6.5rem]">
        {members.map((member, index) => {
          const accent = TEAM_ACCENTS[index % TEAM_ACCENTS.length]!;
          const active = index === displayIndex;
          return (
            <div
              key={`detail-${member.role}`}
              aria-hidden={!active}
              className={`absolute inset-x-0 rounded-2xl border bg-navy-950/70 p-4 backdrop-blur-md transition-all duration-400 ${
                active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
              }`}
              style={{ borderColor: active ? `${accent}55` : "rgba(255,255,255,0.1)" }}
            >
              <p className="text-base font-bold text-ink">
                {member.name}{" "}
                <span className="font-normal" style={{ color: accent }}>
                  · {member.role}
                </span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{member.desc}</p>
            </div>
          );
        })}
      </div>

      {/* dots */}
      <div className="mt-4 flex items-center justify-center gap-2" aria-hidden>
        {members.map((member, index) => (
          <button
            key={`dot-${member.role}`}
            type="button"
            aria-label={`Focus ${member.role}`}
            onClick={() => focusRole(index)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: index === displayIndex ? 22 : 6,
              backgroundColor: index === displayIndex ? activeAccent : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
        Tap a teammate
      </p>
    </div>
  );
}
