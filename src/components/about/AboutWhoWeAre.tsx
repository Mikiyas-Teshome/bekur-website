"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, fadeUp, headerContainer } from "@/components/mvp-clone/motion";

type Stat = {
  value: string;
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

export default function AboutWhoWeAre({
  eyebrow,
  headline,
  body,
  mission,
  stats,
}: AboutWhoWeAreProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative w-full bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            initial={reducedMotion ? "visible" : "hidden"}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-60px" }}
            variants={headerContainer}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.span
              variants={fadeUp}
              className="mb-5 inline-flex rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
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
              className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
            >
              {body}
            </motion.p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col justify-center rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_12px_40px_-20px_rgba(33,74,156,0.15)] dark:bg-card/95 md:p-8 md:rounded-[32px]"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary dark:text-chart-3">
              Our mission
            </p>
            <p className="text-base leading-relaxed text-foreground md:text-[17px] md:leading-[1.7]">
              {mission}
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 md:mt-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.1, duration: 0.7, ease }}
              className="rounded-[24px] border border-border/50 bg-muted/30 p-6 dark:bg-muted/15 md:rounded-[28px] md:p-8"
            >
              <p className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {stat.value}
              </p>
              <p className="mb-3 text-sm font-semibold text-foreground md:text-base">{stat.label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
