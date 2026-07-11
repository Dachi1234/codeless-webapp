"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { RoleIcon, TEAM_ACCENTS } from "./roleIcons";
import { TeamEnergyField } from "./TeamEnergyField";

export type TeamMember = {
  name: string;
  role: string;
  desc: string;
};

// Elliptical orbit radii as a fraction of the container (x wider than y for a
// tilted, top-down perspective).
const RADIUS_X = 36;
const RADIUS_Y = 30;
const CENTER = 50;

export function TeamOrbit({ members, center }: { members: TeamMember[]; center: string }) {
  const total = members.length;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const dotRefs = useRef<Array<Array<HTMLSpanElement | null>>>([]);

  const activeRef = useRef<number | null>(null);
  activeRef.current = activeIndex;
  const enteredRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (visible) enteredRef.current = true;
      },
      { threshold: 0.15 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Single rAF drives orbit rotation, depth sorting and energy flow. Writes
  // directly to the DOM so there are no per-frame React renders.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let rotation = 0;
    let assemble = 0;
    let running = true;

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;

      const active = activeRef.current;
      if (active === null && enteredRef.current) rotation += delta * 0.14;
      if (enteredRef.current) assemble = Math.min(1, assemble + delta * 0.9);
      const eased = 1 - Math.pow(1 - assemble, 3);

      for (let i = 0; i < total; i += 1) {
        const node = nodeRefs.current[i];
        if (!node) continue;

        const base = -Math.PI / 2 + (Math.PI * 2 * i) / total;
        const angle = base + rotation;
        const depth = (Math.sin(angle) + 1) / 2; // 0 = back/top, 1 = front/bottom

        const x = CENTER + Math.cos(angle) * RADIUS_X * eased;
        const y = CENTER + Math.sin(angle) * RADIUS_Y * eased;

        const isActive = active === i;
        const dimmed = active !== null && !isActive;

        const scale = isActive ? 1.18 : 0.72 + depth * 0.34;
        const opacity = isActive ? 1 : dimmed ? 0.22 : 0.5 + depth * 0.5;
        const blur = isActive ? 0 : dimmed ? 2.5 : (1 - depth) * 1.6;
        const z = isActive ? 400 : Math.round(depth * 100) + 10;

        node.style.left = `${x}%`;
        node.style.top = `${y}%`;
        node.style.transform = `translate(-50%, -50%) scale(${(scale * (0.4 + eased * 0.6)).toFixed(3)})`;
        node.style.opacity = (opacity * eased).toFixed(3);
        node.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        node.style.zIndex = String(z);

        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute("x2", x.toFixed(2));
          line.setAttribute("y2", y.toFixed(2));
          line.style.opacity = (
            (isActive ? 0.9 : dimmed ? 0.12 : 0.3 + depth * 0.35) * eased
          ).toFixed(3);
        }

        const dots = dotRefs.current[i];
        if (dots) {
          for (let j = 0; j < dots.length; j += 1) {
            const dot = dots[j];
            if (!dot) continue;
            // Flow from the teammate inward to the PM core (they report to you).
            const frac = (now / 1000) * 0.35 + i * 0.2 + j * 0.5;
            const t = frac - Math.floor(frac);
            const dx = x + (CENTER - x) * t;
            const dy = y + (CENTER - y) * t;
            dot.style.left = `${dx}%`;
            dot.style.top = `${dy}%`;
            dot.style.opacity = ((isActive ? 1 : dimmed ? 0 : 0.55) * (1 - t) * eased).toFixed(3);
          }
        }
      }

      if (running) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [total]);

  const focusRef = useRef(0);
  focusRef.current = activeIndex !== null ? 1 : 0;

  return (
    <div
      ref={rootRef}
      className="relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-navy-950/40 shadow-card"
      onMouseLeave={() => setActiveIndex(null)}
    >
      {/* WebGL energy field */}
      <div aria-hidden className="absolute inset-0">
        <TeamEnergyField focusRef={focusRef} active={inView} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,61,0.12),transparent_45%)]"
      />

      {/* Energy channels + flow dots */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {members.map((member, index) => (
          <line
            key={`line-${member.name}-${member.role}`}
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

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {members.map((member, index) => {
          dotRefs.current[index] = dotRefs.current[index] ?? [];
          return [0, 1].map((j) => (
            <span
              key={`dot-${member.name}-${j}`}
              ref={(node) => {
                dotRefs.current[index]![j] = node;
              }}
              className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: TEAM_ACCENTS[index % TEAM_ACCENTS.length],
                boxShadow: `0 0 8px ${TEAM_ACCENTS[index % TEAM_ACCENTS.length]}`,
                opacity: 0,
              }}
            />
          ));
        })}
      </div>

      {/* PM core hub */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-[200] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-orange/30 [animation-duration:3s]" />
          <span className="absolute inset-2 animate-ping rounded-full border border-orange/20 [animation-duration:3s] [animation-delay:0.8s]" />
          <span className="absolute inset-0 rounded-full bg-orange/10 blur-xl" />
          <div className="relative flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-full border border-orange/50 bg-navy-950/90 shadow-glow">
            <Mascot glow className="h-8 w-auto" />
            <span className="px-2 text-center text-[11px] font-bold leading-tight text-ink">
              {center}
            </span>
          </div>
        </div>
      </div>

      {/* Orbiting role nodes */}
      {members.map((member, index) => {
        const accent = TEAM_ACCENTS[index % TEAM_ACCENTS.length];
        const active = activeIndex === index;
        return (
          <button
            key={`${member.name}-${member.role}`}
            ref={(node) => {
              nodeRefs.current[index] = node;
            }}
            type="button"
            aria-pressed={active}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            onClick={() => setActiveIndex(active ? null : index)}
            style={{ left: "50%", top: "50%", opacity: 0 }}
            className={`group absolute w-44 rounded-2xl border p-3 text-left backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
              active
                ? "border-orange/60 bg-navy-950/95 shadow-glow"
                : "border-white/10 bg-navy-950/80 hover:border-white/25"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  color: accent,
                  borderColor: `${accent}55`,
                  backgroundColor: `${accent}1a`,
                }}
              >
                <RoleIcon index={index} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">{member.name}</span>
                <span className="block text-xs font-semibold" style={{ color: accent }}>
                  {member.role}
                </span>
              </span>
            </span>
            <span
              className={`grid text-xs leading-relaxed text-muted transition-all duration-300 ${
                active ? "mt-2.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <span className="overflow-hidden">{member.desc}</span>
            </span>
          </button>
        );
      })}

      {/* Hint */}
      <span className="pointer-events-none absolute bottom-4 left-1/2 z-[300] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
        Hover a teammate
      </span>
    </div>
  );
}
