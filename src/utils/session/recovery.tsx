
import React from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { validateSessionState } from './validation';
import { StuckStateHandler } from './types';
import { DEFAULT_STUCK_TIMEOUT_MS } from './constants';
import { isValidSession } from './helpers';

/**
 * Recovers from a stuck authentication state with JSX toast
 */
export const recoverFromStuckStateJsx = async (): Promise<boolean> => {
  console.log("Attempting to recover from stuck auth state (JSX version)");
  
  try {
    // First try to sign out globally to clear any problematic sessions
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear all localStorage session data
    clearAllSessions();
    
    // Clear the Supabase storage item explicitly
    localStorage.removeItem('spiritless-auth-storage');
    
    toast({
      title: "Session reset",
      description: "Your session has been reset. Please sign in again.",
      action: (
        <ToastAction 
          onClick={() => window.location.reload()} 
          altText="Refresh Now"
        >
          Refresh Now
        </ToastAction>
      )
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
 * Handles a potential stuck loading state with optional autoRecovery (JSX version)
 * @param timeoutMs - Time in ms before considering the app stuck (default: 8 seconds)
 * @param autoRecovery - Whether to attempt automatic recovery
 */
export const handlePotentialStuckStateJsx = (
  timeoutMs = DEFAULT_STUCK_TIMEOUT_MS, 
  autoRecovery = false
): StuckStateHandler => {
  console.log(`Setting stuck state detection (${timeoutMs}ms timeout) - JSX version`);
  
  const timeoutId = setTimeout(async () => {
    const validationResult = await validateSessionState();
    console.log("Potential stuck state detected, validation:", validationResult);
    
    if (validationResult.hasMismatch || !validationResult.isValid) {
      if (autoRecovery) {
        await recoverFromStuckStateJsx();
      } else {
        toast({
          title: "Loading issue detected",
          description: "The application seems to be stuck. Click to refresh.",
          action: (
            <ToastAction 
              onClick={() => window.location.reload()} 
              altText="Refresh Now"
            >
              Refresh Now
            </ToastAction>
          ),
          duration: 0, // Won't dismiss automatically
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

// Re-export the non-JSX functions as the primary ones for backward compatibility
export { recoverFromStuckState, handlePotentialStuckState } from './recovery';
