
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType, AuthState, AuthActions } from './types';
import { getUserTypeFromMetadata, toUserType, UserType } from '@/utils/userTypeGuards';
import { useAuthActions } from './useAuthActions';
import { useAuthRecovery } from '@/hooks/useAuthRecovery';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { debouncedToast } from '@/utils/debouncedToast';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isEmailVerified: false,
    authStable: false,
    authError: null,
    isAuthenticated: false,
    isVerificationEmailSent: false,
    userType: 'individual',
    navigationReady: false
  });

  const { goToHomePage, goToLoginPage } = useAppNavigation();
  const authActions = useAuthActions();
  const { recoverAuthState: advancedRecovery } = useAuthRecovery();

  // Enhanced user type determination with caching
  const determineUserType = useCallback(async (user: User | null): Promise<UserType> => {
    if (!user) return 'individual';
    
    try {
      // Check cache first
      const cachedUserType = authCache.getUserType(user.id);
      if (cachedUserType) {
        console.log('AuthProvider - UserType from cache:', cachedUserType);
        return toUserType(cachedUserType);
      }

      // Check user metadata
      if (user.user_metadata?.user_type) {
        const userType = toUserType(user.user_metadata.user_type);
        authCache.setUserType(user.id, userType);
        console.log('AuthProvider - UserType from metadata:', userType);
        return userType;
      }

      // Query database for user roles
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!error && roleData) {
        const userType = toUserType(roleData.role);
        authCache.setUserType(user.id, userType);
        console.log('AuthProvider - UserType from database:', userType);
        return userType;
      }

      // Default fallback
      const defaultType = 'individual';
      authCache.setUserType(user.id, defaultType);
      console.log('AuthProvider - Using default userType:', defaultType);
      return defaultType;
    } catch (error) {
      console.warn('AuthProvider - Error determining userType:', error);
      return 'individual';
    }
  }, []);

  // Enhanced auth state handler
  const handleAuthStateChange = useCallback(async (session: Session | null, user: User | null) => {
    console.log('AuthProvider - Auth state change:', { 
      hasSession: !!session, 
      hasUser: !!user,
      userId: user?.id 
    });

    try {
      if (session && user) {
        // Update persistence
        sessionPersistenceService.updateSession(session, user);
        
        // Determine user type
        const userType = await determineUserType(user);
        
        // Update auth state
        setAuthState(prev => ({
          ...prev,
          session,
          user,
          isAuthenticated: true,
          isEmailVerified: !!user.email_confirmed_at,
          userType,
          authError: null,
          authStable: true,
          navigationReady: true,
          isLoading: false
        }));

        console.log('AuthProvider - User authenticated:', { userType, userId: user.id });
      } else {
        // Clear session and reset state
        sessionPersistenceService.clearSession();
        authCache.clear();
        
        setAuthState(prev => ({
          ...prev,
          session: null,
          user: null,
          isAuthenticated: false,
          isEmailVerified: false,
          userType: 'individual',
          authError: null,
          authStable: true,
          navigationReady: true,
          isLoading: false
        }));

        console.log('AuthProvider - User signed out');
      }
    } catch (error) {
      console.error('AuthProvider - Error in auth state change:', error);
      setAuthState(prev => ({
        ...prev,
        authError: error as Error,
        authStable: true,
        isLoading: false,
        navigationReady: true
      }));
    }
  }, [determineUserType]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('AuthProvider - Initializing auth...');
        
        // Set up auth state listener first
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          
          console.log('AuthProvider - Auth event:', event);
          await handleAuthStateChange(session, session?.user || null);
        });

        // Try to recover session
        const { session, user } = await sessionPersistenceService.initializeSession();
        
        if (mounted) {
          await handleAuthStateChange(session, user);
        }
      } catch (error) {
        console.error('AuthProvider - Initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            authError: error as Error,
            authStable: true,
            isLoading: false,
            navigationReady: true
          }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.subscription?.unsubscribe();
      }
    };
  }, [handleAuthStateChange]);

  // Navigation effect - handle redirects based on auth state
  useEffect(() => {
    if (!authState.authStable || !authState.navigationReady) return;

    const currentPath = window.location.pathname;
    console.log('AuthProvider - Navigation check:', { 
      currentPath, 
      isAuthenticated: authState.isAuthenticated,
      userType: authState.userType 
    });

    // Handle authenticated users on auth pages
    if (authState.isAuthenticated && ['/login', '/signup', '/landing'].includes(currentPath)) {
      console.log('AuthProvider - Redirecting authenticated user to home');
      goToHomePage(authState.userType);
      return;
    }

    // Handle unauthenticated users on protected pages
    const protectedPaths = ['/profile', '/admin', '/establishment', '/promoter', '/explore'];
    const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));
    
    if (!authState.isAuthenticated && isProtectedPath) {
      console.log('AuthProvider - Redirecting unauthenticated user to login');
      goToLoginPage();
      return;
    }
  }, [authState.isAuthenticated, authState.authStable, authState.navigationReady, authState.userType, goToHomePage, goToLoginPage]);

  // Auth recovery implementation
  const recoverAuthState = useCallback(async (): Promise<boolean> => {
    try {
      console.log('AuthProvider - Starting auth recovery...');
      
      const recoveryResult = await advancedRecovery();
      
      if (recoveryResult) {
        console.log('AuthProvider - Recovery successful');
        debouncedToast.success(
          'Session recovered',
          'Your authentication has been restored successfully.',
          3000
        );
        return true;
      } else {
        console.log('AuthProvider - Recovery failed');
        setAuthState(prev => ({
          ...prev,
          authError: new Error('Failed to recover authentication'),
          authStable: true,
          isLoading: false
        }));
        return false;
      }
    } catch (error) {
      console.error('AuthProvider - Recovery error:', error);
      setAuthState(prev => ({
        ...prev,
        authError: error as Error,
        authStable: true,
        isLoading: false
      }));
      return false;
    }
  }, [advancedRecovery]);

  // Send verification email
  const sendVerificationEmail = useCallback(async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`
        }
      });

      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        isVerificationEmailSent: true
      }));

      debouncedToast.success(
        'Verification email sent',
        `Please check ${email} for verification instructions.`,
        5000
      );
    } catch (error: any) {
      console.error('AuthProvider - Send verification error:', error);
      debouncedToast.error(
        'Failed to send verification email',
        error.message || 'Please try again later.',
        5000
      );
      throw error;
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (data: any): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({ data });
      if (error) throw error;

      // Update cache if userType changed
      if (data.user_type && authState.user) {
        authCache.setUserType(authState.user.id, data.user_type);
        
        // Update local state
        setAuthState(prev => ({
          ...prev,
          userType: toUserType(data.user_type)
        }));
      }

      debouncedToast.success(
        'Profile updated',
        'Your profile has been successfully updated.',
        3000
      );
    } catch (error: any) {
      console.error('AuthProvider - Update profile error:', error);
      debouncedToast.error(
        'Update failed',
        error.message || 'Failed to update profile.',
        5000
      );
      throw error;
    }
  }, [authState.user]);

  // Update password
  const updatePassword = useCallback(async (newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      debouncedToast.success(
        'Password updated',
        'Your password has been successfully updated.',
        3000
      );
    } catch (error: any) {
      console.error('AuthProvider - Update password error:', error);
      debouncedToast.error(
        'Update failed',
        error.message || 'Failed to update password.',
        5000
      );
      throw error;
    }
  }, []);

  // Combine state and actions
  const contextValue: AuthContextType = {
    // State
    ...authState,
    
    // Actions from useAuthActions
    signIn: authActions.signIn,
    signUp: authActions.signUp,
    signOut: authActions.signOut,
    refreshSession: authActions.refreshSession,
    
    // Local actions
    recoverAuthState,
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
