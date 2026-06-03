"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import getBlogsData from "../blogApi/blogs";
import BlogCard from "../homePage/BlogCard";
import BlogCardSkeleton from "../BlogCardSkeleton";
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

export default function BlogLayout() {
  const router = useRouter();
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

  return (
    <section
      className="relative w-full overflow-hidden bg-muted/30 dark:bg-background"
      aria-label="Blog"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.07),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(33,74,156,0.14),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28 lg:pt-32 lg:pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerContainer}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-14 lg:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="mb-5 inline-flex rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
          >
            Blog
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mb-5 text-[1.85rem] font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-[2.65rem]"
          >
            Operator insights
            <br />
            <span className="bg-[linear-gradient(-121deg,#214a9c_0%,#4a90e2_52%,#7bb3f0_100%)] bg-clip-text text-transparent dark:bg-[linear-gradient(-121deg,#a8d1f5_0%,#4a90e2_48%,#214a9c_100%)]">
              for running a practice.
            </span>
          </motion.h1>

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
            {Array.from({ length: 8 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="py-16 text-center text-muted-foreground">Failed to load blogs. Please try again.</p>
        ) : blogData.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No blogs available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogData.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.6, ease }}
              >
                <BlogCard
                  id={blog.id}
                  blogUrl={blog.blogUrl}
                  tag={blog.tag}
                  headline={blog.headline}
                  subtitle={blog.subtitle}
                  author={typeof blog.author === "string" ? blog.author : blog.author?.name || "Bekur Team"}
                  authorImage={blog.authorImage}
                  date={blog.date}
                  onClick={() => handleBlogClick(blog.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
