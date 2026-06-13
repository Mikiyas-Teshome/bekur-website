import { z } from "zod";

const pathOrAnchorHref = z.string().regex(/^\/[^#]*(#.+)?$/);

export const seoMetaSchema = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(50).max(160),
  canonicalPath: z.string().regex(/^\//),
  ogImage: z.string().optional(),
  noindex: z.boolean().optional(),
});

export const ctaSchema = z.object({
  label: z.string().min(2),
  href: pathOrAnchorHref,
  variant: z.enum(["primary", "secondary", "ghost"]).optional(),
});

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const painCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  iconKey: z
    .enum([
      "rigid-saas",
      "ai-cost",
      "data-silos",
      "failed-pilots",
      "billable-leakage",
    ])
    .optional(),
});

export const processStepSchema = z.object({
  order: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  duration: z.string().optional(),
});

export const comparisonRowSchema = z.object({
  alternative: z.string(),
  theirFailure: z.string(),
  bekurWins: z.string(),
});

export const brandValueSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const proofPointSchema = z.object({
  id: z.string(),
  headline: z.string(),
  detail: z.string(),
  metric: z.string().optional(),
  href: z.string().optional(),
});

export const pricingTierSchema = z.object({
  id: z.enum(["pilot", "standard", "mid-market"]),
  name: z.string(),
  priceFrom: z.number().positive(),
  priceTo: z.number().positive().optional(),
  currency: z.literal("USD"),
  timelineWeeks: z.string(),
  idealFor: z.string(),
  includes: z.array(z.string()).min(1),
  excludes: z.array(z.string()).optional(),
});

export const faqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z
    .enum(["offer", "process", "pricing", "fit", "technical", "disqualifiers"])
    .optional(),
});

export const icpCriterionSchema = z.object({
  label: z.string(),
  weight: z.number().int().min(1).max(25),
  passSignal: z.string(),
});

export const sectionTeaserSchema = z.object({
  title: z.string(),
  description: z.string(),
  href: z.string(),
  ctaLabel: z.string().optional(),
});

export const pageBaseSchema = z.object({
  pageId: z.string(),
  version: z.string().regex(/^\d+\.\d+$/),
  seo: seoMetaSchema,
  hero: z.object({
    eyebrow: z.string().optional(),
    badge: z.string().optional(),
    headline: z.string(),
    headlineLines: z
      .array(
        z.object({
          text: z.string(),
          accent: z.boolean().optional(),
          sparkle: z.boolean().optional(),
        })
      )
      .min(2)
      .max(3)
      .optional(),
    subheadline: z.string(),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema.optional(),
  }),
});

export type SeoMeta = z.infer<typeof seoMetaSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type PainCard = z.infer<typeof painCardSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;
export type ComparisonRow = z.infer<typeof comparisonRowSchema>;
export type BrandValue = z.infer<typeof brandValueSchema>;
export type ProofPoint = z.infer<typeof proofPointSchema>;
export type PricingTier = z.infer<typeof pricingTierSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
