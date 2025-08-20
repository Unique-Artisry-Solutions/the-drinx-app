import { useState, useEffect } from 'react';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { impersonationManager, getImpersonationState } from '@/utils/impersonationSimplified';

/**
 * Simplified hook to manage impersonation state safely
 */
export const useImpersonationState = () => {
  const { user, isAuthenticated, authStable } = useAuthenticatedUser();
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonationBackup, setImpersonationBackup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [targetEmail, setTargetEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!authStable) {
      setIsLoading(true);
      return;
    }

    const checkImpersonation = () => {
      try {
        // Force refresh state after auth changes
        impersonationManager.refreshState();
        
        const state = getImpersonationState();
        const backup = state.backup;
        
        // Determine if we're impersonating
        let finalImpersonating = false;
        
        if (backup && isAuthenticated) {
          // Check if current user is different from backup user (basic impersonation)
          const basicImpersonation = !!(user && backup.user_id !== user.id);
          
          // Check if impersonation is flagged as active
          const activeImpersonation = state.isActive;
          
          finalImpersonating = basicImpersonation || activeImpersonation;
          
          console.log('🎭 useImpersonationState - Simplified check:', {
            hasBackup: true,
            basicImpersonation,
            activeImpersonation,
            finalImpersonating,
            hasUser: !!user,
            isAuthenticated,
            backupUserId: backup.user_id,
            currentUserId: user?.id,
            currentUserEmail: user?.email,
            targetEmail: state.targetEmail,
            stateAge: backup.created_at ? Date.now() - backup.created_at : null
          });
        }

        setIsImpersonating(finalImpersonating);
        setImpersonationBackup(backup);
        setTargetEmail(state.targetEmail || null);
        
      } catch (error) {
        console.error('❌ Error checking impersonation state:', error);
        setIsImpersonating(false);
        setImpersonationBackup(null);
        setTargetEmail(null);
      }
    };

    checkImpersonation();
    setIsLoading(false);
  }, [user, isAuthenticated, authStable]);

  return {
    isImpersonating,
    impersonationBackup,
    isLoading: isLoading || !authStable,
    currentUser: user,
    adminUserId: impersonationBackup?.user_id || null,
    targetEmail,
    isStable: authStable && !isLoading
  };
};

export default useImpersonationState;