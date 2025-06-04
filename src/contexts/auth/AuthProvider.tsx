
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SessionStorageManager } from '@/utils/sessionStorage';
import { useAuthActions } from './useAuthActions';
import { useAuthRecovery } from '@/hooks/useAuthRecovery';
import { toUserType, UserType } from '@/utils/userTypeGuards';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: UserType | null;
  isReady: boolean;
  authStable: boolean;
  isEmailVerified: boolean;
  isUsingDevBypass: boolean;
  // Actions
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<boolean>;
  // Dev bypass functions
  getDevUserType: () => string | null;
  setDevUserType: (userType: string | null) => void;
  // State and actions for compatibility
  state: {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    userType: UserType | null;
    error: string | null;
  };
  actions: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (formData: any) => Promise<void>;
    switchRole: (role: any) => Promise<void>;
  };
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [authStable, setAuthStable] = useState(false);

  // Get auth actions
  const { signIn, signUp, signOut } = useAuthActions();
  const { 
    requestPasswordReset, 
    updatePassword, 
    clearRecoveryData,
    isLoading: recoveryLoading 
  } = useAuthRecovery();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user || null);
          
          if (session) {
            SessionStorageManager.persistAuthSession(session);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
        setIsReady(true);
        setAuthStable(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session) {
          SessionStorageManager.persistAuthSession(session);
        } else {
          SessionStorageManager.clearAuthSession();
        }
        
        setIsLoading(false);
        setIsReady(true);
        setAuthStable(true);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Dev auth bypass functionality
  const getDevUserType = () => {
    return SessionStorageManager.getItem<string>('dev_user_type');
  };

  const setDevUserType = (userType: string | null) => {
    if (userType) {
      SessionStorageManager.setItem('dev_user_type', userType);
    } else {
      SessionStorageManager.removeItem('dev_user_type');
    }
  };

  const isUsingDevBypass = !!getDevUserType();

  // Determine user type from dev mode or session
  const userType = toUserType(getDevUserType() || user?.user_metadata?.user_type);

  const isAuthenticated = !!user || isUsingDevBypass;
  const isEmailVerified = user?.email_confirmed_at != null;

  // Recovery functions
  const recoverAuthState = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      return !!session;
    } catch (error) {
      console.error('Auth recovery failed:', error);
      return false;
    }
  };

  const refreshSession = async (): Promise<{ isEmailVerified: boolean }> => {
    try {
      const { data: { session } } = await supabase.auth.refreshSession();
      setSession(session);
      setUser(session?.user || null);
      return { isEmailVerified: session?.user?.email_confirmed_at != null };
    } catch (error) {
      console.error('Session refresh failed:', error);
      return { isEmailVerified: false };
    }
  };

  // Compatibility state and actions
  const state = {
    user,
    session,
    isLoading,
    isAuthenticated,
    userType,
    error: null
  };

  const actions = {
    login: async (email: string, password: string) => {
      const result = await signIn(email, password);
      if (result.error) throw result.error;
    },
    logout: signOut,
    signup: async (formData: any) => {
      const result = await signUp(formData.email, formData.password);
      if (result.error) throw result.error;
    },
    switchRole: async (role: any) => {
      // Mock implementation for role switching
      console.log('Role switch requested:', role);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    userType,
    isReady,
    authStable,
    isEmailVerified,
    isUsingDevBypass,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    getDevUserType,
    setDevUserType,
    state,
    actions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook directly from this file
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
