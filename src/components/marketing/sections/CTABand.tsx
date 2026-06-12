"use client";

import { motion } from "framer-motion";
import MarketingButton from "../ui/MarketingButton";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";
import { useGsapReveal } from "../motion/useGsapReveal";

export default function CTABand() {
  // subtle scroll drift on the background glow
  const rootRef = useGsapReveal(({ root, gsap }) => {
    const glow = root.querySelector<HTMLElement>("[data-glow]");
    if (!glow) return;
    gsap.fromTo(
      glow,
      { yPercent: -16 },
      {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });

  return (
    <section ref={rootRef} className="relative overflow-hidden py-24 md:py-32">
      <div
        data-glow
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[140%] w-[120%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 45% 45% at 50% 50%, var(--mk-accent-a10), transparent 70%)",
        }}
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative mx-auto max-w-[1200px] px-4 text-center md:px-8"
      >
        <motion.h2
          variants={fadeUp}
          className="mx-auto max-w-3xl font-display text-3xl font-semibold uppercase leading-[1.1] tracking-tight text-mk-text-1 md:text-5xl"
        >
          Map your logic.{" "}
          <span className="text-mk-text-2">Ship one workflow this month.</span>
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-10">
          <MarketingButton label="Book a call" size="lg" showArrow />
        </motion.div>
      </motion.div>
    </section>
  );
}
