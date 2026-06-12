"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import {
  caseStudies,
  CASE_STUDY_HERO_SIZES,
} from "@/components/mvp-clone/case-studies/data";

export default function ShippedSystems() {
  const [activeSlug, setActiveSlug] = useState(caseStudies[0].slug);
  const prefersReduced = useReducedMotion();
  const active = caseStudies.find((c) => c.slug === activeSlug) ?? caseStudies[0];

  return (
    <SectionShell id="work">
      <SectionHeading
        kicker="Shipped systems"
        title={
          <>
            Proof, <span className="text-mk-text-2">not promises.</span>
          </>
        }
        subtitle="Each system proves something specific about how we deliver."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-10">
        <div
          role="tablist"
          aria-label="Shipped systems"
          className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {caseStudies.map((cs) => {
            const isActive = cs.slug === activeSlug;
            return (
              <button
                key={cs.slug}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveSlug(cs.slug)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition-colors lg:w-full ${
                  isActive
                    ? "border-mk-accent-a25 bg-mk-accent-a10"
                    : "border-mk-border bg-mk-surface-1 hover:border-mk-border-strong"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={`font-display text-base font-semibold ${
                      isActive ? "text-mk-text-1" : "text-mk-text-2"
                    }`}
                  >
                    {cs.title}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono-mk text-[9px] uppercase tracking-[0.12em] ${
                      cs.status === "in-build"
                        ? "border-mk-warn/30 text-mk-warn"
                        : "border-mk-border text-mk-text-3"
                    }`}
                  >
                    {cs.statusLabel}
                  </span>
                </span>
                <span className="mt-1 hidden text-xs text-mk-text-3 lg:block">
                  {cs.stats}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-mk-border bg-mk-surface-1"
          >
            {active.image ? (
              <div className="relative aspect-[16/9] border-b border-mk-border bg-mk-surface-2">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes={CASE_STUDY_HERO_SIZES}
                  className="object-cover object-top"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center border-b border-mk-border bg-mk-surface-2">
                <span className="font-mono-mk text-[11px] uppercase tracking-[0.16em] text-mk-text-3">
                  In build — sprint zero
                </span>
              </div>
            )}
            <div className="p-6 md:p-8">
              <p className="font-mono-mk text-[11px] uppercase tracking-[0.16em] text-mk-text-3">
                {active.stats}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-mk-text-1">
                {active.title}
              </h3>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mk-text-2">
                {active.parallel}
              </p>
              {active.href && (
                <Link
                  href={active.href}
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-mk-accent transition-colors hover:text-mk-accent-bright"
                >
                  View case study
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
