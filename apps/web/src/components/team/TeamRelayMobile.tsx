"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mascot } from "@/components/brand/Mascot";
import { RELAY_NODES, type RelayRole } from "./relayShared";

type Props = { label: string; title: string; hint: string; roles: RelayRole[] };

/**
 * `lite` (touch) tier: a vertical relay thread. The orange line fills as the
 * section scrolls through the viewport; each role card carries its brand accent.
 */
export function TeamRelayMobile({ label, title, hint, roles }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 40%"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="team" className="section py-20 sm:py-28">
      <div className="text-center">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-orange">{label}</div>
        <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/70">{hint}</p>
      </div>

      <div ref={ref} className="relative mx-auto mt-12 max-w-md pl-2">
        {/* rail */}
        <div className="absolute bottom-3 left-[11px] top-3 w-px bg-white/10" />
        <motion.div
          style={{ height: fillHeight }}
          className="absolute left-[11px] top-3 w-px bg-gradient-to-b from-orange to-orange/40 shadow-[0_0_10px_rgba(255,107,61,0.7)]"
        />

        <div className="space-y-6">
          {roles.map((role, index) => {
            const node = RELAY_NODES[index]!;
            const isPM = index === RELAY_NODES.length - 1;
            return (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="relative grid grid-cols-[34px_1fr] items-start gap-4"
              >
                <div className="flex justify-center pt-1">
                  {isPM ? (
                    <span className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-orange/50 bg-navy-950 shadow-glow">
                      <Mascot glow className="h-4 w-auto" />
                    </span>
                  ) : (
                    <span
                      className="z-10 h-4 w-4 rounded-full border-2"
                      style={{ background: node.accent, borderColor: node.accent }}
                    />
                  )}
                </div>
                <div
                  className="rounded-[14px] border bg-navy-950/60 p-4"
                  style={{ borderColor: `${node.accent}44` }}
                >
                  <div className="font-display text-base font-bold text-ink">{role.name}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{role.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** `static` tier: same vertical relay without motion. */
export function TeamRelayStatic({ label, title, hint, roles }: Props) {
  return (
    <section id="team" className="section py-20 sm:py-28">
      <div className="text-center">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-orange">{label}</div>
        <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/70">{hint}</p>
      </div>

      <div className="relative mx-auto mt-12 max-w-md pl-2">
        <div className="absolute bottom-3 left-[11px] top-3 w-px bg-gradient-to-b from-orange/60 via-orange/25 to-transparent" />
        <div className="space-y-6">
          {roles.map((role, index) => {
            const node = RELAY_NODES[index]!;
            const isPM = index === RELAY_NODES.length - 1;
            return (
              <div
                key={role.name}
                className="relative grid grid-cols-[34px_1fr] items-start gap-4"
              >
                <div className="flex justify-center pt-1">
                  {isPM ? (
                    <span className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-orange/50 bg-navy-950 shadow-glow">
                      <Mascot glow className="h-4 w-auto" />
                    </span>
                  ) : (
                    <span
                      className="z-10 h-4 w-4 rounded-full border-2"
                      style={{ background: node.accent, borderColor: node.accent }}
                    />
                  )}
                </div>
                <div
                  className="rounded-[14px] border bg-navy-950/60 p-4"
                  style={{ borderColor: `${node.accent}44` }}
                >
                  <div className="font-display text-base font-bold text-ink">{role.name}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{role.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
