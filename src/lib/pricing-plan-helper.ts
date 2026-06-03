import { PricingPlan, PricingType, Platform } from "@/lib/entities/PricingPlan";

export interface PricingPlanData {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  order: number;
  serviceId?: number;
  originalPrice?: string;
  discount?: string;
  targetAudience?: string;
  buttonText?: string;
  pricingType: PricingType;
  platform?: Platform;
  subtitle?: string;
}

export class PricingPlanHelper {
  /**
   * Create a simple pricing plan (not platform-based)
   */
  static createSimplePlan(
    data: Omit<PricingPlanData, "pricingType" | "platform">
  ): PricingPlanData {
    return {
      ...data,
      pricingType: PricingType.SIMPLE,
      platform: Platform.GENERAL,
    };
  }

  /**
   * Create a platform-based pricing plan
   */
  static createPlatformPlan(
    data: Omit<PricingPlanData, "pricingType">,
    platform: Platform
  ): PricingPlanData {
    return {
      ...data,
      pricingType: PricingType.PLATFORM_BASED,
      platform,
    };
  }

  /**
   * Group pricing plans by platform for platform-based services
   */
  static groupByPlatform(plans: PricingPlan[]): Record<string, PricingPlan[]> {
    return plans.reduce((acc, plan) => {
      const platform = plan.platform || Platform.GENERAL;
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push(plan);
      return acc;
    }, {} as Record<string, PricingPlan[]>);
  }

  /**
   * Get platform display name
   */
  static getPlatformDisplayName(platform: Platform): string {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  }

  /**
   * Check if a service uses platform-based pricing
   */
  static isPlatformBasedService(plans: PricingPlan[]): boolean {
    return plans.some(
      (plan) => plan.pricingType === PricingType.PLATFORM_BASED
    );
  }

  /**
   * Get unique platforms from pricing plans
   */
  static getUniquePlatforms(plans: PricingPlan[]): Platform[] {
    const platforms = plans
      .filter((plan) => plan.platform && plan.platform !== Platform.GENERAL)
      .map((plan) => plan.platform!)
      .filter((platform, index, self) => self.indexOf(platform) === index);

    return platforms;
  }
}
