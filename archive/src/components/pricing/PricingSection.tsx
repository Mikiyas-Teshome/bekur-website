"use client";
import type React from "react";
import DynamicPricingSection from "./DynamicPricingSection";

const PricingSection: React.FC = () => {
  // For general pricing page, you can specify a service name or use serviceId
  // For now, we'll use "Web Development" as an example
  const generalServiceName = "Web Development";

  return (
    <DynamicPricingSection
      serviceName={generalServiceName}
      serviceTitle="Our Services"
    />
  );
};

export default PricingSection;
