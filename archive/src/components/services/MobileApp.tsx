"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "../homePage/SectionHeader";
import mobileData from "../../data/mobile.json";
import AnimatedList from "../ui/AnimatedList";
import DynamicPricingSection from "../pricing/DynamicPricingSection";
import ServiceHero from "./ServiceHero";
import ProjectCard from "../homePage/ProjectCard";
import ProjectCardSkeleton from "../ProjectCardSkeleton";
import { useTheme } from "next-themes";

interface Project {
  id: number;
  image: string;
  title: string;
  description: string;
  category: string;
}

const MobileApp = () => {
  const mobileSteps = mobileData;
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects");
        if (response.ok) {
          const data = await response.json();
          // Filter projects by mobile category
          const mobileProjects = data.filter(
            (project: { category: string }) =>
              project.category === "Mobile App Development" || project.category === "Desktop App Development"
          );
          setProjects(mobileProjects);
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
      <ServiceHero title="Build Once. Access Anywhere.">
        <div className="flex bg-secondary dark:bg-gradient-to-r dark:from-white/80 dark:to-white/20 items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 4.5C5 3.96957 5.21071 3.46086 5.58579 3.08579C5.96086 2.71071 6.46957 2.5 7 2.5H19C19.5304 2.5 20.0391 2.71071 20.4142 3.08579C20.7893 3.46086 21 3.96957 21 4.5V20.5C21 21.0304 20.7893 21.5391 20.4142 21.9142C20.0391 22.2893 19.5304 22.5 19 22.5H16.6M8 18.5H8.01M5 8.5H11C12.1046 8.5 13 9.39543 13 10.5V20.5C13 21.6046 12.1046 22.5 11 22.5H5C3.89543 22.5 3 21.6046 3 20.5V10.5C3 9.39543 3.89543 8.5 5 8.5Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            App Development
          </p>
        </div>
      </ServiceHero>
      {/* Our Strategy Section */}
      <div className="py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-5.25 md:space-y-8">
          <SectionHeader title="Our Strategy" description="Our Process" />

          {/* Animated List Component */}
          <AnimatedList
            items={mobileSteps.map((step) => ({
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

      {/* App Development Pricing Section */}
      <DynamicPricingSection
        serviceName="App Development"
        serviceTitle="App Development"
      />
    </section>
  );
};

export default MobileApp;
