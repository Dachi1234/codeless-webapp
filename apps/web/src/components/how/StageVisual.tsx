"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/brand/Mascot";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

function reveal(active: boolean) {
  return cn(
    "transition-all duration-500",
    active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
  );
}

function CountUp({
  target,
  active,
  suffix = "",
}: {
  target: number;
  active: boolean;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

/** A coherent sample mobile app that appears across Design → Launch. */
function AppScreen({ live }: { live: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[1.4rem] border transition-colors duration-500",
        live ? "border-white/10 bg-navy-deep" : "border-dashed border-white/25 bg-white/[0.02]",
      )}
    >
      <div className="flex items-center justify-between px-3 pt-2 pb-1 pt-2">
        <span className="font-mono text-[7px] text-muted">9:41</span>
        <span className="flex gap-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        </span>
      </div>
      {/* hero */}
      <div
        className={cn(
          "mx-3 mt-1 h-14 rounded-xl transition-all duration-500",
          live
            ? "bg-[linear-gradient(120deg,#FF6B3D,#9B6DFF)]"
            : "border border-dashed border-white/25 bg-white/[0.03]",
        )}
      />
      <div className="mx-3 mt-2 flex items-center gap-1.5">
        <div className={cn("h-2 w-16 rounded-full", live ? "bg-white/80" : "bg-white/15")} />
        <div className={cn("ml-auto h-2 w-8 rounded-full", live ? "bg-orange" : "bg-white/10")} />
      </div>
      {/* list */}
      <div className="mt-2 flex-1 space-y-1.5 px-3">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className={cn(
              "flex items-center gap-2 rounded-lg p-1.5 transition-colors duration-500",
              live ? "bg-white/[0.05]" : "border border-dashed border-white/15",
            )}
          >
            <span className={cn("h-6 w-6 rounded-md", live ? "bg-orange/30" : "bg-white/10")} />
            <span className="flex-1 space-y-1">
              <span
                className={cn(
                  "block h-1.5 w-3/4 rounded-full",
                  live ? "bg-white/40" : "bg-white/10",
                )}
              />
              <span
                className={cn(
                  "block h-1.5 w-1/2 rounded-full",
                  live ? "bg-white/20" : "bg-white/[0.07]",
                )}
              />
            </span>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div className="p-3">
        <div
          className={cn(
            "flex h-7 items-center justify-center rounded-lg text-[8px] font-bold transition-colors duration-500",
            live
              ? "bg-orange text-navy-deep"
              : "border border-dashed border-white/25 text-white/30",
          )}
        >
          Order now
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 01 · Idea                                                                  */
/* -------------------------------------------------------------------------- */

function IdeaBoard({ active }: { active: boolean }) {
  const notes = [
    { text: "Who is it for?", className: "left-[4%] top-[12%] -rotate-6 bg-[#f4d35e]/90" },
    { text: "The problem", className: "right-[5%] top-[16%] rotate-3 bg-[#ee6c4d]/90" },
    { text: "The goal", className: "left-[8%] bottom-[12%] rotate-3 bg-[#8ecae6]/90" },
    { text: "Why now?", className: "right-[7%] bottom-[14%] -rotate-3 bg-[#b5e48c]/90" },
  ];
  return (
    <div className="relative h-full w-full">
      {/* central idea card */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border border-orange/40 bg-navy-950/95 p-4 text-center shadow-glow transition-all duration-500",
          active ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span
            className={cn(
              "absolute inset-0 rounded-full bg-orange/20 blur-md",
              active && "animate-pulse",
            )}
          />
          <Mascot glow className="relative h-5 w-auto" />
        </span>
        <span className="text-sm font-bold text-ink">Product idea</span>
        <span className="h-1.5 w-16 rounded-full bg-orange/40" />
      </div>

      {notes.map((note, index) => (
        <div
          key={note.text}
          className={cn(
            "absolute w-24 rounded-lg p-2 text-[10px] font-bold text-navy-deep shadow-lg transition-all duration-500",
            note.className,
            active ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
          style={{ transitionDelay: `${150 + index * 120}ms` }}
        >
          {note.text}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 · Requirements                                                          */
/* -------------------------------------------------------------------------- */

function RequirementsDoc({ active }: { active: boolean }) {
  const stories = [
    { text: "As a user, I can browse nearby places", tag: "P0", tone: "bg-danger/20 text-danger" },
    { text: "As a user, I can place an order", tag: "P0", tone: "bg-danger/20 text-danger" },
    { text: "As a user, I can track delivery", tag: "P1", tone: "bg-orange/20 text-orange" },
    { text: "As a user, I can rate the courier", tag: "P2", tone: "bg-white/10 text-muted" },
  ];
  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-white/10 bg-navy-deep p-4 sm:p-5">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange/15 text-orange">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
            <path d="M14 3v4h4" opacity={0.5} />
          </svg>
        </span>
        <div>
          <p className="text-sm font-bold text-ink">BRD · Requirements</p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
            v1.2 · approved
          </p>
        </div>
        <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 font-mono text-[9px] font-bold text-success">
          SIGNED OFF
        </span>
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-muted">User stories</p>
      <div className="mt-2 space-y-1.5">
        {stories.map((story, index) => (
          <div
            key={story.text}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2",
              reveal(active),
            )}
            style={{ transitionDelay: `${index * 110}ms` }}
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-300",
                active
                  ? "border-success bg-success/20 text-success"
                  : "border-white/20 text-transparent",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path d="M5 12l4 4 10-10" />
              </svg>
            </span>
            <span className="flex-1 truncate text-[11px] text-ink/80">{story.text}</span>
            <span
              className={cn("rounded px-1.5 py-0.5 font-mono text-[8px] font-bold", story.tone)}
            >
              {story.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 · Design                                                                */
/* -------------------------------------------------------------------------- */

function DesignCanvas({ active }: { active: boolean }) {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-deep">
      {/* layers */}
      <aside className="hidden w-24 shrink-0 border-r border-white/10 p-2 sm:block">
        <p className="mb-2 font-mono text-[8px] uppercase tracking-widest text-muted">Layers</p>
        {["Frame", "Hero", "List", "Button"].map((layer, index) => (
          <div
            key={layer}
            className={cn(
              "mb-1 flex items-center gap-1.5 rounded px-1.5 py-1 text-[9px] transition-colors",
              active && index === 1 ? "bg-orange/15 text-orange" : "text-muted",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-sm bg-current opacity-60" />
            {layer}
          </div>
        ))}
      </aside>

      {/* artboard */}
      <div className="relative flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent)] p-4">
        <span className="absolute left-3 top-2 font-mono text-[8px] text-muted">Home · 375×— </span>
        <div className="h-full max-h-[15rem] w-[8.5rem]">
          <AppScreen live={active} />
        </div>
      </div>

      {/* properties */}
      <aside className="hidden w-24 shrink-0 border-l border-white/10 p-2 sm:block">
        <p className="mb-2 font-mono text-[8px] uppercase tracking-widest text-muted">Styles</p>
        <div className="flex gap-1.5">
          {["#FF6B3D", "#9B6DFF", "#3DDC84"].map((c, index) => (
            <span
              key={c}
              className={cn(
                "h-5 w-5 rounded-full border border-white/20 transition-all duration-500",
                reveal(active),
              )}
              style={{ backgroundColor: c, transitionDelay: `${index * 90}ms` }}
            />
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {[10, 7, 5].map((w, index) => (
            <div
              key={w}
              className={cn("rounded-full bg-white/15", reveal(active))}
              style={{ height: 4, width: `${w * 8}%`, transitionDelay: `${index * 90}ms` }}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 · Development                                                           */
/* -------------------------------------------------------------------------- */

function DevBoard({ active }: { active: boolean }) {
  const columns = [
    { title: "To do", cards: 1, tone: "text-muted" },
    { title: "In progress", cards: 1, tone: "text-orange" },
    { title: "Done", cards: 2, tone: "text-success" },
  ];
  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-white/10 bg-navy-deep p-4">
      <div className="grid flex-1 grid-cols-3 gap-2">
        {columns.map((col, ci) => (
          <div
            key={col.title}
            className="flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-2"
          >
            <p
              className={cn(
                "mb-2 font-mono text-[9px] font-bold uppercase tracking-widest",
                col.tone,
              )}
            >
              {col.title}
            </p>
            <div className="space-y-1.5">
              {Array.from({ length: col.cards }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border border-white/10 bg-navy-950/80 p-1.5 transition-all duration-500",
                    // The "checkout" card lands in Done when active.
                    ci === 2 &&
                      i === 0 &&
                      (active ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"),
                  )}
                  style={{ transitionDelay: `${(ci + i) * 80}ms` }}
                >
                  <span className="block h-1.5 w-3/4 rounded-full bg-white/25" />
                  <span className="mt-1 flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-orange/40" />
                    <span className="h-1.5 w-8 rounded-full bg-white/10" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* terminal / build */}
      <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 font-mono text-[9px] leading-relaxed">
        <p className="text-muted">$ pnpm build</p>
        <p
          className={cn(
            "text-white/60 transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0",
          )}
        >
          ▸ compiling routes… bundling…
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5 text-success transition-opacity duration-700",
            active ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDelay: "300ms" }}
        >
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-success/20">
            <svg
              viewBox="0 0 24 24"
              className="h-2 w-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path d="M5 12l4 4 10-10" />
            </svg>
          </span>
          ✓ built in 4.2s · tests passed
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 05 · Launch                                                                */
/* -------------------------------------------------------------------------- */

function LaunchScreen({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-success/40 bg-navy-deep">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-danger/60" />
          <span className="h-2 w-2 rounded-full bg-orange/60" />
          <span className="h-2 w-2 rounded-full bg-success/60" />
        </span>
        <span className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-black/30 px-2 py-1 font-mono text-[9px] text-muted">
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5 text-success"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="5" y="11" width="14" height="9" rx="1.5" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
          codeless.ge
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center gap-4 p-4">
        <div className="h-full max-h-[13rem] w-[8rem] shrink-0">
          <AppScreen live />
        </div>

        {/* live metrics */}
        <div className="hidden flex-col gap-2 sm:flex">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
              Active users
            </p>
            <p className="text-2xl font-extrabold text-ink">
              <CountUp target={128} active={active} suffix=" ↑" />
            </p>
            <div className="mt-2 flex h-8 items-end gap-1">
              {[40, 55, 45, 70, 60, 85, 100].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-orange/70 transition-all duration-700"
                  style={{ height: active ? `${h}%` : "10%", transitionDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* deployed toast */}
        <div
          className={cn(
            "absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-success/40 bg-success/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-success transition-all duration-500",
            active ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Deployed · Live
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Public                                                                     */
/* -------------------------------------------------------------------------- */

const FRAMES = [
  { border: "border-white/15", glow: "" },
  { border: "border-white/15", glow: "" },
  { border: "border-orange/40", glow: "shadow-glow" },
  { border: "border-orange/40", glow: "shadow-glow" },
  { border: "border-success/50", glow: "shadow-[0_0_60px_-16px_rgba(61,220,132,0.6)]" },
];

export function StageVisual({ index, active }: { index: number; active: boolean }) {
  const frame = FRAMES[index] ?? FRAMES[0]!;
  const content = (() => {
    switch (index) {
      case 0:
        return <IdeaBoard active={active} />;
      case 1:
        return <RequirementsDoc active={active} />;
      case 2:
        return <DesignCanvas active={active} />;
      case 3:
        return <DevBoard active={active} />;
      default:
        return <LaunchScreen active={active} />;
    }
  })();

  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto aspect-[4/3] w-full max-w-xl rounded-[2rem] border bg-navy-950/85 p-4 transition-all duration-500 sm:p-5",
        frame.border,
        active ? frame.glow : "opacity-95",
      )}
    >
      {content}
    </div>
  );
}
