"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import MarketingButton from "../ui/MarketingButton";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

// Canonical tiers per the offer architecture — do not invent or inflate.
const tiers = [
  {
    name: "Blueprint",
    price: "$2,500",
    priceNote: "one-time",
    description:
      "Logic mapping, a fixed sprint quote, and a go/no-go gate before you commit to a build.",
    features: [
      "Full logic map of one workflow",
      "Fixed sprint quote",
      "Go/no-go decision gate",
      "Credited toward the sprint if you proceed",
    ],
    cta: { label: "Start with a Blueprint", href: "/blueprint#book" },
    popular: false,
  },
  {
    name: "Pilot Sprint",
    price: "$4,500",
    priceNote: "fixed",
    description:
      "One production workflow, shipped into your existing stack in 3–6 weeks.",
    features: [
      "One workflow, end to end",
      "Partner approval gates",
      "Hard monthly AI spend cap",
      "Handoff docs & walkthroughs",
      "90-day ROI target",
    ],
    cta: { label: "Book a call", href: "/blueprint#book" },
    popular: true,
  },
  {
    name: "Standard / Mid-Market",
    price: "from $9,000",
    priceNote: "up to $26K",
    description:
      "Multi-system integrations and heavier operational debt — scoped the same way, sprint by sprint.",
    features: [
      "Multi-system integrations",
      "Complex approval chains",
      "Same guardrails, in writing",
      "One workflow per sprint",
    ],
    cta: { label: "Talk through scope", href: "/contact" },
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <SectionShell id="pricing">
      <SectionHeading
        kicker="Pricing"
        title={
          <>
            Fixed price. <span className="text-mk-text-2">No surprises.</span>
          </>
        }
        subtitle="Every engagement starts with logic, ends in production, and is priced before the build."
        align="center"
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid gap-4 lg:grid-cols-3"
      >
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex h-full flex-col rounded-2xl border p-6 md:p-8 ${
              tier.popular
                ? "border-mk-accent-a25 bg-mk-surface-1 shadow-[0_0_48px_-16px_var(--mk-accent-a25)]"
                : "border-mk-border bg-mk-surface-1"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-mk-accent-a25 bg-mk-bg px-3 py-1 font-mono-mk text-[10px] uppercase tracking-[0.14em] text-mk-accent">
                Popular
              </span>
            )}
            <h3 className="font-display text-lg font-semibold text-mk-text-1">
              {tier.name}
            </h3>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-semibold tracking-tight text-mk-text-1">
                {tier.price}
              </span>
              <span className="font-mono-mk text-[11px] uppercase tracking-[0.12em] text-mk-text-3">
                {tier.priceNote}
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mk-text-2">
              {tier.description}
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-mk-text-2">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-mk-accent"
                    strokeWidth={2}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <MarketingButton
              label={tier.cta.label}
              href={tier.cta.href}
              variant={tier.popular ? "primary" : "secondary"}
              className="mt-8 w-full"
            />
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
