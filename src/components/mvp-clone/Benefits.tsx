"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Clock,
  Gauge,
  GitBranch,
  Layers,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type BenefitItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const brandBenefits: BenefitItem[] = [
  {
    id: "logic",
    title: "Logic before code",
    description: "Mapping and partner sign-off before implementation — your SOP, not a median-firm template.",
    icon: GitBranch,
  },
  {
    id: "accountability",
    title: "Accountability by design",
    description: "Fixed scope, fixed price, written AI cap, approval gates, and change orders only.",
    icon: ShieldCheck,
  },
  {
    id: "hours",
    title: "Reclaimed partner hours",
    description:
      "One workflow off your plate permanently — intake, document chase, and admin bloat automated to your logic.",
    icon: Clock,
  },
  {
    id: "stack",
    title: "Built into your stack",
    description: "CRM, inbox, drives, and spreadsheets stay. We adapt to your tools — no rip-and-replace.",
    icon: Layers,
  },
  {
    id: "economics",
    title: "Predictable economics",
    description: "Hard monthly AI spend cap in scope before kickoff. No surprise token bills or open-ended hours.",
    icon: Gauge,
  },
  {
    id: "operators",
    title: "Built for operators",
    description: "Managing partners and founders decide — not IT committees or procurement theater.",
    icon: Briefcase,
  },
];

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

const headerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

function BenefitCard({
  item,
  index,
  reducedMotion,
}: {
  item: BenefitItem;
  index: number;
  reducedMotion: boolean;
}) {
  const Icon = item.icon;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.7, ease }}
      className="group/benefit relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[24px] border border-border/50 bg-card p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_48px_-20px_rgba(33,74,156,0.22)] dark:bg-card/90 md:min-h-[220px] md:rounded-[28px] md:p-6"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(33,74,156,0.18),transparent_70%)] opacity-80 transition-opacity duration-500 group-hover/benefit:opacity-100 dark:bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,rgba(74,144,226,0.22),transparent_70%)]" />

      <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background/80 dark:bg-background/40">
        <Icon className="h-5 w-5 text-primary dark:text-chart-3" strokeWidth={1.75} />
      </div>

      <h3 className="relative mb-2 text-lg font-bold tracking-tight text-foreground md:text-xl">
        {item.title}
      </h3>
      <p className="relative text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[1.65]">
        {item.description}
      </p>
    </motion.article>
  );
}

export default function Benefits() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-muted/30 px-4 py-20 dark:bg-background md:px-8 md:py-28 lg:py-32"
      aria-label="Benefits"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.06),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.12),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3, margin: "-60px" }}
          variants={headerContainer}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-16 lg:mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            Why Bekur
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            We don&apos;t bend your firm
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              to the tool.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
          >
            We map how you actually operate, then ship one production workflow in 3–6 weeks — fixed
            scope, fixed price, hard AI cap, and measurable ROI inside 90 days.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {brandBenefits.map((item, index) => (
            <BenefitCard
              key={item.id}
              item={item}
              index={index}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
