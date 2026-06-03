import { z } from "zod";

export const portfolioPainTagSchema = z.enum([
  "rigid-saas",
  "ai-cost",
  "data-silos",
  "failed-pilots",
  "billable-leakage",
  "client-intake",
  "document-chase",
  "invoicing-reconciliation",
  "status-reporting",
  "crm-handoff",
]);

export const portfolioCaseStudyMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string(),
  excerpt: z.string().max(200),
  firmType: z.string(),
  workflowAutomated: z.string(),
  stackIntegrated: z.array(z.string()).min(1),
  timelineWeeks: z.string(),
  outcomeMetric: z.string(),
  painTags: z.array(portfolioPainTagSchema).min(1),
  featured: z.boolean().optional(),
  isSprintCaseStudy: z.boolean(),
  legacyCategory: z.string().optional(),
});

export const blogPostMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string(),
  excerpt: z.string().max(200),
  editorialLane: z.enum([
    "operator-playbook",
    "automation-economics",
    "stack-integration",
    "anti-patterns",
  ]),
  painTags: z.array(portfolioPainTagSchema).optional(),
  relatedPortfolioSlugs: z.array(z.string()).optional(),
  ctaHref: z.string().default("/blueprint#book"),
});

export type PortfolioCaseStudyMeta = z.infer<
  typeof portfolioCaseStudyMetaSchema
>;
export type BlogPostMeta = z.infer<typeof blogPostMetaSchema>;
