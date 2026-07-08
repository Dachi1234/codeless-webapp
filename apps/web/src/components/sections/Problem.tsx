"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Mascot } from "@/components/brand/Mascot";

type ChatMsg = { name: string; time: string; text: string };

const AVATARS = ["#3DDC84", "#5B8DEF", "#E23B3B", "#9B6DFF"];

export function Problem() {
  const t = useTranslations("problem");
  const chat = t.raw("chat") as ChatMsg[];

  return (
    <section id="problem" className="section py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Copy */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <span className="eyebrow mb-6">{t("label")}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="max-w-xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {t("body")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md text-lg font-semibold text-orange sm:text-xl">
              {t("decision")}
            </p>
          </Reveal>
        </div>

        {/* Clean team-chat panel (the reality) */}
        <Reveal delay={0.05} className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-md">
            {/* soft bloom */}
            <div className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[2rem] bg-orange/20 blur-3xl" />

            <div className="card overflow-hidden">
              {/* header */}
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange/15">
                  <Mascot className="h-5 w-auto" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{t("chatTitle")}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {t("chatStatus")}
                  </p>
                </div>
              </div>

              {/* messages */}
              <div className="space-y-4 p-5">
                {chat.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.15 + i * 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: AVATARS[i % AVATARS.length] }}
                    >
                      {m.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-ink">{m.name}</span>
                        <span className="text-[11px] text-muted">{m.time}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-white/[0.05] px-3.5 py-2.5 text-sm leading-relaxed text-ink/85">
                        {m.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
