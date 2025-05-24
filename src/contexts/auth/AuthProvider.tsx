
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType } from './types';
import { debouncedToast } from '@/utils/debouncedToast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  
  // New stabilization states
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | null>(null);
  const [userTypeLoading, setUserTypeLoading] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);
  
  // Refs for debouncing and cleanup
  const authStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userTypeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAuthEventRef = useRef<string>('');
  
  // Debounced auth state handler
  const handleAuthStateChange = useCallback((event: string, newSession: Session | null) => {
    console.log("AuthProvider - Auth state change:", event, !!newSession);
    
    // Clear previous timeout
    if (authStateTimeoutRef.current) {
      clearTimeout(authStateTimeoutRef.current);
    }
    
    // Debounce rapid auth state changes
    authStateTimeoutRef.current = setTimeout(() => {
      // Prevent duplicate processing of same event
      const eventKey = `${event}-${newSession?.user?.id || 'null'}`;
      if (lastAuthEventRef.current === eventKey) {
        console.log("AuthProvider - Duplicate auth event ignored:", eventKey);
        return;
      }
      lastAuthEventRef.current = eventKey;
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsEmailVerified(newSession?.user?.email_confirmed_at ? true : false);
      
      if (newSession?.user) {
        // User logged in - determine user type
        setUserTypeLoading(true);
        setNavigationReady(false);
        determineUserType(newSession.user.id);
      } else {
        // User logged out
        setUserType(null);
        setUserTypeLoading(false);
        setNavigationReady(true);
        localStorage.removeItem('user_type');
      }
      
      setAuthError(null);
    }, 300); // 300ms debounce
  }, []);
  
  // User type determination with proper error handling
  const determineUserType = useCallback(async (userId: string) => {
    if (userTypeTimeoutRef.current) {
      clearTimeout(userTypeTimeoutRef.current);
    }
    
    try {
      console.log("AuthProvider - Determining user type for:", userId);
      
      // Check if user is admin (special handling since not in enum)
      const adminEmails = ['admin@spiritless.app', 'admin@example.com'];
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user?.email && adminEmails.includes(userData.user.email)) {
        console.log("AuthProvider - User identified as admin");
        setUserType('admin');
        setUserTypeLoading(false);
        setNavigationReady(true);
        localStorage.setItem('user_type', 'admin');
        return;
      }
      
      // Query user roles for regular users
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();
        
      if (roleError) {
        console.error("AuthProvider - Error fetching user role:", roleError);
        throw roleError;
      }
      
      const determinedUserType = roleData?.role || 'individual';
      console.log("AuthProvider - User type determined:", determinedUserType);
      
      setUserType(determinedUserType);
      localStorage.setItem('user_type', determinedUserType);
      
      // Delay to ensure state is stable before allowing navigation
      userTypeTimeoutRef.current = setTimeout(() => {
        setUserTypeLoading(false);
        setNavigationReady(true);
        console.log("AuthProvider - Navigation ready, userType:", determinedUserType);
      }, 100);
      
    } catch (error: any) {
      console.error("AuthProvider - Failed to determine user type:", error);
      
      // Fallback to individual user type
      setUserType('individual');
      localStorage.setItem('user_type', 'individual');
      setUserTypeLoading(false);
      setNavigationReady(true);
      
      debouncedToast.error(
        'User Type Error', 
        'Could not determine account type. Defaulting to individual user.',
        5000
      );
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider - Initializing...");
    
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider - Error getting initial session:", error);
          setAuthError(error);
        } else {
          console.log("AuthProvider - Initial session:", !!initialSession);
          
          if (initialSession) {
            handleAuthStateChange('INITIAL_SESSION', initialSession);
          } else {
            setNavigationReady(true);
          }
        }
      } catch (error: any) {
        console.error("AuthProvider - Auth initialization error:", error);
        setAuthError(error);
        setNavigationReady(true);
      } finally {
        setIsLoading(false);
        setAuthStable(true);
      }
    };
    
    initializeAuth();
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
      if (authStateTimeoutRef.current) {
        clearTimeout(authStateTimeoutRef.current);
      }
      if (userTypeTimeoutRef.current) {
        clearTimeout(userTypeTimeoutRef.current);
      }
    };
  }, [handleAuthStateChange]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error);
        debouncedToast.error('Login Failed', error.message, 5000);
        return { error, data: null };
      }

      debouncedToast.success('Welcome Back', 'Successfully logged in!', 3000);
      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      debouncedToast.error('Login Error', error.message, 5000);
      return { error, data: null };
    }
  }, []);

  const signUp = useCallback(async (formData: any) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            username: formData.username,
            user_type: formData.userType || 'individual',
            phone: formData.phone
          }
        }
      });

      if (error) {
        setAuthError(error);
        debouncedToast.error('Signup Failed', error.message, 5000);
        return { error, data: null };
      }

      debouncedToast.success('Account Created', 'Please check your email to verify your account.', 5000);
      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      debouncedToast.error('Signup Error', error.message, 5000);
      return { error, data: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      
      // Clear local state immediately
      setUserType(null);
      setNavigationReady(false);
      localStorage.removeItem('user_type');
      localStorage.removeItem('auth_redirect');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setAuthError(error);
        debouncedToast.error('Logout Error', error.message, 5000);
      } else {
        debouncedToast.info('Logged Out', 'You have been successfully logged out.', 3000);
      }
    } catch (error: any) {
      setAuthError(error);
      debouncedToast.error('Logout Error', error.message, 5000);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        setAuthError(error);
        throw error;
      }
      
      const isEmailVerified = data.session?.user?.email_confirmed_at ? true : false;
      setIsEmailVerified(isEmailVerified);
      
      return { isEmailVerified };
    } catch (error: any) {
      setAuthError(error);
      debouncedToast.error('Session Error', 'Failed to refresh session.', 5000);
      return { isEmailVerified: false };
    }
  }, []);

  const recoverAuthState = useCallback(async () => {
    try {
      setAuthError(null);
      setIsLoading(true);
      
      // Clear any existing timeouts
      if (authStateTimeoutRef.current) {
        clearTimeout(authStateTimeoutRef.current);
      }
      if (userTypeTimeoutRef.current) {
        clearTimeout(userTypeTimeoutRef.current);
      }
      
      // Force refresh session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("AuthProvider - Recovery failed:", error);
        debouncedToast.error('Recovery Failed', 'Could not recover session. Please log in again.', 5000);
        return false;
      }
      
      debouncedToast.success('Session Recovered', 'Authentication session has been restored.', 3000);
      return true;
    } catch (error: any) {
      console.error("AuthProvider - Recovery error:", error);
      setAuthError(error);
      debouncedToast.error('Recovery Error', error.message, 5000);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        setAuthError(error);
        debouncedToast.error('Verification Error', error.message, 5000);
      } else {
        setIsVerificationEmailSent(true);
        debouncedToast.success('Email Sent', 'Verification email has been sent.', 3000);
      }
    } catch (error: any) {
      setAuthError(error);
      debouncedToast.error('Verification Error', error.message, 5000);
    }
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser({
        data: data
      });

      if (error) {
        setAuthError(error);
        debouncedToast.error('Update Failed', error.message, 5000);
      } else {
        debouncedToast.success('Profile Updated', 'Your profile has been updated successfully.', 3000);
      }
    } catch (error: any) {
      setAuthError(error);
      debouncedToast.error('Update Error', error.message, 5000);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setAuthError(error);
        debouncedToast.error('Password Update Failed', error.message, 5000);
      } else {
        debouncedToast.success('Password Updated', 'Your password has been updated successfully.', 3000);
      }
    } catch (error: any) {
      setAuthError(error);
      debouncedToast.error('Password Error', error.message, 5000);
    }
  }, []);

  // Context value
  const value: AuthContextType = {
    // State
    user,
    session,
    isLoading,
    isEmailVerified,
    authStable,
    authError,
    isVerificationEmailSent,
    isAuthenticated: !!user && !!session,
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
