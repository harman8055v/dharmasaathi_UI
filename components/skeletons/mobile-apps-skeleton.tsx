import { Skeleton } from "@/components/ui/skeleton"

export default function MobileAppsSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/90 to-primary/5">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content skeleton */}
          <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
            {/* Badge skeleton */}
            <Skeleton className="h-8 w-32 rounded-full" />

            {/* Title skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-10 md:h-12 w-full max-w-md" />
              <Skeleton className="h-10 md:h-12 w-3/4 max-w-sm" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full max-w-lg" />
              <Skeleton className="h-5 w-full max-w-md" />
              <Skeleton className="h-5 w-3/4 max-w-sm" />
            </div>

            {/* Features skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))}
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>

          {/* Image skeleton */}
          <div className="relative order-1 lg:order-2">
            <div className="relative glass-effect p-6 md:p-8 rounded-3xl">
              <Skeleton className="w-full h-96 md:h-[500px] rounded-2xl max-w-sm mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
