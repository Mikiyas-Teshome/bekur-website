"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "../homePage/SectionHeader";
import graphicsStepsData from "../../data/graphics.json";
import AnimatedList from "../ui/AnimatedList";
import ServiceHero from "./ServiceHero";
import ProjectCard from "../homePage/ProjectCard";
import ProjectCardSkeleton from "../ProjectCardSkeleton";
import DynamicPricingSection from "../pricing/DynamicPricingSection";
import { useTheme } from "next-themes";

interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  category: string;
}

const Graphics = () => {
  const graphicsSteps = graphicsStepsData;
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects");
        if (response.ok) {
          const data = await response.json();
          // Filter projects by graphics category
          const graphicsProjects = data.filter(
            (project: { category: string }) =>
              project.category === "Branding" ||
              project.category === "Graphics Design" || project.category === "Graphic-Design"
          );
          setProjects(graphicsProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback to empty array
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  let strokeColor: string;
  if (resolvedTheme === "dark") {
    strokeColor = "#FFFFFF";
  } else {
    strokeColor = "#214A9C";
  }
  return (
    <section className="bg-background space-y-4 py-3 md:py-8 md:space-y-8">
      <ServiceHero title="Visuals that speaks louder than words.">
        <div className="flex bg-secondary dark:bg-linear-to-r dark:from-white/80 dark:to-white/20 items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 7.5C20.2021 10.7964 20.2021 14.2036 19.5 17.5M4.5 7.5C3.79785 10.7964 3.79785 14.2036 4.5 17.5M7 20C10.2964 20.7021 13.7036 20.7021 17 20M7 5C10.2964 4.29785 13.7036 4.29785 17 5M18 17.5H21C21.5523 17.5 22 17.9477 22 18.5V21.5C22 22.0523 21.5523 22.5 21 22.5H18C17.4477 22.5 17 22.0523 17 21.5V18.5C17 17.9477 17.4477 17.5 18 17.5ZM18 2.5H21C21.5523 2.5 22 2.94772 22 3.5V6.5C22 7.05228 21.5523 7.5 21 7.5H18C17.4477 7.5 17 7.05228 17 6.5V3.5C17 2.94772 17.4477 2.5 18 2.5ZM3 17.5H6C6.55228 17.5 7 17.9477 7 18.5V21.5C7 22.0523 6.55228 22.5 6 22.5H3C2.44772 22.5 2 22.0523 2 21.5V18.5C2 17.9477 2.44772 17.5 3 17.5ZM3 2.5H6C6.55228 2.5 7 2.94772 7 3.5V6.5C7 7.05228 6.55228 7.5 6 7.5H3C2.44772 7.5 2 7.05228 2 6.5V3.5C2 2.94772 2.44772 2.5 3 2.5Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            Graphics Design
          </p>
        </div>
      </ServiceHero>
      {/* Our Strategy Section */}
      <div className="py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-5.25 md:space-y-8">
          <SectionHeader title="Our Strategy" description="Our Process" />

          {/* Animated List Component */}
          <AnimatedList
            items={graphicsSteps.map((step) => ({
              id: step.number,
              icon: step.number,
              title: step.title,
              description: step.description,
            }))}
            showBorders={false}
          />
        </div>
      </div>

      {/* Works Section */}
      {projects.length > 0 && (
      <div className="bg-background container mx-auto px-4 md:px-8 space-y-1.75 md:space-y-20 py-4 md:py-12.5">
        <SectionHeader title="Select projects" description="Work" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-[6.3125rem] md:gap-y-20">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-[6.3125rem] md:gap-y-20">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                image={project.image}
                categories={[project.category]}
                title={project.title}
                description={project.description}
              />
            ))}
          </div>
        )}
        </div>
      )}

      {/* Graphics Pricing Section */}
      <DynamicPricingSection
        serviceName="Graphics Design"
        serviceTitle="Graphics Design"
      />
    </section>
  );
};

export default Graphics;
