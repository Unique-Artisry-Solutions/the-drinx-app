
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { debouncedToast } from '@/utils/debouncedToast';
import { inferUserType } from '@/utils/auth/admin';
import { DevAutoLoginService } from '@/services/DevAutoLoginService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


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
  
  const initializationRef = useRef(false);

  // Initialize auth state - simplified and more robust with dev auto-login
  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('🔐 AuthProvider - Starting initialization');
    setIsLoading(true);
    setAuthError(null);

    try {
      // Get current session with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
      );
      
      const sessionPromise = supabase.auth.getSession();
      
      const { data: { session: currentSession }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      if (error) {
        console.error('🔐 AuthProvider - Session fetch error:', error);
        throw error;
      }

      if (currentSession?.user) {
        console.log('🔐 AuthProvider - Session found, setting auth state');
        
        // Set session and user
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Determine user type
        setUserType(inferUserType(currentSession.user));
        
        // Set email verification status
        setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
        
        // Update persistence service
        sessionPersistenceService.updateSession(currentSession, currentSession.user);
        
        console.log('🔐 AuthProvider - Auth state set successfully');
      } else {
        console.log('🔐 AuthProvider - No session found, checking for dev auto-login');
        
        // Clear auth state first
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsEmailVerified(false);
        sessionPersistenceService.clearSession();
        
        // Initialize development auto-login if in dev mode
        if (DevAutoLoginService.isDevelopmentMode()) {
          console.log('🔐 AuthProvider - Development mode detected, initializing auto-login');
          
          // Check if there's a stored dev user type, otherwise default to admin
          const storedDevType = DevAutoLoginService.getCurrentDevUserType();
          if (!storedDevType) {
            console.log('🔐 AuthProvider - No stored dev user type, auto-logging in as admin');
            await DevAutoLoginService.autoLogin('admin');
          } else {
            console.log('🔐 AuthProvider - Found stored dev user type, initializing auto-login');
            await DevAutoLoginService.initializeAutoLogin();
          }
          
          // After auto-login attempt, check for session again
          const { data: { session: devSession } } = await supabase.auth.getSession();
          if (devSession?.user) {
            console.log('🔐 AuthProvider - Dev auto-login successful, setting auth state');
            setSession(devSession);
            setUser(devSession.user);
            setUserType(inferUserType(devSession.user));
            setIsEmailVerified(devSession.user.email_confirmed_at !== null);
            sessionPersistenceService.updateSession(devSession, devSession.user);
          }
        }
      }

    } catch (error: any) {
      console.error('🔐 AuthProvider - Initialization failed:', error);
      // Don't set auth error for timeout - just proceed with no auth
      if (!error.message.includes('timeout')) {
        setAuthError(new Error(`Initialization failed: ${error.message}`));
      }
      // Clear auth state on error
      setSession(null);
      setUser(null);
      setUserType('individual');
      setIsEmailVerified(false);
      sessionPersistenceService.clearSession();
    } finally {
      // ALWAYS set these flags to true after initialization attempt
      setIsLoading(false);
      setAuthStable(true);
      setNavigationReady(true);
      console.log('🔐 AuthProvider - Initialization complete, auth stable and navigation ready');
    }
  }, []);

  // Handle auth state changes - simplified
  useEffect(() => {
    console.log('🔐 AuthProvider - Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('🔐 AuthProvider - Auth state changed:', event, !!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        setUserType(inferUserType(newSession.user));
        setIsEmailVerified(newSession.user.email_confirmed_at !== null);
        setAuthError(null);
        sessionPersistenceService.updateSession(newSession, newSession.user);
        
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsEmailVerified(false);
        setAuthError(null);
        sessionPersistenceService.clearSession();
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
