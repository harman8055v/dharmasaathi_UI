import { Skeleton } from "@/components/ui/skeleton"

export default function FooterSkeleton() {
  return (
    <footer className="border-t bg-gradient-to-b from-background/80 to-primary/5 backdrop-blur-sm">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and description skeleton */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex space-x-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-5" />
              ))}
            </div>
          </div>

          {/* Links columns skeleton */}
          {Array.from({ length: 2 }).map((_, columnIndex) => (
            <div key={columnIndex} className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, linkIndex) => (
                  <Skeleton key={linkIndex} className="h-4 w-32" />
                ))}
              </div>
            </div>
          ))}

          {/* CTA column skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Bottom section skeleton */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </footer>
  )
}
