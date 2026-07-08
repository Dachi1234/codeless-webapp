import { Prisma, LeadStatus } from "@codeless/db";

export type LeadFilters = {
  q?: string;
  status?: string;
  locale?: string;
};

/** Build a Prisma `where` from URL filters, shared by the table and CSV export. */
export function buildLeadWhere(filters: LeadFilters): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};

  if (filters.q && filters.q.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters.status && filters.status in LeadStatus) {
    where.status = filters.status as LeadStatus;
  }

  if (filters.locale === "ka" || filters.locale === "en") {
    where.locale = filters.locale;
  }

  return where;
}

export const PAGE_SIZE = 20;
