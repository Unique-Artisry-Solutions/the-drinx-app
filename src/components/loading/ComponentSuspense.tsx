
import React, { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface ComponentSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  height?: string | number;
  className?: string;
}

/**
 * Component-level suspense boundary with standardized fallback UI
 */
const ComponentSuspense: React.FC<ComponentSuspenseProps> = ({ 
  children, 
  fallback, 
  height = '200px',
  className = ''
}) => {
  const defaultFallback = (
    <div className={`flex items-center justify-center ${className}`} style={{ height }}>
      <Skeleton className="h-full w-full min-h-[100px]" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default ComponentSuspense;
