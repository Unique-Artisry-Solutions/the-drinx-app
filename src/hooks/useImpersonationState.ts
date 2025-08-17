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
    if (!authStable) {
      setIsLoading(true);
      return;
    }

    const checkImpersonation = () => {
      const backup = getImpersonationBackup();
      
      // Basic impersonation check: backup exists and current user is different
      const basicImpersonation = !!(
        backup && 
        user && 
        backup.user_id !== user.id
      );

      // Enhanced magic link impersonation check with multiple flag sources
      const impersonationFlags = {
        sessionActive: sessionStorage.getItem('impersonation_active'),
        sessionMagicLink: sessionStorage.getItem('impersonation_magic_link'),
        localBackup: localStorage.getItem('impersonation_active_backup'),
        localMagicLink: localStorage.getItem('impersonation_magic_link_backup')
      };
      
      const hasAnyImpersonationFlag = !!(
        impersonationFlags.sessionActive || 
        impersonationFlags.sessionMagicLink ||
        impersonationFlags.localBackup ||
        impersonationFlags.localMagicLink
      );

      const magicLinkImpersonation = !!(
        backup && 
        isAuthenticated && 
        hasAnyImpersonationFlag
      );

      const finalImpersonating = basicImpersonation || magicLinkImpersonation;

      console.log('🎭 useImpersonationState - Enhanced impersonation check:', {
        basicImpersonation,
        magicLinkImpersonation,
        finalImpersonating,
        hasBackup: !!backup,
        hasUser: !!user,
        isAuthenticated,
        backupUserId: backup?.user_id,
        currentUserId: user?.id,
        impersonationFlags
      });

      setIsImpersonating(finalImpersonating);
      setImpersonationBackup(backup);
    };

    checkImpersonation();
    setIsLoading(false);
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