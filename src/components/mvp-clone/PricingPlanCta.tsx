"use client";

import Link from "next/link";
import FlipButtonLabel from "@/components/FlipButtonLabel";
import { cn } from "@/lib/utils";

type PricingPlanCtaProps = {
  href: string;
  label: string;
  tone?: "default" | "inverted";
};

export default function PricingPlanCta({
  href,
  label,
  tone = "default",
}: PricingPlanCtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex w-full items-center justify-center overflow-hidden rounded-full px-6 py-3.5 text-sm font-semibold leading-none transition-[background-color,transform,box-shadow] duration-300 ease-out active:scale-[0.98]",
        tone === "inverted"
          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/92 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/92"
          : "bg-foreground text-background shadow-[0_8px_28px_-10px_rgba(0,0,0,0.35)] hover:bg-foreground/90 dark:bg-foreground dark:text-background",
      )}
    >
      <FlipButtonLabel label={label} lineHeight="1.2em" duration={0.55} ease="power4.out" />
    </Link>
  );
}
