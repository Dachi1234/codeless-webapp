"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { StageVisual } from "@/components/how/StageVisual";
import { SectionHeading } from "./SectionHeading";
import { ensureScrollTrigger, refreshScrollTriggers } from "@/lib/motion/gsap";
import { useMotionTier } from "@/lib/motion/useMotionTier";

type BuildStep = { step: string; title: string; desc: string };

function Pipeline({ steps, activeStage }: { steps: BuildStep[]; activeStage: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex h-14 items-center justify-center border-y border-white/10 bg-navy-950/70 px-6 backdrop-blur-xl">
      <div className="flex w-full max-w-3xl items-center">
        {steps.map((step, index) => {
          const done = index <= activeStage;
          return (
            <div key={step.step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px] font-bold transition-all duration-300 ${
                    done ? "border-orange bg-orange text-navy-deep" : "border-white/20 text-muted"
                  }`}
                >
                  {step.step}
                </span>
                <span
                  className={`hidden text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:block ${
                    index === activeStage ? "text-orange" : "text-muted"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-1 h-px flex-1 bg-white/10">
                  <div
                    className="h-full bg-orange transition-[width] duration-500"
                    style={{ width: index < activeStage ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("how");
  const steps = t.raw("steps") as BuildStep[];
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const tier = useMotionTier();
  const immersive = tier === "full";

  useEffect(() => {
    if (!immersive || !viewportRef.current || !trackRef.current) return;

    const { gsap, ScrollTrigger } = ensureScrollTrigger();
    const context = gsap.context(() => {
      const shift = (100 * (steps.length - 1)) / steps.length; // % of the track
      gsap.to(trackRef.current, {
        xPercent: -shift,
        ease: "none",
        scrollTrigger: {
          trigger: viewportRef.current,
          start: "top top",
          end: () => `+=${(steps.length - 1) * 100}%`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const next = Math.round(progress * (steps.length - 1));
            setActiveStage((current) => (current === next ? current : next));
          },
        },
      });
    }, sectionRef);

    refreshScrollTriggers();
    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [immersive, steps.length]);

  return (
    <section id="how" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="section">
        <SectionHeading label={t("label")} title={t("title")} subtitle={t("subtitle")} />
      </div>

      {!immersive ? (
        <div className="section mt-14 space-y-16">
          {steps.map((step) => (
            <article key={step.step} className="grid items-center gap-8 md:grid-cols-2">
              <StageVisual index={Number(step.step) - 1} active />
              <div>
                <span className="font-mono text-sm font-bold tracking-[0.2em] text-orange">
                  {step.step}
                </span>
                <h3 className="mt-3 text-3xl font-extrabold leading-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-muted">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div
          ref={viewportRef}
          className="relative mt-14 h-screen min-h-[680px] overflow-hidden border-y border-white/10 bg-navy-950/75"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,107,61,0.12),transparent_45%)]" />
          <Pipeline steps={steps} activeStage={activeStage} />

          <div
            ref={trackRef}
            className="flex h-full items-center pt-32 will-change-transform"
            style={{ width: `${steps.length * 100}%` }}
          >
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="grid h-full shrink-0 items-center gap-[4vw] px-[6vw] md:grid-cols-[1fr_0.85fr]"
                style={{ width: `${100 / steps.length}%` }}
              >
                <StageVisual index={index} active={index === activeStage} />
                <div className="min-w-0">
                  <span className="font-mono text-sm font-bold tracking-[0.2em] text-orange">
                    {step.step} / {steps.length.toString().padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-4xl font-extrabold leading-tight text-ink xl:text-6xl">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
