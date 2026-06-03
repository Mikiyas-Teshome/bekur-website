# Static content layer

Marketing copy and site structure for the repositioned Bekur site. **Portfolio and blog stay in the database**; everything else loads from this directory at build time.

## Layout

```
content/
├── README.md                 ← this file
├── site/
│   ├── sitemap.json          ← route registry (static + dynamic flags)
│   ├── redirects.json        ← global 301s for next.config
│   └── navigation.json       ← header / footer / CTAs
├── schema/
│   ├── shared.ts             ← reusable blocks (SEO, pains, FAQ, etc.)
│   ├── pages.ts              ← per-page Zod schemas
│   ├── dynamic.ts            ← portfolio case-study extensions (DB/editor)
│   ├── index.ts              ← exports
│   └── validate.ts           ← CLI validation
└── pages/
    ├── home.json
    ├── automation-sprint.json
    ├── blueprint.json
    ├── how-we-work.json
    ├── who-we-serve.json
    ├── why-bekur.json
    ├── pricing.json
    ├── faq.json
    ├── about.json
    └── contact.json
```

## Editing workflow

1. Change JSON under `pages/` or `site/`.
2. Run validation: `npx ts-node --project tsconfig.json content/schema/validate.ts`
3. Copy must follow voice rules in `docs/bekur-brand-positioning.md`.

## Positioning reference

- Category: operational systems & custom automation for professional service firms
- Core offer: **The Automation Sprint** (one workflow, 3–6 weeks)
- Front door: **Blueprint** (paid logic mapping)
- Tagline: *We don't bend your firm to the tool. We build the tool to your firm.*
