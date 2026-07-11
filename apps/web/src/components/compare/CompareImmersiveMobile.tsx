"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useScrollProgress } from "@/lib/motion/useScrollProgress";
import { CODELESS_ASSETS, COURSE_ASSETS, type StoryStage } from "./shared";
import { CompareSplitScene } from "./CompareSplitScene";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function CompareImmersiveMobile({ stages }: { stages: StoryStage[] }) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const total = stages.length;
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const onFrame = useCallback(
    (progress: number) => {
      const stageF = progress * Math.max(total - 1, 1);
      const frac = stageF - Math.floor(stageF);
      const transition = smoothstep(0.32, 0.5, frac) * smoothstep(0.68, 0.5, frac);

      rootRef.current?.style.setProperty("--glitch", transition.toFixed(3));

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        const distance = Math.abs(stageF - index);
        // Steep fade so only one panel's text is readable at a time; the WebGL
        // split carries the brief hand-off in between.
        const op = Math.min(1, Math.max(0, 1 - distance * 1.9));
        const shift = (index - stageF) * 26;
        panel.style.opacity = op.toFixed(3);
        panel.style.setProperty("--shift", `${shift.toFixed(1)}px`);
        panel.style.setProperty("--reveal", op.toFixed(3));
      });

      const next = Math.round(stageF);
      setActiveStage((current) => (current === next ? current : next));
    },
    [total],
  );

  const { setContainerRef, progressRef, inView } = useScrollProgress({ onFrame });

  return (
    <div
      ref={(node) => {
        setContainerRef(node);
      }}
      lang={locale}
      className="relative"
      // ~one viewport of scroll per stage transition.
      style={{ height: `${Math.max(total, 2) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-navy-950">
        {/* WebGL ambient split (bloom, particles, seam, glitch bands). */}
        <div aria-hidden className="absolute inset-0">
          <CompareSplitScene progressRef={progressRef} stages={total} active={inView} />
        </div>

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-30 flex h-14 items-center justify-center border-b border-white/10 bg-navy-950/60 px-4 backdrop-blur-xl">
          <span className="eyebrow-orange">{t("title")}</span>
        </div>

        {/* Crisp DOM content, cross-fading per stage. Text stays real DOM so it
            never gets cut off and localizes cleanly (Georgian included). */}
        <div ref={rootRef} className="absolute inset-0 pt-14">
          {stages.map((stage, index) => (
            <div
              key={`${stage.course}-${stage.codeless}`}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              aria-hidden={index !== activeStage}
              className="absolute inset-0 grid grid-cols-2"
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              {/* COURSES side — desaturated + RGB-split glitch */}
              <div className="relative flex flex-col justify-between px-4 pb-24 pt-6">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {t("othersTitle")}
                </span>

                <div
                  className="relative mx-auto my-2 aspect-[4/3] w-full max-w-[15rem]"
                  style={{ transform: "translateY(var(--shift, 0px))" }}
                >
                  <Image
                    src={COURSE_ASSETS[index]!}
                    alt=""
                    fill
                    priority={index === 0}
                    className="object-contain opacity-80 grayscale saturate-50"
                  />
                  {/* Chromatic-aberration ghosts driven by --glitch */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat mix-blend-screen"
                    style={{
                      backgroundImage: `url(${COURSE_ASSETS[index]!})`,
                      opacity: "calc(var(--glitch, 0) * 0.8)",
                      transform: "translateX(calc(var(--glitch, 0) * 7px))",
                      filter:
                        "brightness(0) invert(28%) sepia(96%) saturate(4000%) hue-rotate(350deg)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat mix-blend-screen"
                    style={{
                      backgroundImage: `url(${COURSE_ASSETS[index]!})`,
                      opacity: "calc(var(--glitch, 0) * 0.8)",
                      transform: "translateX(calc(var(--glitch, 0) * -7px))",
                      filter:
                        "brightness(0) invert(60%) sepia(60%) saturate(500%) hue-rotate(150deg)",
                    }}
                  />
                </div>

                <div style={{ transform: "translateY(var(--shift, 0px))" }}>
                  <span className="font-mono text-[10px] text-slate-500">
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 max-w-[12ch] text-[clamp(1.1rem,5vw,1.9rem)] font-extrabold leading-tight text-slate-300">
                    {stage.course}
                  </h3>
                  <p className="mt-1.5 max-w-[26ch] text-[11px] leading-snug text-slate-500">
                    {stage.courseCaption}
                  </p>
                </div>
              </div>

              {/* CODELESS side — full colour + clip-reveal */}
              <div className="relative flex flex-col justify-between bg-[radial-gradient(circle_at_60%_40%,rgba(255,107,61,0.16),transparent_55%)] px-4 pb-24 pt-6">
                <span className="text-right font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-orange">
                  {t("usTitle")}
                </span>

                <div
                  className="relative mx-auto my-2 aspect-[4/3] w-full max-w-[15rem] overflow-hidden"
                  style={{
                    transform: "translateY(var(--shift, 0px))",
                    clipPath: "inset(0 calc((1 - var(--reveal, 1)) * 100%) 0 0)",
                  }}
                >
                  <Image
                    src={CODELESS_ASSETS[index]!}
                    alt=""
                    fill
                    priority={index === 0}
                    className="object-contain drop-shadow-[0_18px_40px_rgba(255,107,61,0.22)]"
                  />
                </div>

                <div className="text-right" style={{ transform: "translateY(var(--shift, 0px))" }}>
                  <span className="font-mono text-[10px] text-orange">
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                  <h3 className="ml-auto mt-1 max-w-[12ch] text-[clamp(1.1rem,5vw,1.9rem)] font-extrabold leading-tight text-ink">
                    {stage.codeless}
                  </h3>
                  <p className="ml-auto mt-1.5 max-w-[26ch] text-[11px] leading-snug text-ink/70">
                    {stage.codelessCaption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seam glow (DOM, matches shader seam) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-14 left-1/2 z-20 w-px -translate-x-1/2 bg-gradient-to-b from-orange/0 via-orange/70 to-orange/0 shadow-[0_0_24px_rgba(255,107,61,0.5)]"
        />

        {/* Progress rail + stage label */}
        <div className="absolute inset-x-0 bottom-5 z-40 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden>
            {stages.map((_, index) => (
              <span
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeStage ? "w-6 bg-orange" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>
          <span
            aria-live="polite"
            className="rounded-full border border-white/10 bg-navy-950/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted backdrop-blur"
          >
            {t("stageLabel", { current: activeStage + 1, total })}
          </span>
        </div>
      </div>
    </div>
  );
}
