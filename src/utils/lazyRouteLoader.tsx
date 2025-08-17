
import React, { useEffect, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Creates a lazily-loaded component with a standardized fallback UI
 * @param importFunc A function that imports the component
 * @param options Configuration options
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(() => {
    return importFunc().catch(error => {
      console.error('Error loading lazy component:', error);
      // Return a fallback component for failed imports
      const ErrorFallback: React.ComponentType<any> = () => (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load component</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
      return {
        default: ErrorFallback as T
      };
    });
  });
  
  // Set prefetch priority based on options
  if (typeof document !== 'undefined' && options.priority) {
    if (options.priority === 'high') {
      // High priority: prefetch immediately
      setTimeout(() => {
        importFunc().catch(err => console.error('Error prefetching high priority component:', err));
      }, 0);
    } else if (options.priority === 'medium') {
      // Medium priority: prefetch after a delay
      setTimeout(() => {
        importFunc().catch(err => console.error('Error prefetching medium priority component:', err));
      }, 2000);
    }
    // Low priority components are not prefetched
  }
  
  const fallback = options.fallback || (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      <Skeleton className="w-full h-40" />
    </div>
  );
  
  // Return a component that accepts the same props as the lazy-loaded component
  return function LazyLoadWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Hook for tracking navigation for analytics and prefetching
 */
export function useNavigationTracking(): void {
  const location = useLocation();
  const { trackPage } = useAnalytics();
  const [lastPath, setLastPath] = useState<string>(location.pathname);
  
  useEffect(() => {
    // Skip if path hasn't changed (prevents duplicate tracking)
    if (location.pathname === lastPath) return;
    
    // Track page view
    trackPage(location.pathname);
    setLastPath(location.pathname);
    
    // Potential prefetch of related routes based on current path
    // This could be expanded to intelligently prefetch likely next routes
  }, [location.pathname, trackPage, lastPath]);
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
    <Suspense fallback={fallback || <div className="w-full h-40 animate-pulse bg-muted rounded-md" />}>
      <Component {...rest} />
    </Suspense>
  );
}
