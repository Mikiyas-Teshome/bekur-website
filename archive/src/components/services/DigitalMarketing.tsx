"use client";
import React from "react";
import DynamicPricingSection from "../pricing/DynamicPricingSection";
import ServiceHero from "./ServiceHero";
import { useTheme } from "next-themes";

const DigitalMarketing = () => {
  const { resolvedTheme } = useTheme();

  let strokeColor: string;
  if (resolvedTheme === "dark") {
    strokeColor = "#FFFFFF";
  } else {
    strokeColor = "#214A9C";
  }

  // Digital Marketing service name - will be resolved to service ID automatically
  const digitalMarketingServiceName = "Digital Marketing";

  return (
    <section className="bg-background space-y-4 py-6 md:py-12.5">
      <ServiceHero title="Grow Your Brand with Powerful Digital Marketing">
        <div className="flex bg-secondary dark:bg-gradient-to-r dark:from-[#FFFFFFCC] dark:to-[#FFFFFF33] items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 21.5H17M4 3.5H20C21.1046 3.5 22 4.39543 22 5.5V15.5C22 16.6046 21.1046 17.5 20 17.5H4C2.89543 17.5 2 16.6046 2 15.5V5.5C2 4.39543 2.89543 3.5 4 3.5Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            Digital Marketing
          </p>
        </div>
      </ServiceHero>

      {/* Dynamic Pricing Section */}
      <DynamicPricingSection
        serviceName={digitalMarketingServiceName}
        serviceTitle="Digital Marketing"
      />
    </section>
  );
};

export default DigitalMarketing;
