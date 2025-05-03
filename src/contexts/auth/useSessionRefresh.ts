
import { useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UseSessionRefreshProps {
  refreshSessionAction: () => Promise<{
    session: Session | null;
    user: User | null;
    isEmailVerified: boolean;
  }>;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsEmailVerified: (verified: boolean) => void;
  updateLocalStorage: (user: User | null) => void;
}

export function useSessionRefresh({
  refreshSessionAction,
  setSession,
  setUser,
  setIsEmailVerified,
  updateLocalStorage
}: UseSessionRefreshProps) {
  // Refresh user session and profile data
  const refreshSession = useCallback(async () => {
    console.log('Refreshing session in useSessionRefresh...');
    
    // Check for admin bypass first
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    if (isAdminBypass) {
      console.log('Admin bypass active, skipping normal session refresh');
      
      // Create a pseudo user object for bypass
      const bypassUserId = localStorage.getItem('bypass_user_id');
      const userType = localStorage.getItem('user_type') || 'individual';
      const bypassEmail = localStorage.getItem('user_email') || 'bypass@example.com';
      const username = localStorage.getItem('user_username') || 'bypass-user';
      
      // Only create bypass user if we have all the required data
      if (bypassUserId && userType) {
        console.log('Creating bypass user for:', userType);
        
        const bypassUser = {
          id: bypassUserId,
          email: bypassEmail,
          user_metadata: {
            user_type: userType,
            username: username
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as unknown as User;
        
        setUser(bypassUser);
        setIsEmailVerified(true);
        
        return { isEmailVerified: true };
      }
    }
    
    // Regular session refresh
    try {
      // First check for session manually
      console.log('Checking for existing session');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw sessionError;
      }
      
      if (sessionData.session) {
        console.log('Session found, updating user state');
        setSession(sessionData.session);
        setUser(sessionData.session.user);
        setIsEmailVerified(true);
        updateLocalStorage(sessionData.session.user);
        
        // Check if we need to update user_type from roles table
        try {
          const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role, is_active')
            .eq('user_id', sessionData.session.user.id)
            .eq('is_active', true)
            .single();
            
          if (!rolesError && roles) {
            console.log('Found active role in database:', roles.role);
            localStorage.setItem('user_type', roles.role);
            
            // Store login information in localStorage instead of sessionStorage
            localStorage.setItem('login_user_type', roles.role);
          }
        } catch (roleError) {
          console.warn('Error fetching active role:', roleError);
        }
        
        return { isEmailVerified: true };
      } else {
        console.log('No session found, attempting refresh');
      }
      
      // If no session or needs refresh, use the action
      const { session, user, isEmailVerified } = await refreshSessionAction();
      
      if (session && user) {
        console.log('Session refreshed successfully');
        setSession(session);
        setUser(user);
        setIsEmailVerified(isEmailVerified);
        updateLocalStorage(user);
      } else {
        console.log('No session after refresh');
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
        updateLocalStorage(null);
      }
      
      return { isEmailVerified };
    } catch (error) {
      console.error('Error refreshing session:', error);
      // Keep current state, don't clear on error
      return { isEmailVerified: false };
    }
  }, [refreshSessionAction, setSession, setUser, setIsEmailVerified, updateLocalStorage]);

  return { refreshSession };
}
