import React, { createContext, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType, AuthUser } from './types';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { useToast } from '@/hooks/use-toast';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | null>(null);

  const { toast } = useToast();
  const { goToHomePage } = useAppNavigation();

  // Prevent useEffect from running on initial render
  const isFirstRender = useRef(true);

  // Store the timeout id in a ref
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Function to clear the timeout
  const clearTimeoutRef = useRef(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  });

  // Function to set the timeout
  const setTimeoutRef = useRef((callback: (...args: any[]) => void, ms: number) => {
    timeoutIdRef.current = setTimeout(callback, ms);
  });

  const determineUserType = useCallback(async (userId: string): Promise<'individual' | 'establishment' | 'promoter' | 'admin'> => {
    try {
      console.log('AuthProvider: Determining user type for user:', userId);
      
      // Special handling for admin - check if this is the admin email first
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email === 'jacksonmcfarland14@gmail.com') {
        console.log('AuthProvider: Admin user detected by email');
        return 'admin';
      }

      // Check user_roles table for role assignment
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (roleError) {
        console.error('AuthProvider: Error fetching user role:', roleError);
        // If admin email but no role found, still return admin
        if (userData.user?.email === 'jacksonmcfarland14@gmail.com') {
          return 'admin';
        }
        return 'individual'; // Default fallback
      }

      const dbRole = roleData.role as 'individual' | 'establishment' | 'promoter';
      
      // Special case: if this is the admin email, return admin regardless of DB role
      if (userData.user?.email === 'jacksonmcfarland14@gmail.com') {
        console.log('AuthProvider: Admin user confirmed by email, overriding DB role');
        return 'admin';
      }

      console.log('AuthProvider: User type determined from database:', dbRole);
      return dbRole;
    } catch (error) {
      console.error('AuthProvider: Error in determineUserType:', error);
      return 'individual';
    }
  }, []);

  const processAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    console.log('AuthProvider: Auth change event:', event);
    setIsLoading(true);
    setAuthError(null);

    if (session) {
      console.log('AuthProvider: Session found, setting session and user');
      setSession(session);
      setUser(session.user);
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', session.user.email || '');

      try {
        const determinedUserType = await determineUserType(session.user.id);
        console.log('AuthProvider: Setting user type:', determinedUserType);
        setUserType(determinedUserType);
        localStorage.setItem('user_type', determinedUserType);
      } catch (error) {
        console.error('AuthProvider: Error determining user type:', error);
        setUserType('individual');
        localStorage.setItem('user_type', 'individual');
      }
    } else {
      console.log('AuthProvider: No session, clearing session and user');
      setSession(null);
      setUser(null);
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      setUserType(null);
      localStorage.removeItem('user_type');
    }

    // Set auth as stable after initial load
    if (isFirstRender.current) {
      console.log('AuthProvider: Initial auth load complete, setting authStable to true');
      setAuthStable(true);
      isFirstRender.current = false;
    }

    setIsLoading(false);
  }, [determineUserType]);

  useEffect(() => {
    // Initial load of auth state
    const loadSession = async () => {
      console.log('AuthProvider: Initializing auth state...');
      setIsLoading(true);
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          processAuthChange('INITIAL_SESSION', session);
        })
        .catch(error => {
          console.error("AuthProvider: Error getting initial session:", error);
          setAuthError(error);
          setIsLoading(false);
          setAuthStable(true); // Mark as stable even on error
        });

      // Set up auth state listener
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('AuthProvider: Supabase auth state change:', event);
        processAuthChange(event, session);
      });
    };

    loadSession();

    // Cleanup function
    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      clearTimeoutRef.current();
    };
  }, [processAuthChange]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('AuthProvider: Sign in error:', error);
        setAuthError(error);
        toast({
          title: 'Sign-in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error, data: null };
      }

      console.log('AuthProvider: Sign in successful, data:', data);
      return { error: null, data };
    } catch (error: any) {
      console.error('AuthProvider: Unexpected sign-in error:', error);
      setAuthError(error);
      toast({
        title: 'Sign-in failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error: new Error(error.message || 'An unexpected error occurred'), data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    setIsLoading(true);
    setAuthError(null);

    try {
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
        console.error('AuthProvider: Sign up error:', error);
        setAuthError(error);
        toast({
          title: 'Sign-up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      console.log('AuthProvider: Sign up successful, data:', data);
      toast({
        title: 'Sign-up successful',
        description: 'Please check your email to verify your account.',
      });
      return { data };
    } catch (error: any) {
      console.error('AuthProvider: Unexpected sign-up error:', error);
      setAuthError(error);
      toast({
        title: 'Sign-up failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { error: new Error(error.message || 'An unexpected error occurred') };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('AuthProvider: Sign out error:', error);
        setAuthError(error);
        toast({
          title: 'Sign-out failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('AuthProvider: Sign out successful');
      clearAllSessions();
      goToHomePage();
    } catch (error: any) {
      console.error('AuthProvider: Unexpected sign-out error:', error);
      setAuthError(error);
      toast({
        title: 'Sign-out failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('AuthProvider: Refresh session error:', error);
        setAuthError(error);
        toast({
          title: 'Refresh session failed',
          description: error.message,
          variant: 'destructive',
        });
        return { isEmailVerified: false };
      }

      console.log('AuthProvider: Refresh session successful, data:', data);
      setIsEmailVerified(data?.session?.user?.email_confirmed_at !== null);
      return { isEmailVerified: data?.session?.user?.email_confirmed_at !== null };
    } catch (error: any) {
      console.error('AuthProvider: Unexpected refresh session error:', error);
      setAuthError(error);
      toast({
        title: 'Refresh session failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { isEmailVerified: false };
    } finally {
      setIsLoading(false);
    }
  };

  const recoverAuthState = async (): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    console.log('AuthProvider: Attempting to recover auth state...');

    try {
      // Trigger a session recovery with the Supabase client
      await supabase.auth.getSession();
      console.log('AuthProvider: Session recovery triggered.');
      toast({
        title: 'Session recovery initiated',
        description: 'Attempting to re-establish your session...',
      });
      return true;
    } catch (recoveryError: any) {
      console.error('AuthProvider: Session recovery failed:', recoveryError);
      setAuthError(recoveryError);
      toast({
        title: 'Session recovery failed',
        description: recoveryError.message || 'Failed to recover session.',
        variant: 'destructive',
      });
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
      if (!user) {
        throw new Error('No user is currently signed in.');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) {
        console.error('AuthProvider: Update user profile error:', profileError);
        setAuthError(profileError);
        toast({
          title: 'Failed to update profile',
          description: profileError.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('AuthProvider: User profile updated successfully, data:', profileData);

      // Update the user object in the AuthContext
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          ...data,
        },
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      console.error('AuthProvider: Unexpected update user profile error:', error);
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
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('AuthProvider: Update password error:', error);
        setAuthError(error);
        toast({
          title: 'Failed to update password',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('AuthProvider: Password updated successfully, data:', data);
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error: any) {
      console.error('AuthProvider: Unexpected update password error:', error);
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
    session,
    user,
    isAuthenticated: !!(user && session),
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
