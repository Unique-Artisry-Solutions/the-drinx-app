
import { useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  // Refresh user session and profile data with improved error handling
  const refreshSession = useCallback(async () => {
    console.log('[SESSION REFRESH] Starting session refresh...');
    
    // Check for admin bypass first
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    if (isAdminBypass) {
      console.log('[SESSION REFRESH] Admin bypass active, using bypass user');
      
      // Create a pseudo user object for bypass
      const bypassUserId = localStorage.getItem('bypass_user_id');
      const userType = localStorage.getItem('user_type') || 'individual';
      const bypassEmail = localStorage.getItem('user_email') || 'bypass@example.com';
      const username = localStorage.getItem('user_username') || 'bypass-user';
      
      // Only create bypass user if we have all the required data
      if (bypassUserId && userType) {
        console.log('[SESSION REFRESH] Creating bypass user for:', userType);
        
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
      // First check for session manually with timeout protection
      console.log('[SESSION REFRESH] Checking for existing session');
      
      // Set up a promise with timeout to prevent hanging
      const sessionPromise = new Promise(async (resolve, reject) => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
      
      // Set a timeout of 5 seconds to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Session check timed out')), 5000);
      });
      
      // Race the promises
      const sessionData = await Promise.race([sessionPromise, timeoutPromise]) as { session: Session | null };
      
      if (sessionData.session) {
        console.log('[SESSION REFRESH] Session found, updating user state');
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
            console.log('[SESSION REFRESH] Found active role in database:', roles.role);
            localStorage.setItem('user_type', roles.role);
            localStorage.setItem('login_user_type', roles.role);
          }
        } catch (roleError) {
          console.warn('[SESSION REFRESH] Error fetching active role:', roleError);
        }
        
        return { isEmailVerified: true };
      } else {
        console.log('[SESSION REFRESH] No session found, attempting refresh');
      }
      
      // If no session or needs refresh, use the action with timeout protection
      const refreshPromise = refreshSessionAction();
      const refreshTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Session refresh timed out')), 8000);
      });
      
      const { session, user, isEmailVerified } = await Promise.race([
        refreshPromise, 
        refreshTimeoutPromise
      ]) as { 
        session: Session | null; 
        user: User | null; 
        isEmailVerified: boolean 
      };
      
      if (session && user) {
        console.log('[SESSION REFRESH] Session refreshed successfully');
        setSession(session);
        setUser(user);
        setIsEmailVerified(isEmailVerified);
        updateLocalStorage(user);
        return { isEmailVerified };
      } else {
        console.log('[SESSION REFRESH] No session after refresh, clearing state');
        // Clean state to prevent UI from being stuck - this is critical
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
        updateLocalStorage(null);
        
        // Mark the loading as complete even if we couldn't get a session
        window.isLoading = false;
        return { isEmailVerified: false };
      }
    } catch (error) {
      console.error('[SESSION REFRESH] Error refreshing session:', error);
      
      // Always reset the loading state to prevent UI from being stuck
      window.isLoading = false;
      
      // Check if we still have a valid session stored in localStorage
      try {
        const storedSession = localStorage.getItem('spiritless-auth-storage');
        if (storedSession) {
          console.log('[SESSION REFRESH] Found stored session, using as fallback');
          
          // Attempt retry after small delay
          setTimeout(() => {
            refreshSessionAction().catch(e => 
              console.warn('[SESSION REFRESH] Retry also failed:', e));
          }, 2000);
        } else {
          // If no session in storage, clear the user state to avoid stuck UI
          setSession(null);
          setUser(null);
          setIsEmailVerified(false);
          updateLocalStorage(null);
        }
      } catch (storageError) {
        console.warn('[SESSION REFRESH] Storage check failed:', storageError);
        // Clear state in case of any storage errors
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
        updateLocalStorage(null);
      }
      
      return { isEmailVerified: false };
    }
  }, [refreshSessionAction, setSession, setUser, setIsEmailVerified, updateLocalStorage]);

  return { refreshSession };
}
