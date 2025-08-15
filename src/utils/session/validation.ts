
import { supabase } from '@/lib/supabase';
import { SessionValidationResult } from '@/types/auth';

// Constants for session validation
export const SESSION_VALIDATION_KEY = 'last_session_validation';
export const MAX_SESSION_AGE_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Simplified session validation - always validate, less complex
 */
export function isSessionValidationDue(): boolean {
  // Simplified - just return true to always validate when needed
  return true;
}

/**
 * Validates the current session state using only Supabase - simplified and timeout protected
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
    
    console.log('🔍 Session validation result:', result);
    return result;
    
  } catch (error: any) {
    console.error('🔍 Session validation failed:', error);
    result.errorDetails = `Validation error: ${error.message}`;
    return result;
  }
}
