import { NextResponse } from "next/server";
import { getDataSource, resetDataSource } from "@/lib/db";
import { Company } from "@/lib/entities/Company";

export const runtime = "nodejs";

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

      const companyRepository = dataSource.getRepository(Company);

      const companies = await companyRepository.find({
        order: { order: "ASC" },
      });

      return NextResponse.json({ companies });
    } catch (error) {
      console.error(
        `Error fetching companies (attempt ${retryCount + 1}):`,
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
        { error: "Failed to fetch companies" },
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
