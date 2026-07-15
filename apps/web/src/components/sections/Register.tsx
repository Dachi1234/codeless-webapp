"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { registerLead } from "@/lib/actions/register-lead";
import { Mascot } from "@/components/brand/Mascot";
import { Reveal } from "@/components/motion/Reveal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register() {
  const t = useTranslations("register");
  const locale = useLocale() as "ka" | "en";
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError(t("errors.email"));
      return;
    }

    // The DB keeps a non-null name; derive a sensible one from the address so the
    // minimal Claude-style form stays email-only without a schema migration.
    const local = trimmed.split("@")[0]?.trim() ?? "";
    const name = local.length >= 2 ? local : "Applicant";

    setStatus("submitting");
    const result = await registerLead({ name, email: trimmed, website, locale });
    if (result.ok) {
      setStatus("done");
      setEmail("");
    } else {
      setStatus("idle");
      setError(t("errors.generic"));
    }
  };

  return (
    <section id="register" className="section scroll-mt-24 py-24 sm:py-32">
      <Reveal
        className="relative mx-auto max-w-[760px] overflow-hidden rounded-[28px] border border-orange/30 p-8 text-center sm:p-14"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, rgba(255,107,61,0.16), rgba(10,14,26,0.6))",
          boxShadow: "0 40px 120px rgba(255,107,61,0.18)",
        }}
      >
        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                <Mascot glow className="h-16 w-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold text-ink">{t("success.title")}</h3>
              <p className="max-w-sm text-muted">{t("success.body")}</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="eyebrow-orange mb-4">{t("label")}</span>
              <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                {t("title")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {t("subtitle")}
              </p>

              <form
                onSubmit={onSubmit}
                className="mx-auto mt-9 flex max-w-xl flex-wrap justify-center gap-3"
                noValidate
              >
                {/* Honeypot (off-screen) */}
                <div
                  className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                  aria-hidden
                >
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </label>
                </div>

                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("fields.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label={t("fields.email")}
                  className="min-w-[240px] flex-1 rounded-full border border-white/16 bg-navy-950/70 px-5 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-orange/60"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="rounded-full bg-orange px-7 py-3.5 text-base font-semibold text-navy-950 shadow-glow transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "submitting" ? t("submitting") : t("submit")}
                </button>
              </form>

              {error && (
                <p className="mx-auto mt-3 max-w-xl text-sm text-danger">{error}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
