
import { sessionManager } from './SessionManager';
import { validateSessionState } from './validation';
import { StuckStateHandler } from '@/types/AuthTypes';
import { DEFAULT_STUCK_TIMEOUT_MS } from './constants';
import { toastService } from '@/services/ToastService';

/**
 * Recovers from a stuck authentication state
 */
export const recoverFromStuckState = async (): Promise<boolean> => {
  return sessionManager.recoverFromStuckState();
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
        // Show a stuck state toast
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
