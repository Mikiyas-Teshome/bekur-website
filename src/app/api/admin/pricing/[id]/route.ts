import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { PricingPlan } from "@/lib/entities/PricingPlan";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve params
    const resolvedParams = await params;

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

    const plan = await pricingRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching pricing plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve params
    const resolvedParams = await params;

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
      pricingType,
      platform,
      subtitle,
    } = data;

    const dataSource = await getDataSource();
    const pricingRepository = dataSource.getRepository(PricingPlan);

    const plan = await pricingRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      );
    }

    // Handle empty price - convert to $0 for free plans
    const processedPrice =
      price === "" || price === null || price === undefined ? "0" : price;

    // Update plan
    plan.name = name;
    plan.price = processedPrice;
    plan.features = features;
    plan.highlight = highlight;
    plan.buttonText = buttonText;
    plan.serviceId = serviceId;
    plan.originalPrice = originalPrice;
    plan.discount = discount;
    plan.targetAudience = targetAudience;
    plan.pricingType = pricingType;
    plan.platform = platform;
    plan.subtitle = subtitle;

    await pricingRepository.save(plan);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating pricing plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve params
    const resolvedParams = await params;

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

    const plan = await pricingRepository.findOne({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      );
    }

    await pricingRepository.remove(plan);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pricing plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
