"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FlipButtonLabel from "@/components/FlipButtonLabel";
import { cn } from "@/lib/utils";

type MarketingButtonProps = {
  href?: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  showArrow?: boolean;
  arrowType?: "upRight" | "right";
  className?: string;
};

const variantClass = {
  primary:
    "group inline-flex items-center justify-center gap-2 rounded-full bg-mk-accent font-semibold leading-none text-mk-bg shadow-[0_0_24px_-6px_var(--mk-accent-a25)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98]",
  secondary:
    "group inline-flex items-center justify-center gap-2 rounded-full border border-mk-border-strong bg-mk-surface-1/60 font-semibold leading-none text-mk-text-1 backdrop-blur-sm transition-colors hover:border-mk-accent-a25 hover:bg-mk-surface-1 active:scale-[0.98]",
  ghost:
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium leading-none text-mk-text-2 transition-colors hover:text-mk-text-1",
};

const sizeClass = {
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export default function MarketingButton({
  href = "/blueprint#book",
  label,
  variant = "primary",
  size = "md",
  showArrow = false,
  arrowType = "upRight",
  className,
}: MarketingButtonProps) {
  const Arrow = arrowType === "right" ? ArrowRight : ArrowUpRight;

  return (
    <Link href={href} className={cn(variantClass[variant], sizeClass[size], className)}>
      <FlipButtonLabel label={label} />
      {showArrow && (
        <Arrow
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5",
            arrowType === "upRight" && "group-hover:-translate-y-0.5",
          )}
          strokeWidth={arrowType === "right" ? 2 : 1.75}
        />
      )}
    </Link>
  );
}
