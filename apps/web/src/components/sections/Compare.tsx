"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMotionTier } from "@/lib/motion/useMotionTier";
import {
  CompareShredder,
  CompareShredderStatic,
  type ShredderCopy,
} from "@/components/compare/CompareShredder";

export function Compare() {
  const t = useTranslations("compare");
  const locale = useLocale();
  const tier = useMotionTier();

  const copy: ShredderCopy = {
    label: t("label"),
    title: t("title"),
    paperLabel: t("paperLabel"),
    paperLines: t.raw("paperLines") as string[],
    shredLabel: t("shredLabel"),
    outcomes: t.raw("outcomes") as string[],
  };

  // Reduced-motion / no-WebGL gets the accessible static fallback. Everyone else
  // (mobile included, like the Claude prototype) gets the full canvas shredder.
  if (tier === "static") {
    return (
      <div lang={locale}>
        <CompareShredderStatic copy={copy} />
      </div>
    );
  }

  return (
    <div lang={locale}>
      <CompareShredder copy={copy} />
    </div>
  );
}
