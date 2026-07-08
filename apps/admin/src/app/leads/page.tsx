import Link from "next/link";
import { prisma } from "@codeless/db";
import { auth } from "@/auth";
import { Mascot } from "@/components/Mascot";
import { StatusBadge } from "@/components/StatusBadge";
import { buildLeadWhere, PAGE_SIZE } from "@/lib/leads";
import { doSignOut } from "@/lib/auth-actions";
import { updateLeadStatus } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== null) sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const session = await auth();

  const q = str(sp.q);
  const status = str(sp.status);
  const locale = str(sp.locale);
  const page = Math.max(1, parseInt(str(sp.page) || "1", 10) || 1);

  const where = buildLeadWhere({ q, status, locale });

  const [total, newCount, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportHref = `/api/leads/export${buildQuery({ q, status, locale })}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mascot className="h-8 w-auto drop-shadow-[0_0_16px_rgba(255,107,61,0.5)]" />
          <div>
            <h1 className="text-lg font-bold leading-none">
              Code<span className="text-orange">Less</span> Leads
            </h1>
            <p className="mt-1 text-xs text-muted">{session?.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={exportHref} className="btn-ghost">
            Export CSV
          </a>
          <form action={doSignOut}>
            <button type="submit" className="btn-ghost">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Total</p>
          <p className="mt-1 text-2xl font-bold">{total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-muted">New</p>
          <p className="mt-1 text-2xl font-bold text-orange">{newCount}</p>
        </div>
      </div>

      {/* Filters */}
      <form method="get" className="mb-5 flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-xs font-medium text-muted">Search</label>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Name, email or phone"
            className="field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Status</label>
          <select name="status" defaultValue={status} className="field">
            <option value="">All</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Language</label>
          <select name="locale" defaultValue={locale} className="field">
            <option value="">All</option>
            <option value="ka">KA</option>
            <option value="en">EN</option>
          </select>
        </div>
        <button type="submit" className="btn">
          Filter
        </button>
        {(q || status || locale) && (
          <Link href="/leads" className="btn-ghost">
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Exp.</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Lang</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-muted">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {lead.createdAt.toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="text-orange hover:underline">
                        {lead.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{lead.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{lead.experienceLevel ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{lead.source ?? "—"}</td>
                    <td className="px-4 py-3 uppercase text-muted">{lead.locale}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {lead.status !== "CONTACTED" && (
                          <form action={updateLeadStatus}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input type="hidden" name="status" value="CONTACTED" />
                            <button
                              type="submit"
                              className="rounded-md border border-success/30 px-2 py-1 text-xs text-success transition-colors hover:bg-success/10"
                            >
                              Contacted
                            </button>
                          </form>
                        )}
                        {lead.status !== "ARCHIVED" && (
                          <form action={updateLeadStatus}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input type="hidden" name="status" value="ARCHIVED" />
                            <button
                              type="submit"
                              className="rounded-md border border-white/15 px-2 py-1 text-xs text-muted transition-colors hover:bg-white/5"
                            >
                              Archive
                            </button>
                          </form>
                        )}
                        {lead.status !== "NEW" && (
                          <form action={updateLeadStatus}>
                            <input type="hidden" name="id" value={lead.id} />
                            <input type="hidden" name="status" value="NEW" />
                            <button
                              type="submit"
                              className="rounded-md border border-orange/30 px-2 py-1 text-xs text-orange transition-colors hover:bg-orange/10"
                            >
                              New
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {page} of {totalPages} · {total} leads
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/leads${buildQuery({ q, status, locale, page: page - 1 })}`}
                className="btn-ghost"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/leads${buildQuery({ q, status, locale, page: page + 1 })}`}
                className="btn-ghost"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
