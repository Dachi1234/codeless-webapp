"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

type RailStep = { num: string; title: string; desc: string };

function RailNode({ step, index, total }: { step: RailStep; index: number; total: number }) {
  const isEnd = index === 0 || index === total - 1;
  return (
    <div className="relative pt-7">
      <span
        className={`absolute left-0 top-0 h-[11px] w-[11px] rounded-full ${
          isEnd ? "bg-orange shadow-glow" : "border border-orange/50 bg-navy-950"
        }`}
      />
      <span className="absolute left-[11px] right-0 top-[5px] h-px bg-gradient-to-r from-orange/60 to-white/10" />
      <div className="font-mono text-xs text-muted">{step.num}</div>
      <div
        className={`mt-2 font-display text-lg font-bold leading-tight sm:text-xl ${
          index === total - 1 ? "text-orange-bright" : "text-ink"
        }`}
      >
        {step.title}
      </div>
      <div className="mt-1.5 text-[13px] leading-snug text-muted">{step.desc}</div>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("how");
  const rail = t.raw("rail") as RailStep[];
  const leaveWith = t.raw("leaveWith") as string[];

  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="section">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-orange">
              {t("label")}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {t("subtitle")}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14 sm:mt-20">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
            {rail.map((step, index) => (
              <RailNode key={step.num} step={step} index={index} total={rail.length} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 text-center sm:mt-20">
          <div className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-success">
            {t("leaveLabel")}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {leaveWith.map((item, index) => {
              const highlight = index === leaveWith.length - 1;
              return (
                <span
                  key={item}
                  className={`rounded-full px-5 py-2.5 font-display text-sm font-semibold sm:text-base ${
                    highlight
                      ? "bg-orange text-navy-950 shadow-glow"
                      : "border border-white/15 text-ink/90"
                  }`}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
