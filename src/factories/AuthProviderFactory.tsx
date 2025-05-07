
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/AuthService';
import { toast } from '@/hooks/use-toast';
import { checkAdminBypassStatus, createBypassUser } from '@/utils/adminBypass';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  authStable: boolean;
  authError: Error | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<boolean>;
}

export interface AuthContextType extends AuthState, AuthActions {}

const defaultState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isEmailVerified: false,
  authStable: false,
  authError: null,
};

/**
 * Creates an auth context and provider
 */
export function createAuthProvider(initialState: Partial<AuthState> = {}) {
  // Create the context with merged default and initial state
  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  // Create the provider component
  const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State
    const [user, setUser] = useState<User | null>(initialState.user ?? defaultState.user);
    const [session, setSession] = useState<Session | null>(initialState.session ?? defaultState.session);
    const [isLoading, setIsLoading] = useState(initialState.isLoading ?? defaultState.isLoading);
    const [isEmailVerified, setIsEmailVerified] = useState(initialState.isEmailVerified ?? defaultState.isEmailVerified);
    const [authStable, setAuthStable] = useState(initialState.authStable ?? defaultState.authStable);
    const [authError, setAuthError] = useState<Error | null>(initialState.authError ?? defaultState.authError);
    
    // Setup auth state monitoring
    useEffect(() => {
      console.log('Setting up AuthProvider...');
      
      // Check for admin bypass first
      const { isEnabled: isAdminBypass, bypassUser } = checkForAdminBypass();
      
      if (isAdminBypass && bypassUser) {
        console.log('Admin bypass active, using bypass user');
        setUser(bypassUser);
        setIsEmailVerified(true);
        setIsLoading(false);
        setAuthStable(true);
        return;
      }
      
      // Set up auth state listener FIRST
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, !!session);
          
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            setIsEmailVerified(false);
            authService.updateLocalStorage(null);
            
            toast({
              title: "Logged out",
              description: "You have been successfully signed out",
            });
          } else if (session) {
            setUser(session.user);
            setSession(session);
            setIsEmailVerified(!!session.user.email_confirmed_at);
            authService.updateLocalStorage(session.user);
          }
        }
      );
      
      // THEN check for existing session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        console.log('Initial session check result:', !!session);
        
        if (error) {
          console.error('Error retrieving session:', error);
          setAuthError(error);
        }
        
        if (session) {
          setUser(session.user);
          setSession(session);
          setIsEmailVerified(true);
          authService.updateLocalStorage(session.user);
        }
        
        setIsLoading(false);
        
        // Validate session state for consistency
        authService.validateSession().then(result => {
          if (!result.isValid) {
            console.warn('Session validation failed:', result);
            if (result.hasMismatch) {
              // Try to fix the mismatch
              console.log('Attempting to fix session state mismatch');
              authService.syncSessionState().catch(console.error);
            }
          }
          
          setAuthStable(true);
        });
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);
    
    // Check for admin bypass
    const checkForAdminBypass = () => {
      const { isEnabled, userType } = checkAdminBypassStatus();
      
      if (isEnabled) {
        const bypassUser = createBypassUser();
        return { isEnabled: true, bypassUser };
      }
      
      return { isEnabled: false };
    };
    
    // Sign in
    const signIn = async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const { error, user: authUser, session: authSession } = await authService.signIn(email, password);
        
        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
          return { error, data: null };
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        setUser(authUser);
        setSession(authSession);
        setIsEmailVerified(true);
        
        return { error: null, data: { user: authUser, session: authSession } };
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      } finally {
        setIsLoading(false);
      }
    };
    
    // Sign up
    const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
      setIsLoading(true);
      try {
        const { error, user: authUser, session: authSession } = await authService.signUp(
          email, 
          password, 
          { 
            data: metadata,
            emailRedirectTo: `${window.location.origin}/verify-email`
          }
        );
        
        if (error) {
          toast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive",
          });
          return { error, data: null };
        }
        
        if (!authUser?.email_confirmed_at) {
          toast({
            title: "Verification email sent",
            description: "Please check your email inbox and verify your account",
          });
        }
        
        // Don't set user/session for new users that need to verify email
        // They'll be redirected to the verification page
        
        return { error: null, data: { user: authUser, session: authSession } };
      } catch (error: any) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      } finally {
        setIsLoading(false);
      }
    };
    
    // Sign out
    const signOut = async () => {
      setIsLoading(true);
      try {
        const { error } = await authService.signOut();
        
        if (error) {
          toast({
            title: "Logout failed",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        setUser(null);
        setSession(null);
        setIsEmailVerified(false);
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
        
        // Use window.location for hard redirect to clear React Router state
        window.location.href = '/landing';
      } catch (error) {
        console.error('Error during sign out:', error);
        
        // Force redirect even on error
        window.location.href = '/landing';
      } finally {
        setIsLoading(false);
      }
    };
    
    // Refresh session
    const refreshSession = async () => {
      setIsLoading(true);
      try {
        const { session: refreshedSession, user: refreshedUser, isEmailVerified: emailVerified, error } = 
          await authService.refreshSession();
        
        if (error) {
          console.error('Error refreshing session:', error);
          setAuthError(error);
          return { isEmailVerified: false };
        }
        
        setUser(refreshedUser);
        setSession(refreshedSession);
        setIsEmailVerified(emailVerified);
        
        return { isEmailVerified: emailVerified };
      } catch (error) {
        console.error('Error in refreshSession:', error);
        return { isEmailVerified: false };
      } finally {
        setIsLoading(false);
      }
    };
    
    // Recover from stuck auth state
    const recoverAuthState = async () => {
      setIsLoading(true);
      try {
        const recovered = await authService.recoverFromStuckState({
          autoRecovery: true,
          silent: false
        });
        
        // Note: On success, this will redirect the page, so we won't reach this point
        return recovered;
      } catch (error) {
        console.error('Recovery error:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    };
    
    // Context value
    const contextValue: AuthContextType = {
      user,
      session,
      isLoading,
      isEmailVerified,
      authStable,
      authError,
      signIn,
      signUp,
      signOut,
      refreshSession,
      recoverAuthState
    };
    
    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // Create the hook for using this context
  const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
  
  return {
    AuthProvider,
    useAuth,
    AuthContext
  };
}

// Create and export the default auth provider
const { AuthProvider, useAuth, AuthContext } = createAuthProvider();
export { AuthProvider, useAuth, AuthContext };
