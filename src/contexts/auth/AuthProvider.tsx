
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType, AuthState, AuthActions } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Core auth state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<any | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [navigationReady, setNavigationReady] = useState(false);
  
  // Recovery state
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  
  // Dev mode state
  const [isReady, setIsReady] = useState(false);
  const [isUsingDevBypass, setIsUsingDevBypass] = useState(false);

  const isAuthenticated = !!session?.user;

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      return { error, data: null };
    }
  }, []);

  const signUp = useCallback(async (formData: any) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: formData
        }
      });

      if (error) throw error;
      setIsVerificationEmailSent(true);
      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      return { error, data: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { isEmailVerified: !!data.session?.user?.email_confirmed_at };
    } catch (error: any) {
      setAuthError(error);
      return { isEmailVerified: false };
    }
  }, []);

  const recoverAuthState = useCallback(async () => {
    try {
      setIsRecovering(true);
      setRecoveryAttempts(prev => prev + 1);
      
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsEmailVerified(!!data.session.user.email_confirmed_at);
      }
      
      setIsRecovering(false);
      return true;
    } catch (error: any) {
      setAuthError(error);
      setIsRecovering(false);
      return false;
    }
  }, []);

  const quickRecovery = useCallback(async () => {
    return await recoverAuthState();
  }, [recoverAuthState]);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      if (error) throw error;
      setIsVerificationEmailSent(true);
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const getDevUserType = useCallback(() => {
    return userType;
  }, [userType]);

  const setDevUserType = useCallback((newUserType: 'individual' | 'establishment' | 'promoter' | 'admin' | null) => {
    if (newUserType) {
      setUserType(newUserType);
    }
  }, []);

  // Compatibility methods
  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.error) {
      throw result.error;
    }
  }, [signIn]);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const signup = useCallback(async (formData: any) => {
    const result = await signUp(formData);
    if (result.error) {
      throw result.error;
    }
  }, [signUp]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates: any) => {
    await updateUserProfile(updates);
  }, [updateUserProfile]);

  const switchRole = useCallback(async (role: 'individual' | 'establishment' | 'promoter' | 'admin') => {
    setUserType(role);
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            setAuthError(error);
          } else {
            setSession(session);
            setUser(session?.user || null);
            setIsEmailVerified(!!session?.user?.email_confirmed_at);
          }
          setAuthStable(true);
          setNavigationReady(true);
          setIsReady(true);
          setIsLoading(false);
        }
      } catch (error: any) {
        if (mounted) {
          setAuthError(error);
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          setIsEmailVerified(!!session?.user?.email_confirmed_at);
          setAuthError(null);
          
          if (event === 'SIGNED_OUT') {
            setUserType('individual');
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Create state and actions objects for backward compatibility
  const state: AuthState = {
    session,
    user,
    isAuthenticated,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    navigationReady,
    isRecovering,
    recoveryAttempts,
    isReady,
    isUsingDevBypass
  };

  const actions: AuthActions = {
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    quickRecovery,
    getDevUserType,
    setDevUserType,
    login,
    logout,
    signup,
    resetPassword,
    updateProfile,
    switchRole
  };

  const contextValue: AuthContextType = {
    // Direct properties
    session,
    user,
    isAuthenticated,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    navigationReady,
    isRecovering,
    recoveryAttempts,
    isReady,
    isUsingDevBypass,
    
    // Methods
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    quickRecovery,
    getDevUserType,
    setDevUserType,
    login,
    logout,
    signup,
    resetPassword,
    updateProfile,
    switchRole,
    
    // Backward compatibility
    state,
    actions
  };

  return (
    <AuthContext.Provider value={contextValue}>
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

// Export the type for external use
export type { AuthContextType };
