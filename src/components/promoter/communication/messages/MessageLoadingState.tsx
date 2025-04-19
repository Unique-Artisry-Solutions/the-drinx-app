
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MessageLoadingState: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col gap-3 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-md w-3/4" />
      ))}
    </div>
  );
};

export default MessageLoadingState;
