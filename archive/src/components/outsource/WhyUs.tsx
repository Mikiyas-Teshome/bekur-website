"use client";
import React, { useRef, useEffect } from "react";
import BekurSvg from "../../../public/assets/svg/BekurSvg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { useTheme } from "next-themes";
import SectionHeader from "../homePage/SectionHeader";

interface Feature {
  id: number;
  title: string;
  description: string;
}

const staticFeatures: Feature[] = [
  {
    id: 1,
    title: "Cost Efficiency",
    description: "Reduce operational costs by up to 60% while maintaining premium quality standards.",
  },
  {
    id: 2,
    title: "Expert Talent Pool",
    description: "Access 500+ certified developers, designers, and engineers with proven track records.",
  },
  {
    id: 3,
    title: "Scalable Solutions",
    description: "Easily scale your team up or down based on project requirements and business goals.",
  },
  {
    id: 4,
    title: "24/7 Support",
    description: "Round-the-clock technical support ensuring your systems run smoothly at all times.",
  },
];

const WhyUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  let logoColor: string;
  if (resolvedTheme === "dark") {
    logoColor = "#F4F4F4";
  } else {
    logoColor = "#214A9C";
  }

  useEffect(() => {
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
  }, []);

  return (
    <section ref={sectionRef} className=" p-4 md:py-8.5">
      <div className="container mx-auto px-4 space-y-2 py-1 sm:py-0 md:space-y-18.5">
        {/* Section Header */}
        <div ref={headerRef} className="py-1 sm:py-0">
          <div className="flex flex-col space-y-3 md:space-y-6.5 w-full">
            <SectionHeader title="Why" description="Why Choosing Us" />
          </div>
        </div>
        <div className="flex flex-col visible lg:flex-row items-center xl:gap-[9.625rem] lg:gap-[6.625rem]">
          {/* Left Side - Blue Abstract Graphic using BekurSvg */}
          <div
            ref={leftSideRef}
            className="w-full lg:w-1/3 flex justify-center lg:justify-start"
          >
            <div className="w-full hidden lg:block">
              <BekurSvg color={logoColor} width={400} height={400} />
            </div>
          </div>

          {/* Right Side - Two Columns of Text Content */}
          <div
            ref={rightSideRef}
            className="lg:w-full xl:mr-[rem] grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-[3.5rem] my-3"
          >
            {/* Left Text Column */}
            <div className="lg:space-y-[3.875rem] md:space-y-[2rem] space-y-6">
              {staticFeatures.slice(0, 2).map((feature) => (
                <div key={feature.id} className="feature-item flex gap-4">
                  {/* Checkmark Icon in Light Blue Circle */}
                  <div className="shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#214A9C] flex items-center justify-center">
                      {/* <Check className="w-5 h-5 md:w-6 md:h-6 text-[#2176FF]" strokeWidth={3} /> */}
                      <Check />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground text-[1.375rem] leading-[1.875rem] pb-2 font-medium">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-md md:text-lg md:leading-[1.875rem]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Text Column */}
            <div className="lg:space-y-[3.875rem] md:space-y-[2rem] space-y-6">
              {staticFeatures.slice(2, 4).map((feature) => (
                <div key={feature.id} className="feature-item flex gap-4">
                  {/* Checkmark Icon in Light Blue Circle */}
                  <div className="shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#214A9C] flex items-center justify-center">
                      {/* <Check className="w-5 h-5 md:w-6 md:h-6 text-[#2176FF]" strokeWidth={3} /> */}
                      <Check />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground text-[1.375rem] leading-[1.875rem] pb-2 font-medium">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-md md:text-lg md:leading-[1.875rem]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

