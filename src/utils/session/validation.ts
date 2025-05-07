
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from '@/types/auth';

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
    // Check localStorage flags
    const isAuthenticatedInLocalStorage = localStorage.getItem('user_authenticated') === 'true';
    const authEmail = localStorage.getItem('user_email');
    const authType = localStorage.getItem('user_type');
    
    result.hasLocalStorage = isAuthenticatedInLocalStorage;
    
    // Check Supabase session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      result.errorDetails = `Session fetch error: ${sessionError.message}`;
      return result;
    }
    
    const hasSupabaseSession = !!sessionData.session;
    result.hasSupabaseSession = hasSupabaseSession;
    
    // Detect mismatches
    if (isAuthenticatedInLocalStorage && !hasSupabaseSession) {
      result.hasMismatch = true;
      result.errorDetails = "User marked as authenticated in localStorage but no valid Supabase session";
      return result;
    }
    
    if (!isAuthenticatedInLocalStorage && hasSupabaseSession) {
      result.hasMismatch = true;
      result.errorDetails = "Valid Supabase session exists but user not authenticated in localStorage";
      return result;
    }
    
    // Email mismatch check
    if (hasSupabaseSession && authEmail && sessionData.session?.user.email !== authEmail) {
      result.hasMismatch = true;
      result.errorDetails = "Email mismatch between localStorage and Supabase session";
      return result;
    }
    
    // If we're here, session state is valid
    result.isValid = isAuthenticatedInLocalStorage === hasSupabaseSession;
    return result;
    
  } catch (error: any) {
    result.errorDetails = `Validation error: ${error.message}`;
    return result;
  }
}
