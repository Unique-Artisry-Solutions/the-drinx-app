
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType } from '@/types/auth/AuthTypes';
import { authService } from '@/services/AuthService';
import { useDebouncedToast } from '@/hooks/useDebouncedToast';
import { checkAdminBypassStatus, createBypassUser } from '@/utils/adminBypass';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [userType, setUserType] = useState<string>('individual');
  
  const initializationRef = useRef(false);
  const stabilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { showError, showSuccess } = useDebouncedToast();

  // Check for admin bypass and create bypass user if needed
  const checkBypassUser = useCallback(() => {
    const { isEnabled, bypassUserId, userType: bypassType } = checkAdminBypassStatus();
    
    if (isEnabled && bypassUserId) {
      const bypassUser = createBypassUser();
      if (bypassUser) {
        console.log('AuthProvider: Using admin bypass user', { bypassType, bypassUserId });
        setUser(bypassUser);
        setSession({
          access_token: 'bypass-token',
          refresh_token: 'bypass-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: bypassUser
        } as Session);
        setUserType(bypassType || 'individual');
        setIsEmailVerified(true);
        return true;
      }
    }
    return false;
  }, []);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('AuthProvider: Initializing auth state');
    setIsLoading(true);
    setAuthError(null);

    try {
      // First check for admin bypass
      if (checkBypassUser()) {
        setAuthStable(true);
        setIsLoading(false);
        return;
      }

      // Then check for regular Supabase session
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthProvider: Error getting session:', error);
        setAuthError(error);
      } else if (currentSession) {
        console.log('AuthProvider: Found existing session');
        setSession(currentSession);
        setUser(currentSession.user);
        setIsEmailVerified(!!currentSession.user.email_confirmed_at);
        
        // Get user type from metadata or localStorage
        const userTypeFromMeta = currentSession.user.user_metadata?.user_type;
        const userTypeFromStorage = localStorage.getItem('user_type');
        const finalUserType = userTypeFromMeta || userTypeFromStorage || 'individual';
        setUserType(finalUserType);
        
        // Update localStorage with current session data
        authService.updateLocalStorage(currentSession.user);
        localStorage.setItem('user_type', finalUserType);
      } else {
        console.log('AuthProvider: No existing session found');
        setSession(null);
        setUser(null);
        setIsEmailVerified(false);
        setUserType('individual');
      }
    } catch (error) {
      console.error('AuthProvider: Unexpected error during initialization:', error);
      setAuthError(error as Error);
    } finally {
      // Set auth as stable after a short delay to prevent rapid state changes
      if (stabilityTimeoutRef.current) {
        clearTimeout(stabilityTimeoutRef.current);
      }
      
      stabilityTimeoutRef.current = setTimeout(() => {
        setAuthStable(true);
        setIsLoading(false);
        console.log('AuthProvider: Auth state stabilized');
      }, 100);
    }
  }, [checkBypassUser]);

  // Handle auth state changes
  const handleAuthStateChange = useCallback((event: string, newSession: Session | null) => {
    console.log('AuthProvider: Auth state change event:', event, !!newSession);
    
    // Don't process auth changes if using bypass
    const { isEnabled } = checkAdminBypassStatus();
    if (isEnabled) {
      console.log('AuthProvider: Ignoring auth state change due to admin bypass');
      return;
    }

    if (newSession) {
      setSession(newSession);
      setUser(newSession.user);
      setIsEmailVerified(!!newSession.user.email_confirmed_at);
      
      // Update user type
      const userTypeFromMeta = newSession.user.user_metadata?.user_type;
      const userTypeFromStorage = localStorage.getItem('user_type');
      const finalUserType = userTypeFromMeta || userTypeFromStorage || 'individual';
      setUserType(finalUserType);
      
      // Update localStorage
      authService.updateLocalStorage(newSession.user);
      localStorage.setItem('user_type', finalUserType);
      
      console.log('AuthProvider: User authenticated', { 
        userId: newSession.user.id, 
        userType: finalUserType,
        emailVerified: !!newSession.user.email_confirmed_at 
      });
    } else {
      setSession(null);
      setUser(null);
      setIsEmailVerified(false);
      setUserType('individual');
      
      // Clear localStorage except admin/bypass data
      const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
      if (!isAdminAuth && !checkAdminBypassStatus().isEnabled) {
        authService.clearSessionData();
      }
      
      console.log('AuthProvider: User signed out');
    }
  }, []);

  // Set up auth state listener and initialize
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    // Initialize auth state
    initializeAuth();

    return () => {
      subscription.unsubscribe();
      if (stabilityTimeoutRef.current) {
        clearTimeout(stabilityTimeoutRef.current);
      }
    };
  }, [handleAuthStateChange, initializeAuth]);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const result = await authService.signIn(email, password);
      
      if (result.error) {
        setAuthError(result.error);
        showError('Login Failed', result.error.message);
        return { error: result.error, data: null };
      }
      
      showSuccess('Login Successful', 'Welcome back!');
      return { error: null, data: result };
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      showError('Login Failed', authError.message);
      return { error: authError, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const result = await authService.signUp(
        formData.email,
        formData.password,
        {
          data: formData.data,
          emailRedirectTo: formData.emailRedirectTo
        }
      );
      
      if (result.error) {
        setAuthError(result.error);
        showError('Signup Failed', result.error.message);
        throw result.error;
      }
      
      setIsVerificationEmailSent(true);
      showSuccess('Signup Successful', 'Please check your email to verify your account.');
      return result;
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    
    try {
      // Clear bypass state if active
      const { isEnabled } = checkAdminBypassStatus();
      if (isEnabled) {
        localStorage.removeItem('admin_bypass');
        localStorage.removeItem('bypass_user_id');
        localStorage.removeItem('admin_authenticated');
      }
      
      await authService.signOut();
      
      setSession(null);
      setUser(null);
      setIsEmailVerified(false);
      setUserType('individual');
      setIsVerificationEmailSent(false);
      setAuthError(null);
      
      showSuccess('Signed Out', 'You have been successfully signed out.');
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      // Don't refresh if using bypass
      const { isEnabled } = checkAdminBypassStatus();
      if (isEnabled) {
        return { isEmailVerified: true };
      }
      
      const result = await authService.refreshSession();
      
      if (result.error) {
        setAuthError(result.error);
        return { isEmailVerified: false };
      }
      
      return { isEmailVerified: result.isEmailVerified };
    } catch (error) {
      setAuthError(error as Error);
      return { isEmailVerified: false };
    }
  };

  const recoverAuthState = async () => {
    console.log('AuthProvider: Attempting auth state recovery');
    
    try {
      await authService.recoverFromStuckState({ silent: true });
      
      // Reset initialization flag and reinitialize
      initializationRef.current = false;
      setAuthStable(false);
      await initializeAuth();
      
      return true;
    } catch (error) {
      console.error('Auth recovery failed:', error);
      setAuthError(error as Error);
      return false;
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      await authService.resetPassword(email);
      setIsVerificationEmailSent(true);
      showSuccess('Verification Email Sent', 'Please check your email.');
    } catch (error) {
      setAuthError(error as Error);
      showError('Failed to Send Email', (error as Error).message);
    }
  };

  const updateUserProfile = async (data: any) => {
    // Implementation for profile updates
    console.log('Update user profile:', data);
  };

  const updatePassword = async (newPassword: string) => {
    // Implementation for password updates
    console.log('Update password');
  };

  const contextValue: AuthContextType = {
    // State
    user,
    session,
    isLoading,
    isEmailVerified,
    authStable,
    authError,
    isAuthenticated: !!(user && session),
    isVerificationEmailSent,
    userType,
    
    // Actions
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
