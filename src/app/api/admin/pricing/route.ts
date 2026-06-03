import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { PricingPlan, PricingType, Platform } from "@/lib/entities/PricingPlan";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const pricingRepository = dataSource.getRepository(PricingPlan);

    const plans = await pricingRepository.find({
      order: { order: "ASC" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      price,
      features,
      highlight,
      buttonText,
      serviceId,
      originalPrice,
      discount,
      targetAudience,
      pricingType = PricingType.SIMPLE,
      platform,
      subtitle,
    } = data;

    const dataSource = await getDataSource();
    const pricingRepository = dataSource.getRepository(PricingPlan);

    // Handle empty price - convert to $0 for free plans
    const processedPrice =
      price === "" || price === null || price === undefined ? "0" : price;

    const plan = pricingRepository.create({
      name,
      price: processedPrice,
      features,
      highlight,
      buttonText,
      serviceId,
      originalPrice,
      discount,
      targetAudience,
      pricingType,
      platform: platform || Platform.GENERAL,
      subtitle,
      order: 0, // Will be set based on existing plans
    });

    // Set order based on existing plans
    const existingPlans = await pricingRepository.find();
    plan.order = existingPlans.length + 1;

    await pricingRepository.save(plan);

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating pricing plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
