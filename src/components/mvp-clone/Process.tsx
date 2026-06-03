"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  CalendarClock,
  GitBranch,
  Layers,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type ProcessStep = {
  id: string;
  icon: LucideIcon;
  title: string;
  duration: string;
  description: string;
  tags: string[];
};

const steps: ProcessStep[] = [
  {
    id: "01",
    icon: GitBranch,
    title: "Logic mapping",
    duration: "Weeks 1–2",
    description:
      "We document how work actually flows — triggers, data sources, approvals, and exceptions — and fix broken logic before a line of code is written.",
    tags: ["Logic map", "Approval rules", "Fixed sprint quote"],
  },
  {
    id: "02",
    icon: Layers,
    title: "Fixed-scope build",
    duration: "Weeks 3–5",
    description:
      "A senior-only team ships one production workflow into your existing stack. AI spend limits and monitoring are part of the architecture, not an afterthought.",
    tags: ["Your stack", "Hard AI cap", "Fixed price"],
  },
  {
    id: "03",
    icon: Rocket,
    title: "Approval & go-live",
    duration: "Week 6",
    description:
      "Partners sign off on every client-facing step. Your team gets handoff docs, walkthroughs, and a workflow they use Monday morning — not another shelved pilot.",
    tags: ["Partner gates", "Handoff docs", "90-day ROI"],
  },
];

const sprintChips = [
  { icon: CalendarClock, label: "3–6 weeks" },
  { icon: Layers, label: "One workflow" },
  { icon: ShieldCheck, label: "Fixed scope & price" },
];

const ease = [0.25, 0.1, 0.25, 1] as const;
const stepCount = steps.length;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ProcessStepCard({
  step,
  index,
  scrollYProgress,
  reducedMotion,
}: {
  step: ProcessStep;
  index: number;
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const StepIcon = step.icon;
  const isRight = index % 2 === 1;
  const portion = 1 / stepCount;
  const enterStart = Math.max(0, index * portion - portion * 0.1);
  const enterEnd = index * portion + portion * 0.5;
  const activeStart = Math.max(0, index * portion - 0.02);
  const activeEnd = Math.min(1, (index + 1) * portion + 0.02);

  const cardOpacity = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 1] : [enterStart, enterEnd],
    reducedMotion ? [1, 1] : [0.25, 1],
  );

  const cardX = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 1] : [enterStart, enterEnd],
    reducedMotion ? [0, 0] : [isRight ? 40 : -40, 0],
  );

  const cardY = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 1] : [enterStart, enterEnd],
    reducedMotion ? [0, 0] : [32, 0],
  );

  const ringGlow = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 1] : [activeStart, activeStart + portion * 0.18, activeEnd - portion * 0.18, activeEnd],
    reducedMotion ? [0, 0, 0, 0] : [0, 1, 1, 0],
  );

  const numberScale = useTransform(
    scrollYProgress,
    reducedMotion ? [0, 1] : [activeStart, activeStart + portion * 0.22],
    reducedMotion ? [1, 1] : [1, 1.1],
  );

  const cardGlow = useTransform(ringGlow, [0, 1], [0, 1]);

  return (
    <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_3.5rem_1fr] lg:gap-x-10 lg:gap-y-0">
      <motion.div
        style={{ scale: numberScale }}
        className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center lg:col-start-2 lg:row-start-1"
      >
        <motion.div
          style={{ opacity: ringGlow }}
          className="absolute inset-0 rounded-full bg-primary/25 blur-lg dark:bg-primary/35"
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-muted/30 bg-muted/30 dark:border-background dark:bg-background">
          <motion.div
            style={{ opacity: ringGlow }}
            className="absolute inset-0 rounded-full border-2 border-primary/55 dark:border-chart-3/55"
          />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card font-mono text-xs font-bold text-muted-foreground shadow-sm">
            {step.id}
          </div>
        </div>
      </motion.div>

      <motion.article
        style={{
          opacity: cardOpacity,
          x: cardX,
          y: cardY,
        }}
        className={`group relative w-full max-w-md justify-self-center lg:max-w-none lg:justify-self-stretch ${
          isRight ? "lg:col-start-3 lg:row-start-1" : "lg:col-start-1 lg:row-start-1"
        }`}
      >
        <motion.div
          style={{ opacity: cardGlow }}
          className="pointer-events-none absolute -inset-px rounded-[28px] bg-[linear-gradient(135deg,var(--primary),var(--chart-2))] opacity-0"
        />

        <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card p-5 shadow-[0_8px_32px_-16px_rgba(33,74,156,0.12),inset_0_1px_0_0_rgba(255,255,255,0.5)] transition-colors duration-500 group-hover:border-primary/20 dark:border-border/40 dark:bg-card/90 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.035] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-primary/[0.06]" />

          <div className={`relative flex flex-col gap-4 ${isRight ? "lg:text-left" : "lg:text-right lg:items-end"}`}>
            <div className={`flex items-start gap-3 ${isRight ? "" : "lg:flex-row-reverse lg:text-right"}`}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/10 dark:bg-primary/15">
                <StepIcon className="h-5 w-5 text-primary dark:text-chart-3" strokeWidth={1.75} />
              </div>
              <div className={`min-w-0 flex-1 ${isRight ? "" : "lg:flex lg:flex-col lg:items-end"}`}>
                <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary/80 dark:text-chart-3/80">
                  {step.duration}
                </p>
                <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">{step.title}</h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[1.65]">
              {step.description}
            </p>

            <div className={`flex flex-wrap gap-2 ${isRight ? "" : "lg:justify-end"}`}>
              {step.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/80 bg-background/50 px-3 py-1 text-[11px] font-medium text-foreground/75"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function ProcessTimeline({ reducedMotion }: { reducedMotion: boolean }) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.3"],
  });

  const lineScale = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div
      ref={timelineRef}
      style={{ position: "relative" }}
      className="relative mx-auto max-w-4xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-border/45 lg:block"
      />
      <motion.div
        style={{ scaleY: reducedMotion ? 1 : lineScale }}
        className="pointer-events-none absolute bottom-8 left-1/2 top-8 hidden w-px origin-top -translate-x-1/2 bg-[linear-gradient(180deg,var(--primary),var(--chart-2),var(--chart-3))] lg:block"
      />

      <div className="relative flex flex-col gap-14 md:gap-20 lg:gap-24">
        {steps.map((step, index) => (
          <ProcessStepCard
            key={step.id}
            step={step}
            index={index}
            scrollYProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

export default function Process() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-muted/30 px-4 py-20 dark:bg-background md:px-8 md:py-28 lg:py-32"
      aria-label="Our process"
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
            Our process
          </motion.span>

          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.65, ease }}
            className="mb-4 max-w-3xl text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            Map first. Build once.
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              Go live with confidence.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65, ease }}
            className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px]"
          >
            Every Automation Sprint runs the same three phases — no open-ended discovery, no
            surprise scope. One workflow, economics locked before kickoff.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65, ease }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {sprintChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm"
              >
                <chip.icon className="h-3.5 w-3.5 text-primary dark:text-chart-3" strokeWidth={1.75} />
                {chip.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <ProcessTimeline reducedMotion={!!reducedMotion} />

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease, delay: 0.08 }}
          className="mt-12 flex flex-col items-center justify-center"
        >
          <Link
            href="/how-we-work"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/90 bg-card/70 px-6 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/35 hover:bg-card active:scale-[0.98]"
          >
            Full delivery model
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
