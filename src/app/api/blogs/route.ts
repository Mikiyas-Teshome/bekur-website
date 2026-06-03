import {  NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { BlogPost } from "@/lib/entities/BlogPost";
import { safeTiptapToHtml } from "@/lib/tiptapToHtml";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    
    if (!dataSource || !dataSource.isInitialized) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const blogRepository = dataSource.getRepository(BlogPost);

    const blogs = await blogRepository.find({
      where: { isPublished: true },
      order: { createdAt: "DESC" },
    });


    // Transform for frontend to match expected format
    const homePageBlogs = blogs.map((blog) => {
      // Convert TipTap content to HTML for subtitle if needed
      let subtitle = blog.excerpt || "";
      if (!subtitle && blog.content) {
        const htmlContent = safeTiptapToHtml(blog.content);
        // Extract text content from HTML for subtitle (first 150 chars)
        const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
        subtitle = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
      }
      
      return {
        id: blog.id,
        slug: blog.slug,
        blogUrl: blog.featuredImage || "",
        tag: blog.tags?.[0] || "Uncategorized",
        headline: blog.title,
        subtitle: subtitle,
        author: "Bekur Team",
        authorImage: "/assets/logo/logo.svg",
        date: new Date(blog.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        tags: blog.tags || [],
      };
    });

    // Grouping example
    const blogGroups = [
      {
        groupTitle: "Latest Blogs",
        groupDescription: "Our latest insights and updates",
        featured: homePageBlogs[0] || null,
        regular: homePageBlogs.slice(1),
      },
    ];

    return NextResponse.json({ homePageBlogs, blogGroups });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
