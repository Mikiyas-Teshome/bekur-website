"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FlipButtonLabel from "@/components/FlipButtonLabel";
import { cn } from "@/lib/utils";

const DEFAULT_LABEL = "Book a call";

type Variant =
  | "primary"
  | "secondary"
  | "header"
  | "headerMobile"
  | "pricing"
  | "ctaBanner";

type BookCallLinkProps = {
  href?: string;
  className?: string;
  frameClassName?: string;
  label?: string;
  variant?: Variant;
  showArrow?: boolean;
  arrowType?: "upRight" | "right";
};

/*
 * One CTA identity everywhere: an animated blue conic border (.cta-frame)
 * around a monochrome button that adapts to the theme — dark button on the
 * light theme, light button on the dark theme. Variants only change sizing.
 */
const frameVariantClass: Record<Variant, string> = {
  primary: "",
  secondary: "",
  header: "hidden sm:inline-flex",
  headerMobile: "mt-2 w-full",
  pricing: "w-full",
  ctaBanner: "",
};

const buttonVariantClass: Record<Variant, string> = {
  primary: "h-12 px-8 text-[15px] sm:h-[52px] sm:px-9",
  secondary: "h-12 px-7 text-[15px]",
  header: "h-10 px-5 text-sm",
  headerMobile: "h-12 px-5 text-sm",
  pricing: "h-12 px-6 text-sm",
  ctaBanner: "h-[52px] px-8 text-base",
};

export default function BookCallLink({
  href = "/book",
  className,
  frameClassName,
  label = DEFAULT_LABEL,
  variant = "primary",
  showArrow = false,
  arrowType = "upRight",
}: BookCallLinkProps) {
  const Arrow = arrowType === "right" ? ArrowRight : ArrowUpRight;

  return (
    <span
      className={cn(
        "cta-frame inline-flex rounded-[12px] p-[2px]",
        frameVariantClass[variant],
        frameClassName,
      )}
    >
      <Link
        href={href}
        className={cn(
          "group inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-background font-semibold leading-none tracking-[-0.01em] text-foreground shadow-[inset_0_1px_0_rgba(0,0,0,0.08)] transition-colors hover:bg-background/85 active:scale-[0.98] dark:bg-card dark:text-foreground dark:hover:bg-card/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          buttonVariantClass[variant],
          className,
        )}
      >
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
    </span>
  );
}

export { FlipButtonLabel as FlipText, DEFAULT_LABEL };
