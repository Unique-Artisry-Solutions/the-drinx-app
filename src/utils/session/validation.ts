
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from '@/types/AuthTypes';
import { SESSION_VALIDATION_KEY, DEFAULT_SESSION_VALIDATION_INTERVAL_MS } from './constants';
import { sessionManager } from './SessionManager';

/**
 * Checks if a Supabase session is valid
 */
export const isValidSession = (session: any): boolean => {
  return !!(session && session.user && session.access_token);
};

/**
 * Gets session data from a Supabase session
 */
export const getSessionData = (session: any): { userId: string | undefined; userEmail: string | undefined } => {
  return {
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  };
};

/**
 * Checks if there's a mismatch between localStorage state and Supabase session
 */
export const validateSessionState = async (): Promise<SessionValidationResult> => {
  try {
    // Check localStorage state
    const userAuthenticated = localStorage.getItem('user_authenticated') === 'true';
    const userType = localStorage.getItem('user_type');
    const userEmail = localStorage.getItem('user_email');
    
    // Directly check Supabase session
    const { data, error } = await supabase.auth.getSession();
    
    // Use our helper to safely determine if session exists
    const hasSession = isValidSession(data?.session);
    const sessionData = getSessionData(data?.session);
    
    // Log state for debugging
    console.log("Session validation:", {
      localStorage: { userAuthenticated, userType, userEmail },
      supabaseSession: hasSession,
      sessionUserId: sessionData.userId,
      sessionUserEmail: sessionData.userEmail
    });

    // Set last validation time
    sessionManager.markSessionValidated();
    
    // Check for actual mismatch conditions
    const hasMismatch = (userAuthenticated && !hasSession) || 
                        (!userAuthenticated && hasSession) ||
                        (userEmail && sessionData.userEmail && userEmail !== sessionData.userEmail);

    return {
      isValid: !hasMismatch && !error,
      hasMismatch,
      hasLocalStorage: userAuthenticated,
      hasSupabaseSession: hasSession,
      errorDetails: error ? error.message : undefined
    };
  } catch (error) {
    console.error("Error validating session:", error);
    return {
      isValid: false,
      hasMismatch: true,
      hasLocalStorage: false,
      hasSupabaseSession: false,
      errorDetails: error instanceof Error ? error.message : 'Unknown session validation error'
    };
  }
};

/**
 * Checks if the session validation is due (not performed recently)
 */
export const isSessionValidationDue = (): boolean => {
  return sessionManager.isSessionValidationDue(DEFAULT_SESSION_VALIDATION_INTERVAL_MS);
};
