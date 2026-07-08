# CodeLess — WebGL course site + admin

A pnpm/Turborepo monorepo with two independent, separately-deployed Next.js apps that share only a Neon Postgres database:

- **`apps/web`** — the public, bilingual (Georgian default / English) marketing site with a hybrid-WebGL scroll experience and a no-payment "register your interest" lead form.
- **`apps/admin`** — a separately-domained, Auth.js-secured dashboard to view, filter and export leads.
- **`packages/db`** — the shared Prisma schema + client (the only thing the two apps have in common).

Built so future user auth, enrollments and Stripe payments can be added without re-architecture (see the reserved models in the Prisma schema).

## Stack

| Area        | Tech |
| ----------- | ---- |
| Framework   | Next.js 15 (App Router) + TypeScript |
| Styling     | Tailwind CSS (brand tokens) |
| WebGL       | three, @react-three/fiber, @react-three/drei, @react-three/postprocessing |
| Scroll/motion | lenis, gsap ScrollTrigger, framer-motion |
| i18n        | next-intl (`ka` default, `en`) |
| Forms       | react-hook-form + zod |
| Database    | Neon Postgres + Prisma |
| Admin auth  | Auth.js (NextAuth v5) Credentials + bcrypt |
| Monorepo    | pnpm workspaces + Turborepo |

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
pnpm db:migrate     # create tables on Neon (first run: names the migration)
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
Run migrations against Neon from your machine (or a CI step) using the production `DATABASE_URL`/`DIRECT_URL`:

```bash
pnpm --filter @codeless/db migrate:deploy
```

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
