import {  NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { PortfolioProject } from "@/lib/entities/PortfolioProject";
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

    const projectRepository = dataSource.getRepository(PortfolioProject);

    // Fetch featured projects for homepage (max 4)
    const featuredProjects = await projectRepository.find({
      where: { isPublished: true, featured: true },
      order: { createdAt: "DESC" },
      take: 4,
    });

    // Fetch all published projects for portfolio page
    const allProjects = await projectRepository.find({
      where: { isPublished: true },
      order: { createdAt: "DESC" },
    });

    // Transform featured projects for homepage
    const homePageProjects = featuredProjects.map((project) => {
      // Convert TipTap content to HTML for subtitle if needed
      let subtitle = project.description || "";
      if (!subtitle && project.content) {
        const htmlContent = safeTiptapToHtml(project.content);
        // Extract text content from HTML for subtitle (first 150 chars)
        const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
        subtitle = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
      }
      
      return {
        id: project.id,
        projectUrl: project.gallery?.[0] || project.image || "",
        tag: project.tags?.[0] || project.category || "Project",
        headline: project.title,
        subtitle: subtitle,
        author: "Bekur Team",
        authorImage: "/assets/logo/logo.svg",
        date: new Date(project.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        tags: project.tags || [],
        categories: project.tags || [project.category || "General"],
        description: project.description,
        content: project.content || "",
        link: `/portfolio/${project.id}`,
      };
    });

    // Transform all projects for portfolio page
    const portfolioProjects = allProjects.map((project) => {
      // Convert TipTap content to HTML for subtitle if needed
      let subtitle = project.description || "";
      if (!subtitle && project.content) {
        const htmlContent = safeTiptapToHtml(project.content);
        // Extract text content from HTML for subtitle (first 150 chars)
        const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
        subtitle = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
      }
      
      return {
        id: project.id,
        projectUrl: project.gallery?.[0] || project.image || "",
        tag: project.tags?.[0] || project.category || "Project",
        headline: project.title,
        subtitle: subtitle,
        author: "Bekur Team",
        authorImage: "/assets/logo/logo.svg",
        date: new Date(project.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        tags: project.tags || [],
        categories: project.tags || [project.category || "General"],
        description: project.description,
        content: project.content || "",
        link: `/portfolio/${project.id}`,
      };
    });

    // Grouping example
    const projectGroups = [
      {
        groupTitle: "Latest Projects",
        groupDescription: "Our latest work and achievements",
        featured: homePageProjects[0] || null,
        regular: homePageProjects.slice(1),
      },
    ];

    // Return featured projects for homepage (limited to 4) and all projects for portfolio page
    return NextResponse.json({ 
      homePageProjects, // Featured projects for homepage (max 4)
      allProjects: portfolioProjects, // All projects for portfolio page
      projectGroups 
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
