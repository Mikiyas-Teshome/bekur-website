"use client";

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { RefObject } from "react";

export type MockStatus = "queued" | "running" | "done";

/**
 * Drives a Queued → Running → Done sequence for a list of mock rows once the
 * container enters the viewport. Each step advances on a stagger so rows tick
 * over one after another. Reduced motion jumps straight to the final state.
 */
export function useStatusSequence(
  containerRef: RefObject<HTMLElement | null>,
  count: number,
  { stepMs = 700, staggerMs = 450 }: { stepMs?: number; staggerMs?: number } = {},
): MockStatus[] {
  const prefersReduced = useReducedMotion();
  const inView = useInView(containerRef, { once: true, margin: "-60px" });
  const [statuses, setStatuses] = useState<MockStatus[]>(() =>
    Array.from({ length: count }, () => "queued"),
  );

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setStatuses(Array.from({ length: count }, () => "done"));
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setStatuses((prev) => prev.map((s, j) => (j === i ? "running" : s)));
        }, i * staggerMs + stepMs),
      );
      timers.push(
        setTimeout(() => {
          setStatuses((prev) => prev.map((s, j) => (j === i ? "done" : s)));
        }, i * staggerMs + stepMs * 2),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [inView, prefersReduced, count, stepMs, staggerMs]);

  return statuses;
}
