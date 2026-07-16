"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useMotionTier } from "@/lib/motion/useMotionTier";
import { TeamRelayStatic } from "@/components/team/TeamRelayMobile";
import type { RelayRole } from "@/components/team/relayShared";

const TeamRelay = dynamic(
  () => import("@/components/team/TeamRelay").then((m) => m.TeamRelay),
  { ssr: false },
);

const TeamRelayMobile = dynamic(
  () => import("@/components/team/TeamRelayMobile").then((m) => m.TeamRelayMobile),
  { ssr: false },
);

export function Team() {
  const t = useTranslations("team");
  const roles = t.raw("roles") as RelayRole[];
  const stages = t.raw("stages") as string[];
  const tier = useMotionTier();

  const shared = { label: t("label"), title: t("title"), hint: t("hint"), roles };

  // Reduced-motion / no-WebGL gets the accessible static timeline.
  if (tier === "static") {
    return <TeamRelayStatic {...shared} stages={stages} />;
  }

  // Touch / small screens get the scroll-revealed vertical timeline; the pinned
  // scroll-scrubbed snake is desktop-only.
  if (tier === "lite") {
    return <TeamRelayMobile {...shared} stages={stages} />;
  }

  return <TeamRelay {...shared} stages={stages} />;
}
