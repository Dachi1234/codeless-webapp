"use client";

import { useCallback, useRef, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { useScrollProgress } from "@/lib/motion/useScrollProgress";
import { RoleIcon, TEAM_ACCENTS } from "./roleIcons";
import { TeamEnergyField } from "./TeamEnergyField";
import type { TeamMember } from "./TeamOrbit";

/**
 * `lite`-tier (touch / mobile) experience for "Living Orbit".
 *
 * The desktop orbit relies on hover + a wide ellipse, neither of which suits a
 * narrow touch screen. Here a `position: sticky` stage keeps the PM hub and the
 * (cheap) WebGL energy field centered while vertical scroll spotlights one role
 * at a time, each connected to the hub with an accent channel.
 */
export function TeamImmersiveMobile({
  members,
  center,
}: {
  members: TeamMember[];
  center: string;
}) {
  const total = members.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const focusRef = useRef(1);

  const onFrame = useCallback(
    (progress: number) => {
      const next = Math.min(total - 1, Math.floor(progress * total));
      setActiveIndex((current) => (current === next ? current : next));
    },
    [total],
  );

  const { setContainerRef, inView } = useScrollProgress({ onFrame });
  const accent = TEAM_ACCENTS[activeIndex % TEAM_ACCENTS.length]!;

  return (
    <div
      ref={(node) => setContainerRef(node)}
      className="relative"
      style={{ height: `${(total + 0.5) * 85}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* WebGL energy field */}
        <div aria-hidden className="absolute inset-0">
          <TeamEnergyField focusRef={focusRef} active={inView} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(255,107,61,0.14),transparent_50%)]"
        />

        {/* PM core hub */}
        <div className="relative z-20 flex flex-col items-center pt-24">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full border border-orange/30 [animation-duration:3s]" />
            <span className="absolute inset-0 rounded-full bg-orange/10 blur-xl" />
            <div className="relative flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border border-orange/50 bg-navy-950/90 shadow-glow">
              <Mascot glow className="h-7 w-auto" />
              <span className="px-2 text-center text-[10px] font-bold leading-tight text-ink">
                {center}
              </span>
            </div>
          </div>
        </div>

        {/* accent connector between hub and card */}
        <div className="relative z-10 flex flex-1 items-stretch justify-center">
          <span
            aria-hidden
            className="w-px animate-pulse transition-colors duration-500"
            style={{
              background: `linear-gradient(to bottom, ${accent}00, ${accent}, ${accent}00)`,
            }}
          />
        </div>

        {/* spotlighted role card (one at a time) */}
        <div className="relative z-20 px-6 pb-16">
          <div className="relative mx-auto min-h-[9.5rem] max-w-sm">
            {members.map((member, index) => {
              const memberAccent = TEAM_ACCENTS[index % TEAM_ACCENTS.length]!;
              const active = index === activeIndex;
              return (
                <div
                  key={`${member.name}-${member.role}`}
                  aria-hidden={!active}
                  className={`absolute inset-x-0 rounded-2xl border bg-navy-950/85 p-4 backdrop-blur-md transition-all duration-500 ${
                    active
                      ? "translate-y-0 opacity-100 shadow-glow"
                      : "pointer-events-none translate-y-4 opacity-0"
                  }`}
                  style={{ borderColor: active ? `${memberAccent}66` : "rgba(255,255,255,0.1)" }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        color: memberAccent,
                        borderColor: `${memberAccent}55`,
                        backgroundColor: `${memberAccent}1a`,
                      }}
                    >
                      <RoleIcon index={index} className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-base font-bold text-ink">
                        {member.name}
                      </span>
                      <span className="block text-sm font-semibold" style={{ color: memberAccent }}>
                        {member.role}
                      </span>
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-muted">
                      {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{member.desc}</p>
                </div>
              );
            })}
          </div>

          {/* role dots */}
          <div className="mt-5 flex items-center justify-center gap-2" aria-hidden>
            {members.map((member, index) => (
              <span
                key={`dot-${member.name}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: index === activeIndex ? 24 : 6,
                  backgroundColor:
                    index === activeIndex
                      ? TEAM_ACCENTS[index % TEAM_ACCENTS.length]
                      : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
