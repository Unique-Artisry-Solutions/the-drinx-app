
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Default skeleton for page loading states
 */
const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      
      {/* Additional content skeleton */}
      <div className="space-y-4 mt-8">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
