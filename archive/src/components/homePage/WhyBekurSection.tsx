"use client";
import React, { useRef, useEffect, useState } from "react";
import BekurSvg from "../../../public/assets/svg/BekurSvg";
import SectionHeader from "./SectionHeader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import featuresData from "@/data/features.json";

interface Feature {
  id: number;
  title: string;
  description: string;
}

const WhyBekurSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [features] = useState<Feature[]>(featuresData.features);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoColor = mounted && resolvedTheme === "dark" ? "#F4F4F4" : "#214A9C";


  useEffect(() => {
    if (features.length === 0) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Left side animation (BekurSvg from left)
      gsap.fromTo(
        leftSideRef.current,
        {
          opacity: 0,
          x: -100,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Right side animation (Features from right)
      gsap.fromTo(
        rightSideRef.current,
        {
          opacity: 0,
          x: 100,
          scale: 0.95,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Individual feature items animation with stagger
      const featureItems =
        rightSideRef.current?.querySelectorAll(".feature-item");
      if (featureItems) {
        gsap.fromTo(
          featureItems,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.4,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "top 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [features.length]);



  return (
    <section ref={sectionRef} className="bg-background p-4 md:py-8.5">
      <div className="container mx-auto px-4 space-y-2 md:space-y-18.5">
        {/* Section Header */}
        <div ref={headerRef} className="">
          <SectionHeader title="Feature" description="Why us" />
        </div>
        <div className="flex flex-col visible lg:flex-row items-center xl:gap-38.5 lg:gap-26.5">
          {/* Left Side - Blue Abstract Graphic */}
          <div
            ref={leftSideRef}
            className="w-full lg:w-1/3 flex justify-center lg:justify-start"
          >
            <div className="w-ful hidden lg:block">
              <BekurSvg color={logoColor} />
            </div>
          </div>

          {/* Right Side - Two Columns of Text Content */}
          <div
            ref={rightSideRef}
            className="lg:w-full xl:mr-16.75 grid grid-cols-1 md:grid-cols-2 gap-2 xl:gap-[7rem] my-3"
          >
            {/* Left Text Column */}
            <div className="lg:space-y-[3.875rem] md:space-y-[2rem] space-y-2">
              {features.slice(0, 3).map((feature, index) => (
                <div key={feature.id ?? index} className="feature-item">
                  <h3 className="text-foreground text-[1.375rem] leading-[1.875rem] pb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-md md:text-lg  md:leading-[1.875rem]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Text Column */}
            <div className="lg:space-y-[3.875rem] md:space-y-[2rem] space-y-2">
              {features.slice(3, 6).map((feature, index) => (
                <div key={feature.id ?? index} className="feature-item">
                  <h3 className="text-foreground text-[1.375rem] leading-[1.875rem] pb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-md md:text-lg  md:leading-[1.875rem]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBekurSection;
