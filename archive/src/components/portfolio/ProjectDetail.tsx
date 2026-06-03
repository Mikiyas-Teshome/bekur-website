"use client";
import Image from "next/image";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Calendar } from "lucide-react";
import { useMemo } from "react";
import ProjectCard from "@/components/homePage/ProjectCard";
import { useQuery } from "@tanstack/react-query";
import getProjectsData from "@/components/projectApi/projects";

interface ProjectDetailProps {
  title: string;
  date: string;
  image?: string;
  categories: string[];
  contentHtml: string;
  onShare?: () => void;
}

export default function ProjectDetail({ title, date, image, categories, contentHtml, onShare }: ProjectDetailProps) {
  const sanitized = useMemo(() => sanitizeHtml(contentHtml), [contentHtml]);

  const readingTime = useMemo(() => {
    const text = contentHtml.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
  }, [contentHtml]);

  const handleShare = () => {
    if (onShare) return onShare();
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <article className="container mx-auto px-4">
      {/* Hero */}
      <header className="space-y-6 pt-8 pb-6">
        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c} variant="secondary">{c}</Badge>
            ))}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{date}</div>
          <div>· {readingTime} min read</div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </header>

      {image && (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <section className="prose max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-img:rounded-xl prose-a:text-primary">
        <div className="table-wrapper">
          <div dangerouslySetInnerHTML={{ __html: sanitized }} />
        </div>
      </section>

      {/* Related projects */}
      {/* <RelatedProjects categories={categories} onClickProject={(id) => router.push(`/portfolio/${id}`)} /> */}
    </article>
  );
}

export function RelatedProjects({ categories, onClickProject }: { categories: string[]; onClickProject: (id: number) => void }) {
  const { data } = useQuery({ queryKey: ["projects"], queryFn: getProjectsData, staleTime: 1000 * 60 * 5 });
  const all = (data?.homePageProjects || []) as { id: number; projectUrl: string; headline: string; subtitle: string; categories?: string[] }[];
  const normalizedCats = new Set(categories.map((c) => c.toLowerCase()));
  const related = all.filter((p) => (p.categories || []).some((c: string) => normalizedCats.has(c.toLowerCase()))).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold">Related projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            image={project.projectUrl}
            categories={project.categories || []}
            title={project.headline}
            description={project.subtitle}
            onClick={() => onClickProject(project.id)}
          />
        ))}
      </div>
    </section>
  );
}


