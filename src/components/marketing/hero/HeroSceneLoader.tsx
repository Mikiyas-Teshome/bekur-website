"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import HeroFallback from "./HeroFallback";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

class SceneErrorBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <HeroFallback /> : this.props.children;
  }
}

/**
 * Mounts the WebGL scene only after first paint (so the H1 stays the LCP),
 * keeps the render loop paused while the hero is offscreen or the tab is
 * hidden, and never mounts it at all under prefers-reduced-motion.
 */
export default function HeroSceneLoader() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 1500,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(id);
  }, [prefersReduced]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(wrapper);

    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [prefersReduced]);

  return (
    <div ref={wrapperRef} aria-hidden className="absolute inset-0">
      {prefersReduced || !ready ? (
        <HeroFallback />
      ) : (
        <SceneErrorBoundary>
          <HeroScene active={inView && tabVisible} />
        </SceneErrorBoundary>
      )}
    </div>
  );
}
