"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CarouselDots, SwipeCarousel } from "@/components/shared/SwipeCarousel";
import { CODELESS_ASSETS, COURSE_ASSETS, type StoryStage } from "./shared";

/**
 * `lite`-tier (touch) experience for "The Split". A native horizontal swipe
 * carousel: one course-vs-CodeLess comparison per screen, swipe through the
 * story. Real DOM text (localizes cleanly, never cut off).
 */
export function CompareImmersiveMobile({ stages }: { stages: StoryStage[] }) {
  const t = useTranslations("compare");
  const locale = useLocale();
  const total = stages.length;

  return (
    <div lang={locale} className="py-16">
      <p className="eyebrow-orange mb-8 text-center">{t("title")}</p>

      <SwipeCarousel
        count={total}
        ariaLabel="Others versus CodeLess — swipe to compare"
        renderFooter={(active) => (
          <>
            <CarouselDots count={total} active={active} />
            <p
              aria-live="polite"
              className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70"
            >
              {t("stageLabel", { current: active + 1, total })} · swipe →
            </p>
          </>
        )}
        renderPanel={(index) => {
          const stage = stages[index]!;
          return (
            <div className="relative grid grid-cols-2 gap-3 px-4">
              {/* seam */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-orange/0 via-orange/60 to-orange/0 shadow-[0_0_18px_rgba(255,107,61,0.45)]"
              />

              {/* PM courses — cold */}
              <div className="flex flex-col rounded-2xl border border-white/10 bg-[linear-gradient(215deg,rgba(20,29,44,0.9),rgba(7,11,21,0.9))] p-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {t("othersTitle")}
                </span>
                <div className="relative mx-auto my-3 aspect-[4/3] w-full max-w-[10rem]">
                  <Image
                    src={COURSE_ASSETS[index]!}
                    alt=""
                    fill
                    priority={index === 0}
                    className="object-contain opacity-75 grayscale saturate-50"
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-lg font-extrabold leading-tight text-slate-300">
                  {stage.course}
                </h3>
                <p className="mt-1.5 text-[11px] leading-snug text-slate-500">
                  {stage.courseCaption}
                </p>
              </div>

              {/* CodeLess — warm */}
              <div className="flex flex-col rounded-2xl border border-orange/25 bg-[radial-gradient(circle_at_60%_35%,rgba(255,107,61,0.22),transparent_60%),linear-gradient(145deg,rgba(45,26,31,0.95),rgba(9,13,27,0.95))] p-3">
                <span className="text-right font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-orange">
                  {t("usTitle")}
                </span>
                <div className="relative mx-auto my-3 aspect-[4/3] w-full max-w-[10rem]">
                  <Image
                    src={CODELESS_ASSETS[index]!}
                    alt=""
                    fill
                    priority={index === 0}
                    className="object-contain drop-shadow-[0_16px_36px_rgba(255,107,61,0.22)]"
                  />
                </div>
                <span className="text-right font-mono text-[10px] text-orange">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-right text-lg font-extrabold leading-tight text-ink">
                  {stage.codeless}
                </h3>
                <p className="mt-1.5 text-right text-[11px] leading-snug text-ink/70">
                  {stage.codelessCaption}
                </p>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
