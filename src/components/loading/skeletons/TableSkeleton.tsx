
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  hasActions?: boolean;
  className?: string;
}

/**
 * Skeleton loader for data tables
 */
const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  hasActions = true,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="border rounded-lg">
        {/* Header */}
        {hasHeader && (
          <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/20">
            {[...Array(columns)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            {hasActions && <Skeleton className="h-4 w-full" />}
          </div>
        )}
        
        {/* Rows */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
            {[...Array(columns)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
            {hasActions && (
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
