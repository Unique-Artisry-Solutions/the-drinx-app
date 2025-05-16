
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
    console.log('Starting AuthProvider setup...');
    
    // Set loading state initially
    setIsLoading(true);
    
    // Skip full auth setup in preview environment
    if (isPreviewEnvironment()) {
      console.log('Preview environment detected: using simplified auth setup');
      
      // In preview, we can either:
      // 1. Use a mock user (uncomment below)
      // const mockUser = {
      //   id: 'preview-user-id',
      //   email: 'preview@example.com',
      //   user_metadata: { full_name: 'Preview User' }
      // };
      // setUser(mockUser);
      // setIsEmailVerified(true);
      // setSession({ user: mockUser });
      
      // 2. Or just set null user (logged out state)
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      
      setIsLoading(false);
      return;
    }
    
    // First check for admin bypass
    const { isAdminBypass, bypassUser } = checkAdminBypass();
    
    if (isAdminBypass && bypassUser) {
      console.log('Admin bypass active, using bypass user:', bypassUser.id);
      setUser(bypassUser);
      setIsEmailVerified(true);
      setIsLoading(false);
      updateLocalStorage(bypassUser);
      return;
    }
    
    // Check if admin session has expired
    if (checkAdminSession()) {
      console.log('Admin session expired');
      setIsLoading(false);
      return;
    }
    
    console.log('Setting up auth state listener...');
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        // Log detailed info for debugging
        if (session?.user) {
          console.log('User ID:', session.user.id);
          console.log('User email:', session.user.email);
          console.log('User metadata:', session.user.user_metadata);
          
          // Check for user_type in metadata
          const userType = session.user.user_metadata?.user_type;
          console.log('User type from metadata:', userType);
          
          // Check if we have an active role that might override metadata
          try {
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role, is_active')
              .eq('user_id', session.user.id);
              
            console.log('User roles from database:', roles);
            
            if (roles && roles.length > 0) {
              const activeRole = roles.find(r => r.is_active);
              if (activeRole) {
                console.log('Active role from database:', activeRole.role);
              }
            }
          } catch (error) {
            console.warn('Error fetching user roles:', error);
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
    
    console.log('Checking for existing session...');
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check result:', !!session);
      
      if (session) {
        console.log('User ID from session:', session.user.id);
        console.log('User email from session:', session.user.email);
        
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
      console.log('Restoring session from storage, refreshing...');
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
