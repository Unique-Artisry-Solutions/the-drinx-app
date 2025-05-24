
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { toUserType, getUserTypeFromMetadata } from '@/utils/userTypeGuards';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isEmailVerified: false,
    isVerificationEmailSent: false,
    authError: null,
    authStable: false,
    userType: 'individual',
    navigationReady: false,
  });

  const { goToAfterLogin, goToHomePage } = useAppNavigation();

  // Single source of truth for updating auth state
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Determine user type from session data
  const determineUserType = useCallback(async (user: any) => {
    if (!user?.id) return 'individual';
    
    // Try cache first
    const cachedUserType = authCache.getUserType(user.id);
    if (cachedUserType) {
      return cachedUserType;
    }
    
    // Try user metadata
    if (user.user_metadata?.user_type) {
      const userType = getUserTypeFromMetadata(user.user_metadata);
      authCache.setUserType(user.id, userType);
      return userType;
    }
    
    // Try database query
    try {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();
      
      if (roleData) {
        const userType = toUserType(roleData.role);
        authCache.setUserType(user.id, userType);
        return userType;
      }
    } catch (error) {
      console.warn('Failed to fetch user role from database:', error);
    }
    
    return 'individual';
  }, []);

  // Handle auth state changes from Supabase
  const handleAuthStateChange = useCallback(async (event: string, session: any) => {
    console.log('Auth state change:', event, !!session);
    
    if (session?.user) {
      const userType = await determineUserType(session.user);
      const isEmailVerified = !!session.user.email_confirmed_at;
      
      // Update persistence service
      sessionPersistenceService.updateSession(session, session.user);
      
      updateAuthState({
        session,
        user: session.user,
        isAuthenticated: true,
        isEmailVerified,
        userType,
        authError: null,
        authStable: true,
        navigationReady: true,
        isLoading: false,
      });
    } else {
      // Clear all auth data
      sessionPersistenceService.clearSession();
      
      updateAuthState({
        session: null,
        user: null,
        isAuthenticated: false,
        isEmailVerified: false,
        userType: 'individual',
        authError: null,
        authStable: true,
        navigationReady: true,
        isLoading: false,
      });
    }
  }, [determineUserType, updateAuthState]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
        
        // Then check for existing session
        const { session } = await sessionPersistenceService.initializeSession();
        
        if (mounted) {
          if (session?.user) {
            await handleAuthStateChange('SIGNED_IN', session);
          } else {
            updateAuthState({
              authStable: true,
              navigationReady: true,
              isLoading: false,
            });
          }
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          updateAuthState({
            authError: error as Error,
            authStable: true,
            navigationReady: true,
            isLoading: false,
          });
        }
      }
    };
    
    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup.then(fn => fn?.());
    };
  }, [handleAuthStateChange, updateAuthState]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      updateAuthState({ isLoading: true, authError: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        updateAuthState({ authError: error, isLoading: false });
        return { error, data: null };
      }
      
      // Auth state will be updated via onAuthStateChange
      return { error: null, data };
    } catch (error) {
      const authError = error as Error;
      updateAuthState({ authError, isLoading: false });
      return { error: authError, data: null };
    }
  }, [updateAuthState]);

  const signUp = useCallback(async (formData: any) => {
    try {
      updateAuthState({ isLoading: true, authError: null });
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: formData.data,
          emailRedirectTo: formData.emailRedirectTo,
        },
      });
      
      if (error) {
        updateAuthState({ authError: error, isLoading: false });
        return { error, data: null };
      }
      
      updateAuthState({ 
        isVerificationEmailSent: true,
        isLoading: false 
      });
      
      return { error: null, data };
    } catch (error) {
      const authError = error as Error;
      updateAuthState({ authError, isLoading: false });
      return { error: authError, data: null };
    }
  }, [updateAuthState]);

  const signOut = useCallback(async () => {
    try {
      updateAuthState({ isLoading: true });
      
      await supabase.auth.signOut();
      
      // Clear all cached data
      sessionPersistenceService.clearSession();
      
      // Auth state will be updated via onAuthStateChange
    } catch (error) {
      console.error('Sign out error:', error);
      updateAuthState({ authError: error as Error, isLoading: false });
    }
  }, [updateAuthState]);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      const isEmailVerified = !!data.session?.user?.email_confirmed_at;
      
      // Auth state will be updated via onAuthStateChange
      return { isEmailVerified };
    } catch (error) {
      console.error('Session refresh error:', error);
      updateAuthState({ authError: error as Error });
      return { isEmailVerified: false };
    }
  }, [updateAuthState]);

  const recoverAuthState = useCallback(async () => {
    try {
      updateAuthState({ isLoading: true, authError: null });
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        // Clear invalid state
        sessionPersistenceService.clearSession();
        updateAuthState({
          session: null,
          user: null,
          isAuthenticated: false,
          userType: 'individual',
          authStable: true,
          navigationReady: true,
          isLoading: false,
        });
        return false;
      }
      
      // Auth state will be updated via onAuthStateChange
      return true;
    } catch (error) {
      console.error('Auth recovery error:', error);
      updateAuthState({ authError: error as Error, isLoading: false });
      return false;
    }
  }, [updateAuthState]);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      updateAuthState({ isVerificationEmailSent: true });
    } catch (error) {
      console.error('Verification email error:', error);
      updateAuthState({ authError: error as Error });
      throw error;
    }
  }, [updateAuthState]);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      });
      
      if (error) throw error;
      
      // Auth state will be updated via onAuthStateChange
    } catch (error) {
      console.error('Profile update error:', error);
      updateAuthState({ authError: error as Error });
      throw error;
    }
  }, [updateAuthState]);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Password update error:', error);
      updateAuthState({ authError: error as Error });
      throw error;
    }
  }, [updateAuthState]);

  const value: AuthContextType = {
    ...state,
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
