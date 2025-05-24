
import { validateSessionState } from './validation';
import { StuckStateHandler } from '@/types/AuthTypes';
import { DEFAULT_STUCK_TIMEOUT_MS } from './constants';
import { toastService } from '@/services/ToastService';
import { supabase } from '@/lib/supabase';

/**
 * Recovers from a stuck authentication state using only Supabase
 */
export const recoverFromStuckState = async (): Promise<boolean> => {
  console.log("Attempting to recover from stuck auth state");
  
  try {
    // Sign out to clear any problematic sessions
    await supabase.auth.signOut({ scope: 'global' });
    
    toastService.info("Session reset", "Your session has been reset. Please sign in again.", {
      action: {
        label: "Refresh Now",
        onClick: () => window.location.reload(),
        altText: "Refresh Now"
      }
    });
    
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
 */
export const handlePotentialStuckState = (
  timeoutMs = DEFAULT_STUCK_TIMEOUT_MS, 
  autoRecovery = false
): StuckStateHandler => {
  console.log(`Setting stuck state detection (${timeoutMs}ms timeout)`);
  
  const timeoutId = setTimeout(async () => {
    const validationResult = await validateSessionState();
    console.log("Potential stuck state detected, validation:", validationResult);
    
    if (!validationResult.isValid) {
      if (autoRecovery) {
        await recoverFromStuckState();
      } else {
        toastService.info("Loading issue detected", "The application seems to be stuck. Click to refresh.", {
          action: {
            label: "Refresh Now",
            onClick: () => window.location.reload(),
            altText: "Refresh Now"
          },
          duration: 0 // Don't auto-dismiss
        });
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
