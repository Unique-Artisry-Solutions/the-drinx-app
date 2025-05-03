
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { checkAdminBypassStatus, createBypassUser } from '@/utils/adminBypass';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        // Use setTimeout to avoid nested Supabase calls
        setTimeout(() => {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            setIsEmailVerified(!!session.user.email_confirmed_at);
          } else if (event === 'SIGNED_OUT') {
            setIsEmailVerified(false);
          }
        }, 0);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check result:', !!session);
      
      if (session) {
        setSession(session);
        setUser(session.user);
        setIsEmailVerified(!!session.user.email_confirmed_at);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error('Error checking session:', error);
      setIsLoading(false);
      setSession(null);
      setUser(null);
    });
    
    // Listen for admin bypass changes
    const handleBypassChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;
      
      console.log('Admin bypass changed in AuthProvider:', detail);
      
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
        }
      }
    };
    
    window.addEventListener('adminBypassChanged', handleBypassChange);
    window.addEventListener('authReset', () => {
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('adminBypassChanged', handleBypassChange);
      window.removeEventListener('authReset', () => {
        setUser(null);
        setSession(null);
        setIsEmailVerified(false);
      });
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        throw new Error('Email not verified. Please check your inbox.');
      }
      
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data || {},
          emailRedirectTo: options?.emailRedirectTo
        }
      });

      if (error) {
        throw error;
      }

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
      // If we're in admin bypass mode, just clear the localStorage
      if (checkAdminBypassStatus().isEnabled) {
        localStorage.removeItem('admin_bypass');
        localStorage.removeItem('bypass_user_id');
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_username');
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_session_created');
        
        // Trigger event to update state
        window.dispatchEvent(new CustomEvent('adminBypassChanged', { 
          detail: { enabled: false }
        }));
        
        return;
      }
      
      // Regular sign out
      await supabase.auth.signOut({ scope: 'global' });
      
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
      // Skip refresh for admin bypass
      if (checkAdminBypassStatus().isEnabled) {
        return { isEmailVerified: true };
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      const newEmailVerifiedStatus = !!data.session?.user?.email_confirmed_at;
      
      if (data.session?.user) {
        setIsEmailVerified(newEmailVerifiedStatus);
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
