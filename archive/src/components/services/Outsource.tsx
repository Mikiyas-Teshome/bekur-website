"use client";
import React from "react";
import WhyBekurSection from "../homePage/WhyBekurSection";
import TestimonialsSection from "../homePage/TestimonialsSection";
import GetInTouch from "../homePage/GetInTouch";
import DynamicPricingSection from "../pricing/DynamicPricingSection";
import OurValue from "../aboutPage/OurValue";
import OurTalents from "../outsource/OurTalents";
import ServiceHero from "./ServiceHero";
import outsourceService from "../../data/outsourceService.json";
import { useTheme } from "next-themes";
import WhyUs from "../outsource/WhyUs";

const Outsource = () => {
  const { resolvedTheme } = useTheme();

  let strokeColor: string;
  if (resolvedTheme === "dark") {
    strokeColor = "#FFFFFF";
  } else {
    strokeColor = "#214A9C";
  }
  return (
    <section className=" overflow-x-hidden bg-background space-y-4 py-3 md:py-8  md:space-y-8">
      <ServiceHero
        title="Hire Top Expert Talent Without the Overhead"
        className="max-w-265"
      >
        <div className="flex bg-secondary dark:bg-linear-to-r dark:from-white/80 dark:to-white/20 items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 21.5V19.5C16 18.4391 15.5786 17.4217 14.8284 16.6716C14.0783 15.9214 13.0609 15.5 12 15.5H6C4.93913 15.5 3.92172 15.9214 3.17157 16.6716C2.42143 17.4217 2 18.4391 2 19.5V21.5M16 3.628C16.8578 3.85037 17.6174 4.35126 18.1597 5.05206C18.702 5.75286 18.9962 6.61389 18.9962 7.5C18.9962 8.38611 18.702 9.24714 18.1597 9.94794C17.6174 10.6487 16.8578 11.1496 16 11.372M22 21.5V19.5C21.9993 18.6137 21.7044 17.7528 21.1614 17.0523C20.6184 16.3519 19.8581 15.8516 19 15.63M13 7.5C13 9.70914 11.2091 11.5 9 11.5C6.79086 11.5 5 9.70914 5 7.5C5 5.29086 6.79086 3.5 9 3.5C11.2091 3.5 13 5.29086 13 7.5Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            Outsourcing
          </p>
        </div>
      </ServiceHero>
      {/* <WhyBekurSection /> */}
      <WhyUs />
      {/* Outsource services */}
      {/* <OurValue
        title="selected projects"
        description="services"
        data={outsourceService.values}
      /> */}
      <OurTalents title="Talents" description="Our Talents" />
      {/* <TestimonialsSection /> */}

      {/* Outsourcing Pricing Section */}
      {/* <DynamicPricingSection
        serviceName="Outsourcing"
        serviceTitle="Outsourcing"
      /> */}

      <GetInTouch />
    </section>
  );
};

export default Outsource;
