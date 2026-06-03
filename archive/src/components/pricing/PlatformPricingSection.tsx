"use client";
import React from "react";
import SectionHeader from "../homePage/SectionHeader";
import PricingCard from "./PricingCard";
import { Platform } from "@/types/client";
// import { Button } from "../ui/button";

interface PricingTier {
  name: string;
  price: string;
  discount?: string;
  subtitle: string;
  audience: string;
  features: string[];
  isPopular?: boolean;
}

interface PlatformPricingProps {
  platform: Platform;
  tiers: PricingTier[];
}

const PlatformPricing: React.FC<PlatformPricingProps> = ({
  platform,
  tiers,
}) => {
  const platformDisplayName =
    platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div className="space-y-4">
      <h2
        className={`text-2xl text-primary dark:text-foreground leading-6 font-semibold text-left`}
      >
        Our {platformDisplayName} Pricing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier, index) => (
          <PricingCard
            key={index}
            planName={tier.name}
            price={tier.price}
            originalPrice={tier.price}
            discount={tier.discount}
            targetAudience={tier.audience}
            features={tier.features}
            isHighlighted={tier.isPopular}
            subtitle={tier.subtitle}
          />
        ))}
      </div>
    </div>
  );
};

const PlatformPricingSection: React.FC = () => {
  // const [isAnnual, setIsAnnual] = useState(true);

  // const handleBillingToggle = () => {
  //   setIsAnnual(!isAnnual);
  // };

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      subtitle: "per user/month, billed annually",
      audience: "For Small Teams",
      features: [
        "Real-time contact syncing",
        "Automatic data enrichment",
        "Up to 3 seats",
      ],
    },
    {
      name: "Basic",
      price: "$39",
      discount: "-15%",
      subtitle: "per user/month, billed annually",
      audience: "For Growing Teams",
      features: [
        "Private lists",
        "Enhanced email sending",
        "No seat limits",
        "Up to 3 seats",
      ],
    },
    {
      name: "Pro",
      price: "$59",
      discount: "-15%",
      subtitle: "per user/month, billed annually",
      audience: "For Scaling Businesses",
      features: [
        "Fully adjustable permissions",
        "Advanced data enrichment",
        "Priority support",
        "Up to 3 seats",
      ],
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "$129",
      subtitle: "per user/month, billed annually",
      audience: "For Big Corporation",
      features: [
        "Unlimited reporting",
        "SAML and SSO",
        "Custom billing",
        "Up to 3 seats",
      ],
    },
  ];

  const platforms: Platform[] = [
    Platform.FACEBOOK,
    Platform.LINKEDIN,
    Platform.TIKTOK,
  ];

  return (
    <section className="bg-[#F4F4F4] dark:bg-background py-4 md:py-12.5">
      <div className="container mx-auto px-4 md:px-8 space-y-4 md:space-y-12.25">
        <SectionHeader title="Our Pricing" description="Pricing" />
        <div className="flex flex-col space-y-4 md:space-y-15">
          {/* Billing Toggle */}
          {/* <div className="flex items-center justify-start md:justify-center">
            <div className="relative inline-flex items-center w-fit rounded-lg bg-secondary border border-secondary dark:border-[#214A9C] p-2 space-x-3">
              <Button
                onClick={handleBillingToggle}
                className={`px-6 py-2 h-12.5 w-fit cursor-pointer rounded-md text-2xl font-medium transition-all duration-200 ${
                  !isAnnual
                    ? "bg-primary text-secondary dark:text-white shadow-sm"
                    : "bg-transparent text-foreground hover:text-foreground/80 hover:bg-transparent"
                }`}
              >
                Billed Monthly
              </Button>

              <Button
                onClick={handleBillingToggle}
                className={`px-6 py-2 h-12.5 w-fit cursor-pointer rounded-md text-2xl font-medium transition-all duration-200 ${
                  isAnnual
                    ? "bg-primary text-secondary dark:text-white shadow-sm"
                    : "bg-transparent text-foreground hover:text-foreground/80 hover:bg-transparent"
                }`}
              >
                Billed Annually
              </Button>
            </div>
          </div> */}
          <div className="space-y-4 md:space-y-9">
            {platforms.map((platform) => (
              <PlatformPricing
                key={platform}
                platform={platform}
                tiers={pricingTiers}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPricingSection;
