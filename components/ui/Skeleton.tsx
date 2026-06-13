import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'circle' | 'rect'
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  const baseClass = 'skeleton'
  const variantClass = {
    text:   'h-4 rounded',
    card:   'h-48 rounded-card',
    circle: 'rounded-full',
    rect:   'rounded',
  }[variant]

  return <div className={cn(baseClass, variantClass, className)} aria-hidden="true" />
}

export function EventCardSkeleton() {
  return (
    <div className="event-card overflow-hidden" aria-hidden="true">
      <Skeleton variant="card" className="h-44 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton variant="text" className="w-20 h-5" />
        <Skeleton variant="text" className="w-full h-6" />
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <Skeleton variant="text" className="w-2/3 h-4" />
        <div className="flex justify-between items-center mt-2">
          <Skeleton variant="text" className="w-16 h-6" />
          <Skeleton variant="text" className="w-24 h-9 rounded" />
        </div>
      </div>
    </div>
  )
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}
