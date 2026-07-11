"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ensureScrollTrigger, refreshScrollTriggers } from "@/lib/motion/gsap";
import { useMotionTier } from "@/lib/motion/useMotionTier";
import { CODELESS_ASSETS, COURSE_ASSETS, type StoryStage } from "../compare/shared";

// The mobile experience pulls in react-three-fiber, so only load that chunk for
// devices that actually render it (tier === "lite").
const CompareImmersiveMobile = dynamic(
  () => import("../compare/CompareImmersiveMobile").then((m) => m.CompareImmersiveMobile),
  { ssr: false },
);

function ProgressRail({
  activeStage,
  total,
  tone,
}: {
  activeStage: number;
  total: number;
  tone: "cold" | "warm";
}) {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-[width,background-color,opacity] duration-500 ${
            index === activeStage ? "w-8" : "w-2"
          } ${
            tone === "warm"
              ? index <= activeStage
                ? "bg-orange"
                : "bg-white/15"
              : index <= activeStage
                ? "bg-slate-300/65"
                : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

function StoryPanel({
  side,
  title,
  stage,
  asset,
  index,
  total,
  activeStage,
  compact = false,
}: {
  side: "course" | "codeless";
  title: string;
  stage: StoryStage;
  asset: string;
  index: number;
  total: number;
  activeStage: number;
  compact?: boolean;
}) {
  const warm = side === "codeless";
  const heading = warm ? stage.codeless : stage.course;
  const caption = warm ? stage.codelessCaption : stage.courseCaption;

  return (
    <div
      data-compare-panel={compact ? undefined : side}
      className={`relative flex h-full min-w-0 flex-col overflow-hidden ${
        warm
          ? "bg-[radial-gradient(circle_at_60%_42%,rgba(255,107,61,0.28),transparent_46%),linear-gradient(145deg,rgba(45,26,31,0.98),rgba(9,13,27,0.98))]"
          : "bg-[radial-gradient(circle_at_40%_42%,rgba(124,145,170,0.12),transparent_48%),linear-gradient(215deg,rgba(20,29,44,0.98),rgba(7,11,21,0.98))]"
      } ${compact ? "min-h-[34rem] rounded-[2rem] border border-white/10" : ""}`}
    >
      <div className={`${compact ? "p-5" : "px-[clamp(1.5rem,4vw,5rem)] pt-[12vh]"}`}>
        <div className="flex items-center justify-between gap-4">
          <p
            className={`font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${
              warm ? "text-orange" : "text-slate-400"
            }`}
          >
            {title}
          </p>
          <ProgressRail activeStage={activeStage} total={total} tone={warm ? "warm" : "cold"} />
        </div>
      </div>

      <div
        data-compare-visual={compact ? undefined : side}
        className={`relative mx-auto flex w-full flex-1 items-center justify-center ${
          compact ? "px-8 py-4" : "px-[clamp(2rem,6vw,8rem)] py-5"
        }`}
      >
        <div
          aria-hidden
          className={`absolute h-44 w-44 rounded-full blur-3xl sm:h-64 sm:w-64 ${
            warm ? "bg-orange/20" : "bg-slate-400/[0.06]"
          }`}
        />
        <Image
          src={asset}
          alt=""
          width={620}
          height={440}
          priority={index === 0}
          className={`relative h-auto max-h-[42vh] w-full object-contain ${
            warm
              ? "drop-shadow-[0_28px_55px_rgba(255,107,61,0.18)]"
              : "grayscale saturate-50 opacity-75"
          }`}
        />
        {index === total - 1 && (
          <span
            className={`absolute right-[12%] top-[12%] flex h-12 w-12 items-center justify-center rounded-full border text-xl shadow-xl ${
              warm
                ? "border-success/40 bg-success/15 text-success"
                : "border-white/10 bg-slate-900/80 text-slate-400"
            }`}
          >
            {warm ? "✓" : "·︵·"}
          </span>
        )}
      </div>

      <div
        data-compare-copy={compact ? undefined : side}
        className={`${compact ? "px-6 pb-7" : "px-[clamp(1.5rem,5vw,7rem)] pb-[9vh]"}`}
      >
        <span className={`font-mono text-xs ${warm ? "text-orange" : "text-slate-500"}`}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <h3
          className={`mt-3 max-w-[14ch] text-[clamp(1.8rem,3.6vw,4.5rem)] font-extrabold leading-[1.08] ${
            warm ? "text-ink" : "text-slate-300"
          }`}
        >
          {heading}
        </h3>
        <p
          className={`mt-3 max-w-md text-sm leading-relaxed sm:text-base ${warm ? "text-ink/70" : "text-slate-500"}`}
        >
          {caption}
        </p>
      </div>

      {warm && index === total - 1 && (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }, (_, dot) => (
            <span
              key={dot}
              className="absolute h-1.5 w-1.5 rounded-full bg-orange shadow-glow"
              style={{
                left: `${12 + ((dot * 19) % 80)}%`,
                top: `${16 + ((dot * 31) % 68)}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CompareFallback({
  title,
  courseTitle,
  codelessTitle,
  stages,
}: {
  title: string;
  courseTitle: string;
  codelessTitle: string;
  stages: StoryStage[];
}) {
  return (
    <div className="section py-20 sm:py-24">
      <p className="eyebrow-orange mb-4 text-center">{title}</p>
      <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-muted">
        {stages.map((stage) => `${stage.course} → ${stage.codeless}`).join(" · ")}
      </p>
      <div className="space-y-8">
        {stages.map((stage, index) => (
          <article key={`${stage.course}-${stage.codeless}`} className="grid gap-4 sm:grid-cols-2">
            <StoryPanel
              compact
              side="course"
              title={courseTitle}
              stage={stage}
              asset={COURSE_ASSETS[index]!}
              index={index}
              total={stages.length}
              activeStage={index}
            />
            <StoryPanel
              compact
              side="codeless"
              title={codelessTitle}
              stage={stage}
              asset={CODELESS_ASSETS[index]!}
              index={index}
              total={stages.length}
              activeStage={index}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

export function Compare() {
  const t = useTranslations("compare");
  const locale = useLocale();
  const tier = useMotionTier();
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const stages = t.raw("stages") as StoryStage[];

  useEffect(() => {
    const root = rootRef.current;
    const pinnedStage = stageRef.current;
    // Only the desktop "full" tier runs the GSAP pinned scrub.
    if (!root || !pinnedStage || tier !== "full") return;

    const { gsap, ScrollTrigger } = ensureScrollTrigger();
    const context = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-compare-chapter]");
      if (chapters.length !== stages.length) return;

      const transitions = chapters.length - 1;

      // Base state: first chapter visible, the rest stacked and hidden.
      chapters.forEach((chapter, index) => {
        gsap.set(chapter, { autoAlpha: index === 0 ? 1 : 0 });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          // ~one viewport of scroll per stage transition.
          end: () => `+=${Math.max(transitions, 1) * window.innerHeight}`,
          pin: pinnedStage,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.round(self.progress * transitions);
            setActiveStage((current) => (current === next ? current : next));
          },
        },
      });

      for (let index = 1; index < chapters.length; index += 1) {
        const previous = chapters[index - 1]!;
        const next = chapters[index]!;
        const nextVisuals = next.querySelectorAll("[data-compare-visual]");
        const nextCopy = next.querySelectorAll("[data-compare-copy]");
        const position = index - 1;

        // Cross-fade whole chapters (keeps backgrounds tied to scroll, so nothing
        // is ever shown in a static half-state before animating).
        timeline
          .to(previous, { autoAlpha: 0, duration: 1, ease: "power1.inOut" }, position)
          .fromTo(
            next,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1, ease: "power1.inOut" },
            position,
          )
          .fromTo(
            nextVisuals,
            { yPercent: 16, scale: 0.94, filter: "blur(8px)" },
            { yPercent: 0, scale: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" },
            position,
          )
          .fromTo(
            nextCopy,
            { yPercent: 22, autoAlpha: 0, filter: "blur(6px)" },
            { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" },
            position,
          );
      }
    }, root);

    refreshScrollTriggers();
    return () => {
      context.revert();
      ScrollTrigger.refresh();
    };
  }, [tier, stages.length]);

  return (
    <section
      id="compare"
      ref={rootRef}
      lang={locale}
      className="relative"
      aria-labelledby="compare-title"
    >
      {tier === "static" ? (
        <CompareFallback
          title={t("title")}
          courseTitle={t("othersTitle")}
          codelessTitle={t("usTitle")}
          stages={stages}
        />
      ) : tier === "lite" ? (
        <CompareImmersiveMobile stages={stages} />
      ) : (
        <div ref={stageRef} className="relative h-screen min-h-[700px] overflow-hidden bg-navy-950">
          <h2 id="compare-title" className="sr-only">
            {t("title")}
          </h2>

          <div className="absolute inset-x-0 top-16 z-30 flex h-16 items-center justify-center border-b border-white/10 bg-navy-950/80 px-6 backdrop-blur-xl">
            <span className="eyebrow-orange">{t("title")}</span>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-32 z-30 h-[calc(100%-8rem)] w-px -translate-x-1/2 bg-gradient-to-b from-orange/0 via-orange/70 to-orange/0 shadow-[0_0_30px_rgba(255,107,61,0.45)]"
          />

          <div aria-live="polite" className="absolute inset-x-0 bottom-5 z-40 flex justify-center">
            <span className="rounded-full border border-white/10 bg-navy-950/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur">
              {t("stageLabel", { current: activeStage + 1, total: stages.length })}
            </span>
          </div>

          {stages.map((stage, index) => (
            <article
              key={`${stage.course}-${stage.codeless}`}
              data-compare-chapter
              aria-hidden={index !== activeStage}
              className={`absolute inset-0 grid grid-cols-2 pt-16 ${index === 0 ? "" : "invisible"}`}
            >
              <StoryPanel
                side="course"
                title={t("othersTitle")}
                stage={stage}
                asset={COURSE_ASSETS[index]!}
                index={index}
                total={stages.length}
                activeStage={activeStage}
              />
              <StoryPanel
                side="codeless"
                title={t("usTitle")}
                stage={stage}
                asset={CODELESS_ASSETS[index]!}
                index={index}
                total={stages.length}
                activeStage={activeStage}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
