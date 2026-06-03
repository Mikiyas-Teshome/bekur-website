import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Testimonial } from "@/lib/entities/Testimonial";

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

    const testimonialRepository = dataSource.getRepository(Testimonial);

    const testimonials = await testimonialRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
