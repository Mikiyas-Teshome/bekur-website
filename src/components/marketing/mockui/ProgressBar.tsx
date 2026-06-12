"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  color?: "accent" | "positive" | "warn";
  className?: string;
  delay?: number;
};

const colorClass = {
  accent: "bg-mk-accent",
  positive: "bg-mk-positive",
  warn: "bg-mk-warn",
};

export default function ProgressBar({
  value,
  color = "accent",
  className,
  delay = 0,
}: ProgressBarProps) {
  const prefersReduced = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-mk-surface-3", className)}>
      <motion.div
        className={cn("h-full rounded-full", colorClass[color])}
        initial={prefersReduced ? { width: `${clamped}%` } : { width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      />
    </div>
  );
}
