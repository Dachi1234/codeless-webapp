import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "name").max(120),
  email: z.string().trim().email("email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  experienceLevel: z.enum(["none", "some", "experienced"]).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  locale: z.enum(["ka", "en"]).default("ka"),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type RegisterResult =
  | { ok: true }
  | { ok: false; error: "validation" | "rate_limit" | "server" };
