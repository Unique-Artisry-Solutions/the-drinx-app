
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { debouncedToast } from '@/utils/debouncedToast';
import { useAuthLoadingStates } from '@/hooks/useAuthLoadingStates';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { timeoutManager } from '@/utils/auth/timeoutManager';
import { authCache } from './authCache';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import type { AuthContextType, AuthState } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management with literal types
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [navigationReady, setNavigationReady] = useState(false);

  const { setInitializing } = useAuthLoadingStates();
  const initializationRef = useRef(false);
  const { goToAfterLogin } = useAppNavigation();

  // Safe userType conversion function
  const convertToUserType = (value: any): 'individual' | 'establishment' | 'promoter' | 'admin' => {
    if (typeof value === 'string' && ['individual', 'establishment', 'promoter', 'admin'].includes(value)) {
      return value as 'individual' | 'establishment' | 'promoter' | 'admin';
    }
    return 'individual';
  };

  // Simple initialization function
  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    try {
      setIsLoading(true);
      setInitializing(true);

      console.log('AuthProvider - Starting simple initialization');

      // Get current session
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('AuthProvider - Session retrieval error:', error.message);
        setAuthError(error);
      }

      if (currentSession && currentSession.user) {
        console.log('AuthProvider - Session found, setting up user state');
        setSession(currentSession);
        setUser(currentSession.user);
        setIsAuthenticated(true);
        setIsEmailVerified(!!currentSession.user.email_confirmed_at);
        
        // Safely convert userType
        const rawUserType = currentSession.user.user_metadata?.user_type;
        const safeUserType = convertToUserType(rawUserType);
        setUserType(safeUserType);
        
        // Update cache
        authCache.setUserType(currentSession.user.id, safeUserType);
      } else {
        console.log('AuthProvider - No session found');
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setUserType('individual');
      }

    } catch (error) {
      console.error('AuthProvider - Initialization error:', error);
      const authErrorObj: AuthError = {
        name: 'AuthError',
        message: error instanceof Error ? error.message : 'Authentication initialization failed',
        status: 500,
        code: 'auth_init_error',
        __isAuthError: true
      };
      setAuthError(authErrorObj);
    } finally {
      // Always set these to true to prevent loops
      setAuthStable(true);
      setNavigationReady(true);
      setIsLoading(false);
      setInitializing(false);
    }
  }, [setInitializing]);

  // Recovery function (separate from initialization)
  const handleRecoveryAuth = useCallback(async (): Promise<boolean> => {
    try {
      console.log('AuthProvider - Starting auth recovery');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (!error && data.session && data.session.user) {
        setSession(data.session);
        setUser(data.session.user);
        setIsAuthenticated(true);
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
        
        const rawUserType = data.session.user.user_metadata?.user_type;
        const safeUserType = convertToUserType(rawUserType);
        setUserType(safeUserType);
        
        console.log('AuthProvider - Recovery successful');
        return true;
      }
      
      console.log('AuthProvider - Recovery failed, clearing state');
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setUserType('individual');
      return false;
      
    } catch (error) {
      console.error('AuthProvider - Recovery error:', error);
      const authErrorObj: AuthError = {
        name: 'AuthError',
        message: error instanceof Error ? error.message : 'Auth recovery failed',
        status: 500,
        code: 'auth_recovery_error',
        __isAuthError: true
      };
      setAuthError(authErrorObj);
      return false;
    }
  }, []);

  // Auth state change handler
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('AuthProvider - Auth state change:', event);
        
        if (event === 'SIGNED_IN' && newSession && newSession.user) {
          setSession(newSession);
          setUser(newSession.user);
          setIsAuthenticated(true);
          setIsEmailVerified(!!newSession.user.email_confirmed_at);
          
          const rawUserType = newSession.user.user_metadata?.user_type;
          const safeUserType = convertToUserType(rawUserType);
          setUserType(safeUserType);
          
          authCache.setUserType(newSession.user.id, safeUserType);
          
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          setUserType('individual');
          setIsEmailVerified(false);
          authCache.clear();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: new Error(error.message), data: null };
      }

      return { error: null, data };
    } catch (error) {
      return { 
        error: error instanceof Error ? error : new Error('Sign in failed'), 
        data: null 
      };
    }
  }, []);

  const signUp = useCallback(async (formData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: formData.data,
          emailRedirectTo: formData.emailRedirectTo
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      sessionPersistenceService.clearSession();
      authCache.clear();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
        return { isEmailVerified: !!data.session.user.email_confirmed_at };
      }
      return { isEmailVerified: false };
    } catch (error) {
      return { isEmailVerified: false };
    }
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      setIsVerificationEmailSent(true);
    } catch (error) {
      console.error('Send verification email error:', error);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }, []);

  const contextValue: AuthContextType = {
    // State
    session,
    user,
    isAuthenticated,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    navigationReady,
    
    // Actions
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState: handleRecoveryAuth,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
