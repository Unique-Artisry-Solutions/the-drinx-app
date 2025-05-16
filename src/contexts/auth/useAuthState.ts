
import { useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  // Check if admin bypass is enabled
  const checkAdminBypass = () => {
    const isEnabled = localStorage.getItem('admin_bypass') === 'true';
    const userType = localStorage.getItem('bypass_user_type');
    
    console.log('Admin bypass check:', { isEnabled, userType });
    
    return { isEnabled, userType };
  };

  // Update local storage based on user data
  const updateLocalStorage = (user: User | null) => {
    if (user) {
      localStorage.setItem('user_authenticated', 'true');
      if (user.email) {
        localStorage.setItem('user_email', user.email);
      }
      if (user.user_metadata?.user_type) {
        localStorage.setItem('user_type', user.user_metadata.user_type);
      }
    } else {
      // No active user, clear localStorage auth items (except admin)
      if (localStorage.getItem('user_authenticated')) {
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
      }
    }
  };

  // Check if admin session is active
  const checkAdminSession = () => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    return isAdmin;
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
};
