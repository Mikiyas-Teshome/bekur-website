"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import GlowCard from "../ui/GlowCard";
import MockFrame from "../mockui/MockFrame";
import MockRow from "../mockui/MockRow";
import SpendCapMeter from "../mockui/SpendCapMeter";
import ProgressBar from "../mockui/ProgressBar";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";
import { useStatusSequence } from "../motion/useStatusSequence";

// Copy adapted from the approved Services section.
const cards = [
  {
    badge: "Workflow Automation",
    title: "Automate how your firm actually works",
    description:
      "We map intake, document chase, approvals, and reconciliations — then automate the manual steps partners hate. Built to your SOP, not a vertical SaaS template.",
    tags: ["Intake flows", "Approval chains", "Admin automation"],
  },
  {
    badge: "Controlled AI",
    title: "AI bounded by your business logic",
    description:
      "No generic wrappers. Every AI step is gated by partner approval, firm rules, and a hard monthly spend cap — written into scope before kickoff.",
    tags: ["Spend caps", "Partner gates", "Firm rules"],
  },
  {
    badge: "Stack Integration",
    title: "Connect the tools you already use",
    description:
      "CRM, inbox, spreadsheets, and drives — unified in one workflow without rip-and-replace. Your stack stays; automation adapts to it.",
    tags: ["CRM sync", "Drive & sheets", "Email triggers"],
  },
  {
    badge: "The Automation Sprint",
    title: "One workflow. Fixed scope. Live in weeks.",
    description:
      "Optional Blueprint first, then a 3–6 week sprint that ships one production workflow your team uses Monday morning — fixed price, measurable ROI target.",
    tags: ["3–6 weeks", "Fixed price", "Blueprint first"],
  },
];

function WorkflowMock() {
  const ref = useRef<HTMLDivElement>(null);
  const statuses = useStatusSequence(ref, 3, { staggerMs: 380 });
  const rows = [
    { label: "Chase missing W-9", sublabel: "client docs" },
    { label: "Route for approval", sublabel: "partner queue" },
    { label: "Sync to CRM", sublabel: "no rekeying" },
  ];
  return (
    <div ref={ref} className="space-y-2">
      {rows.map((row, i) => (
        <MockRow key={row.label} {...row} status={statuses[i]} />
      ))}
    </div>
  );
}

function StackMock() {
  const tools = ["CRM", "Inbox", "Sheets", "Drive", "Slack", "Billing"];
  return (
    <div aria-hidden className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span
            key={tool}
            className="rounded-md border border-mk-border bg-mk-surface-3/70 px-2.5 py-1.5 font-mono-mk text-[10px] uppercase tracking-[0.12em] text-mk-text-2"
          >
            {tool}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 font-mono-mk text-[10px] uppercase tracking-[0.12em] text-mk-text-3">
        <span className="h-px flex-1 bg-mk-border" />
        one workflow
        <span className="h-px flex-1 bg-mk-border" />
      </div>
      <div className="rounded-lg border border-mk-accent-a25 bg-mk-accent-a10 px-3 py-2 text-center font-mono-mk text-[10px] uppercase tracking-[0.12em] text-mk-accent">
        Synced · no rip-and-replace
      </div>
    </div>
  );
}

function SprintMock() {
  const phases = [
    { label: "Wk 1–2 · Logic map", value: 100 },
    { label: "Wk 3–5 · Build", value: 70 },
    { label: "Wk 6 · Go-live", value: 25 },
  ];
  return (
    <div aria-hidden className="space-y-3">
      {phases.map((phase, i) => (
        <div key={phase.label} className="space-y-1.5">
          <span className="font-mono-mk text-[10px] uppercase tracking-[0.12em] text-mk-text-3">
            {phase.label}
          </span>
          <ProgressBar value={phase.value} delay={i * 0.15} />
        </div>
      ))}
    </div>
  );
}

const mocks = [
  { title: "approvals queue", node: <WorkflowMock /> },
  { title: "ai spend monitor", node: <SpendCapMeter /> },
  { title: "stack map", node: <StackMock /> },
  { title: "sprint timeline", node: <SprintMock /> },
];

export default function Capabilities() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="What we build"
        title={
          <>
            Production systems,{" "}
            <span className="text-mk-text-2">not prototypes.</span>
          </>
        }
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid gap-4 md:grid-cols-2"
      >
        {cards.map((card, i) => (
          <motion.div key={card.badge} variants={fadeUp}>
            <GlowCard className="flex h-full flex-col p-6 md:p-8">
              <span className="mb-4 w-fit rounded-full border border-mk-border bg-mk-surface-2/80 px-3 py-1 font-mono-mk text-[10px] uppercase tracking-[0.14em] text-mk-text-2">
                {card.badge}
              </span>
              <h3 className="font-display text-xl font-semibold leading-snug text-mk-text-1 md:text-2xl">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mk-text-2">
                {card.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-mk-border px-3 py-1 text-xs text-mk-text-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex-1">
                <MockFrame title={mocks[i].title}>{mocks[i].node}</MockFrame>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
