# BEKUR TECHNOLOGIES — WEBSITE BUILD CONTEXT
### Master context file for Claude Code · Site rebuild (Framer-quality, Next.js + Tailwind)
### Paste or reference this file at the start of every Claude Code session for this project.

---

## 1. WHAT WE ARE BUILDING

A premium marketing website for Bekur Technologies that matches the design quality of top-tier Framer agency templates — but built in **Next.js 14+ (App Router) + Tailwind CSS + Motion (motion/react)**, fully owned, no Framer dependency.

**Reference quality bar:** Framer agency templates like "Atomic", "Lunar", "Refine" — dark, confident, generous whitespace, scroll-triggered animation, live product-style UI mockups embedded in sections.

**The site already exists at bekurtechnologies.com.** This build is an upgrade pass: same content architecture, stronger design execution, plus the fixes listed in Section 8.

---

## 2. BRAND CORE (NON-NEGOTIABLE)

**Company:** Bekur Technologies
**Founder:** Mikiyas Teshome (Miki) — Addis Ababa, Ethiopia, serving US/UK/CA/AU clients
**What we are:** The operational systems partner for small and lower mid-market professional service firms.

**Positioning statement:**
"For small and lower mid-market professional service firms whose work never fits the template inside vertical SaaS or generic AI tools, Bekur Technologies is the operational systems partner that maps your firm's business logic, then ships one production workflow in weeks — fixed scope, capped AI costs, and partner approval on every client-facing step."

**The one-line brand:** *We don't bend your firm to the tool. We build the tool to your firm.*

**ICP:** Managing partners and founders of professional service firms (law, accounting, consulting, advisory, recruitment, agencies), 5–50 staff, $500K–$5M revenue, English-speaking markets. They are operators, not IT departments.

**Voice principles:**
- Lead with the client's problem, never our capabilities
- Specific proof (numbers, names) over vague claims
- Business language first, technical second
- Short sentences. Clarity over cleverness.
- Confident, warm, direct. Never corporate-speak, never hype.

**Banned words/phrases:** "leverage", "cutting-edge", "world-class", "digital transformation", "innovative solutions", "unlock", "supercharge", "revolutionize", "seamless" (as filler).

**Proof points (use exactly, never inflate):**
- Finden AI — #3 Product of the Day on Product Hunt, beat Vercel's v0
- Feres — Ethiopian ride-hailing app, 1M+ downloads
- Debo — official Ethiopian government COVID-19 contact tracing app, 50,000+ cases tracked
- VIGOR HMS — full hotel management SaaS
- Multi-tenant HRMS SaaS — enterprise-grade, NX monorepo
- Upwork: Top Rated, 100% Job Success, 10/10 five-star engagements, 450+ hours
- DO NOT use the "$20K earned" figure on the site — it undersells to this ICP

---

## 3. THE OFFER ARCHITECTURE

**The Automation Sprint** — one production workflow, fixed scope, fixed price, hard AI spend cap, partner approval gates, shipped in 3–6 weeks into the client's existing stack.

**Process (3 phases):**
1. **Logic Mapping (Weeks 1–2)** — document triggers, data sources, approvals, exceptions; fix broken logic before code. Deliverable: logic map + fixed sprint quote.
2. **Fixed-Scope Build (Weeks 3–5)** — senior-only team ships into existing stack; AI spend limits wired into architecture.
3. **Approval & Go-Live (Week 6)** — partner sign-off on every client-facing step; handoff docs, walkthroughs, 90-day ROI target.

**Pricing tiers:**
| Tier | Price | What |
|---|---|---|
| Blueprint | $2,500 one-time | Logic mapping + fixed sprint quote + go/no-go gate. Credited toward sprint if they proceed. |
| Pilot Sprint | $4,500 fixed | One workflow, 3–6 weeks. The "first sprint" product. Mark as Popular. |
| Standard / Mid-Market | from $9,000 (up to $26K) | Multi-system integrations, heavier operational debt. |

**Guardrails (the differentiators — feature prominently):**
- Partner gates: client-facing steps require partner-defined approval
- Written change orders only — no silent scope creep
- Hard monthly AI spend cap agreed in writing pre-build
- One workflow per sprint — no open-ended discovery

---

## 4. SITE ARCHITECTURE (PAGES & SECTIONS)

### Page: Home (/)
1. **Hero** — H1: "Custom automation for professional service firms." Sub: "Reclaim partner hours in 3–6 weeks — without rigid SaaS templates, surprise AI bills, or scope creep." CTAs: [Book a call] [View our work]. Trust line: "Top Rated on Upwork · 100% Job Success". Background: subtle animated workflow visualization.
2. **Is This You?** — 6 pain quotes in ICP's voice (keep existing copy: "We keep doing this manually because nothing fits how we work." / "I want to use AI but I don't trust most people pitching me." etc.)
3. **The Automation Sprint intro** — "We don't bend your firm to the tool." + animated live-workflow mockup (matter intake demo with stages: signal → logic map → approval gate → sync → outputs).
4. **What we build** — 4 capability cards each with embedded live-UI mockup: Workflow Automation, Controlled AI (show spend cap meter $240/$300), Stack Integration, The Sprint (show progress timeline).
5. **Process** — 3 numbered phases (Logic Mapping / Fixed-Scope Build / Approval & Go-Live) with week labels and deliverable tags.
6. **Accountability / Guardrails** — Partner gates, Written change orders, Hard AI cap. Plus Blueprint note.
7. **Shipped systems** — tabbed case selector: Finden AI, Enterprise HRMS, TatariAI, Lead Gen Engine (label: "In build — we're running the Sprint on our own stack first"). Each: what it proves about delivery.
8. **Proof stats band** — "Top Rated · 100% Job Success" / "#3 Product of the Day (ahead of Vercel v0)" / "1M+ downloads (Feres)".
9. **Why Bekur** — 6 value cards: Logic before code, Accountability by design, Reclaimed partner hours, Built into your stack, Predictable economics, Built for operators.
10. **Founder section (NEW — required)** — Photo of Miki, heading "Built by an operator who ships." 3 sentences: founder story (shipped products used by 1M+ people, built Finden AI which beat Vercel's v0 on Product Hunt, now building Bekur to give service firms the systems their work deserves). Link to LinkedIn.
11. **Pricing** — 3 tier cards as in Section 3.
12. **Insights** — only render if ≥2 articles exist; otherwise omit section entirely.
13. **FAQ** — keep existing 6 questions.
14. **Final CTA band** — "MAP YOUR LOGIC. SHIP ONE WORKFLOW THIS MONTH." [Book a call]
15. **Contact** — form (name, work email, subject, message — NO phone field), direct contacts: email miki@bekurtechnologies.com, LinkedIn. Office address in footer only, small text.

### Page: /automation-sprint
Long-form sprint explainer: who it's for, full process, deliverables per phase, guarantee language, pricing, FAQ subset, CTA.

### Page: /blueprint
The Blueprint offer page + embedded booking (single source of truth for ALL "Book a call" CTAs site-wide — one Calendly/Cal.com embed).

### Page: /portfolio + /portfolio/[slug]
Case study grid + detail pages. Template per case: Context → Problem → What we built → Stack → What it proves → CTA.

### Page: /how-we-work
Delivery model: process detail, guardrails, communication rhythm (weekly updates), definition of done, post-delivery support.

### Page: /contact
Form + booking embed.

### Legal: /terms, /privacy
Real pages, real content (generate standard agency terms + privacy adapted to Bekur). NEVER link to "#".

---

## 5. DESIGN SYSTEM

**Mood:** Dark, precise, operator-grade. Feels like a serious systems company, not a creative agency.

**Colors:**
```
--bg:        #0A0A0C   (near-black base)
--surface-1: #121216
--surface-2: #1A1A20
--border:    rgba(255,255,255,0.08)
--text-1:    #F2F2F5
--text-2:    #9A9AA5
--text-3:    #5E5E68
--accent:    #00D97E   (Bekur green — CTAs, live indicators, success states)
--accent-2:  #4A9EFF   (links, info accents — use sparingly)
--warn:      #F5A623
```
Accent green is earned, not decorative: CTAs, "Live" badges, progress fills, approved states only.

**Typography:**
- Display/headings: Instrument Serif or Söhne-class grotesk (pick ONE direction: editorial-serif headlines like high-end Framer templates, or precision-grotesk; do not mix)
- Body: Inter or IBM Plex Sans
- Mono accents (labels, stats, tags): IBM Plex Mono — uppercase, letter-spaced, 10–11px

**Layout rules:**
- Max content width 1200px, generous vertical rhythm (128–160px between sections)
- Section label pattern: small mono uppercase kicker ("THE AUTOMATION SPRINT") above each H2
- Cards: surface-1, 1px border, 12–16px radius, no heavy shadows
- Live-UI mockups inside cards must look like real product UI (status dots, progress bars, queue states) — this is a signature element, keep it

**Motion (motion/react):**
- Scroll-triggered fade-up + 12px translate, stagger children 60–80ms
- Live mockups animate on viewport enter: progress bars fill, statuses tick from Queued → Running → Done
- Number count-up on proof stats
- Subtle only. No parallax circus, no spinning icons. Every animation under 600ms, ease-out.

**Components to build:** Navbar (sticky, blur backdrop), SectionKicker, PainCard, CapabilityCard (with embedded MockUI), ProcessPhase, GuardrailCard, CaseTab + CaseDetail, StatBand, PricingCard, FounderBlock, FAQAccordion, CTABand, ContactForm, Footer.

---

## 6. SEO & META

- Title: "Bekur Technologies — Custom Automation for Professional Service Firms"
- Meta description: "We help small professional service firms reclaim partner hours in 3–6 weeks — without rigid SaaS templates, surprise AI bills, or scope creep. One workflow, fixed scope, fixed price."
- OG image: dark card, brand line "We don't bend your firm to the tool.", logo
- Schema.org: Organization + ProfessionalService + FAQPage on home
- Each case study: Article schema

---

## 7. TECH REQUIREMENTS

- Next.js 14+ App Router, TypeScript, Tailwind, motion/react
- Static generation everywhere (no client data fetching on marketing pages)
- Lighthouse targets: 95+ performance, 100 accessibility/SEO
- Forms: server action → email via Resend (or store + notify); honeypot anti-spam
- ONE booking system: Cal.com or Calendly embedded on /blueprint — every "Book a call" CTA site-wide routes there. No raw Google Calendar links anywhere.
- Images: next/image, AVIF/WebP
- Mobile-first; live mockups must degrade gracefully on small screens (stack, don't shrink)

---

## 8. REQUIRED FIXES FROM SITE REVIEW (DO NOT SKIP)

1. Replace ALL Gmail addresses with miki@bekurtechnologies.com (footer currently leaks bekurtechsolution@gmail.com via a Google Calendar link — remove)
2. One booking flow (Section 7) — kill the Google Calendar event-edit URL
3. Remove phone number from contact section; office address moves to footer small text
4. Replace "$20K+ earned" stat with "10/10 five-star engagements · 450+ hours" 
5. Insights section: hide until ≥2 real articles published
6. /terms and /privacy: real pages with real content
7. Fix "All Right Reserved" → "All Rights Reserved"
8. Add Founder section (Section 4, item 10)

---

## 9. CONTENT RULES FOR CLAUDE CODE

- Reuse the existing site copy where listed in Section 4 — it is approved brand copy. Improve rhythm, never change meaning or invent new claims.
- Never invent testimonials, client names, or metrics not in Section 2.
- The "client stories coming as Blueprints complete" honesty framing stays — it's a feature, not a gap.
- When in doubt on tone, re-read Voice principles (Section 2). If a sentence could appear on any agency's site, rewrite it until it could only be Bekur's.
