"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

type Point = { title: string; desc: string };

export function Outcomes() {
  const t = useTranslations("outcomes");
  const points = t.raw("points") as Point[];

  return (
    <section id="outcomes" className="section py-24 sm:py-32">
      <SectionHeading label={t("label")} title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {points.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="card group h-full p-7 transition-colors duration-300 hover:border-orange/40">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-orange/15 font-mono text-lg font-bold text-orange">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
