"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./SectionHeading";

type Step = { step: string; title: string; desc: string };

export function HowItWorks() {
  const t = useTranslations("how");
  const steps = t.raw("steps") as Step[];
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section id="how" className="section py-24 sm:py-32">
      <SectionHeading label={t("label")} title={t("title")} subtitle={t("subtitle")} />

      <div ref={ref} className="relative mx-auto mt-16 max-w-2xl">
        {/* track */}
        <div className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-0.5 bg-white/10 sm:left-[27px]" />
        {/* animated fill */}
        <motion.div
          style={{ scaleY: progress }}
          className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-0.5 origin-top bg-orange-sheen sm:left-[27px]"
        />

        <ol className="space-y-10">
          {steps.map((s, i) => (
            <motion.li
              key={s.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative flex items-start gap-5 pl-0 sm:gap-7"
            >
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange/50 bg-navy font-mono text-sm font-bold text-orange shadow-glow sm:h-14 sm:w-14 sm:text-base">
                {s.step}
              </span>
              <div className="pt-1 sm:pt-3">
                <h3 className="text-lg font-bold text-ink sm:text-xl">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted sm:text-base">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
