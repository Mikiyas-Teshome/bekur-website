"use client";
import React, { useState, useEffect } from "react";
import SectionHeader from "../homePage/SectionHeader";
import FeatureCard from "../homePage/FeatureCard";
import Image from "next/image";

import { useTheme } from "next-themes";

const WhatWeDo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [aboutImage, setAboutImage] = useState(
    "/assets/about/about-logo-light.svg"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setAboutImage(
        resolvedTheme === "dark"
          ? "/assets/about/about-logo-dark.svg"
          : "/assets/about/about-logo-light.svg"
      );
    }
  }, [resolvedTheme, mounted]);

  const features = [
    {
      title: "Our Vision",
      description:
        "We envision a landscape where innovative solutions seamlessly integrate into every facet of life, driving sustainable growth, fostering creativity, and unlocking limitless possibilities for our clients across the globe.",
    },
    {
      title: "Our Mission",
      description:
        "We are dedicated to delivering exceptional value by blending innovative web development, strategic digital marketing, and intuitive design with a relentless commitment to client success.",
    },
  ];

  return (
    <section className="">
      <div className="container mx-auto px-4 space-y-2 md:space-y-10 xl:space-y-0">
        <div className="w-full">
          <SectionHeader title="About us" description="Our Vision & mission" />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side*/}
          <div className="space-y-8 md:space-y-18">
            {/* Header */}
            <div className="space-y-8 md:space-y-[5.6875rem]">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index + 3}
                  description={feature.description}
                  title={feature.title}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Central Graphic */}
          <div className="flex justify-center w-full">
            <Image
              key={aboutImage}
              src={aboutImage}
              alt="About"
              width={732}
              height={697}
            />
          </div>
        </div>

        {/* Statistics Section */}
        {/* <div className="mt-20">
          <StatisticsSection />
        </div> */}
      </div>
    </section>
  );
};

export default WhatWeDo;