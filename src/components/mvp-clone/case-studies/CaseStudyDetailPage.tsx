"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import BookCallLink from "@/components/BookCallLink";
import type { CaseStudyDetail } from "./case-study-details";
import { CaseStudyImage, StatusPill } from "./CaseStudyMedia";
import type { CaseStudyItem } from "./data";
import { ease, fadeUp, headerContainer } from "../motion";

type CaseStudyDetailPageProps = {
  project: CaseStudyDetail;
};

export default function CaseStudyDetailPage({ project }: CaseStudyDetailPageProps) {
  const reducedMotion = useReducedMotion();
  const showcaseProject: CaseStudyItem = {
    id: 0,
    slug: project.slug,
    title: project.title,
    stats: project.stats,
    parallel: project.parallel,
    status: project.status,
    statusLabel: project.statusLabel,
    image: project.image,
  };

  return (
    <article className="min-h-screen bg-muted/30 dark:bg-background">
      <div className="relative w-full overflow-hidden px-4 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.14),transparent_65%)]" />

        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/#shipped-systems"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to shipped systems
          </Link>

          <motion.div
            initial="hidden"
            animate={reducedMotion ? undefined : "visible"}
            variants={headerContainer}
            className="mb-10"
          >
            <motion.div variants={fadeUp} className="mb-4 flex flex-wrap items-center gap-3">
              <StatusPill status={project.status} label={project.statusLabel} />
              <span className="text-sm font-medium text-muted-foreground">{project.stats}</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mb-5 text-[2rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-[3rem]"
            >
              {project.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
            >
              {project.parallel}
            </motion.p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="relative mb-12 aspect-[2528/1696] overflow-hidden rounded-[28px] border border-border/60 bg-muted/30 shadow-[0_24px_64px_-24px_rgba(33,74,156,0.25)] dark:bg-muted/15 md:rounded-[32px]"
          >
            <CaseStudyImage project={showcaseProject} priority />
            {project.image && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            )}
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-10">
            <div className="space-y-8">
              <section className="rounded-[28px] border border-border/60 bg-card p-6 dark:bg-card/95 md:rounded-[32px] md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">Overview</h2>
                <p className="text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]">
                  {project.overview}
                </p>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-card p-6 dark:bg-card/95 md:rounded-[32px] md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">The challenge</h2>
                <p className="text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]">
                  {project.challenge}
                </p>
              </section>

              <section className="rounded-[28px] border border-border/60 bg-card p-6 dark:bg-card/95 md:rounded-[32px] md:p-8">
                <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">How we approached it</h2>
                <ul className="space-y-4">
                  {project.approach.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-chart-3"
                        strokeWidth={1.75}
                      />
                      <span className="text-sm leading-relaxed text-muted-foreground md:text-[15px] md:leading-[1.65]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-border/60 bg-card p-6 dark:bg-card/95 md:rounded-[32px]">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Outcomes
                </h2>
                <dl className="space-y-4">
                  {project.outcomes.map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="text-lg font-bold text-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-[28px] border border-border/60 bg-card p-6 dark:bg-card/95 md:rounded-[32px]">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Stack & patterns
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-primary/20 bg-primary/5 p-6 dark:border-border/60 dark:bg-card/80 md:rounded-[32px]">
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{project.proofLine}</p>
                <BookCallLink variant="primary" showArrow frameClassName="w-full sm:w-auto" />
              </div>
            </aside>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Want a workflow shipped with the same discipline?
            </p>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-chart-3"
            >
              View all work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
