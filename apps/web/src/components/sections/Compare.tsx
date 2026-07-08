"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Mascot } from "@/components/brand/Mascot";

export function Compare() {
  const t = useTranslations("compare");
  const others = t.raw("others") as string[];
  const us = t.raw("us") as string[];

  return (
    <section id="compare" className="section py-20 sm:py-24">
      <Reveal className="mb-12 text-center">
        <span className="eyebrow-orange mb-4">{t("title")}</span>
      </Reveal>

      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
        {/* Others */}
        <Reveal>
          <div className="card h-full p-7">
            <h3 className="mb-6 text-lg font-bold text-muted">{t("othersTitle")}</h3>
            <ul className="space-y-4">
              {others.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-xs">
                    {i + 1}
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Us */}
        <Reveal delay={0.1}>
          <div className="card-us relative h-full overflow-hidden p-7">
            <div className="mb-6 flex items-center gap-3">
              <Mascot className="h-6 w-auto" glow />
              <h3 className="text-lg font-bold text-ink">{t("usTitle")}</h3>
            </div>
            <ul className="space-y-4">
              {us.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-ink">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange/20 text-xs font-semibold text-orange">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
