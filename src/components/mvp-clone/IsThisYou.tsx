"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PainMessage = {
  text: string;
  side: "left" | "right";
  offsetX: string;
};

const painMessages: PainMessage[] = [
  {
    text: "We keep doing this manually because nothing fits how we work.",
    side: "left",
    offsetX: "4%",
  },
  {
    text: "I want to use AI but I don't trust most people pitching me.",
    side: "right",
    offsetX: "6%",
  },
  {
    text: "I looked at the tool but it would force us to change too much.",
    side: "left",
    offsetX: "8%",
  },
  {
    text: "Scaling partner capacity is hard without automation that actually fits.",
    side: "right",
    offsetX: "5%",
  },
  {
    text: "I need someone who understands our business, not just the code.",
    side: "left",
    offsetX: "6%",
  },
  {
    text: "Token bills keep climbing faster than the value they deliver.",
    side: "right",
    offsetX: "7%",
  },
  {
    text: "The last developer was great at code — useless at understanding what we actually do.",
    side: "left",
    offsetX: "10%",
  },
  {
    text: "I need predictable cost, timeline, and scope — not scope creep.",
    side: "right",
    offsetX: "4%",
  },
];

const PAIR_COUNT = painMessages.length / 2;
const RIGHT_SIDE_DELAY_RATIO = 0.045;
const PAIR_GAP_RATIO = 0.22;
const SCROLL_WINDOW_RATIO = 0.28;
const INITIAL_SCROLL_OFFSET_RATIO = 0.05;

function getVerticalTravel() {
  if (typeof window === "undefined") return 320;
  return Math.min(window.innerHeight * 0.42, 440);
}

function BracketMessage({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`relative max-w-[240px] px-5 py-4 sm:max-w-[280px] md:max-w-xs ${className}`}>
      <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l border-t border-foreground/35" />
      <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r border-t border-foreground/35" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l border-foreground/35" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b border-r border-foreground/35" />
      <p className="text-left text-sm leading-relaxed text-foreground/85 md:text-[15px]">
        {text}
      </p>
    </div>
  );
}

function getScrollRange(section: HTMLElement) {
  return Math.max(section.offsetHeight - window.innerHeight, 1);
}

export default function IsThisYou() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    const heading = headingRef.current;

    if (!section || !pin || !heading) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin,
          pinSpacing: false,
          anticipatePin: 1,
        });

        gsap.fromTo(
          heading,
          { opacity: 0.55, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `top+=${getScrollRange(section) * 0.08} top`,
              scrub: 1,
            },
          }
        );

        const range = getScrollRange(section);
        const travel = getVerticalTravel();

        painMessages.forEach((_, index) => {
          const el = messageRefs.current[index];
          if (!el) return;

          const pairIndex = Math.floor(index / 2);
          const isRight = index % 2 === 1;

          const windowStart =
            range * (INITIAL_SCROLL_OFFSET_RATIO + pairIndex * PAIR_GAP_RATIO);
          const sideDelay = isRight ? range * RIGHT_SIDE_DELAY_RATIO : 0;
          const scrollStart = windowStart + sideDelay;
          const scrollEnd = scrollStart + range * SCROLL_WINDOW_RATIO;

          gsap.set(el, {
            x: 0,
            y: travel,
            opacity: 0,
            filter: "blur(8px)",
            force3D: true,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: () => `top+=${scrollStart} top`,
              end: () => `top+=${scrollEnd} top`,
              scrub: 1,
            },
          });

          tl.fromTo(
            el,
            { y: travel, opacity: 0, filter: "blur(8px)", x: 0 },
            {
              y: travel * 0.9,
              opacity: 0.55,
              filter: "blur(4px)",
              x: 0,
              duration: 0.06,
              ease: "none",
            },
            0
          )
            .to(
              el,
              {
                y: travel * 0.55,
                opacity: 1,
                filter: "blur(0px)",
                x: 0,
                duration: 0.08,
                ease: "none",
              },
              0.06
            )
            .to(
              el,
              { y: 0, opacity: 1, filter: "blur(0px)", x: 0, duration: 0.36, ease: "none" },
              0.14
            )
            .to(
              el,
              {
                y: -travel * 0.55,
                opacity: 1,
                filter: "blur(0px)",
                x: 0,
                duration: 0.36,
                ease: "none",
              },
              0.5
            )
            .to(
              el,
              {
                y: -travel * 0.9,
                opacity: 0.55,
                filter: "blur(4px)",
                x: 0,
                duration: 0.08,
                ease: "none",
              },
              0.86
            )
            .to(
              el,
              {
                y: -travel,
                opacity: 0,
                filter: "blur(8px)",
                x: 0,
                duration: 0.06,
                ease: "none",
              },
              0.94
            );
        });

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        messageRefs.current.forEach((el) => {
          if (el) gsap.set(el, { x: 0, y: 0, opacity: 1, filter: "none" });
        });
        gsap.set(heading, { opacity: 1, scale: 1 });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: `${100 + PAIR_COUNT * 55}vh` }}
      aria-label="Is this you?"
    >
      <div
        ref={pinRef}
        className="relative flex h-svh w-full items-center justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(33,74,156,0.14),transparent_65%)]" />

        <h2
          ref={headingRef}
          className="relative z-10 px-4 text-center text-[2.5rem] font-bold leading-none tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Is This{" "}
          <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
            You?
          </span>
        </h2>

        <div className="pointer-events-none absolute inset-0 z-[5] [mask-image:linear-gradient(to_bottom,transparent_0%,black_6%,black_94%,transparent_100%)]">
          {painMessages.map((message, index) => (
            <div
              key={message.text}
              className={`absolute top-1/2 -translate-y-1/2 ${index >= 6 ? "hidden md:block" : ""}`}
              style={
                message.side === "left"
                  ? { left: message.offsetX }
                  : { right: message.offsetX }
              }
            >
              <div
                ref={(el) => {
                  messageRefs.current[index] = el;
                }}
                className="will-change-[transform,opacity,filter]"
              >
                <BracketMessage text={message.text} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
