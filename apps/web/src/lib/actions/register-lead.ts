"use server";

import { headers } from "next/headers";
import { prisma, LeadStatus } from "@codeless/db";
import { isHoneypotPopulated, leadSchema, type RegisterResult } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function registerLead(input: unknown): Promise<RegisterResult> {
  // Check untrusted input before validation so bots are silently accepted and
  // dropped even when the rest of their payload is invalid.
  if (isHoneypotPopulated(input)) {
    return { ok: true };
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  const data = parsed.data;

  // Rate limit by client IP (best-effort behind proxies).
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown";

  if (!rateLimit(`lead:${ip}`)) {
    return { ok: false, error: "rate_limit" };
  }

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        experienceLevel: data.experienceLevel || null,
        source: data.source || null,
        message: data.message || null,
        locale: data.locale,
        status: LeadStatus.NEW,
      },
    });
    return { ok: true };
  } catch (err) {
    console.error("registerLead failed", err);
    return { ok: false, error: "server" };
  }
}
