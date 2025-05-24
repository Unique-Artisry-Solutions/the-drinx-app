
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

  const refreshSession = async (): Promise<{ isEmailVerified: boolean }> => {
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
        
        return { isEmailVerified: isVerified };
      }
      
      return { isEmailVerified: false };
    } catch (error) {
      console.error('Error in refreshSession:', error);
      return { isEmailVerified: false };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null; data: any }> => {
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
        return { error: new Error('Email not verified'), data: null };
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
        
        return { error: null, data };
      }
      
      return { error: new Error('Unknown error occurred'), data: null };
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any): Promise<any> => {
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
          data: formData.data,
          emailRedirectTo: finalRedirectTo,
        }
      });
      
      if (error) {
        console.error('Signup error from Supabase:', error);
        return { error, data: null };
      }
      
      console.log('Signup response:', data);
      
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created, email verification needed');
        toast({
          title: 'Verification email sent',
          description: `Please check ${formData.email} inbox and click the verification link`,
        });
      }
      
      return { error: null, data };
    } catch (error: any) {
      console.error('Error in signUp function:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
        variant: 'destructive',
      });
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
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

  const updateUserProfile = async (data: { [key: string]: any }): Promise<void> => {
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

  const updatePassword = async (newPassword: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Updating user password');
      
      await executeWithRetry(async () => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      });
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated',
      });
    } catch (error: any) {
      toast({
        title: 'Password update failed',
        description: error.message || 'An error occurred while updating password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('Sending verification email to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`
        }
      });
      
      if (error) {
        console.error('Verification email error:', error);
        throw error;
      }
      
      toast({
        title: 'Verification Email Sent',
        description: 'Check your email for verification instructions',
      });
      
    } catch (error: any) {
      toast({
        title: 'Verification Email Failed',
        description: error.message || 'Failed to send verification email',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const recoverAuthState = async (): Promise<boolean> => {
    try {
      console.log('Attempting to recover auth state...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (!error && data.session) {
        sessionPersistenceService.updateSession(data.session, data.session.user);
        
        if (data.session.user?.user_metadata?.user_type) {
          authCache.setUserType(data.session.user.id, data.session.user.user_metadata.user_type);
        }
        
        console.log('Auth state recovered successfully');
        return true;
      }
      
      console.log('Auth state recovery failed');
      return false;
    } catch (error) {
      console.error('Error recovering auth state:', error);
      return false;
    }
  };

  return {
    isLoading,
    refreshSession,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    updatePassword,
    sendVerificationEmail,
    recoverAuthState
  };
}
