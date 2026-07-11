"use client";

import { useCallback, useRef, useState } from "react";
import { useScrollProgress } from "@/lib/motion/useScrollProgress";
import { StageVisual } from "./StageVisual";

type BuildStep = { step: string; title: string; desc: string };

/**
 * `lite`-tier (touch / mobile) experience for "The Build".
 *
 * Desktop pins a horizontal filmstrip; that gesture is awkward on touch, so here
 * a tall wrapper holds a `position: sticky` stage and vertical scroll advances
 * through the five artifacts one at a time. Reuses the same believable
 * `StageVisual` artifacts — no canvas, so it stays cheap.
 */
export function HowItWorksImmersiveMobile({ steps }: { steps: BuildStep[] }) {
  const total = steps.length;
  const [activeStage, setActiveStage] = useState(0);

  const onFrame = useCallback(
    (progress: number) => {
      const next = Math.min(total - 1, Math.floor(progress * total));
      setActiveStage((current) => (current === next ? current : next));
    },
    [total],
  );

  const { setContainerRef } = useScrollProgress({ onFrame });

  return (
    <div
      ref={(node) => setContainerRef(node)}
      className="relative mt-6"
      // ~one viewport of scroll per stage.
      style={{ height: `${total * 88}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden border-y border-white/10 bg-navy-950/75">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,107,61,0.12),transparent_48%)]" />

        {/* pipeline stepper (offset below the fixed nav) */}
        <div className="absolute inset-x-0 top-16 z-30 flex h-12 items-center justify-center border-b border-white/10 bg-navy-950/70 px-4 backdrop-blur-xl">
          <div className="flex w-full max-w-xs items-center">
            {steps.map((step, index) => (
              <div key={step.step} className="flex flex-1 items-center last:flex-none">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[9px] font-bold transition-all duration-300 ${
                    index <= activeStage
                      ? "border-orange bg-orange text-navy-deep"
                      : "border-white/20 text-muted"
                  }`}
                >
                  {step.step}
                </span>
                {index < total - 1 && (
                  <span className="mx-1 h-px flex-1 bg-white/10">
                    <span
                      className="block h-full bg-orange transition-[width] duration-500"
                      style={{ width: index < activeStage ? "100%" : "0%" }}
                    />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* stage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 pb-14 pt-28">
          {/* artifact stack (all mounted; only the active one animates) */}
          <div className="relative aspect-[4/3] w-full max-w-sm">
            {steps.map((step, index) => (
              <div
                key={step.step}
                aria-hidden={index !== activeStage}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === activeStage
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                }`}
              >
                <StageVisual index={index} active={index === activeStage} />
              </div>
            ))}
          </div>

          {/* caption stack */}
          <div className="relative min-h-[8rem] w-full max-w-sm">
            {steps.map((step, index) => (
              <div
                key={step.step}
                aria-hidden={index !== activeStage}
                aria-current={index === activeStage ? "step" : undefined}
                className={`absolute inset-0 text-center transition-all duration-500 ${
                  index === activeStage
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0"
                }`}
              >
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-orange">
                  {step.step} / {total.toString().padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight text-ink">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
