
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { logAuthError, categorizeAuthError } from '@/utils/authErrorLogger';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshSession = async () => {
    try {
      console.log('[AUTH] Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        // Enhanced error logging
        logAuthError('refreshSession', error, { source: 'useAuthActions' });
        return { session: null, user: null, isEmailVerified: false };
      }
      
      const isVerified = data.session?.user ? (data.session.user.email_confirmed_at !== null) : false;
      console.log('[AUTH] Session refreshed, email verified:', isVerified);
      
      return { 
        session: data.session, 
        user: data.session?.user || null,
        isEmailVerified: isVerified
      };
    } catch (error: any) {
      // Enhanced error logging with additional context
      logAuthError('refreshSession', error, { 
        source: 'useAuthActions',
        caught: true,
        sessionData: false // Fixed the undefined data reference
      });
      return { session: null, user: null, isEmailVerified: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('[AUTH] Signing in user:', email);
      
      // Add timeout protection for sign in to prevent hanging
      const signInPromise = supabase.auth.signInWithPassword({ email, password });
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign in request timed out')), 10000);
      });
      
      // Race the promises
      const { data, error } = await Promise.race([
        signInPromise,
        timeoutPromise
      ]) as { data: any, error: any };
      
      if (error) {
        // Enhanced error logging
        const category = logAuthError('signIn', error, { emailProvided: !!email });
        
        // Custom handling based on error type
        if (category === 'network') {
          throw new Error('Unable to connect to authentication service. Please check your internet connection.');
        } else if (category === 'timeout') {
          throw new Error('Sign in request timed out. Please try again.');
        } else {
          throw error;
        }
      }
      
      console.log('[AUTH] Sign in successful:', data);
      
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
        localStorage.setItem('login_success_time', Date.now().toString());
        
        // Enhanced user type detection
        let userType = data.user?.user_metadata.user_type;
        console.log('[AUTH] User metadata from sign in:', data.user?.user_metadata);
        
        // If no user_type in metadata, try to determine from database roles
        if (!userType) {
          console.log('[AUTH] No user_type in metadata, checking roles from database');
          
          try {
            // Query the user_roles table to see if this user has any roles
            const { data: userRoles, error: rolesError } = await supabase
              .from('user_roles')
              .select('role, is_active')
              .eq('user_id', data.user.id)
              .eq('is_active', true)
              .maybeSingle();
              
            if (!rolesError && userRoles) {
              userType = userRoles.role;
              console.log('[AUTH] Found active role in database:', userType);
            }
          } catch (roleCheckError) {
            logAuthError('signIn.roleCheck', roleCheckError as Error, { userId: data.user.id });
            console.warn('[AUTH] Error checking user roles:', roleCheckError);
            // Default to individual if we can't determine the role
            userType = 'individual';
          }
        }
        
        // Final fallback to 'individual' if still no type
        userType = userType || 'individual';
        console.log('[AUTH] Setting user type to:', userType);
        localStorage.setItem('user_type', userType);
        
        // Explicitly log if this is a promoter account for debugging
        if (userType === 'promoter') {
          console.log('[AUTH] PROMOTER ACCOUNT DETECTED - Setting localStorage user_type=promoter');
          localStorage.setItem('user_type_timestamp', Date.now().toString());
        }
        
        if (data.user?.user_metadata.username) {
          localStorage.setItem('user_username', data.user.user_metadata.username);
        }
      }
    } catch (error: any) {
      // Use friendly toast messages based on error type
      const category = categorizeAuthError(error);
      
      let toastMessage = 'An error occurred during login';
      if (category === 'credentials') {
        toastMessage = 'Invalid email or password';
      } else if (category === 'verification') {
        toastMessage = 'Please verify your email before logging in';
      } else if (category === 'network') {
        toastMessage = 'Connection error - please check your internet';
      } else if (category === 'timeout') {
        toastMessage = 'Login request timed out - please try again';
      }
      
      toast({
        title: 'Login failed',
        description: toastMessage,
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
      
      // First clear all auth-related localStorage items
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_username');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_join_date');
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_session_created');
      localStorage.removeItem('admin_bypass');
      localStorage.removeItem('bypass_user_id');
      localStorage.removeItem('spiritless-auth-storage');
      
      // Use scope: 'global' to terminate all sessions across all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out of all devices',
      });
      
      console.log('User successfully signed out from all sessions');
      
      // Explicitly redirect to landing page on logout
      window.location.href = '/landing';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
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
