"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { ensureScrollTrigger, refreshScrollTriggers } from "@/lib/motion/gsap";
import { RELAY_NODES, type RelayRole } from "./relayShared";

const PATH_D =
  "M 500 30 C 840 120, 840 250, 500 320 C 160 390, 160 520, 500 590 C 820 650, 820 760, 500 800";
// Gentler, near-vertical snake on narrow viewports. Equal-height segments (so the
// nodes, placed by path length, land at roughly even vertical intervals) and a
// smaller x-swing (so length tracks vertical distance). Ends at y≈730/820 to leave
// room below the last node for its card.
const PATH_D_NARROW =
  "M 500 40 C 600 100, 600 210, 500 270 C 400 330, 400 440, 500 500 C 600 560, 600 670, 500 730";

function segment(p: number): number {
  if (p < 0.06) return 0;
  if (p < 0.3) return 1;
  if (p < 0.5) return 2;
  if (p < 0.72) return 3;
  if (p < 0.94) return 4;
  return 5;
}

export function TeamRelay({
  label,
  title,
  hint,
  roles,
  stages,
}: {
  label: string;
  title: string;
  hint: string;
  roles: RelayRole[];
  stages: string[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<SVGPathElement>(null);
  const fgRef = useRef<SVGPathElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);
  const lenRef = useRef(0);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const descRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pathD, setPathD] = useState(PATH_D);
  const [narrow, setNarrow] = useState(false);
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);

  // On narrow viewports use the gentler near-vertical snake and stack cards under
  // each node (matches the Claude prototype's mobile relay).
  useEffect(() => {
    const pick = () => {
      const isNarrow = window.innerWidth < 900;
      setNarrow(isNarrow);
      setPathD(isNarrow ? PATH_D_NARROW : PATH_D);
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  // Measure the path so nodes can be placed along it. Re-runs when the path swaps.
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const len = fg.getTotalLength();
    lenRef.current = len;
    fg.style.strokeDasharray = `${len}`;
    fg.style.strokeDashoffset = `${len}`;
    setPositions(
      RELAY_NODES.map((node) => {
        const pt = fg.getPointAtLength(len * node.at);
        return { x: (pt.x / 1000) * 100, y: (pt.y / 820) * 100 };
      }),
    );
  }, [pathD]);

  useEffect(() => {
    const root = rootRef.current;
    const fg = fgRef.current;
    if (!root || !fg || positions.length === 0) return;

    const { gsap, ScrollTrigger } = ensureScrollTrigger();
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        const len = lenRef.current;
        fg.style.strokeDashoffset = String(len * (1 - p));

        const pt = fg.getPointAtLength(len * Math.min(Math.max(p, 0), 1));
        const token = tokenRef.current;
        if (token) {
          token.style.left = `${(pt.x / 1000) * 100}%`;
          token.style.top = `${(pt.y / 820) * 100}%`;
          token.style.opacity = p > 0.02 ? "1" : "0";
          token.textContent = stages[segment(p)] ?? "";
        }

        // The furthest node the token has reached (the current handoff).
        let activeIndex = -1;
        RELAY_NODES.forEach((node, index) => {
          if (p >= node.at - 0.01) activeIndex = index;
        });

        RELAY_NODES.forEach((node, index) => {
          const lit = p >= node.at - 0.01;
          // On mobile the cards stack in a narrow column, so only the current
          // node's description is expanded to avoid overlapping cards.
          const expanded = narrow ? index === activeIndex : lit;
          const dot = dotRefs.current[index];
          const card = cardRefs.current[index];
          const desc = descRefs.current[index];
          if (dot && index !== RELAY_NODES.length - 1) {
            dot.style.background = lit ? node.accent : "#0E1526";
            dot.style.borderColor = lit ? node.accent : `${node.accent}66`;
            dot.style.boxShadow = lit ? `0 0 18px ${node.accent}` : "none";
            dot.style.transform = lit
              ? "translate(-50%,-50%) scale(1.3)"
              : "translate(-50%,-50%) scale(1)";
          }
          if (card) {
            const prominent = narrow ? index === activeIndex : lit;
            card.style.opacity = prominent ? "1" : narrow ? "0.55" : "0.4";
            card.style.borderColor = prominent ? `${node.accent}88` : `${node.accent}33`;
            card.style.zIndex = index === activeIndex ? "6" : "4";
          }
          if (desc) {
            desc.style.maxHeight = expanded ? "90px" : "0";
            desc.style.opacity = expanded ? "1" : "0";
            desc.style.marginTop = expanded ? "6px" : "0";
          }
        });
      },
    });

    refreshScrollTriggers();
    return () => {
      trigger.kill();
      gsap.set(fg, { clearProps: "all" });
      ScrollTrigger.refresh();
    };
  }, [positions.length, stages, narrow]);

  return (
    <section id="team" ref={rootRef} className="relative h-[340vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="relative z-30 px-5 pt-[clamp(28px,6vh,60px)] text-center">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-orange">
            {label}
          </div>
          <h2 className="text-balance text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/70">
            {hint}
          </p>
        </div>

        {/* Stage fills the sticky viewport; the SVG stretches to it and nodes are
            positioned by percentage, so the thread + nodes stay aligned at any size.
            The generous bottom offset keeps the final PM node + its card fully on-screen. */}
        <div
          className={`absolute inset-x-0 ${
            narrow
              ? "bottom-[6svh] top-[clamp(118px,15svh,170px)]"
              : "bottom-[13vh] top-[clamp(140px,20vh,220px)]"
          }`}
        >
          <svg
            viewBox="0 0 1000 820"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 h-full w-full"
          >
            <path
              ref={bgRef}
              d={pathD}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={2}
            />
            <path
              ref={fgRef}
              d={pathD}
              fill="none"
              stroke="#FF6B3D"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,107,61,0.7))" }}
            />
          </svg>

          {roles.map((role, index) => {
            const node = RELAY_NODES[index]!;
            const pos = positions[index] ?? { x: 50, y: 50 };
            const isPM = index === RELAY_NODES.length - 1;
            return (
              <div
                key={role.name}
                className="absolute z-[4]"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                {isPM ? (
                  <span
                    ref={(el) => {
                      dotRefs.current[index] = el;
                    }}
                    className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange/50 bg-navy-950 shadow-glow"
                  >
                    <Mascot glow className="h-4 w-auto" />
                  </span>
                ) : (
                  <span
                    ref={(el) => {
                      dotRefs.current[index] = el;
                    }}
                    className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300"
                    style={{ background: "#0E1526", borderColor: `${node.accent}66` }}
                  />
                )}
                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`absolute rounded-[14px] border bg-navy-950/85 p-3.5 backdrop-blur-sm transition-all duration-300 ${
                    narrow
                      ? `left-1/2 w-[min(230px,66vw)] -translate-x-1/2 text-center ${
                          isPM ? "top-11" : "top-5"
                        }`
                      : `top-0 min-w-[150px] max-w-[230px] -translate-y-1/2 ${
                          node.side === "r" ? "left-[22px] text-left" : "right-[22px] text-right"
                        }`
                  }`}
                  style={{ opacity: 0.4, borderColor: `${node.accent}33` }}
                >
                  <div className="font-display text-[15px] font-bold text-ink">{role.name}</div>
                  <div
                    ref={(el) => {
                      descRefs.current[index] = el;
                    }}
                    className="overflow-hidden text-[13px] leading-snug text-muted"
                    style={{ maxHeight: 0, opacity: 0 }}
                  >
                    {role.desc}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            ref={tokenRef}
            className="absolute z-[5] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-orange px-3 py-1.5 font-mono text-[12px] font-medium text-navy-950 shadow-[0_0_24px_rgba(255,107,61,0.7)]"
            style={{ opacity: 0 }}
          >
            {stages[0]}
          </div>
        </div>
      </div>
    </section>
  );
}
