
import { useCallback } from 'react';

interface UseSessionRefreshProps {
  refreshSessionAction: () => Promise<{ 
    session: any; 
    user: any; 
    isEmailVerified: boolean;
  }>;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
  updateLocalStorage: (user: any) => void;
}

export const useSessionRefresh = ({
  refreshSessionAction,
  setSession,
  setUser,
  setIsEmailVerified,
  updateLocalStorage
}: UseSessionRefreshProps) => {
  // Refresh session and update state
  const refreshSession = useCallback(async () => {
    try {
      const { session, user, isEmailVerified } = await refreshSessionAction();
      
      setSession(session);
      setUser(user);
      setIsEmailVerified(isEmailVerified);
      
      if (user) {
        updateLocalStorage(user);
      }
      
      return { isEmailVerified };
    } catch (error) {
      console.error('Session refresh error:', error);
      return { isEmailVerified: false };
    }
  }, [refreshSessionAction, setSession, setUser, setIsEmailVerified, updateLocalStorage]);
  
  return { refreshSession };
};
