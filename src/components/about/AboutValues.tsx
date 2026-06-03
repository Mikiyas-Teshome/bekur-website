"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  GitBranch,
  Layers,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ease, fadeUp, headerContainer } from "@/components/mvp-clone/motion";

type BrandValue = {
  title: string;
  description: string;
};

const valueIcons: Record<string, LucideIcon> = {
  "Logic before code": GitBranch,
  "Accountability by design": ShieldCheck,
  "Proof over promises": Layers,
  "Small is intentional": Users,
  "Built for operators": Briefcase,
};

function ValueCard({
  value,
  index,
  reducedMotion,
}: {
  value: BrandValue;
  index: number;
  reducedMotion: boolean;
}) {
  const Icon = valueIcons[value.title] ?? GitBranch;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.65, ease }}
      className="group relative overflow-hidden rounded-[24px] border border-border/50 bg-card p-6 transition-all duration-500 hover:border-primary/25 hover:shadow-[0_16px_48px_-20px_rgba(33,74,156,0.2)] dark:bg-card/90 md:rounded-[28px] md:p-7"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(33,74,156,0.12),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/15">
        <Icon className="h-5 w-5 text-primary dark:text-chart-3" strokeWidth={1.75} />
      </div>
      <h3 className="relative mb-2 text-lg font-bold text-foreground">{value.title}</h3>
      <p className="relative text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[1.65]">
        {value.description}
      </p>
    </motion.article>
  );
}

type AboutValuesProps = {
  values: BrandValue[];
};

export default function AboutValues({ values }: AboutValuesProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative w-full overflow-hidden bg-muted/30 px-4 py-20 dark:bg-background md:px-8 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(33,74,156,0.06),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={headerContainer}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            Our values
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            The values behind{" "}
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              Bekur
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-muted-foreground md:text-[17px]">
            From innovation to integrity — we build operational systems that empower operators and
            drive measurable impact, not hype cycles.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              value={value}
              index={index}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
