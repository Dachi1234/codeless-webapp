"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

type Doc = { name: string; type: string };
type Week = { label: string; title: string; learn: string; team: string; docs: Doc[] };

// Artifact type -> brand accent (mapped from the Claude palette onto our tokens).
const TYPE_COLORS: Record<string, string> = {
  pdf: "#FF6B3D",
  doc: "#5B8DEF",
  xls: "#3DDC84",
  fig: "#9B6DFF",
  md: "#FF7A45",
  app: "#F4F6FB",
  ppt: "#F5A524",
};

function WeekCard({ week, learnLabel, teamLabel }: { week: Week; learnLabel: string; teamLabel: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.025] backdrop-blur-sm">
      <div className="flex items-baseline gap-2.5 px-5 pb-3 pt-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-orange">
          {week.label}
        </span>
        <span className="font-display text-[17px] font-bold text-ink">{week.title}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="flex gap-2.5">
          <span className="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full bg-avatar-blue shadow-[0_0_8px_#5B8DEF]" />
          <div>
            <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-avatar-blue">
              {learnLabel}
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink/80">{week.learn}</p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <span className="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full bg-orange shadow-[0_0_8px_#FF6B3D]" />
          <div>
            <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-orange">
              {teamLabel}
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink/80">{week.team}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtifactChip({ doc }: { doc: Doc }) {
  const color = TYPE_COLORS[doc.type] ?? "#8A96B0";
  return (
    <div className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-navy-950/50 px-3.5 py-3">
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: color }} />
      <span
        className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md font-mono text-[8px] uppercase"
        style={{ backgroundColor: `${color}22`, border: `1px solid ${color}55`, color }}
      >
        {doc.type}
      </span>
      <span className="font-display text-[13.5px] font-semibold leading-tight text-ink/90">
        {doc.name}
      </span>
    </div>
  );
}

export function Curriculum() {
  const t = useTranslations("curriculum");
  const weeks = t.raw("weeks") as Week[];
  const total = weeks.reduce((sum, week) => sum + week.docs.length, 0);

  return (
    <section id="curriculum" className="section py-24 sm:py-32">
      <SectionHeading label={t("label")} title={t("title")} subtitle={t("subtitle")} />

      <Reveal delay={0.1} className="mt-14 sm:mt-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weeks.map((week) => (
            <WeekCard
              key={week.label}
              week={week}
              learnLabel={t("learnLabel")}
              teamLabel={t("teamLabel")}
            />
          ))}
        </div>
      </Reveal>

      <div className="mt-20">
        <Reveal className="mb-8 flex flex-wrap items-baseline justify-center gap-2 text-center">
          <span className="font-display text-4xl font-extrabold text-orange sm:text-5xl">
            {total}
          </span>
          <span className="font-display text-xl font-semibold text-ink">{t("countLabel")}</span>
        </Reveal>

        <div className="space-y-8">
          {weeks.map((week) => (
            <Reveal key={week.label} delay={0.03}>
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  {week.label} · {week.title}
                </span>
                <span className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[11px] text-muted">{week.docs.length}</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {week.docs.map((doc) => (
                  <ArtifactChip key={`${week.label}-${doc.name}`} doc={doc} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
