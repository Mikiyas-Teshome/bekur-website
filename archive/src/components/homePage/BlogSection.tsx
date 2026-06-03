"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import getBlogsData from "../blogApi/blogs";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import SectionHeader from "./SectionHeader";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "../BlogCardSkeleton";

const BlogSection = ({ type }: { type?: string }) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogsData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const blogData = data?.homePageBlogs || [];

  const handleBlogClick = (id: number) => {
    router.push(`/blog/${id}`);
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleViewAll = () => router.push("/blog");

  const handlePrevious = () => api?.scrollPrev();
  const handleNext = () => api?.scrollNext();
  const canScrollPrev = api?.canScrollPrev() ?? false;
  const canScrollNext = api?.canScrollNext() ?? false;

  return (
    <section className="flex flex-col container mx-auto px-4 py-15 space-y-5 md:space-y-10 lg:space-y-12">
      {type !== "blog" && (
        <div className="flex flex-row justify-between items-center space-y-0 lg:space-y-5 md:space-y-0">
          <SectionHeader title="Our Blogs" description="Blog" />
          <div className="flex items-center justify-center">
            <Button
              onClick={handleViewAll}
              className="bg-transparent border border-primary dark:border-foreground text-primary dark:text-foreground sm:text-sm md:text-base lg:text-[1.375rem] leading-5.5 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 md:py-6  rounded-[0.625rem] hover:bg-transparent cursor-pointer"
            >
              View All
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center">Failed to load blogs</div>
      ) : blogData.length === 0 ? (
        <div className="py-12 text-center">No blogs available</div>
      ) : type === "blog" ? (
        // ✅ Show all blogs (grid view)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {blogData.map((blog: any) => (
            <div key={blog.id} className=" my-4">
              <BlogCard
                id={blog.id}
                blogUrl={blog.blogUrl}
                tag={blog.tag}
                headline={blog.headline}
                subtitle={blog.subtitle}
                author={typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Unknown'}
                authorImage={typeof blog.author === 'string' ? blog.authorImage : blog.author?.image}
                date={blog.date}
                onClick={() => handleBlogClick(blog.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        // ✅ Default = carousel
        <div className=" space-y-0  md:space-y-8">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ align: "start", loop: false }}
          >
            <CarouselContent className="-ml-2 md:-ml-4 ">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {blogData.map((blog: any) => (
                <CarouselItem
                  key={blog.id}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <BlogCard
                    id={blog.id}
                    blogUrl={blog.blogUrl}
                    tag={blog.tag}
                    headline={blog.headline}
                    subtitle={blog.subtitle}
                    author={typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Unknown'}
                    authorImage={typeof blog.author === 'string' ? blog.authorImage : blog.author?.image}
                    date={blog.date}
                    onClick={() => handleBlogClick(blog.id)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center items-center space-x-4 mt-2.5">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-[#214A9C] dark:bg-[#214A9C] text-white hover:bg-[#214A9C] cursor-pointer"
              onClick={handlePrevious}
              disabled={!canScrollPrev}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex space-x-2">
              {Array.from({ length: 3 }, (_, index) => {
                // const totalPages = Math.ceil(count / 4); // Assuming 4 items per page
                const currentPage = Math.ceil(current / 4);
                const isActive = index === (currentPage - 1) % 3;

                return (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-gray-300"
                      }`}
                    onClick={() => {
                      const targetIndex = index * 4; // Jump to the start of each "page"
                      api?.scrollTo(Math.min(targetIndex, count - 1));
                    }}
                  />
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-[#214A9C] dark:bg-[#214A9C] text-white hover:bg-[#214A9C] cursor-pointer"
              onClick={handleNext}
              disabled={!canScrollNext}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
