"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { safeTiptapToHtml } from "@/lib/tiptapToHtml";
import { useFooterAnimationRefresh } from "@/hooks/useFooterAnimationRefresh";
import "@/styles/blog-content.css";

interface ProjectData {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: Record<string, unknown>;
  html: string;
  gallery: string[];
  image: string | null;
  category: string | null;
  tags: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Project not found");
          } else {
            setError("Failed to load project");
          }
          return;
        }

        const projectData = await response.json();
        setProject(projectData);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  useFooterAnimationRefresh(loading, project?.id);

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-10 w-32 mb-6" />
              <Skeleton className="h-12 w-full mb-4" />
              <div className="flex items-center space-x-4 mb-6">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>

            {/* Image Skeleton */}
            <Skeleton className="h-64 w-full mb-8 rounded-lg" />

            {/* Content Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Project not found"}
          </h1>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-8 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>

          {/* Project Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {project.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground dark:text-foreground/90">
              {project.category && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm">{project.category}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(project.publishedAt)}</span>
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div className="text-lg text-muted-foreground dark:text-foreground/90 leading-relaxed mb-8">
                {project.description}
              </div>
            )}
          </header>

          {/* Featured Image or Gallery */}
          {(project.image || (project.gallery && project.gallery.length > 0)) && (
            <div className="mb-8">
              <Image
                src={project.image || project.gallery[0]}
                alt={project.title}
                width={800}
                height={600}
                className="w-full object-cover rounded-lg"
                priority
              />
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 1 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery.map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Content */}
          <article className="prose prose-lg max-w-none">
            {(() => {
              // Try to get HTML content, converting from TipTap if needed
              let htmlContent = project.html;
              
              // If no HTML or HTML is empty, try to convert from TipTap content
              if (!htmlContent && project.content) {
                htmlContent = safeTiptapToHtml(project.content);
              }
              
              if (htmlContent) {
                return (
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                );
              } else {
                return (
                  <p className="text-muted-foreground italic">
                    No content available for this project.
                  </p>
                );
              }
            })()}
          </article>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center gap-2 text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Portfolio Project</span>
              </div> */}
              <div className="text-sm text-muted-foreground dark:text-foreground/90">
                Last updated: {formatDate(project.updatedAt)}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}