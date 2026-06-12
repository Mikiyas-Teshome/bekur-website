"use client";

import { motion } from "framer-motion";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

// Approved ICP-voice quotes — ported verbatim from the existing site.
const painQuotes = [
  "We keep doing this manually because nothing fits how we work.",
  "I want to use AI but I don't trust most people pitching me.",
  "I looked at the tool but it would force us to change too much.",
  "Token bills keep climbing faster than the value they deliver.",
  "The last developer was great at code — useless at understanding what we actually do.",
  "I need predictable cost, timeline, and scope — not scope creep.",
];

function PainCard({ quote }: { quote: string }) {
  return (
    <motion.blockquote
      variants={fadeUp}
      className="group relative rounded-2xl border border-mk-border bg-mk-surface-1 p-6 transition-colors duration-300 hover:border-mk-border-strong md:p-7"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 border-l border-t border-mk-text-3/50 transition-colors duration-300 group-hover:border-mk-accent/60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 h-3.5 w-3.5 border-b border-r border-mk-text-3/50 transition-colors duration-300 group-hover:border-mk-accent/60"
      />
      <p className="text-[15px] leading-relaxed text-mk-text-1/90">
        &ldquo;{quote}&rdquo;
      </p>
    </motion.blockquote>
  );
}

export default function PainPoints() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="Is this you?"
        title={
          <>
            The work never fits{" "}
            <span className="text-mk-text-2">the template.</span>
          </>
        }
        subtitle="What we hear from managing partners before every Blueprint."
        align="center"
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {painQuotes.map((quote) => (
          <PainCard key={quote} quote={quote} />
        ))}
      </motion.div>
    </SectionShell>
  );
}
