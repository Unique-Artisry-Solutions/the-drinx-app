import React, { createContext, useContext, useEffect, useState, useCallback, useRef, startTransition } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { AuthState, AuthActions, AuthContextType } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { serviceRegistryImpl, type IAuthService } from '@/services/ServiceRegistryImpl';
import { authCache } from './authCache';
import { debouncedToast } from '@/utils/debouncedToast';
import { inferUserType } from '@/utils/auth/admin';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [navigationReady, setNavigationReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authStateStable, setAuthStateStable] = useState(false);
  
  const initializationRef = useRef(false);
  const [authService, setAuthService] = useState<IAuthService | null>(null);

  // Initialize services and auth state
  const initializeAuth = useCallback(async (forceReinit = false) => {
    if (initializationRef.current && !forceReinit) return;
    initializationRef.current = true;

    console.log('🔐 AuthProvider - Starting initialization with ServiceRegistry', { forceReinit });
    setIsLoading(true);
    setAuthError(null);

    try {
      // Initialize service registry and get auth service
      await serviceRegistryImpl.initialize();
      const auth = serviceRegistryImpl.getAuthService();
      
      if (!auth) {
        throw new Error('Auth service not available from registry');
      }
      
      setAuthService(auth);
      // **PHASE 1 FIX**: Check for DevBypass session recovery before normal initialization
      const shouldRecover = await (async () => {
        try {
          const { shouldAttemptSessionRecovery } = await import('@/utils/auth/sessionRecovery');
          return shouldAttemptSessionRecovery();
        } catch (importError) {
          console.warn('🔐 AuthProvider - Session recovery module not available:', importError);
          return false;
        }
      })();

      if (shouldRecover) {
        console.log('🔐 AuthProvider - Attempting DevBypass session recovery');
        try {
          const { recoverDevBypassSession } = await import('@/utils/auth/sessionRecovery');
          const recoveryResult = await recoverDevBypassSession();
          
          console.log('🔐 AuthProvider - Session recovery result:', recoveryResult);
          
          if (recoveryResult.success) {
            console.log('🔐 AuthProvider - Session recovery successful, continuing with normal initialization');
          } else {
            console.warn('🔐 AuthProvider - Session recovery failed:', recoveryResult.error);
          }
        } catch (recoveryError) {
          console.error('🔐 AuthProvider - Session recovery error:', recoveryError);
        }
      }

      const { data: { session: currentSession }, error } = await auth.getSession();
      
      if (error) {
        console.error('🔐 AuthProvider - Session fetch error:', error);
        throw error;
      }

      if (currentSession?.user) {
        console.log('🔐 AuthProvider - Session found, setting auth state');
        setSession(currentSession);
        setUser(currentSession.user);
        setUserType(inferUserType(currentSession.user));
        setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
        sessionPersistenceService.updateSession(currentSession, currentSession.user);
        console.log('🔐 AuthProvider - Auth state set successfully');
      } else {
        console.log('🔐 AuthProvider - No session found');
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsEmailVerified(false);
        sessionPersistenceService.clearSession();
      }

    } catch (error: unknown) {
      console.error('🔐 AuthProvider - Initialization failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAuthError(new Error(`Initialization failed: ${errorMessage}`));
      setSession(null);
      setUser(null);
      setUserType('individual');
      setIsEmailVerified(false);
      sessionPersistenceService.clearSession();
    } finally {
      setIsLoading(false);
      setAuthStable(true);
      setNavigationReady(true);
      setAuthStateStable(true);
      console.log('🔐 AuthProvider - Initialization complete, auth stable and navigation ready');
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    if (!authService) return;
    
    console.log('🔐 AuthProvider - Setting up auth state listener');
    
    const { data: { subscription } } = authService.onAuthStateChange((event, newSession) => {
      console.log('🔐 AuthProvider - Auth state changed:', event, !!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('🔐 AuthProvider - User signed in successfully');
        
        startTransition(() => {
          setIsTransitioning(true);
          setAuthStateStable(false);
          setSession(newSession);
          setUser(newSession.user);
          setUserType(inferUserType(newSession.user));
          setIsEmailVerified(newSession.user.email_confirmed_at !== null);
          setAuthError(null);
          setIsLoading(false); // Ensure loading is cleared on successful auth
        });
         
        sessionPersistenceService.updateSession(newSession, newSession.user);
        setAuthStable(true);
        setNavigationReady(true);
        
      } else if (event === 'SIGNED_OUT') {
        console.log('🔐 AuthProvider - User signed out, clearing state');
        
        startTransition(() => {
          setIsTransitioning(true);
          setAuthStateStable(false);
          setSession(null);
          setUser(null);
          setUserType('individual');
          setIsEmailVerified(false);
          setAuthError(null);
        });
        
        sessionPersistenceService.clearSession();
        
      } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
        console.log('🔐 AuthProvider - Token refreshed, updating state');
        
        startTransition(() => {
          setIsTransitioning(true);
          setAuthStateStable(false);
          setSession(newSession);
          setUser(newSession.user);
          setUserType(inferUserType(newSession.user));
          setIsEmailVerified(newSession.user.email_confirmed_at !== null);
        });
        
        sessionPersistenceService.updateSession(newSession, newSession.user);
      }
    });

    // Initialize after setting up the listener
    initializeAuth();

    // **FIX**: Also check for session changes every few seconds in case the listener misses something
    const sessionCheckInterval = setInterval(async () => {
      if (authService) {
        try {
          const { data: { session: currentSession }, error } = await authService.getSession();
          
          if (!error && currentSession?.user && !session) {
            console.log('🔐 AuthProvider - Found session during periodic check, updating state');
            startTransition(() => {
              setIsTransitioning(true);
              setAuthStateStable(false);
              setSession(currentSession);
              setUser(currentSession.user);
              setUserType(inferUserType(currentSession.user));
              setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
              setAuthError(null);
              setIsLoading(false);
            });
            
            sessionPersistenceService.updateSession(currentSession, currentSession.user);
            setAuthStable(true);
            setNavigationReady(true);
          }
        } catch (error) {
          // Silently handle errors during periodic checks
          console.warn('🔐 AuthProvider - Periodic session check error:', error);
        }
      }
    }, 1000); // Check every second

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, [initializeAuth, authService]);

  // State stabilization mechanism
  useEffect(() => {
    if (isTransitioning) {
      console.log('🔄 AuthProvider - Starting state stabilization period');
      const timeout = setTimeout(() => {
        console.log('✅ AuthProvider - State stabilization complete');
        setAuthStateStable(true);
        setIsTransitioning(false);
      }, 100);
      
      return () => clearTimeout(timeout);
    } else {
      setAuthStateStable(true);
    }
  }, [isTransitioning, session, user, userType]);

  // Auth actions using service registry
  const signIn = useCallback(async (email: string, password: string) => {
    if (!authService) {
      const err = new Error('Auth service not available');
      setAuthError(err);
      return { data: null, error: err };
    }
    
    try {
      setAuthError(null);
      const { data, error } = await authService.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Sign in failed');
      setAuthError(err);
      return { data: null, error: err };
    }
  }, [authService]);

  const signUp = useCallback(async (formData: { email: string; password: string; options?: { data?: Record<string, unknown> } }) => {
    if (!authService) {
      const err = new Error('Auth service not available');
      setAuthError(err);
      throw err;
    }
    
    try {
      setAuthError(null);
      const { data, error } = await authService.signUp(formData);
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      return { data, error: null };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Sign up failed');
      setAuthError(err);
      throw err;
    }
  }, [authService]);

  const signOut = useCallback(async () => {
    if (!authService) {
      const err = new Error('Auth service not available');
      setAuthError(err);
      return;
    }
    
    try {
      setAuthError(null);
      const { error } = await authService.signOut();
      if (error) throw error;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Sign out failed');
      setAuthError(err);
      console.error('Sign out error:', err);
    }
  }, [authService]);

  const refreshSession = useCallback(async () => {
    if (!authService) {
      const err = new Error('Auth service not available');
      setAuthError(err);
      return { isEmailVerified: false };
    }
    
    try {
      const { data, error } = await authService.refreshSession();
      if (error) throw error;
      
      const isVerified = data.session?.user?.email_confirmed_at !== null;
      setIsEmailVerified(isVerified);
      
      return { isEmailVerified: isVerified };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Session refresh failed');
      setAuthError(err);
      return { isEmailVerified: false };
    }
  }, [authService]);

  const recoverAuthState = useCallback(async () => {
    console.log('AuthProvider - Manual auth recovery requested');
    initializationRef.current = false;
    await initializeAuth(true);
    return true;
  }, [initializeAuth]);

  // Add a method to force auth refresh when DevBypass completes
  const refreshAuthAfterDevBypass = useCallback(async () => {
    console.log('🔐 AuthProvider - DevBypass auth refresh requested');
    
    // Check if we have a session now
    if (authService) {
      try {
        const { data: { session: currentSession }, error } = await authService.getSession();
        
        if (error) {
          console.error('🔐 AuthProvider - DevBypass refresh session error:', error);
          return;
        }

        if (currentSession?.user) {
          console.log('🔐 AuthProvider - DevBypass refresh found session, updating state');
          
          startTransition(() => {
            setIsTransitioning(true);
            setAuthStateStable(false);
            setSession(currentSession);
            setUser(currentSession.user);
            setUserType(inferUserType(currentSession.user));
            setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
            setAuthError(null);
            setIsLoading(false);
          });
          
          sessionPersistenceService.updateSession(currentSession, currentSession.user);
          setAuthStable(true);
          setNavigationReady(true);
        }
      } catch (error) {
        console.error('🔐 AuthProvider - DevBypass refresh error:', error);
      }
    }
  }, [authService]);

  const sendVerificationEmail = useCallback(async (email: string) => {
    if (!authService) {
      const err = new Error('Auth service not available');
      setAuthError(err);
      throw err;
    }
    
    try {
      const { error } = await authService.resend({ 
        type: 'signup', 
        email,
        options: { emailRedirectTo: `${window.location.origin}/?email_confirmed=true` }
      });
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      debouncedToast.success('Verification email sent', 'Please check your inbox');
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Send verification email failed');
      setAuthError(err);
      throw err;
    }
  }, [authService]);

  const updateUserProfile = useCallback(async (data: Record<string, unknown>) => {
    if (!authService) {
      const err = new Error('Auth service not available');
      setAuthError(err);
      throw err;
    }
    
    try {
      const { error } = await authService.updateUser(data);
      if (error) throw error;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Update profile failed');
      setAuthError(err);
      throw err;
    }
  }, [authService]);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!authService) {
      const err = new Error('Auth service not available');
      setAuthError(err);
      throw err;
    }
    
    try {
      const { error } = await authService.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Update password failed');
      setAuthError(err);
      throw err;
    }
  }, [authService]);

  const switchRole = useCallback(async (role: 'individual' | 'establishment' | 'promoter') => {
    if (!user || !authService) {
      throw new Error('No authenticated user or auth service not available');
    }

    try {
      setIsTransitioning(true);
      
      const { error } = await authService.rpc('switch_active_role', { 
        role_to_activate: role 
      });
      
      if (error) throw error;
      
      setUserType(role);
      authCache.clearUserCache(user.id);
      authCache.setUserType(user.id, role);
      
      console.log(`✅ Role switched to: ${role}`);
      
    } catch (error: any) {
      console.error('Role switch error:', error);
      setAuthError(error);
      throw error;
    } finally {
      setIsTransitioning(false);
    }
  }, [user, authService]);

  const value: AuthContextType = {
    session,
    user,
    isAuthenticated: !!session && !!user,
    isLoading,
    isEmailVerified,
    isVerificationEmailSent,
    authError,
    authStable,
    userType,
    navigationReady,
    isTransitioning,
    authStateStable,
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    refreshAuthAfterDevBypass,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
    switchRole,
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