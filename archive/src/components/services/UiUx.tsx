"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "../homePage/SectionHeader";
import uiUxData from "../../data/uiUx.json";
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

const UiUx = () => {
  const uiUxSteps = uiUxData;
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects");
        if (response.ok) {
          const data = await response.json();
          // Filter projects by UI/UX category
          const uiUxProjects = data.filter(
            (project: { category: string }) =>
              project.category === "UI/UX Design" ||
              project.category === "UI-UX" || project.category === "UI-UX Design"
          );
          setProjects(uiUxProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
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
      <ServiceHero title="Designs That Feel Right and Work Brilliantly">
        <div className="flex bg-secondary dark:bg-gradient-to-r dark:from-white/80 dark:to-white/20 items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.5 13.5L17.125 6.62601C17.0876 6.43899 16.9975 6.26656 16.8653 6.12907C16.7331 5.99157 16.5644 5.89475 16.379 5.85001L3.73501 2.52801C3.56843 2.48773 3.39431 2.49094 3.22933 2.53733C3.06436 2.58371 2.91407 2.67172 2.79289 2.79289C2.67172 2.91407 2.58371 3.06436 2.53733 3.22933C2.49094 3.39431 2.48773 3.56843 2.52801 3.73501L5.85001 16.379C5.89475 16.5644 5.99157 16.7331 6.12907 16.8653C6.26656 16.9975 6.43899 17.0876 6.62601 17.125L13.5 18.5M2.80001 2.80001L10.086 10.086M16.207 21.793C16.0195 21.9805 15.7652 22.0858 15.5 22.0858C15.2348 22.0858 14.9805 21.9805 14.793 21.793L13.207 20.207C13.0195 20.0195 12.9142 19.7652 12.9142 19.5C12.9142 19.2348 13.0195 18.9805 13.207 18.793L18.793 13.207C18.9805 13.0195 19.2348 12.9142 19.5 12.9142C19.7652 12.9142 20.0195 13.0195 20.207 13.207L21.793 14.793C21.9805 14.9805 22.0858 15.2348 22.0858 15.5C22.0858 15.7652 21.9805 16.0195 21.793 16.207L16.207 21.793ZM13.5 11.5C13.5 12.6046 12.6046 13.5 11.5 13.5C10.3954 13.5 9.50001 12.6046 9.50001 11.5C9.50001 10.3954 10.3954 9.50001 11.5 9.50001C12.6046 9.50001 13.5 10.3954 13.5 11.5Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            UI/UX Design
          </p>
        </div>
      </ServiceHero>
      {/* Our Strategy Section */}
      <div className="py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-5.25 md:space-y-8">
          <SectionHeader title="Our Strategy" description="Our Process" />

          {/* Animated List Component */}
          <AnimatedList
            items={uiUxSteps.map((step) => ({
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

      {/* UI/UX Design Pricing Section */}
      <DynamicPricingSection
        serviceName="UI-UX"
        serviceTitle="UI/UX Design"
      />
    </section>
  );
};

export default UiUx;
