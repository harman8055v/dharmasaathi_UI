import { Skeleton } from "@/components/ui/skeleton"

export default function FaqSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-background/90 to-background">
      <div className="container px-4 md:px-6">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <Skeleton className="h-12 md:h-16 w-64" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-80" />
            <Skeleton className="h-6 w-72" />
          </div>
        </div>

        {/* FAQ items skeleton */}
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-b border-muted-foreground/10 py-4 md:py-6">
                <div className="flex items-start">
                  <Skeleton className="mr-3 h-4 w-4 mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
