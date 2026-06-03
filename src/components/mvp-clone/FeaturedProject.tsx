"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { caseStudies } from "./case-studies/data";
import { CaseStudyImage, CaseStudyThumb, StatusPill } from "./case-studies/CaseStudyMedia";

const AUTOPLAY_DURATION = 5000;
const ease = [0.25, 0.1, 0.25, 1] as const;

export default function FeaturedProject({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(!reducedMotion);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % caseStudies.length);
    setKey((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1));
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || reducedMotion) return;

    const timer = setInterval(handleNext, AUTOPLAY_DURATION);
    return () => clearInterval(timer);
  }, [isAutoPlaying, handleNext, reducedMotion, activeIndex, key]);

  const handleThumbnailClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setKey((prev) => prev + 1);
  };

  const currentProject = caseStudies[activeIndex];
  const ctaLabel = currentProject.status === "in-build" ? "Follow the sprint" : "View build story";

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease }}
      className="relative"
    >
      <div className="pointer-events-none absolute -inset-4 rounded-[48px] bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.1),transparent_72%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(74,144,226,0.14),transparent_72%)]" />

      <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[0_20px_60px_-24px_rgba(33,74,156,0.18),inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_24px_72px_-24px_rgba(33,74,156,0.24)] dark:border-border/35 dark:bg-card/95 dark:shadow-[0_28px_72px_-24px_rgba(33,74,156,0.38),inset_0_1px_0_0_rgba(255,255,255,0.04)] md:rounded-[32px]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent dark:from-primary/[0.06]" />

        <div className="relative flex flex-col justify-between gap-6 px-4 py-6 md:flex-row md:items-start md:px-6 md:py-7">
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject.slug}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2.5">
                  <StatusPill status={currentProject.status} label={currentProject.statusLabel} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    What it proves
                  </span>
                </div>

                <h3 className="mb-1 text-2xl font-bold tracking-tight text-foreground md:text-[1.65rem]">
                  {currentProject.title}
                </h3>
                <p className="mb-3 text-base text-muted-foreground">{currentProject.stats}</p>
                <p className="max-w-xl text-sm leading-relaxed text-foreground/75 md:text-[15px] md:leading-[1.65]">
                  {currentProject.parallel}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {currentProject.href && (
              <Link href={currentProject.href}>
                <span className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-card active:scale-[0.98]">
                  {ctaLabel}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3 text-primary dark:text-chart-3" />
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="relative mx-3 mb-3 aspect-[2528/1696] overflow-hidden rounded-[24px] border border-border/50 bg-muted/30 dark:bg-muted/15 md:mx-4 md:mb-4">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentProject.slug}
              custom={direction}
              variants={{
                enter: (d: number) => ({
                  x: d > 0 ? 800 : -800,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (d: number) => ({
                  x: d < 0 ? 800 : -800,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 280, damping: 32 },
                opacity: { duration: 0.25 },
              }}
              className="absolute inset-0 h-full w-full"
            >
              {currentProject.href ? (
                <Link href={currentProject.href} className="block h-full w-full">
                  <CaseStudyImage project={currentProject} priority animate={!reducedMotion} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </Link>
              ) : (
                <CaseStudyImage project={currentProject} priority animate={!reducedMotion} />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 md:bottom-6 md:left-6 md:gap-3">
            {caseStudies.map((project, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => handleThumbnailClick(index)}
                  aria-label={`Show ${project.title}`}
                  className={`relative aspect-[2528/1696] h-9 overflow-hidden rounded-lg border transition-all duration-300 md:h-12 ${
                    isActive
                      ? "border-primary/50 opacity-100 shadow-[0_0_0_1px_rgba(33,74,156,0.2)]"
                      : "border-border/60 opacity-50 hover:opacity-85"
                  }`}
                >
                  {project.image ? <CaseStudyThumb project={project} /> : null}
                  {isActive && isAutoPlaying && !reducedMotion && (
                    <svg className="pointer-events-none absolute inset-0 h-full w-full">
                      <motion.rect
                        key={key}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: AUTOPLAY_DURATION / 1000, ease: "linear" }}
                        x="1"
                        y="1"
                        width="calc(100% - 2px)"
                        height="calc(100% - 2px)"
                        rx="6"
                        ry="6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary dark:text-chart-3"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
