import { auth } from "@/auth";
import { prisma } from "@codeless/db";
import { buildLeadWhere } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const where = buildLeadWhere({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    locale: searchParams.get("locale") ?? undefined,
  });

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "createdAt",
    "name",
    "email",
    "phone",
    "experienceLevel",
    "source",
    "message",
    "locale",
    "status",
  ];

  const rows = leads.map((l) =>
    [
      l.createdAt.toISOString(),
      l.name,
      l.email,
      l.phone,
      l.experienceLevel,
      l.source,
      l.message,
      l.locale,
      l.status,
    ]
      .map(csvCell)
      .join(","),
  );

  // Prepend BOM so Excel reads UTF-8 (Georgian) correctly.
  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="codeless-leads-${date}.csv"`,
    },
  });
}
