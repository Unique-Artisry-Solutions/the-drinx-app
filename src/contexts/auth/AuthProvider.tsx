import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthActions } from './useAuthActions';
import { AuthContextType, AuthState } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useAuthRecovery } from '@/hooks/useAuthRecovery';
import { UserType, toUserType, getUserTypeFromMetadata, getUserTypeFromRole } from '@/utils/userTypeGuards';
import { debouncedToast } from '@/utils/debouncedToast';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType>('individual');
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);

  // Hooks
  const navigation = useAppNavigation();
  const authActions = useAuthActions();
  const { recoverAuthState } = useAuthRecovery();

  // Refs for preventing duplicate operations
  const authInitialized = useRef(false);
  const userTypeResolved = useRef(false);

  // Computed state
  const isAuthenticated = !!user && !!session;

  /**
   * Determine user type from various sources with caching
   */
  const determineUserType = useCallback(async (userId: string): Promise<UserType> => {
    try {
      console.log('Determining user type for user:', userId);
      
      // Check cache first
      const cachedUserType = authCache.getUserType(userId);
      if (cachedUserType) {
        console.log('Found cached user type:', cachedUserType);
        return toUserType(cachedUserType);
      }

      // Try user metadata
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.user_metadata?.user_type) {
        const userTypeFromMetadata = getUserTypeFromMetadata(userData.user.user_metadata);
        authCache.setUserType(userId, userTypeFromMetadata);
        console.log('User type from metadata:', userTypeFromMetadata);
        return userTypeFromMetadata;
      }

      // Try database roles
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (roleData?.role) {
        const userTypeFromRole = getUserTypeFromRole(roleData.role);
        authCache.setUserType(userId, userTypeFromRole);
        console.log('User type from database:', userTypeFromRole);
        return userTypeFromRole;
      }

      // Default fallback
      const defaultType = toUserType('individual');
      authCache.setUserType(userId, defaultType);
      console.log('Using default user type:', defaultType);
      return defaultType;

    } catch (error) {
      console.error('Error determining user type:', error);
      return toUserType('individual');
    }
  }, []);

  /**
   * Handle auth state changes from Supabase
   */
  const handleAuthStateChange = useCallback(async (event: string, sessionData: Session | null) => {
    console.log('Auth state change:', event, !!sessionData);
    
    try {
      setAuthError(null);
      setSession(sessionData);
      setUser(sessionData?.user || null);
      setIsEmailVerified(!!sessionData?.user?.email_confirmed_at);

      if (sessionData?.user && !userTypeResolved.current) {
        userTypeResolved.current = true;
        
        const determinedUserType = await determineUserType(sessionData.user.id);
        setUserType(determinedUserType);
        
        // Update session persistence
        sessionPersistenceService.updateSession(sessionData, sessionData.user);
        
        console.log('Auth resolved with user type:', determinedUserType);
        setNavigationReady(true);
      } else if (!sessionData?.user) {
        userTypeResolved.current = false;
        setUserType(toUserType('individual'));
        setNavigationReady(false);
        sessionPersistenceService.clearSession();
      }

    } catch (error) {
      console.error('Error in auth state change handler:', error);
      setAuthError(error as Error);
    } finally {
      if (!authStable) {
        setAuthStable(true);
      }
      setIsLoading(false);
    }
  }, [determineUserType, authStable]);

  /**
   * Initialize authentication
   */
  const initializeAuth = useCallback(async () => {
    if (authInitialized.current) return;
    authInitialized.current = true;

    try {
      console.log('Initializing authentication...');
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

      // Check for existing session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        await handleAuthStateChange('INITIAL_SESSION', currentSession);
      } else {
        setAuthStable(true);
        setIsLoading(false);
      }

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setAuthError(error as Error);
      setAuthStable(true);
      setIsLoading(false);
    }
  }, [handleAuthStateChange]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Enhanced sign in with proper error handling
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('Email not verified. Please check your email and verify your account.');
      }

      return { error: null, data };
    } catch (error) {
      setAuthError(error as Error);
      return { error: error as Error, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Enhanced sign up with proper error handling
   */
  const signUp = useCallback(async (formData: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: formData.metadata || {}
        }
      });

      if (error) {
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setIsVerificationEmailSent(true);
        debouncedToast.success(
          'Verification email sent',
          `Please check ${formData.email} for verification link`,
          5000
        );
      }

      return { error: null, data };
    } catch (error) {
      setAuthError(error as Error);
      return { error: error as Error, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Enhanced sign out
   */
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Clear cache and persistence
      authCache.clear();
      sessionPersistenceService.clearSession();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }

      // Reset state
      setUser(null);
      setSession(null);
      setUserType(toUserType('individual'));
      setAuthError(null);
      setNavigationReady(false);
      userTypeResolved.current = false;

      // Navigate to landing
      navigation.goToRoute('/landing', { replace: true });
      
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation]);

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      setIsEmailVerified(!!data.session?.user?.email_confirmed_at);
      return { isEmailVerified: !!data.session?.user?.email_confirmed_at };
    } catch (error) {
      setAuthError(error as Error);
      return { isEmailVerified: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        throw error;
      }
      
      setIsVerificationEmailSent(true);
      debouncedToast.success(
        'Verification email resent',
        `Please check ${email} for verification link`,
        5000
      );
    } catch (error) {
      setAuthError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.updateUser({ data });
      
      if (error) {
        throw error;
      }
      
      debouncedToast.success(
        'Profile updated',
        'Your profile has been updated successfully',
        3000
      );
    } catch (error) {
      setAuthError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        throw error;
      }
      
      debouncedToast.success(
        'Password updated',
        'Your password has been updated successfully',
        3000
      );
    } catch (error) {
      setAuthError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue: AuthContextType = {
    // State
    user,
    session,
    userType,
    isAuthenticated,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    navigationReady,
    
    // Actions
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail: async () => {},
    updateUserProfile: authActions.updateProfile,
    updatePassword: async () => {}
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
