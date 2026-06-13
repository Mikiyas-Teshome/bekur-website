# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Next.js with Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check

# Database (TypeORM, PostgreSQL)
npm run migration:generate   # Generate migration from entity diffs — output name is hardcoded
                             # to src/db/migrations/{timestamp}-NewMigration.ts; rename after
npm run migration:run        # Apply pending migrations
npm run migration:revert     # Revert last migration
npm run migration:show       # Show migration status

# Seeding (scripts in src/db/)
npm run seed         # Seed all data (seed-safe.ts)
npm run seed:admin   # Create admin user (uses ADMIN_EMAIL / ADMIN_PASSWORD env vars)
npm run seed:pricing # Seed pricing plans
npm run init:schema  # Initialize schema

# Content validation (Zod-validates content/pages/*.json)
npm run content:validate
```

There is no test framework configured in this project.

CLI scripts (migrations, seeds) load env from `.env` via dotenv; Next.js itself also reads `.env.local`.

## Architecture Overview

This is a full-stack Next.js 16 app (App Router, React 19) serving both a public marketing website and a protected admin CMS.

### Route Groups

- `(main)/` — Public-facing pages: homepage, about, blog, portfolio
- `(admin)/` — Admin CMS behind auth guard; layout checks `/api/auth/me` on mount
- `api/` — REST endpoints; public ones under `api/`, admin ones under `api/admin/` (JWT-protected)

### Data Flow

Two data sources coexist — **static by default; in practice only the blog is edited through the CMS**. Everything else ships as static content for load speed, SEO, and AI discoverability (see `content/README.md`). Portfolio routes and other admin CRUD still read from the database, but treat the content layer as the source of truth for all non-blog copy:

1. **Static JSON content** — `content/pages/*.json` (marketing copy) and `content/site/*.json` (sitemap, redirects, navigation), loaded via `loadPageContent()` / `loadSiteJson()` in `src/lib/content/load-page.ts` and validated against Zod schemas in `content/schema/`. Legacy static data also lives in `src/data/*.json`.
2. **Database** (PostgreSQL via TypeORM) — dynamic content managed through the admin panel. Entities live in `src/lib/entities/`. The DataSource is initialized lazily with retry logic in `src/lib/db.ts`.

API routes query the database; React Query (5-minute stale time) manages client-side caching for admin pages.

### TypeORM Setup

- **Database is PostgreSQL** (`type: "postgres"` in `src/lib/db.ts` and both ormconfig files), despite `mysql2` lingering in dependencies.
- The runtime DataSource (`src/lib/db.ts`) runs with `synchronize: true` and migrations disabled — schema auto-syncs from entities. The migration scripts use the separate `ormconfig-cli.ts` (`synchronize: false`).
- Entities use decorators — `tsconfig.json` has `experimentalDecorators: true`.
- TypeORM/db packages are excluded from the client bundle in `next.config.ts` (webpack fallbacks + `serverExternalPackages`). Never import TypeORM entities directly in client components; always go through API routes.

### Authentication

- Session management via NextAuth 4 (`src/lib/auth.ts`)
- Edge-compatible JWT utility in `src/lib/jwt-edge.ts`
- `src/lib/api-auth.ts` — helper to validate JWT in API routes
- Admin layout (`src/app/(admin)/layout.tsx`) fetches `/api/auth/me`; unauthenticated users are redirected to `/admin/login`
- `src/components/providers/AuthProvider.tsx` exposes auth context to client components
- Auth debugging: set `AUTH_DEBUG=1` to keep console logs in production builds (`next.config.ts` strips them otherwise); helpers in `src/lib/auth-debug.ts`

### Key Libraries

| Purpose | Library |
|---|---|
| Animations | Framer Motion (component-level), GSAP (timeline-based) |
| UI primitives | Radix UI + Tailwind CSS 4 (shadcn/ui-style, see `components.json`) |
| Server state | TanStack React Query |
| Forms | React Hook Form + Zod |
| Rich text | Tiptap (with many extensions); HTML conversion in `src/lib/tiptapToHtml.ts` |
| File storage | MinIO (S3-compatible) via `src/lib/minio.ts` |
| Email | Nodemailer / Resend |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Icons | Lucide React |
| Toasts | Sonner |

### Path Alias

`@/*` resolves to `src/*` — use this everywhere rather than relative imports.

### Styling

Tailwind CSS 4 with custom CSS properties in `src/app/globals.css`. Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional class names. Blog-specific typography styles are in `src/styles/blog-content.css`.

## Content Rules

- **Proof references:** Never mention Upwork (or any freelance-marketplace metrics) or past work that is not in the portfolio ("shipped systems") section. The only client/product proof allowed on public pages is the portfolio case studies; everything else must be a documented sprint promise (fixed scope, fixed price, hard monthly AI cap, 3–6 week delivery).
- **Homepage hero:** headline (three lines, brand-blue accent on first/last, four-point ✦ star in the middle line), a 1–2 line subheadline that names the category ("custom automation for professional service firms"), and a single CTA. No badges, eyebrows, or proof strips. No entrance animations; keep it a server component.
- **CTA buttons are one identity site-wide:** `BookCallLink` (and the footer's `BookCallButton`) render a rounded rectangle with an animated orbiting blue conic border (`.cta-frame` in `globals.css`) around a monochrome theme-adaptive button (`bg-foreground text-background` — never blue). Variants only change sizing; use `frameClassName` for layout (w-full etc.) and `className` for inner overrides. Don't invent new CTA styles.
- Hero copy lives in `content/pages/home.json` (`hero.headlineLines` with `accent`/`sparkle` flags); never hardcode marketing copy in components.
- All marketing copy follows the voice rules in `docs/bekur-brand-positioning.md`.

## Docs

- `docs/bekur-brand-positioning.md` — single source of truth for positioning, ICP, and voice; **marketing copy must follow its voice rules**
- `docs/site-architecture.md` — target-state sitemap and route plan (the repositioned site: Blueprint → Automation Sprint funnel); not all routes exist yet
- `docs/HANDOVER.md`, `docs/DEPLOY-CPANEL.md`, `NGINX_CONFIG.md` — ops/deployment
- `SETUP.md` — environment setup (note: it says MySQL, but the code uses PostgreSQL)
- `SEEDING.md` — seed script details

## Environment Variables

Required:
- `DATABASE_URL` — PostgreSQL connection string
- `MINIO_*` — MinIO/S3 credentials and bucket config
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — for `npm run seed:admin`
