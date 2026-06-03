import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { PortfolioProject } from "@/lib/entities/PortfolioProject";
import { safeTiptapToHtml } from "@/lib/tiptapToHtml";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const param = resolvedParams.id;
    const projectId = parseInt(param, 10);

    const dataSource = await getDataSource();
    const projectRepository = dataSource.getRepository(PortfolioProject);

    const project = await projectRepository.findOne({
      where: Number.isNaN(projectId)
        ? { slug: param, isPublished: true }
        : { id: projectId, isPublished: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Convert TipTap content to HTML if needed
    let htmlContent = project.html;
    if (!htmlContent && project.content) {
      htmlContent = safeTiptapToHtml(project.content);
    }

    // Transform for frontend
    const projectData = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      html: htmlContent,
      gallery: project.gallery || [],
      image: project.image,
      category: project.category,
      tags: project.tags || [],
      publishedAt: project.publishedAt,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    return NextResponse.json(projectData);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
