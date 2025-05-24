import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType, AuthState } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { debouncedToast } from '@/utils/debouncedToast';
import { useAuthRecovery } from '@/hooks/useAuthRecovery';
import { useAuthLoadingStates } from '@/hooks/useAuthLoadingStates';
import { timeoutManager } from '@/utils/auth/timeoutManager';
import { toUserType, getUserTypeFromMetadata } from '@/utils/userTypeGuards';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [authStable, setAuthStable] = useState<boolean>(false);
  const [navigationReady, setNavigationReady] = useState<boolean>(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');

  const { recoverAuthState } = useAuthRecovery({ showToasts: false });
  const { 
    loadingStates,
    setInitializing,
    setSigningIn,
    setSigningUp,
    setSigningOut,
    setRecovering,
    setRefreshing,
    clearAllLoadingStates
  } = useAuthLoadingStates();

  const authListenerTimeout = useRef<NodeJS.Timeout | null>(null);
  const authInitTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Simplified initialization - single attempt without complex recovery
   */
  const initializeAuth = useCallback(async () => {
    console.log('AuthProvider: Starting simplified initialization');
    setInitializing(true);
    
    try {
      // Single attempt to get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('AuthProvider: Session retrieval failed:', error.message);
        // Set defaults for unauthenticated state
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsAuthenticated(false);
      } else if (session?.user) {
        console.log('AuthProvider: Session found, setting auth state');
        setSession(session);
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Safely determine userType using type guard
        const determinedUserType = getUserTypeFromMetadata(session.user.user_metadata);
        setUserType(determinedUserType);
        
        // Cache the session and userType
        sessionPersistenceService.updateSession(session, session.user);
        authCache.setUserType(session.user.id, determinedUserType);
      } else {
        console.log('AuthProvider: No session found, user is not authenticated');
        // Set defaults for unauthenticated state
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsAuthenticated(false);
      }
      
    } catch (error) {
      console.error('AuthProvider: Initialization error:', error);
      // Set safe defaults on any error
      setSession(null);
      setUser(null);
      setUserType('individual');
      setIsAuthenticated(false);
      setAuthError(error as Error);
    } finally {
      // Always set stable states regardless of success/failure
      setAuthStable(true);
      setNavigationReady(true);
      setInitializing(false);
      console.log('AuthProvider: Initialization completed');
    }
  }, [setInitializing]);

  /**
   * Recovery function - only called when specifically needed
   */
  const recoverAuthState = useCallback(async (): Promise<boolean> => {
    console.log('AuthProvider: Starting auth recovery');
    setRecovering(true);
    
    try {
      const result = await recoverAuthState();
      if (result) {
        setSession(result.session);
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Safely determine userType using type guard
        const recoveredUserType = toUserType(result.userType, 'individual');
        setUserType(recoveredUserType);
        
        console.log('AuthProvider: Recovery successful');
        return true;
      } else {
        console.log('AuthProvider: Recovery failed, clearing state');
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('AuthProvider: Recovery error:', error);
      setAuthError(error as Error);
      return false;
    } finally {
      setRecovering(false);
    }
  }, [recoverAuthState, setRecovering]);

  useEffect(() => {
    console.log('AuthProvider: Component mounted, initializing auth');
    
    // Initial auth loading
    initializeAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state change event:', event);
        
        if (event === 'initialSession') {
          console.log('AuthProvider: Initial session event, skipping');
          return;
        }
        
        // Clear existing timeout to prevent conflicts
        if (authListenerTimeout.current) {
          clearTimeout(authListenerTimeout.current);
        }
        
        // Debounce the state update to prevent rapid-fire changes
        authListenerTimeout.current = setTimeout(async () => {
          try {
            if (session?.user) {
              console.log('AuthProvider: Session user found, updating state');
              setUser(session.user);
              setSession(session);
              setIsAuthenticated(true);
              
              // Safely determine userType using type guard
              const newUserType = getUserTypeFromMetadata(session.user.user_metadata);
              setUserType(newUserType);
              
              // Persist session and userType
              sessionPersistenceService.updateSession(session, session.user);
              authCache.setUserType(session.user.id, newUserType);
              
            } else {
              console.log('AuthProvider: No session user, setting defaults');
              setSession(null);
              setUser(null);
              setUserType('individual');
              setIsAuthenticated(false);
              sessionPersistenceService.clearSession();
            }
          } catch (error) {
            console.error('AuthProvider: Auth state change error:', error);
            setAuthError(error as AuthError);
          }
        }, 100); // Reduced debounce delay to 100ms
      }
    );

    return () => {
      console.log('AuthProvider: Component unmounted, cleaning up');
      subscription.unsubscribe();
      clearTimeout(authListenerTimeout.current as NodeJS.Timeout);
      clearTimeout(authInitTimeout.current as NodeJS.Timeout);
      timeoutManager.cleanup();
      clearAllLoadingStates();
    };
  }, [initializeAuth, clearAllLoadingStates]);

  const signIn = async (email: string, password: string) => {
    setSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('AuthProvider: Sign-in error:', error);
        debouncedToast.error('Sign-in Failed', error.message);
        return { error };
      }
      return { data };
    } finally {
      setSigningIn(false);
    }
  };

  const signUp = async (formData: any) => {
    setSigningUp(true);
    try {
      const { email, password, data } = formData;
      const { data: result, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...data
          }
        }
      });

      if (error) {
        console.error('AuthProvider: Sign-up error:', error);
        debouncedToast.error('Sign-up Failed', error.message);
        return { error };
      }
      return { data: result };
    } finally {
      setSigningUp(false);
    }
  };

  const signOut = async () => {
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign-out error:', error);
        debouncedToast.error('Sign-out Failed', error.message);
      } else {
        console.log('AuthProvider: Sign-out successful');
        sessionPersistenceService.clearSession();
        authCache.clearUserType(user?.id);
      }
    } finally {
      setSigningOut(false);
    }
  };

  const refreshSession = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('AuthProvider: Refresh session error:', error);
        return { isEmailVerified: false };
      }

      if (data?.session?.user) {
        setIsEmailVerified(data.session.user.email_confirmed_at !== null);
        return { isEmailVerified: data.session.user.email_confirmed_at !== null };
      }

      return { isEmailVerified: false };
    } finally {
      setRefreshing(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    setIsVerificationEmailSent(false);
    try {
      const { error } = await supabase.auth.resend({
        type: 'email',
        email: email,
      });

      if (error) {
        console.error('AuthProvider: Send verification email error:', error);
        debouncedToast.error('Verification Email Failed', error.message);
      } else {
        setIsVerificationEmailSent(true);
        debouncedToast.success('Verification Email Sent', 'Please check your inbox to verify your email.');
      }
    } catch (error) {
      console.error('AuthProvider: Send verification email error:', error);
      debouncedToast.error('Verification Email Failed', 'Could not send verification email.');
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      const { data: user, error } = await supabase.auth.updateUser({ data });

      if (error) {
        console.error('AuthProvider: Update user profile error:', error);
        debouncedToast.error('Update Profile Failed', error.message);
      } else {
        console.log('AuthProvider: User profile updated successfully');
        debouncedToast.success('Profile Updated', 'Your profile has been updated successfully.');
      }
    } catch (error) {
      console.error('AuthProvider: Update user profile error:', error);
      debouncedToast.error('Update Profile Failed', 'Could not update profile.');
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        console.error('AuthProvider: Update password error:', error);
        debouncedToast.error('Update Password Failed', error.message);
      } else {
        console.log('AuthProvider: Password updated successfully');
        debouncedToast.success('Password Updated', 'Your password has been updated successfully.');
      }
    } catch (error) {
      console.error('AuthProvider: Update password error:', error);
      debouncedToast.error('Update Password Failed', 'Could not update password.');
    }
  };

  const value: AuthContextType = {
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
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword
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
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
