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

  // Helper function to update localStorage with user data
  const updateLocalStorage = (user: AuthUser | null) => {
    if (user) {
      console.log("AuthProvider - Updating localStorage with user data:", {
        email: user.email,
        userType: user.user_metadata?.user_type
      });
      
      localStorage.setItem('user_authenticated', 'true');
      if (user.email) {
        localStorage.setItem('user_email', user.email);
      }
      if (user.user_metadata?.user_type) {
        localStorage.setItem('user_type', user.user_metadata.user_type);
      }
      if (user.user_metadata?.username) {
        localStorage.setItem('user_username', user.user_metadata.username);
      }
    } else {
      console.log("AuthProvider - Clearing localStorage auth data");
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_username');
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("AuthProvider - Initializing auth state");
        
        // Get session from Supabase Auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("AuthProvider - Found existing session for:", session.user.email);
          updateLocalStorage(session.user as AuthUser);
          
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
          console.log("AuthProvider - No existing session found");
          setState(current => ({
            ...current,
            isLoading: false,
            authStable: true
          }));
        }
      } catch (error) {
        console.error('AuthProvider - Error initializing auth:', error);
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
        console.log('AuthProvider - Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          console.log("AuthProvider - User signed in, updating state");
          updateLocalStorage(session.user as AuthUser);
          
          setState(current => ({
            ...current,
            session,
            user: session.user as AuthUser,
            isAuthenticated: true,
            isLoading: false,
            isEmailVerified: !!session.user.email_confirmed_at,
            authStable: true,
            authError: null
          }));
        } else if (event === 'SIGNED_OUT') {
          console.log("AuthProvider - User signed out, clearing state");
          updateLocalStorage(null);
          
          setState(current => ({
            ...initialState,
            isLoading: false,
            authStable: true
          }));
        } else if (event === 'USER_UPDATED' && session) {
          console.log("AuthProvider - User updated, refreshing state");
          updateLocalStorage(session.user as AuthUser);
          
          setState(current => ({
            ...current,
            session,
            user: session.user as AuthUser,
            isAuthenticated: true,
            isEmailVerified: !!session.user.email_confirmed_at,
            authStable: true
          }));
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log("AuthProvider - Token refreshed");
          setState(current => ({
            ...current,
            session,
            user: session.user as AuthUser,
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
      console.log("AuthProvider - Signing out user");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear localStorage immediately
      updateLocalStorage(null);
      
      setState({
        ...initialState,
        isLoading: false,
        authStable: true
      });
    } catch (error: any) {
      console.error('AuthProvider - Error signing out:', error);
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
        updateLocalStorage(session.user as AuthUser);
        
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
        updateLocalStorage(null);
        
        setState(current => ({
          ...initialState,
          isLoading: false,
          authStable: true
        }));

        return { isEmailVerified: false };
      }
    } catch (error: any) {
      console.error('AuthProvider - Error refreshing session:', error);
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
        const updatedUser = {
          ...state.user,
          user_metadata: {
            ...state.user.user_metadata,
            ...data
          }
        };
        
        updateLocalStorage(updatedUser);
        
        setState(current => ({
          ...current,
          user: updatedUser
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

  // Fixed: Create the value object with all required methods
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
