"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "../homePage/SectionHeader";
import websiteData from "../../data/website.json";
import DynamicPricingSection from "../pricing/DynamicPricingSection";
import AnimatedList from "../ui/AnimatedList";
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

const WebsiteDev = () => {
  const websiteSteps = websiteData;
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects");
        if (response.ok) {
          const data = await response.json();
          // Filter projects by web development category
          const webProjects = data.filter(
            (project: { category: string }) =>
              project.category === "Web Development" || project.category === "Website Development"
          );
          setProjects(webProjects);
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
      <ServiceHero title="We build your website that build your website">
        <div className="flex bg-secondary dark:bg-gradient-to-r dark:from-white/80 dark:to-white/20 items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 9.5L7 12.5L10 15.5M14 15.5L17 12.5L14 9.5M5 3.5H19C20.1046 3.5 21 4.39543 21 5.5V19.5C21 20.6046 20.1046 21.5 19 21.5H5C3.89543 21.5 3 20.6046 3 19.5V5.5C3 4.39543 3.89543 3.5 5 3.5Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-primary dark:text-white text-sm md:text-xl leading-[150%]">
            Website Development
          </p>
        </div>
      </ServiceHero>
      {/* Our Strategy Section */}
      <div className="py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-5.25 md:space-y-8">
          <SectionHeader title="Our Strategy" description="Our Process" />

          {/* Animated List Component */}
          <AnimatedList
            items={websiteSteps.map((step) => ({
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
        <SectionHeader title="Selected projects" description="Work" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto gap-4 md:gap-x-[6.3125rem] md:gap-y-20">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto gap-4 md:gap-x-[6.3125rem] md:gap-y-20">
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

      {/* Website Development Pricing Section */}
      <DynamicPricingSection
        serviceName="Website Development"
        serviceTitle="Website Development"
      />
    </section>
  );
};

export default WebsiteDev;
