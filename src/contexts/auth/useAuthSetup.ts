
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthSetupProps {
  setSession: (session: Session | null) => void;
  setUser: (user: any) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateLocalStorage: (user: any) => void;
  checkAdminBypass: () => { isAdminBypass: boolean; bypassUser?: any };
  checkAdminSession: () => boolean;
  refreshSession: () => Promise<any>;
}

export function useAuthSetup({
  setSession,
  setUser,
  setIsEmailVerified,
  setIsLoading,
  updateLocalStorage,
  checkAdminBypass,
  checkAdminSession,
  refreshSession
}: UseAuthSetupProps) {
  useEffect(() => {
    console.log('AuthProvider useEffect running');
    
    // Check for admin bypass
    const { isAdminBypass, bypassUser } = checkAdminBypass();
    
    if (isAdminBypass) {
      // Skip the rest of the auth checks
      return;
    }
    
    // Set up auth listener FIRST, then check current session
    const setupAuthListener = async () => {
      console.log('Setting up auth listener');
      // Set up authentication state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event, currentSession);
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          // Update email verification status
          if (currentSession?.user) {
            setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
            
            if (event === 'SIGNED_IN') {
              // If email is verified, store authentication state in localStorage
              if (currentSession.user.email_confirmed_at) {
                updateLocalStorage(currentSession.user);
              }
            } else if (event === 'SIGNED_OUT') {
              updateLocalStorage(null);
            }
          }
          
          setIsLoading(false);
        }
      );
      
      return subscription;
    };
    
    // Check active session
    const checkSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('Session check result:', data);
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Set email verification status
        if (data.session?.user) {
          console.log('User email verified status:', data.session.user.email_confirmed_at !== null);
          setIsEmailVerified(data.session.user.email_confirmed_at !== null);
          
          // Ensure localStorage is consistent with session state
          updateLocalStorage(data.session.user);
        } else {
          updateLocalStorage(null);
        }
        
        checkAdminSession();
        setIsLoading(false);
      } catch (error) {
        console.error('Error in checkSession:', error);
        setIsLoading(false);
      }
    };

    // Initialize in the correct order
    let subscription: { unsubscribe: () => void } | null = null;
    
    const initialize = async () => {
      // 1. Set up listener first
      subscription = await setupAuthListener();
      // 2. Then check for existing session
      await checkSession();
    };
    
    initialize();

    // Check for email verification in URL
    const checkEmailVerification = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('email_confirmed') === 'true') {
        console.log('Email verification detected in URL');
        refreshSession();
      }
    };
    
    checkEmailVerification();
    
    // Set up a periodic session check and refresh
    const sessionCheckInterval = setInterval(() => {
      refreshSession();
      checkAdminSession();
    }, 15 * 60 * 1000); // Check every 15 minutes

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      clearInterval(sessionCheckInterval);
    };
  }, []);

  return null;
}
