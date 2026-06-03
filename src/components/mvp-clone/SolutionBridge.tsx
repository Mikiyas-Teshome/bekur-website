"use client";

import Link from "next/link";
import BookCallLink from "@/components/BookCallLink";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  GitBranch,
  Layers,
  ShieldCheck,
  Mail,
  Database,
  FileSpreadsheet,
  UserCheck,
  Sparkles,
  CircleDot,
  ClipboardList,
  FileSearch,
  Receipt,
  Bell,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

type WorkflowStep = {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
};

type WorkflowOutput = {
  icon: LucideIcon;
  label: string;
};

type WorkflowScenario = {
  id: string;
  badge: string;
  triggerLabel: string;
  triggerDetail: string;
  activeSources: string[];
  steps: WorkflowStep[];
  logs: string[];
  outputs: WorkflowOutput[];
};

const stackSources = [
  { id: "inbox", icon: Mail, label: "Inbox" },
  { id: "crm", icon: Database, label: "CRM" },
  { id: "forms", icon: ClipboardList, label: "Forms" },
  { id: "sheets", icon: FileSpreadsheet, label: "Sheets" },
];

const workflowScenarios: WorkflowScenario[] = [
  {
    id: "intake",
    badge: "Matter intake",
    triggerLabel: "New matter signal",
    triggerDetail: "Form submit · CRM update · inbox — one trigger",
    activeSources: ["forms", "crm", "inbox"],
    steps: [
      {
        id: "map",
        label: "Map firm logic",
        detail: "Rules, fields & exceptions from your SOP",
        icon: GitBranch,
      },
      {
        id: "approve",
        label: "Partner approval gate",
        detail: "Route to managing partner for sign-off",
        icon: UserCheck,
      },
      {
        id: "sync",
        label: "Sync across stack",
        detail: "CRM, drive, tasks & notifications",
        icon: Database,
      },
    ],
    logs: [
      "Logic map applied · 14 rules matched",
      "Partner approval routed to J. Smith",
      "CRM record created · drive folder ready",
      "Tasks assigned · team notified",
    ],
    outputs: [
      { icon: Database, label: "CRM updated" },
      { icon: FolderOpen, label: "Drive ready" },
      { icon: Bell, label: "Team notified" },
    ],
  },
  {
    id: "documents",
    badge: "Document chase",
    triggerLabel: "Matter status changed",
    triggerDetail: "CRM webhook · drive folder watch",
    activeSources: ["crm", "sheets"],
    steps: [
      {
        id: "match",
        label: "Match required docs",
        detail: "Checklist vs. files in matter folder",
        icon: FileSearch,
      },
      {
        id: "review",
        label: "Partner review step",
        detail: "Flag gaps · approve client follow-up",
        icon: UserCheck,
      },
      {
        id: "close",
        label: "Update matter file",
        detail: "CRM status · client request sent",
        icon: Database,
      },
    ],
    logs: [
      "CRM status → awaiting documents",
      "3 of 5 required docs found",
      "Gap flagged · partner notified",
      "Client follow-up queued for review",
    ],
    outputs: [
      { icon: FileSearch, label: "Gaps flagged" },
      { icon: Mail, label: "Client request" },
      { icon: Database, label: "Matter updated" },
    ],
  },
  {
    id: "billing",
    badge: "Billing reconciliation",
    triggerLabel: "Period close initiated",
    triggerDetail: "Timesheet export · ledger pull",
    activeSources: ["sheets", "crm"],
    steps: [
      {
        id: "reconcile",
        label: "Reconcile line items",
        detail: "Hours, rates & write-offs vs. ledger",
        icon: Sparkles,
      },
      {
        id: "signoff",
        label: "Partner sign-off",
        detail: "Exceptions surfaced before invoicing",
        icon: UserCheck,
      },
      {
        id: "invoice",
        label: "Generate & send",
        detail: "Invoice draft · CRM billing sync",
        icon: Receipt,
      },
    ],
    logs: [
      "Timesheet export ingested · 847 lines",
      "12 exceptions flagged for review",
      "Partner approved batch · 835 lines",
      "Invoices queued · CRM billing synced",
    ],
    outputs: [
      { icon: Receipt, label: "Invoices sent" },
      { icon: FileSpreadsheet, label: "Ledger synced" },
      { icon: Database, label: "CRM billing" },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative inline-flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-7 text-[15px] font-semibold text-primary-foreground shadow-[0_4px_24px_-4px_rgba(33,74,156,0.55)] transition-all hover:shadow-[0_8px_32px_-4px_rgba(33,74,156,0.65)] active:scale-[0.98] sm:w-auto sm:min-w-[200px]"
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0.14)_0%,transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="relative">{children}</span>
      <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border/90 bg-card/70 px-7 text-[15px] font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/35 hover:bg-card active:scale-[0.98] sm:w-auto sm:min-w-[168px]"
    >
      {children}
    </Link>
  );
}

function DemoShell({
  children,
  badge,
  reducedMotion,
}: {
  children: React.ReactNode;
  badge: string;
  reducedMotion: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <div className="pointer-events-none absolute -inset-6 rounded-[48px] bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.12),transparent_72%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(74,144,226,0.18),transparent_72%)]" />

      <div className="group/demo relative overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_20px_60px_-24px_rgba(33,74,156,0.18),inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-md dark:border-border/35 dark:bg-card/95 dark:shadow-[0_28px_72px_-24px_rgba(33,74,156,0.38),inset_0_1px_0_0_rgba(255,255,255,0.04)] md:rounded-[32px]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-chart-3/[0.05] dark:from-primary/[0.08] dark:to-chart-2/[0.06]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(33,74,156,0.07) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/[0.06] blur-3xl dark:bg-primary/[0.12]" />

        <div className="relative flex items-center gap-2.5 border-b border-border/45 px-4 py-3 md:px-5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15 dark:bg-muted-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/10 dark:bg-muted-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/30 dark:bg-primary/45" />
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live
            </span>
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={badge}
              initial={reducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className="ml-auto rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {badge} · Sprint
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="relative p-4 md:p-5">{children}</div>
      </div>
    </div>
  );
}

function DemoPanel({
  children,
  className = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {glow && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.14),transparent_70%)]" />
      )}
      <div className="relative rounded-2xl border border-border/55 bg-muted/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)] dark:bg-muted/15 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
        {children}
      </div>
    </div>
  );
}

function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "success" | "active" | "neutral";
}) {
  const tones = {
    success:
      "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-400",
    active: "border-primary/25 bg-primary/[0.08] text-primary dark:text-chart-3",
    neutral: "border-border/60 bg-background/50 text-muted-foreground",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function FlowConnector({ reducedMotion, delay = 0 }: { reducedMotion: boolean; delay?: number }) {
  return (
    <div className="relative flex justify-center py-1">
      <div className="h-7 w-px bg-gradient-to-b from-primary/35 via-primary/20 to-transparent dark:from-chart-2/45" />
      {!reducedMotion && (
        <motion.div
          animate={{ y: [0, 22, 0], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
          className="absolute top-0 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(33,74,156,0.5)] dark:bg-chart-3 dark:shadow-[0_0_8px_rgba(123,179,240,0.5)]"
        />
      )}
    </div>
  );
}

function AutomationDemo({ reducedMotion }: { reducedMotion: boolean }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const scenario = workflowScenarios[scenarioIndex];

  useEffect(() => {
    if (reducedMotion) return;

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % scenario.steps.length);
    }, 2800);

    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % scenario.logs.length);
    }, 2200);

    const scenarioTimer = setInterval(() => {
      setScenarioIndex((prev) => (prev + 1) % workflowScenarios.length);
      setActiveStep(0);
      setLogIndex(0);
    }, 9000);

    return () => {
      clearInterval(stepTimer);
      clearInterval(logTimer);
      clearInterval(scenarioTimer);
    };
  }, [reducedMotion, scenario.steps.length, scenario.logs.length]);

  useEffect(() => {
    setActiveStep(0);
    setLogIndex(0);
  }, [scenarioIndex]);

  const progress = ((activeStep + 1) / scenario.steps.length) * 100;

  return (
    <DemoShell badge={scenario.badge} reducedMotion={reducedMotion}>
      <DemoPanel className="mb-1" glow>
        <div className="p-3.5 md:p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Your stack · inputs
            </p>
            <StatusPill tone="active">{scenario.activeSources.length} sources</StatusPill>
          </div>

          <div className="mb-3.5 grid grid-cols-4 gap-2">
            {stackSources.map((source) => {
              const isActive = scenario.activeSources.includes(source.id);
              const SourceIcon = source.icon;

              return (
                <div
                  key={source.id}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2 transition-all duration-500 ${
                    isActive
                      ? "border-primary/30 bg-primary/10 shadow-sm dark:border-primary/35 dark:bg-primary/15"
                      : "border-border/50 bg-background/40 opacity-40 dark:bg-background/20"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset ${
                      isActive
                        ? "bg-card text-primary ring-primary/15 dark:text-chart-3"
                        : "bg-muted/60 text-muted-foreground/35 ring-border/40"
                    }`}
                  >
                    <SourceIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </div>
                  <span
                    className={`text-[9px] font-semibold ${isActive ? "text-foreground/80" : "text-muted-foreground/35"}`}
                  >
                    {source.label}
                  </span>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.id}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border/50 bg-background/50 px-3 py-2.5 dark:bg-background/25"
            >
              <p className="text-sm font-semibold text-foreground">{scenario.triggerLabel}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{scenario.triggerDetail}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </DemoPanel>

      <FlowConnector reducedMotion={reducedMotion} />

      <DemoPanel glow className="mb-1">
        <div className="p-3.5 md:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80 dark:text-chart-3/80">
              Automation engine
            </p>
            <StatusPill tone="success">0 manual steps</StatusPill>
          </div>

          <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted/80">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--chart-2))]"
            />
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.id}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                {scenario.steps.map((step, index) => {
                  const isActive = activeStep === index;
                  const isDone = activeStep > index;
                  const StepIcon = step.icon;

                  return (
                    <motion.div
                      key={step.id}
                      initial={reducedMotion ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.4 }}
                      className={`relative overflow-hidden rounded-xl border px-3 py-2.5 transition-all duration-500 ${
                        isActive
                          ? "border-primary/30 bg-gradient-to-r from-primary/[0.07] to-transparent shadow-sm dark:from-primary/12"
                          : isDone
                            ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                            : "border-border/50 bg-background/45 dark:bg-background/20"
                      }`}
                    >
                      {isActive && (
                        <>
                          <span className="pointer-events-none absolute left-0 top-2 h-4 w-px bg-primary/50" />
                          <span className="pointer-events-none absolute left-0 top-2 h-px w-4 bg-primary/50" />
                        </>
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${
                            isDone
                              ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15 dark:text-emerald-400"
                              : isActive
                                ? "bg-primary/10 text-primary ring-primary/15 dark:text-chart-3"
                                : "bg-muted/80 text-muted-foreground/40 ring-border/50"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                          ) : isActive && !reducedMotion ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="h-4 w-4 rounded-full border-2 border-primary/15 border-t-primary dark:border-chart-3/25 dark:border-t-chart-3"
                            />
                          ) : (
                            <StepIcon className="h-4 w-4" strokeWidth={1.75} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                isActive || isDone ? "text-foreground" : "text-muted-foreground/55"
                              }`}
                            >
                              {step.label}
                            </p>
                            <StatusPill
                              tone={
                                isDone ? "success" : isActive ? "active" : "neutral"
                              }
                            >
                              {isDone ? "Done" : isActive ? "Running" : "Queued"}
                            </StatusPill>
                          </div>
                          <p className="truncate text-[11px] text-muted-foreground">{step.detail}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DemoPanel>

      <FlowConnector reducedMotion={reducedMotion} delay={0.35} />

      <DemoPanel>
        <div className="p-3.5 md:p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Outputs
          </p>
          <div className="grid grid-cols-3 gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.id}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="contents"
              >
                {scenario.outputs.map((output, index) => (
                  <motion.div
                    key={output.label}
                    initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.35 }}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-background/55 px-2 py-3 text-center dark:bg-background/25"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-inset ring-primary/10 dark:bg-primary/15">
                      <output.icon
                        className="h-3.5 w-3.5 text-primary dark:text-chart-3"
                        strokeWidth={1.75}
                      />
                    </div>
                    <span className="text-[10px] font-semibold leading-tight text-muted-foreground">
                      {output.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DemoPanel>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-border/50 bg-muted/25 dark:bg-muted/15">
        <div className="flex items-center gap-2 border-b border-border/40 px-3 py-1.5">
          <CircleDot className="h-3 w-3 text-primary/60 dark:text-chart-2/70" />
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Activity log
          </span>
        </div>
        <div className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${scenario.id}-${logIndex}`}
              initial={reducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="truncate"
            >
              <span className="text-primary/60 dark:text-chart-3/60">&gt;</span> {scenario.logs[logIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </DemoShell>
  );
}

export default function SolutionBridge() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative w-full overflow-hidden bg-background px-4 py-20 md:px-8 md:py-28 lg:py-32"
      aria-label="The Automation Sprint"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,rgba(33,74,156,0.09),transparent_55%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,rgba(33,74,156,0.16),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-12 xl:gap-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col lg:max-w-xl"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                The Automation Sprint
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-5 text-[1.85rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem]"
            >
              We don&apos;t bend your firm to the{" "}
              <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
                tool.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
            >
              We build automation to your firm&apos;s logic — one production workflow, fixed
              scope and price, hard AI cap — shipped in 3–6 weeks into the stack you already
              use.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <PrimaryButton href="/automation-sprint">Explore the Sprint</PrimaryButton>
              <BookCallLink variant="secondary" className="h-12 w-full sm:min-w-[168px]" />
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {[
                { icon: CalendarClock, label: "3–6 weeks" },
                { icon: Layers, label: "Fixed scope" },
                { icon: ShieldCheck, label: "AI cap" },
                { icon: GitBranch, label: "Blueprint first" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/50 px-3 py-2.5 backdrop-blur-sm"
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
                  <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <AutomationDemo reducedMotion={!!reducedMotion} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
