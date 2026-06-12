"use client";

import { motion } from "framer-motion";
import CountUp from "../mockui/CountUp";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

export type ProofPoint = {
  id: string;
  headline: string;
  detail: string;
  metric?: string;
};

/** Renders "100% JSS" / "#3 POTD" / "1M+" style metrics with a count-up. */
function Metric({ metric }: { metric: string }) {
  const match = metric.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) {
    return <span>{metric}</span>;
  }
  const [, prefix, digits, suffix] = match;
  return <CountUp value={Number(digits)} prefix={prefix} suffix={suffix} />;
}

export default function StatBand({ proofPoints }: { proofPoints: ProofPoint[] }) {
  return (
    <section className="border-y border-mk-border bg-mk-surface-1/40">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="mx-auto grid w-full max-w-[1200px] gap-px px-4 py-12 sm:grid-cols-2 md:px-8 md:py-16 lg:grid-cols-4"
      >
        {proofPoints.map((point) => (
          <motion.div key={point.id} variants={fadeUp} className="px-2 py-4 lg:px-6">
            <p className="font-display text-3xl font-semibold tracking-tight text-mk-text-1 md:text-4xl">
              {point.metric ? <Metric metric={point.metric} /> : point.headline}
            </p>
            <p className="mt-2 text-sm font-medium text-mk-text-2">{point.headline}</p>
            <p className="mt-1 font-mono-mk text-[11px] uppercase tracking-[0.12em] text-mk-text-3">
              {point.detail}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
