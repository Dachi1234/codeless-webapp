# CodeLess — WebGL course site + admin

A pnpm/Turborepo monorepo with two independent, separately-deployed Next.js apps that share only a Neon Postgres database:

- **`apps/web`** — the public, bilingual (Georgian default / English) marketing site with a hybrid-WebGL scroll experience and a no-payment "register your interest" lead form.
- **`apps/admin`** — a separately-domained, Auth.js-secured dashboard to view, filter and export leads.
- **`packages/db`** — the shared Prisma schema + client (the only thing the two apps have in common).

Built so future user auth, enrollments and Stripe payments can be added without re-architecture (see the reserved models in the Prisma schema).

> Engineering notes (hardening fixes, the motion-tier system, and each immersive
> section redesign) live in [`docs/`](./docs/README.md).

## Stack

| Area          | Tech                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | Next.js 15 (App Router) + TypeScript                                      |
| Styling       | Tailwind CSS (brand tokens)                                               |
| WebGL         | three, @react-three/fiber, @react-three/drei, @react-three/postprocessing |
| Scroll/motion | lenis, gsap ScrollTrigger, framer-motion                                  |
| i18n          | next-intl (`ka` default, `en`)                                            |
| Forms         | react-hook-form + zod                                                     |
| Database      | Neon Postgres + Prisma                                                    |
| Admin auth    | Auth.js (NextAuth v5) Credentials + bcrypt                                |
| Monorepo      | pnpm workspaces + Turborepo                                               |

## Prerequisites

- Node.js >= 20 (tested on 24)
- pnpm 9 (`npm i -g pnpm@9`)
- A Neon Postgres database ([console.neon.tech](https://console.neon.tech))

## 1. Install

```bash
pnpm install
```

This also runs `prisma generate` (via the `@codeless/db` postinstall).

## 2. Environment

Copy the example and fill it in at the repo root:

```bash
cp .env.example .env
```

- `DATABASE_URL` — Neon **pooled** connection string.
- `DIRECT_URL` — Neon **direct** connection string (used for migrations).
- `AUTH_SECRET` — admin session secret. Generate: `npx auth secret` or `openssl rand -base64 32`.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the first admin user (used by the seed).

## 3. Database

```bash
pnpm db:migrate     # create a new migration while developing
pnpm db:seed        # create the first admin user (+ demo leads if SEED_DEMO_LEADS=true)
```

Useful:

```bash
pnpm db:generate    # regenerate the Prisma client
pnpm --filter @codeless/db studio   # open Prisma Studio
```

## 4. Develop

```bash
pnpm dev            # runs both apps via Turborepo
# or individually:
pnpm dev:web        # http://localhost:3000  (public site)
pnpm dev:admin      # http://localhost:3001  (admin dashboard)
```

Sign in to the admin at http://localhost:3001/login with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## 5. Deploy (two Vercel projects, one repo)

Create **two** Vercel projects from this same repository:

### Public site

- **Root Directory:** `apps/web`
- **Domain:** `codeless.ge` (primary)
- **Env vars:** `DATABASE_URL`, `DIRECT_URL`
- Build/install commands are defined in `apps/web/vercel.json`.

### Admin

- **Root Directory:** `apps/admin`
- **Domain:** `admin.codeless.ge` (separate)
- **Env vars:** `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and (for the one-off seed) `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Build/install commands are defined in `apps/admin/vercel.json`.

### Migrations in production

The initial migration is `20260711092400_initial`. The production database
already had these tables before Prisma migration history was introduced, so
baseline that existing database exactly once. Run this from the repository root
with `.env` pointing at production:

```bash
pnpm --filter @codeless/db exec dotenv -e ../../.env -- prisma migrate resolve --applied 20260711092400_initial
```

Do not run the initial migration SQL against that populated database and do not
repeat the baseline command. After the one-time baseline, deploy this and every
future migration with:

```bash
pnpm --filter @codeless/db migrate:deploy
```

### Public registration rate limit (Vercel Firewall)

Apply this rule to the **public-site Vercel project only** (`apps/web`), not the
admin project:

1. In Vercel, open the public project, then **Firewall** → **Configure** →
   **New Rule**.
2. Name the rule `public-registration-server-actions`.
3. Match **Request Method equals `POST`**.
4. Add a grouped path condition matching **Request Path equals `/` OR Request
   Path equals `/en`**.
5. Add **Request Header `next-action` exists** so the rule targets Next Server
   Action submissions rather than unrelated POST traffic.
6. Set the action to **Rate Limit**, keyed by **IP address**, at **5 requests per
   60 seconds**; use HTTP **429** for requests over the limit.
7. Save and deploy the firewall configuration, then confirm the rule is enabled
   for the Production environment.
8. Verify both `/` and `/en` registration submissions, then confirm in Firewall
   events that a sixth POST from one IP within 60 seconds is rate-limited.

Do not broaden this rule to the admin domain, `/api/auth/*`, or admin routes.
The application-level in-memory limiter remains enabled as defense-in-depth,
but the Vercel rule is the distributed edge control.

Seed the first admin once:

```bash
pnpm db:seed
```

## Brand

Colors, logo and motifs are locked to the CodeLess social ad set:
navy `#1A2744` / `#141F38`, orange `#FF6B3D` (+ `#FF7A45` glow), ink `#F4F6FB`, muted `#8A96B0`,
success `#3DDC84`, danger `#E23B3B`. The bracket-face mascot lives at
`apps/web/public/brand/mascot.svg` and as the `<Mascot />` component in both apps.

## Structure

```
codeless-site/
├─ apps/
│  ├─ web/     # public marketing + lead capture (port 3000)
│  └─ admin/   # secured leads dashboard (port 3001)
├─ packages/
│  └─ db/      # Prisma schema + shared client
├─ turbo.json
└─ pnpm-workspace.yaml
```

## Accessibility & performance

- The WebGL backdrop falls back to a pure-CSS gradient when `prefers-reduced-motion` is set, and uses a lighter configuration on mobile.
- All copy is real DOM text over the canvas for readability and SEO.
- Smooth (Lenis) scrolling is disabled under reduced-motion.
