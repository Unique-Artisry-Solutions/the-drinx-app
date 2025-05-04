
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from './types';
import { SESSION_VALIDATION_KEY, DEFAULT_SESSION_VALIDATION_INTERVAL_MS } from './constants';
import { isValidSession, getSessionData } from './helpers';

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
    localStorage.setItem(SESSION_VALIDATION_KEY, Date.now().toString());
    
    // Check for actual mismatch conditions
    const hasMismatch = (userAuthenticated && !hasSession) || 
                        (!userAuthenticated && hasSession) ||
                        (userEmail && sessionData.userEmail && userEmail !== sessionData.userEmail);

    return {
      isValid: !hasMismatch && !error,
      hasMismatch,
      hasLocalStorage: userAuthenticated,
      hasSupabaseSession: hasSession, // Now properly typed as boolean
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
  const lastValidation = localStorage.getItem(SESSION_VALIDATION_KEY);
  if (!lastValidation) return true;
  
  const lastValidationTime = parseInt(lastValidation, 10);
  const timeSinceValidation = Date.now() - lastValidationTime;
  
  return timeSinceValidation > DEFAULT_SESSION_VALIDATION_INTERVAL_MS;
};
