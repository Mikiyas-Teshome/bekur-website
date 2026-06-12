"use client";

import { motion } from "framer-motion";
import { FileCheck, FileSignature, Gauge, Target } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import GlowCard from "../ui/GlowCard";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

const guardrails = [
  {
    icon: FileCheck,
    title: "Partner gates",
    description:
      "Client-facing steps require partner-defined approval. Nothing reaches your clients without sign-off.",
  },
  {
    icon: FileSignature,
    title: "Written change orders only",
    description:
      "Scope changes happen on paper, with a price, before work starts. No silent scope creep.",
  },
  {
    icon: Gauge,
    title: "Hard monthly AI spend cap",
    description:
      "Agreed in writing pre-build and wired into the architecture — not a dashboard you have to watch.",
  },
  {
    icon: Target,
    title: "One workflow per sprint",
    description:
      "No open-ended discovery. One workflow, shipped to production, measured against a 90-day ROI target.",
  },
];

export default function Guardrails() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="Accountability"
        title={
          <>
            Guardrails,{" "}
            <span className="text-mk-text-2">in writing.</span>
          </>
        }
        subtitle="The reason operators trust us with client-facing work."
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {guardrails.map((item) => (
          <motion.div key={item.title} variants={fadeUp} className="h-full">
            <GlowCard className="h-full p-6">
              <item.icon className="h-5 w-5 text-mk-accent" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-semibold text-mk-text-1">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mk-text-2">
                {item.description}
              </p>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="mt-8 rounded-xl border border-mk-border bg-mk-surface-1/60 px-5 py-4 text-sm leading-relaxed text-mk-text-2"
      >
        Not sure where to start? The{" "}
        <span className="text-mk-text-1">Blueprint</span> maps your logic and
        prices the sprint before you commit — credited toward the build if you
        proceed.
      </motion.p>
    </SectionShell>
  );
}
