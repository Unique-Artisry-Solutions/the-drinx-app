
import React, { createContext, useContext, useEffect, useState, useCallback, useRef, startTransition } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions, AuthContextType } from './types';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { authCache } from './authCache';
import { debouncedToast } from '@/utils/debouncedToast';
import { inferUserType } from '@/utils/auth/admin';
import { DevAutoLoginService } from '@/services/DevAutoLoginService';
import { validateImpersonationState, ensureImpersonationFlags, clearImpersonationFlags } from '@/utils/impersonationValidator';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to extract tokens from URL hash
const extractTokensFromUrl = (): { access_token?: string; refresh_token?: string } | null => {
  try {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    if (accessToken) {
      console.log('🔑 Token extraction - Found tokens in URL hash');
      return {
        access_token: accessToken,
        refresh_token: refreshToken || undefined
      };
    }
    
    return null;
  } catch (error) {
    console.error('🔑 Token extraction failed:', error);
    return null;
  }
};

// Utility function to clean tokens from URL
const cleanTokensFromUrl = () => {
  try {
    if (window.location.hash.includes('access_token=')) {
      const newUrl = window.location.pathname + window.location.search;
      window.history.replaceState({}, document.title, newUrl);
      console.log('🔑 URL cleaned - Tokens removed from hash');
    }
  } catch (error) {
    console.error('🔑 URL cleanup failed:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [authError, setAuthError] = useState<any | null>(null);
  const [authStable, setAuthStable] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>('individual');
  const [navigationReady, setNavigationReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authStateStable, setAuthStateStable] = useState(false);
  
  const initializationRef = useRef(false);
  const tokenProcessingRef = useRef(false); // Prevent multiple token processing attempts
  const stabilizationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // HMR Protection: Preserve impersonation state during development reloads
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleBeforeUnload = () => {
        const backup = localStorage.getItem('impersonation_backup');
        const hasFlags = !!(
          sessionStorage.getItem('impersonation_active') ||
          sessionStorage.getItem('impersonation_magic_link')
        );
        
        if (backup && hasFlags) {
          console.log('🔄 HMR Protection: Preserving impersonation state during reload');
          localStorage.setItem('hmr_impersonation_preserved', 'true');
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Check if we're recovering from HMR
      if (localStorage.getItem('hmr_impersonation_preserved') === 'true') {
        console.log('🔄 HMR Recovery: Detected preserved impersonation state');
        localStorage.removeItem('hmr_impersonation_preserved');
      }
      
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  // Initialize auth state - simplified and more robust with dev auto-login
  const initializeAuth = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('🔐 AuthProvider - Starting initialization');
    setIsLoading(true);
    setAuthError(null);

    try {
      // Get current session with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
      );
      
      const sessionPromise = supabase.auth.getSession();
      
      const { data: { session: currentSession }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      if (error) {
        console.error('🔐 AuthProvider - Session fetch error:', error);
        throw error;
      }

      if (currentSession?.user) {
        console.log('🔐 AuthProvider - Session found, setting auth state');
        
        // Set session and user
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Determine user type
        setUserType(inferUserType(currentSession.user));
        
        // Set email verification status
        setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
        
        // Update persistence service
        sessionPersistenceService.updateSession(currentSession, currentSession.user);
        
        console.log('🔐 AuthProvider - Auth state set successfully');
      } else {
        console.log('🔐 AuthProvider - No session found, checking for dev auto-login');
        
        // Clear auth state first
        setSession(null);
        setUser(null);
        setUserType('individual');
        setIsEmailVerified(false);
        sessionPersistenceService.clearSession();
        
        // **RECOVERY MECHANISM**: Check for interrupted magic link processing
        const interruptedProcessing = localStorage.getItem('magic_link_processing') === 'true';
        const processingTimestamp = localStorage.getItem('magic_link_processing_timestamp');
        const impersonationBackup = localStorage.getItem('impersonation_backup');
        
        if (interruptedProcessing && processingTimestamp && impersonationBackup) {
          const age = Date.now() - parseInt(processingTimestamp);
          if (age < 60000) { // Less than 1 minute old
            console.log('🔄 AuthProvider - Detecting interrupted magic link processing, attempting recovery');
            
            try {
              const backup = JSON.parse(impersonationBackup);
              
              // Restore impersonation flags if they're missing
              const hasFlags = !!(
                sessionStorage.getItem('impersonation_active') ||
                sessionStorage.getItem('impersonation_magic_link') ||
                localStorage.getItem('impersonation_active_backup')
              );
              
              if (!hasFlags && backup.email) {
                console.log('🔄 AuthProvider - Restoring impersonation flags after interruption');
                sessionStorage.setItem('impersonation_active', 'true');
                sessionStorage.setItem('impersonation_magic_link', 'true');
                localStorage.setItem('impersonation_active_backup', 'true');
                sessionStorage.setItem('impersonation_target_email', backup.email);
              }
            } catch (error) {
              console.warn('❌ Failed to parse impersonation backup during recovery:', error);
            }
          } else {
            console.log('🧹 AuthProvider - Clearing stale interrupted processing flags');
            localStorage.removeItem('magic_link_processing');
            localStorage.removeItem('magic_link_processing_timestamp');
          }
        }
        
        // Check if we're processing a magic link (skip dev auto-login in that case)
        const urlHash = window.location.hash;
        const urlSearch = window.location.search;
        const hasMagicLinkTokens = urlHash.includes('access_token=') || urlSearch.includes('access_token=');
        const isMagicLinkProcessing = typeof window !== 'undefined' && window.sessionStorage.getItem('processing_magic_link') === 'true';
        const expectingMagicLink = typeof window !== 'undefined' && window.sessionStorage.getItem('expecting_magic_link') === 'true';
        
        console.log('🔍 AuthProvider - Magic link detection:', {
          hasMagicLinkTokens,
          isMagicLinkProcessing,
          expectingMagicLink,
          urlHash: urlHash.substring(0, 50) + '...',
          currentDomain: window.location.hostname
        });
        
        if (hasMagicLinkTokens || isMagicLinkProcessing || expectingMagicLink) {
          console.log('🔐 AuthProvider - Magic link tokens detected or processing, checking for manual processing');
          
          // Try manual token processing if tokens are present but no session exists
          if (hasMagicLinkTokens && !currentSession && !tokenProcessingRef.current) {
            tokenProcessingRef.current = true; // Prevent multiple processing attempts
            console.log('🔑 AuthProvider - Attempting manual magic link token processing');
            
            try {
              const tokens = extractTokensFromUrl();
              
              if (tokens?.access_token) {
                console.log('🔑 AuthProvider - Extracted tokens, setting session manually');
                
                // Check if we have impersonation backup
                const impersonationBackup = localStorage.getItem('impersonation_backup');
                let parsedBackup = null;
                try {
                  parsedBackup = impersonationBackup ? JSON.parse(impersonationBackup) : null;
                } catch (e) {
                  console.warn('Failed to parse impersonation backup:', e);
                }
                
                const hasExistingImpersonationFlags = !!(
                  sessionStorage.getItem('impersonation_magic_link') ||
                  sessionStorage.getItem('impersonation_active') ||
                  localStorage.getItem('impersonation_active_backup')
                );
                
                console.log('🎭 AuthProvider - Pre-authentication impersonation check:', {
                  hasBackup: !!parsedBackup,
                  hasExistingFlags: hasExistingImpersonationFlags,
                  backupEmail: parsedBackup?.email
                });
                
                // **CRITICAL FIX**: Set persistent magic link processing flag to survive refreshes
                localStorage.setItem('magic_link_processing', 'true');
                localStorage.setItem('magic_link_processing_timestamp', Date.now().toString());
                
                // **CRITICAL FIX**: If we have backup but no flags, set them BEFORE authentication
                if (parsedBackup && !hasExistingImpersonationFlags) {
                  console.log('🎯 AuthProvider - Setting impersonation flags before authentication');
                  sessionStorage.setItem('impersonation_active', 'true');
                  sessionStorage.setItem('impersonation_magic_link', 'true');
                  localStorage.setItem('impersonation_active_backup', 'true');
                  
                  // Store target email from backup for validation
                  if (parsedBackup.email) {
                    sessionStorage.setItem('impersonation_target_email', parsedBackup.email);
                  }
                }
                
                // Set session using manual tokens
                const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                  access_token: tokens.access_token,
                  refresh_token: tokens.refresh_token || ''
                });
                
                if (sessionError) {
                  console.error('🔑 AuthProvider - Manual session setting failed:', sessionError);
                  throw sessionError;
                }
                
                 if (sessionData.session?.user) {
                   console.log('✅ AuthProvider - Manual magic link processing successful');
                   
                 // **CRITICAL FIX**: Batch state updates to prevent DOM race conditions
                 startTransition(() => {
                   console.log('🔄 AuthProvider - Applying batched auth state updates');
                   
                   // Set transitioning state first
                   setIsTransitioning(true);
                   setAuthStateStable(false);
                   
                   // Set auth state in a single batch to prevent race conditions
                   setSession(sessionData.session);
                   setUser(sessionData.session.user);
                   setUserType(inferUserType(sessionData.session.user));
                   setIsEmailVerified(sessionData.session.user.email_confirmed_at !== null);
                 });
                   
                   sessionPersistenceService.updateSession(sessionData.session, sessionData.session.user);
                  
                  // **CRITICAL FIX**: Enhanced impersonation validation after manual auth
                  if (parsedBackup) {
                    console.log('🎭 AuthProvider - Validating impersonation state after manual auth');
                    
                    const currentFlags = {
                      active: sessionStorage.getItem('impersonation_active'),
                      magicLink: sessionStorage.getItem('impersonation_magic_link'),
                      backup: localStorage.getItem('impersonation_active_backup'),
                      targetEmail: sessionStorage.getItem('impersonation_target_email')
                    };
                    
                    console.log('🔍 AuthProvider - Current impersonation flags:', currentFlags);
                    
                    // **SESSION VALIDATION**: Check if authenticated user matches expected target
                    const expectedTargetFromBackup = currentFlags.targetEmail || parsedBackup.email;
                    const actualUserEmail = sessionData.session.user.email;
                    const actualUserId = sessionData.session.user.id;
                    
                    console.log('🎯 AuthProvider - Session validation:', {
                      expectedEmail: expectedTargetFromBackup,
                      actualEmail: actualUserEmail,
                      actualUserId,
                      backupUserId: parsedBackup.user_id,
                      isValidImpersonation: actualUserId !== parsedBackup.user_id
                    });
                    
                    // Validate impersonation using enhanced validation with processing context
                    const validation = validateImpersonationState(actualUserId, actualUserEmail || '', true);
                    
                    console.log('🔍 AuthProvider - Manual auth validation result:', validation);
                    
                    if (validation.shouldClear) {
                      console.log('🧹 AuthProvider - Clearing impersonation state after manual auth:', validation.reason);
                      clearImpersonationFlags();
                    } else if (validation.shouldPersist && validation.isValid) {
                      console.log('✅ AuthProvider - Maintaining impersonation state after manual auth:', validation.reason);
                      ensureImpersonationFlags(actualUserEmail || expectedTargetFromBackup || '');
                    }
                  }
                  
                  // **CRITICAL FIX**: Clear processing flags after successful processing
                  localStorage.removeItem('magic_link_processing');
                  localStorage.removeItem('magic_link_processing_timestamp');
                  
                  console.log('🔐 AuthProvider - Immediate manual auth processing complete');
                  
                  // Clean up URL tokens immediately (safe DOM operation)
                  cleanTokensFromUrl();
                  
                } else {
                  console.warn('🔑 AuthProvider - Manual session setting returned no user');
                }
              } else {
                console.warn('🔑 AuthProvider - No valid tokens found for manual processing');
              }
            } catch (tokenError: any) {
              console.error('🔑 AuthProvider - Manual token processing failed:', tokenError);
              setAuthError(new Error(`Manual token processing failed: ${tokenError.message}`));
              
              // **CRITICAL FIX**: Clear processing flags on error
              localStorage.removeItem('magic_link_processing');
              localStorage.removeItem('magic_link_processing_timestamp');
              
              // Clean up URL on error
              cleanTokensFromUrl();
            } finally {
              // Reset the processing flag
              tokenProcessingRef.current = false;
            }
          } else if (hasMagicLinkTokens && tokenProcessingRef.current) {
            console.log('🔑 AuthProvider - Token processing already in progress, skipping duplicate attempt');
          } else {
            console.log('🔐 AuthProvider - Magic link detected but skipping processing (session exists or no tokens)');
          }
        } else if (DevAutoLoginService.isDevelopmentMode()) {
          console.log('🔐 AuthProvider - Development mode detected, initializing auto-login');
          
          // Check if there's a stored dev user type, otherwise default to admin
          const storedDevType = DevAutoLoginService.getCurrentDevUserType();
          if (!storedDevType) {
            console.log('🔐 AuthProvider - No stored dev user type, auto-logging in as admin');
            await DevAutoLoginService.autoLogin('admin');
          } else {
            console.log('🔐 AuthProvider - Found stored dev user type, initializing auto-login');
            await DevAutoLoginService.initializeAutoLogin();
          }
          
          // After auto-login attempt, check for session again
          const { data: { session: devSession } } = await supabase.auth.getSession();
          if (devSession?.user) {
            console.log('🔐 AuthProvider - Dev auto-login successful, setting auth state');
            setSession(devSession);
            setUser(devSession.user);
            setUserType(inferUserType(devSession.user));
            setIsEmailVerified(devSession.user.email_confirmed_at !== null);
            sessionPersistenceService.updateSession(devSession, devSession.user);
          }
        }
      }

    } catch (error: any) {
      console.error('🔐 AuthProvider - Initialization failed:', error);
      // Don't set auth error for timeout - just proceed with no auth
      if (!error.message.includes('timeout')) {
        setAuthError(new Error(`Initialization failed: ${error.message}`));
      }
      // Clear auth state on error
      setSession(null);
      setUser(null);
      setUserType('individual');
      setIsEmailVerified(false);
      sessionPersistenceService.clearSession();
    } finally {
      // ALWAYS set these flags to true after initialization attempt
      setIsLoading(false);
      setAuthStable(true);
      setNavigationReady(true);
      setAuthStateStable(true);
      console.log('🔐 AuthProvider - Initialization complete, auth stable and navigation ready');
    }
  }, []);

  // Handle auth state changes - enhanced for impersonation
  useEffect(() => {
    console.log('🔐 AuthProvider - Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('🔐 AuthProvider - Auth state changed:', event, !!newSession);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('🔐 AuthProvider - User signed in successfully');
        
        // **CRITICAL FIX**: Check if we're in magic link processing mode (using persistent storage)
        const isMagicLinkProcessing = localStorage.getItem('magic_link_processing') === 'true';
        const processingTimestamp = localStorage.getItem('magic_link_processing_timestamp');
        
        // **RECOVERY MECHANISM**: Clear stale processing flags (older than 30 seconds)
        if (isMagicLinkProcessing && processingTimestamp) {
          const age = Date.now() - parseInt(processingTimestamp);
          if (age > 30000) { // 30 seconds
            console.log('🧹 AuthProvider - Clearing stale magic link processing flags');
            localStorage.removeItem('magic_link_processing');
            localStorage.removeItem('magic_link_processing_timestamp');
          }
        }
        
        console.log('🎭 AuthProvider - Auth state change context:', {
          event,
          isMagicLinkProcessing,
          userId: newSession.user.id,
          userEmail: newSession.user.email
        });
        
        // **CRITICAL FIX**: Enhanced validation with processing context
        const validation = validateImpersonationState(
          newSession.user.id, 
          newSession.user.email || '', 
          isMagicLinkProcessing
        );
        
        console.log('🔍 AuthProvider - Impersonation validation result:', validation);
        
          // **CRITICAL FIX**: Batch state updates to prevent DOM race conditions
          startTransition(() => {
            console.log('🔍 AuthProvider - Batching impersonation validation state updates');
            
            // Set transitioning state first
            setIsTransitioning(true);
            setAuthStateStable(false);
            
            if (validation.shouldClear && !isMagicLinkProcessing) {
              console.log('🧹 AuthProvider - Clearing impersonation state:', validation.reason);
              clearImpersonationFlags();
            } else if (validation.shouldPersist && validation.isValid) {
              console.log('✅ AuthProvider - Maintaining impersonation state:', validation.reason);
              ensureImpersonationFlags(newSession.user.email || '');
            } else if (isMagicLinkProcessing) {
              console.log('⏳ AuthProvider - Deferring validation during magic link processing');
            }
            
            setSession(newSession);
            setUser(newSession.user);
            setUserType(inferUserType(newSession.user));
            setIsEmailVerified(newSession.user.email_confirmed_at !== null);
            setAuthError(null);
          });
         
         sessionPersistenceService.updateSession(newSession, newSession.user);
         
         // Mark auth as stable for sign-ins (important for impersonation)
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

    // Initialize auth state
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  // State stabilization mechanism - prevents premature navigation decisions
  useEffect(() => {
    // Clear any existing stabilization timeout
    if (stabilizationTimeoutRef.current) {
      clearTimeout(stabilizationTimeoutRef.current);
    }

    // If we're in a transitioning state, set timeout to stabilize
    if (isTransitioning) {
      console.log('🔄 AuthProvider - Starting state stabilization period');
      stabilizationTimeoutRef.current = setTimeout(() => {
        console.log('✅ AuthProvider - State stabilization complete');
        setAuthStateStable(true);
        setIsTransitioning(false);
      }, 100); // Brief stabilization delay
    } else {
      setAuthStateStable(true);
    }

    return () => {
      if (stabilizationTimeoutRef.current) {
        clearTimeout(stabilizationTimeoutRef.current);
      }
    };
  }, [isTransitioning, session, user, userType]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      setAuthError(error);
      return { data: null, error };
    }
  }, []);

  const signUp = useCallback(async (formData: any) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp(formData);
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      return { data, error: null };
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      console.error('Sign out error:', error);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      const isVerified = data.session?.user?.email_confirmed_at !== null;
      setIsEmailVerified(isVerified);
      
      return { isEmailVerified: isVerified };
    } catch (error: any) {
      setAuthError(error);
      return { isEmailVerified: false };
    }
  }, []);

  const recoverAuthState = useCallback(async () => {
    console.log('AuthProvider - Manual auth recovery requested');
    initializationRef.current = false;
    await initializeAuth();
    return true;
  }, [initializeAuth]);

  const sendVerificationEmail = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email,
        options: { emailRedirectTo: `${window.location.origin}/?email_confirmed=true` }
      });
      
      if (error) throw error;
      
      setIsVerificationEmailSent(true);
      debouncedToast.success('Verification email sent', 'Please check your inbox');
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(async (data: any) => {
    try {
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    // State
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
    
    // Actions
    signIn,
    signUp,
    signOut,
    refreshSession,
    recoverAuthState,
    sendVerificationEmail,
    updateUserProfile,
    updatePassword,
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
    const errorMessage = 'useAuth must be used within an AuthProvider';
    
    // During development hot reloads, provide more helpful debugging
    if (process.env.NODE_ENV === 'development') {
      console.error(errorMessage, {
        currentContext: context,
        hasAuthContext: !!AuthContext,
        stackTrace: new Error().stack
      });
    }
    
    throw new Error(errorMessage);
  }
  return context;
};
