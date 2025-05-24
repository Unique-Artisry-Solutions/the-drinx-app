
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { debouncedToast } from '@/utils/debouncedToast';

/**
 * Hook that provides navigation guards to prevent navigation during auth loading states
 */
export const useNavigationGuard = () => {
  const { isLoading, authStable, navigationReady } = useAuth();

  /**
   * Check if navigation is safe to proceed
   */
  const canNavigate = useCallback(() => {
    return !isLoading && authStable && navigationReady;
  }, [isLoading, authStable, navigationReady]);

  /**
   * Guard function that prevents navigation if auth is not ready
   * @param action - Function to execute if navigation is allowed
   * @param errorMessage - Custom error message to show if navigation is blocked
   */
  const guardedNavigate = useCallback((
    action: () => void, 
    errorMessage = 'Please wait for authentication to complete'
  ) => {
    if (canNavigate()) {
      action();
    } else {
      console.log('Navigation blocked - auth not ready');
      debouncedToast.error('Navigation Blocked', errorMessage, 3000);
    }
  }, [canNavigate]);

  return {
    canNavigate,
    guardedNavigate,
    isNavigationBlocked: !canNavigate()
  };
};

export default useNavigationGuard;
