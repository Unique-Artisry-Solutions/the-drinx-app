
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { checkAdminBypassStatus, createBypassUser } from '@/utils/adminBypass';
import { AuthContextType } from './types';
import { clearAllSessions } from '@/utils/sessionCleaner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider initialized');
    let isMounted = true;
    
    // First check for admin bypass
    const { isEnabled } = checkAdminBypassStatus();
    if (isEnabled) {
      console.log('Admin bypass active in AuthProvider, creating bypass user');
      const bypassUser = createBypassUser();
      setUser(bypassUser);
      setIsEmailVerified(true);
      setIsLoading(false);
      return;
    }
    
    // Set up auth state listener FIRST before any async calls
    console.log('Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, !!newSession);
        
        if (!isMounted) return;
        
        // Use direct state updates, not async calls
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setIsEmailVerified(!!newSession.user.email_confirmed_at);
          // Store user type in localStorage
          if (newSession.user.user_metadata?.user_type) {
            localStorage.setItem('user_type', newSession.user.user_metadata.user_type);
          }
          localStorage.setItem('user_authenticated', 'true');
          localStorage.setItem('user_email', newSession.user.email || '');
        } else if (event === 'SIGNED_OUT') {
          setIsEmailVerified(false);
          // Clear user data from localStorage on sign out
          clearAllSessions();
        }
      }
    );

    // THEN check for existing session
    console.log('Checking for existing session');
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log('Initial session check result:', !!existingSession);
      
      if (!isMounted) return;
      
      if (existingSession) {
        setSession(existingSession);
        setUser(existingSession.user);
        setIsEmailVerified(!!existingSession.user.email_confirmed_at);
        
        // Store user info in localStorage
        if (existingSession.user.user_metadata?.user_type) {
          localStorage.setItem('user_type', existingSession.user.user_metadata.user_type);
        }
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_email', existingSession.user.email || '');
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error('Error checking session:', error);
      if (isMounted) {
        setIsLoading(false);
        setSession(null);
        setUser(null);
      }
    });
    
    // Listen for admin bypass changes
    const handleBypassChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;
      
      console.log('Admin bypass changed in AuthProvider:', detail);
      
      if (!isMounted) return;
      
      if (detail.enabled) {
        const bypassUser = createBypassUser();
        setUser(bypassUser);
        setIsEmailVerified(true);
      } else {
        // Only clear user if we were in bypass mode
        if (checkAdminBypassStatus().isEnabled) {
          setUser(null);
          setSession(null);
          setIsEmailVerified(false);
          clearAllSessions();
        }
      }
    };
    
    const handleAuthReset = () => {
      if (!isMounted) return;
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      clearAllSessions();
    };
    
    window.addEventListener('adminBypassChanged', handleBypassChange);
    window.addEventListener('authReset', handleAuthReset);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('adminBypassChanged', handleBypassChange);
      window.removeEventListener('authReset', handleAuthReset);
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        throw new Error('Email not verified. Please check your inbox.');
      }
      
      console.log('Login successful:', data);
      
      // Store user info in localStorage
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', data.user.email || '');
      
      if (data.user.user_metadata?.user_type) {
        localStorage.setItem('user_type', data.user.user_metadata.user_type);
      }
      
      // Wait for session storage to be updated
      // This ensures our session data is fully persisted before any redirects
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, options?: {
    data?: { [key: string]: any },
    emailRedirectTo?: string
  }) => {
    try {
      console.log('Attempting to sign up:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data || {},
          emailRedirectTo: options?.emailRedirectTo || `${window.location.origin}/?email_confirmed=true`
        }
      });

      if (error) {
        throw error;
      }

      console.log('Signup successful:', data);
      toast({
        title: 'Signup successful',
        description: 'Please check your email to verify your account.',
      });
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProfile = async (data: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.updateUser({ data });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'An error occurred while updating your profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your inbox for password reset instructions',
      });
    } catch (error: any) {
      toast({
        title: 'Reset failed',
        description: error.message || 'An error occurred during password reset',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      
      // If we're in admin bypass mode, just clear the localStorage
      if (checkAdminBypassStatus().isEnabled) {
        clearAllSessions();
        
        // Trigger event to update state
        window.dispatchEvent(new CustomEvent('adminBypassChanged', { 
          detail: { enabled: false }
        }));
        
        toast({
          title: 'Signed out',
          description: 'You have been successfully logged out',
        });
        
        return;
      }
      
      // Regular sign out
      await supabase.auth.signOut({ scope: 'global' });
      clearAllSessions();
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const refreshSession = async (): Promise<{ isEmailVerified: boolean }> => {
    try {
      console.log('Refreshing session');
      
      // Skip refresh for admin bypass
      if (checkAdminBypassStatus().isEnabled) {
        console.log('Admin bypass active, skipping session refresh');
        return { isEmailVerified: true };
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return { isEmailVerified: false };
      }
      
      console.log('Session refresh result:', !!data.session);
      
      // Update session and user state with fresh data
      setSession(data.session);
      setUser(data.session?.user || null);
      
      const newEmailVerifiedStatus = !!data.session?.user?.email_confirmed_at;
      
      if (data.session?.user) {
        setIsEmailVerified(newEmailVerifiedStatus);
        // Update localStorage with fresh user data
        if (data.session.user.user_metadata?.user_type) {
          localStorage.setItem('user_type', data.session.user.user_metadata.user_type);
        }
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_email', data.session.user.email || '');
      }
      
      return { isEmailVerified: newEmailVerifiedStatus };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { isEmailVerified: false };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
