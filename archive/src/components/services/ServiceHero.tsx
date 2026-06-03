"use client";
import React, { useEffect, useRef } from "react";
import TrustedCompany from "../homePage/TrustedCompany";
import { poppins5 } from "@/app/fonts";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

interface HeroProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

const ServiceHero = ({
  children,
  title,
  className = "max-w-[66.75rem]",
}: HeroProps) => {
  const titleWords = title.split(" ");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const titleWordElements = titleRef.current?.querySelectorAll(".word");

    if (titleWordElements) {
      // Set initial state
      gsap.set(titleWordElements, {
        opacity: 0,
        y: 100,
        rotationX: 90,
        transformOrigin: "bottom center",
      });

      // Animate title words
      gsap.to(titleWordElements, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.3,
      });
    }
  }, [titleWords.length]);
  return (
    <section className="container mx-auto space-y-4 py-8 md:pt-14 md:pb-6 relative">
      {/* Background gradient blur div */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-48 h-52 sm:w-60 sm:h-64 md:w-72 md:h-80 lg:w-80 lg:h-88 xl:w-[373.72px] xl:h-[395.81px] bg-gradient-blur"
          style={{
            transform: "rotate(-121.16deg)",
            background:
              "linear-gradient(-121.16deg, rgba(33, 74, 156, 0.57), #214A9C)",
            filter: "blur(100px)",
            opacity: 0.78,
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center px-4 space-y-3 md:space-y-[2.875rem]">
        {children}
        <div className={`${className}`}>
          <h1
            ref={titleRef}
            className={`text-center ${poppins5.className} text-primary dark:text-foreground text-[2rem] sm:text-[3.375rem] md:text-[4rem] xl:text-[4.375rem] leading-normal tracking-[-6%] pb-2`}
          >
            {titleWords.map((word, index) => (
              <span key={index} className="word inline-block mr-4 last:mr-0">
                {word}
              </span>
            ))}
          </h1>
        </div>
        {pathname !== "/contact" && <TrustedCompany />}
      </div>
    </section>
  );
};

export default ServiceHero;
