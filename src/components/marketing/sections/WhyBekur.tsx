"use client";

import { motion } from "framer-motion";
import {
  Blocks,
  ClipboardCheck,
  Clock3,
  GitBranch,
  Receipt,
  Wrench,
} from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import GlowCard from "../ui/GlowCard";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

const values = [
  {
    icon: GitBranch,
    title: "Logic before code",
    description:
      "We document how your firm actually works — triggers, approvals, exceptions — and fix broken logic before a line of code ships.",
  },
  {
    icon: ClipboardCheck,
    title: "Accountability by design",
    description:
      "Partner gates, written change orders, and a hard AI cap are contract terms, not promises.",
  },
  {
    icon: Clock3,
    title: "Reclaimed partner hours",
    description:
      "Intake, document chase, and reconciliation stop eating billable time. The ROI target is set before kickoff.",
  },
  {
    icon: Blocks,
    title: "Built into your stack",
    description:
      "Your CRM, inbox, and drives stay. The workflow ships into the tools your team already uses.",
  },
  {
    icon: Receipt,
    title: "Predictable economics",
    description:
      "Fixed scope, fixed price, capped AI spend. You know the full cost before the build starts.",
  },
  {
    icon: Wrench,
    title: "Built for operators",
    description:
      "You talk to the people who build. Business language first, weekly updates, no account-manager relay.",
  },
];

export default function WhyBekur() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="Why Bekur"
        title={
          <>
            Built the way{" "}
            <span className="text-mk-text-2">operators buy.</span>
          </>
        }
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {values.map((value) => (
          <motion.div key={value.title} variants={fadeUp} className="h-full">
            <GlowCard className="h-full p-6 md:p-7">
              <value.icon className="h-5 w-5 text-mk-accent" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-semibold text-mk-text-1">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mk-text-2">
                {value.description}
              </p>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
