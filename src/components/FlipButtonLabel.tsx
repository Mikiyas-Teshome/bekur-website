"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type FlipButtonLabelProps = {
  label: string;
  className?: string;
  lineHeight?: string;
  duration?: number;
  ease?: string;
};

export default function FlipButtonLabel({
  label,
  className,
  lineHeight = "1.15em",
  duration = 0.45,
  ease = "power3.out",
}: FlipButtonLabelProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const trigger = wrap.closest<HTMLElement>("a, button");
    if (!trigger) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    gsap.set(track, { yPercent: 0, force3D: true });

    const toActive = () => {
      gsap.to(track, {
        yPercent: -50,
        duration,
        ease,
        overwrite: "auto",
      });
    };

    const toIdle = () => {
      gsap.to(track, {
        yPercent: 0,
        duration,
        ease,
        overwrite: "auto",
      });
    };

    trigger.addEventListener("mouseenter", toActive);
    trigger.addEventListener("mouseleave", toIdle);
    trigger.addEventListener("focusin", toActive);

    const onFocusOut = (event: FocusEvent) => {
      if (event.relatedTarget && trigger.contains(event.relatedTarget as Node)) return;
      toIdle();
    };

    trigger.addEventListener("focusout", onFocusOut);

    return () => {
      trigger.removeEventListener("mouseenter", toActive);
      trigger.removeEventListener("mouseleave", toIdle);
      trigger.removeEventListener("focusin", toActive);
      trigger.removeEventListener("focusout", onFocusOut);
      gsap.killTweensOf(track);
    };
  }, [label, duration, ease]);

  return (
    <span
      ref={wrapRef}
      className={cn(
        "relative inline-block overflow-hidden align-middle leading-none",
        className,
      )}
      style={{ height: lineHeight, ["--flip-line" as string]: lineHeight }}
    >
      <span ref={trackRef} className="block will-change-transform">
        <span
          className="flex items-center whitespace-nowrap leading-none"
          style={{ height: lineHeight }}
        >
          {label}
        </span>
        <span
          className="flex items-center whitespace-nowrap leading-none"
          style={{ height: lineHeight }}
        >
          {label}
        </span>
      </span>
    </span>
  );
}
