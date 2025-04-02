
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  // Check for admin bypass
  const checkAdminBypass = () => {
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
      setIsLoading(false);
      
      return { 
        isAdminBypass: true,
        bypassUser 
      };
    }
    
    return { isAdminBypass: false };
  };

  // Update localStorage based on session data
  const updateLocalStorage = (sessionUser: User | null) => {
    if (sessionUser) {
      localStorage.setItem('user_authenticated', 'true');
      if (sessionUser.email) {
        localStorage.setItem('user_email', sessionUser.email);
      }
      if (sessionUser.user_metadata?.user_type) {
        localStorage.setItem('user_type', sessionUser.user_metadata.user_type);
      }
      if (sessionUser.user_metadata?.username) {
        localStorage.setItem('user_username', sessionUser.user_metadata.username);
      }
    } else {
      // No active session, clear localStorage auth items (except admin)
      if (localStorage.getItem('user_authenticated')) {
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_username');
      }
    }
  };

  // Check if admin session is expired
  const checkAdminSession = () => {
    const adminSessionCreated = localStorage.getItem('admin_session_created');
    const SESSION_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
    
    if (adminSessionCreated) {
      const sessionTime = new Date(adminSessionCreated).getTime();
      const currentTime = new Date().getTime();
      
      if (currentTime - sessionTime > SESSION_EXPIRY_TIME) {
        // Admin session expired, log out
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_session_created');
        console.log('Admin session expired due to inactivity');
        return true;
      }
    }
    return false;
  };

  return {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    isEmailVerified,
    setIsEmailVerified,
    checkAdminBypass,
    updateLocalStorage,
    checkAdminSession,
    toast
  };
}
