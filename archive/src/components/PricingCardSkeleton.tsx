import { Skeleton } from "@/components/ui/skeleton";

const PricingCardSkeleton = () => {
  return (
    <div className="w-full md:max-w-[374px] rounded-[0.5rem] p-6 space-y-6 bg-secondary border border-border dark:border-[#214A9C]">
      {/* Plan Name Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        
        {/* Price Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Features Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="h-4 w-4 rounded-[4px] mt-0.5" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>

      {/* Button Skeleton */}
      <Skeleton className="w-full h-12 rounded-md" />
    </div>
  );
};

export default PricingCardSkeleton;

