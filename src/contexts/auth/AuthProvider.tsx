
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authCache } from './authCache';
import { AuthContextType, AuthState, AuthUser } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isEmailVerified: false,
    isVerificationEmailSent: false,
    authError: null,
    authStable: false,
    userType: 'individual',
    navigationReady: false
  });

  // Auth actions implementation
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (formData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: formData.userType || 'individual',
            name: formData.name
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      authCache.clear();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      const isEmailVerified = data?.user?.email_confirmed_at != null;
      return { isEmailVerified };
    } catch (error) {
      return { isEmailVerified: false };
    }
  };

  const recoverAuthState = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setState(prev => ({
          ...prev,
          session: data.session,
          user: data.session.user as AuthUser,
          isAuthenticated: true,
          authStable: true
        }));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const sendVerificationEmail = async (email: string) => {
    await supabase.auth.resend({
      type: 'signup',
      email
    });
  };

  const updateUserProfile = async (data: any) => {
    await supabase.auth.updateUser({
      data
    });
  };

  const updatePassword = async (newPassword: string) => {
    await supabase.auth.updateUser({
      password: newPassword
    });
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user as AuthUser || null,
          isAuthenticated: !!session,
          isEmailVerified: session?.user?.email_confirmed_at != null,
          userType: session?.user?.user_metadata?.user_type || 'individual',
          isLoading: false,
          authStable: true,
          navigationReady: true
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          authStable: true,
          authError: error as Error
        }));
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user as AuthUser || null,
          isAuthenticated: !!session,
          isEmailVerified: session?.user?.email_confirmed_at != null,
          userType: session?.user?.user_metadata?.user_type || 'individual',
          authStable: true,
          navigationReady: true
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
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
