"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GitBranch, Rocket, Target, TrendingUp, type LucideIcon } from "lucide-react";
import { ease, fadeUp, headerContainer } from "@/components/mvp-clone/motion";

type Stat = {
  value: string;
  unit: string;
  label: string;
  description: string;
};

type AboutWhoWeAreProps = {
  eyebrow: string;
  headline: string;
  body: string;
  mission: string;
  stats: Stat[];
};

const statIcons: Record<string, LucideIcon> = {
  workflow: GitBranch,
  weeks: Rocket,
  days: TrendingUp,
};

export default function AboutWhoWeAre({
  eyebrow,
  headline,
  body,
  mission,
  stats,
}: AboutWhoWeAreProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.06),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.12),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <motion.div
            initial={reducedMotion ? "visible" : "hidden"}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={headerContainer}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.span
              variants={fadeUp}
              className="mb-5 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm"
            >
              {eyebrow}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mb-6 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.35rem]"
            >
              {headline}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
            >
              {body}
            </motion.p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease }}
            className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_12px_40px_-20px_rgba(33,74,156,0.15)] dark:bg-card/95 md:rounded-[32px] md:p-8"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(33,74,156,0.1),transparent_70%)]" />
            <div className="relative">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-primary/10 dark:bg-primary/15">
                <Target className="h-5 w-5 text-primary dark:text-chart-3" strokeWidth={1.75} />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary dark:text-chart-3">
                Our mission
              </p>
              <p className="text-base leading-relaxed text-foreground md:text-[17px] md:leading-[1.7]">
                {mission}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 md:mt-16">
          {stats.map((stat, index) => {
            const Icon = statIcons[stat.unit] ?? GitBranch;

            return (
              <motion.article
                key={stat.label}
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.7, ease }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border/50 bg-card p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 hover:border-primary/25 hover:shadow-[0_16px_48px_-20px_rgba(33,74,156,0.18)] dark:bg-card/95 md:rounded-[28px] md:p-8"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(33,74,156,0.1),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div
                  className="relative mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 text-primary dark:text-chart-3" strokeWidth={1.75} />
                </div>
                <div className="relative mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground md:text-[2.75rem]">
                    {stat.value}
                  </span>
                  <span className="text-lg font-semibold text-muted-foreground md:text-xl">
                    {stat.unit}
                  </span>
                </div>
                <p className="relative mb-2 text-base font-semibold leading-snug text-foreground">
                  {stat.label}
                </p>
                <p className="relative text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[1.65]">
                  {stat.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
