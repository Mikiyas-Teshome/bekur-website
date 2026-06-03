
"use client";
import React, { useState, useMemo } from "react";
import SectionHeader from "../homePage/SectionHeader";
import WorkCard from "../services/WorkCard";
import ServiceHero from "../services/ServiceHero";
import { useQuery } from "@tanstack/react-query";
import getProjectsData from "../projectApi/projects";
import { useRouter } from "next/navigation";
import { useFooterAnimationRefresh } from "@/hooks/useFooterAnimationRefresh";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Portfolio = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const projectData = data?.allProjects || [];

  // Extract unique categories from all projects
  const allCategories = useMemo(() => {
    return Array.from(
      new Set(
        projectData.flatMap(
          (project: { categories?: string[] }) => project.categories || []
        )
      )
    ) as string[];
  }, [projectData]);

  const filterOptions = useMemo(
    () => [
      {
        label: "All",
        value: "all",
      },
      ...allCategories.map((category: string) => ({
        label: category,
        value: category.toLowerCase().replace(/\s+/g, "-"),
      })),
    ],
    [allCategories]
  );

  const handleProjectClick = (id: number) => {
    router.push(`/portfolio/${id}`);
  };

  const worksToShow = useMemo(() => {
    if (selectedFilter === "all") {
      return projectData;
    }
    return projectData.filter((project: { categories?: string[] }) => {
      if (!project.categories || project.categories.length === 0) return false;
      return project.categories.some((cat: string) => {
        const categorySlug = cat.toLowerCase().replace(/\s+/g, "-");
        return categorySlug === selectedFilter;
      });
    });
  }, [projectData, selectedFilter]);

  useFooterAnimationRefresh(isLoading, worksToShow.length, selectedFilter);

  return (
    <section>
      <ServiceHero title="Innovating Solutions For The Digital Future">
        <div className="flex bg-secondary dark:bg-gradient-to-r dark:from-white/80 dark:to-white/20 items-center justify-center rounded-[0.9375rem] py-1.25 px-9.5 space-x-8.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-briefcase-business-icon lucide-briefcase-business"
          >
            <path d="M12 12h.01" />
            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <path d="M22 13a18.15 18.15 0 0 1-20 0" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
          </svg>
          <p className="text-primary dark:text-foreground text-sm md:text-xl leading-[150%]">
            Portfolio
          </p>
        </div>
      </ServiceHero>

      <div className="container mx-auto px-4 py-4 md:py-8 space-y-5.25 md:space-y-8">
        <div>
          <div className="flex justify-between items-center">
            <SectionHeader title="Works" description="" />

            {/* Filter: Dropdown for small/medium screens */}
            <div className="lg:hidden mb-4">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-[200px] border border-[#6A7374]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter: Horizontal buttons for large screens */}
          <div className="hidden lg:flex flex-wrap space-x-1 items-center space-y-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className="cursor-pointer flex justify-center items-center"
                onClick={() => setSelectedFilter(option.value)}
              >
                <span
                  className={`${
                    selectedFilter === option.value
                      ? "w-fit px-2 sm:px-4 py-1 sm:py-2 flex justify-center items-center text-sm sm:text-base md:text-lg text-white bg-primary rounded-md"
                      : "bg-transparent text-base sm:text-lg md:text-xl w-fit px-2 sm:px-4 py-1 sm:py-2 border-none"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List of portfolio items */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-11 justify-items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-[454px] rounded-[28px] bg-gray-300 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">Failed to load projects</div>
        ) : worksToShow.length === 0 ? (
          <div className="py-12 text-center">No projects available</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-11 justify-items-center">
            {worksToShow.map(
              (work: {
                id: number;
                projectUrl: string;
                headline: string;
                subtitle: string;
                categories?: string[];
              }) => (
                <WorkCard
                  key={work.id}
                  id={work.id}
                  image={work.projectUrl}
                  title={work.headline}
                  description={work.subtitle}
                  category={work.categories?.[0] || "Project"}
                  onClick={() => handleProjectClick(work.id)}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;