"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import PricingPlanCta from "@/components/mvp-clone/PricingPlanCta";
import { cn } from "@/lib/utils";
import { ease, fadeUp, headerContainer } from "./motion";

type Plan = {
  id: string;
  title: string;
  desc: string;
  price: string;
  unit: string;
  features: string[];
  featured?: boolean;
  badge?: string;
  cta: { label: string; href: string };
};

const plans: Plan[] = [
  {
    id: "blueprint",
    title: "Blueprint",
    desc: "Optional front door. Map your logic and fix the sprint quote before full build.",
    price: "$2,500",
    unit: "one time",
    features: [
      "Logic mapping deliverable",
      "Workflow & approval map",
      "Fixed sprint quote before build",
      "AI spend cap recommendation",
      "Go / no-go decision gate",
      "Credited toward sprint if you proceed",
    ],
    cta: { label: "Book a call", href: "/book" },
  },
  {
    id: "pilot",
    title: "Pilot Sprint",
    desc: "One workflow, 3–6 weeks, fixed scope. Ideal for your first Automation Sprint.",
    price: "$4,500",
    unit: "fixed price",
    badge: "Popular",
    featured: true,
    features: [
      "One production workflow",
      "3–6 week delivery",
      "Hard monthly AI spend cap",
      "Built into your existing stack",
      "Partner approval on client-facing steps",
      "Senior-only team — no juniors",
    ],
    cta: { label: "Start a Sprint", href: "/automation-sprint" },
  },
  {
    id: "standard",
    title: "Standard / Mid-Market",
    desc: "Multi-system integrations and firms with heavier operational debt.",
    price: "$9,000",
    unit: "starts at",
    features: [
      "Multi-step workflow automation",
      "CRM, email & drive integration",
      "Custom approval gates",
      "90-day ROI measurement plan",
      "Change orders only — no scope creep",
      "Up to $26K for full mid-market tier",
    ],
    cta: { label: "Discuss your workflow", href: "/contact" },
  },
];

function PricingCard({
  plan,
  index,
  reducedMotion,
}: {
  plan: Plan;
  index: number;
  reducedMotion: boolean;
}) {
  const featured = plan.featured;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "-48px" }}
      transition={{ delay: index * 0.1, duration: 0.75, ease }}
      whileHover={reducedMotion ? undefined : { y: -6 }}
      className={cn(
        "relative flex flex-col rounded-[24px] border p-7 transition-[box-shadow,border-color] duration-500 md:rounded-[28px] md:p-8",
        featured
          ? "z-10 border-transparent bg-[#0c0c0c] text-white shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] md:scale-[1.04] dark:border-border/80 dark:bg-card dark:text-foreground dark:shadow-[0_32px_80px_-24px_rgba(33,74,156,0.35)]"
          : "border-border/60 bg-card text-foreground shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)] hover:border-border hover:shadow-[0_20px_48px_-20px_rgba(0,0,0,0.12)] dark:bg-card/95",
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3
          className={cn(
            "text-lg font-semibold tracking-tight md:text-xl",
            featured ? "text-white dark:text-foreground" : "text-foreground",
          )}
        >
          {plan.title}
        </h3>
        {plan.badge && (
          <span className="rounded-full bg-[#E1443A] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {plan.badge}
          </span>
        )}
      </div>

      <div className="mb-4">
        <p
          className={cn(
            "flex flex-wrap items-baseline gap-x-2 gap-y-0 font-bold tracking-tight",
            featured ? "text-white dark:text-foreground" : "text-foreground",
          )}
        >
          {plan.unit === "starts at" && (
            <span
              className={cn(
                "text-sm font-medium capitalize",
                featured ? "text-white/60 dark:text-muted-foreground" : "text-muted-foreground",
              )}
            >
              Starts at
            </span>
          )}
          <span className="text-[2.5rem] leading-none md:text-[2.75rem]">{plan.price}</span>
          {plan.unit !== "starts at" && (
            <span
              className={cn(
                "text-base font-medium capitalize",
                featured ? "text-white/60 dark:text-muted-foreground" : "text-muted-foreground",
              )}
            >
              /{plan.unit}
            </span>
          )}
        </p>
      </div>

      <p
        className={cn(
          "mb-8 min-h-[3.25rem] text-sm leading-relaxed md:text-[15px] md:leading-[1.6]",
          featured ? "text-white/70 dark:text-muted-foreground" : "text-muted-foreground",
        )}
      >
        {plan.desc}
      </p>

      <div className="mb-8">
        <PricingPlanCta href={plan.cta.href} label={plan.cta.label} tone={featured ? "inverted" : "default"} />
      </div>

      <div
        className={cn(
          "mb-5 text-sm font-semibold",
          featured ? "text-white/90 dark:text-foreground" : "text-foreground",
        )}
      >
        What&apos;s included:
      </div>

      <ul className="flex flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                featured
                  ? "bg-white/15 text-white dark:bg-primary/15 dark:text-chart-3"
                  : "bg-muted text-foreground/70 dark:bg-muted/80",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <span
              className={cn(
                "text-sm leading-snug",
                featured ? "text-white/85 dark:text-muted-foreground" : "text-muted-foreground",
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export default function Pricing() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-muted/40 px-4 py-20 dark:bg-muted/20 md:px-8 md:py-28 lg:py-32"
      aria-label="Pricing"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(33,74,156,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(33,74,156,0.14),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3, margin: "-60px" }}
          variants={headerContainer}
          className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center md:mb-16 lg:mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            Pricing
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            The right engagement,
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              at a fixed price.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
          >
            Choose a tier that fits your firm. One workflow per sprint, hard AI cap, no open-ended
            discovery.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              index={index}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
