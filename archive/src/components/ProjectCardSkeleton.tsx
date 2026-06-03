import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton = () => {
  return (
    <div className="w-full">
      {/* Project Image Skeleton */}
      <div className="w-full aspect-[610/406] rounded-3xl overflow-hidden mb-3 md:mb-6">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Title and Description Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 md:h-7 w-3/4 mx-auto md:mx-0" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mx-auto md:mx-0" />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;

