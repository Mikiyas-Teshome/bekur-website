# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Next.js with Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check

# Database (TypeORM)
npm run migration:generate -- --name=MigrationName  # Generate migration from entity changes
npm run migration:run        # Apply pending migrations
npm run migration:revert     # Revert last migration
npm run migration:show       # Show migration status

# Seeding
npm run seed         # Seed all data
npm run seed:admin   # Create admin user
npm run seed:pricing # Seed pricing plans
npm run init:schema  # Initialize schema

# Content validation
npm run content:validate
```

## Architecture Overview

This is a full-stack Next.js 15 app (App Router) serving both a public marketing website and a protected admin CMS.

### Route Groups

- `(main)/` — Public-facing pages: homepage, about, blog, portfolio
- `(admin)/` — Admin CMS behind auth guard; layout checks `/api/auth/me` on mount
- `api/` — REST endpoints; public ones under `api/`, admin ones under `api/admin/` (JWT-protected)

### Data Flow

Two data sources coexist:

1. **JSON files** in `src/data/` and `content/` — static content loaded at request time via `loadPageContent()` / `loadSiteJson()` in `src/lib/content/load-page.ts`. Validated with Zod schemas in `content/schema/`.
2. **Database** (MySQL via TypeORM) — dynamic content managed through the admin panel. Entities live in `src/lib/entities/`. The DataSource is initialized lazily in `src/lib/db.ts`.

API routes query the database; React Query (5-minute stale time) manages client-side caching for admin pages.

### Authentication

- Session management via NextAuth 4 (`src/lib/auth.ts`)
- Edge-compatible JWT utility in `src/lib/jwt-edge.ts` for middleware/API route checks
- `src/lib/api-auth.ts` — helper to validate JWT in API routes
- Admin layout (`src/app/(admin)/layout.tsx`) fetches `/api/auth/me`; unauthenticated users are redirected to `/admin/login`
- `src/components/providers/AuthProvider.tsx` exposes auth context to client components

### Key Libraries

| Purpose | Library |
|---|---|
| Animations | Framer Motion (component-level), GSAP (timeline-based) |
| UI primitives | Radix UI + Tailwind CSS 4 |
| Server state | TanStack React Query |
| Forms | React Hook Form + Zod |
| Rich text | Tiptap (with many extensions) |
| File storage | MinIO (S3-compatible) via `src/lib/minio.ts` |
| Drag & drop | @dnd-kit/core + @dnd-kit/sortable |
| Icons | Lucide React |
| Toasts | Sonner |

### TypeORM Setup

Entities use decorators — `tsconfig.json` has `experimentalDecorators: true`. Database packages are excluded from the client bundle in `next.config.ts` webpack config. Never import TypeORM entities directly in client components; always go through API routes.

### Path Alias

`@/*` resolves to `src/*` — use this everywhere rather than relative imports.

### Styling

Tailwind CSS 4 with custom CSS properties in `src/app/globals.css`. Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional class names. Blog-specific typography styles are in `src/styles/blog-content.css`.

## Environment Variables

See `SETUP.md` for the full list. Required:
- `DATABASE_URL` — MySQL connection string
- `MINIO_*` — MinIO/S3 credentials and bucket config
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
