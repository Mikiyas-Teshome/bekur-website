import { useMemo } from "react";
import { getServices, type StaticService } from "@/data/static-content";

interface UseServiceByNameProps {
  serviceName: string;
}

export const useServiceByName = ({ serviceName }: UseServiceByNameProps) => {
  const { service, error } = useMemo(() => {
    if (!serviceName) {
      return { service: null as StaticService | null, error: null as string | null };
    }

    const foundService = getServices().find(
      (s) => s.title.toLowerCase() === serviceName.toLowerCase()
    );

    return {
      service: foundService ?? null,
      error: foundService ? null : `Service "${serviceName}" not found`,
    };
  }, [serviceName]);

  return {
    service,
    serviceId: service?.id,
    loading: false,
    error,
  };
};
