
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

// **PHASE 4 FIX**: Simplified session validation to avoid interference
export async function validateSessionState(): Promise<SessionValidationResult> {
  console.log("🔍 Starting simplified session validation");
  
  try {
    const { data, error } = await supabase.auth.getSession();
    const hasSupabaseSession = !!(data?.session?.user);
    
    // Update validation timestamp
    localStorage.setItem(SESSION_VALIDATION_KEY, Date.now().toString());

    const result: SessionValidationResult = {
      isValid: hasSupabaseSession && !error,
      hasMismatch: false,
      hasLocalStorage: false,
      hasSupabaseSession,
      errorDetails: error?.message
    };
    
    console.log("🔍 Simplified session validation result:", result);
    return result;
  } catch (error: any) {
    console.error("🔍 Session validation failed:", error);
    
    return {
      isValid: false,
      hasMismatch: false,
      hasLocalStorage: false,
      hasSupabaseSession: false,
      errorDetails: error?.message || 'Validation failed'
    };
  }
}
