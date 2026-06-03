"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import BookCallLink from "@/components/BookCallLink";
import Logo from "@/components/logo/Logo";
import HeroNightSky from "./HeroNightSky";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 sm:px-6">
      <HeroNightSky />

      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <Logo
          width={400}
          height={168}
          className="h-auto w-[min(58vw,200px)] opacity-[0.12] blur-sm sm:w-[min(52vw,260px)] md:w-[min(48vw,320px)] lg:w-[400px] dark:opacity-[0.16]"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center pt-[5.25rem] pb-14 md:pt-[5.75rem] md:pb-20 lg:max-w-4xl">
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-4 max-w-[18rem] text-[28px] font-bold leading-[1.12] tracking-tight text-foreground sm:max-w-2xl sm:text-[36px] md:mb-5 md:text-[44px] lg:max-w-3xl lg:text-[52px]"
        >
          Custom automation for{" "}
          <span className="text-foreground/90">professional service firms</span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 max-w-md text-[15px] leading-relaxed text-muted-foreground md:mb-9 md:max-w-lg md:text-[17px]"
        >
          Reclaim partner hours in 3–6 weeks — without rigid SaaS templates, surprise AI bills, or scope creep.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
        >
          <BookCallLink
            variant="primary"
            showArrow
            className="h-11 text-[15px] font-medium sm:h-12 sm:px-7 hover:brightness-110"
          />
          <Link
            href="/portfolio"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-[15px] font-medium text-foreground transition-all hover:bg-muted/60 active:scale-[0.98] sm:h-12 sm:px-7"
          >
            View Our Work
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 text-xs tracking-wide text-muted-foreground/80 md:mt-10"
        >
          Top Rated on Upwork · 100% Job Success
        </motion.p>
      </div>
    </section>
  );
}
