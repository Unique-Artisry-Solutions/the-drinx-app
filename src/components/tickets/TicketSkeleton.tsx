
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TicketSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      ))}
    </div>
  );
};

export default TicketSkeleton;
