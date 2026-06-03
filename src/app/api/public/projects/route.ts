import { NextResponse } from "next/server";
import { getDataSource, resetDataSource } from "@/lib/db";
import { PortfolioProject } from "@/lib/entities/PortfolioProject";

export async function GET() {
  let retryCount = 0;
  const maxRetries = 2;

  while (retryCount <= maxRetries) {
    try {
      const dataSource = await getDataSource();

      // Check if dataSource is null after potential reset
      if (!dataSource) {
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        );
      }

      const projectRepository = dataSource.getRepository(PortfolioProject);

      const projects = await projectRepository.find({
        where: { isPublished: true },
        order: { createdAt: "DESC" },
      });

      // Transform to match expected format
      const formattedProjects = projects.map((project) => ({
        id: project.id,
        image: project.gallery?.[0] || project.image || "",
        title: project.title,
        description: project.description,
        category: project.tags?.[0] || project.category || "General",
      }));

      return NextResponse.json(formattedProjects);
    } catch (error) {
      console.error(
        `Error fetching projects (attempt ${retryCount + 1}):`,
        error
      );

      // If it's an entity metadata error, reset the DataSource
      if (error instanceof Error && error.message.includes("No metadata for")) {
        await resetDataSource();
      }

      if (retryCount < maxRetries) {
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      );
    }
  }

  // This should never be reached, but TypeScript requires it
  return NextResponse.json(
    { error: "Unexpected error occurred" },
    { status: 500 }
  );
}
