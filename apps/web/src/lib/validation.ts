import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "name").max(120),
  email: z.string().trim().email("email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  experienceLevel: z.enum(["none", "some", "experienced"]).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  locale: z.enum(["ka", "en"]).default("ka"),
});

// The honeypot belongs to the browser form, not the validated lead payload.
// It intentionally accepts any string so bots reach the server-side silent drop.
export const leadFormSchema = leadSchema.extend({
  website: z.string().optional(),
});

export type LeadFormInput = z.input<typeof leadFormSchema>;

export function isHoneypotPopulated(input: unknown): boolean {
  if (typeof input !== "object" || input === null || !("website" in input)) {
    return false;
  }

  const value = (input as Record<string, unknown>).website;
  return value !== undefined && value !== null && value !== "";
}

export type RegisterResult =
  { ok: true } | { ok: false; error: "validation" | "rate_limit" | "server" };
