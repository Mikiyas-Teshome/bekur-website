"use client";

import { motion, useReducedMotion } from "framer-motion";
import BookCallLink from "@/components/BookCallLink";
import { ease, fadeUp, headerContainer } from "@/components/mvp-clone/motion";

type AboutHeroProps = {
  headline: string;
  subheadline: string;
  trustLine: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function AboutHero({
  headline,
  subheadline,
  trustLine,
  ctaLabel,
  ctaHref,
}: AboutHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-muted/30 px-4 pb-16 pt-28 dark:bg-background md:px-8 md:pb-20 md:pt-36 lg:pb-24"
      aria-label="About Bekur"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.14),transparent_65%)]" />

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial="hidden"
          animate={reducedMotion ? undefined : "visible"}
          variants={headerContainer}
          className="flex flex-col items-center text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            About us
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mb-6 text-[2.1rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-[3.25rem]"
          >
            {headline.split(" grow").length > 1 ? (
              <>
                {headline.replace(" grow", "")}
                <br />
                <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
                  grow
                </span>
              </>
            ) : (
              headline
            )}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg md:leading-[1.65]"
          >
            {subheadline}
          </motion.p>

          <motion.div variants={fadeUp} className="mb-10">
            <BookCallLink
              href={ctaHref}
              label={ctaLabel}
              variant="primary"
              showArrow
              className="h-12 px-8 text-sm"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="inline-flex h-9 w-9 rounded-full border-2 border-muted/30 bg-gradient-to-br from-primary/30 to-chart-2/40"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">{trustLine}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
