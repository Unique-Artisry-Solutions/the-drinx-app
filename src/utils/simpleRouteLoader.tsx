
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Simplified route loading with minimal overhead
 */
export function createSimpleLazyRoute<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(importFunc);
  
  return function SimpleLazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<div className="w-full h-40 animate-pulse bg-muted rounded-md" />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Simple loading fallback component
 */
export const SimpleLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Skeleton className="w-full h-32" />
  </div>
);

/**
 * Minimal route wrapper for common patterns
 */
export const SimpleRouteWrapper = ({ 
  component: Component,
  ...rest
}: { 
  component: React.ComponentType<any>;
  [key: string]: any;
}) => (
  <Suspense fallback={<SimpleLoadingFallback />}>
    <Component {...rest} />
  </Suspense>
);
