
import React, { Suspense } from 'react';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
}

/**
 * Creates a lazily-loaded component with a standardized fallback UI
 * @param importFunc A function that imports the component
 * @param options Configuration options
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.ReactNode {
  const LazyComponent = React.lazy(importFunc);
  
  const fallback = options.fallback || (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
}

/**
 * A wrapper component for route elements that need to be lazily loaded
 */
export function LazyRoute({ 
  component: Component,
  fallback,
  ...rest
}: { 
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Suspense fallback={fallback || <div>Loading...</div>}>
      <Component {...rest} />
    </Suspense>
  );
}
