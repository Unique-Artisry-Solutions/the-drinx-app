
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SessionStorageManager } from '@/utils/sessionStorage';
import { getUserTypeFromMetadata, toUserType, type UserType } from '@/utils/userTypeGuards';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<any | null>(null);
  const [navigationReady, setNavigationReady] = useState(false);
  
  // Auth recovery state
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  
  // Dev mode state
  const [isUsingDevBypass, setIsUsingDevBypass] = useState(false);
  const [devUserType, setDevUserType] = useState<UserType | null>(null);

  // Computed properties
  const isAuthenticated = !!user && !!session && isEmailVerified;
  const userType = getUserTypeFromMetadata(user?.user_metadata) || devUserType || 'individual';
  const isReady = authStable && navigationReady;

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        SessionStorageManager.persistAuthSession(data.session);
        toast({
          title: "Success",
          description: "Successfully signed in!",
        });
      }

      return { data, error: null };
    } catch (error: any) {
      setAuthError(error);
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      setIsVerificationEmailSent(true);
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link.",
      });

      return { data, error: null };
    } catch (error: any) {
      setAuthError(error);
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      SessionStorageManager.clearAuthSession();
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      setIsVerificationEmailSent(false);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      setAuthError(error);
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      const emailVerified = data.user?.email_confirmed_at != null;
      setIsEmailVerified(emailVerified);
      
      return { isEmailVerified: emailVerified };
    } catch (error: any) {
      setAuthError(error);
      console.error('Refresh session error:', error);
      return { isEmailVerified: false };
    }
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;

      setIsVerificationEmailSent(true);
      toast({
        title: "Verification email sent",
        description: "Check your email for the verification link.",
      });
    } catch (error: any) {
      setAuthError(error);
      console.error('Send verification email error:', error);
      toast({
        title: "Error",
        description: "Failed to send verification email.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: data
      });
      
      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      setAuthError(error);
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      setAuthError(error);
      console.error('Update password error:', error);
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Auth recovery methods
  const recoverAuthState = useCallback(async (): Promise<boolean> => {
    try {
      setIsRecovering(true);
      setRecoveryAttempts(prev => prev + 1);
      
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsEmailVerified(data.session.user.email_confirmed_at != null);
        SessionStorageManager.persistAuthSession(data.session);
        return true;
      }

      return false;
    } catch (error: any) {
      setAuthError(error);
      console.error('Auth recovery error:', error);
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, []);

  const quickRecovery = useCallback(async (): Promise<boolean> => {
    try {
      setIsRecovering(true);
      
      // Clear any existing errors
      setAuthError(null);
      
      // Try to get current session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsEmailVerified(data.session.user.email_confirmed_at != null);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Quick recovery error:', error);
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, []);

  // Dev mode methods
  const getDevUserType = useCallback(() => {
    const stored = localStorage.getItem('dev_user_type');
    return stored ? toUserType(stored) : null;
  }, []);

  const setDevUserTypeLocal = useCallback((userType: UserType | null) => {
    if (userType) {
      localStorage.setItem('dev_user_type', userType);
      setDevUserType(userType);
      setIsUsingDevBypass(true);
    } else {
      localStorage.removeItem('dev_user_type');
      setDevUserType(null);
      setIsUsingDevBypass(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check for dev mode
        const devType = getDevUserType();
        if (devType) {
          setDevUserType(devType);
          setIsUsingDevBypass(true);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;

            console.log('Auth state change:', event, !!session);
            setSession(session);
            setUser(session?.user ?? null);
            setIsEmailVerified(session?.user?.email_confirmed_at != null);
            
            if (session) {
              SessionStorageManager.persistAuthSession(session);
            } else {
              SessionStorageManager.clearAuthSession();
            }
          }
        );

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsEmailVerified(session?.user?.email_confirmed_at != null);
          setAuthStable(true);
          setNavigationReady(true);
          setIsLoading(false);
        }

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthError(error);
          setAuthStable(true);
          setNavigationReady(true);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [getDevUserType]);

  const contextValue: AuthContextType = {
    // Core state
    user,
    session,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    isVerificationEmailSent,
    authStable,
    authError,
    userType,
    navigationReady,
    
    // Auth actions
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    
    // Recovery state and actions
    isRecovering,
    recoveryAttempts,
    quickRecovery,
    
    // Dev mode
    isReady,
    isUsingDevBypass,
    getDevUserType,
    setDevUserType: setDevUserTypeLocal
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
