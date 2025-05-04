
import { supabase } from '@/lib/supabase';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { validateSessionState } from './validation';
import { StuckStateHandler } from './types';
import { DEFAULT_STUCK_TIMEOUT_MS } from './constants';
import { showRecoveryToast, showStuckStateToast } from '@/utils/toast/toastAdapter';

/**
 * Recovers from a stuck authentication state
 */
export const recoverFromStuckState = async (): Promise<boolean> => {
  console.log("Attempting to recover from stuck auth state");
  
  try {
    // First try to sign out globally to clear any problematic sessions
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear all localStorage session data
    clearAllSessions();
    
    // Clear the Supabase storage item explicitly
    localStorage.removeItem('spiritless-auth-storage');
    
    // Show a toast notification using our adapter
    showRecoveryToast();
    
    // Force a page reload to ensure clean state
    window.location.href = '/landing';
    return true;
  } catch (error) {
    console.error("Error recovering from stuck state:", error);
    
    // Even if there's an error, we'll still redirect to ensure user isn't stuck
    window.location.href = '/landing';
    return false;
  }
};

/**
 * Handles a potential stuck loading state with optional autoRecovery
 * @param timeoutMs - Time in ms before considering the app stuck (default: 8 seconds)
 * @param autoRecovery - Whether to attempt automatic recovery
 */
export const handlePotentialStuckState = (
  timeoutMs = DEFAULT_STUCK_TIMEOUT_MS, 
  autoRecovery = false
): StuckStateHandler => {
  console.log(`Setting stuck state detection (${timeoutMs}ms timeout)`);
  
  const timeoutId = setTimeout(async () => {
    const validationResult = await validateSessionState();
    console.log("Potential stuck state detected, validation:", validationResult);
    
    if (validationResult.hasMismatch || !validationResult.isValid) {
      if (autoRecovery) {
        await recoverFromStuckState();
      } else {
        // Show a stuck state toast using our adapter
        showStuckStateToast();
      }
    }
  }, timeoutMs);
  
  return {
    cancel: () => {
      clearTimeout(timeoutId);
      console.log("Stuck state detection cancelled");
    }
  };
};
