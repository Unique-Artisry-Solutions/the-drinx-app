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
      
      // Enhanced impersonation detection including magic link flows
      const basicImpersonation = Boolean(
        backup && 
        user && 
        isAuthenticated && 
        backup.user_id !== user.id
      );
      
      // Check for active impersonation from magic link flow
      const magicLinkImpersonation = Boolean(
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem('impersonation_active') === 'true' &&
        backup &&
        user &&
        isAuthenticated
      );
      
      const finalImpersonating = basicImpersonation || magicLinkImpersonation;
      
      console.log('🎭 useImpersonationState - Impersonation check:', {
        basicImpersonation,
        magicLinkImpersonation,
        finalImpersonating,
        hasBackup: !!backup,
        hasUser: !!user,
        isAuthenticated,
        backupUserId: backup?.user_id,
        currentUserId: user?.id,
        impersonationActiveFlag: typeof window !== 'undefined' ? window.sessionStorage.getItem('impersonation_active') : null
      });
      
      setIsImpersonating(finalImpersonating);
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