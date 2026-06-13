import { Skeleton } from '@/components/ui/Skeleton'

export default function EventLoading() {
  return (
    <div className="container-xl py-8">
      <Skeleton className="w-full h-96 rounded-card mb-8" />
      <div className="flex gap-8">
        <div className="flex-1 flex flex-col gap-5">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
          <Skeleton className="h-40" />
          <Skeleton className="h-60" />
        </div>
        <div className="hidden lg:block w-72 shrink-0">
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  )
}