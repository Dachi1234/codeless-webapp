"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { OutcomeCounters, type OutcomeStat } from "@/components/outcomes/OutcomeCounters";
import { PortfolioTiltCard } from "@/components/outcomes/PortfolioTiltCard";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMediaQuery";

type Point = { title: string; desc: string };
type Portfolio = {
  eyebrow: string;
  role: string;
  project: string;
  shipped: string;
};

export function Outcomes() {
  const t = useTranslations("outcomes");
  const points = t.raw("points") as Point[];
  const stats = t.raw("stats") as OutcomeStat[];
  const portfolio = t.raw("portfolio") as Portfolio;
  const reducedMotion = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const words = t("title").split(/\s+/);

  return (
    <section id="outcomes" className="relative overflow-hidden py-28 sm:py-40">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/3 -z-10 h-96 bg-[radial-gradient(circle,rgba(255,107,61,0.18),transparent_64%)]"
      />
      <div className="section">
        <span className="eyebrow-orange">{t("label")}</span>

        <h2 className="mt-8 max-w-6xl text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] text-ink sm:text-7xl lg:text-[7rem]">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={reducedMotion ? false : { opacity: 0, y: 48, filter: "blur(12px)" }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
              className={index >= words.length - 4 ? "text-gradient inline-block" : "inline-block"}
            >
              {word}
              {"\u00A0"}
            </motion.span>
          ))}
        </h2>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          {t("subtitle")}
        </p>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div>
            <OutcomeCounters stats={stats} reducedMotion={reducedMotion} />

            <div className="mt-12 space-y-5">
              {points.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={reducedMotion ? false : { opacity: 0, x: -20 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="grid grid-cols-[2rem_1fr] gap-3"
                >
                  <span className="font-mono text-sm text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{point.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{point.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <PortfolioTiltCard
            disabled={mobile || reducedMotion}
            eyebrow={portfolio.eyebrow}
            role={portfolio.role}
            project={portfolio.project}
            shipped={portfolio.shipped}
            highlights={points.map((point) => point.title)}
          />
        </div>
      </div>
    </section>
  );
}
