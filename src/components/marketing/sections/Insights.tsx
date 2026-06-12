"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionShell from "../ui/SectionShell";
import SectionHeading from "../ui/SectionHeading";
import getBlogsData from "@/components/blogApi/blogs";
import { fadeUp, stagger, VIEWPORT } from "../motion/motion";

type BlogListItem = {
  id: number;
  tag: string;
  headline: string;
  subtitle: string;
  date: string;
};

/**
 * Honesty gate: this section renders nothing until at least two real
 * articles are published. No skeleton, no reserved space.
 */
export default function Insights() {
  const { data } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogsData,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const posts = ((data?.homePageBlogs || []) as BlogListItem[]).slice(0, 3);
  if (posts.length < 2) return null;

  return (
    <SectionShell id="insights">
      <SectionHeading
        kicker="Insights"
        title={
          <>
            Operator insights{" "}
            <span className="text-mk-text-2">for running a practice.</span>
          </>
        }
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <motion.article key={post.id} variants={fadeUp}>
            <Link
              href={`/blog/${post.id}`}
              className="group flex h-full flex-col rounded-2xl border border-mk-border bg-mk-surface-1 p-6 transition-colors hover:border-mk-border-strong"
            >
              <span className="w-fit rounded-full border border-mk-border px-3 py-1 font-mono-mk text-[10px] uppercase tracking-[0.12em] text-mk-text-3">
                {post.tag}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-mk-text-1">
                {post.headline}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mk-text-2 line-clamp-3">
                {post.subtitle}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-mk-accent">
                Read
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}
