"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { safeTiptapToHtml } from "@/lib/tiptapToHtml";
import { useFooterAnimationRefresh } from "@/hooks/useFooterAnimationRefresh";
import "@/styles/blog-content.css";

interface BlogData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>;
  html: string;
  featuredImage: string | null;
  tags: string[];
  author: string;
  authorImage: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Blog not found");
          } else {
            setError("Failed to load blog");
          }
          return;
        }

        const blogData = await response.json();
        setBlog(blogData);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  useFooterAnimationRefresh(loading, blog?.id);

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
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Blog not found"}
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
            Back to Blogs
          </Button>

          {/* Blog Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm dark:text-foreground/90">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2 dark:text-foreground/90">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(blog.publishedAt)}</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 text-xs dark:bg-accent"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="text-lg text-foreground/90 leading-relaxed mb-8">
                {blog.excerpt}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-8">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                width={800}
                height={600}
                className="w-full object-cover rounded-lg"
                priority
              />
            </div>
          )}

          {/* Blog Content */}
          <article className="prose prose-lg max-w-none">
            {(() => {
              // Try to get HTML content, converting from TipTap if needed
              let htmlContent = blog.html;

              // If no HTML or HTML is empty, try to convert from TipTap content
              if (!htmlContent && blog.content) {
                htmlContent = safeTiptapToHtml(blog.content);
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
                    No content available for this blog post.
                  </p>
                );
              }
            })()}
          </article>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground dark:text-foreground/90">
                <User className="h-4 w-4" />
                <span className="text-sm">Written by {blog.author}</span>
              </div>
              <div className="text-sm text-muted-foreground dark:text-foreground/90">
                Last updated: {formatDate(blog.updatedAt)}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}