import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";

import { getDataSource } from "@/lib/db";
import { Testimonial } from "@/lib/entities/Testimonial";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const testimonialRepository = dataSource.getRepository(Testimonial);

    const testimonials = await testimonialRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await request.json();
    const dataSource = await getDataSource();
    const testimonialRepository = dataSource.getRepository(Testimonial);

    // Clear existing testimonials
    await testimonialRepository.clear();

    // Save new testimonials
    for (const testimonialData of testimonials) {
      const testimonial = new Testimonial();
      testimonial.profileImage = testimonialData.profileImage;
      testimonial.username = testimonialData.username;
      testimonial.description = testimonialData.description;
      testimonial.joinedDate = testimonialData.joinedDate;
      testimonial.order = testimonialData.order;
      await testimonialRepository.save(testimonial);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating testimonials:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const dataSource = await getDataSource();
    const testimonialRepository = dataSource.getRepository(Testimonial);

    const testimonial = new Testimonial();
    testimonial.profileImage = data.profileImage;
    testimonial.username = data.username;
    testimonial.description = data.description;
    testimonial.joinedDate = data.joinedDate;
    testimonial.order = data.order;

    const savedTestimonial = await testimonialRepository.save(testimonial);
    return NextResponse.json(savedTestimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const testimonialRepository = dataSource.getRepository(Testimonial);

    await testimonialRepository.delete(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
