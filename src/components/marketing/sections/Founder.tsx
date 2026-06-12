"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionKicker from "../ui/SectionKicker";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

const LINKEDIN_URL = "https://www.linkedin.com/company/bekur-technologies";

export default function Founder() {
  return (
    <SectionShell>
      <div className="grid items-center gap-10 md:grid-cols-[280px_1fr] md:gap-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-2xl border border-mk-border bg-mk-surface-1"
        >
          {/* TODO: replace with /assets/founder/miki.jpg once supplied */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 30%, var(--mk-accent-a10), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-semibold text-mk-text-3">
              MT
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 border-t border-mk-border bg-mk-bg/80 px-4 py-3 backdrop-blur-sm">
            <p className="text-sm font-medium text-mk-text-1">Mikiyas Teshome</p>
            <p className="font-mono-mk text-[10px] uppercase tracking-[0.14em] text-mk-text-3">
              Founder · Bekur Technologies
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={fadeUp}>
            <SectionKicker>Founder</SectionKicker>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-mk-text-1 md:text-4xl"
          >
            Built by an operator who ships.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-mk-text-2 md:text-lg"
          >
            Miki has shipped products used by more than a million people, and
            built Finden AI — #3 Product of the Day on Product Hunt, ahead of
            Vercel&apos;s v0. He started Bekur to give professional service
            firms the operational systems their work deserves.
          </motion.p>
          <motion.a
            variants={fadeUp}
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-mk-accent transition-colors hover:text-mk-accent-bright"
          >
            Connect on LinkedIn
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </motion.div>
      </div>
    </SectionShell>
  );
}
