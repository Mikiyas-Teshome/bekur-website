"use client";

import Link from "next/link";
import { dmSans4 } from "@/app/fonts";
import { FlipText } from "./BookCallLink";
import { cn } from "@/lib/utils";

interface BookCallButtonProps {
  className?: string;
  label?: string;
  email?: string;
}

const BookCallButton = ({
  className = "",
  label = "Book a call",
  email = "bekurtechsolution@gmail.com",
}: BookCallButtonProps) => {
  const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Meeting+with+Bekur+Technologies&details=Discuss+project+requirements&add=${encodeURIComponent(email)}`;

  return (
    <span className="cta-frame inline-flex rounded-[14px] p-[2px]">
      <Link
        href={calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          dmSans4.className,
          "group inline-flex w-full cursor-pointer items-center justify-center rounded-[12px] bg-background px-12.5 py-4 text-xl font-medium leading-none text-foreground shadow-[inset_0_1px_0_rgba(0,0,0,0.08)] transition-colors hover:bg-background/85 active:scale-[0.98] dark:bg-card dark:text-foreground dark:hover:bg-card/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:text-[1.75rem]",
          className,
        )}
      >
        <FlipText label={label} lineHeight="1.1em" />
      </Link>
    </span>
  );
};

export default BookCallButton;
