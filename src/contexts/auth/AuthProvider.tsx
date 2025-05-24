import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { AuthState, AuthActions, AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [userType, setUserType] = useState<string>('individual');
  
  const { toast } = useToast();
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializingRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  // Check user roles from the database
  const checkUserRoles = useCallback(async (userId: string): Promise<string> => {
    try {
      console.log('Checking user roles for:', userId);
      
      // Get active role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching user role:', roleError);
        return 'individual'; // Default fallback
      }

      if (roleData?.role) {
        console.log('Found active role:', roleData.role);
        // Handle admin role which might not be in the enum but exists in practice
        if (roleData.role === 'admin' || 
            ['individual', 'establishment', 'promoter'].includes(roleData.role)) {
          return roleData.role;
        }
      }

      // Fallback to individual if no valid role found
      return 'individual';
    } catch (error) {
      console.error('Error in checkUserRoles:', error);
      return 'individual';
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<{ isEmailVerified: boolean }> => {
    try {
      console.log('Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        setAuthError(error);
        return { isEmailVerified: false };
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        
        const verified = !!(data.user?.email_confirmed_at);
        setIsEmailVerified(verified);
        
        if (verified && data.user) {
          const detectedUserType = await checkUserRoles(data.user.id);
          setUserType(detectedUserType);
          localStorage.setItem('user_type', detectedUserType);
        }
        
        return { isEmailVerified: verified };
      }
      
      return { isEmailVerified: false };
    } catch (error: any) {
      console.error('Session refresh failed:', error);
      setAuthError(error);
      return { isEmailVerified: false };
    }
  }, [checkUserRoles]);

  const recoverAuthState = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Attempting auth state recovery...');
      setIsLoading(true);
      setAuthError(null);
      
      clearAllSessions();
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth recovery error:', error);
        setAuthError(error);
        return false;
      }
      
      if (data.session?.user) {
        setSession(data.session);
        setUser(data.session.user);
        
        const verified = !!(data.session.user.email_confirmed_at);
        setIsEmailVerified(verified);
        
        if (verified) {
          const detectedUserType = await checkUserRoles(data.session.user.id);
          setUserType(detectedUserType);
          localStorage.setItem('user_type', detectedUserType);
        }
        
        console.log('Auth state recovered successfully');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Auth recovery failed:', error);
      setAuthError(error);
      return false;
    } finally {
      setIsLoading(false);
      setAuthStable(true);
    }
  }, [checkUserRoles]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: Error | null; data: any }> => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setAuthError(error);
        return { error, data: null };
      }
      
      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
        
        const verified = !!(data.user.email_confirmed_at);
        setIsEmailVerified(verified);
        
        if (verified) {
          const detectedUserType = await checkUserRoles(data.user.id);
          setUserType(detectedUserType);
          localStorage.setItem('user_type', detectedUserType);
          localStorage.setItem('user_authenticated', 'true');
          localStorage.setItem('user_email', data.user.email || '');
        }
        
        console.log('Sign in successful, user type:', userType);
        return { error: null, data };
      }
      
      return { error: new Error('Authentication failed'), data: null };
    } catch (error: any) {
      console.error('Sign in failed:', error);
      setAuthError(error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  }, [checkUserRoles]);

  const signUp = useCallback(async (formData: any): Promise<any> => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name || formData.display_name,
            username: formData.username,
            user_type: formData.user_type || 'individual',
            phone: formData.phone
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        setAuthError(error);
        return { error, data: null };
      }
      
      if (data.user) {
        setUser(data.user);
        setIsVerificationEmailSent(true);
        
        console.log('Sign up successful, please verify email');
        return { error: null, data };
      }
      
      return { error: new Error('Registration failed'), data: null };
    } catch (error: any) {
      console.error('Sign up failed:', error);
      setAuthError(error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setAuthError(error);
      }
      
      // Clear all state
      setUser(null);
      setSession(null);
      setUserType('individual');
      setIsEmailVerified(false);
      setIsVerificationEmailSent(false);
      setAuthError(null);
      
      // Clear localStorage
      clearAllSessions();
      
      console.log('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out failed:', error);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendVerificationEmail = useCallback(async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        throw error;
      }
      
      setIsVerificationEmailSent(true);
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
      });
    } catch (error: any) {
      console.error('Send verification email error:', error);
      setAuthError(error);
      toast({
        title: 'Failed to send verification email',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateUserProfile = useCallback(async (data: any): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      setAuthError(error);
      toast({
        title: 'Failed to update profile',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updatePassword = useCallback(async (newPassword: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Update password error:', error);
      setAuthError(error);
      toast({
        title: 'Failed to update password',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isInitializingRef.current) return;
    
    isInitializingRef.current = true;
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session initialization error:', error);
          setAuthError(error);
        } else if (session?.user) {
          console.log('Found existing session');
          setSession(session);
          setUser(session.user);
          
          const verified = !!(session.user.email_confirmed_at);
          setIsEmailVerified(verified);
          
          if (verified) {
            const detectedUserType = await checkUserRoles(session.user.id);
            setUserType(detectedUserType);
            localStorage.setItem('user_type', detectedUserType);
            localStorage.setItem('user_authenticated', 'true');
            localStorage.setItem('user_email', session.user.email || '');
          }
        }
      } catch (error: any) {
        console.error('Auth initialization failed:', error);
        if (mounted) {
          setAuthError(error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setAuthStable(true);
          isInitializingRef.current = false;
        }
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setUserType('individual');
          setIsEmailVerified(false);
          setIsVerificationEmailSent(false);
          clearAllSessions();
        } else if (session?.user) {
          setUser(session.user);
          setSession(session);
          
          const verified = !!(session.user.email_confirmed_at);
          setIsEmailVerified(verified);
          
          if (verified) {
            const detectedUserType = await checkUserRoles(session.user.id);
            setUserType(detectedUserType);
            localStorage.setItem('user_type', detectedUserType);
            localStorage.setItem('user_authenticated', 'true');
            localStorage.setItem('user_email', session.user.email || '');
          }
        }
        
        setIsLoading(false);
        setAuthStable(true);
      }
    );
    
    cleanupRef.current = () => subscription.unsubscribe();
    
    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [checkUserRoles]);

  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    isAuthenticated: !!(user && session),
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
