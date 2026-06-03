# Archived site code

Everything from the full Bekur website lives here except the active MVP landing page.

## Active (outside this folder)

- `src/app/(main)/page.tsx` — MVP homepage at `/`
- `src/components/mvp-clone/` — MVP section components
- `src/components/Favicon.tsx`
- `src/provider/theme-provider.tsx`
- `src/app/layout.tsx`, `globals.css`, `fonts.ts`

## Archived here

- `src/app/(admin)/` — admin panel
- `src/app/api/` — API routes
- `src/app/(main)/` — about, blog, contact, portfolio, services, old home, `/mvp`
- `src/components/` — Header, Footer, homePage, services, admin, etc.
- `src/data/`, `src/db/`, `src/lib/`, `src/hooks/`, `src/types/`, `src/styles/`
- `content/` — JSON content files
- `ormconfig.ts`, `ormconfig-cli.ts`, `scripts/`

To restore a feature, move the relevant files back into `src/` and rewire routes/imports.
