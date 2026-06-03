"use client";

import { motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/logo/Logo";
import {
  CheckCircle2,
  Circle,
  Database,
  FileSpreadsheet,
  Mail,
  FolderOpen,
  Sparkles,
  Shield,
  Zap,
  Clock,
} from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1] as const;

function MockupShell({
  children,
  label,
  live = false,
}: {
  children: React.ReactNode;
  label?: string;
  live?: boolean;
}) {
  return (
    <div className="group/mockup relative overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_20px_60px_-24px_rgba(33,74,156,0.18),inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-md dark:border-border/35 dark:bg-card/95 dark:shadow-[0_28px_72px_-24px_rgba(33,74,156,0.38),inset_0_1px_0_0_rgba(255,255,255,0.04)] md:rounded-[32px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-chart-3/[0.05] dark:from-primary/[0.08] dark:to-chart-2/[0.06]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(33,74,156,0.07) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/[0.07] blur-3xl transition-opacity duration-700 group-hover/mockup:opacity-100 dark:bg-primary/[0.14]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-chart-3/[0.06] blur-3xl dark:bg-chart-2/[0.08]" />

      <div className="relative flex items-center gap-2.5 border-b border-border/45 px-4 py-3 md:px-5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/15 dark:bg-muted-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/10 dark:bg-muted-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/30 dark:bg-primary/45" />
        </div>
        {live && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live
            </span>
          </span>
        )}
        {label && (
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
            {label}
          </span>
        )}
      </div>

      <div className="relative p-4 md:p-5">{children}</div>
    </div>
  );
}

function MockupPanel({
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.16),transparent_70%)]" />
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

const workflowTasks = [
  { label: "Matter intake routing", status: "approved" as const, meta: "Partner signed off", progress: 100 },
  { label: "Document checklist", status: "running" as const, meta: "3 of 5 matched", progress: 60 },
  { label: "Invoice reconciliation", status: "queued" as const, meta: "Awaiting period close", progress: 0 },
  { label: "Client follow-up draft", status: "approved" as const, meta: "Ready to send", progress: 100 },
];

export function WorkflowMockup() {
  const reduced = useReducedMotion();

  return (
    <MockupShell label="Workflow" live>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { icon: Zap, value: "4", label: "Automated" },
          { icon: Clock, value: "0", label: "Manual" },
          { icon: CheckCircle2, value: "2", label: "Approved" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.45, ease }}
            className="rounded-xl border border-border/50 bg-background/50 px-2.5 py-2 text-center dark:bg-background/25"
          >
            <stat.icon className="mx-auto mb-1 h-3 w-3 text-primary/70 dark:text-chart-3/80" strokeWidth={2} />
            <p className="text-sm font-bold tabular-nums text-foreground">{stat.value}</p>
            <p className="text-[9px] font-medium text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Approval queue
      </p>

      <div className="space-y-2.5">
        {workflowTasks.map((task, index) => (
          <motion.div
            key={task.label}
            initial={reduced ? false : { opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: index * 0.09, duration: 0.5, ease }}
            whileHover={reduced ? undefined : { y: -1 }}
            className={`relative overflow-hidden rounded-xl border px-3 py-3 transition-shadow duration-300 hover:shadow-md dark:hover:shadow-[0_8px_24px_-8px_rgba(33,74,156,0.25)] ${
              task.status === "running"
                ? "border-primary/25 bg-gradient-to-r from-primary/[0.05] to-transparent dark:from-primary/10"
                : "border-border/50 bg-background/55 dark:bg-background/25"
            }`}
          >
            {task.status === "running" && (
              <>
                <span className="pointer-events-none absolute left-0 top-2 h-4 w-px bg-primary/50" />
                <span className="pointer-events-none absolute left-0 top-2 h-px w-4 bg-primary/50" />
              </>
            )}

            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${
                  task.status === "approved"
                    ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15 dark:text-emerald-400"
                    : task.status === "running"
                      ? "bg-primary/10 text-primary ring-primary/15 dark:text-chart-3"
                      : "bg-muted/80 text-muted-foreground/45 ring-border/50"
                }`}
              >
                {task.status === "approved" ? (
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                ) : task.status === "running" ? (
                  <motion.div
                    animate={reduced ? undefined : { rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 rounded-full border-2 border-primary/15 border-t-primary dark:border-chart-3/25 dark:border-t-chart-3"
                  />
                ) : (
                  <Circle className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">{task.label}</p>
                  <StatusPill
                    tone={
                      task.status === "approved"
                        ? "success"
                        : task.status === "running"
                          ? "active"
                          : "neutral"
                    }
                  >
                    {task.status === "approved"
                      ? "Done"
                      : task.status === "running"
                        ? "Running"
                        : "Queued"}
                  </StatusPill>
                </div>
                <p className="mb-2 text-[10px] text-muted-foreground">{task.meta}</p>
                <div className="h-1 overflow-hidden rounded-full bg-muted/80">
                  <motion.div
                    initial={reduced ? false : { width: 0 }}
                    whileInView={{ width: `${task.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 0.9, ease }}
                    className={`h-full rounded-full ${
                      task.status === "approved"
                        ? "bg-emerald-500/70"
                        : task.status === "running"
                          ? "bg-[linear-gradient(90deg,var(--primary),var(--chart-2))]"
                          : "bg-muted-foreground/20"
                    }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </MockupShell>
  );
}

const logicChips = [
  { label: "Intake rules", active: true },
  { label: "Approval gates", active: true },
  { label: "Spend cap", active: true },
  { label: "CRM sync", active: false },
];

export function LogicAIMockup() {
  const reduced = useReducedMotion();

  return (
    <MockupShell label="Controlled AI" live>
      <div className="relative flex flex-col items-center pb-1 pt-1 md:pt-2">
        <div className="relative mb-6 flex items-center justify-center">
          {!reduced && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute h-[5.5rem] w-[5.5rem] rounded-full border border-dashed border-primary/15 md:h-24 md:w-24 dark:border-chart-3/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute h-[6.25rem] w-[6.25rem] rounded-full border border-primary/10 md:h-[6.75rem] md:w-[6.75rem] dark:border-primary/15"
              />
            </>
          )}

          <motion.div
            animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] shadow-[0_12px_40px_-8px_rgba(33,74,156,0.55)] ring-4 ring-primary/10 dark:shadow-[0_12px_48px_-8px_rgba(74,144,226,0.55)] dark:ring-primary/20 md:h-20 md:w-20"
          >
            <Sparkles className="h-7 w-7 text-primary-foreground md:h-8 md:w-8" strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-emerald-500/90 shadow-sm">
              <Shield className="h-3 w-3 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
        </div>

        <p className="mb-0.5 text-sm font-bold tracking-tight text-foreground">Firm logic assistant</p>
        <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground">
          Bounded by your SOP — not open-ended AI
        </p>

        <MockupPanel className="w-full" glow>
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Active constraints
              </p>
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary dark:text-chart-3">
                3 / 4
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {logicChips.map((chip, index) => (
                <motion.div
                  key={chip.label}
                  initial={reduced ? false : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12 + index * 0.06, duration: 0.4, ease }}
                  className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${
                    chip.active
                      ? "border-primary/20 bg-primary/[0.06] dark:border-primary/30 dark:bg-primary/10"
                      : "border-border/50 bg-background/40 opacity-60"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      chip.active ? "bg-primary dark:bg-chart-3" : "bg-muted-foreground/30"
                    }`}
                  />
                  <span className="text-[10px] font-semibold text-foreground/90">{chip.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-border/50 bg-background/40 p-3 dark:bg-background/20">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-medium text-muted-foreground">Monthly AI spend</p>
                <p className="text-[10px] font-bold tabular-nums text-foreground">$240 / $300</p>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={reduced ? false : { width: 0 }}
                  whileInView={{ width: "80%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45, duration: 1.1, ease }}
                  className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--chart-2))]"
                />
                <div className="absolute inset-y-0 left-[80%] w-px bg-foreground/20" />
              </div>
              <p className="mt-1.5 text-[9px] text-muted-foreground">Hard cap enforced · 80% utilized</p>
            </div>
          </div>
        </MockupPanel>
      </div>
    </MockupShell>
  );
}

const stackNodes = [
  { icon: Mail, label: "Inbox", x: "7%", y: "10%" },
  { icon: Database, label: "CRM", x: "73%", y: "8%" },
  { icon: FileSpreadsheet, label: "Sheets", x: "5%", y: "70%" },
  { icon: FolderOpen, label: "Drive", x: "75%", y: "72%" },
];

const stackPulseOrigins = [
  { left: "11%", top: "16%" },
  { left: "77%", top: "14%" },
  { left: "9%", top: "76%" },
  { left: "79%", top: "78%" },
];

export function StackMockup() {
  const reduced = useReducedMotion();

  return (
    <MockupShell label="Integration" live>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-foreground">Stack integration hub</p>
        <StatusPill tone="success">Synced</StatusPill>
      </div>

      <MockupPanel glow className="relative">
        <div className="relative aspect-[4/3] max-h-[240px] w-full p-2">
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-2xl dark:bg-primary/10" />

          <motion.div
            animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.06] shadow-[0_8px_28px_-6px_rgba(33,74,156,0.35)] ring-1 ring-primary/10 dark:from-card dark:to-primary/15 md:h-16 md:w-16"
          >
            <Logo width={44} height={49} className="h-9 w-auto md:h-10" />
          </motion.div>

          <svg
            className="absolute inset-0 z-0 h-full w-full text-primary/20 dark:text-primary/30"
            aria-hidden="true"
          >
            {stackNodes.map((node, index) => (
              <motion.line
                key={node.label}
                x1={`${parseFloat(node.x) + 5}%`}
                y1={`${parseFloat(node.y) + 6}%`}
                x2="50%"
                y2="50%"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.9, ease }}
              />
            ))}
          </svg>

          {stackNodes.map((node, index) => {
            const NodeIcon = node.icon;
            return (
              <motion.div
                key={node.label}
                initial={reduced ? false : { opacity: 0, scale: 0.85, y: 6 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.5, ease }}
                className="absolute z-20 flex flex-col items-center gap-1"
                style={{ left: node.x, top: node.y }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card shadow-[0_4px_12px_-4px_rgba(33,74,156,0.2)] ring-1 ring-inset ring-white/50 dark:bg-background/60 dark:ring-white/5">
                  <NodeIcon className="h-4 w-4 text-primary dark:text-chart-3" strokeWidth={1.75} />
                </div>
                <span className="rounded-full bg-background/80 px-1.5 py-px text-[9px] font-semibold text-muted-foreground backdrop-blur-sm">
                  {node.label}
                </span>
              </motion.div>
            );
          })}

          {!reduced &&
            stackPulseOrigins.map((origin, i) => (
              <motion.div
                key={i}
                className="absolute z-[5] h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(33,74,156,0.6)] dark:bg-chart-3 dark:shadow-[0_0_10px_rgba(123,179,240,0.6)]"
                style={{ left: origin.left, top: origin.top }}
                animate={{
                  left: [origin.left, "50%", origin.left],
                  top: [origin.top, "50%", origin.top],
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.1, 0.4],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
              />
            ))}
        </div>
      </MockupPanel>

      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          4 sources connected
        </span>
        <span className="text-border">|</span>
        <span>Zero rip-and-replace</span>
      </div>
    </MockupShell>
  );
}

const sprintPhases = [
  { label: "Logic mapping", week: "Wk 1–2", done: true, active: false },
  { label: "Fixed-scope build", week: "Wk 3–5", done: true, active: false },
  { label: "Approval & go-live", week: "Wk 6", done: false, active: true },
];

export function SprintMockup() {
  const reduced = useReducedMotion();

  return (
    <MockupShell label="Sprint" live>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-foreground">Automation Sprint</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Client onboarding workflow</p>
        </div>

        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-md dark:bg-primary/15" />
          <svg className="relative h-14 w-14 -rotate-90 text-muted/80" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="text-primary drop-shadow-sm dark:text-chart-2"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="97.4"
              initial={reduced ? undefined : { strokeDashoffset: 97.4 }}
              whileInView={{ strokeDashoffset: 29 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-sm font-bold tabular-nums text-primary dark:text-chart-3">70</span>
            <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      <div className="relative space-y-0 pl-1">
        <div className="absolute bottom-4 left-[1.125rem] top-4 w-px bg-gradient-to-b from-emerald-500/40 via-primary/30 to-primary/50" />

        {sprintPhases.map((phase, index) => (
          <motion.div
            key={phase.label}
            initial={reduced ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.45, ease }}
            className="relative flex items-center gap-3 pb-3 last:pb-0"
          >
            <div
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                phase.active
                  ? "border-primary bg-primary/10 dark:border-chart-3 dark:bg-primary/15"
                  : phase.done
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-border bg-muted"
              }`}
            >
              {phase.done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              ) : phase.active && !reduced ? (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-primary dark:bg-chart-3"
                />
              ) : (
                <Circle className="h-3 w-3 text-muted-foreground/40" />
              )}
            </div>

            <div
              className={`flex flex-1 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${
                phase.active
                  ? "border-primary/25 bg-gradient-to-r from-primary/[0.06] to-transparent shadow-sm dark:from-primary/10"
                  : phase.done
                    ? "border-emerald-500/15 bg-emerald-500/[0.03]"
                    : "border-border/50 bg-background/40"
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-foreground">{phase.label}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{phase.week}</p>
              </div>
              {phase.active && <StatusPill tone="active">In progress</StatusPill>}
              {phase.done && <StatusPill tone="success">Complete</StatusPill>}
            </div>
          </motion.div>
        ))}
      </div>

      <MockupPanel className="mt-4">
        <div className="p-2.5">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Go-live week
          </p>
          <div className="flex gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className={`flex flex-1 flex-col items-center rounded-xl py-2 transition-all ${
                  index === 4
                    ? "bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_rgba(33,74,156,0.5)] dark:bg-primary dark:text-primary-foreground"
                    : "text-muted-foreground/40"
                }`}
              >
                <span className="text-[9px] font-bold">{day}</span>
                {index === 4 && (
                  <span className="mt-0.5 text-[7px] font-semibold uppercase opacity-80">Live</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </MockupPanel>
    </MockupShell>
  );
}
