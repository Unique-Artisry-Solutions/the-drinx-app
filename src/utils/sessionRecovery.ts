
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { clearAllSessions } from '@/utils/sessionCleaner';

const SESSION_VALIDATION_KEY = 'last_session_validation';
const MAX_SESSION_AGE_MS = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Checks if there's a mismatch between localStorage state and Supabase session
 */
export const validateSessionState = async (): Promise<{ 
  isValid: boolean; 
  hasMismatch: boolean;
  hasLocalStorage: boolean;
  hasSupabaseSession: boolean;
  errorDetails?: string;
}> => {
  try {
    // Check localStorage state
    const userAuthenticated = localStorage.getItem('user_authenticated') === 'true';
    const userType = localStorage.getItem('user_type');
    const userEmail = localStorage.getItem('user_email');
    
    // Directly check Supabase session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Log state for debugging
    console.log("Session validation:", {
      localStorage: { userAuthenticated, userType, userEmail },
      supabaseSession: !!session,
      sessionUserId: session?.user?.id,
      sessionUserEmail: session?.user?.email
    });

    // Set last validation time
    localStorage.setItem(SESSION_VALIDATION_KEY, Date.now().toString());
    
    // Check for actual mismatch conditions
    const hasMismatch = (userAuthenticated && !session) || 
                        (!userAuthenticated && session) ||
                        (userEmail && session?.user?.email && userEmail !== session.user.email);

    return {
      isValid: !hasMismatch && !error,
      hasMismatch,
      hasLocalStorage: userAuthenticated,
      hasSupabaseSession: !!session,
      errorDetails: error ? error.message : undefined
    };
  } catch (error) {
    console.error("Error validating session:", error);
    return {
      isValid: false,
      hasMismatch: true,
      hasLocalStorage: false,
      hasSupabaseSession: false,
      errorDetails: error instanceof Error ? error.message : 'Unknown session validation error'
    };
  }
};

/**
 * Syncs localStorage state with Supabase session to fix mismatches
 */
export const syncSessionState = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    if (session) {
      // We have a valid Supabase session, update localStorage
      localStorage.setItem('user_authenticated', 'true');
      if (session.user.email) {
        localStorage.setItem('user_email', session.user.email);
      }
      if (session.user.user_metadata?.user_type) {
        localStorage.setItem('user_type', session.user.user_metadata.user_type);
      }
      
      console.log("Session synced from Supabase to localStorage");
      return true;
    } else {
      // No Supabase session, clear localStorage auth data
      clearAllSessions();
      console.log("No session found, localStorage cleared");
      return false;
    }
  } catch (error) {
    console.error("Error syncing session state:", error);
    // On error, safer to clear sessions to avoid stuck state
    clearAllSessions();
    return false;
  }
};

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
    
    toast({
      title: "Session reset",
      description: "Your session has been reset. Please sign in again.",
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
 * @param timeoutMs - Time in ms before considering the app stuck (default: 8 seconds)
 * @param autoRecovery - Whether to attempt automatic recovery
 */
export const handlePotentialStuckState = (
  timeoutMs = 8000, 
  autoRecovery = false
): { cancel: () => void } => {
  console.log(`Setting stuck state detection (${timeoutMs}ms timeout)`);
  
  const timeoutId = setTimeout(async () => {
    const validationResult = await validateSessionState();
    console.log("Potential stuck state detected, validation:", validationResult);
    
    if (validationResult.hasMismatch || !validationResult.isValid) {
      if (autoRecovery) {
        await recoverFromStuckState();
      } else {
        toast({
          title: "Loading issue detected",
          description: "The application seems to be stuck. Click to refresh.",
          action: {
            label: "Refresh Now",
            onClick: () => window.location.reload()
          },
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

/**
 * Checks if the session validation is due (not performed recently)
 */
export const isSessionValidationDue = (): boolean => {
  const lastValidation = localStorage.getItem(SESSION_VALIDATION_KEY);
  if (!lastValidation) return true;
  
  const lastValidationTime = parseInt(lastValidation, 10);
  const timeSinceValidation = Date.now() - lastValidationTime;
  
  // Validate after certain time has passed
  return timeSinceValidation > (1000 * 60 * 30); // 30 minutes
};
