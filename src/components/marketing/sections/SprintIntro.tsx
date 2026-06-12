"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import SectionShell from "../ui/SectionShell";
import SectionKicker from "../ui/SectionKicker";
import MockFrame from "../mockui/MockFrame";
import MockRow from "../mockui/MockRow";
import WorkflowDiagram from "../mockui/WorkflowDiagram";
import MarketingButton from "../ui/MarketingButton";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";
import { useStatusSequence } from "../motion/useStatusSequence";

const intakeRows = [
  { label: "New matter — Hayes & Co.", sublabel: "intake form · 09:14" },
  { label: "Conflict check", sublabel: "auto-run · firm rules" },
  { label: "Engagement letter draft", sublabel: "awaiting partner approval" },
];

export default function SprintIntro() {
  const mockRef = useRef<HTMLDivElement>(null);
  const statuses = useStatusSequence(mockRef, intakeRows.length);

  return (
    <SectionShell id="automation-sprint">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={fadeUp}>
            <SectionKicker>The Automation Sprint</SectionKicker>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-mk-text-1 md:text-4xl lg:text-[44px]"
          >
            We don&apos;t bend your firm to the tool.{" "}
            <span className="text-mk-text-2">
              We build the tool to your firm.
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg text-base leading-relaxed text-mk-text-2 md:text-lg"
          >
            We map your firm&apos;s business logic first, then ship one
            production workflow in weeks — fixed scope, capped AI costs, and
            partner approval on every client-facing step.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <MarketingButton
              label="See how the Sprint works"
              href="/automation-sprint"
              variant="secondary"
              showArrow
              arrowType="right"
            />
          </motion.div>
        </motion.div>

        <motion.div
          ref={mockRef}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <MockFrame title="Matter intake — live" live>
            <WorkflowDiagram className="w-full" />
            <div className="mt-4 space-y-2">
              {intakeRows.map((row, i) => (
                <MockRow
                  key={row.label}
                  label={row.label}
                  sublabel={row.sublabel}
                  status={statuses[i]}
                />
              ))}
            </div>
          </MockFrame>
        </motion.div>
      </div>
    </SectionShell>
  );
}
