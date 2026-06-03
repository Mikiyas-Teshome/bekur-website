"use client";
import React, { useRef } from "react";
// import { dmSans5 } from "@/app/fonts";
import { Button } from "../ui/button";
import ProjectCard from "./ProjectCard";
import SectionHeader from "./SectionHeader";
import { useRouter } from "next/navigation";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import getProjectsData from "../projectApi/projects";

const ProjectSection = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const projects = data?.homePageProjects || []; // Featured projects (max 4 from API)

  const handleProjectClick = (id: number) => {
    router.push(`/portfolio/${id}`);
  };

  const handleViewClick = () => {
    router.push("/portfolio");
  };

  return (
    <section ref={sectionRef} className="pt-15.5">
      <div className="container mx-auto px-4 space-y-2 md:space-y-20">
        {/* Section Header */}
        <div ref={headerRef}>
          <SectionHeader
            title="Selected projects"
            description="Work"
          />
        </div>

        {/* Projects Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-[6.3125rem] md:gap-y-20">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[610/406] rounded-3xl bg-gray-300 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">Failed to load projects</div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center">No projects available</div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-[6.3125rem] md:gap-y-20">
              {projects.map((project: { id: number; projectUrl: string; categories?: string[]; headline: string; subtitle: string }) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  image={project.projectUrl}
                  categories={project.categories || []}
                  title={project.headline}
                  description={project.subtitle}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
            <div ref={buttonRef} className="flex justify-end mt-6 md:mt-8">
              <Button
                onClick={handleViewClick}
                className="bg-transparent border border-primary dark:border-foreground text-primary dark:text-foreground sm:text-sm md:text-base lg:text-[1.375rem] leading-5.5 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 md:py-6  rounded-[0.625rem] hover:bg-transparent cursor-pointer"
              >
                View All
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
