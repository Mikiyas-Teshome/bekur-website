import { useMemo } from "react";
import { PricingType } from "@/types/client";
import {
  getPricingByServiceName,
  type StaticPricingResponse,
} from "@/data/static-content";

interface UseServicePricingProps {
  serviceName: string;
}

export const useServicePricing = ({ serviceName }: UseServicePricingProps) => {
  const pricingData = useMemo<StaticPricingResponse>(() => {
    if (!serviceName) {
      return { pricingType: PricingType.SIMPLE, plans: [] };
    }

    return (
      getPricingByServiceName(serviceName) ?? {
        pricingType: PricingType.SIMPLE,
        plans: [],
      }
    );
  }, [serviceName]);

  return {
    pricingData,
    loading: false,
    error: null as string | null,
    isPlatformBased: pricingData.pricingType === PricingType.PLATFORM_BASED,
    platforms: pricingData.platforms,
    plans: pricingData.plans || [],
    serviceId: undefined,
  };
};
