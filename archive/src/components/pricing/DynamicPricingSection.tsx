"use client";
import React from "react";
import SectionHeader from "../homePage/SectionHeader";
import PricingCard from "./PricingCard";
import PricingCardSkeleton from "../PricingCardSkeleton";
import { Platform } from "@/types/client";
import { useServicePricing } from "@/hooks/useServicePricing";
import type { StaticPricingPlan } from "@/data/static-content";

interface DynamicPricingSectionProps {
  serviceName: string;
  serviceTitle?: string;
}

interface PlatformPricingProps {
  platform: Platform;
  plans: StaticPricingPlan[];
}

const PlatformPricing: React.FC<PlatformPricingProps> = ({
  platform,
  plans,
}) => {
  const platformDisplayName =
    platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-primary dark:text-foreground leading-6 font-semibold text-left">
        Our {platformDisplayName} Pricing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <PricingCard
            key={index}
            planName={plan.name}
            price={plan.price}
            originalPrice={plan.originalPrice}
            discount={plan.discount}
            targetAudience={plan.targetAudience}
            features={plan.features}
            isHighlighted={plan.highlight}
            subtitle={plan.subtitle || "per user/month, billed annually"}
          />
        ))}
      </div>
    </div>
  );
};

const DynamicPricingSection: React.FC<DynamicPricingSectionProps> = ({
  serviceName,
  serviceTitle,
}) => {
  const { pricingData, loading, error, isPlatformBased, platforms, plans } =
    useServicePricing({ serviceName });

  if (loading) {
    return (
      <section className="bg-[#F4F4F4] dark:bg-background py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-4 md:space-y-12.25">
          <SectionHeader
            title={`${serviceTitle} Pricing`}
            description="Pricing"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {Array.from({ length: 4 }).map((_, index) => (
              <PricingCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#F4F4F4] dark:bg-background py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-4 md:space-y-12.25">
          <SectionHeader
            title={`${serviceTitle} Pricing`}
            description="Pricing"
          />
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error loading pricing</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!pricingData) {
    return (
      <section className="bg-[#F4F4F4] dark:bg-background py-4 md:py-12.5">
        <div className="container mx-auto px-4 md:px-8 space-y-4 md:space-y-12.25">
          <SectionHeader
            title={`${serviceTitle} Pricing`}
            description="Pricing"
          />
          <div className="flex items-center justify-center py-8">
            <p className="text-foreground">No pricing information available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F4F4F4] dark:bg-background py-4 md:py-12.5">
      <div className="container mx-auto px-4 md:px-8 space-y-4 md:space-y-12.25">
        <SectionHeader
          title={`${serviceTitle} Pricing`}
          description="Pricing"
        />

        <div className="space-y-4 md:space-y-9">
          {isPlatformBased && platforms ? (
            // Platform-based pricing
            Object.entries(platforms).map(([platformKey, platformPlans]) => (
              <PlatformPricing
                key={platformKey}
                platform={platformKey as Platform}
                plans={platformPlans}
              />
            ))
          ) : (
            // Simple pricing
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {plans?.map((plan, index) => (
                <PricingCard
                  key={index}
                  planName={plan.name}
                  price={plan.price}
                  originalPrice={plan.originalPrice}
                  discount={plan.discount}
                  targetAudience={plan.targetAudience}
                  features={plan.features}
                  isHighlighted={plan.highlight}
                  subtitle={plan.subtitle || "per user/month, billed annually"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DynamicPricingSection;
