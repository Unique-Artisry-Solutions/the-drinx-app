
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  // Check for admin bypass
  const checkAdminBypass = () => {
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    console.log("Checking admin bypass:", isAdminBypass);
    
    if (isAdminBypass) {
      // Create a pseudo user based on localStorage
      const bypassEmail = localStorage.getItem('user_email') || 'bypass@example.com';
      const userType = localStorage.getItem('user_type') || 'individual';
      const username = localStorage.getItem('user_username') || 'bypass-user';
      
      // Generate a valid UUID for the bypass user instead of using a string
      const bypassUserId = localStorage.getItem('bypass_user_id') || uuidv4();
      
      // Store the bypass user ID for consistency
      localStorage.setItem('bypass_user_id', bypassUserId);
      
      console.log("Creating bypass user with ID:", bypassUserId, "type:", userType, "email:", bypassEmail);
      
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
    console.log("Updating localStorage from session user:", sessionUser);
    if (sessionUser) {
      localStorage.setItem('user_authenticated', 'true');
      if (sessionUser.email) {
        localStorage.setItem('user_email', sessionUser.email);
      }
      if (sessionUser.user_metadata?.user_type) {
        localStorage.setItem('user_type', sessionUser.user_metadata.user_type);
        console.log("Setting user_type in localStorage:", sessionUser.user_metadata.user_type);
      }
      if (sessionUser.user_metadata?.username) {
        localStorage.setItem('user_username', sessionUser.user_metadata.username);
      }
      
      // See if we need to set any additional role-specific data
      const userType = sessionUser.user_metadata?.user_type;
      if (userType === 'promoter') {
        // Set promoter name if we don't already have it
        if (!localStorage.getItem('promoter_name') && sessionUser.user_metadata?.name) {
          localStorage.setItem('promoter_name', sessionUser.user_metadata.name);
        }
      } else if (userType === 'establishment') {
        // Set establishment name if we don't already have it
        if (!localStorage.getItem('establishment_name') && sessionUser.user_metadata?.name) {
          localStorage.setItem('establishment_name', sessionUser.user_metadata.name);
        }
      }
    } else {
      // No active session, clear localStorage auth items (except admin)
      if (localStorage.getItem('user_authenticated')) {
        console.log("Clearing user authentication data from localStorage");
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
        console.log("Admin session expired, logging out");
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_session_created');
        
        toast({
          title: "Session Expired",
          description: "Your admin session has expired. Please log in again.",
          variant: "destructive"
        });
        
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
