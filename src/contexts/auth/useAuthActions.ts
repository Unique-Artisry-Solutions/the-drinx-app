import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { authCache } from './authCache';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { useRetry } from '@/hooks/useRetry';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { executeWithRetry } = useRetry({
    maxAttempts: 3,
    baseDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Auth action retry ${attempt}:`, error.message);
    }
  });

  const refreshSession = async () => {
    try {
      console.log('Refreshing session in useAuthActions...');
      
      const { data, error } = await executeWithRetry(async () => {
        const result = await supabase.auth.refreshSession();
        if (result.error) throw result.error;
        return result;
      });
      
      if (data.session?.user) {
        // Update persistence
        sessionPersistenceService.updateSession(data.session, data.session.user);
        
        // Cache user type if available
        if (data.session.user.user_metadata?.user_type) {
          authCache.setUserType(data.session.user.id, data.session.user.user_metadata.user_type);
        }
        
        const isVerified = !!data.session.user.email_confirmed_at;
        console.log('Session refreshed, email verified:', isVerified);
        
        return { 
          session: data.session, 
          user: data.session.user,
          isEmailVerified: isVerified
        };
      }
      
      return { session: null, user: null, isEmailVerified: false };
    } catch (error) {
      console.error('Error in refreshSession:', error);
      return { session: null, user: null, isEmailVerified: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Signing in user:', email);
      
      const { data, error } = await executeWithRetry(async () => {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        return result;
      });
      
      console.log('Sign in successful:', data);
      
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Email not verified',
          description: 'Please check your email and verify your account before logging in.',
          variant: 'destructive',
        });
        
        await supabase.auth.signOut();
        throw new Error('Email not verified');
      } else if (data.user && data.session) {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        
        // Update persistence and cache
        sessionPersistenceService.updateSession(data.session, data.user);
        
        // Cache user data
        if (data.user.user_metadata?.user_type) {
          authCache.setUserType(data.user.id, data.user.user_metadata.user_type);
        }
        
        // Update localStorage for backward compatibility
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_email', data.user.email || '');
        localStorage.setItem('user_type', data.user.user_metadata.user_type || 'individual');
        if (data.user.user_metadata.username) {
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
      console.log('Signing out user and ending all sessions...');
      
      // Clear cache and persistence first
      authCache.clear();
      sessionPersistenceService.clearSession();
      
      // Clear localStorage
      clearAllSessions();
      
      // Sign out with retry logic
      await executeWithRetry(async () => {
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) throw error;
      });
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out of all devices',
      });
      
      console.log('User successfully signed out from all sessions');
      
      // Redirect to landing page
      window.location.href = '/landing';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Logout failed',
        description: error.message || 'An error occurred during logout',
        variant: 'destructive',
      });
      
      // Attempt to redirect even if there's an error
      window.location.href = '/landing';
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { [key: string]: any }) => {
    try {
      setIsLoading(true);
      console.log('Updating user profile:', data);
      
      await executeWithRetry(async () => {
        const { error } = await supabase.auth.updateUser({ data });
        if (error) throw error;
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      
      // Update cache and localStorage
      if (data.user_type) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          authCache.setUserType(user.id, data.user_type);
        }
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
