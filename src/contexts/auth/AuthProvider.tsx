
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/AuthService';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { useAuthRecovery } from '@/hooks/useAuthRecovery';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { handlePotentialStuckStateJsx } from '@/utils/session/recovery.tsx';
import { debouncedToast } from '@/utils/debouncedToast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  authStable: boolean;
  authError: Error | null;
  userType: 'individual' | 'establishment' | 'promoter' | 'admin' | null;
  navigationReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (formData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authStable, setAuthStable] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin' | null>(null);
  const [navigationReady, setNavigationReady] = useState(false);
  
  const { goToHomePage, goToLandingPage, goToLoginPage } = useAppNavigation();
  const { recoverAuthState: advancedRecovery, quickRecovery, isRecovering } = useAuthRecovery({
    showToasts: false // We'll handle toasts in this component
  });
  
  // Recovery state tracking
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const [lastRecoveryAttempt, setLastRecoveryAttempt] = useState<number>(0);
  const maxRecoveryAttempts = 3;
  const recoveryTimeout = 30000; // 30 seconds
  
  // Refs for cleanup
  const stuckStateHandler = useRef<{ cancel: () => void } | null>(null);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Progressive recovery function
  const progressiveRecovery = useCallback(async (): Promise<boolean> => {
    const now = Date.now();
    
    // Prevent rapid recovery attempts
    if (now - lastRecoveryAttempt < 5000) {
      console.log('Recovery attempt too soon, skipping');
      return false;
    }
    
    // Check max attempts
    if (recoveryAttempts >= maxRecoveryAttempts) {
      console.log('Max recovery attempts reached');
      setAuthError(new Error('Maximum recovery attempts reached. Please refresh the page.'));
      return false;
    }
    
    setLastRecoveryAttempt(now);
    setRecoveryAttempts(prev => prev + 1);
    
    try {
      console.log(`Starting recovery attempt ${recoveryAttempts + 1}/${maxRecoveryAttempts}`);
      
      // Step 1: Quick recovery (session refresh)
      if (recoveryAttempts === 0) {
        console.log('Attempting quick recovery (session refresh)');
        const quickSuccess = await quickRecovery();
        if (quickSuccess) {
          console.log('Quick recovery successful');
          setRecoveryAttempts(0);
          return true;
        }
      }
      
      // Step 2: Advanced recovery (cache + session)
      if (recoveryAttempts <= 1) {
        console.log('Attempting advanced recovery');
        const recoveryResult = await advancedRecovery();
        if (recoveryResult) {
          console.log('Advanced recovery successful');
          const { session: recoveredSession, user: recoveredUser, userType: recoveredUserType } = recoveryResult;
          
          setSession(recoveredSession);
          setUser(recoveredUser);
          setUserType(recoveredUserType);
          setIsEmailVerified(!!recoveredUser?.email_confirmed_at);
          setAuthError(null);
          setRecoveryAttempts(0);
          
          debouncedToast.success('Session Recovered', 'Your authentication has been restored.', 3000);
          return true;
        }
      }
      
      // Step 3: Full cleanup and redirect
      if (recoveryAttempts >= 2) {
        console.log('Performing full cleanup and redirect');
        await cleanupFailedAuthState();
        
        debouncedToast.info(
          'Session Reset', 
          'Your session has been reset. Please sign in again.', 
          5000
        );
        
        // Reset recovery attempts after cleanup
        setRecoveryAttempts(0);
        return true; // Consider successful as we've cleaned up
      }
      
      return false;
    } catch (error) {
      console.error('Recovery attempt failed:', error);
      setAuthError(error as Error);
      return false;
    }
  }, [recoveryAttempts, lastRecoveryAttempt, quickRecovery, advancedRecovery]);

  // Cleanup failed auth states
  const cleanupFailedAuthState = useCallback(async () => {
    try {
      // Clear all session data
      sessionPersistenceService.clearSession();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Reset all state
      setUser(null);
      setSession(null);
      setUserType(null);
      setIsEmailVerified(false);
      setAuthError(null);
      setIsLoading(false);
      setAuthStable(true);
      setNavigationReady(true);
      
      // Navigate to landing page
      goToLandingPage();
      
    } catch (error) {
      console.error('Cleanup failed:', error);
      // Even if cleanup fails, force a page reload as last resort
      window.location.href = '/landing';
    }
  }, [goToLandingPage]);

  // Setup stuck state detection with timeout
  const setupStuckStateDetection = useCallback(() => {
    // Cancel any existing detection
    if (stuckStateHandler.current) {
      stuckStateHandler.current.cancel();
    }
    
    if (recoveryTimeoutRef.current) {
      clearTimeout(recoveryTimeoutRef.current);
    }
    
    // Set up new detection
    stuckStateHandler.current = handlePotentialStuckStateJsx(8000, false);
    
    // Set up recovery timeout
    recoveryTimeoutRef.current = setTimeout(() => {
      if (isLoading && !authStable) {
        console.log('Auth loading timeout reached, triggering recovery');
        progressiveRecovery();
      }
    }, recoveryTimeout);
    
  }, [isLoading, authStable, progressiveRecovery]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setAuthStable(false);
        
        // Set up stuck state detection
        setupStuckStateDetection();
        
        // Initialize session from persistence service
        const { session: initialSession, user: initialUser } = await sessionPersistenceService.initializeSession();
        
        if (mounted) {
          if (initialSession && initialUser) {
            setSession(initialSession);
            setUser(initialUser);
            setIsEmailVerified(!!initialUser.email_confirmed_at);
            
            // Determine user type
            const userTypeFromMetadata = initialUser.user_metadata?.user_type;
            if (userTypeFromMetadata) {
              setUserType(userTypeFromMetadata);
            }
          }
          
          setAuthStable(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (mounted) {
          setAuthError(error as Error);
          setIsLoading(false);
          setAuthStable(true);
          
          // Trigger recovery on initialization failure
          setTimeout(() => progressiveRecovery(), 1000);
        }
      }
    };
    
    initializeAuth();
    
    return () => {
      mounted = false;
      if (stuckStateHandler.current) {
        stuckStateHandler.current.cancel();
      }
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
      }
    };
  }, [setupStuckStateDetection, progressiveRecovery]);

  // Auth state change handler
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      try {
        if (event === 'SIGNED_IN' && session) {
          setSession(session);
          setUser(session.user);
          setIsEmailVerified(!!session.user.email_confirmed_at);
          
          const userTypeFromMetadata = session.user.user_metadata?.user_type;
          if (userTypeFromMetadata) {
            setUserType(userTypeFromMetadata);
          }
          
          sessionPersistenceService.updateSession(session, session.user);
          setAuthError(null);
          setRecoveryAttempts(0); // Reset recovery attempts on successful sign in
          
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setUserType(null);
          setIsEmailVerified(false);
          sessionPersistenceService.clearSession();
          setRecoveryAttempts(0); // Reset recovery attempts on sign out
        }
        
        setIsLoading(false);
        setAuthStable(true);
        
      } catch (error) {
        console.error('Auth state change error:', error);
        setAuthError(error as Error);
        setTimeout(() => progressiveRecovery(), 1000);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [progressiveRecovery]);

  // Navigation readiness effect
  useEffect(() => {
    if (authStable && !isLoading) {
      setNavigationReady(true);
      
      // Cancel stuck state detection once navigation is ready
      if (stuckStateHandler.current) {
        stuckStateHandler.current.cancel();
        stuckStateHandler.current = null;
      }
      
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
        recoveryTimeoutRef.current = null;
      }
      
      // Handle navigation based on auth state
      if (user && userType) {
        const currentPath = window.location.pathname;
        const authPages = ['/login', '/signup', '/landing'];
        
        if (authPages.includes(currentPath)) {
          const savedRedirect = localStorage.getItem('auth_redirect');
          goToHomePage(userType);
          if (savedRedirect) {
            localStorage.removeItem('auth_redirect');
          }
        }
      }
    }
  }, [authStable, isLoading, user, userType, goToHomePage]);

  // Auth methods
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const result = await authService.signIn(email, password);
      
      if (result.error) {
        setAuthError(result.error);
        return { error: result.error, data: null };
      }
      
      return { error: null, data: result };
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      return { error: authError, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (formData: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const result = await authService.signUp(formData.email, formData.password, {
        data: formData.data,
        emailRedirectTo: formData.emailRedirectTo
      });
      
      if (result.error) {
        setAuthError(result.error);
        return { error: result.error, data: null };
      }
      
      return { error: null, data: result };
    } catch (error) {
      const authError = error as Error;
      setAuthError(authError);
      return { error: authError, data: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      
      // Clean up recovery state
      setRecoveryAttempts(0);
      setAuthError(null);
      
      goToLandingPage();
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [goToLandingPage]);

  const refreshSession = useCallback(async () => {
    try {
      const result = await authService.refreshSession();
      if (result.session && result.user) {
        setSession(result.session);
        setUser(result.user);
        setIsEmailVerified(result.isEmailVerified);
      }
      return { isEmailVerified: result.isEmailVerified };
    } catch (error) {
      console.error('Session refresh error:', error);
      setAuthError(error as Error);
      return { isEmailVerified: false };
    }
  }, []);

  // Expose recovery method for manual triggers
  const recoverAuthState = useCallback(async (): Promise<boolean> => {
    return await progressiveRecovery();
  }, [progressiveRecovery]);

  // Placeholder methods for future implementation
  const sendVerificationEmail = useCallback(async (email: string) => {
    // TODO: Implement verification email sending
    console.log('Sending verification email to:', email);
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    // TODO: Implement profile update
    console.log('Updating user profile:', data);
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    // TODO: Implement password update
    console.log('Updating password');
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    isEmailVerified,
    authStable,
    authError,
    userType,
    navigationReady,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
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
