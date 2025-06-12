import { Skeleton } from "@/components/ui/skeleton"

export default function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white to-purple-50/60" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Left Content Skeleton */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              {/* Badge skeleton */}
              <div className="inline-block mb-6">
                <Skeleton className="h-12 w-48 rounded-full" />
              </div>

              {/* Title skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-12 md:h-16 w-full max-w-2xl" />
                <Skeleton className="h-12 md:h-16 w-3/4 max-w-xl" />
              </div>

              {/* Subtitle skeleton */}
              <Skeleton className="h-8 w-full max-w-lg" />

              {/* Description skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full max-w-2xl" />
                <Skeleton className="h-5 w-full max-w-xl" />
                <Skeleton className="h-5 w-3/4 max-w-lg" />
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-14 w-64" />
              <Skeleton className="h-14 w-48" />
            </div>
          </div>

          {/* Right Form Skeleton */}
          <div className="lg:col-span-5 w-full">
            <div className="glass-effect p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/30 max-w-md mx-auto lg:mx-0">
              {/* Tab skeleton */}
              <Skeleton className="h-12 w-full mb-6 rounded-lg" />

              {/* Form fields skeleton */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-11 w-20" />
                    <Skeleton className="h-11 flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-11 w-full" />
                </div>

                {/* Submit button skeleton */}
                <Skeleton className="h-11 w-full" />

                {/* Divider */}
                <div className="relative py-4">
                  <Skeleton className="h-px w-full" />
                </div>

                {/* Social buttons skeleton */}
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
