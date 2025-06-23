"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="tte-card p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <Skeleton className="h-8 w-20 mx-auto mb-3" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-20 mx-auto mb-3" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="w-1/3">
          <Skeleton className="h-4 w-12 mb-2" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="w-1/3 flex flex-col items-end">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  )
} 