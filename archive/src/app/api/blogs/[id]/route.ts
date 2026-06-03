import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { BlogPost } from "@/lib/entities/BlogPost";
import { safeTiptapToHtml } from "@/lib/tiptapToHtml";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const blogId = parseInt(resolvedParams.id);

    if (isNaN(blogId)) {
      return NextResponse.json(
        { error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const blogRepository = dataSource.getRepository(BlogPost);

    const blog = await blogRepository.findOne({
      where: { 
        id: blogId,
        isPublished: true 
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Convert TipTap content to HTML if needed
    let htmlContent = blog.html;
    if (!htmlContent && blog.content) {
      htmlContent = safeTiptapToHtml(blog.content);
    }

    // Transform for frontend
    const blogData = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      html: htmlContent,
      featuredImage: blog.featuredImage,
      tags: blog.tags || [],
      author: "Bekur Team",
      authorImage: "/assets/logo/logo.svg",
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };

    return NextResponse.json(blogData);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
