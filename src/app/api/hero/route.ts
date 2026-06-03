import {  NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { HeroSection } from "@/lib/entities/HeroSection";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const heroRepository = dataSource.getRepository(HeroSection);

    const heroSection = await heroRepository.findOne({
      order: { createdAt: "DESC" },
    });

    if (!heroSection) {
      return NextResponse.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ hero: heroSection });
  } catch (error) {
    console.error("Error fetching hero section:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero section" },
      { status: 500 }
    );
  }
}
