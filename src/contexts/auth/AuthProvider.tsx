import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { debouncedToast } from '@/utils/debouncedToast';
import { authCache } from './authCache';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { useAuthLoadingStates } from '@/hooks/useAuthLoadingStates';
import { timeoutManager } from '@/utils/auth/timeoutManager';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  authStable: boolean;
  navigationReady: boolean;
  authError: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (data: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);
  
  const {
    setInitializing,
    setSigningIn,
    setSigningUp,
    setSigningOut,
    shouldPreventInteraction,
    isAnyAuthLoading,
    clearAllLoadingStates
  } = useAuthLoadingStates();

  const initializationCompleteRef = useRef(false);
  const recoveryInProgressRef = useRef(false);

  // Simplified initialization - no recovery logic here
  const initializeAuth = useCallback(async () => {
    if (initializationCompleteRef.current) {
      return;
    }

    console.log('AuthProvider - Starting simplified initialization');
    setInitializing(true);
    setAuthError(null);

    try {
      // Simple session check - no retries or recovery
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log('AuthProvider - Session check failed:', error.message);
        // Don't treat session errors as failures during initialization
        setAuthStable(true);
        setNavigationReady(true);
        return;
      }

      if (data.session && data.session.user) {
        console.log('AuthProvider - Session found, setting user');
        setSession(data.session);
        setUser(data.session.user);
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
        
        // Try to get user type - but don't fail initialization if this fails
        try {
          const cachedUserType = authCache.getUserType(data.session.user.id);
          if (cachedUserType) {
            setUserType(cachedUserType);
          } else if (data.session.user.user_metadata?.user_type) {
            const metadataUserType = data.session.user.user_metadata.user_type;
            setUserType(metadataUserType);
            authCache.setUserType(data.session.user.id, metadataUserType);
          }
        } catch (userTypeError) {
          console.warn('AuthProvider - Failed to determine user type:', userTypeError);
          // Continue without user type - can be determined later
        }
        
        sessionPersistenceService.updateSession(data.session, data.session.user);
      } else {
        console.log('AuthProvider - No session found');
        setSession(null);
        setUser(null);
        setUserType(null);
        setIsEmailVerified(false);
      }

      // Mark initialization as complete
      setAuthStable(true);
      setNavigationReady(true);
      initializationCompleteRef.current = true;
      
      console.log('AuthProvider - Initialization completed successfully');
      
    } catch (error) {
      console.error('AuthProvider - Initialization error:', error);
      setAuthError(error as Error);
      
      // Even on error, mark as stable to prevent loops
      setAuthStable(true);
      setNavigationReady(true);
      initializationCompleteRef.current = true;
    } finally {
      setInitializing(false);
    }
  }, [setInitializing]);

  // Separate recovery function - only called explicitly when needed
  const recoverAuthState = useCallback(async (): Promise<boolean> => {
    if (recoveryInProgressRef.current) {
      console.log('AuthProvider - Recovery already in progress');
      return false;
    }

    console.log('AuthProvider - Starting explicit auth recovery');
    recoveryInProgressRef.current = true;
    
    try {
      // Clear current state
      setAuthError(null);
      
      // Try to refresh session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (!error && data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
        
        // Update user type
        if (data.session.user.user_metadata?.user_type) {
          const recoveredUserType = data.session.user.user_metadata.user_type;
          setUserType(recoveredUserType);
          authCache.setUserType(data.session.user.id, recoveredUserType);
        }
        
        sessionPersistenceService.updateSession(data.session, data.session.user);
        
        debouncedToast.success(
          'Session recovered',
          'Your authentication has been restored successfully.',
          { duration: 3000 }
        );
        
        return true;
      }
      
      throw new Error('Session recovery failed');
      
    } catch (error) {
      console.error('AuthProvider - Recovery failed:', error);
      setAuthError(error as Error);
      
      // Clear session on recovery failure
      sessionPersistenceService.clearSession();
      setSession(null);
      setUser(null);
      setUserType(null);
      
      debouncedToast.error(
        'Recovery failed',
        'Please sign in again to continue.',
        { duration: 5000 }
      );
      
      return false;
    } finally {
      recoveryInProgressRef.current = false;
    }
  }, []);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider - Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setUserType(null);
          setIsEmailVerified(false);
          authCache.clear();
          sessionPersistenceService.clearSession();
        } else if (event === 'SIGNED_IN' && session) {
          setSession(session);
          setUser(session.user);
          setIsEmailVerified(!!session.user.email_confirmed_at);
          
          if (session.user.user_metadata?.user_type) {
            const sessionUserType = session.user.user_metadata.user_type;
            setUserType(sessionUserType);
            authCache.setUserType(session.user.id, sessionUserType);
          }
          
          sessionPersistenceService.updateSession(session, session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
    
    return () => {
      timeoutManager.cleanup();
    };
  }, [initializeAuth]);

  const signIn = useCallback(async (email: string, password: string) => {
    setSigningIn(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { error: null, data };
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      return { error: authError, data: null };
    } finally {
      setSigningIn(false);
    }
  }, [setSigningIn]);

  const signUp = useCallback(async (signUpData: any) => {
    setSigningUp(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp(signUpData);
      
      if (error) throw error;
      
      return { error: null, data };
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      throw authError;
    } finally {
      setSigningUp(false);
    }
  }, [setSigningUp]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    
    try {
      await supabase.auth.signOut();
      
      // Clear all state
      setSession(null);
      setUser(null);
      setUserType(null);
      setIsEmailVerified(false);
      authCache.clear();
      sessionPersistenceService.clearSession();
      clearAllLoadingStates();
      
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error as Error);
    } finally {
      setSigningOut(false);
    }
  }, [setSigningOut, clearAllLoadingStates]);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        const verified = !!data.session.user.email_confirmed_at;
        setIsEmailVerified(verified);
        return { isEmailVerified: verified };
      }
      
      return { isEmailVerified: false };
    } catch (error) {
      console.error('Refresh session error:', error);
      setAuthError(error as Error);
      return { isEmailVerified: false };
    }
  }, []);

  const isLoading = isAnyAuthLoading();
  const isAuthenticated = !!user && !!session;

  const contextValue: AuthContextType = {
    user,
    session,
    userType,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    authStable,
    navigationReady,
    authError,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState
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
