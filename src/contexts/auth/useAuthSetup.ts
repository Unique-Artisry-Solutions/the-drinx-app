
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ToastActionElement } from '@/components/ui/toast';

interface UseAuthSetupProps {
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateLocalStorage: (user: any) => void;
  checkAdminBypass: () => { isEnabled: boolean; userType: string | null };
  checkAdminSession: () => boolean;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  toast: {
    toast: (props: { 
      title?: string; 
      description?: string; 
      action?: ToastActionElement;
      variant?: 'default' | 'destructive';
    }) => void;
  };
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
  // Initialize auth state and setup listeners
  useEffect(() => {
    console.log('Starting AuthProvider setup...');
    
    // In preview environment, use simplified auth
    if (window.location.hostname.includes('lovable.app')) {
      console.log('Preview environment detected: using simplified auth setup');
      setIsLoading(false);
      return;
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth event: ${event}`, !!session);
        
        if (session) {
          setSession(session);
          setUser(session.user);
          setIsEmailVerified(!!session.user.email_confirmed_at);
          updateLocalStorage(session.user);
        } else {
          setSession(null);
          setUser(null);
          setIsEmailVerified(false);
          updateLocalStorage(null);
          
          if (event === 'SIGNED_OUT') {
            toast.toast({
              title: "Signed out",
              description: "You have been signed out successfully."
            });
          }
        }
      }
    );
    
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        // Check if admin bypass is enabled
        const { isEnabled, userType } = checkAdminBypass();
        if (isEnabled) {
          console.log('Admin bypass active, bypassing auth check');
          setIsLoading(false);
          return;
        }
        
        // Check if admin session is active
        if (checkAdminSession()) {
          console.log('Admin session active');
          setIsLoading(false);
          return;
        }
        
        // Check for Supabase session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting auth session:', error);
          throw error;
        }
        
        if (data.session) {
          console.log('Found existing session:', !!data.session);
          setSession(data.session);
          setUser(data.session.user);
          setIsEmailVerified(!!data.session.user.email_confirmed_at);
          updateLocalStorage(data.session.user);
          
          // Refresh session to ensure it's valid
          await refreshSession();
        }
      } catch (error) {
        console.error('Auth setup error:', error);
        toast.toast({
          title: "Authentication Error",
          description: "There was a problem setting up authentication.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingSession();
    
    // Cleanup on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
