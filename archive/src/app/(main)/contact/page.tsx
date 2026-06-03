"use client";
import GetInTouch from "@/components/homePage/GetInTouch";
import ServiceHero from "@/components/services/ServiceHero";
import { useTheme } from "next-themes";
import React from "react";

const ContactPage = () => {
  const { resolvedTheme } = useTheme();

  let strokeColor: string;
  if (resolvedTheme === "dark") {
    strokeColor = "#FFFFFF";
  } else {
    strokeColor = "#214A9C";
  }
  return (
    <section className="bg-background space-y-14">
      <ServiceHero title="We’re Here to Help — Reach out with any questions or ideas.">
        <div className="flex bg-secondary dark:bg-gradient-to-r dark:from-[#FFFFFFCC] dark:to-[#FFFFFF33] items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.5 22V4C6.5 3.46957 6.71071 2.96086 7.08579 2.58579C7.46086 2.21071 7.96957 2 8.5 2H16.5C17.0304 2 17.5391 2.21071 17.9142 2.58579C18.2893 2.96086 18.5 3.46957 18.5 4V22M6.5 22H18.5M6.5 22H4.5C3.96957 22 3.46086 21.7893 3.08579 21.4142C2.71071 21.0391 2.5 20.5304 2.5 20V14C2.5 13.4696 2.71071 12.9609 3.08579 12.5858C3.46086 12.2107 3.96957 12 4.5 12H6.5M18.5 22H20.5C21.0304 22 21.5391 21.7893 21.9142 21.4142C22.2893 21.0391 22.5 20.5304 22.5 20V11C22.5 10.4696 22.2893 9.96086 21.9142 9.58579C21.5391 9.21071 21.0304 9 20.5 9H18.5M10.5 6H14.5M10.5 10H14.5M10.5 14H14.5M10.5 18H14.5"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            Contact
          </p>
        </div>
      </ServiceHero>
      <GetInTouch />
    </section>
  );
};

export default ContactPage;
