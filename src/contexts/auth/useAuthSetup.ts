import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { debouncedToast } from '@/utils/debouncedToast';

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
  refreshSession,
}) {
  useEffect(() => {
    console.log('AuthProvider useEffect running');
    let isInitialAuth = true;
    
    // Check for admin bypass first
    const { isAdminBypass, bypassUser } = checkAdminBypass();
    
    if (isAdminBypass && bypassUser) {
      console.log('Admin bypass active, using bypass user', bypassUser);
      setUser(bypassUser);
      setIsEmailVerified(true);
      setIsLoading(false);
      return;
    }
    
    // Set up auth listener FIRST
    const setupAuthListener = async () => {
      console.log('Setting up auth listener');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, currentSession) => {
          console.log('Auth state changed:', event, currentSession);
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          // Update email verification status
          if (currentSession?.user) {
            setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
            
            if (event === 'SIGNED_IN' && !isInitialAuth) {
              updateLocalStorage(currentSession.user);
              debouncedToast.success(
                "Signed In",
                `Welcome back, ${currentSession.user.email}!`
              );
            } else if (event === 'SIGNED_OUT') {
              updateLocalStorage(null);
              debouncedToast.success(
                "Signed Out",
                "You have been successfully signed out."
              );
            }
          }
          
          setIsLoading(false);
          isInitialAuth = false;
        }
      );
      
      return subscription;
    };
    
    // Initialize in the correct order
    let subscription: { unsubscribe: () => void } | null = null;
    
    const initialize = async () => {
      subscription = await setupAuthListener();
      
      // Check existing session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setIsLoading(false);
      
      if (data.session?.user) {
        setIsEmailVerified(data.session.user.email_confirmed_at !== null);
        updateLocalStorage(data.session.user);
      }
    };
    
    initialize();
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return null;
}
