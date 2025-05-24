
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType, AuthUser } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { useAuthRecovery } from '@/hooks/useAuthRecovery';
import { useAuthLoadingStates } from '@/hooks/useAuthLoadingStates';
import { debouncedToast } from '@/utils/debouncedToast';

// Type conversion utility
const convertToUserType = (value: string | undefined | null): 'individual' | 'establishment' | 'promoter' | 'admin' => {
  if (value === 'individual' || value === 'establishment' || value === 'promoter' || value === 'admin') {
    return value;
  }
  return 'individual'; // Safe fallback
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<any | null>(null);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  
  const { recoverAuthState } = useAuthRecovery();
  const { 
    setInitializing, 
    setSigningIn, 
    setSigningUp, 
    setSigningOut,
    isAnyAuthLoading,
    clearAllLoadingStates 
  } = useAuthLoadingStates();

  // Computed state values
  const isAuthenticated = !!session && !!user;
  const isLoading = isAnyAuthLoading();
  const authStable = true; // Always true for simplified logic
  const navigationReady = true; // Always true for simplified logic

  // Simple initialization - no complex recovery logic
  const initializeAuth = useCallback(async () => {
    console.log('AuthProvider - Starting simple initialization');
    setInitializing(true);
    
    try {
      // Get initial session
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthProvider - Session fetch error:', error);
        setAuthError(new Error(`Failed to fetch session: ${error.message}`));
        return;
      }

      if (initialSession?.user) {
        console.log('AuthProvider - Initial session found');
        setSession(initialSession);
        setUser(initialSession.user as AuthUser);
        setIsEmailVerified(!!initialSession.user.email_confirmed_at);
        
        // Set user type from metadata
        const metadataUserType = initialSession.user.user_metadata?.user_type;
        setUserType(convertToUserType(metadataUserType));
        
        // Update persistence
        sessionPersistenceService.updateSession(initialSession, initialSession.user);
      } else {
        console.log('AuthProvider - No initial session');
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
        setUserType('individual');
      }
      
      setAuthError(null);
    } catch (error) {
      console.error('AuthProvider - Initialization error:', error);
      setAuthError(new Error(`Auth initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      
      // Clear any problematic state
      setSession(null);
      setUser(null);
      setIsEmailVerified(false);
      setUserType('individual');
    } finally {
      setInitializing(false);
    }
  }, [setInitializing]);

  // Auth state change handler
  useEffect(() => {
    console.log('AuthProvider - Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('AuthProvider - Auth state change:', event, newSession?.user?.id);
      
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user as AuthUser);
        setIsEmailVerified(!!newSession.user.email_confirmed_at);
        
        // Set user type from metadata
        const metadataUserType = newSession.user.user_metadata?.user_type;
        setUserType(convertToUserType(metadataUserType));
        
        sessionPersistenceService.updateSession(newSession, newSession.user);
      } else {
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
        setUserType('individual');
        sessionPersistenceService.clearSession();
      }
    });

    // Initialize after setting up listener
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  // Recovery function - separate from initialization
  const handleRecoverAuthState = useCallback(async (): Promise<boolean> => {
    console.log('AuthProvider - Starting auth state recovery');
    
    try {
      const recoveryResult = await recoverAuthState();
      
      if (recoveryResult) {
        console.log('AuthProvider - Recovery successful');
        return true;
      } else {
        console.log('AuthProvider - Recovery failed');
        setAuthError(new Error('Auth recovery failed: Unable to restore session'));
        return false;
      }
    } catch (error) {
      console.error('AuthProvider - Recovery error:', error);
      setAuthError(new Error(`Auth recovery error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      return false;
    }
  }, [recoverAuthState]);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    setSigningIn(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return { error, data: null };
      }
      
      return { error: null, data };
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Sign in failed');
      return { error: authError, data: null };
    } finally {
      setSigningIn(false);
    }
  }, [setSigningIn]);

  // Sign up function
  const signUp = useCallback(async (formData: any) => {
    setSigningUp(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: formData.data,
          emailRedirectTo: formData.emailRedirectTo
        }
      });
      
      if (error) {
        return { error, data: null };
      }
      
      setIsVerificationEmailSent(true);
      return { error: null, data };
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Sign up failed');
      return { error: authError, data: null };
    } finally {
      setSigningUp(false);
    }
  }, [setSigningUp]);

  // Sign out function
  const signOut = useCallback(async () => {
    setSigningOut(true);
    
    try {
      await supabase.auth.signOut();
      
      // Clear all state
      setSession(null);
      setUser(null);
      setIsEmailVerified(false);
      setIsVerificationEmailSent(false);
      setUserType('individual');
      setAuthError(null);
      
      // Clear persistence
      sessionPersistenceService.clearSession();
      
      debouncedToast.success(
        'Signed Out',
        'You have been successfully signed out.',
        { duration: 3000 }
      );
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error instanceof Error ? error : new Error('Sign out failed'));
    } finally {
      setSigningOut(false);
    }
  }, [setSigningOut]);

  // Refresh session function
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      const emailVerified = !!data.session?.user?.email_confirmed_at;
      setIsEmailVerified(emailVerified);
      
      return { isEmailVerified: emailVerified };
    } catch (error) {
      console.error('Session refresh error:', error);
      setAuthError(error instanceof Error ? error : new Error('Session refresh failed'));
      return { isEmailVerified: false };
    }
  }, []);

  // Send verification email function
  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) {
        throw error;
      }
      
      setIsVerificationEmailSent(true);
    } catch (error) {
      console.error('Verification email error:', error);
      throw error instanceof Error ? error : new Error('Failed to send verification email');
    }
  }, []);

  // Update user profile function
  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error instanceof Error ? error : new Error('Failed to update profile');
    }
  }, []);

  // Update password function
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Password update error:', error);
      throw error instanceof Error ? error : new Error('Failed to update password');
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
    recoverAuthState: handleRecoverAuthState,
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
