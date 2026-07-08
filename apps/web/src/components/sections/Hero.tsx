"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mascot } from "@/components/brand/Mascot";
import { LinkButton } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export function Hero() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-32 text-center"
    >
      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center">
        {/* Floating mascot: parallax and float are on separate elements so they don't fight. */}
        <motion.div style={{ y: mascotY }} className="mb-10">
          <motion.div
            animate={reduced ? undefined : { y: [0, -12, 0] }}
            transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 -z-10 blur-3xl">
                <div className="mx-auto h-28 w-28 rounded-full bg-orange/40" />
              </div>
              <Mascot glow className="h-20 w-auto sm:h-24" />
            </div>
          </motion.div>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow-orange mb-8"
        >
          {t("badge")}
        </motion.span>

        <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.3] tracking-tight sm:text-5xl md:text-6xl">
          <span className="block pb-[0.06em] text-ink">{t("titleLine1")}</span>
          <span className="mt-1 block text-gradient">{t("titleLine2")}</span>
        </h1>

        <p className="mt-9 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <LinkButton href="#register" size="lg">
            {t("ctaPrimary")}
          </LinkButton>
          <LinkButton href="#how" size="lg" variant="outline">
            {t("ctaSecondary")}
          </LinkButton>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted">
          <span>{t("scrollCue")}</span>
          <motion.span
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={reduced ? undefined : { duration: 1.6, repeat: Infinity }}
            className="block h-9 w-5 rounded-full border border-white/20"
          >
            <span className="mx-auto mt-1.5 block h-2 w-1 rounded-full bg-orange" />
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}
