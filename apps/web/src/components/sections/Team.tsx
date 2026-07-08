"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mascot } from "@/components/brand/Mascot";
import { Reveal } from "@/components/motion/Reveal";
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
              <span className="px-3 text-[13px] font-bold leading-tight text-ink">
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
                  className="card px-4 py-3 text-center transition-colors duration-300 hover:border-orange/40"
                >
                  <span
                    className="mx-auto mb-1.5 block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
                  />
                  <p className="text-sm font-bold text-ink">{m.name}</p>
                  <p className="text-xs text-orange">{m.role}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stacked (mobile) */}
      <div className="mt-12 grid gap-4 md:hidden">
        <div className="card-us flex items-center gap-3 p-5">
          <Mascot glow className="h-8 w-auto" />
          <span className="text-base font-bold text-ink">{t("center")}</span>
        </div>
        {members.map((m, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="card flex items-start gap-3 p-5">
              <span
                className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
              />
              <div>
                <p className="text-sm font-bold text-ink">
                  {m.name} <span className="font-normal text-orange">· {m.role}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{m.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
