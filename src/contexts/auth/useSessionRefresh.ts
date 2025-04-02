
import { Session, User } from '@supabase/supabase-js';

interface UseSessionRefreshProps {
  refreshSessionAction: () => Promise<{
    session: Session | null;
    user: User | null;
    isEmailVerified: boolean;
  }>;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
  updateLocalStorage: (user: User | null) => void;
}

export function useSessionRefresh({
  refreshSessionAction,
  setSession,
  setUser,
  setIsEmailVerified,
  updateLocalStorage
}: UseSessionRefreshProps) {
  const refreshSession = async () => {
    console.log('Refreshing session in AuthProvider');
    // Check if admin bypass is enabled
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    
    if (isAdminBypass) {
      // Create a pseudo user based on localStorage
      const bypassEmail = localStorage.getItem('user_email') || 'bypass@example.com';
      const userType = localStorage.getItem('user_type') || 'individual';
      
      const bypassUser = {
        id: 'admin-bypass-id',
        email: bypassEmail,
        user_metadata: {
          user_type: userType,
          username: localStorage.getItem('user_username') || 'bypass-user'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as unknown as User;
      
      setUser(bypassUser);
      setIsEmailVerified(true);
      
      return { 
        session: null, 
        user: bypassUser,
        isEmailVerified: true
      };
    }
    
    // Normal refresh session logic
    const result = await refreshSessionAction();
    console.log('Session refresh result:', result);
    setSession(result.session);
    setUser(result.user);
    
    if (result.isEmailVerified !== undefined) {
      setIsEmailVerified(result.isEmailVerified);
    }
    
    // Also update localStorage to ensure consistency
    if (result.user) {
      updateLocalStorage(result.user);
    }
    
    return { isEmailVerified: result.isEmailVerified };
  };

  return { refreshSession };
}
