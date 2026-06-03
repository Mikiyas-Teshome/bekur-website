import { NextResponse } from "next/server";
import { getDataSource, resetDataSource } from "@/lib/db";
import { Service } from "@/lib/entities/Service";

export const runtime = "nodejs";

export async function GET() {
  let retryCount = 0;
  const maxRetries = 2;

  while (retryCount <= maxRetries) {
    try {
      const dataSource = await getDataSource();

      // Check if dataSource is null after potential reset
      if (!dataSource) {
        console.error("DataSource is null after initialization");
        if (retryCount < maxRetries) {
          retryCount++;
          // Add a small delay before retry
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 500 }
        );
      }

      const serviceRepository = dataSource.getRepository(Service);

      const services = await serviceRepository.find({
        order: { order: "ASC" },
      });

      // Transform services to include slug for contact form compatibility
      const transformedServices = services.map((service) => ({
        id: service.id,
        title: service.title,
        slug: service.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""), // Generate slug from title
        description: service.description,
        iconKey: service.iconKey,
        order: service.order,
      }));

      return NextResponse.json({ services: transformedServices });
    } catch (error) {
      console.error(
        `Error fetching services (attempt ${retryCount + 1}):`,
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
        { error: "Failed to fetch services" },
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
