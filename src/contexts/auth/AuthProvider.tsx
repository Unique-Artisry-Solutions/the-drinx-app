import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthUser, AuthContextType } from './types';
import { supabase } from '@/lib/supabase';
import { useAuthState } from './useAuthState';
import { useAuthSetup } from './useAuthSetup';
import { useSessionRefresh } from './useSessionRefresh';
import { validateSessionState, syncSessionState } from '@/utils/sessionRecovery';
import { useToast } from '@/hooks/use-toast';
import { isPreviewEnvironment } from '@/utils/environment';

const initialState = {
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isEmailVerified: false,
  isVerificationEmailSent: false,
  authError: null,
  authStable: false
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => { return null; },
  signOut: async () => {},
  refreshSession: async () => ({ isEmailVerified: false }),
  recoverAuthState: async () => false,
  sendVerificationEmail: async () => {},
  updateUserProfile: async () => {},
  updatePassword: async () => {},
  continueAsGuest: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    isEmailVerified,
    setIsEmailVerified,
    checkAdminBypass,
    updateLocalStorage,
    checkAdminSession,
    toast
  } = useAuthState();

  // Set up initial auth state and listeners - now with setAuthStable
  useAuthSetup({
    setSession,
    setUser,
    setIsEmailVerified,
    setIsLoading,
    updateLocalStorage,
    checkAdminBypass,
    checkAdminSession,
    refreshSession: async () => ({ isEmailVerified: false }),
    setAuthStable,
    toast
  });

  // Authentication state
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);

  // Set up session refresh functionality
  const { refreshSession } = useSessionRefresh({
    refreshSessionAction: async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
        
        if (sessionError) throw sessionError;
        
        return {
          session: sessionData.session,
          user: sessionData.session?.user || null,
          isEmailVerified: sessionData.session?.user ? !!sessionData.session.user.email_confirmed_at : false
        };
      } catch (error) {
        console.error("Session refresh error:", error);
        return { session: null, user: null, isEmailVerified: false };
      }
    },
    setSession,
    setUser,
    setIsEmailVerified,
    updateLocalStorage
  });

  // Mark auth as stable once initial loading is complete
  useEffect(() => {
    if (!isLoading) {
      console.log('Auth is now stable');
      setAuthStable(true);
      
      // Only perform session validation in non-preview environments
      if (!isPreviewEnvironment()) {
        // Perform session validation once auth is stable
        validateSessionState().then(result => {
          if (result.hasMismatch) {
            console.log('Session mismatch detected during initial validation:', result);
            syncSessionState().then(success => {
              console.log('Session sync result:', success);
            });
          }
        });
      }
    }
  }, [isLoading]);

  // Listen for session error toast requests
  useEffect(() => {
    const handleSessionErrorToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { title, description, action } = customEvent.detail;
      
      toast({
        title,
        description,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined,
        variant: 'destructive'
      });
    };
    
    window.addEventListener('showSessionErrorToast', handleSessionErrorToast);
    return () => window.removeEventListener('showSessionErrorToast', handleSessionErrorToast);
  }, [toast]);

  // Continue as guest function for preview/demo environments
  const continueAsGuest = () => {
    console.log('Continuing as guest user');
    localStorage.setItem('preview_mode', 'true');
    localStorage.setItem('demo_mode', 'true');
    setIsLoading(false);
    setAuthStable(true);
  };

  // Keep the existing signIn, signUp, signOut functions as they are
  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;

      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.data?.name,
            username: formData.data?.username,
            user_type: formData.data?.user_type || 'individual'
          },
          emailRedirectTo: formData.emailRedirectTo || `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      return data;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all localStorage auth data
      updateLocalStorage(null);
      
      // Reset state
      setSession(null);
      setUser(null);
      setIsEmailVerified(false);
      setAuthError(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const recoverAuthState = async (): Promise<boolean> => {
    console.log('Attempting to recover auth state...');
    setIsLoading(true);
    
    try {
      const validationResult = await validateSessionState();
      console.log('Auth state validation result:', validationResult);
      
      if (validationResult.hasMismatch) {
        console.log('Session mismatch detected, attempting to sync...');
        const syncSuccess = await syncSessionState();
        
        if (syncSuccess) {
          console.log('Session sync successful, refreshing session...');
          await refreshSession();
          return true;
        } else {
          console.log('Session sync failed, forcing sign out...');
          await signOut();
          return false;
        }
      } else {
        console.log('No session mismatch detected, refreshing session...');
        await refreshSession();
        return true;
      }
    } catch (error) {
      console.error('Auth state recovery failed:', error);
      return false;
    } finally {
      setIsLoading(false);
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
    } catch (error: any) {
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
      
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...data
          }
        });
      }
    } catch (error: any) {
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
      setAuthError(error);
      throw error;
    }
  };

  // Fixed: Create the value object with all required methods including continueAsGuest
  const value: AuthContextType = {
    session,
    user,
    isAuthenticated: !!user && !!session,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    continueAsGuest
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
