import { Skeleton } from "@/components/ui/skeleton"

const BlogCardSkeleton = () => {
  return (
    <div className="max-w-[24.5rem] space-y-6">
      {/* Image placeholder */}
      <Skeleton className="max-w-[24.5rem] h-[13.75rem] rounded-2xl" />

      <div className="space-y-4">
        {/* Tag */}
        <Skeleton className="w-20 h-5 rounded-md" />

        {/* Headline */}
        <Skeleton className="w-full h-6 rounded-md" />
        <Skeleton className="w-3/4 h-6 rounded-md" />

        {/* Subtitle */}
        <Skeleton className="w-full h-5 rounded-md" />
        <Skeleton className="w-2/3 h-5 rounded-md" />

        {/* Author and Date */}
        <div className="flex items-center space-x-2 pt-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-16 h-4 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCardSkeleton
