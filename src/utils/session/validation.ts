
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from '@/types/auth';

// Constants for session validation
export const SESSION_VALIDATION_KEY = 'last_session_validation';
export const MAX_SESSION_AGE_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Checks if session validation is due based on cache
 */
export function isSessionValidationDue(): boolean {
  // Always validate - no localStorage dependency
  return true;
}

/**
 * Validates the current session state using only Supabase
 */
export async function validateSessionState(): Promise<SessionValidationResult> {
  const result: SessionValidationResult = {
    isValid: false,
    hasMismatch: false,
    hasLocalStorage: false,
    hasSupabaseSession: false,
  };
  
  try {
    // Check Supabase session only
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      result.errorDetails = `Session fetch error: ${sessionError.message}`;
      return result;
    }
    
    const hasSupabaseSession = !!sessionData.session;
    result.hasSupabaseSession = hasSupabaseSession;
    result.hasLocalStorage = false; // No longer using localStorage
    
    // Session is valid if Supabase has a session
    result.isValid = hasSupabaseSession;
    result.hasMismatch = false; // No localStorage to mismatch with
    
    return result;
    
  } catch (error: any) {
    result.errorDetails = `Validation error: ${error.message}`;
    return result;
  }
}
