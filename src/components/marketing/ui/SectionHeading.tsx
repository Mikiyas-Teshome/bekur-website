"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, stagger, VIEWPORT } from "@/components/marketing/motion/motion";
import SectionKicker from "./SectionKicker";

type SectionHeadingProps = {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {kicker && (
        <motion.div variants={fadeUp}>
          <SectionKicker className={cn(align === "center" && "justify-center")}>
            {kicker}
          </SectionKicker>
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-mk-text-1 md:text-4xl lg:text-[44px]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-base leading-relaxed text-mk-text-2 md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
