import { Skeleton } from "@/components/ui/skeleton"

export default function HowItWorksSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background to-background/90">
      <div className="container px-4 md:px-6">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <Skeleton className="h-12 md:h-16 w-72" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-80" />
            <Skeleton className="h-6 w-64" />
          </div>
        </div>

        {/* Steps skeleton */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon skeleton */}
              <div className="relative mb-4 md:mb-6">
                <Skeleton className="h-14 md:h-16 w-14 md:w-16 rounded-full" />
              </div>

              {/* Title skeleton */}
              <Skeleton className="h-6 md:h-7 w-32 mb-2" />

              {/* Description skeleton */}
              <div className="space-y-1 px-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
