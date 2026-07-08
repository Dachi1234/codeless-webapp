"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mascot } from "@/components/brand/Mascot";
import { SectionHeading } from "./SectionHeading";

type Member = { name: string; role: string; desc: string };

const ACCENTS = ["#3DDC84", "#5B8DEF", "#FF6B3D", "#9B6DFF", "#E23B3B"];
const RADIUS = 40; // percent of the orbit box (shared by ring, lines and nodes)

function nodePos(index: number, total: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  return {
    xPct: 50 + RADIUS * Math.cos(angle),
    yPct: 50 + RADIUS * Math.sin(angle),
  };
}

export function Team() {
  const t = useTranslations("team");
  const members = t.raw("members") as Member[];

  return (
    <section id="team" className="section py-24 sm:py-32">
      <SectionHeading label={t("label")} title={t("title")} subtitle={t("subtitle")} />

      {/* Orbit (desktop) */}
      <div className="mt-20 hidden md:block">
        <div className="relative mx-auto aspect-square w-full max-w-[620px]">
          {/* ring + connector lines (shared coordinate system) */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="#FF6B3D"
              strokeOpacity="0.18"
              strokeWidth="0.25"
            />
            {members.map((_, i) => {
              const p = nodePos(i, members.length);
              return (
                <motion.line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={p.xPct}
                  y2={p.yPct}
                  stroke="#FF6B3D"
                  strokeWidth="0.25"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.35 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.1, duration: 0.6 }}
                />
              );
            })}
          </svg>

          {/* center hub (positioning on wrapper; scale animation on inner so
              framer's inline transform doesn't clobber the centering translate) */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full border border-orange/40 bg-navy/90 text-center shadow-glow backdrop-blur"
            >
              <Mascot glow className="h-9 w-auto" />
              <span className="px-3 text-[13px] font-bold leading-snug text-ink">
                {t("center")}
              </span>
            </motion.div>
          </div>

          {/* nodes */}
          {members.map((m, i) => {
            const p = nodePos(i, members.length);
            return (
              <div
                key={i}
                style={{ left: `${p.xPct}%`, top: `${p.yPct}%` }}
                className="absolute z-20 w-36 -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="card px-4 py-4 text-center transition-colors duration-300 hover:border-orange/40"
                >
                  <span
                    className="mx-auto mb-2.5 block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                  />
                  <p className="text-sm font-bold leading-snug text-ink">{m.name}</p>
                  <p className="mt-1 text-xs leading-snug text-orange">{m.role}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected "team spine" (mobile) */}
      <div className="mt-10 md:hidden">
        <div className="relative mx-auto max-w-sm">
          {/* vertical connector line, centred on the 48px marker column */}
          <div className="absolute bottom-6 left-6 top-14 w-px -translate-x-1/2 bg-gradient-to-b from-orange/60 via-orange/25 to-transparent" />

          {/* PM hub */}
          <div className="relative mb-6 grid grid-cols-[48px_1fr] items-center gap-4">
            <div className="flex justify-center">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-orange/40 bg-navy shadow-glow">
                <Mascot glow className="h-5 w-auto" />
              </div>
            </div>
            <p className="text-base font-bold text-ink">{t("center")}</p>
          </div>

          {/* agents */}
          <div className="space-y-5">
            {members.map((m, i) => (
              <div key={i} className="relative grid grid-cols-[48px_1fr] items-start gap-4">
                <div className="flex justify-center pt-1">
                  <span className="z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-navy">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                    />
                  </span>
                </div>
                <div>
                  <p className="text-[15px] font-bold leading-snug text-ink">
                    {m.name} <span className="font-normal text-orange">· {m.role}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
