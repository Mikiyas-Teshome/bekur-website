'use client'

import type React from "react";
import { useQuery } from "@tanstack/react-query";
import getBlogsData from "../blogApi/blogs";
import SectionHeader from "../homePage/SectionHeader";
import BlogSection from "../homePage/BlogSection";
import BlogCardSkeleton from "../BlogCardSkeleton";

const BlogLayout: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogsData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const blogData = data?.homePageBlogs || [];

  return (
    <div>
      {/* ✅ Always show header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <SectionHeader title="Our blog" description="blog" />
      </div>

      {/* ✅ Conditional states handled inside return */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-24">
          {Array.from({ length: 4 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12 text-lg font-medium">
          Failed to load blogs, showing fallback data
        </div>
      ) : blogData.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-lg font-medium">
          No blogs available.
        </div>
      ) : (
        <BlogSection type="blog" />
      )}
    </div>
  );
};

export default BlogLayout;
