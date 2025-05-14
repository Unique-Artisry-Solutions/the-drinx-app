
import { supabase } from '@/lib/supabase';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { SessionValidationResult } from '@/types/auth';

/**
 * Simplified session validation that doesn't reject if admin auth is active
 */
export const validateSessionState = async (): Promise<SessionValidationResult> => {
  // Check for admin authentication first
  const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
  
  if (isAdminAuth) {
    // If admin is authenticated, return valid state for admin session
    return {
      isValid: true,
      hasMismatch: false,
      hasLocalStorage: true,
      hasSupabaseSession: false // Admin doesn't use Supabase session
    };
  }
  
  // For non-admin authentication, proceed with normal validation
  try {
    console.log('Validating session state...');
    
    // Check localStorage flags
    const hasLocalStorageAuth = localStorage.getItem('user_authenticated') === 'true';
    
    // Check Supabase session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return {
        isValid: false,
        hasMismatch: false,
        hasLocalStorage: hasLocalStorageAuth,
        hasSupabaseSession: false,
        errorDetails: `Session fetch error: ${sessionError.message}`
      };
    }
    
    const hasSupabaseSession = !!sessionData.session;
    
    // Detect mismatches
    const hasMismatch = (hasLocalStorageAuth && !hasSupabaseSession) || 
                        (!hasLocalStorageAuth && hasSupabaseSession);
    
    return {
      isValid: !hasMismatch,
      hasMismatch,
      hasLocalStorage: hasLocalStorageAuth,
      hasSupabaseSession,
      errorDetails: hasMismatch ? "Session mismatch detected" : undefined
    };
    
  } catch (error: any) {
    return {
      isValid: false,
      hasMismatch: false,
      hasLocalStorage: false,
      hasSupabaseSession: false,
      errorDetails: `Validation error: ${error.message}`
    };
  }
};

/**
 * Simplified session sync that handles admin auth differently
 */
export const syncSessionState = async (): Promise<boolean> => {
  // Check for admin auth
  const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
  
  if (isAdminAuth) {
    // For admin auth, just return true as it's already in sync
    return true;
  }
  
  try {
    console.log("Attempting to sync session state");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    const session = data.session;
    
    if (session) {
      // Update localStorage with session data
      localStorage.setItem('user_authenticated', 'true');
      
      if (session.user.email) {
        localStorage.setItem('user_email', session.user.email);
      }
      
      if (session.user.user_metadata?.user_type) {
        localStorage.setItem('user_type', session.user.user_metadata.user_type);
      }
      
      console.log("Session synced from Supabase to localStorage");
      return true; // Successfully synced
    } else {
      // No valid Supabase session, clear localStorage auth data
      clearAllSessions();
      console.log("No session found, localStorage cleared");
      return false; // No session to sync
    }
  } catch (error) {
    console.error("Error syncing session state:", error);
    // On error, safer to clear sessions to avoid stuck state
    clearAllSessions();
    return false; // Failed to sync
  }
};
