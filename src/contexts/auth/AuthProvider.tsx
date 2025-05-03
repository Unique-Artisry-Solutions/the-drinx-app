
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, getSessionDebug, trackAuthStateChange } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { checkAdminBypassStatus, createBypassUser } from '@/utils/adminBypass';
import { AuthContextType } from './types';
import { clearAllSessions } from '@/utils/sessionCleaner';

// Create a new utility function for stable session handling
const AUTH_INTENT_KEY = 'auth_intent';
const AUTH_INTENT_TIMEOUT_MS = 10000; // 10 seconds

const setAuthIntent = () => {
  localStorage.setItem(AUTH_INTENT_KEY, Date.now().toString());
  console.log("Auth intent set");
};

const clearAuthIntent = () => {
  localStorage.removeItem(AUTH_INTENT_KEY);
  console.log("Auth intent cleared");
};

const checkAuthIntent = (): boolean => {
  const intentTimestamp = localStorage.getItem(AUTH_INTENT_KEY);
  if (!intentTimestamp) return false;
  
  // Check if intent is still valid (not expired)
  const timestamp = parseInt(intentTimestamp, 10);
  const isValid = Date.now() - timestamp < AUTH_INTENT_TIMEOUT_MS;
  
  if (!isValid) {
    clearAuthIntent();
  }
  
  return isValid;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const { toast } = useToast();

  // Explicitly handle localStorage session restoration
  const restoreSession = () => {
    const storedSession = localStorage.getItem('spiritless-auth-storage');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        console.log("Found stored session data:", !!parsedSession);
        return true;
      } catch (e) {
        console.error("Error parsing stored session", e);
      }
    }
    return false;
  };

  // Setup stable authentication state
  useEffect(() => {
    console.log('AuthProvider initialized');
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    const isAuthIntent = checkAuthIntent();
    console.log("Auth intent active:", isAuthIntent);
    
    // Initialize authentication state
    const initializeAuth = async () => {
      // Check for admin bypass first as it overrides everything else
      const { isEnabled } = checkAdminBypassStatus();
      if (isEnabled) {
        console.log('Admin bypass active in AuthProvider, creating bypass user');
        const bypassUser = createBypassUser();
        setUser(bypassUser);
        setIsEmailVerified(true);
        setIsLoading(false);
        setAuthStable(true);
        return;
      }
      
      // Debug existing session in local storage
      const hasStoredSession = restoreSession();
      console.log("Has stored session data:", hasStoredSession);
      
      // Set up auth state listener FIRST before any async calls
      console.log('Setting up auth state listener');
      const { data } = trackAuthStateChange();
      authSubscription = data.subscription;
      
      // Set up detailed auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth state changed:', event, !!newSession);
          
          if (!isMounted) return;
          
          // Use direct state updates for sync operations
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user);
            setIsEmailVerified(!!newSession.user?.email_confirmed_at);
            
            // Store essential user info in localStorage
            if (newSession.user) {
              localStorage.setItem('user_authenticated', 'true');
              localStorage.setItem('user_email', newSession.user.email || '');
              
              // Store user type in localStorage
              if (newSession.user.user_metadata?.user_type) {
                localStorage.setItem('user_type', newSession.user.user_metadata.user_type);
              }
            }
            
            // Clear auth intent as we now have a session
            if (event === 'SIGNED_IN') {
              clearAuthIntent();
              
              // Small delay to ensure UI updates properly
              setTimeout(() => {
                setAuthStable(true);
              }, 300);
            }
          } else if (event === 'SIGNED_OUT') {
            setIsEmailVerified(false);
            setSession(null);
            setUser(null);
            
            // Clear user data from localStorage on sign out
            clearAllSessions();
            setAuthStable(true);
          }
        }
      );
      
      // THEN check for existing session - this is crucial for initial load
      console.log('Checking for existing session');
      const { session: existingSession, error } = await getSessionDebug();
      
      if (error) {
        console.error('Error checking session:', error);
        if (isMounted) {
          setIsLoading(false);
          setAuthStable(true);
        }
        return;
      }
      
      if (existingSession) {
        console.log('Session found, updating user state');
        if (isMounted) {
          setSession(existingSession);
          setUser(existingSession.user);
          setIsEmailVerified(!!existingSession.user.email_confirmed_at);
          
          // Store user info in localStorage
          if (existingSession.user.user_metadata?.user_type) {
            localStorage.setItem('user_type', existingSession.user.user_metadata.user_type);
          }
          localStorage.setItem('user_authenticated', 'true');
          localStorage.setItem('user_email', existingSession.user.email || '');
          
          // Intent is complete as we have a session
          clearAuthIntent();
        }
      }
      
      // We've completed initial auth check, so exit loading state
      if (isMounted) {
        setIsLoading(false);
        
        // Mark auth as stable in a small delay to handle any pending state updates
        setTimeout(() => {
          if (isMounted) {
            setAuthStable(true);
          }
        }, 100);
      }
    };
    
    // Handle admin bypass changes
    const handleBypassChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;
      
      console.log('Admin bypass changed in AuthProvider:', detail);
      
      if (!isMounted) return;
      
      if (detail.enabled) {
        const bypassUser = createBypassUser();
        setUser(bypassUser);
        setIsEmailVerified(true);
        setAuthStable(true);
      } else {
        // Only clear user if we were in bypass mode
        if (checkAdminBypassStatus().isEnabled) {
          setUser(null);
          setSession(null);
          setIsEmailVerified(false);
          clearAllSessions();
          setAuthStable(true);
        }
      }
    };
    
    const handleAuthReset = () => {
      if (!isMounted) return;
      setUser(null);
      setSession(null);
      setIsEmailVerified(false);
      clearAllSessions();
      setAuthStable(true);
    };
    
    // Listen for relevant events
    window.addEventListener('adminBypassChanged', handleBypassChange);
    window.addEventListener('authReset', handleAuthReset);
    
    // Start initialization
    initializeAuth();

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      window.removeEventListener('adminBypassChanged', handleBypassChange);
      window.removeEventListener('authReset', handleAuthReset);
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Setting auth intent before login');
      setAuthIntent(); // Set auth intent before login attempt
      
      console.log('Attempting to sign in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        clearAuthIntent();
        throw error;
      }
      
      // This check is important but must be handled carefully to not interrupt the flow
      if (data.user && !data.user.email_confirmed_at) {
        clearAuthIntent();
        console.log('Email not verified:', email);
        throw new Error('Email not verified. Please check your inbox.');
      }
      
      console.log('Login successful:', data);
      
      // Store user info in localStorage - doing this explicitly helps with race conditions
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', data.user.email || '');
      
      if (data.user.user_metadata?.user_type) {
        localStorage.setItem('user_type', data.user.user_metadata.user_type);
      }
      
      // Manually update the state
      setUser(data.user);
      setSession(data.session);
      setIsEmailVerified(!!data.user.email_confirmed_at);
      
      // Add a small delay to ensure the session is properly stored
      await new Promise(resolve => setTimeout(resolve, 200));
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, options?: {
    data?: { [key: string]: any },
    emailRedirectTo?: string
  }) => {
    try {
      console.log('Attempting to sign up:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data || {},
          emailRedirectTo: options?.emailRedirectTo || `${window.location.origin}/?email_confirmed=true`
        }
      });

      if (error) {
        throw error;
      }

      console.log('Signup successful:', data);
      toast({
        title: 'Signup successful',
        description: 'Please check your email to verify your account.',
      });
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProfile = async (data: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.updateUser({ data });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'An error occurred while updating your profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your inbox for password reset instructions',
      });
    } catch (error: any) {
      toast({
        title: 'Reset failed',
        description: error.message || 'An error occurred during password reset',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      
      // If we're in admin bypass mode, just clear the localStorage
      if (checkAdminBypassStatus().isEnabled) {
        clearAllSessions();
        
        // Trigger event to update state
        window.dispatchEvent(new CustomEvent('adminBypassChanged', { 
          detail: { enabled: false }
        }));
        
        toast({
          title: 'Signed out',
          description: 'You have been successfully logged out',
        });
        
        return;
      }
      
      // Regular sign out
      await supabase.auth.signOut({ scope: 'global' });
      clearAllSessions();
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully logged out',
      });
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const refreshSession = async (): Promise<{ isEmailVerified: boolean }> => {
    try {
      console.log('Refreshing session');
      
      // Skip refresh for admin bypass
      if (checkAdminBypassStatus().isEnabled) {
        console.log('Admin bypass active, skipping session refresh');
        return { isEmailVerified: true };
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return { isEmailVerified: false };
      }
      
      console.log('Session refresh result:', !!data.session);
      
      // Update session and user state with fresh data
      setSession(data.session);
      setUser(data.session?.user || null);
      
      const newEmailVerifiedStatus = !!data.session?.user?.email_confirmed_at;
      
      if (data.session?.user) {
        setIsEmailVerified(newEmailVerifiedStatus);
        // Update localStorage with fresh user data
        if (data.session.user.user_metadata?.user_type) {
          localStorage.setItem('user_type', data.session.user.user_metadata.user_type);
        }
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user_email', data.session.user.email || '');
      }
      
      return { isEmailVerified: newEmailVerifiedStatus };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { isEmailVerified: false };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isEmailVerified,
    authStable,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
    resetPassword,
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
