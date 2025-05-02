
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
    
    // Special handling for preview environment
    const inPreviewEnv = isPreviewEnvironment();
    if (inPreviewEnv) {
      console.log(`[AUTH SETUP ${setupId}] Preview environment detected: using enhanced setup`);
      
      // In preview, we force persistence settings for auth
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          console.log(`[AUTH SETUP ${setupId}] Found existing session in preview`);
          return { data };
        } else {
          console.log(`[AUTH SETUP ${setupId}] No session found in preview environment`);
          return { data: { session: null } };
        }
      });
    }
    
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
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[AUTH SETUP ${setupId}] Auth state changed:`, event, !!session);
        
        // Log detailed info for debugging
        if (session?.user) {
          console.log(`[AUTH SETUP ${setupId}] User ID:`, session.user.id);
          console.log(`[AUTH SETUP ${setupId}] User email:`, session.user.email);
          console.log(`[AUTH SETUP ${setupId}] User metadata:`, session.user.user_metadata);
          
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
              }
            }
          } catch (error) {
            console.warn(`[AUTH SETUP ${setupId}] Error fetching user roles:`, error);
          }
        }
        
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
    
    console.log(`[AUTH SETUP ${setupId}] Checking for existing session...`);
    // THEN check for existing session
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
    });
    
    // Check if we need to refresh the session
    // In preview environment, we always refresh to ensure a consistent state
    const shouldRefreshSession = inPreviewEnv || localStorage.getItem('spiritless-auth-storage');
    
    if (shouldRefreshSession) {
      console.log(`[AUTH SETUP ${setupId}] ${inPreviewEnv ? 'Preview environment' : 'Stored session'} detected, refreshing session...`);
      refreshSession().catch(e => {
        console.error(`[AUTH SETUP ${setupId}] Error refreshing session:`, e);
        // Only show toast in non-preview env
        if (!inPreviewEnv) {
          toast({
            title: "Session Expired",
            description: "Please sign in again",
            variant: "destructive"
          });
        }
      });
    }
    
    return () => {
      authListener.subscription.unsubscribe();
      console.log(`[AUTH SETUP ${setupId}] Auth setup cleanup`);
    };
  }, []);
};

