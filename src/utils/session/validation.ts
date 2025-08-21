
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from '@/types/auth';

// Constants for session validation
export const SESSION_VALIDATION_KEY = 'last_session_validation';
export const MAX_SESSION_AGE_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Enhanced session validation with frequency control to prevent excessive API calls
 */
export function isSessionValidationDue(): boolean {
  try {
    const lastValidation = localStorage.getItem(SESSION_VALIDATION_KEY);
    if (!lastValidation) return true;
    
    const lastValidationTime = parseInt(lastValidation, 10);
    if (isNaN(lastValidationTime)) return true;
    
    const timeSinceLastValidation = Date.now() - lastValidationTime;
    const shouldValidate = timeSinceLastValidation > (5 * 60 * 1000); // 5 minutes minimum between validations
    
    console.log('🔍 Session validation frequency check:', {
      lastValidation: new Date(lastValidationTime).toISOString(),
      timeSinceLastValidation: Math.round(timeSinceLastValidation / 1000) + 's',
      shouldValidate
    });
    
    return shouldValidate;
  } catch (error) {
    console.warn('🔍 Session validation frequency check failed:', error);
    return true; // Default to validating if there's an error
  }
}

/**
 * Validates the current session state using only Supabase - optimized with frequency control
 */
export async function validateSessionState(): Promise<SessionValidationResult> {
  const result: SessionValidationResult = {
    isValid: false,
    hasMismatch: false,
    hasLocalStorage: false,
    hasSupabaseSession: false,
  };
  
  try {
    console.log('🔍 Session validation - checking Supabase session');
    
    // Check Supabase session with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session validation timeout')), 3000)
    );
    
    const sessionPromise = supabase.auth.getSession();
    
    const { data: sessionData, error: sessionError } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]) as any;
    
    if (sessionError) {
      result.errorDetails = `Session fetch error: ${sessionError.message}`;
      console.error('🔍 Session validation error:', sessionError);
      return result;
    }
    
    const hasSupabaseSession = !!sessionData.session;
    result.hasSupabaseSession = hasSupabaseSession;
    result.hasLocalStorage = false; // No longer using localStorage
    
    // Session is valid if Supabase has a session
    result.isValid = hasSupabaseSession;
    result.hasMismatch = false; // No localStorage to mismatch with
    
    // Update last validation timestamp on successful validation
    try {
      localStorage.setItem(SESSION_VALIDATION_KEY, Date.now().toString());
    } catch (error) {
      console.warn('🔍 Failed to update validation timestamp:', error);
    }
    
    console.log('🔍 Session validation result:', result);
    return result;
    
  } catch (error: any) {
    console.error('🔍 Session validation failed:', error);
    result.errorDetails = `Validation error: ${error.message}`;
    return result;
  }
}
