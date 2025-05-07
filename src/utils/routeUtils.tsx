
import React, { lazy, ReactNode } from 'react';
import { lazyLoad } from '@/utils/lazyRouteLoader';
import { RouteMetadata } from '@/routes/config/routeConfig';
import PageSuspense from '@/components/loading/PageSuspense';

/**
 * Enhanced version of createLazyRoute with prefetching and standardized loading
 * @param path Route path
 * @param importFunc Import function for the component
 * @param metadata Route metadata
 * @param customLoading Optional custom loading component
 */
export function createEnhancedLazyRoute(
  path: string,
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  metadata?: RouteMetadata,
  customLoading?: ReactNode
): any {
  // Get priority for prefetching based on metadata
  const priority = metadata?.prefetchPriority || 'low';
  
  // Create the lazy component with appropriate loading configuration
  const LazyComponent = lazyLoad(importFunc, {
    priority: priority as 'high' | 'medium' | 'low',
    fallback: customLoading
  });
  
  // Wrap the component with the PageSuspense boundary
  const WrappedComponent = () => (
    <PageSuspense fallback={customLoading}>
      <LazyComponent />
    </PageSuspense>
  );
  
  return {
    path,
    element: <WrappedComponent />,
    metadata
  };
}

/**
 * Helper function to apply navigation tracking to components
 */
export function withNavigationTracking<T extends React.ComponentType<any>>(
  Component: T
): React.FC<React.ComponentProps<T>> {
  return (props: React.ComponentProps<T>) => {
    // This can be expanded to include actual navigation tracking logic
    return <Component {...props} />;
  };
}
