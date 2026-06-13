import { EventGridSkeleton } from '@/components/ui/Skeleton'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container-xl py-8">
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex flex-col gap-5 w-64 shrink-0">
          <Skeleton className="h-64" />
          <Skeleton className="h-56" />
          <Skeleton className="h-48" />
        </div>
        {/* Content skeleton */}
        <div className="flex-1">
          <Skeleton className="h-72 mb-6 rounded-card" />
          <EventGridSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}
