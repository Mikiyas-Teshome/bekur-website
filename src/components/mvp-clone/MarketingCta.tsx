"use client";

import { motion, useReducedMotion } from "framer-motion";
import BookCallLink from "@/components/BookCallLink";
import { ease } from "./motion";

type MarketingCtaProps = {
  ctaLabel: string;
  ctaHref: string;
  title?: string;
  subtitle?: string;
};

export default function MarketingCta({
  ctaLabel,
  ctaHref,
  title = "Let logic-first automation do the work",
  subtitle = "Book a call — map your workflow, fix the sprint quote, and decide go / no-go before production code.",
}: MarketingCtaProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative w-full px-4 pb-20 pt-4 md:px-8 md:pb-28 lg:pb-32" aria-label="Book a call">
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-14 text-center shadow-[0_24px_64px_-24px_rgba(33,74,156,0.5)] dark:border dark:border-border dark:bg-card md:rounded-[40px] md:px-16 md:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-10"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative z-10">
            <h2 className="mb-3 text-2xl font-bold leading-tight text-primary-foreground dark:text-foreground md:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-primary-foreground/85 dark:text-muted-foreground md:text-lg">
              {subtitle}
            </p>
            <BookCallLink
              href={ctaHref}
              label={ctaLabel}
              variant="ctaBanner"
              showArrow
              arrowType="right"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
