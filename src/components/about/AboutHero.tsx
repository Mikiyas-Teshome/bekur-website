"use client";

import { motion, useReducedMotion } from "framer-motion";
import BookCallLink from "@/components/BookCallLink";
import { fadeUp, headerContainer } from "@/components/mvp-clone/motion";

type AboutHeroProps = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function AboutHero({
  headline,
  subheadline,
  ctaLabel,
  ctaHref,
}: AboutHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden px-4 pb-14 pt-28 md:px-8 md:pb-16 md:pt-36 lg:pb-20"
      aria-label="About Bekur"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e9edf5] via-[#eef2f8] to-[#f2f5fa] dark:bg-none dark:bg-[#000104]"
        aria-hidden="true"
      >
        <div className="hero-dots absolute inset-0" />
        <div className="hero-glow absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={reducedMotion ? "visible" : "hidden"}
          whileInView={reducedMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.3, margin: "-60px" }}
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
            className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
          >
            {subheadline}
          </motion.p>

          <motion.div variants={fadeUp}>
            <BookCallLink
              href={ctaHref}
              label={ctaLabel}
              variant="primary"
              showArrow
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
