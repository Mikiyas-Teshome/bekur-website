"use client";
import GetInTouch from "@/components/homePage/GetInTouch";
import Hero from "@/components/homePage/Hero";
import ProjectSection from "@/components/homePage/ProjectSection";
import ServicesSection from "@/components/homePage/ServicesSection";
import React from "react";
import BekurSvg from "../../../../public/assets/svg/BekurSvg";
import { useTheme } from "next-themes";

const ServicePage = () => {
  const { resolvedTheme } = useTheme();
  let logoColor: string;
  if (resolvedTheme === "dark") {
    logoColor = "#F4F4F4";
  } else {
    logoColor = "#214A9C";
  }

  return (
    <section className="w-full min-h-screen bg-background text-foreground">
      <div className="py-8.75 space-y-8 container mx-auto px-4">
        <Hero
          title="Bekur Technologies"
          sub_title="Empowering Your Digital Presence"
        >
          <BekurSvg width={329} height={140} color={logoColor} />
        </Hero>
        <ServicesSection />
        <ProjectSection />
        <GetInTouch />
      </div>
    </section>
  );
};

export default ServicePage;
