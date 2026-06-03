"use client";
import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { dmSans4 } from "@/app/fonts";

interface BookCallButtonProps {
  className?: string;
  text?: string;
  email?: string;
}

const BookCallButton = ({
  className = "",
  text = "Book A Call",
  email = "bekurtechsolution@gmail.com",
}: BookCallButtonProps) => {
  const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Meeting+with+Bekur+Technologies&details=Discuss+project+requirements&add=${encodeURIComponent(email)}`;

  return (
    <Button
      asChild
      className={`${dmSans4.className} bg-dark-background text-primary-foreground shadow-md backdrop-blur-md hover:bg-dark-background rounded-[0.625rem] font-medium cursor-pointer ${className}`}
    >
      <Link
        href={calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </Link>
    </Button>
  );
};

export default BookCallButton;

