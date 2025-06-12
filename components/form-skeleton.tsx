import { Skeleton } from "@/components/ui/skeleton"

export default function FormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Form fields skeleton */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}

      {/* Submit button skeleton */}
      <Skeleton className="h-11 w-full" />

      {/* Divider */}
      <div className="relative py-4">
        <Skeleton className="h-px w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-4 w-32 bg-white" />
        </div>
      </div>

      {/* Social buttons skeleton */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  )
}
