
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { debouncedToast } from '@/utils/debouncedToast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Type conversion helper
function convertToUserType(value: string | null): 'individual' | 'establishment' | 'promoter' | 'admin' {
  if (value === 'establishment' || value === 'promoter' || value === 'admin') {
    return value;
  }
  return 'individual';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<any | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [navigationReady, setNavigationReady] = useState(false);
  
  const { goToAfterLogin, goToLandingPage } = useAppNavigation();
  const initializationRef = useRef(false);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('AuthProvider - Starting initialization');
    setIsLoading(true);
    setAuthError(null);

    try {
      // Get current session
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthProvider - Session fetch error:', error);
        throw error;
      }

      if (currentSession?.user) {
        console.log('AuthProvider - Session found, setting auth state');
        
        // Set session and user
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Determine user type
        const userTypeFromMetadata = currentSession.user.user_metadata?.user_type;
        const resolvedUserType = convertToUserType(userTypeFromMetadata);
        setUserType(resolvedUserType);
        
        // Set email verification status
        setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
        
        // Update persistence service
        sessionPersistenceService.updateSession(currentSession, currentSession.user);
        
        console.log('AuthProvider - Auth state set successfully');
      } else {
        console.log('AuthProvider - No session found, user not authenticated');
        
        // Clear auth state
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsEmailVerified(false);
        
        // Clear persistence
        sessionPersistenceService.clearSession();
      }

      // Set stable and ready flags immediately after successful initialization
      setAuthStable(true);
      setNavigationReady(true);
      
    } catch (error: any) {
      console.error('AuthProvider - Initialization failed:', error);
      setAuthError(new Error(`Initialization failed: ${error.message}`));
      
      // Even on error, set stable and ready flags so app doesn't hang
      setAuthStable(true);
      setNavigationReady(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    console.log('AuthProvider - Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('AuthProvider - Auth state changed:', event, !!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        
        const userTypeFromMetadata = newSession.user.user_metadata?.user_type;
        const resolvedUserType = convertToUserType(userTypeFromMetadata);
        setUserType(resolvedUserType);
        
        setIsEmailVerified(newSession.user.email_confirmed_at !== null);
        setAuthError(null);
        
        sessionPersistenceService.updateSession(newSession, newSession.user);
        
        // Set stable and ready immediately
        setAuthStable(true);
        setNavigationReady(true);
        
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsEmailVerified(false);
        setAuthError(null);
        
        sessionPersistenceService.clearSession();
        
        // Set stable and ready immediately
        setAuthStable(true);
        setNavigationReady(true);
      }
    });

    // Initialize auth state
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      setAuthError(error);
      return { data: null, error };
    }
  }, []);

  const signUp = useCallback(async (formData: any) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp(formData);
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      return { data, error: null };
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      console.error('Sign out error:', error);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      const isVerified = data.session?.user?.email_confirmed_at !== null;
      setIsEmailVerified(isVerified);
      
      return { isEmailVerified: isVerified };
    } catch (error: any) {
      setAuthError(error);
      return { isEmailVerified: false };
    }
  }, []);

  const recoverAuthState = useCallback(async () => {
    console.log('AuthProvider - Manual auth recovery requested');
    initializationRef.current = false;
    await initializeAuth();
    return true;
  }, [initializeAuth]);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email,
        options: { emailRedirectTo: `${window.location.origin}/?email_confirmed=true` }
      });
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      debouncedToast.success('Verification email sent', 'Please check your inbox');
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    // State
    session,
    user,
    isAuthenticated: !!session && !!user,
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
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
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
