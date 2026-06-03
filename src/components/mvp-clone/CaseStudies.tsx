"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import CaseStudiesShowcase from "./case-studies/CaseStudiesShowcase";
import FeaturedProject from "./FeaturedProject";

const CASE_STUDIES_LAYOUT = "showcase" as "showcase" | "carousel";

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const proofChips = [
  "Production systems — not demos",
  "Same sprint discipline",
  "Client stories as Blueprints complete",
];

export default function CaseStudies() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="shipped-systems"
      className="relative w-full scroll-mt-28 overflow-hidden bg-muted/30 px-4 py-20 dark:bg-background md:px-8 md:py-28 lg:py-32"
      aria-label="Shipped systems"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(33,74,156,0.07),transparent_65%)] dark:bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(33,74,156,0.14),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="mb-12 flex flex-col items-center text-center md:mb-14 lg:mb-16"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.65, ease }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm"
          >
            <Layers className="h-3.5 w-3.5 text-primary dark:text-chart-3" strokeWidth={1.75} />
            Shipped systems
          </motion.span>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.65, ease }}
            className="mb-4 max-w-3xl text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            Proof we ship.
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              Your workflow is next.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65, ease }}
            className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px]"
          >
            We publish client sprint stories with permission as Blueprint engagements complete.
            Until then — production systems we&apos;ve built and run, and what each one proves
            about how we&apos;ll deliver yours.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65, ease }}
            className="mb-4 flex flex-wrap items-center justify-center gap-2.5"
          >
            {proofChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground/75 backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.65, ease }}>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 dark:text-chart-3"
            >
              View all work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        {CASE_STUDIES_LAYOUT === "showcase" ? (
          <CaseStudiesShowcase reducedMotion={!!reducedMotion} />
        ) : (
          <FeaturedProject reducedMotion={!!reducedMotion} />
        )}
      </div>
    </section>
  );
}
