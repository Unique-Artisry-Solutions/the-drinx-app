import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { authService } from '@/services/AuthService';
import { AuthContextType, AuthState, AuthActions } from './types';
import { debouncedToast } from '@/utils/debouncedToast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | null>(null);
  const [navigationReady, setNavigationReady] = useState(false);
  
  const { toast } = useToast();
  const { goToHomePage } = useAppNavigation();
  
  // Refs for cleanup and debouncing
  const authStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userTypeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAuthEventRef = useRef<string>('');
  const userTypeLoadingRef = useRef(false);

  // Debounced auth state handler
  const debouncedAuthStateChange = useCallback((event: string, newSession: Session | null) => {
    // Clear any existing timeout
    if (authStateTimeoutRef.current) {
      clearTimeout(authStateTimeoutRef.current);
    }

    // Debounce rapid auth state changes
    authStateTimeoutRef.current = setTimeout(() => {
      // Skip duplicate events
      const eventKey = `${event}-${newSession?.user?.id || 'null'}`;
      if (lastAuthEventRef.current === eventKey) {
        return;
      }
      lastAuthEventRef.current = eventKey;

      console.log("AuthProvider - Debounced auth state change:", event, { 
        userId: newSession?.user?.id,
        hasSession: !!newSession 
      });

      setSession(newSession);
      setUser(newSession?.user || null);
      setIsEmailVerified(newSession?.user ? (newSession.user.email_confirmed_at !== null) : false);
      setAuthError(null);
      
      // Reset navigation readiness
      setNavigationReady(false);
      
      if (newSession?.user) {
        // User logged in - determine user type with debouncing
        handleUserTypeLoad(newSession.user);
      } else {
        // User logged out - clear states
        setUserType(null);
        setNavigationReady(true);
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_username');
      }
    }, 300); // 300ms debounce
  }, []);

  // Handle user type loading with proper state management
  const handleUserTypeLoad = useCallback(async (user: User) => {
    if (userTypeLoadingRef.current) {
      console.log("AuthProvider - User type loading already in progress, skipping");
      return;
    }

    userTypeLoadingRef.current = true;
    
    try {
      console.log("AuthProvider - Loading user type for user:", user.id);
      
      // Clear any existing timeout
      if (userTypeTimeoutRef.current) {
        clearTimeout(userTypeTimeoutRef.current);
      }

      // Check metadata first for faster response
      const metadataUserType = user.user_metadata?.user_type;
      if (metadataUserType && ['individual', 'establishment', 'promoter', 'admin'].includes(metadataUserType)) {
        console.log("AuthProvider - Using user type from metadata:", metadataUserType);
        setUserType(metadataUserType);
        localStorage.setItem('user_type', metadataUserType);
        
        // Set navigation ready after a short delay to ensure state is stable
        setTimeout(() => {
          setNavigationReady(true);
        }, 100);
        
        userTypeLoadingRef.current = false;
        return;
      }

      // Fallback to database lookup with timeout
      userTypeTimeoutRef.current = setTimeout(async () => {
        try {
          const { data: userRoles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .maybeSingle();

          if (error) {
            console.error("AuthProvider - Error fetching user role:", error);
            // Default to individual on error
            setUserType('individual');
            localStorage.setItem('user_type', 'individual');
          } else {
            const roleType = userRoles?.role || 'individual';
            console.log("AuthProvider - User type from database:", roleType);
            setUserType(roleType);
            localStorage.setItem('user_type', roleType);
          }
        } catch (error) {
          console.error("AuthProvider - Unexpected error fetching user role:", error);
          setUserType('individual');
          localStorage.setItem('user_type', 'individual');
        } finally {
          // Set navigation ready after user type is determined
          setTimeout(() => {
            setNavigationReady(true);
          }, 100);
          userTypeLoadingRef.current = false;
        }
      }, 200); // Small delay to allow for batch operations
      
    } catch (error) {
      console.error("AuthProvider - Error in handleUserTypeLoad:", error);
      setUserType('individual');
      localStorage.setItem('user_type', 'individual');
      setTimeout(() => {
        setNavigationReady(true);
      }, 100);
      userTypeLoadingRef.current = false;
    }
  }, []);

  // Handle navigation when ready
  useEffect(() => {
    if (navigationReady && authStable && !isLoading) {
      // Clear any existing navigation timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }

      // Only navigate if we have a user and are not already on the correct page
      if (user && userType) {
        const savedRedirect = localStorage.getItem('auth_redirect');
        
        if (savedRedirect) {
          console.log("AuthProvider - Navigating to saved redirect:", savedRedirect);
          localStorage.removeItem('auth_redirect');
          // Don't use goToHomePage for saved redirects - let the app handle it naturally
          return;
        }

        // Small delay to ensure all state updates are complete
        navigationTimeoutRef.current = setTimeout(() => {
          console.log("AuthProvider - Navigation ready, redirecting user type:", userType);
          goToHomePage(userType);
        }, 150);
      }
    }
  }, [navigationReady, authStable, isLoading, user, userType, goToHomePage]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    console.log("AuthProvider - Initializing auth state");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      debouncedAuthStateChange(event, session);
    });

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthProvider - Error getting session:", error);
          setAuthError(error);
        } else if (isMounted) {
          console.log("AuthProvider - Initial session check:", { 
            hasSession: !!session, 
            userId: session?.user?.id 
          });
          
          if (session) {
            debouncedAuthStateChange('INITIAL_SESSION', session);
          } else {
            // No session - set states directly
            setSession(null);
            setUser(null);
            setUserType(null);
            setNavigationReady(true);
          }
        }
      } catch (error: any) {
        console.error("AuthProvider - Unexpected error during initialization:", error);
        if (isMounted) {
          setAuthError(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthStable(true);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      
      // Clear all timeouts
      if (authStateTimeoutRef.current) {
        clearTimeout(authStateTimeoutRef.current);
      }
      if (userTypeTimeoutRef.current) {
        clearTimeout(userTypeTimeoutRef.current);
      }
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      
      // Reset refs
      userTypeLoadingRef.current = false;
      lastAuthEventRef.current = '';
    };
  }, [debouncedAuthStateChange]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    setNavigationReady(false);

    try {
      console.log("AuthProvider - Attempting sign in for:", email);
      
      const { error, user: signedInUser, session: signedInSession } = await authService.signIn(email, password);
      
      if (error) {
        console.error("AuthProvider - Sign in error:", error);
        setAuthError(error);
        
        debouncedToast.error(
          'Sign in failed',
          error.message || 'Please check your credentials and try again.',
          { debounceMs: 5000 }
        );
        
        return { error, data: null };
      }

      if (!signedInUser || !signedInSession) {
        const noUserError = new Error('No user returned from sign in');
        setAuthError(noUserError);
        
        debouncedToast.error(
          'Sign in failed',
          'No user data received. Please try again.',
          { debounceMs: 5000 }
        );
        
        return { error: noUserError, data: null };
      }

      console.log("AuthProvider - Sign in successful for user:", signedInUser.id);
      
      // Update localStorage immediately
      authService.updateLocalStorage(signedInUser);
      
      debouncedToast.success(
        'Welcome back!',
        'You have been signed in successfully.',
        { debounceMs: 3000 }
      );

      return { error: null, data: { user: signedInUser, session: signedInSession } };
      
    } catch (error: any) {
      console.error("AuthProvider - Unexpected sign in error:", error);
      setAuthError(error);
      
      debouncedToast.error(
        'Sign in failed',
        'An unexpected error occurred. Please try again.',
        { debounceMs: 5000 }
      );
      
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    setIsLoading(true);
    setAuthError(null);
    setIsVerificationEmailSent(false);

    try {
      console.log("AuthProvider - Attempting sign up for:", formData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            username: formData.username,
            user_type: formData.userType,
            phone: formData.phone
          }
        }
      });

      if (error) {
        console.error("AuthProvider - Sign up error:", error);
        setAuthError(error);
        
        debouncedToast.error(
          'Sign up failed',
          error.message || 'Please try again.',
          { debounceMs: 5000 }
        );
        
        return { error, data: null };
      }

      if (data.user && !data.session) {
        console.log("AuthProvider - Sign up successful, verification email sent");
        setIsVerificationEmailSent(true);
        
        debouncedToast.info(
          'Check your email',
          'Please verify your email address to complete registration.',
          { debounceMs: 3000 }
        );
      } else if (data.session) {
        console.log("AuthProvider - Sign up successful with immediate session");
        
        debouncedToast.success(
          'Welcome!',
          'Your account has been created successfully.',
          { debounceMs: 3000 }
        );
      }

      return { error: null, data };
      
    } catch (error: any) {
      console.error("AuthProvider - Unexpected sign up error:", error);
      setAuthError(error);
      
      debouncedToast.error(
        'Sign up failed',
        'An unexpected error occurred. Please try again.',
        { debounceMs: 5000 }
      );
      
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setAuthError(null);
    setNavigationReady(false);

    try {
      console.log("AuthProvider - Attempting sign out");
      
      const { error } = await authService.signOut();
      
      if (error) {
        console.error("AuthProvider - Sign out error:", error);
        setAuthError(error);
        
        debouncedToast.error(
          'Sign out failed',
          error.message || 'Please try again.',
          { debounceMs: 5000 }
        );
        
        return;
      }

      console.log("AuthProvider - Sign out successful");
      
      // Clear all auth-related state
      setSession(null);
      setUser(null);
      setUserType(null);
      setIsEmailVerified(false);
      setIsVerificationEmailSent(false);
      setNavigationReady(true);
      
      debouncedToast.success(
        'Signed out',
        'You have been signed out successfully.',
        { debounceMs: 3000 }
      );
      
    } catch (error: any) {
      console.error("AuthProvider - Unexpected sign out error:", error);
      setAuthError(error);
      
      debouncedToast.error(
        'Sign out failed',
        'An unexpected error occurred during sign out.',
        { debounceMs: 5000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      console.log("AuthProvider - Refreshing session");
      
      const result = await authService.refreshSession();
      
      if (result.error) {
        console.error("AuthProvider - Session refresh error:", result.error);
        setAuthError(result.error);
        return { isEmailVerified: false };
      }

      if (result.session && result.user) {
        console.log("AuthProvider - Session refresh successful");
        // Don't update state here - let onAuthStateChange handle it
        return { isEmailVerified: result.isEmailVerified };
      }

      return { isEmailVerified: false };
      
    } catch (error: any) {
      console.error("AuthProvider - Unexpected session refresh error:", error);
      setAuthError(error);
      return { isEmailVerified: false };
    }
  };

  const recoverAuthState = async () => {
    try {
      console.log("AuthProvider - Attempting auth state recovery");
      setIsLoading(true);
      setAuthError(null);
      
      const success = await authService.recoverFromStuckState({ 
        silent: false,
        autoRecovery: false 
      });
      
      if (success) {
        debouncedToast.success(
          'Session recovered',
          'Your authentication state has been reset.',
          { debounceMs: 3000 }
        );
      }
      
      return success;
      
    } catch (error: any) {
      console.error("AuthProvider - Auth recovery error:", error);
      setAuthError(error);
      
      debouncedToast.error(
        'Recovery failed',
        'Unable to recover authentication state.',
        { debounceMs: 5000 }
      );
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      console.log("Attempting to send verification email to:", email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error("Error sending verification email:", error);
        throw error;
      }

      console.log("Verification email sent successfully");
      setIsVerificationEmailSent(true);
      
      toast({
        title: "Verification email sent",
        description: "Please check your email and click the verification link.",
      });
    } catch (error: any) {
      console.error("Failed to send verification email:", error);
      toast({
        title: "Failed to send verification email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  const updateUserProfile = async (data: any) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log("AuthProvider - Updating user profile");
      
      const { error } = await supabase.auth.updateUser({
        data: data
      });

      if (error) {
        console.error("AuthProvider - Update profile error:", error);
        setAuthError(error);
        toast({
          title: 'Failed to update profile',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log("AuthProvider - Profile updated successfully");
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
    } catch (error: any) {
      console.error("AuthProvider - Unexpected update profile error:", error);
      setAuthError(error);
      toast({
        title: 'Failed to update profile',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log("AuthProvider - Updating password");
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error("AuthProvider - Update password error:", error);
        setAuthError(error);
        toast({
          title: 'Failed to update password',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log("AuthProvider - Password updated successfully");
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      
    } catch (error: any) {
      console.error("AuthProvider - Unexpected update password error:", error);
      setAuthError(error);
      toast({
        title: 'Failed to update password',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    // State
    user,
    session,
    isAuthenticated: !!user && !!session,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    navigationReady, // New state for navigation control
    
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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
