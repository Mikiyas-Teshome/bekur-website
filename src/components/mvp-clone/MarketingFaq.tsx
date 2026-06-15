"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { ease, fadeUp, headerContainer } from "./motion";

export type MarketingFaqItem = {
  id: string;
  question: string;
  answer: string;
};

type MarketingFaqProps = {
  items: MarketingFaqItem[];
};

export default function MarketingFaq({ items }: MarketingFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="relative w-full bg-muted/30 px-4 py-20 dark:bg-background md:px-8 md:py-28 lg:py-32"
      aria-label="Frequently asked questions"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(33,74,156,0.06),transparent_65%)] dark:bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(33,74,156,0.12),transparent_65%)]" />

      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={headerContainer}
          className="mb-10 flex flex-col items-center text-center md:mb-12"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            FAQs
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.35rem]"
          >
            We&apos;ve got the answers
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              you&apos;re looking for
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground md:text-[17px]">
            Quick answers on scope, AI caps, and fit — before you book a call.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease }}
          className="rounded-[28px] border border-border/60 bg-card p-2 shadow-[0_8px_32px_-16px_rgba(33,74,156,0.12)] dark:bg-card/95 md:rounded-[32px]"
        >
          {items.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: index * 0.06, duration: 0.55, ease }}
              className={`rounded-[20px] px-5 transition-colors md:px-6 ${
                openIndex === index ? "bg-muted/40" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-semibold text-foreground md:text-[17px]">{faq.question}</span>
                <Plus
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                  strokeWidth={1.75}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[1.65]">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
