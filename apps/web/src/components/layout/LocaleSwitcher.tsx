"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const next: Locale = locale === "ka" ? "en" : "ka";

  return (
    <button
      type="button"
      aria-label={`Switch language to ${next.toUpperCase()}`}
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }}
      className={cn(
        "rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-ink/80 transition-colors hover:border-orange/60 hover:text-ink",
        className,
      )}
    >
      {next.toUpperCase()}
    </button>
  );
}
