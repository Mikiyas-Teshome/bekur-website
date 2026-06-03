"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Sparkles } from "lucide-react";
import Image from "next/image";
import {
  CASE_STUDY_HERO_SIZES,
  CASE_STUDY_IMAGE_HEIGHT,
  CASE_STUDY_IMAGE_WIDTH,
  CASE_STUDY_THUMB_SIZES,
  type CaseStudyItem,
} from "./data";

export function StatusPill({ status, label }: { status: CaseStudyItem["status"]; label: string }) {
  if (status === "in-build") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary dark:text-chart-3">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50 dark:bg-chart-3" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary dark:bg-chart-3" />
        </span>
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
      {label}
    </span>
  );
}

function ProjectVisualFallback({ project }: { project: CaseStudyItem }) {
  const isLeadEngine = project.slug === "lead-engine";

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/[0.08] via-background to-chart-3/[0.06] dark:from-primary/[0.14] dark:via-background dark:to-chart-2/[0.08]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(33,74,156,0.09) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative flex flex-col items-center gap-4 px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 ring-1 ring-inset ring-primary/10 dark:bg-primary/15">
          {isLeadEngine ? (
            <Sparkles className="h-7 w-7 text-primary dark:text-chart-3" strokeWidth={1.75} />
          ) : (
            <GitBranch className="h-7 w-7 text-primary dark:text-chart-3" strokeWidth={1.75} />
          )}
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{project.title}</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">{project.stats}</p>
        </div>
      </div>
    </div>
  );
}

export function CaseStudyImage({
  project,
  priority = false,
  animate = false,
}: {
  project: CaseStudyItem;
  priority?: boolean;
  animate?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [project.slug]);

  if (!project.image || failed) {
    return <ProjectVisualFallback project={project} />;
  }

  const image = (
    <Image
      src={project.image}
      alt={project.title}
      width={CASE_STUDY_IMAGE_WIDTH}
      height={CASE_STUDY_IMAGE_HEIGHT}
      sizes={CASE_STUDY_HERO_SIZES}
      quality={85}
      priority={priority}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );

  if (!animate) {
    return <div className="relative h-full w-full">{image}</div>;
  }

  return (
    <motion.div
      className="relative h-full w-full"
      initial={{ scale: 1.04 }}
      animate={{ scale: 1 }}
      transition={{ duration: 6, ease: "linear" }}
    >
      {image}
    </motion.div>
  );
}

export function CaseStudyThumb({ project }: { project: CaseStudyItem }) {
  const [failed, setFailed] = useState(false);
  const src = project.thumbnail ?? project.image ?? "";

  useEffect(() => {
    setFailed(false);
  }, [project.slug, src]);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-[9px] font-bold uppercase tracking-wide text-primary dark:text-chart-3">
        {project.slug === "lead-engine" ? "WIP" : project.title.slice(0, 3)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={CASE_STUDY_IMAGE_WIDTH}
      height={CASE_STUDY_IMAGE_HEIGHT}
      sizes={CASE_STUDY_THUMB_SIZES}
      quality={70}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
