# Bekur Website — Site Architecture

**Version:** 1.0  
**Status:** Target state (pre-migration)  
**Positioning source:** [`bekur-brand-positioning.md`](./bekur-brand-positioning.md)

---

## Principles

| Rule | Detail |
|------|--------|
| **Static by default** | All marketing pages ship from `content/` at build time (Server Components). |
| **Dynamic only** | `/blog/*` and `/portfolio/*` (+ admin APIs). |
| **One commercial motion** | Blueprint → Automation Sprint. |
| **SEO** | Pain/offer clusters; canonical URLs; 301s on cutover. |
| **Slug URLs** | Blog and portfolio use `slug`, not numeric `id` (migrate with per-record redirects). |

---

## Sitemap

### Public — static (SSG)

| Path | Page ID | Purpose | Priority |
|------|---------|---------|----------|
| `/` | `home` | Problem → Sprint → proof → CTA | 1.0 |
| `/automation-sprint` | `automation-sprint` | Core product: scope, timeline, in/out | 0.9 |
| `/blueprint` | `blueprint` | Paid logic-mapping front door | 0.9 |
| `/how-we-work` | `how-we-work` | Logic Mapping → build → go-live | 0.8 |
| `/who-we-serve` | `who-we-serve` | ICP, five pains, industries | 0.8 |
| `/why-bekur` | `why-bekur` | vs alternatives + brand values | 0.8 |
| `/pricing` | `pricing` | Sprint tiers ($4.5K–$26K) | 0.7 |
| `/faq` | `faq` | Objections + disqualifiers | 0.7 |
| `/about` | `about` | Team, delivery location, values | 0.6 |
| `/contact` | `contact` | Qualification form + calendar | 0.8 |

### Public — dynamic (ISR + DB)

| Path | Source | Revalidate | Notes |
|------|--------|------------|-------|
| `/blog` | `blog_posts` | 3600s | Listing; `noindex` if empty |
| `/blog/[slug]` | `blog_posts.slug` | On-demand + 3600s | `Article` JSON-LD |
| `/portfolio` | `portfolio_projects` | 3600s | Listing; pain/outcome filters |
| `/portfolio/[slug]` | `portfolio_projects.slug` | On-demand + 3600s | Case study template |

### System / SEO

| Path | Index | Notes |
|------|-------|-------|
| `/sitemap.xml` | — | Static routes + dynamic slugs from DB at build/ISR |
| `/robots.txt` | — | Allow marketing; disallow `/admin` |
| `/llms.txt` | — | Category, ICP, offer summary for LLM crawlers |

### Admin (unchanged scope, narrowed over time)

| Path | Index |
|------|-------|
| `/admin/*` | `noindex` |

**Removed from public sitemap (301 elsewhere):** `/services`, `/services/*`, `/mvp`.

---

## Navigation (header)

```
Home
The Automation Sprint  →  /automation-sprint
Blueprint              →  /blueprint
Work                   →  /portfolio
Insights               →  /blog
About                  →  /about
[ Book Blueprint ]     →  /blueprint#book
```

Footer adds: How we work, Who we serve, Why Bekur, Pricing, FAQ, Contact.

---

## Redirect table

Canonical machine-readable list: [`content/site/redirects.json`](../content/site/redirects.json).

### Global / legacy marketing

| From | To | Status | Notes |
|------|-----|--------|-------|
| `/services` | `/automation-sprint` | 301 | Old services hub |
| `/mvp` | `/automation-sprint` | 301 | Alternate homepage retired |
| `/services/outsource` | `/automation-sprint` | 301 | Not a public offer line |
| `/services/digital-marketing` | `/automation-sprint` | 301 | Repositioned |
| `/services/social-media-management` | `/automation-sprint` | 301 | |
| `/services/social-media` | `/automation-sprint` | 301 | Duplicate legacy route |
| `/services/website-development` | `/automation-sprint` | 301 | |
| `/services/web-development` | `/automation-sprint` | 301 | Alias if ever used |
| `/services/app-development` | `/automation-sprint` | 301 | |
| `/services/ui-ux` | `/automation-sprint` | 301 | |
| `/services/graphics-design` | `/automation-sprint` | 301 | |

### Dynamic URL shape (implement at portfolio/blog migration)

| From | To | Status | Notes |
|------|-----|--------|-------|
| `/blog/[id]` | `/blog/[slug]` | 301 | Generate row in `redirects.migration.json` from DB |
| `/portfolio/[id]` | `/portfolio/[slug]` | 301 | Same |

### Optional aliases (enable if needed)

| From | To | Status | Notes |
|------|-----|--------|-------|
| `/work` | `/portfolio` | 301 | Sales-friendly alias |
| `/case-studies` | `/portfolio` | 301 | |
| `/insights` | `/blog` | 301 | |
| `/sprint` | `/automation-sprint` | 301 | Short link for ads |

---

## Content file map

| Route | Content file |
|-------|----------------|
| `/` | `content/pages/home.json` |
| `/automation-sprint` | `content/pages/automation-sprint.json` |
| `/blueprint` | `content/pages/blueprint.json` |
| `/how-we-work` | `content/pages/how-we-work.json` |
| `/who-we-serve` | `content/pages/who-we-serve.json` |
| `/why-bekur` | `content/pages/why-bekur.json` |
| `/pricing` | `content/pages/pricing.json` |
| `/faq` | `content/pages/faq.json` |
| `/about` | `content/pages/about.json` |
| `/contact` | `content/pages/contact.json` |
| Nav + global SEO | `content/site/navigation.json`, `content/site/seo.json` |

Schemas: `content/schema/*` — validated with Zod at build time (wire in Phase 1).

---

## Next.js redirects (implementation)

Import `content/site/redirects.json` in `next.config.ts`:

```ts
import redirectsConfig from "./content/site/redirects.json";

const nextConfig = {
  async redirects() {
    return redirectsConfig.redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: r.permanent,
    }));
  },
};
```

Per-record blog/portfolio ID → slug redirects: generate `content/site/redirects.migration.json` via script before cutover.

---

## Admin scope (target)

| Keep | Remove from public CMS |
|------|-------------------------|
| Blogs CRUD | Hero, features, services, team, testimonials, values, companies, contact, pricing (marketing copies move to `content/`) |
| Portfolio CRUD | |
| Media upload | |
| Auth | |

---

## Migration checklist

- [ ] Add Zod validation script: `npx ts-node content/schema/validate.ts`
- [ ] Implement static page routes reading `content/pages/*.json`
- [ ] Apply `redirects.json` in `next.config.ts`
- [ ] Change blog/portfolio routes to `[slug]`; run migration redirect generator
- [ ] Update `sitemap.xml` generation
- [ ] Search Console: submit new sitemap, monitor 404s for 90 days
- [ ] Retire client-side `/api/services`, `/api/contact`, etc. on marketing pages
