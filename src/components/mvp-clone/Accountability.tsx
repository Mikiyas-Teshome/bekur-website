"use client";

import Link from "next/link";
import BookCallLink from "@/components/BookCallLink";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  FilePenLine,
  Gauge,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

type AccountabilityGate = {
  id: string;
  title: string;
  detail: string;
  icon: LucideIcon;
};

const gates: AccountabilityGate[] = [
  {
    id: "partner",
    title: "Partner gates",
    detail:
      "Every client-facing automated step requires partner-defined approval rules before anything reaches a client.",
    icon: UserCheck,
  },
  {
    id: "scope",
    title: "Written change orders",
    detail:
      "Material scope changes only via signed change order — no silent creep, no open-ended discovery hours.",
    icon: FilePenLine,
  },
  {
    id: "ai-cap",
    title: "Hard AI spend cap",
    detail:
      "Monthly AI limit agreed in writing before build begins, with monitoring wired into the architecture.",
    icon: Gauge,
  },
];

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function GateCard({
  gate,
  index,
  reducedMotion,
}: {
  gate: AccountabilityGate;
  index: number;
  reducedMotion: boolean;
}) {
  const GateIcon = gate.icon;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.55, ease }}
      className="group/gate relative overflow-hidden rounded-2xl border border-border/55 bg-muted/30 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)] transition-all duration-500 hover:border-primary/25 hover:shadow-[0_12px_40px_-16px_rgba(33,74,156,0.14)] dark:bg-muted/15 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/gate:opacity-100 dark:from-primary/[0.07]" />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/10 dark:bg-primary/15">
          <GateIcon className="h-5 w-5 text-primary dark:text-chart-3" strokeWidth={1.75} />
        </div>
        <span className="rounded-full border border-border/60 bg-background/50 px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
          0{index + 1}
        </span>
      </div>

      <h3 className="relative mb-2 text-base font-bold text-foreground md:text-[17px]">{gate.title}</h3>
      <p className="relative text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[1.65]">
        {gate.detail}
      </p>
    </motion.div>
  );
}

function AccountabilityShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-5 rounded-[44px] bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.12),transparent_72%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(74,144,226,0.16),transparent_72%)]" />

      <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_20px_60px_-24px_rgba(33,74,156,0.2),inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-md dark:border-border/35 dark:bg-card/95 dark:shadow-[0_28px_72px_-24px_rgba(33,74,156,0.38),inset_0_1px_0_0_rgba(255,255,255,0.04)] md:rounded-[32px]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-emerald-500/[0.04] dark:from-primary/[0.09] dark:to-emerald-500/[0.06]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(33,74,156,0.07) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/[0.07] blur-3xl dark:bg-primary/[0.14]" />

        <div className="relative flex items-center gap-2.5 border-b border-border/45 px-4 py-3 md:px-5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15 dark:bg-muted-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/10 dark:bg-muted-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Enforced
            </span>
          </span>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
            Sprint guardrails
          </span>
        </div>

        <div className="relative p-4 md:p-5">{children}</div>
      </div>
    </div>
  );
}

export default function Accountability() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32"
      aria-label="Accountability built in"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16 xl:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.span
              variants={fadeUp}
              transition={{ duration: 0.65, ease }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary dark:text-chart-3"
            >
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              Accountability
            </motion.span>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.65, ease }}
              className="mb-4 max-w-xl text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
            >
              Built in,
              <br />
              <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
                not bolted on.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65, ease }}
              className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
            >
              Generic agencies sell demos. We ship production workflows with guardrails your
              partners can trust — written into scope before kickoff, not buried in the fine print.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65, ease }}
              className="mb-8 flex flex-wrap justify-center gap-2 lg:justify-start"
            >
              {["Scope locked at kickoff", "No open-ended hours", "One workflow per sprint"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-border/80 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-foreground/75 backdrop-blur-sm"
                  >
                    {label}
                  </span>
                ),
              )}
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65, ease }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <BookCallLink variant="primary" showArrow />
              <Link
                href="/how-we-work"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/90 bg-card/70 px-6 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/35 hover:bg-card active:scale-[0.98]"
              >
                Full delivery model
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease }}
          >
            <AccountabilityShell>
              <div className="space-y-3">
                {gates.map((gate, index) => (
                  <GateCard
                    key={gate.id}
                    gate={gate}
                    index={index}
                    reducedMotion={!!reducedMotion}
                  />
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-border/50 bg-muted/25 px-4 py-3 dark:bg-muted/15">
                <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                  <span className="font-semibold text-foreground/85">Optional Blueprint</span>
                  {" · "}
                  Weeks 1–2 de-risk the sprint quote before full build — credited if you proceed.
                </p>
              </div>
            </AccountabilityShell>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
