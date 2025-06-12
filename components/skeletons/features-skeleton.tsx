import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturesSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="h-12 md:h-16 w-80" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-96" />
            <Skeleton className="h-6 w-72" />
          </div>
        </div>

        {/* Feature cards skeleton */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-rose-50/80 to-white/90 p-6 md:p-8 shadow-xl border border-white/50"
            >
              <div className="relative">
                {/* Icon skeleton */}
                <Skeleton className="h-12 md:h-16 w-12 md:w-16 rounded-xl md:rounded-2xl mb-4 md:mb-6" />

                {/* Title skeleton */}
                <Skeleton className="h-6 md:h-8 w-48 mb-3 md:mb-4" />

                {/* Description skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
