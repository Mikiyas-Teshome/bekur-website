"use client";
import React from "react";
import SectionHeader from "../homePage/SectionHeader";
import HandClap from "../../../public/assets/svg/HandClap";
import { useTheme } from "next-themes";

const OurTalents = ({ title, description }: { title: string, description: string }) => {
  const { resolvedTheme } = useTheme();
  
  // Determine colors based on theme
  const isDark = resolvedTheme === "dark";
  const handColor = "white";
  const sleeveColor = "#214A9C"; // Blue sleeve
  const starFillColor = "#214A9C"; // Blue star
  const strokeColor = isDark ? "white" : "black"; // White strokes in dark mode, black in light
  const starburstColor = isDark ? "white" : "black"; // White starburst in dark mode, black in light
  const talents = [
    "Front-End Developers",
    "Mobile app developer (iOS/Swift, Android/Kotlin, Flutter)",
    "Virtual assistant (email, calendar, research)",
    "Project manager (Asana, ClickUp, Notion)",
    "Graphic designer (social media, ads, infographics)",
    "Video editor (YouTube, TikTok, Reels)",
    "Full-Stack Developers",
    "Back-End Developers",
    "Logo & brand identity designer", 
    "Social media manager (organic + paid)",
    "UI/UX designer (Figma, wireframes, prototypes)",
  ];

  // Pyramid arrangement: 1, 2, 3, 3, 2 with specific rotations
  const talentConfig = [
    { index: 0, rotation: 0 }, // Front-End Developers
    { index: 1, rotation: -4 }, // Mobile app developer
    { index: 2, rotation: 2 }, // Virtual assistant
    { index: 3, rotation: -4 }, // Project manager
    { index: 4, rotation: -2 }, // Graphic designer
    { index: 5, rotation: -7 }, // Video editor
    { index: 6, rotation: 3 }, // Full-Stack Developers
    { index: 7, rotation: 1 }, // Back-End Developers
    { index: 8, rotation: -7 }, // Logo & brand identity designer
    { index: 9, rotation: 3 }, // Social media manager
    { index: 10, rotation: -3 }, // UI/UX designer
  ];

  // Pyramid layout rows
  const pyramidRows = [
    [talentConfig[0]], // Row 1: 1 box
    [talentConfig[1]], // Row 2: 2 boxes
    [ talentConfig[2], talentConfig[3]],
    [ talentConfig[4], talentConfig[5]], // Row 3: 3 boxes
    [talentConfig[6], talentConfig[7], talentConfig[8]], // Row 4: 3 boxes
    [talentConfig[9], talentConfig[10]], // Row 5: 2 boxes
  ];

  return (
    <section className="py-6 md:py-12.5 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 space-y-8 md:space-y-15 relative">
        {/* Header Section */}
        <SectionHeader title={title} description={description} />

        {/* Talents Grid - Pyramid Layout */}
        <div className="relative max-w-276.25 mx-auto pb-20 md:pb-32 lg:pb-40">
          {/* Talent Boxes */}
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8">
            {pyramidRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full"
              >
                {row.map((talent) => (
                  <div
                    key={talent.index}
                    className="bg-[#214A9C] rounded-lg my-1 sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3.5 transform transition-transform hover:scale-105 max-w-full"
                    style={{
                      transform: `rotate(${talent.rotation}deg)`,
                    }}
                  >
                    <p className="text-white text-sm sm:text-lg md:text-[1.375rem] font-medium  wrap-break-words text-center">
                      {talents[talent.index]}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Hands Illustration - Bottom Right */}
          <div className="absolute bottom-0 xl:bottom-0 hidden right-0 xl:-right-1/4 sm:flex items-end z-10 pointer-events-none">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 xl:w-[307px] xl:h-[307px]">
              <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                <HandClap
                  handColor={handColor}
                  sleeveColor={sleeveColor}
                  starFillColor={starFillColor}
                  strokeColor={strokeColor}
                  starburstColor={starburstColor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTalents;

