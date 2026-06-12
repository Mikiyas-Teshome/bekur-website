"use client";

import { motion } from "framer-motion";
import HeroSceneLoader from "../hero/HeroSceneLoader";
import MarketingButton from "../ui/MarketingButton";
import { fadeUp, stagger } from "../motion/motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-24 pb-16 md:pt-28">
      <HeroSceneLoader />

      {/* scrim so text stays readable over the scene */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(10,10,12,0.55), rgba(10,10,12,0.9) 80%)",
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative mx-auto w-full max-w-[1200px] px-4 text-center md:px-8"
      >
        <motion.p
          variants={fadeUp}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-mk-border bg-mk-surface-1/60 px-4 py-1.5 font-mono-mk text-[11px] uppercase tracking-[0.16em] text-mk-text-2 backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mk-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mk-accent" />
          </span>
          Top Rated on Upwork · 100% Job Success
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mx-auto max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-mk-text-1 md:text-6xl lg:text-[72px]"
        >
          Custom automation for professional service firms.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mk-text-2 md:text-lg"
        >
          Reclaim partner hours in 3–6 weeks — without rigid SaaS templates,
          surprise AI bills, or scope creep.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <MarketingButton label="Book a call" size="lg" showArrow />
          <MarketingButton
            label="View our work"
            href="/portfolio"
            variant="secondary"
            size="lg"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
