import React, { createContext, useContext, useEffect, useState, useCallback, useRef, startTransition } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { debouncedToast } from '@/utils/debouncedToast';
import { inferUserType } from '@/utils/auth/admin';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authStateStable, setAuthStateStable] = useState(false);
  
  const initializationRef = useRef(false);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('🔐 AuthProvider - Starting initialization');
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🔐 AuthProvider - Session fetch error:', error);
        throw error;
      }

      if (currentSession?.user) {
        console.log('🔐 AuthProvider - Session found, setting auth state');
        setSession(currentSession);
        setUser(currentSession.user);
        setUserType(inferUserType(currentSession.user));
        setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
        sessionPersistenceService.updateSession(currentSession, currentSession.user);
        console.log('🔐 AuthProvider - Auth state set successfully');
      } else {
        console.log('🔐 AuthProvider - No session found');
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsEmailVerified(false);
        sessionPersistenceService.clearSession();
      }

    } catch (error: any) {
      console.error('🔐 AuthProvider - Initialization failed:', error);
      setAuthError(new Error(`Initialization failed: ${error.message}`));
      setSession(null);
      setUser(null);
      setUserType('individual');
      setIsEmailVerified(false);
      sessionPersistenceService.clearSession();
    } finally {
      setIsLoading(false);
      setAuthStable(true);
      setNavigationReady(true);
      setAuthStateStable(true);
      console.log('🔐 AuthProvider - Initialization complete, auth stable and navigation ready');
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    console.log('🔐 AuthProvider - Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('🔐 AuthProvider - Auth state changed:', event, !!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('🔐 AuthProvider - User signed in successfully');
        
        startTransition(() => {
          setIsTransitioning(true);
          setAuthStateStable(false);
          setSession(newSession);
          setUser(newSession.user);
          setUserType(inferUserType(newSession.user));
          setIsEmailVerified(newSession.user.email_confirmed_at !== null);
          setAuthError(null);
        });
         
        sessionPersistenceService.updateSession(newSession, newSession.user);
        setAuthStable(true);
        setNavigationReady(true);
        
      } else if (event === 'SIGNED_OUT') {
        console.log('🔐 AuthProvider - User signed out, clearing state');
        
        startTransition(() => {
          setIsTransitioning(true);
          setAuthStateStable(false);
          setSession(null);
          setUser(null);
          setUserType('individual');
          setIsEmailVerified(false);
          setAuthError(null);
        });
        
        sessionPersistenceService.clearSession();
        
      } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
        console.log('🔐 AuthProvider - Token refreshed, updating state');
        
        startTransition(() => {
          setIsTransitioning(true);
          setAuthStateStable(false);
          setSession(newSession);
          setUser(newSession.user);
          setUserType(inferUserType(newSession.user));
          setIsEmailVerified(newSession.user.email_confirmed_at !== null);
        });
        
        sessionPersistenceService.updateSession(newSession, newSession.user);
      }
    });

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  // State stabilization mechanism
  useEffect(() => {
    if (isTransitioning) {
      console.log('🔄 AuthProvider - Starting state stabilization period');
      const timeout = setTimeout(() => {
        console.log('✅ AuthProvider - State stabilization complete');
        setAuthStateStable(true);
        setIsTransitioning(false);
      }, 100);
      
      return () => clearTimeout(timeout);
    } else {
      setAuthStateStable(true);
    }
  }, [isTransitioning, session, user, userType]);

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

  const switchRole = useCallback(async (role: 'individual' | 'establishment' | 'promoter') => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      setIsTransitioning(true);
      
      const { error } = await supabase.rpc('switch_active_role', { 
        role_to_activate: role 
      });
      
      if (error) throw error;
      
      setUserType(role);
      authCache.clearUserCache(user.id);
      authCache.setUserType(user.id, role);
      
      console.log(`✅ Role switched to: ${role}`);
      
    } catch (error: any) {
      console.error('Role switch error:', error);
      setAuthError(error);
      throw error;
    } finally {
      setIsTransitioning(false);
    }
  }, [user]);

  const value: AuthContextType = {
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
    isTransitioning,
    authStateStable,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    switchRole,
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