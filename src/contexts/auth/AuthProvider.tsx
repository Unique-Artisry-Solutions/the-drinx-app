
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType, AuthState } from './types';

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  isEmailVerified: false,
  isVerificationEmailSent: false,
  isEmailError: false,
  error: null,
  userRole: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  
  // Detect and log admin bypass for debugging
  useEffect(() => {
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    console.log('Admin bypass detected:', isAdminBypass);
  }, []);
  
  // Initialize authentication state from Supabase
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setState(prev => ({ ...prev, error, isLoading: false }));
          return;
        }
        
        // Check if admin bypass is enabled
        const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
        let userRole = 'guest';
        
        if (isAdminBypass) {
          userRole = 'admin';
        } else if (session?.user) {
          userRole = 'user';
          // Check if user has admin role in database - simplified for now
        }
        
        setState(prev => ({ 
          ...prev, 
          session, 
          user: session?.user || null,
          isLoading: false,
          userRole: userRole as any
        }));
        
        // Set up auth subscription
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state changed:', event);
            setState(prev => ({ 
              ...prev, 
              session, 
              user: session?.user || null,
              isLoading: false
            }));
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setState(prev => ({ ...prev, error: error as Error, isLoading: false }));
      }
    };
    
    initialize();
  }, []);
  
  // Authentication functions
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, redirectTo?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any auth related localStorage items
      localStorage.removeItem('user_type');
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_bypass');
      
      // Force redirect to landing page
      window.location.href = '/landing';
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };
  
  const sendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setState(prev => ({ ...prev, isVerificationEmailSent: true }));
    } catch (error) {
      console.error('Error sending verification email:', error);
      setState(prev => ({ ...prev, isEmailError: true }));
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };
  
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };
  
  const updateUserProfile = async (data: Record<string, any>) => {
    try {
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };
  
  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    sendVerificationEmail,
    resetPassword,
    updatePassword,
    updateUserProfile
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
