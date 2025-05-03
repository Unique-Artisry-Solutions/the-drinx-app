
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isPreviewEnvironment } from '@/utils/environment';

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
    const setupId = Date.now().toString();
    console.log(`[AUTH SETUP ${setupId}] Starting AuthProvider setup...`);
    
    // Set loading state initially
    setIsLoading(true);
    
    // First check for admin bypass
    const { isAdminBypass, bypassUser } = checkAdminBypass();
    
    if (isAdminBypass && bypassUser) {
      console.log(`[AUTH SETUP ${setupId}] Admin bypass active, using bypass user:`, bypassUser.id);
      setUser(bypassUser);
      setIsEmailVerified(true);
      setIsLoading(false);
      updateLocalStorage(bypassUser);
      return;
    }
    
    // Check if admin session has expired
    if (checkAdminSession()) {
      console.log(`[AUTH SETUP ${setupId}] Admin session expired`);
      setIsLoading(false);
      return;
    }
    
    console.log(`[AUTH SETUP ${setupId}] Setting up auth state listener...`);
    
    // Set up auth state listener FIRST - this order is important
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[AUTH SETUP ${setupId}] Auth state changed:`, event, !!session);
        
        // Log detailed info for debugging
        if (session?.user) {
          console.log(`[AUTH SETUP ${setupId}] User ID:`, session.user.id);
          console.log(`[AUTH SETUP ${setupId}] User email:`, session.user.email);
          console.log(`[AUTH SETUP ${setupId}] User metadata:`, session.user.user_metadata);
          
          // Update our application state with the session information
          setSession(session);
          setUser(session.user);
          setIsEmailVerified(true);
          updateLocalStorage(session.user);
          
          // Check for user_type in metadata
          const userType = session.user.user_metadata?.user_type;
          console.log(`[AUTH SETUP ${setupId}] User type from metadata:`, userType);
          
          // Check if we have an active role that might override metadata
          try {
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role, is_active')
              .eq('user_id', session.user.id);
              
            console.log(`[AUTH SETUP ${setupId}] User roles from database:`, roles);
            
            if (roles && roles.length > 0) {
              const activeRole = roles.find(r => r.is_active);
              if (activeRole) {
                console.log(`[AUTH SETUP ${setupId}] Active role from database:`, activeRole.role);
                localStorage.setItem('user_type', activeRole.role);
              }
            }
          } catch (error) {
            console.warn(`[AUTH SETUP ${setupId}] Error fetching user roles:`, error);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log(`[AUTH SETUP ${setupId}] Sign out event received`);
          setSession(null);
          setUser(null);
          setIsEmailVerified(false);
          updateLocalStorage(null);
        }
      }
    );
    
    console.log(`[AUTH SETUP ${setupId}] Checking for existing session...`);
    
    // THEN check for existing session - this order is important
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(`[AUTH SETUP ${setupId}] Initial session check result:`, !!session);
      
      if (session) {
        console.log(`[AUTH SETUP ${setupId}] User ID from session:`, session.user.id);
        console.log(`[AUTH SETUP ${setupId}] User email from session:`, session.user.email);
        
        setSession(session);
        setUser(session.user);
        setIsEmailVerified(true);  
        updateLocalStorage(session.user);
      }
      
      setIsLoading(false);
    }).catch(err => {
      console.error(`[AUTH SETUP ${setupId}] Error during session check:`, err);
      setIsLoading(false);
    });
    
    // Force a session refresh to ensure we have the latest data
    refreshSession().catch(e => {
      console.error(`[AUTH SETUP ${setupId}] Error refreshing session:`, e);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
      console.log(`[AUTH SETUP ${setupId}] Auth setup cleanup`);
    };
  }, []);
};
