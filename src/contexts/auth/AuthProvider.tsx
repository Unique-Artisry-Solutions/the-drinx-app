import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType } from '@/types/auth';
import { authService } from '@/services/AuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [userType, setUserType] = useState<string>('');
  
  // Refs to prevent race conditions and duplicate calls
  const initializationComplete = useRef(false);
  const isInitializing = useRef(false);
  
  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    if (initializationComplete.current || isInitializing.current) {
      return;
    }
    
    isInitializing.current = true;
    setIsLoading(true);
    
    try {
      console.log("AuthProvider: Initializing auth state");
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("AuthProvider: Session retrieval error:", error);
        setAuthError(error);
        setUser(null);
        setSession(null);
        setIsEmailVerified(false);
        setUserType('');
      } else {
        const currentSession = data.session;
        const currentUser = currentSession?.user || null;
        
        console.log("AuthProvider: Session retrieved", { 
          hasSession: !!currentSession, 
          hasUser: !!currentUser,
          emailVerified: currentUser?.email_confirmed_at ? true : false
        });
        
        setSession(currentSession);
        setUser(currentUser);
        setIsEmailVerified(currentUser?.email_confirmed_at ? true : false);
        
        if (currentUser) {
          // Update localStorage with session data
          authService.updateLocalStorage(currentUser);
          const storedUserType = currentUser.user_metadata?.user_type || localStorage.getItem('user_type') || 'individual';
          setUserType(storedUserType);
        } else {
          setUserType('');
        }
        
        setAuthError(null);
      }
    } catch (error) {
      console.error("AuthProvider: Initialization error:", error);
      setAuthError(error as Error);
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      setUserType('');
    } finally {
      setIsLoading(false);
      setAuthStable(true);
      initializationComplete.current = true;
      isInitializing.current = false;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AuthProvider: Auth state changed", { event, hasSession: !!session });
        
        const currentUser = session?.user || null;
        
        setSession(session);
        setUser(currentUser);
        setIsEmailVerified(currentUser?.email_confirmed_at ? true : false);
        
        if (currentUser) {
          // Update localStorage and user type
          authService.updateLocalStorage(currentUser);
          const storedUserType = currentUser.user_metadata?.user_type || localStorage.getItem('user_type') || 'individual';
          setUserType(storedUserType);
        } else {
          // Clear auth data when no user
          authService.updateLocalStorage(null);
          setUserType('');
        }
        
        // Mark as stable after auth state change
        if (!authStable) {
          setAuthStable(true);
        }
        
        setAuthError(null);
      }
    );
    
    // Initialize auth after setting up listener
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth, authStable]);

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const result = await authService.signIn(email, password);
      
      if (result.error) {
        setAuthError(result.error);
      }
      
      return result;
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      return { error: authError, data: null };
    }
  }, []);

  const signUp = useCallback(async (formData: any) => {
    try {
      setAuthError(null);
      return await authService.signUp(formData.email, formData.password, {
        data: formData.data,
        emailRedirectTo: formData.emailRedirectTo
      });
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      const { error } = await authService.signOut();
      
      if (error) {
        setAuthError(error);
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      setUserType('');
      
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      throw error;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      setAuthError(null);
      const result = await authService.refreshSession();
      
      if (result.error) {
        setAuthError(result.error);
      } else {
        setSession(result.session);
        setUser(result.user);
        setIsEmailVerified(result.isEmailVerified);
        
        if (result.user) {
          const storedUserType = result.user.user_metadata?.user_type || localStorage.getItem('user_type') || 'individual';
          setUserType(storedUserType);
        }
      }
      
      return { isEmailVerified: result.isEmailVerified };
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      return { isEmailVerified: false };
    }
  }, []);

  const recoverAuthState = useCallback(async () => {
    try {
      setAuthError(null);
      return await authService.recoverFromStuckState({ autoRecovery: true });
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      return false;
    }
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser(data);
      
      if (error) throw error;
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      throw error;
    }
  }, []);

  const contextValue: AuthContextType = {
    // State
    user,
    session,
    isLoading,
    isEmailVerified,
    authStable,
    authError,
    isAuthenticated: !!user && !!session,
    isVerificationEmailSent,
    userType,
    
    // Actions
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
