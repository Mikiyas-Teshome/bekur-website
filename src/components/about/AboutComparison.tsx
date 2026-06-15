"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { ease, fadeUp, headerContainer } from "@/components/mvp-clone/motion";

type ComparisonRow = {
  alternative: string;
  theirFailure: string;
  bekurWins: string;
};

const manualPainPoints = [
  "Rigid SaaS templates you bend your firm to fit",
  "Open-ended agency hours and scope creep",
  "Uncapped AI token bills with no architecture",
  "Demos and pilots that never reach production",
  "IT-led purchases your partners won't adopt",
];

type AboutComparisonProps = {
  rows: ComparisonRow[];
};

export default function AboutComparison({ rows }: AboutComparisonProps) {
  const reducedMotion = useReducedMotion();
  const bekurWins = rows.map((r) => r.bekurWins);

  return (
    <section className="relative w-full bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={reducedMotion ? "visible" : "hidden"}
          whileInView={reducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-60px" }}
          variants={headerContainer}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            Why us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            What makes us stand out
            <br />
            <span className="text-muted-foreground">for professional service firms</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-muted-foreground md:text-[17px]">
            Logic-first delivery, fixed economics, and production workflows — not another hype
            cycle or median-firm template.
          </motion.p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease }}
          className="overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_20px_60px_-24px_rgba(33,74,156,0.18)] dark:bg-card/95 md:rounded-[32px]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="border-b border-border/50 bg-muted/20 p-6 dark:bg-muted/10 md:p-8 lg:border-b-0 lg:border-r">
              <p className="mb-6 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Without a logic-first partner
              </p>
              <ul className="space-y-4">
                {manualPainPoints.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={reducedMotion ? false : { opacity: 0, x: -16 }}
                    whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: index * 0.06, duration: 0.55, ease }}
                    className="flex items-start gap-3 text-sm md:text-[15px]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                      <X className="h-3.5 w-3.5 text-destructive" strokeWidth={2} />
                    </span>
                    <span className="leading-relaxed text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/[0.04] p-6 dark:bg-primary/[0.08] md:p-8">
              <p className="mb-6 text-sm font-bold uppercase tracking-[0.12em] text-primary dark:text-chart-3">
                Bekur Automation Sprint
              </p>
              <ul className="space-y-4">
                {bekurWins.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                    whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: index * 0.06, duration: 0.55, ease }}
                    className="flex items-start gap-3 text-sm md:text-[15px]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                      <Check className="h-3.5 w-3.5 text-primary dark:text-chart-3" strokeWidth={2} />
                    </span>
                    <span className="leading-relaxed text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
