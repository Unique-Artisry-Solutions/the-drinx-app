
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
}

interface AuthActions {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
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

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
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

    // Actions
    signOut,
    refreshSession,

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
