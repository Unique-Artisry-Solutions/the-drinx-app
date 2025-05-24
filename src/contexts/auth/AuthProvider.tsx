import React, { 
  useState, 
  useEffect, 
  useContext, 
  createContext, 
  useCallback,
  useMemo
} from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContextType, AuthState, AuthUser } from './types';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { authService } from '@/services/AuthService';
import { useToast } from '@/hooks/use-toast';
import { authCache } from './authCache';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { useRetry } from '@/hooks/useRetry';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Initialize default state
const defaultAuthState: AuthState = {
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isEmailVerified: false,
  isVerificationEmailSent: false,
  authError: null,
  authStable: false,
  userType: null,
  navigationReady: false
};

// Create auth context
const AuthContext = createContext<AuthContextType>({
  ...defaultAuthState,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({}),
  signOut: async () => { },
  refreshSession: async () => ({ isEmailVerified: false }),
  recoverAuthState: async () => false,
  sendVerificationEmail: async () => { },
  updateUserProfile: async () => { },
  updatePassword: async () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState(defaultAuthState.session);
  const [user, setUser] = useState<AuthUser | null>(defaultAuthState.user);
  const [isAuthenticated, setIsAuthenticated] = useState(defaultAuthState.isAuthenticated);
  const [isLoading, setIsLoading] = useState(defaultAuthState.isLoading);
  const [isEmailVerified, setIsEmailVerified] = useState(defaultAuthState.isEmailVerified);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(defaultAuthState.isVerificationEmailSent);
  const [authError, setAuthError] = useState(defaultAuthState.authError);
  const [authStable, setAuthStable] = useState(defaultAuthState.authStable);
  const [userType, setUserType] = useState<"individual" | "establishment" | "promoter" | "admin" | null>(defaultAuthState.userType);
  const [navigationReady, setNavigationReady] = useState(defaultAuthState.navigationReady);
  
  const { goToHomePage, goToLoginPage, goToAfterLogin } = useAppNavigation();
  const { toast } = useToast();
  
  const { recoverAuthState } = useAuthRecovery();
  const { executeWithRetry } = useRetry({
    maxAttempts: 3,
    baseDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Auth operation retry ${attempt}:`, error.message);
    },
    onFailure: (error, attempts) => {
      console.error(`Auth operation failed after ${attempts} attempts:`, error);
    }
  });

  // Function to determine user type
  const getUserType = async (userId: string): Promise<string | null> => {
    try {
      // Check cache first
      const cachedUserType = authCache.getUserType(userId);
      if (cachedUserType) {
        console.log('UserType from cache:', cachedUserType);
        return cachedUserType;
      }
      
      // Check user metadata
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user?.user_metadata?.user_type) {
        const userType = data.user.user_metadata.user_type;
        authCache.setUserType(userId, userType);
        console.log('UserType from metadata:', userType);
        return userType;
      }
      
      // Fallback to database query
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
      
      if (roleError) {
        console.warn('Error fetching user role:', roleError);
        return null;
      }
      
      if (roleData) {
        authCache.setUserType(userId, roleData.role);
        console.log('UserType from database:', roleData.role);
        return roleData.role;
      }
      
      return null;
    } catch (error) {
      console.error('Error determining user type:', error);
      return null;
    }
  };

  // Enhanced initialization with caching and persistence
  useEffect(() => {
    let mounted = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    const initializeAuth = async () => {
      try {
        console.log("AuthProvider - Starting initialization with persistence");
        setIsLoading(true);
        setAuthStable(false);

        // Initialize session with persistence
        const sessionData = await sessionPersistenceService.initializeSession();
        
        if (!mounted) return;

        if (sessionData.session && sessionData.user) {
          console.log("AuthProvider - Session initialized", { fromCache: sessionData.fromCache });
          
          setSession(sessionData.session);
          setUser(sessionData.user as AuthUser);
          setIsAuthenticated(true);
          setIsEmailVerified(!!sessionData.user.email_confirmed_at);

          // Get userType with caching
          if (sessionData.user.id) {
            const cachedUserType = authCache.getUserType(sessionData.user.id);
            if (cachedUserType) {
              setUserType(cachedUserType as any);
              setNavigationReady(true);
            } else {
              const userType = await executeWithRetry(() => getUserType(sessionData.user!.id));
              if (mounted && userType) {
                authCache.setUserType(sessionData.user.id, userType);
                setUserType(userType);
                setNavigationReady(true);
              }
            }
          }
        } else {
          console.log("AuthProvider - No session found");
          setNavigationReady(true);
        }

        // Set up auth state listener
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          
          console.log("AuthProvider - Auth state changed:", event);
          
          try {
            if (session?.user) {
              setSession(session);
              setUser(session.user as AuthUser);
              setIsAuthenticated(true);
              setIsEmailVerified(!!session.user.email_confirmed_at);
              
              // Update persistence
              sessionPersistenceService.updateSession(session, session.user);
              
              // Get userType with caching
              const cachedUserType = authCache.getUserType(session.user.id);
              if (cachedUserType) {
                setUserType(cachedUserType as any);
                setNavigationReady(true);
              } else {
                const userType = await executeWithRetry(() => getUserType(session.user.id));
                if (mounted && userType) {
                  authCache.setUserType(session.user.id, userType);
                  setUserType(userType);
                  setNavigationReady(true);
                }
              }
            } else {
              console.log("AuthProvider - Clearing auth state");
              setSession(null);
              setUser(null);
              setIsAuthenticated(false);
              setIsEmailVerified(false);
              setUserType(null);
              setNavigationReady(true);
              
              // Clear persistence and cache
              sessionPersistenceService.clearSession();
            }
          } catch (error) {
            console.error("AuthProvider - Error in auth state change:", error);
            setAuthError(error as Error);
          }
        });

      } catch (error) {
        console.error("AuthProvider - Initialization error:", error);
        if (mounted) {
          setAuthError(error as Error);
          setNavigationReady(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setAuthStable(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [executeWithRetry]);

  // Enhanced auth recovery function
  const handleRecoverAuthState = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const recovered = await recoverAuthState();
      
      if (recovered) {
        setSession(recovered.session);
        setUser(recovered.user as AuthUser);
        setIsAuthenticated(true);
        setIsEmailVerified(!!recovered.user.email_confirmed_at);
        setUserType(recovered.userType as any);
        setNavigationReady(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("AuthProvider - Recovery failed:", error);
      setAuthError(error as Error);
      return false;
    } finally {
      setIsLoading(false);
      setAuthStable(true);
    }
  }, [recoverAuthState]);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        console.error('AuthProvider - Sign in error:', error);
        setAuthError(error);
        throw error;
      }
      
      if (data.user) {
        setUser(data.user as AuthUser);
        setSession(data.session);
        setIsAuthenticated(true);
        setIsEmailVerified(!!data.user.email_confirmed_at);
        
        // Get userType and navigate
        const userType = await executeWithRetry(() => getUserType(data.user!.id));
        if (userType) {
          authCache.setUserType(data.user.id, userType);
          setUserType(userType);
          setNavigationReady(true);
        }
        
        // Handle post-login navigation
        const savedRedirect = localStorage.getItem('auth_redirect');
        goToAfterLogin(userType || 'individual', savedRedirect || undefined);
      }
      
      return { error: null, data };
    } catch (error: any) {
      console.error('AuthProvider - Sign in failed:', error);
      setAuthError(error);
      goToLoginPage();
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  }, [goToLoginPage, goToAfterLogin, executeWithRetry]);

  // Sign up function
  const signUp = useCallback(async (formData: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { email, password, ...metadata } = formData;
      
      const { data, error } = await authService.signUp(
        email,
        password,
        { data: metadata }
      );
      
      if (error) {
        console.error('AuthProvider - Sign up error:', error);
        setAuthError(error);
        throw error;
      }
      
      setIsVerificationEmailSent(true);
      
      return { data };
    } catch (error: any) {
      console.error('AuthProvider - Sign up failed:', error);
      setAuthError(error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      await authService.signOut();
      
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsEmailVerified(false);
      setUserType(null);
      setNavigationReady(false);
      
      goToHomePage();
    } catch (error: any) {
      console.error('AuthProvider - Sign out error:', error);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, [goToHomePage]);

  // Enhanced refresh session with persistence
  const refreshSession = useCallback(async (): Promise<{ isEmailVerified: boolean }> => {
    try {
      const { data, error } = await executeWithRetry(async () => {
        const result = await supabase.auth.refreshSession();
        if (result.error) throw result.error;
        return result;
      });

      if (data.session?.user) {
        sessionPersistenceService.updateSession(data.session, data.session.user);
        setSession(data.session);
        setUser(data.session.user as AuthUser);
        setIsAuthenticated(true);
        
        const isVerified = !!data.session.user.email_confirmed_at;
        setIsEmailVerified(isVerified);
        
        return { isEmailVerified: isVerified };
      }
      
      return { isEmailVerified: false };
    } catch (error) {
      console.error('AuthProvider - Session refresh failed:', error);
      setAuthError(error as Error);
      return { isEmailVerified: false };
    }
  }, [executeWithRetry]);

  // Send verification email
  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        console.error('AuthProvider - Send verification email error:', error);
        setAuthError(error);
        throw error;
      }
      
      setIsVerificationEmailSent(true);
      
      toast({
        title: 'Verification email sent',
        description: `Please check ${email} inbox and click the verification link`,
      });
    } catch (error: any) {
      console.error('AuthProvider - Send verification email failed:', error);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update user profile
  const updateUserProfile = useCallback(async (data: any) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.updateUser({ data });
      
      if (error) {
        console.error('AuthProvider - Update user profile error:', error);
        setAuthError(error);
        throw error;
      }
      
      // Optimistically update local state
      setUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            user_metadata: {
              ...prevUser.user_metadata,
              ...data,
            },
          };
        }
        return prevUser;
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error: any) {
      console.error('AuthProvider - Update user profile failed:', error);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        console.error('AuthProvider - Update password error:', error);
        setAuthError(error);
        throw error;
      }
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated',
      });
    } catch (error: any) {
      console.error('AuthProvider - Update password failed:', error);
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Value for the context provider
  const value = useMemo(() => ({
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
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState: handleRecoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword
  }), [
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
    signIn,
    signUp,
    signOut,
    refreshSession,
    handleRecoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
