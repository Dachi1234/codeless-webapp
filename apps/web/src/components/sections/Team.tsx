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

export function Team() {
  const t = useTranslations("team");
  const roles = t.raw("roles") as RelayRole[];
  const stages = t.raw("stages") as string[];
  const tier = useMotionTier();

  const shared = { label: t("label"), title: t("title"), hint: t("hint"), roles };

  // Reduced-motion / no-WebGL gets the accessible vertical fallback. Everyone else
  // (mobile included, like the Claude prototype) gets the full scroll-driven snake.
  if (tier === "static") {
    return <TeamRelayStatic {...shared} hint={t("hintMobile")} />;
  }

  return <TeamRelay {...shared} stages={stages} />;
}
