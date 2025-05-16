
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ToastActionElement } from '@/components/ui/toast';
import { clearAllSessions } from '@/utils/sessionCleaner';

interface UseAuthActionsProps {
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsEmailVerified: (isVerified: boolean) => void;
  setIsVerificationEmailSent: (isSent: boolean) => void;
  setAuthError: (error: Error | null) => void;
  updateLocalStorage: (user: any) => void;
  toast: {
    toast: (props: { 
      title?: string; 
      description?: string; 
      action?: ToastActionElement;
      variant?: 'default' | 'destructive';
    }) => void;
  };
}

export const useAuthActions = ({
  setSession,
  setUser,
  setIsLoading,
  setIsEmailVerified,
  setIsVerificationEmailSent,
  setAuthError,
  updateLocalStorage,
  toast
}: UseAuthActionsProps) => {
  
  // Function to refresh the current session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        setAuthError(error);
        throw error;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        updateLocalStorage(data.session.user);
      }
      
      // Update email verification status if we have a session
      const isEmailVerified = !!data?.session?.user?.email_confirmed_at;
      setIsEmailVerified(isEmailVerified);
      
      return { isEmailVerified };
    } catch (error) {
      console.error('Session refresh error:', error);
      if (error instanceof Error) {
        setAuthError(error);
      } else {
        setAuthError(new Error('Unknown error refreshing session'));
      }
      
      toast.toast({
        title: "Session Error",
        description: "There was an error refreshing your session.",
        variant: "destructive"
      });
      
      return { isEmailVerified: false };
    }
  };
  
  // Function to recover auth state after errors
  const recoverAuthState = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to recover auth state...');
      
      // Try to refresh the session first
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session during recovery:', error);
        throw error;
      }
      
      if (data.session) {
        console.log('Found existing session during recovery');
        setSession(data.session);
        setUser(data.session.user);
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
        updateLocalStorage(data.session.user);
        return true;
      } else {
        console.log('No active session found during recovery');
        return false;
      }
    } catch (error) {
      console.error('Auth recovery error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
      
      if (data.user && !data.user.email_confirmed_at) {
        toast.toast({
          title: 'Email not verified',
          description: 'Please check your email and verify your account before logging in.',
          variant: 'destructive',
        });
        
        await supabase.auth.signOut();
        throw new Error('Email not verified');
      } else {
        toast.toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        
        setSession(data.session);
        setUser(data.user);
        setIsEmailVerified(!!data.user?.email_confirmed_at);
        updateLocalStorage(data.user);
        
        return { error: null, data };
      }
    } catch (error: any) {
      toast.toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    try {
      setIsLoading(true);
      console.log('Starting sign up process for:', formData.email);
      
      const baseUrl = window.location.origin;
      const finalRedirectTo = formData.emailRedirectTo || `${baseUrl}/?email_confirmed=true`;
      console.log('Using redirect URL:', finalRedirectTo);
      
      const { data, error } = await supabase.auth.signUp({ 
        email: formData.email, 
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            user_type: formData.userType || 'individual',
            name: formData.name
          },
          emailRedirectTo: finalRedirectTo,
        }
      });
      
      if (error) {
        console.error('Signup error from Supabase:', error);
        throw error;
      }
      
      console.log('Signup response:', data);
      
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created, email verification needed');
        setIsVerificationEmailSent(true);
        toast.toast({
          title: 'Verification email sent',
          description: `Please check ${formData.email} inbox and click the verification link`,
        });
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error in signUp function:', error);
      toast.toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
        variant: 'destructive',
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out user and ending all sessions...');
      
      // First clear all auth-related localStorage items using our utility
      clearAllSessions();
      
      // Use scope: 'global' to terminate all sessions across all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      updateLocalStorage(null);
      
      toast.toast({
        title: 'Logged out',
        description: 'You have been successfully logged out of all devices',
      });
      
      console.log('User successfully signed out from all sessions');
      
      // Explicitly redirect to landing page on logout using window.location
      // This ensures a full page reload and clears any React Router state
      window.location.href = '/landing';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive',
      });
      
      // Attempt to redirect to landing page even if there's an error
      window.location.href = '/landing';
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setIsVerificationEmailSent(false);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      setIsVerificationEmailSent(true);
      toast.toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link',
      });
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast.toast({
        title: 'Failed to send verification email',
        description: error.message || 'An error occurred. Please try again later.',
        variant: 'destructive',
      });
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      setIsLoading(true);
      console.log('Updating user profile:', data);
      
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      toast.toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      
      if (data.user_type) {
        localStorage.setItem('user_type', data.user_type);
      }
      if (data.username) {
        localStorage.setItem('user_username', data.username);
      }
    } catch (error: any) {
      toast.toast({
        title: 'Update failed',
        description: error.message || 'An error occurred while updating profile',
        variant: 'destructive',
      });
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast.toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated',
      });
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.toast({
        title: 'Password update failed',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      });
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword
  };
};
