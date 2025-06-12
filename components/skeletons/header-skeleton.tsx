import { Skeleton } from "@/components/ui/skeleton"

export default function HeaderSkeleton() {
  return (
    <header className="fixed top-0 w-full z-50 glass-effect border-b">
      <div className="container px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Desktop Navigation skeleton */}
          <nav className="hidden md:flex items-center space-x-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-16" />
            ))}
          </nav>

          {/* Desktop buttons skeleton */}
          <div className="hidden md:flex items-center space-x-4">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-20" />
          </div>

          {/* Mobile menu button skeleton */}
          <Skeleton className="md:hidden h-9 w-9" />
        </div>
      </div>
    </header>
  )
}
