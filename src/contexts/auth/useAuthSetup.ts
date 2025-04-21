
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UseAuthSetupProps {
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateLocalStorage: (user: any) => void;
  checkAdminBypass: () => { isAdminBypass: boolean; bypassUser?: any };
  checkAdminSession: () => boolean;
  refreshSession: () => Promise<{ isEmailVerified?: boolean }>;
  toast: any;
}

export const useAuthSetup = ({
  setSession,
  setUser,
  setIsEmailVerified,
  setIsLoading,
  updateLocalStorage,
  checkAdminBypass,
  checkAdminSession,
  refreshSession,
  toast
}: UseAuthSetupProps) => {
  useEffect(() => {
    console.log('AuthProvider setup running...');
    
    // Set loading state initially
    setIsLoading(true);
    
    // First check for admin bypass
    const { isAdminBypass, bypassUser } = checkAdminBypass();
    
    if (isAdminBypass && bypassUser) {
      console.log('Admin bypass active, using bypass user');
      setUser(bypassUser);
      setIsEmailVerified(true);
      setIsLoading(false);
      updateLocalStorage(bypassUser);
      return;
    }
    
    // Check if admin session has expired
    if (checkAdminSession()) {
      setIsLoading(false);
      return;
    }
    
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        // We need some delay to avoid race conditions
        setTimeout(() => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // We assume email is verified if we get here
            setIsEmailVerified(true);
            updateLocalStorage(session.user);
          } else if (event === 'SIGNED_OUT') {
            setIsEmailVerified(false);
            updateLocalStorage(null);
          }
        }, 0);
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      
      if (session) {
        setSession(session);
        setUser(session.user);
        setIsEmailVerified(true);  
        updateLocalStorage(session.user);
      }
      
      setIsLoading(false);
    });
    
    // Show a notification if the session was recovered from storage
    const hasStoredSession = localStorage.getItem('spiritless-auth-storage') ? true : false;
    
    if (hasStoredSession) {
      console.log('Restoring session from storage');
      refreshSession().catch(e => {
        console.error('Error refreshing session:', e);
        toast({
          title: "Session Expired",
          description: "Please sign in again",
          variant: "destructive"
        });
      });
    }
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
};
