import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthUser, AuthContextType } from './types';
import { supabase } from '@/lib/supabase';

const initialState = {
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isEmailVerified: false,
  isVerificationEmailSent: false,
  authError: null,
  authStable: false
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => { return null; },
  signOut: async () => {},
  refreshSession: async () => ({ isEmailVerified: false }),
  recoverAuthState: async () => false,
  sendVerificationEmail: async () => {},
  updateUserProfile: async () => {},
  updatePassword: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    ...initialState
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get session from Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setState(current => ({
            ...current,
            session,
            user: session.user as AuthUser,
            isAuthenticated: true,
            isLoading: false,
            isEmailVerified: !!session.user.email_confirmed_at,
            authStable: true
          }));
        } else {
          setState(current => ({
            ...current,
            isLoading: false,
            authStable: true
          }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(current => ({
          ...current,
          isLoading: false,
          authError: error as Error,
          authStable: true
        }));
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          setState(current => ({
            ...current,
            session,
            user: session.user as AuthUser,
            isAuthenticated: true,
            isLoading: false,
            isEmailVerified: !!session.user.email_confirmed_at,
            authStable: true
          }));
        } else if (event === 'SIGNED_OUT') {
          setState(current => ({
            ...initialState,
            isLoading: false,
            authStable: true
          }));
        } else if (event === 'USER_UPDATED' && session) {
          setState(current => ({
            ...current,
            session,
            user: session.user as AuthUser,
            isAuthenticated: true,
            isEmailVerified: !!session.user.email_confirmed_at,
            authStable: true
          }));
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(current => ({ ...current, isLoading: true, authError: null }));
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;

      return { error: null, data };
    } catch (error: any) {
      setState(current => ({
        ...current,
        isLoading: false,
        authError: error
      }));
      return { error, data: null };
    }
  };

  const signUp = async (formData: any) => {
    setState(current => ({ ...current, isLoading: true, authError: null }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.data?.name,
            username: formData.data?.username,
            user_type: formData.data?.user_type || 'individual'
          },
          emailRedirectTo: formData.emailRedirectTo || `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      setState(current => ({
        ...current,
        isLoading: false,
        isVerificationEmailSent: true
      }));
      
      return data;
    } catch (error: any) {
      setState(current => ({
        ...current,
        isLoading: false,
        authError: error
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setState({
        ...initialState,
        isLoading: false,
        authStable: true
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      setState(current => ({
        ...current,
        authError: error
      }));
      throw error;
    }
  };

  const refreshSession = async () => {
    setState(current => ({ ...current, isLoading: true }));
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setState(current => ({
          ...current,
          session,
          user: session.user as AuthUser,
          isAuthenticated: true,
          isLoading: false,
          isEmailVerified: !!session.user.email_confirmed_at,
          authStable: true
        }));

        return { isEmailVerified: !!session.user.email_confirmed_at };
      } else {
        setState(current => ({
          ...initialState,
          isLoading: false,
          authStable: true
        }));

        return { isEmailVerified: false };
      }
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      setState(current => ({
        ...current,
        isLoading: false,
        authError: error,
        authStable: true
      }));
      return { isEmailVerified: false };
    }
  };

  const recoverAuthState = async () => {
    await refreshSession();
    return true;
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) throw error;
      
      setState(current => ({
        ...current,
        isVerificationEmailSent: true
      }));
    } catch (error: any) {
      setState(current => ({
        ...current,
        authError: error
      }));
      throw error;
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) throw error;
      
      if (state.user) {
        setState(current => ({
          ...current,
          user: {
            ...current.user!,
            user_metadata: {
              ...current.user!.user_metadata,
              ...data
            }
          }
        }));
      }
    } catch (error: any) {
      setState(current => ({
        ...current,
        authError: error
      }));
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
    } catch (error: any) {
      setState(current => ({
        ...current,
        authError: error
      }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail: state.sendVerificationEmail || (async () => {}),
    updateUserProfile: state.updateUserProfile || (async () => {}),
    updatePassword: state.updatePassword || (async () => {})
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
