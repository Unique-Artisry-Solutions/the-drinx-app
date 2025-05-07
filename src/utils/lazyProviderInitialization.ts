
/**
 * Utility for lazy initialization of providers
 */

import { useState, useEffect } from 'react';

/**
 * Hook for lazy initialization of expensive resources
 * @param initializerFn Function that creates the resource
 * @param dependencies Dependencies that should trigger reinitialization
 */
export function useLazyInitialization<T>(
  initializerFn: () => T, 
  dependencies: any[] = []
): [T | null, boolean] {
  const [resource, setResource] = useState<T | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setIsInitializing(true);
    
    // Use setTimeout to defer initialization to next tick
    // This allows the component to render first before heavy initialization
    const timeoutId = setTimeout(() => {
      try {
        const initializedResource = initializerFn();
        setResource(initializedResource);
      } catch (error) {
        console.error('Error during lazy initialization:', error);
      } finally {
        setIsInitializing(false);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, dependencies);
  
  return [resource, isInitializing];
}

/**
 * Creates a resource only when conditions are met
 * @param shouldInitialize Whether the resource should be initialized
 * @param initializerFn Function that creates the resource
 * @param dependencies Dependencies that should trigger reinitialization
 */
export function useConditionalInitialization<T>(
  shouldInitialize: boolean,
  initializerFn: () => T,
  dependencies: any[] = []
): [T | null, boolean] {
  const [resource, setResource] = useState<T | null>(null);
  const [isInitializing, setIsInitializing] = useState(shouldInitialize);
  
  useEffect(() => {
    if (!shouldInitialize) {
      setIsInitializing(false);
      return;
    }
    
    setIsInitializing(true);
    
    // Defer initialization
    const timeoutId = setTimeout(() => {
      try {
        const initializedResource = initializerFn();
        setResource(initializedResource);
      } catch (error) {
        console.error('Error during conditional initialization:', error);
      } finally {
        setIsInitializing(false);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [shouldInitialize, ...dependencies]);
  
  return [resource, isInitializing];
}
