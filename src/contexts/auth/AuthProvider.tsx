
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType } from './types';
import { toUserType, getUserTypeFromMetadata } from '@/utils/userTypeGuards';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { debouncedToast } from '@/utils/debouncedToast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);
  
  const { goToAfterLogin } = useAppNavigation();

  // Computed state
  const isAuthenticated = !!(session && user);
  const userType = user ? getUserTypeFromMetadata(user.user_metadata) : 'individual';

  // Initialize session
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            if (!mounted) return;
            
            console.log('Auth state change:', event, newSession?.user?.email);
            
            setSession(newSession);
            setUser(newSession?.user || null);
            setIsEmailVerified(!!newSession?.user?.email_confirmed_at);
            setAuthError(null);
            
            if (newSession?.user) {
              sessionPersistenceService.updateSession(newSession, newSession.user);
            } else {
              sessionPersistenceService.clearSession();
            }
          }
        );

        // Then check for existing session
        const persisted = await sessionPersistenceService.initializeSession();
        if (mounted && persisted.session) {
          setSession(persisted.session);
          setUser(persisted.user);
          setIsEmailVerified(!!persisted.user?.email_confirmed_at);
        }

        if (mounted) {
          setIsLoading(false);
          setAuthStable(true);
          setNavigationReady(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthError(error as Error);
          setIsLoading(false);
          setAuthStable(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Actions
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        throw new Error('Email not verified. Please check your email and verify your account.');
      }

      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: formData.data,
          emailRedirectTo: formData.emailRedirectTo
        }
      });

      if (error) throw error;

      setIsVerificationEmailSent(true);
      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      sessionPersistenceService.clearSession();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      setIsEmailVerified(false);
      setAuthError(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      const isVerified = !!data.session?.user?.email_confirmed_at;
      setIsEmailVerified(isVerified);
      
      return { isEmailVerified: isVerified };
    } catch (error: any) {
      console.error('Refresh session error:', error);
      setAuthError(error);
      return { isEmailVerified: false };
    }
  };

  const recoverAuthState = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
        sessionPersistenceService.updateSession(data.session, data.session.user);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Auth recovery error:', error);
      setAuthError(error);
      return false;
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      debouncedToast.success('Verification email sent', 'Please check your inbox.');
    } catch (error: any) {
      console.error('Send verification error:', error);
      setAuthError(error);
      throw error;
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Update profile error:', error);
      setAuthError(error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Update password error:', error);
      setAuthError(error);
      throw error;
    }
  };

  const authState: AuthState = {
    session,
    user,
    isAuthenticated,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    navigationReady
  };

  const authActions: AuthActions = {
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword
  };

  const contextValue: AuthContextType = {
    ...authState,
    ...authActions
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
