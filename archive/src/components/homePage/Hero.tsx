"use client";

import React, { useEffect, useRef } from "react";
import TrustedCompany from "./TrustedCompany";
import { gsap } from "gsap";

interface HeroProps {
  children: React.ReactNode;
  title: string;
  sub_title: string;
}

const Hero = ({ children, title, sub_title }: HeroProps) => {
  const titleWords = title.split(" ");
  const subtitleWords = sub_title.split(" ");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const titleWordElements = titleRef.current?.querySelectorAll(".word");
    const subtitleWordElements = subtitleRef.current?.querySelectorAll(".word");

    if (titleWordElements && subtitleWordElements) {
      // Set initial state
      gsap.set([titleWordElements, subtitleWordElements], {
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
      });

      // Animate subtitle words with delay
      gsap.to(subtitleWordElements, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: titleWords.length * 0.15 + 0.5,
      });
    }
  }, [titleWords.length]);
  return (
    <section className="container mx-auto space-y-4 py-8 md:pt-14 md:pb-6 relative">
      {/* Background gradient blur div */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-60 h-64 md:w-72 md:h-80 lg:w-80 lg:h-88 xl:w-[373.72px] xl:h-[395.81px] bg-gradient-blur"
          style={{
            transform: "rotate(-121.16deg)",
            background:
              "linear-gradient(-121.16deg, rgba(33, 74, 156, 0.57), #214A9C)",
            filter: "blur(100px)",
            opacity: 0.78,
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center px-4 space-y-12 md:space-y-[7.3125rem] relative z-10">
        {children}
        <div className="flex flex-col items-center justify-center space-y-5 pb-0 md:pb-8">
          <h1
            ref={titleRef}
            className="text-primary dark:text-foreground text-[2rem] sm:text-[3.375rem] md:text-[4.375rem] px-1 lg:text-[6.375rem] xl:text-[7.375rem] leading-[100%] tracking-[-6%] pb-2.5 font-medium"
          >
            {titleWords.map((word, index) => (
              <span key={index} className="word inline-block mr-6 last:mr-0">
                {word}
              </span>
            ))}
          </h1>
          <p
            ref={subtitleRef}
            className="text-primary dark:text-foreground text-sm md:text-[2rem] leading-[1rem] md:leading-[2.5rem] tracking-[-0.86px] md:tracking-[-2.12px]"
          >
            {subtitleWords.map((word, index) => (
              <span key={index} className="word inline-block mr-2 last:mr-0">
                {word}
              </span>
            ))}
          </p>
        </div>
        <TrustedCompany />
      </div>
    </section>
  );
};

export default Hero;
