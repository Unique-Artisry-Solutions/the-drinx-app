
import { useState, useEffect, useCallback } from 'react';
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
  authStable: boolean;
  userType: UserType | null;
  navigationReady: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStable, setAuthStable] = useState(false);
  
  const { isDevelopment, isDevModeActive, devMode } = useDevelopmentMode();

  // Get effective auth state with dev bypass
  const effectiveAuth = DevAuthService.getEffectiveAuthState(
    user,
    session,
    !!user,
    isDevelopment,
    isDevModeActive,
    devMode
  );

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setAuthStable(true);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      setAuthStable(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const refreshSession = useCallback(async () => {
    const { data } = await supabase.auth.refreshSession();
    return { isEmailVerified: !!data.session?.user?.email_confirmed_at };
  }, []);

  return {
    user: effectiveAuth.user,
    session: effectiveAuth.session,
    isLoading: isLoading && !DevAuthService.shouldBypassAuth(isDevelopment, isDevModeActive, devMode),
    isAuthenticated: effectiveAuth.isAuthenticated,
    authStable,
    userType: effectiveAuth.userType,
    navigationReady: authStable && !isLoading,
    signIn,
    signOut,
    refreshSession
  };
};
