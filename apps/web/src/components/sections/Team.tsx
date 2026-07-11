"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Mascot } from "@/components/brand/Mascot";
import { useMotionTier } from "@/lib/motion/useMotionTier";
import { TEAM_ACCENTS as ACCENTS } from "@/components/team/roleIcons";
import type { TeamMember } from "@/components/team/TeamOrbit";
import { SectionHeading } from "./SectionHeading";

const TeamOrbit = dynamic(
  () => import("@/components/team/TeamOrbit").then((module) => module.TeamOrbit),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="mx-auto aspect-[16/10] w-full max-w-6xl animate-pulse rounded-[2.5rem] border border-white/10 bg-white/[0.025]"
      />
    ),
  },
);

function TeamSpine({ members, center }: { members: TeamMember[]; center: string }) {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="absolute bottom-6 left-6 top-14 w-px -translate-x-1/2 bg-gradient-to-b from-orange/60 via-orange/25 to-transparent" />

      <div className="relative mb-6 grid grid-cols-[48px_1fr] items-center gap-4">
        <div className="flex justify-center">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-orange/40 bg-navy shadow-glow">
            <Mascot glow className="h-5 w-auto" />
          </div>
        </div>
        <p className="text-base font-bold text-ink">{center}</p>
      </div>

      <div className="space-y-5">
        {members.map((member, index) => (
          <div
            key={`${member.name}-${member.role}`}
            className="relative grid grid-cols-[48px_1fr] items-start gap-4"
          >
            <div className="flex justify-center pt-1">
              <span className="z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-navy">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ACCENTS[index % ACCENTS.length] }}
                />
              </span>
            </div>
            <div>
              <p className="text-[15px] font-bold leading-snug text-ink">
                {member.name} <span className="font-normal text-orange">· {member.role}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{member.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Team() {
  const t = useTranslations("team");
  const members = t.raw("members") as TeamMember[];
  const tier = useMotionTier();
  const showOrbit = tier === "full";

  return (
    <section id="team" className="section py-24 sm:py-32">
      <SectionHeading label={t("label")} title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-14 sm:mt-20">
        {showOrbit ? (
          <TeamOrbit members={members} center={t("center")} />
        ) : (
          <TeamSpine members={members} center={t("center")} />
        )}
      </div>
    </section>
  );
}
