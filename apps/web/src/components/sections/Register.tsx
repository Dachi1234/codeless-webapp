"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { registerLead } from "@/lib/actions/register-lead";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/brand/Mascot";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-orange/60 focus:bg-white/[0.05]";

export function Register() {
  const t = useTranslations("register");
  const locale = useLocale() as "ka" | "en";
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { locale, website: "" },
  });

  const onSubmit = async (values: LeadInput) => {
    setServerError(null);
    const result = await registerLead({ ...values, locale });
    if (result.ok) {
      setDone(true);
      reset();
    } else {
      setServerError(t("errors.generic"));
    }
  };

  return (
    <section id="register" className="section scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-10 text-center">
          <span className="eyebrow-orange mb-4">{t("label")}</span>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="card-us relative overflow-hidden p-6 sm:p-9">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
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
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* Honeypot (visually hidden, off-screen) */}
                  <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
                    <label>
                      Website
                      <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">
                        {t("fields.name")}
                      </label>
                      <input
                        className={cn(fieldClass, errors.name && "border-danger/70")}
                        placeholder={t("fields.namePlaceholder")}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-danger">{t("errors.name")}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">
                        {t("fields.email")}
                      </label>
                      <input
                        type="email"
                        className={cn(fieldClass, errors.email && "border-danger/70")}
                        placeholder={t("fields.emailPlaceholder")}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-danger">{t("errors.email")}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">
                        {t("fields.phone")}
                      </label>
                      <input
                        className={fieldClass}
                        placeholder={t("fields.phonePlaceholder")}
                        {...register("phone")}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">
                        {t("fields.experience")}
                      </label>
                      <select className={cn(fieldClass, "appearance-none")} {...register("experienceLevel")}>
                        <option value="">—</option>
                        <option value="none">{t("fields.experienceOptions.none")}</option>
                        <option value="some">{t("fields.experienceOptions.some")}</option>
                        <option value="experienced">
                          {t("fields.experienceOptions.experienced")}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      {t("fields.source")}
                    </label>
                    <input
                      className={fieldClass}
                      placeholder={t("fields.sourcePlaceholder")}
                      {...register("source")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      {t("fields.message")}
                    </label>
                    <textarea
                      rows={3}
                      className={cn(fieldClass, "resize-none")}
                      placeholder={t("fields.messagePlaceholder")}
                      {...register("message")}
                    />
                  </div>

                  {serverError && (
                    <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                      {serverError}
                    </p>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t("submitting") : t("submit")}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
