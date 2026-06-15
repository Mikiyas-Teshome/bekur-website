import { z } from "zod";
import {
  brandValueSchema,
  comparisonRowSchema,
  faqItemSchema,
  icpCriterionSchema,
  pageBaseSchema,
  painCardSchema,
  pricingTierSchema,
  processStepSchema,
  proofPointSchema,
  sectionTeaserSchema,
} from "./shared";

export const homePageSchema = pageBaseSchema.extend({
  pageId: z.literal("home"),
  pains: z.array(painCardSchema).length(5),
  sprintTeaser: sectionTeaserSchema,
  comparisonTable: z.array(comparisonRowSchema).min(4).max(4),
  proofPoints: z.array(proofPointSchema).min(3).max(6),
  dynamicTeasers: z.object({
    portfolio: sectionTeaserSchema,
    blog: sectionTeaserSchema,
  }),
  icpStrip: z.object({
    headline: z.string(),
    bullets: z.array(z.string()).min(2).max(5),
  }),
});

export const automationSprintPageSchema = pageBaseSchema.extend({
  pageId: z.literal("automation-sprint"),
  definition: z.object({
    oneLiner: z.string(),
    timeline: z.string(),
    scopeRule: z.string(),
  }),
  process: z.array(processStepSchema).min(3).max(5),
  inclusions: z.array(z.string()).min(3),
  exclusions: z.array(z.string()).min(3),
  deliverables: z.array(z.string()).min(3),
  promises: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

export const blueprintPageSchema = pageBaseSchema.extend({
  pageId: z.literal("blueprint"),
  price: z.object({
    amount: z.number().positive(),
    currency: z.literal("USD"),
    label: z.string(),
  }),
  deliverables: z.array(z.string()).min(3),
  outcomes: z.array(z.string()).min(2),
  nextStep: z.object({
    headline: z.string(),
    description: z.string(),
    cta: z.object({
      label: z.string(),
      href: z.string(),
      type: z.enum(["calendly", "form", "mailto"]),
      embedUrl: z.string().url().optional(),
    }),
  }),
});

export const howWeWorkPageSchema = pageBaseSchema.extend({
  pageId: z.literal("how-we-work"),
  phases: z.array(processStepSchema).min(3).max(4),
  approvalGates: z.array(z.string()).min(2),
  changeOrderPolicy: z.string(),
});

export const whoWeServePageSchema = pageBaseSchema.extend({
  pageId: z.literal("who-we-serve"),
  icp: z.object({
    decisionMaker: z.string(),
    firmSize: z.string(),
    revenueBand: z.string(),
    geography: z.array(z.string()),
    psychographic: z.string(),
  }),
  pains: z.array(painCardSchema).length(5),
  industries: z.array(z.string()).min(5),
  operatorQuotes: z.array(z.string()).min(3).max(6),
  fears: z.array(z.string()).min(3),
  wants: z.array(z.string()).min(3),
  scorecard: z.array(icpCriterionSchema).min(6),
  disqualifiers: z.array(z.string()).min(3),
});

export const whyBekurPageSchema = pageBaseSchema.extend({
  pageId: z.literal("why-bekur"),
  tagline: z.string(),
  comparisonTable: z.array(comparisonRowSchema).min(4).max(4),
  brandValues: z.array(brandValueSchema).length(5),
  deliveryPromises: z.array(
    z.object({
      promise: z.string(),
      commitment: z.string(),
    })
  ),
});

export const pricingPageSchema = pageBaseSchema.extend({
  pageId: z.literal("pricing"),
  intro: z.string(),
  tiers: z.array(pricingTierSchema).min(2).max(4),
  blueprintNote: z.object({
    headline: z.string(),
    body: z.string(),
    href: z.string(),
  }),
  disclaimer: z.string(),
});

export const faqPageSchema = pageBaseSchema.extend({
  pageId: z.literal("faq"),
  items: z.array(faqItemSchema).min(8),
});

export const aboutPageSchema = pageBaseSchema.extend({
  pageId: z.literal("about"),
  whoWeAre: z.object({
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
  }),
  stats: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        description: z.string(),
      })
    )
    .length(3),
  mission: z.string(),
  vision: z.string(),
  delivery: z.object({
    headquarters: z.string(),
    serviceArea: z.string(),
  }),
  teamPrinciple: z.string(),
  proofPoints: z.array(proofPointSchema).min(2),
});

export const contactPageSchema = pageBaseSchema.extend({
  pageId: z.literal("contact"),
  intro: z.string(),
  qualificationFields: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(["text", "email", "select", "textarea"]),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
    })
  ),
  calendarEmbedUrl: z.string().url().optional(),
});

export const pageSchemaById = {
  home: homePageSchema,
  "automation-sprint": automationSprintPageSchema,
  blueprint: blueprintPageSchema,
  "how-we-work": howWeWorkPageSchema,
  "who-we-serve": whoWeServePageSchema,
  "why-bekur": whyBekurPageSchema,
  pricing: pricingPageSchema,
  faq: faqPageSchema,
  about: aboutPageSchema,
  contact: contactPageSchema,
} as const;

export type PageId = keyof typeof pageSchemaById;

export const PAGE_FILES: Record<PageId, string> = {
  home: "home.json",
  "automation-sprint": "automation-sprint.json",
  blueprint: "blueprint.json",
  "how-we-work": "how-we-work.json",
  "who-we-serve": "who-we-serve.json",
  "why-bekur": "why-bekur.json",
  pricing: "pricing.json",
  faq: "faq.json",
  about: "about.json",
  contact: "contact.json",
};
