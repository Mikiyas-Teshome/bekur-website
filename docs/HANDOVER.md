# Bekur Website — Developer Handover

**Audience:** Senior developer who built the original full site (now largely under `archive/`).  
**Last updated:** May 2026  
**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, TypeORM + PostgreSQL, MinIO media, Framer Motion + GSAP.

---

## 1. Executive summary

The project was **repositioned** from a broad agency site (services, outsource, multiple service sub-pages) to a **single commercial motion**: **Blueprint → Automation Sprint** for professional service firms.

**What ships today**

- **Live route:** `/` only — a long-form **MVP marketing homepage** composed of section components in `src/components/mvp-clone/`.
- **Shell:** `SiteHeader` + `Footer` on all `(main)` routes via `src/app/(main)/layout.tsx`.
- **Backend:** Admin panel, REST APIs, TypeORM entities, and DB migrations remain **active in `src/`** (not only in archive).
- **Content layer:** JSON under `content/` + Zod schemas — **prepared but not yet wired** to App Router pages for `/automation-sprint`, `/blueprint`, etc.

**What was parked**

- Most marketing pages, old homepage, service hub, blog/portfolio **page routes**, and duplicate component trees live in **`archive/`** — reference and copy-paste source, not served by default.

**Your north star docs**

| Doc | Purpose |
|-----|---------|
| [`docs/bekur-brand-positioning.md`](./bekur-brand-positioning.md) | ICP, pains, offer, voice, pricing bands |
| [`docs/site-architecture.md`](./site-architecture.md) | Target sitemap, redirects, content file map, migration checklist |
| [`content/README.md`](../content/README.md) | Static content layout and validation |

---

## 2. Repository layout

```
bekur-website/
├── archive/                    # Frozen copy of pre-pivot app (pages, old components, old content snapshots)
│   └── README.md               # What was archived vs what stayed active
├── content/                    # Target static marketing copy (Zod-validated JSON)
│   ├── pages/*.json
│   ├── site/navigation.json, redirects.json, seo.json, sitemap.json
│   └── schema/                 # shared.ts, pages.ts, dynamic.ts, validate.ts
├── docs/                       # Positioning, architecture, this handover
├── public/
│   └── assets/                 # logos, case-studies/*.png, etc.
├── src/
│   ├── app/
│   │   ├── (main)/             # Public marketing layout — ONLY page.tsx today
│   │   ├── (admin)/            # Admin UI (blogs, portfolio, legacy CMS screens)
│   │   ├── api/                # REST routes (admin + public)
│   │   ├── layout.tsx          # Root: theme, auth, react-query, metadata
│   │   └── globals.css         # Design tokens (CSS variables)
│   ├── components/
│   │   ├── mvp-clone/          # **Current homepage sections**
│   │   ├── admin/              # Admin chrome, TipTap, MediaPicker
│   │   ├── footer/, SiteHeader.tsx, ui/ (shadcn-style)
│   │   └── ...
│   ├── db/                     # migrations, seeds
│   ├── lib/                    # entities, db, minio, jwt, content/load-page.ts
│   ├── data/*.json             # Legacy static JSON (older CMS seed sources)
│   └── proxy.ts                # Auth gate for /admin/* (Next proxy convention)
├── ormconfig-cli.ts            # TypeORM CLI → PostgreSQL via DATABASE_URL
└── next.config.ts              # images unoptimized; TypeORM webpack externals
```

### Archive vs active — important correction

`archive/README.md` says admin/API were archived; **that is outdated**. The **live** tree still includes:

- `src/app/(admin)/admin/*`
- `src/app/api/*`
- `src/db/`, `src/lib/entities/*`

What **is** archived: **`src/app/(main)/` routes** other than `page.tsx` (about, blog, portfolio, services/*, contact, old home, `/mvp`).

To restore a page: copy from `archive/src/app/(main)/...` into `src/app/(main)/...` and fix imports (paths may still resolve if components exist in `src/`).

---

## 3. Current homepage (`/`)

**File:** `src/app/(main)/page.tsx`

**Section order (top → bottom):**

| # | Component | Role |
|---|-----------|------|
| 1 | `Hero` | Night-sky visual, headline, primary CTA |
| 2 | `IsThisYou` | GSAP scroll-pinned “pain messages” bracket UI |
| 3 | `SolutionBridge` | Before/after + scroll-driven `AutomationDemo` mockup |
| 4 | `Services` | Three offer pillars + `ServiceMockups` illustrations |
| 5 | `Process` | 3-phase vertical timeline (Framer `useScroll`) |
| 6 | `Accountability` | Partner approval gates (split layout + mockup) |
| 7 | `Pricing` | Blueprint / Pilot / Standard tiers (inline copy) |
| 8 | `CTA` | Late-page conversion block |
| 9 | `FAQ` | Objections accordion |
| 10 | `Blog` | **Static placeholder** cards (not wired to DB) |

**Removed from homepage (components still exist, not imported):**

- `CaseStudies` + `FeaturedProject` / `CaseStudiesShowcase`
- `Stats` (“Proof over promises…”)
- `Testimonials` (“Shipped systems…”)

**Case study assets (for when you re-enable portfolio proof):**

```
public/assets/case-studies/
  findenn.png      → Finden AI
  omniHr.png       → Enterprise HRMS
  tatariAi.png     → TatariAI
```

Data + layouts: `src/components/mvp-clone/case-studies/` (`data.ts`, `CaseStudiesShowcase.tsx`, `CaseStudyMedia.tsx`).  
Carousel alternative: `FeaturedProject.tsx`. Toggle in `CaseStudies.tsx` via `CASE_STUDIES_LAYOUT`.

---

## 4. Styling & UI patterns

### 4.1 Design tokens (`src/app/globals.css`)

- **Tailwind v4** with `@theme inline` mapping semantic colors to CSS variables.
- **Primary brand blue:** `#214a9c` (`--primary`).
- **Accent gradient (headlines):**  
  `bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)]`  
  Dark mode variant uses lighter stops (`#a8d1f5` …).
- **Surfaces:** `bg-muted/30` sections on light; `dark:bg-background` in dark mode.
- **Cards:** `bg-card`, `border-border/60`, large radius (`rounded-[28px]`–`rounded-[32px]`), soft blue shadows on hover.
- **Theme:** `next-themes` class strategy (`dark` on `<html>`). Toggle in header.

### 4.2 Typography

- **Body:** `inter` from `src/app/fonts.ts` (root layout).
- **Header nav / some CTAs:** `dmSans5` in `SiteHeader`.
- **Footer hero type:** `grotesk`, `dmSans5`, `inter` mix in `Footer.tsx`.
- **Section headings:** Often split line + gradient span; sizes like `text-[1.85rem]` → `md:text-[2.65rem]`.

### 4.3 Motion conventions

| Library | Where used | Notes |
|---------|------------|--------|
| **Framer Motion** | Most `mvp-clone` sections | `whileInView`, stagger children, `useReducedMotion()` respected |
| **GSAP ScrollTrigger** | `IsThisYou.tsx`, `Footer.tsx` | Pinning + scrub; footer listens to `FOOTER_ANIMATION_REFRESH_EVENT` |
| **Framer `useScroll`** | `Process.tsx` | Timeline progress; target needs `position: relative` (see `ProcessTimeline`) |

**Shared easing:** `[0.25, 0.1, 0.25, 1]` (exported as `ease` in many files).

**Reduced motion:** Always branch on `useReducedMotion()` for autoplay, scroll-driven animation, and heavy transitions.

### 4.4 Component structure pattern

Almost all homepage sections follow:

```tsx
"use client";

export default function Section() {
  return (
    <section className="relative w-full overflow-hidden bg-muted/30 px-4 py-20 dark:bg-background md:px-8 md:py-28 lg:py-32">
      {/* optional radial gradient blob */}
      <div className="relative mx-auto max-w-7xl">
        {/* header: eyebrow pill + h2 + subcopy */}
        {/* body */}
      </div>
    </section>
  );
}
```

**Eyebrow pills:** `rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]` + Lucide icon.

**Icons:** `lucide-react`, stroke ~1.75.

### 4.5 Images

- **Next `Image`** used in several places; `next.config.ts` has **`images.unoptimized: true`** (no built-in resizing — consider WebP exports or enable optimization later).
- **`Logo` component** (`src/components/logo/Logo.tsx`): theme-aware SVG; pass `style={{ width: "auto", height: "auto" }}` when CSS scales one dimension.
- Case study hero aspect ratio: **`2528 / 1696`** (`aspect-[2528/1696]`).

### 4.6 No comments rule

Product owner preference: **avoid code comments** unless non-obvious business logic. Match existing density and naming.

---

## 5. Header, footer, and broken links (intentional gap)

**`SiteHeader`** (`src/components/SiteHeader.tsx`) already points to target IA:

- `/automation-sprint`, `/blueprint`, `/portfolio`, `/blog`, `/about`
- CTA: Book Blueprint → `/blueprint#book`

**These routes do not exist under `src/app/(main)/` yet** — only `/` is implemented. Clicking nav items will 404 until static pages are added.

**Footer** (`src/components/footer/Footer.tsx`): GSAP reveal animation; “Book Blueprint Call” via `BookCallButton`.

---

## 6. Content system (target state)

### 6.1 Static pages

JSON in `content/pages/` validated by Zod (`npm run content:validate`).

Loader: `src/lib/content/load-page.ts` → `loadPageContent(pageId)`.

**Not yet consumed by routes** — homepage copy is **hardcoded inside `mvp-clone` components**, not read from `content/pages/home.json`.

### 6.2 Dynamic content

- **Blog** → `BlogPost` entity, `/api/blogs`, admin at `/admin/blogs`.
- **Portfolio** → `PortfolioProject` entity, admin at `/admin/portfolio`.
- Target public URLs: `/blog/[slug]`, `/portfolio/[slug]` (see `content/schema/dynamic.ts`).

### 6.3 Redirects

`content/site/redirects.json` documents 301s from old `/services/*`, `/mvp`, etc.  
**Not wired in `next.config.ts` yet** — see implementation snippet in `site-architecture.md`.

---

## 7. Backend & admin

### 7.1 Database

- **PostgreSQL** via `DATABASE_URL` in `.env`.
- **TypeORM** entities in `src/lib/entities/`.
- Migrations: `src/db/migrations/` — run `npm run migration:run`.
- Seeds: `npm run seed`, `npm run seed:admin`, `npm run seed:pricing`.

### 7.2 Auth

- JWT in `auth-token` cookie.
- **`src/proxy.ts`** protects `/admin/*` (except `/admin/login`).
- Login: `/admin/login` → API `POST /api/auth/login`.

### 7.3 Media

- **MinIO** (`src/lib/minio.ts`) for uploads; admin MediaPicker.
- Marketing case studies on homepage path use **local `public/`** assets, not MinIO.

### 7.4 Admin surfaces still in codebase

| Path | Notes |
|------|--------|
| `/admin` | Dashboard |
| `/admin/blogs`, `/admin/portfolio` | Primary ongoing CMS |
| `/admin/content/*` | Legacy marketing CMS (hero, team, testimonials, etc.) — **target architecture narrows CMS** to blog + portfolio only |

---

## 8. Key technical gotchas

1. **`reflect-metadata`** imported in root layout — required for TypeORM in server code.
2. **TypeORM must not bundle to client** — webpack externals in `next.config.ts`.
3. **Framer `useScroll` warning** — container needs non-static positioning; `Process` uses dedicated `ProcessTimeline` child with `style={{ position: "relative" }}`.
4. **`IsThisYou` scroll pin** — tall section (`style={{ height: '...vh' }}`); test layout shifts when footer animates.
5. **Console removal in production** — unless `AUTH_DEBUG` env flags set.
6. **Archive README** — trust this handover over `archive/README.md` for admin/API location.

---

## 9. What to build next (recommended order)

### Phase A — Make navigation real (high priority)

1. **Static marketing routes** under `src/app/(main)/`:
   - `/automation-sprint`, `/blueprint`, `/how-we-work`, `/who-we-serve`, `/why-bekur`, `/pricing`, `/faq`, `/about`, `/contact`
2. Each page: Server Component reads `loadPageContent(...)` + shared layout sections (or slice templates from `mvp-clone` where overlap exists).
3. Wire **`redirects.json`** into `next.config.ts`.
4. Align **`content/pages/home.json`** with live homepage OR migrate homepage to consume JSON.

### Phase B — Dynamic public pages

5. **`/blog`** listing + **`/blog/[slug]`** — port patterns from `archive/src/app/(main)/blog/`.
6. **`/portfolio`** + **`/portfolio/[slug]`** — case study template; merge homepage case-study data (`case-studies/data.ts`) with DB over time.
7. Generate **id → slug redirects** (`archive/scripts/generate-migration-redirects.ts`).
8. Update **`src/app/sitemap.ts`** per `content/site/sitemap.json`.

### Phase C — Homepage polish

9. Re-enable or redesign **proof section** (case studies) — components ready in `mvp-clone/case-studies/`.
10. Wire **`Blog.tsx`** to real posts (or remove until blog ships).
11. Replace **inline Pricing copy** with `content/pages/pricing.json` if single source of truth is required.
12. **Image optimization** — export WebP @ ~1264×848 for heroes; enable Next image optimization if acceptable.

### Phase D — CMS consolidation

13. Retire unused admin content editors per `site-architecture.md` admin scope table.
14. Portfolio fields aligned with `portfolioCaseStudyMetaSchema` in `content/schema/dynamic.ts`.

### Phase E — Ops

15. Env documentation (`.env.example`): `DATABASE_URL`, MinIO, JWT secret, `NEXT_PUBLIC_SITE_URL`, Resend/email if contact form live.
16. Restrict `images.remotePatterns` before production.

---

## 10. Copy & product constants (sitewide)

Keep consistent when editing any section:

| Topic | Value |
|-------|--------|
| Sprint timeline | **3–6 weeks** (was 2–4 in older copy) |
| Core offer | **Automation Sprint** — one workflow, fixed scope & price |
| Front door | **Blueprint** (~$2,500 logic map; credited toward sprint) |
| Sprint pricing band | **$4,500–$26,000** (Pilot / Standard / Mid-Market) |
| ICP | Small professional service firms (legal, accounting, consulting, etc.) |
| Tone | Logic-first, anti-hype, no fake law-firm case studies |

---

## 11. Local development

```bash
npm install
cp .env.example .env   # if present; configure DATABASE_URL at minimum
npm run migration:run
npm run seed:admin     # first-time admin user
npm run dev            # http://localhost:3000
npm run content:validate
npm run build          # verify before deploy
```

**Admin:** `/admin/login` after seed.

---

## 12. File quick reference

| Task | Start here |
|------|------------|
| Change homepage order/sections | `src/app/(main)/page.tsx` |
| Edit hero / pains / demo | `Hero.tsx`, `IsThisYou.tsx`, `SolutionBridge.tsx` |
| Offer / mockups | `Services.tsx`, `services/ServiceMockups.tsx` |
| Process / accountability | `Process.tsx`, `Accountability.tsx` |
| Pricing / FAQ / blog teaser | `Pricing.tsx`, `FAQ.tsx`, `Blog.tsx` |
| Case studies (dormant) | `CaseStudies.tsx`, `case-studies/*`, `FeaturedProject.tsx` |
| Nav / header | `SiteHeader.tsx`, `content/site/navigation.json` |
| Brand voice | `docs/bekur-brand-positioning.md` |
| Restore old page | `archive/src/app/(main)/...` |
| API behavior | `src/app/api/**` |
| Entity/schema | `src/lib/entities/**`, `content/schema/**` |

---

## 13. Questions to align with product owner

1. Homepage: keep **hardcoded sections** or drive from `content/pages/home.json`?
2. Case studies on `/` vs only on `/portfolio`?
3. Blog section on homepage: real data or hide until launch?
4. Which legacy admin CMS pages can be deleted vs kept for transition?
5. Enable Next image optimization + WebP assets?

---

*For archive restoration steps, see [`archive/README.md`](../archive/README.md). For target URLs and redirects, see [`site-architecture.md`](./site-architecture.md).*
