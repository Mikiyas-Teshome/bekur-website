"use client";
import BlogSection from "@/components/homePage/BlogSection";
import GetInTouch from "@/components/homePage/GetInTouch";
import ProjectSection from "@/components/homePage/ProjectSection";
import ServicesSection from "@/components/homePage/ServicesSection";
import TeamSection from "@/components/homePage/TeamSection";
import TestimonialsSection from "@/components/homePage/TestimonialsSection";
import WhyBekurSection from "@/components/homePage/WhyBekurSection";
import Hero from "@/components/homePage/Hero";
import BekurSvg from "../../../public/assets/svg/BekurSvg";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by using fallback during SSR
  const logoColor = mounted
    ? resolvedTheme === "dark"
      ? "#F4F4F4"
      : "#214A9C"
    : "#214A9C"; // fallback color during SSR

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="py-8.75 space-y-0">
        <div className="pb-0 lg:pb-9 pt-0 md:pt-8">
          <div className="container mx-auto px-4">
            {!mounted ? (
              // Hero Skeleton
              <section className="container mx-auto space-y-4 py-8 md:pt-14 md:pb-6 relative">
                {/* Background gradient blur div skeleton */}
                {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-60 h-64 md:w-72 md:h-80 lg:w-80 lg:h-88 xl:w-[373.72px] xl:h-[395.81px] bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse opacity-30"></div>
                </div> */}

                <div className="flex flex-col items-center justify-center px-4 space-y-12 md:space-y-[7.3125rem] relative z-10">
                  {/* Logo Skeleton */}
                  <div className="w-[329px] h-[140px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  
                  {/* Title and Subtitle Skeleton */}
                  <div className="flex flex-col items-center justify-center space-y-5 pb-0 md:pb-8">
                    {/* Title Skeleton */}
                    <div className="space-y-2">
                      <div className="h-16 sm:h-20 md:h-24 lg:h-32 xl:h-36 w-80 sm:w-96 md:w-[500px] lg:w-[600px] xl:w-[700px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Subtitle Skeleton */}
                    <div className="h-6 md:h-12 w-64 md:w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  
                  {/* Trusted Company Skeleton */}
                  <div className="w-full overflow-hidden whitespace-nowrap relative">
                    <div className="inline-flex items-center gap-8 md:gap-12 lg:gap-16">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-center flex-shrink-0">
                          <div className="w-24 h-8 sm:w-28 sm:h-9 md:w-32 md:h-10 lg:w-36 lg:h-11 xl:w-[140px] xl:h-[42px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <Hero
                title="Bekur Technologies"
                sub_title="Empowering Your Digital Presence"
              >
                <BekurSvg width={329} height={140} color={logoColor} />
              </Hero>
            )}
          </div>
        </div>
        <div className="">
          <div className="container mx-auto px-4">
            <ServicesSection />
          </div>
        </div>
        <div className="container mx-auto px-4">
          <WhyBekurSection />
        </div>
        <div className="">
          <div className="container mx-auto px-4">
            <ProjectSection />
          </div>
        </div>
        <div className="">
          <div className="container mx-auto px-4">
            <TeamSection />
          </div>
        </div>
        <div className="container mx-auto px-4">
          <TestimonialsSection />
        </div>
        <div className="bg-[#F4F4F4] dark:bg-[#000104] backdrop-blur-sm overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <GetInTouch />
          </div>
        </div>
        <div className="container mx-auto px-4">
          <BlogSection />
        </div>
      </div>
    </div>
  );
}
