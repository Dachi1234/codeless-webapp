"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/brand/Logo";
import { LinkButton } from "@/components/ui/Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { cn } from "@/lib/utils";

export function Nav() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-navy-deep/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="CodeLess home" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm text-ink/75 transition-colors hover:text-ink">
            {t("howItWorks")}
          </a>
          <a href="#team" className="text-sm text-ink/75 transition-colors hover:text-ink">
            {t("team")}
          </a>
          <a href="#outcomes" className="text-sm text-ink/75 transition-colors hover:text-ink">
            {t("outcomes")}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <LinkButton href="#register" size="md" className="hidden sm:inline-flex">
            {t("register")}
          </LinkButton>
        </div>
      </nav>
    </header>
  );
}
