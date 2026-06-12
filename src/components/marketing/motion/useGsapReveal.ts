"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealFn = (ctx: {
  root: HTMLElement;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}) => void;

/**
 * Scoped GSAP + ScrollTrigger setup. Under reduced motion the callback is
 * skipped entirely — components must render their final state by default
 * and only animate *from* it inside the callback.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  reveal: RevealFn,
  deps: unknown[] = [],
) {
  const rootRef = useRef<T>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReduced) return;
      reveal({ root, gsap, ScrollTrigger });
    },
    { scope: rootRef, dependencies: [prefersReduced, ...deps] },
  );

  return rootRef;
}
