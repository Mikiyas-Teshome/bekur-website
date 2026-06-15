"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import getBlogsData from "../blogApi/blogs";
import BlogCard from "./BlogCard";
import BlogCardSkeleton from "../BlogCardSkeleton";
import { cn } from "@/lib/utils";
import { ease, fadeUp, headerContainer } from "@/components/mvp-clone/motion";

type BlogListItem = {
  id: number;
  blogUrl: string;
  tag: string;
  headline: string;
  subtitle: string;
  author: string | { name?: string };
  authorImage?: string | null;
  date: string;
};

export default function BlogSection() {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogsData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const blogData = (data?.homePageBlogs || []) as BlogListItem[];

  const handleBlogClick = (id: number) => {
    router.push(`/blog/${id}`);
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const canScrollPrev = api?.canScrollPrev() ?? false;
  const canScrollNext = api?.canScrollNext() ?? false;

  return (
    <section
      className="relative w-full overflow-hidden bg-muted/30 px-4 py-20 dark:bg-background md:px-8 md:py-28 lg:py-32"
      aria-label="Insights"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.07),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.14),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={headerContainer}
          className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center md:mb-12 lg:mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            Insights
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            Operator insights
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              for running a practice.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px] md:leading-[1.65]"
          >
            Logic-first takes on automation, AI spend caps, and reclaiming partner hours — written
            for managing partners, not IT departments.
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="py-12 text-center text-muted-foreground">Failed to load insights.</p>
        ) : blogData.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No posts available yet.</p>
        ) : (
          <>
            <Carousel setApi={setApi} className="w-full" opts={{ align: "start", loop: false }}>
              <CarouselContent className="-ml-4 md:-ml-6">
                {blogData.map((blog) => (
                  <CarouselItem
                    key={blog.id}
                    className="basis-full pl-4 sm:basis-1/2 md:pl-6 lg:basis-1/3 xl:basis-1/4"
                  >
                    <BlogCard
                      id={blog.id}
                      blogUrl={blog.blogUrl}
                      tag={blog.tag}
                      headline={blog.headline}
                      subtitle={blog.subtitle}
                      author={
                        typeof blog.author === "string" ? blog.author : blog.author?.name || "Bekur Team"
                      }
                      authorImage={blog.authorImage}
                      date={blog.date}
                      onClick={() => handleBlogClick(blog.id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  disabled={!canScrollPrev}
                  aria-label="Previous posts"
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition-all hover:border-primary/30 hover:bg-card/90 disabled:opacity-40",
                  )}
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(3, count) }, (_, index) => {
                    const slidesPerPage = Math.max(1, Math.ceil(count / 3));
                    const currentPage = Math.ceil(current / slidesPerPage);
                    const isActive = index === (currentPage - 1) % 3;

                    return (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to page ${index + 1}`}
                        className={cn(
                          "h-2 w-2 rounded-full transition-colors",
                          isActive ? "bg-primary dark:bg-chart-3" : "bg-border",
                        )}
                        onClick={() => {
                          const targetIndex = index * slidesPerPage;
                          api?.scrollTo(Math.min(targetIndex, Math.max(0, count - 1)));
                        }}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  disabled={!canScrollNext}
                  aria-label="Next posts"
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card text-foreground transition-all hover:border-primary/30 hover:bg-card/90 disabled:opacity-40",
                  )}
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 rounded-[12px] border border-border/80 bg-card/80 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card"
              >
                View all posts
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
