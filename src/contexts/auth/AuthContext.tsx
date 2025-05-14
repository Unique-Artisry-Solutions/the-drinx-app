
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthUser } from './types';
import { useToast } from '@/hooks/use-toast';
import { checkAdminBypassStatus } from '@/utils/adminBypass';

// Initial context state
const initialState: AuthContextType = {
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isEmailVerified: false,
  isVerificationEmailSent: false,
  authError: null,
  authStable: false,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => null,
  signOut: async () => {},
  refreshSession: async () => ({ isEmailVerified: false }),
  recoverAuthState: async () => false,
  sendVerificationEmail: async () => {},
  updateUserProfile: async () => {},
  updatePassword: async () => {}
};

// Create the auth context
const AuthContext = createContext<AuthContextType>(initialState);

// The AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management for auth
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // Check for admin bypass first
    const { isEnabled, userType } = checkAdminBypassStatus();
    if (isEnabled) {
      console.log("AuthProvider: Admin bypass active", { userType });
      setAuthStable(true);
      setIsLoading(false);
      return;
    }
    
    // Set up auth state listener FIRST (important for Supabase auth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("AuthProvider: Auth state changed", { event });
      setSession(newSession);
      setUser(newSession?.user as AuthUser || null);
      
      // Update email verification status
      if (newSession?.user) {
        setIsEmailVerified(!!newSession.user.email_confirmed_at);
      }
      
      // Update localStorage based on session state
      if (newSession?.user) {
        localStorage.setItem('user_authenticated', 'true');
        if (newSession.user.email) {
          localStorage.setItem('user_email', newSession.user.email);
        }
        if (newSession.user.user_metadata?.user_type) {
          localStorage.setItem('user_type', newSession.user.user_metadata.user_type);
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear user data on sign out
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
      }
    });
    
    // THEN check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      console.log("AuthProvider: Initial session check", { 
        hasSession: !!initialSession,
        error: error?.message
      });
      
      if (error) {
        console.error("Error getting initial session:", error);
      }
      
      setSession(initialSession);
      setUser(initialSession?.user as AuthUser || null);
      
      if (initialSession?.user) {
        setIsEmailVerified(!!initialSession.user.email_confirmed_at);
        
        // Ensure localStorage is in sync with session
        localStorage.setItem('user_authenticated', 'true');
        if (initialSession.user.email) {
          localStorage.setItem('user_email', initialSession.user.email);
        }
        if (initialSession.user.user_metadata?.user_type) {
          localStorage.setItem('user_type', initialSession.user.user_metadata.user_type);
        }
      }
      
      setIsLoading(false);
      setAuthStable(true);
    });
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth Actions
  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    setIsLoading(true);
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { error: null, data };
    } catch (error: any) {
      setAuthError(error);
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (formData: any) => {
    setAuthError(null);
    setIsLoading(true);
    
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
      
      setIsVerificationEmailSent(true);
      return data;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Clear all localStorage auth data
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_username');
      localStorage.removeItem('auth_redirect');
      
      // Reset state
      setSession(null);
      setUser(null);
      setIsEmailVerified(false);
      setAuthError(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user as AuthUser || null);
      const isVerified = data.session?.user ? !!data.session.user.email_confirmed_at : false;
      setIsEmailVerified(isVerified);
      
      return { isEmailVerified: isVerified };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { isEmailVerified: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified session recovery
  const recoverAuthState = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Attempt to refresh session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        // If refresh fails, attempt sign out to clear state
        await supabase.auth.signOut();
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
        localStorage.removeItem('spiritless-auth-storage');
        
        toast({
          title: "Session recovery failed",
          description: "Your session could not be recovered. Please sign in again.",
          variant: "destructive"
        });
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Auth state recovery failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
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
  };

  const updateUserProfile = async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });
      
      if (error) throw error;
      
      // Update local user state with new metadata
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            ...data
          }
        });
      }
    } catch (error: any) {
      setAuthError(error);
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
      setAuthError(error);
      throw error;
    }
  };

  // Assemble context value
  const value: AuthContextType = {
    session,
    user,
    isAuthenticated: !!user && !!session,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
