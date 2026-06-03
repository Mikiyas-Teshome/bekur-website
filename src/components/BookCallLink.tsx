"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FlipButtonLabel from "@/components/FlipButtonLabel";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "Book a call";

type BookCallLinkProps = {
  href?: string;
  className?: string;
  label?: string;
  variant?: "primary" | "secondary" | "header" | "headerMobile" | "pricing" | "ctaBanner";
  showArrow?: boolean;
  arrowType?: "upRight" | "right";
};

const variantClass: Record<NonNullable<BookCallLinkProps["variant"]>, string> = {
  primary:
    "group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold leading-none text-primary-foreground dark:text-white shadow-[0_4px_14px_-4px_rgba(33,74,156,0.45)] transition-colors hover:bg-primary/90 active:scale-[0.98]",
  secondary:
    "group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/90 bg-card/70 px-6 text-sm font-semibold leading-none text-foreground backdrop-blur-sm transition-colors hover:border-primary/35 hover:bg-card active:scale-[0.98]",
  header:
    "group hidden sm:inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium leading-none text-primary-foreground dark:text-white transition-[filter] hover:brightness-110 active:scale-[0.98]",
  headerMobile:
    "group mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium leading-none text-primary-foreground dark:text-white",
  pricing:
    "group relative inline-flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold leading-none text-background transition-[background-color,transform] duration-300 hover:bg-foreground/90 active:scale-[0.98] dark:bg-foreground dark:text-background",
  ctaBanner:
    "group inline-flex items-center gap-2 rounded-full bg-primary-foreground px-8 py-4 text-base font-bold leading-none text-primary transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-primary dark:text-white",
};

export default function BookCallLink({
  href = "/blueprint#book",
  className,
  label = DEFAULT_LABEL,
  variant = "primary",
  showArrow = false,
  arrowType = "upRight",
}: BookCallLinkProps) {
  const Arrow = arrowType === "right" ? ArrowRight : ArrowUpRight;
  const isOnPrimary = variant !== "secondary";

  return (
    <Link href={href} className={cn(variantClass[variant], className)}>
      <FlipButtonLabel label={label} />
      {showArrow && (
        <Arrow
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5",
            arrowType === "upRight" && "group-hover:-translate-y-0.5",
            isOnPrimary && "text-primary-foreground dark:text-white",
          )}
          strokeWidth={arrowType === "right" ? 2 : 1.75}
        />
      )}
    </Link>
  );
}

export { FlipButtonLabel as FlipText, DEFAULT_LABEL };
