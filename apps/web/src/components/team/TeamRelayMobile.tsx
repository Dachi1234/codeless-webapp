"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mascot } from "@/components/brand/Mascot";
import { RELAY_NODES, type RelayRole } from "./relayShared";

type Props = {
  label: string;
  title: string;
  hint: string;
  roles: RelayRole[];
  stages?: string[];
};

/** What each role hands off to the next — pulled from the relay `stages`. */
function handoffFor(index: number, stages?: string[]): string {
  if (!stages || stages.length === 0) return "";
  return stages[index + 1] ?? stages[stages.length - 1] ?? "";
}

function TimelineItem({
  role,
  index,
  total,
  stages,
  animated,
}: {
  role: RelayRole;
  index: number;
  total: number;
  stages?: string[];
  animated: boolean;
}) {
  const node = RELAY_NODES[index]!;
  const isPM = index === total - 1;
  const step = String(index + 1).padStart(2, "0");
  const handoff = handoffFor(index, stages);
  const accent = isPM ? "#FF6B3D" : node.accent;

  const content = (
    <>
      <div className="flex justify-center pt-1.5">
        {isPM ? (
          <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-orange/50 bg-navy-950 shadow-glow">
            <Mascot glow className="h-4 w-auto" />
          </span>
        ) : (
          <span
            className="relative z-10 h-3.5 w-3.5 rounded-full"
            style={{ background: node.accent, boxShadow: `0 0 12px ${node.accent}` }}
          />
        )}
      </div>
      <div
        className={`rounded-2xl border bg-white/[0.03] p-4 backdrop-blur ${isPM ? "shadow-glow" : ""}`}
        style={{ borderColor: isPM ? "rgba(255,107,61,0.5)" : `${node.accent}3a` }}
      >
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] text-muted/80">{step}</span>
          <span className="font-display text-base font-bold text-ink">{role.name}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{role.desc}</p>
        {handoff ? (
          <div
            className="mt-3 inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: accent, background: `${accent}14` }}
          >
            {handoff}
          </div>
        ) : null}
      </div>
    </>
  );

  if (!animated) {
    return (
      <div className="relative grid grid-cols-[34px_1fr] items-start gap-4">{content}</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="relative grid grid-cols-[34px_1fr] items-start gap-4"
    >
      {content}
    </motion.div>
  );
}

function Header({ label, title, hint }: { label: string; title: string; hint: string }) {
  return (
    <div className="text-center">
      <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-orange">{label}</div>
      <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted/70">{hint}</p>
    </div>
  );
}

/**
 * `lite` (touch) tier: a vertical relay timeline. The orange rail fills as the
 * section scrolls through the viewport; each role card carries its brand accent
 * and the artifact it hands to the next teammate.
 */
export function TeamRelayMobile({ label, title, hint, roles, stages }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="team" className="section py-20 sm:py-28">
      <Header label={label} title={title} hint={hint} />

      <div ref={ref} className="relative mx-auto mt-12 max-w-md">
        {/* rail */}
        <div className="absolute bottom-2 left-[16px] top-2 w-px bg-white/10" />
        <motion.div
          style={{ height: fillHeight }}
          className="absolute left-[16px] top-2 w-px bg-gradient-to-b from-orange to-orange/40 shadow-[0_0_10px_rgba(255,107,61,0.7)]"
        />

        <div className="space-y-6">
          {roles.map((role, index) => (
            <TimelineItem
              key={role.name}
              role={role}
              index={index}
              total={roles.length}
              stages={stages}
              animated
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** `static` tier: the same vertical timeline without motion. */
export function TeamRelayStatic({ label, title, hint, roles, stages }: Props) {
  return (
    <section id="team" className="section py-20 sm:py-28">
      <Header label={label} title={title} hint={hint} />

      <div className="relative mx-auto mt-12 max-w-md">
        <div className="absolute bottom-2 left-[16px] top-2 w-px bg-gradient-to-b from-orange/60 via-orange/25 to-transparent" />
        <div className="space-y-6">
          {roles.map((role, index) => (
            <TimelineItem
              key={role.name}
              role={role}
              index={index}
              total={roles.length}
              stages={stages}
              animated={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
