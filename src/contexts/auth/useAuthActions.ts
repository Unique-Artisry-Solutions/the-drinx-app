
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshSession = async () => {
    try {
      console.log('Refreshing session in useAuthActions...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return { session: null, user: null, isEmailVerified: false };
      }
      
      const isVerified = data.session?.user ? (data.session.user.email_confirmed_at !== null) : false;
      console.log('Session refreshed, email verified:', isVerified);
      
      return { 
        session: data.session, 
        user: data.session?.user || null,
        isEmailVerified: isVerified
      };
    } catch (error) {
      console.error('Error in refreshSession:', error);
      return { session: null, user: null, isEmailVerified: false };
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
        toast({
          title: 'Email not verified',
          description: 'Please check your email and verify your account before logging in.',
          variant: 'destructive',
        });
        
        await supabase.auth.signOut();
        throw new Error('Email not verified');
      } else {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_email', data.user?.email || '');
        localStorage.setItem('user_type', data.user?.user_metadata.user_type || 'individual');
        if (data.user?.user_metadata.username) {
          localStorage.setItem('user_username', data.user.user_metadata.username);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: { 
    data?: { [key: string]: any },
    emailRedirectTo?: string 
  }) => {
    try {
      setIsLoading(true);
      console.log('Starting sign up process for:', email);
      
      // Make sure we have a proper redirect URL with the confirmation parameter
      const baseUrl = window.location.origin;
      const finalRedirectTo = options?.emailRedirectTo || `${baseUrl}/?email_confirmed=true`;
      console.log('Using redirect URL:', finalRedirectTo);
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: options?.data,
          emailRedirectTo: finalRedirectTo,
        }
      });
      
      if (error) {
        console.error('Signup error from Supabase:', error);
        throw error;
      }
      
      console.log('Signup response:', data);
      
      // Check if the user was created but needs email verification
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created, email verification needed');
        toast({
          title: 'Verification email sent',
          description: `Please check ${email} inbox and click the verification link`,
        });
      }
    } catch (error: any) {
      console.error('Error in signUp function:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Signing out user...');
      
      // Clear all auth-related localStorage items first
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_username');
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_session_created');
      localStorage.removeItem('admin_bypass');
      
      // Then perform the actual sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      
      // Use hard navigation with setTimeout to ensure the UI updates before redirect
      setTimeout(() => {
        window.location.href = '/landing';
      }, 100);
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { [key: string]: any }) => {
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
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      
      // Update localStorage with new profile data
      if (data.user_type) {
        localStorage.setItem('user_type', data.user_type);
      }
      if (data.username) {
        localStorage.setItem('user_username', data.username);
      }
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'An error occurred while updating profile',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      console.log('Sending password reset email to:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for password reset instructions',
      });
      
    } catch (error: any) {
      toast({
        title: 'Password Reset Failed',
        description: error.message || 'Failed to send password reset email',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    refreshSession,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword
  };
}
