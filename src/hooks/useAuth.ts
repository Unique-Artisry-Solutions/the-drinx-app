
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { DevAuthService } from '@/services/DevAuthService';
import { UserType } from '@/types/navigation';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: UserType | null;
  authStable: boolean;
  isEmailVerified: boolean;
}

interface AuthActions {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
}

interface UseAuthReturn extends AuthState, AuthActions {
  // Computed properties
  isReady: boolean;
  hasValidSession: boolean;
  // Dev mode info
  isUsingDevBypass: boolean;
  // Utilities
  canAccess: (requiredUserType: UserType) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStable, setAuthStable] = useState(false);
  const { isDevelopment, isDevModeActive, devMode } = useDevelopmentMode();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setAuthStable(true);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      setAuthStable(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const refreshSession = async (): Promise<{ isEmailVerified: boolean }> => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    
    const isEmailVerified = !!(data.session?.user?.email_confirmed_at);
    return { isEmailVerified };
  };

  // Get effective auth state with dev bypass
  const effectiveAuth = DevAuthService.getEffectiveAuthState(
    user,
    session,
    !!user,
    isDevelopment,
    isDevModeActive,
    devMode
  );

  const shouldBypass = DevAuthService.shouldBypassAuth(isDevelopment, isDevModeActive, devMode);

  return {
    // Core state
    user: effectiveAuth.user,
    session: effectiveAuth.session,
    isLoading: isLoading && !shouldBypass,
    isAuthenticated: effectiveAuth.isAuthenticated,
    userType: effectiveAuth.userType as UserType,
    authStable,
    isEmailVerified: !!(effectiveAuth.user?.email_confirmed_at),

    // Actions
    signOut,
    refreshSession,
    signIn,

    // Computed properties
    isReady: authStable && !isLoading,
    hasValidSession: !!(effectiveAuth.user && effectiveAuth.session),

    // Dev mode info
    isUsingDevBypass: shouldBypass,

    // Utilities
    canAccess: (requiredUserType: UserType) => {
      return effectiveAuth.userType === requiredUserType;
    }
  };
};
