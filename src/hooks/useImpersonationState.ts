import { useState, useEffect } from 'react';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { getImpersonationBackup } from '@/utils/impersonation';

/**
 * Hook to manage impersonation state safely
 */
export const useImpersonationState = () => {
  const { user, isAuthenticated, authStable } = useAuthenticatedUser();
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonationBackup, setImpersonationBackup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only check impersonation state when auth is stable
    if (!authStable) {
      setIsLoading(true);
      return;
    }

    try {
      const backup = getImpersonationBackup();
      setImpersonationBackup(backup);
      
      // Determine if we're impersonating
      const impersonating = Boolean(
        backup && 
        user && 
        isAuthenticated && 
        backup.user_id !== user.id
      );
      
      setIsImpersonating(impersonating);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error checking impersonation state:', error);
      setIsImpersonating(false);
      setImpersonationBackup(null);
      setIsLoading(false);
    }
  }, [user, isAuthenticated, authStable]);

  return {
    isImpersonating,
    impersonationBackup,
    isLoading: isLoading || !authStable,
    currentUser: user,
    adminUserId: impersonationBackup?.user_id || null
  };
};

export default useImpersonationState;