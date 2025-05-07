
import React, { Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

// Track visited routes for prefetching optimization
const visitedRoutes = new Set<string>();
const prefetchedRoutes = new Set<string>();

interface LazyLoadOptions {
  // Custom fallback component to show while loading
  fallback?: React.ReactNode;
  // Priority for prefetching (higher number = higher priority)
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Creates a lazily-loaded component with standardized fallback UI
 * @param importFunc A function that imports the component
 * @param options Configuration options
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = React.lazy(importFunc);
  
  const fallback = options.fallback || (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
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
 * Hook to track navigation for prefetching optimization
 */
export function useNavigationTracking() {
  const location = useLocation();
  
  useEffect(() => {
    // Record this route as visited
    visitedRoutes.add(location.pathname);
    
    // Prefetch likely next routes based on current route
    // This could be enhanced with actual analytics data
    prefetchNextRoutes(location.pathname);
  }, [location.pathname]);
}

/**
 * Prefetch routes that are likely to be navigated to next
 */
function prefetchNextRoutes(currentPath: string) {
  // Simple prefetching logic based on common navigation patterns
  const routesToPrefetch: Record<string, string[]> = {
    '/': ['/explore', '/login', '/signup'],
    '/explore': ['/map', '/profile'],
    '/profile': ['/profile/bar-crawls', '/profile/visited', '/profile/favorites'],
    '/bar-crawl': ['/profile/bar-crawls', '/checkout'],
  };
  
  // Get routes to prefetch for current path
  let pathsToPrefetch: string[] = [];
  
  // Check for exact path matches
  if (routesToPrefetch[currentPath]) {
    pathsToPrefetch = [...routesToPrefetch[currentPath]];
  }
  
  // Check for partial path matches
  Object.keys(routesToPrefetch).forEach(path => {
    if (currentPath.startsWith(path) && currentPath !== path) {
      pathsToPrefetch = [...pathsToPrefetch, ...routesToPrefetch[path]];
    }
  });
  
  // Remove duplicates and already prefetched routes
  pathsToPrefetch = [...new Set(pathsToPrefetch)]
    .filter(path => !prefetchedRoutes.has(path));
  
  // Prefetch the components
  pathsToPrefetch.forEach(path => {
    prefetchRoute(path);
  });
}

/**
 * Prefetch a specific route component
 */
function prefetchRoute(path: string) {
  // Map paths to their component import functions
  // This is a simplified example - in a real app, you'd need a more robust mapping
  const routeMap: Record<string, () => Promise<any>> = {
    '/explore': () => import('@/pages/Explore'),
    '/map': () => import('@/pages/MapPage'),
    '/profile': () => import('@/pages/profile/UserProfilePage'),
    '/profile/bar-crawls': () => import('@/pages/profile/BarCrawlsPage'),
    '/profile/visited': () => import('@/pages/profile/VisitedPage'),
    '/profile/favorites': () => import('@/pages/profile/FavoritesPage'),
    '/checkout': () => import('@/pages/CheckoutPage'),
  };
  
  const importFunc = routeMap[path];
  if (importFunc) {
    // Mark as prefetched to avoid duplicate prefetching
    prefetchedRoutes.add(path);
    
    // Prefetch in low priority
    // @ts-ignore - Using modern browser feature
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        importFunc();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        importFunc();
      }, 1000);
    }
  }
}

/**
 * Hook to prefetch routes on hover or when in viewport
 */
export function usePrefetch(path: string) {
  const handlePrefetch = () => {
    if (!prefetchedRoutes.has(path)) {
      prefetchRoute(path);
    }
  };
  
  return {
    onMouseEnter: handlePrefetch,
    onFocus: handlePrefetch
  };
}

/**
 * Creates a component that prefetches routes when in viewport
 */
export function createPrefetchComponent(routes: string[]) {
  return function RoutePrefetcher() {
    useEffect(() => {
      routes.forEach(route => {
        if (!prefetchedRoutes.has(route)) {
          prefetchRoute(route);
        }
      });
    }, []);
    
    return null;
  };
}
