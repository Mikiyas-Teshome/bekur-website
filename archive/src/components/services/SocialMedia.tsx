"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "../homePage/SectionHeader";
import socialMediaStepsData from "../../data/socialMediaSteps.json";
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

const SocialMedia = () => {
  const { socialMediaSteps } = socialMediaStepsData;
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects");
        if (response.ok) {
          const data = await response.json();
          // Filter projects by social media category
          const socialMediaProjects = data.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (project: any) =>
              project.category === "Digital Marketing" ||
              project.category === "Social Media"
          );
          setProjects(socialMediaProjects);
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
    <section className="bg-background  py-3 md:py-8 space-y-3 md:space-y-8">
      <ServiceHero title="We Don't Just Post. We Perform.">
        <div className="flex bg-secondary dark:bg-gradient-to-r dark:from-white/80 dark:to-white/20  items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 2.5C14.4401 2.49965 16.3385 3.06368 17.9637 4.12336C19.5889 5.18303 20.8707 6.69259 21.653 8.46804C22.4352 10.2435 22.6841 12.2082 22.3693 14.1226C22.0545 16.037 21.1896 17.8185 19.88 19.25M12.5 8.5V16.5M16.5 12.5H8.5M3 9.375C2.68135 10.3437 2.51273 11.3554 2.5 12.375M3.33 16.5C3.8915 17.7918 4.71958 18.9505 5.76 19.9M5.136 5.735C5.41504 5.43123 5.71261 5.14502 6.027 4.878M9.144 21.92C11.6377 22.8084 14.3819 22.6717 16.775 21.54"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            Social Media Management
          </p>
        </div>
      </ServiceHero>
      {/* Our Strategy Section */}
      <div className="py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-5.25 md:space-y-8">
          <SectionHeader title="Our Strategy" description="Our Process" />

          {/* Animated List Component */}
          <AnimatedList
            items={socialMediaSteps.map((step) => ({
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
                id={project.id}
                key={project.id}
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

      {/* Social Media Management Pricing Section */}
      <DynamicPricingSection
        serviceName="Social Media Management"
        serviceTitle="Social Media Management"
      />
    </section>
  );
};

export default SocialMedia;
