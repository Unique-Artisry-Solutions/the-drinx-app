
import { useState, useCallback, useRef, useEffect } from 'react';

interface LoadingStates {
  isInitializing: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  isRecovering: boolean;
  isNavigating: boolean;
  isRefreshing: boolean;
}

interface LoadingStateOptions {
  preventInteraction?: boolean;
  showSpinner?: boolean;
  timeoutMs?: number;
}

/**
 * Centralized auth loading state management
 * Prevents user interaction during auth transitions
 */
export const useAuthLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    isInitializing: true,
    isSigningIn: false,
    isSigningUp: false,
    isSigningOut: false,
    isRecovering: false,
    isNavigating: false,
    isRefreshing: false
  });

  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Set a specific loading state with optional timeout
   */
  const setLoadingState = useCallback((
    state: keyof LoadingStates,
    isLoading: boolean,
    options: LoadingStateOptions = {}
  ) => {
    const { timeoutMs = 15000 } = options;
    
    setLoadingStates(prev => ({
      ...prev,
      [state]: isLoading
    }));

    // Clear existing timeout for this state
    const existingTimeout = timeoutRefs.current.get(state);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutRefs.current.delete(state);
    }

    // Set timeout to auto-clear loading state if it gets stuck
    if (isLoading && timeoutMs > 0) {
      const timeoutId = setTimeout(() => {
        console.warn(`Loading state '${state}' timed out after ${timeoutMs}ms`);
        setLoadingStates(prev => ({
          ...prev,
          [state]: false
        }));
        timeoutRefs.current.delete(state);
      }, timeoutMs);
      
      timeoutRefs.current.set(state, timeoutId);
    }
  }, []);

  /**
   * Check if any auth operation is currently loading
   */
  const isAnyAuthLoading = useCallback(() => {
    return Object.values(loadingStates).some(state => state);
  }, [loadingStates]);

  /**
   * Check if user interaction should be prevented
   */
  const shouldPreventInteraction = useCallback(() => {
    return loadingStates.isInitializing || 
           loadingStates.isSigningIn || 
           loadingStates.isSigningUp || 
           loadingStates.isNavigating ||
           loadingStates.isRecovering;
  }, [loadingStates]);

  /**
   * Get loading message based on current state
   */
  const getLoadingMessage = useCallback(() => {
    if (loadingStates.isInitializing) return 'Initializing authentication...';
    if (loadingStates.isSigningIn) return 'Signing in...';
    if (loadingStates.isSigningUp) return 'Creating account...';
    if (loadingStates.isSigningOut) return 'Signing out...';
    if (loadingStates.isRecovering) return 'Recovering session...';
    if (loadingStates.isNavigating) return 'Navigating...';
    if (loadingStates.isRefreshing) return 'Refreshing session...';
    return null;
  }, [loadingStates]);

  /**
   * Clear all loading states
   */
  const clearAllLoadingStates = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    
    setLoadingStates({
      isInitializing: false,
      isSigningIn: false,
      isSigningUp: false,
      isSigningOut: false,
      isRecovering: false,
      isNavigating: false,
      isRefreshing: false
    });
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  return {
    loadingStates,
    setLoadingState,
    isAnyAuthLoading,
    shouldPreventInteraction,
    getLoadingMessage,
    clearAllLoadingStates,
    
    // Convenience methods for common operations
    setInitializing: (isLoading: boolean) => setLoadingState('isInitializing', isLoading),
    setSigningIn: (isLoading: boolean) => setLoadingState('isSigningIn', isLoading),
    setSigningUp: (isLoading: boolean) => setLoadingState('isSigningUp', isLoading),
    setSigningOut: (isLoading: boolean) => setLoadingState('isSigningOut', isLoading),
    setRecovering: (isLoading: boolean) => setLoadingState('isRecovering', isLoading),
    setNavigating: (isLoading: boolean) => setLoadingState('isNavigating', isLoading),
    setRefreshing: (isLoading: boolean) => setLoadingState('isRefreshing', isLoading)
  };
};
