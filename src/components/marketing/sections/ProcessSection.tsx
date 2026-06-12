"use client";

import { motion } from "framer-motion";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import MarketingButton from "../ui/MarketingButton";
import { fadeUp, VIEWPORT } from "../motion/motion";
import { useGsapReveal } from "../motion/useGsapReveal";

const phases = [
  {
    number: "01",
    weeks: "Weeks 1–2",
    title: "Logic Mapping",
    description:
      "We document triggers, data sources, approvals, and exceptions — and fix broken logic before writing code.",
    deliverables: ["Logic map", "Fixed sprint quote"],
  },
  {
    number: "02",
    weeks: "Weeks 3–5",
    title: "Fixed-Scope Build",
    description:
      "A senior-only team ships into your existing stack, with AI spend limits wired into the architecture.",
    deliverables: ["Production workflow", "Spend caps in code"],
  },
  {
    number: "03",
    weeks: "Week 6",
    title: "Approval & Go-Live",
    description:
      "Partner sign-off on every client-facing step, then handoff docs, walkthroughs, and a 90-day ROI target.",
    deliverables: ["Handoff docs", "90-day ROI target"],
  },
];

export default function ProcessSection() {
  const rootRef = useGsapReveal(({ root, gsap }) => {
    const spine = root.querySelector<HTMLElement>("[data-spine]");
    if (!spine) return;
    gsap.fromTo(
      spine,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector("[data-phases]"),
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.8,
        },
      },
    );
  });

  return (
    <SectionShell>
      <div ref={rootRef}>
        <SectionHeading
          kicker="Process"
          title={
            <>
              Three phases.{" "}
              <span className="text-mk-text-2">Six weeks. One workflow.</span>
            </>
          }
        />
        <div data-phases className="relative">
          {/* scroll-scrubbed spine (desktop) */}
          <div
            aria-hidden
            className="absolute left-[27px] top-2 hidden h-[calc(100%-16px)] w-px bg-mk-border md:block"
          />
          <div
            data-spine
            aria-hidden
            className="absolute left-[27px] top-2 hidden h-[calc(100%-16px)] w-px origin-top bg-mk-accent md:block"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="space-y-6 md:space-y-10">
            {phases.map((phase) => (
              <motion.div
                key={phase.number}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
                className="relative grid gap-4 md:grid-cols-[56px_140px_1fr] md:gap-8"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-mk-border bg-mk-surface-1 font-mono-mk text-sm text-mk-accent">
                  {phase.number}
                </div>
                <p className="font-mono-mk text-[11px] uppercase tracking-[0.16em] text-mk-text-3 md:pt-5">
                  {phase.weeks}
                </p>
                <div className="rounded-2xl border border-mk-border bg-mk-surface-1 p-6 md:p-7">
                  <h3 className="font-display text-xl font-semibold text-mk-text-1 md:text-2xl">
                    {phase.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-mk-text-2">
                    {phase.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {phase.deliverables.map((d) => (
                      <span
                        key={d}
                        className="rounded-full border border-mk-accent-a25 bg-mk-accent-a10 px-3 py-1 font-mono-mk text-[10px] uppercase tracking-[0.12em] text-mk-accent"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-10 md:pl-[252px]"
        >
          <MarketingButton
            label="Full delivery model"
            href="/how-we-work"
            variant="ghost"
            showArrow
            arrowType="right"
          />
        </motion.div>
      </div>
    </SectionShell>
  );
}
