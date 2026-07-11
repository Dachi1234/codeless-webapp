"use client";

import { CarouselDots, SwipeCarousel } from "@/components/shared/SwipeCarousel";
import { StageVisual } from "./StageVisual";

type BuildStep = { step: string; title: string; desc: string };

function Stepper({ steps, active }: { steps: BuildStep[]; active: number }) {
  return (
    <div className="mx-auto mb-6 flex w-full max-w-xs items-center px-4">
      {steps.map((step, index) => (
        <div key={step.step} className="flex flex-1 items-center last:flex-none">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[9px] font-bold transition-all duration-300 ${
              index <= active
                ? "border-orange bg-orange text-navy-deep"
                : "border-white/20 text-muted"
            }`}
          >
            {step.step}
          </span>
          {index < steps.length - 1 && (
            <span className="mx-1 h-px flex-1 bg-white/10">
              <span
                className="block h-full bg-orange transition-[width] duration-500"
                style={{ width: index < active ? "100%" : "0%" }}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * `lite`-tier (touch) experience for "The Build". A native horizontal
 * swipe carousel — one believable artifact per screen, swipe left/right to move
 * through the product cycle. Reuses the same `StageVisual` artifacts.
 */
export function HowItWorksImmersiveMobile({ steps }: { steps: BuildStep[] }) {
  const total = steps.length;

  return (
    <div className="mt-8">
      <SwipeCarousel
        count={total}
        ariaLabel="Product build stages — swipe to explore"
        renderHeader={(active) => <Stepper steps={steps} active={active} />}
        renderFooter={(active) => (
          <>
            <CarouselDots count={total} active={active} />
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
              Swipe →
            </p>
          </>
        )}
        renderPanel={(index, active) => {
          const step = steps[index]!;
          return (
            <div className="flex flex-col items-center gap-6 px-6">
              <div className="w-full max-w-sm">
                <StageVisual index={index} active={active} />
              </div>
              <div className="text-center">
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
            </div>
          );
        }}
      />
    </div>
  );
}
