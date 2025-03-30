
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { [key: string]: any }) => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      // Update email verification status
      if (data.session?.user) {
        setIsEmailVerified(data.session.user.email_confirmed_at !== null);
      }
    } catch (error) {
      console.error('Error in refreshSession:', error);
    }
  };

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      
      // Set email verification status
      if (data.session?.user) {
        setIsEmailVerified(data.session.user.email_confirmed_at !== null);
      }
      
      setIsLoading(false);
    };

    checkSession();

    // Set up authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Update email verification status
        if (currentSession?.user) {
          setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
          
          if (event === 'SIGNED_IN') {
            // If email is verified, store authentication state in localStorage
            if (currentSession.user.email_confirmed_at) {
              localStorage.setItem('user_authenticated', 'true');
              localStorage.setItem('user_email', currentSession.user.email || '');
              localStorage.setItem('user_type', currentSession.user.user_metadata.user_type || 'individual');
              
              // Redirect to explore if user has just verified email
              if (window.location.href.includes('?email_confirmed=true')) {
                window.location.href = '/explore';
              }
            }
          } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('user_authenticated');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_type');
          }
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Email not verified',
          description: 'Please check your email and verify your account before logging in.',
          variant: 'destructive',
        });
        
        // Sign out the user if email is not verified
        await supabase.auth.signOut();
        throw new Error('Email not verified');
      } else {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        
        // Store authentication state in localStorage
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_email', data.user?.email || '');
        localStorage.setItem('user_type', data.user?.user_metadata.user_type || 'individual');
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

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setIsLoading(true);
      
      // Enable email confirmation by default
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/?email_confirmed=true`,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Registration successful',
        description: 'Please check your email to confirm your account',
      });
    } catch (error: any) {
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear local storage
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_type');
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
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
      
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
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

  const value = {
    user,
    session,
    isLoading,
    isEmailVerified,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
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
