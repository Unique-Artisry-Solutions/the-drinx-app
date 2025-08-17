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
      
      // Simplified impersonation detection - streamlined for better reliability
      let finalImpersonating = false;
      
      if (backup) {
        // Method 1: Basic impersonation (different user IDs)
        const basicImpersonation = !!(user && backup.user_id !== user.id);
        
        // Method 2: Magic link impersonation (backup exists + any impersonation flag + authenticated)
        const hasImpersonationFlag = !!(
          sessionStorage.getItem('impersonation_active') ||
          sessionStorage.getItem('impersonation_magic_link') ||
          localStorage.getItem('impersonation_active_backup')
        );
        
        const magicLinkImpersonation = !!(isAuthenticated && hasImpersonationFlag);
        
        finalImpersonating = basicImpersonation || magicLinkImpersonation;
        
        console.log('🎭 useImpersonationState - Streamlined impersonation check:', {
          hasBackup: true,
          basicImpersonation,
          magicLinkImpersonation,
          finalImpersonating,
          hasUser: !!user,
          isAuthenticated,
          backupUserId: backup.user_id,
          currentUserId: user?.id,
          currentUserEmail: user?.email,
          impersonationFlags: {
            sessionActive: !!sessionStorage.getItem('impersonation_active'),
            sessionMagicLink: !!sessionStorage.getItem('impersonation_magic_link'),
            localBackup: !!localStorage.getItem('impersonation_active_backup')
          }
        });
      }

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