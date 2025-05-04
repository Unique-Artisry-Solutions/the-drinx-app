
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from './types';
import { SESSION_VALIDATION_KEY } from './constants';

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
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Log state for debugging
    console.log("Session validation:", {
      localStorage: { userAuthenticated, userType, userEmail },
      supabaseSession: !!session,
      sessionUserId: session?.user?.id,
      sessionUserEmail: session?.user?.email
    });

    // Set last validation time
    localStorage.setItem(SESSION_VALIDATION_KEY, Date.now().toString());
    
    // Check for actual mismatch conditions
    const hasMismatch = (userAuthenticated && !session) || 
                        (!userAuthenticated && session) ||
                        (userEmail && session?.user?.email && userEmail !== session.user.email);

    return {
      isValid: !hasMismatch && !error,
      hasMismatch,
      hasLocalStorage: userAuthenticated,
      hasSupabaseSession: !!session,
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
  
  // Import from constants
  const validationInterval = 1000 * 60 * 30; // 30 minutes
  
  return timeSinceValidation > validationInterval;
};

