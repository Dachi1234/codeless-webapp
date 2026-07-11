# Hardening: security & reliability fixes

Four high-severity issues found during the review, plus a regression test
harness. Operational runbooks (baselining the migration, configuring the
firewall) are in the root [`README.md`](../README.md); this doc is the rationale
and code map.

---

## 1. Missing Prisma migration history

**Problem.** The schema had been pushed to production with `prisma db push`, so
there was no migration history in the repo. Future schema changes could not be
deployed safely, and any environment rebuild was ad-hoc.

**Fix.** An initial migration is committed and the provider is locked:

- [`packages/db/prisma/migrations/20260711092400_initial/migration.sql`](../packages/db/prisma/migrations/20260711092400_initial/migration.sql)
  — creates `Lead` + `AdminUser`, the `LeadStatus` enum, and the indexes.
- [`packages/db/prisma/migrations/migration_lock.toml`](../packages/db/prisma/migrations/migration_lock.toml)
  — pins the provider.

**Production is already populated**, so the migration must be _baselined_, not
applied. Run once, against production:

```bash
pnpm --filter @codeless/db exec dotenv -e ../../.env -- \
  prisma migrate resolve --applied 20260711092400_initial
```

After that, every future migration deploys with `pnpm --filter @codeless/db
migrate:deploy`. Never run the initial SQL against the populated DB. Full
runbook: root README → _Migrations in production_.

---

## 2. Honeypot handling

**Problem.** The `website` honeypot field needed to (a) never break the typed
lead payload and (b) silently absorb bots instead of surfacing a validation
error a bot could learn from.

**Fix.** The honeypot is separated from the validated lead schema and checked
_before_ validation.

- [`apps/web/src/lib/validation.ts`](../apps/web/src/lib/validation.ts):
  `leadSchema` (the real payload) vs. `leadFormSchema` (adds the optional
  `website` field for the browser form). `isHoneypotPopulated()` inspects the
  raw input defensively.
- [`apps/web/src/lib/actions/register-lead.ts`](../apps/web/src/lib/actions/register-lead.ts):
  if the honeypot is populated the action returns `{ ok: true }` immediately —
  the bot "succeeds" but nothing is written. Only then does real validation +
  persistence run for genuine submissions.

---

## 3. Rate limiting (in-memory limiter + Vercel Firewall)

**Problem.** The only throttle was an in-memory limiter. On Vercel's serverless
/ multi-instance runtime that state is per-instance and resets on cold start —
unreliable as the primary control against abusive registration traffic.

**Fix — defense in depth:**

- **Edge (authoritative):** a **Vercel Firewall** rate-limit rule on the
  public-site project targets Server Action POSTs (`next-action` header) to `/`
  and `/en`, keyed by IP at 5 req / 60s → HTTP 429. Step-by-step setup and the
  "don't touch admin/auth routes" guardrails are in the root README →
  _Public registration rate limit (Vercel Firewall)_.
- **Application (defense in depth):** the existing per-IP in-memory limiter in
  `registerLead` stays on as a cheap second layer. IP is derived from
  `x-forwarded-for` / `x-real-ip`.

The firewall is the distributed control; the app limiter is a backstop.

---

## 4. CSV / spreadsheet formula injection

**Problem.** Lead fields (name, message, source, …) are attacker-controlled and
were exported straight into CSV. A value like `=CMD(...)` or `@SUM(...)` can
execute when the file is opened in Excel/Sheets (CSV injection).

**Fix.** A dedicated cell encoder neutralizes formula triggers and does proper
CSV quoting.

- [`apps/admin/src/lib/csv.ts`](../apps/admin/src/lib/csv.ts): any cell starting
  with `= + - @` (or tab/CR) is prefixed with a `'` so spreadsheets treat it as
  text; values containing `" , \n \r` are wrapped and inner quotes doubled.
- [`apps/admin/src/app/api/leads/export/route.ts`](../apps/admin/src/app/api/leads/export/route.ts):
  every field goes through `csvCell`; a UTF-8 BOM is prepended so Excel renders
  Georgian correctly. The route stays auth-gated (`auth()` → 401).

---

## Regression tests

[`tests/hardening.test.ts`](../tests/hardening.test.ts) (Node's built-in test
runner) locks in the four fixes:

- honeypot input parses **and** is detected → silent drop;
- a clean human lead still validates; empty honeypot is not flagged;
- `csvCell` prefixes `= + - @` formulas, escapes quotes, leaves Georgian intact;
- the initial migration + lock file exist and define both tables.

```bash
pnpm test:hardening
```
