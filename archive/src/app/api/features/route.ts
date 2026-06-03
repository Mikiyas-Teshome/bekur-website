import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Feature } from "@/lib/entities/Feature";

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

    const featureRepository = dataSource.getRepository(Feature);

    const features = await featureRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json({ features });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}
