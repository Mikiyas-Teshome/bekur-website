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
    <Link
      href={calendarUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        dmSans4.className,
        "group inline-flex cursor-pointer items-center justify-center rounded-[0.625rem] bg-dark-background px-12.5 py-4 text-xl font-medium leading-none text-primary-foreground dark:text-white shadow-md backdrop-blur-md transition-all hover:bg-dark-background md:text-[1.75rem]",
        className,
      )}
    >
      <FlipText label={label} lineHeight="1.1em" />
    </Link>
  );
};

export default BookCallButton;
