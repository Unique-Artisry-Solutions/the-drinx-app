
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from '@/types/auth';
import { SESSION_VALIDATION_KEY, MAX_SESSION_AGE_MS } from './constants';
import { isValidSession, hasValidLocalStorage } from './helpers';

/**
 * Checks if session validation is due based on the last validation time
 */
export function isSessionValidationDue(): boolean {
  const lastValidation = localStorage.getItem(SESSION_VALIDATION_KEY);
  
  if (!lastValidation) {
    return true;
  }
  
  const lastValidationTime = parseInt(lastValidation, 10);
  const currentTime = new Date().getTime();
  
  // If the last validation was more than MAX_SESSION_AGE_MS ago, validation is due
  return currentTime - lastValidationTime > MAX_SESSION_AGE_MS;
}

/**
 * Validates the current session state for consistency between localStorage and Supabase
 */
export async function validateSessionState(): Promise<SessionValidationResult> {
  const result: SessionValidationResult = {
    isValid: false,
    hasMismatch: false,
    hasLocalStorage: false,
    hasSupabaseSession: false,
  };
  
  try {
    console.log('Validating session state...');
    
    // Check localStorage flags
    const hasLocalStorageAuth = hasValidLocalStorage();
    result.hasLocalStorage = hasLocalStorageAuth;
    
    // Check Supabase session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      result.errorDetails = `Session fetch error: ${sessionError.message}`;
      console.error('Session validation error:', sessionError);
      return result;
    }
    
    const hasSupabaseSession = !!sessionData.session && isValidSession(sessionData.session);
    result.hasSupabaseSession = hasSupabaseSession;
    
    // Detect mismatches
    if (hasLocalStorageAuth && !hasSupabaseSession) {
      result.hasMismatch = true;
      result.errorDetails = "User marked as authenticated in localStorage but no valid Supabase session";
      console.warn('Session mismatch detected:', result.errorDetails);
      return result;
    }
    
    if (!hasLocalStorageAuth && hasSupabaseSession) {
      result.hasMismatch = true;
      result.errorDetails = "Valid Supabase session exists but user not authenticated in localStorage";
      console.warn('Session mismatch detected:', result.errorDetails);
      return result;
    }
    
    // Email mismatch check
    if (hasSupabaseSession && sessionData.session?.user) {
      const authEmail = localStorage.getItem('user_email');
      
      if (authEmail && sessionData.session.user.email !== authEmail) {
        result.hasMismatch = true;
        result.errorDetails = "Email mismatch between localStorage and Supabase session";
        console.warn('Session mismatch detected:', result.errorDetails);
        return result;
      }
    }
    
    // If we're here, session state is valid
    result.isValid = (hasLocalStorageAuth === hasSupabaseSession);
    
    // Update the last validation timestamp
    localStorage.setItem(SESSION_VALIDATION_KEY, new Date().getTime().toString());
    
    return result;
    
  } catch (error: any) {
    result.errorDetails = `Validation error: ${error.message}`;
    console.error('Unexpected error during session validation:', error);
    return result;
  }
}
