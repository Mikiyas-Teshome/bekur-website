"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { caseStudies } from "./data";
import { CaseStudyImage, StatusPill } from "./CaseStudyMedia";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CaseStudiesShowcase({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = caseStudies[activeIndex];
  const ctaLabel = active.status === "in-build" ? "View sprint progress" : "View build story";

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease }}
      className="relative"
    >
      <div className="overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_20px_60px_-24px_rgba(33,74,156,0.18),inset_0_1px_0_0_rgba(255,255,255,0.6)] dark:border-border/35 dark:bg-card/95 dark:shadow-[0_28px_72px_-24px_rgba(33,74,156,0.38),inset_0_1px_0_0_rgba(255,255,255,0.04)] md:rounded-[32px]">
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr]">
          <div className="border-b border-border/50 lg:border-b-0 lg:border-r lg:border-border/50">
            <div className="flex gap-2 overflow-x-auto p-3 lg:hidden">
              {caseStudies.map((project, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary dark:text-chart-3"
                        : "border-border/70 bg-background/60 text-muted-foreground"
                    }`}
                  >
                    {project.title}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:block">
              {caseStudies.map((project, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group relative w-full border-b border-border/40 px-6 py-5 text-left transition-colors last:border-b-0 ${
                      isActive ? "bg-primary/[0.04] dark:bg-primary/[0.08]" : "hover:bg-muted/40"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-3 left-0 w-1 rounded-r-full transition-opacity ${
                        isActive
                          ? "bg-[linear-gradient(180deg,var(--primary),var(--chart-2))] opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p
                          className={`truncate text-base font-bold tracking-tight ${
                            isActive ? "text-foreground" : "text-foreground/80"
                          }`}
                        >
                          {project.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.stats}</p>
                      </div>
                      <StatusPill status={project.status} label={project.statusLabel} />
                    </div>
                    <p
                      className={`mt-3 text-sm leading-relaxed transition-colors ${
                        isActive ? "text-foreground/75" : "text-muted-foreground/80"
                      }`}
                    >
                      {project.parallel}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex flex-col">
            <div className="relative aspect-[2528/1696] overflow-hidden bg-muted/30 dark:bg-muted/15">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="absolute inset-0"
                >
                  <CaseStudyImage project={active} priority animate={!reducedMotion} />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.slug}
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StatusPill status={active.status} label={active.statusLabel} />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                        What it proves
                      </span>
                    </div>
                    <h3 className="mb-1 text-xl font-bold tracking-tight text-white md:text-2xl">
                      {active.title}
                    </h3>
                    <p className="mb-3 max-w-xl text-sm text-white/80 md:text-[15px]">{active.stats}</p>
                    <p className="max-w-2xl text-sm leading-relaxed text-white/90 md:text-[15px] md:leading-[1.65]">
                      {active.parallel}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border/50 px-5 py-4 md:px-6">
              <p className="text-xs text-muted-foreground">
                {activeIndex + 1} / {caseStudies.length} · select a system to compare proof points
              </p>
              {active.href ? (
                <Link
                  href={active.href}
                  className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-card active:scale-[0.98]"
                >
                  {ctaLabel}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
