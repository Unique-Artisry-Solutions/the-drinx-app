
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/auth/AuthTypes';
import { checkAdminBypassStatus, createBypassUser } from '@/utils/adminBypass';
import { isPreviewEnvironment } from '@/utils/environment';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  
  const { toast } = useToast();
  
  // Refs to prevent duplicate setup and track state
  const setupCompleteRef = useRef(false);
  const authListenerRef = useRef<any>(null);
  const previousUserRef = useRef<User | null>(null);
  const previousSessionRef = useRef<Session | null>(null);

  // Check for admin bypass
  const checkAdminBypass = useCallback(() => {
    const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
    
    if (isAdminBypass) {
      const bypassUser = createBypassUser();
      if (bypassUser) {
        console.log("Creating bypass user:", bypassUser.id);
        setUser(bypassUser);
        setIsEmailVerified(true);
        setIsLoading(false);
        setAuthStable(true);
        updateLocalStorage(bypassUser);
        return { isAdminBypass: true, bypassUser };
      }
    }
    
    return { isAdminBypass: false };
  }, []);

  // Update localStorage based on session data
  const updateLocalStorage = useCallback((sessionUser: User | null) => {
    if (previousUserRef.current === sessionUser) {
      return;
    }
    
    console.log("Updating localStorage from session user:", sessionUser);
    previousUserRef.current = sessionUser;
    
    if (sessionUser) {
      localStorage.setItem('user_authenticated', 'true');
      if (sessionUser.email) {
        localStorage.setItem('user_email', sessionUser.email);
      }
      if (sessionUser.user_metadata?.user_type) {
        localStorage.setItem('user_type', sessionUser.user_metadata.user_type);
      }
      if (sessionUser.user_metadata?.username) {
        localStorage.setItem('user_username', sessionUser.user_metadata.username);
      }
    } else {
      if (localStorage.getItem('user_authenticated')) {
        console.log("Clearing user authentication data from localStorage");
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_username');
      }
    }
  }, []);

  // Check if admin session is expired
  const checkAdminSession = useCallback(() => {
    const adminSessionCreated = localStorage.getItem('admin_session_created');
    const SESSION_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
    
    if (adminSessionCreated) {
      const sessionTime = new Date(adminSessionCreated).getTime();
      const currentTime = new Date().getTime();
      
      if (currentTime - sessionTime > SESSION_EXPIRY_TIME) {
        console.log("Admin session expired, logging out");
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_session_created');
        
        toast({
          title: "Session Expired",
          description: "Your admin session has expired. Please log in again.",
          variant: "destructive"
        });
        
        return true;
      }
    }
    
    return false;
  }, [toast]);

  // Stable setters that only update when values actually change
  const setUserStable = useCallback((newUser: User | null) => {
    if (previousUserRef.current !== newUser) {
      console.log('Auth state: User changed from', !!previousUserRef.current, 'to', !!newUser);
      previousUserRef.current = newUser;
      setUser(newUser);
      
      if (!authStable) {
        setAuthStable(true);
      }
    }
  }, [authStable]);

  const setSessionStable = useCallback((newSession: Session | null) => {
    if (previousSessionRef.current !== newSession) {
      console.log('Auth state: Session changed from', !!previousSessionRef.current, 'to', !!newSession);
      previousSessionRef.current = newSession;
      setSession(newSession);
    }
  }, []);

  // Auth setup effect
  useEffect(() => {
    if (setupCompleteRef.current) {
      console.log('Auth setup already completed, skipping...');
      return;
    }
    
    console.log('Starting unified AuthProvider setup...');
    setupCompleteRef.current = true;
    
    setIsLoading(true);
    setAuthStable(false);
    
    // Skip full auth setup in preview environment
    if (isPreviewEnvironment()) {
      console.log('Preview environment detected: using simplified auth setup');
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      setIsLoading(false);
      setAuthStable(true);
      return;
    }
    
    // First check for admin bypass
    const { isAdminBypass, bypassUser } = checkAdminBypass();
    
    if (isAdminBypass && bypassUser) {
      console.log('Admin bypass active, using bypass user:', bypassUser.id);
      return;
    }
    
    // Check if admin session has expired
    if (checkAdminSession()) {
      console.log('Admin session expired');
      setIsLoading(false);
      setAuthStable(true);
      return;
    }
    
    console.log('Setting up auth state listener...');
    
    // Clean up existing listener
    if (authListenerRef.current) {
      authListenerRef.current.subscription.unsubscribe();
    }
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        // Update auth state with debouncing
        setTimeout(() => {
          setSessionStable(session);
          setUserStable(session?.user ?? null);
          
          if (session?.user) {
            setIsEmailVerified(true);
            updateLocalStorage(session.user);
          } else if (event === 'SIGNED_OUT') {
            setIsEmailVerified(false);
            updateLocalStorage(null);
          }
          
          setAuthStable(true);
        }, 0);
      }
    );
    
    authListenerRef.current = authListener;
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check result:', !!session);
      
      if (session) {
        setSessionStable(session);
        setUserStable(session.user);
        setIsEmailVerified(true);  
        updateLocalStorage(session.user);
      }
      
      setIsLoading(false);
      setAuthStable(true);
    });
    
    return () => {
      if (authListenerRef.current) {
        authListenerRef.current.subscription.unsubscribe();
        authListenerRef.current = null;
      }
      setupCompleteRef.current = false;
    };
  }, [checkAdminBypass, checkAdminSession, setUserStable, setSessionStable, updateLocalStorage]);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { error: null, data };
    } catch (error) {
      const authError = error as AuthError;
      setAuthError(authError);
      return { error: authError, data: null };
    }
  }, []);

  // Sign up function
  const signUp = useCallback(async (formData: any) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp(formData);
      
      if (error) throw error;
      
      if (data.user && !data.user.email_confirmed_at) {
        setIsVerificationEmailSent(true);
      }
      
      return { data, error: null };
    } catch (error) {
      const authError = error as AuthError;
      setAuthError(authError);
      throw authError;
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      await supabase.auth.signOut();
      
      // Clear admin bypass if active
      localStorage.removeItem('admin_bypass');
      localStorage.removeItem('bypass_user_id');
      
      // Clear admin session
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_session_created');
      
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      updateLocalStorage(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthError(error as AuthError);
    }
  }, [updateLocalStorage]);

  // Refresh session function
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (data.session) {
        setSessionStable(data.session);
        setUserStable(data.session.user);
        setIsEmailVerified(true);
        updateLocalStorage(data.session.user);
        return { isEmailVerified: true };
      }
      
      return { isEmailVerified: false };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { isEmailVerified: false };
    }
  }, [setSessionStable, setUserStable, updateLocalStorage]);

  // Recover auth state function
  const recoverAuthState = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session) {
        setSessionStable(data.session);
        setUserStable(data.session.user);
        setIsEmailVerified(true);
        updateLocalStorage(data.session.user);
        setAuthStable(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error recovering auth state:', error);
      return false;
    }
  }, [setSessionStable, setUserStable, updateLocalStorage]);

  // Send verification email
  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser(data);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isEmailVerified,
    authStable,
    authError,
    isAuthenticated: !!user,
    isVerificationEmailSent,
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
