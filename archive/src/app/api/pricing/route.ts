// import { NextRequest, NextResponse } from "next/server";
// import { getDataSource } from "@/lib/db";
// import { PricingPlan, PricingType, Platform } from "@/lib/entities/PricingPlan";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const serviceId = searchParams.get("serviceId");
//     const platform = searchParams.get("platform");
//     const pricingType = searchParams.get("pricingType");

//     const dataSource = await getDataSource();
//     const pricingRepository = dataSource.getRepository(PricingPlan);

//     let query = pricingRepository.createQueryBuilder("plan");

//     if (serviceId) {
//       query = query.where("plan.serviceId = :serviceId", {
//         serviceId: parseInt(serviceId),
//       });
//     }

//     if (platform) {
//       query = query.andWhere("plan.platform = :platform", { platform });
//     }

//     if (pricingType) {
//       query = query.andWhere("plan.pricingType = :pricingType", {
//         pricingType,
//       });
//     }

//     const plans = await query.orderBy("plan.order", "ASC").getMany();

//     // If platform-based pricing, group by platform
//     if (pricingType === PricingType.PLATFORM_BASED) {
//       const groupedPlans = plans.reduce((acc, plan) => {
//         const platformKey = plan.platform || Platform.GENERAL;
//         if (!acc[platformKey]) {
//           acc[platformKey] = [];
//         }
//         acc[platformKey].push(plan);
//         return acc;
//       }, {} as Record<string, PricingPlan[]>);

//       return NextResponse.json({
//         pricingType: PricingType.PLATFORM_BASED,
//         platforms: groupedPlans,
//       });
//     }

//     return NextResponse.json({
//       pricingType: PricingType.SIMPLE,
//       plans,
//     });
//   } catch (error) {
//     console.error("Error fetching pricing plans:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { PricingPlan, PricingType, Platform } from "@/lib/entities/PricingPlan";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");
    const platform = searchParams.get("platform");
    const pricingType = searchParams.get("pricingType");

    const dataSource = await getDataSource();
    const pricingRepository = dataSource.getRepository(PricingPlan);

    let query = pricingRepository.createQueryBuilder("plan");

    if (serviceId) {
      query = query.where("plan.serviceId = :serviceId", {
        serviceId: parseInt(serviceId),
      });
    }

    if (platform) {
      query = query.andWhere("plan.platform = :platform", { platform });
    }

    if (pricingType) {
      query = query.andWhere("plan.pricingType = :pricingType", {
        pricingType,
      });
    }

    const plans = await query.orderBy("plan.order", "ASC").getMany();

    if (plans.length === 0) {
      return NextResponse.json({
        pricingType: PricingType.SIMPLE,
        plans: [],
      });
    }

    // Check if this is platform-based pricing by looking at the first plan's pricing type
    const firstPlan = plans[0];
    const isPlatformBased =
      firstPlan.pricingType === PricingType.PLATFORM_BASED;

    if (isPlatformBased) {
      // Group by platform for platform-based pricing
      const groupedPlans = plans.reduce((acc, plan) => {
        const platformKey = plan.platform || Platform.GENERAL;
        if (!acc[platformKey]) {
          acc[platformKey] = [];
        }
        acc[platformKey].push(plan);
        return acc;
      }, {} as Record<string, PricingPlan[]>);

      return NextResponse.json({
        pricingType: PricingType.PLATFORM_BASED,
        platforms: groupedPlans,
      });
    }

    return NextResponse.json({
      pricingType: PricingType.SIMPLE,
      plans,
    });
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}