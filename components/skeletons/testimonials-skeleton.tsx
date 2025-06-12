import { Skeleton } from "@/components/ui/skeleton"

export default function TestimonialsSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/90 to-background/80">
      <div className="container px-4 md:px-6">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <Skeleton className="h-12 md:h-16 w-64" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-80" />
            <Skeleton className="h-6 w-64" />
          </div>
        </div>

        <div className="mx-auto max-w-4xl relative">
          {/* Testimonial card skeleton */}
          <div className="px-2 md:px-4">
            <div className="border-none bg-gradient-to-b from-white/80 to-white shadow-sm rounded-lg">
              <div className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar skeleton */}
                  <Skeleton className="h-16 md:h-20 w-16 md:w-20 rounded-full mb-4 md:mb-6" />

                  {/* Quote icon skeleton */}
                  <Skeleton className="h-6 w-6 rounded mb-4" />

                  {/* Quote text skeleton */}
                  <div className="space-y-2 mb-4 w-full">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                  </div>

                  {/* Name and location skeleton */}
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation skeleton */}
          <div className="mt-6 md:mt-8 flex justify-center gap-2">
            <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-2 w-2 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
