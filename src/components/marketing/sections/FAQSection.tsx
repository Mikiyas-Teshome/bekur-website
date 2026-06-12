"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export default function FAQSection({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const prefersReduced = useReducedMotion();

  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading
          kicker="FAQ"
          title={
            <>
              Questions{" "}
              <span className="text-mk-text-2">operators ask.</span>
            </>
          }
          className="mb-0"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="divide-y divide-mk-border rounded-2xl border border-mk-border bg-mk-surface-1"
        >
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <motion.div key={item.id} variants={fadeUp}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-medium text-mk-text-1">
                    {item.question}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-mk-text-3 transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-mk-accent" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-mk-text-2">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionShell>
  );
}
