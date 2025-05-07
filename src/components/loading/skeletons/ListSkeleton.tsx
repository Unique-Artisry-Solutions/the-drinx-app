
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  itemCount?: number;
  hasImage?: boolean;
  hasActions?: boolean;
  className?: string;
}

/**
 * Skeleton loader for list items
 */
const ListSkeleton: React.FC<ListSkeletonProps> = ({
  itemCount = 5,
  hasImage = true,
  hasActions = false,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(itemCount)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 border rounded-md">
          {hasImage && (
            <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
          )}
          
          <div className="flex-grow space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          
          {hasActions && (
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListSkeleton;
