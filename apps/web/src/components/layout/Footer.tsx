import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-navy-deep">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-4">
            <Logo glow />
            <p className="text-sm leading-relaxed text-muted">{t("tagline")}</p>
            <p className="text-xs font-medium tracking-wide text-orange">{t("location")}</p>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t("nav")}
            </span>
            <a href="#how" className="text-sm text-ink/75 transition-colors hover:text-ink">
              {nav("howItWorks")}
            </a>
            <a href="#team" className="text-sm text-ink/75 transition-colors hover:text-ink">
              {nav("team")}
            </a>
            <a href="#outcomes" className="text-sm text-ink/75 transition-colors hover:text-ink">
              {nav("outcomes")}
            </a>
            <a href="#register" className="text-sm text-ink/75 transition-colors hover:text-ink">
              {nav("register")}
            </a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted sm:flex-row">
          <span>
            © {year} CodeLess. {t("rights")}.
          </span>
          <span className="tracking-wide">codeless.ge · Tbilisi</span>
        </div>
      </div>
    </footer>
  );
}
