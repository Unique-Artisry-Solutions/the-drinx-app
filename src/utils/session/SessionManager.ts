
import { supabase } from '@/lib/supabase';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { validateSessionState } from './validation';
import { SessionValidationResult, SessionRecoveryOptions } from '@/types/AuthTypes';
import { toastService } from '@/services/ToastService';

/**
 * Manages and synchronizes session state across localStorage and Supabase
 */
class SessionManager {
  private static instance: SessionManager;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Syncs localStorage state with Supabase session to fix mismatches
   */
  public async syncSessionState(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      const session = data.session;
      
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
        return true; // Successfully synced
      } else {
        // No Supabase session, clear localStorage auth data
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
  }

  /**
   * Validates the current session state
   */
  public async validateSession(): Promise<SessionValidationResult> {
    return await validateSessionState();
  }

  /**
   * Recovers from a stuck authentication state
   */
  public async recoverFromStuckState(options: SessionRecoveryOptions = {}): Promise<boolean> {
    console.log("Attempting to recover from stuck auth state");
    
    try {
      // First try to sign out globally to clear any problematic sessions
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all localStorage session data
      clearAllSessions();
      
      // Clear the Supabase storage item explicitly
      localStorage.removeItem('spiritless-auth-storage');
      
      if (!options.silent) {
        // Show a toast notification
        toastService.info("Session reset", "Your session has been reset. Please sign in again.", {
          action: {
            label: "Refresh Now",
            onClick: () => window.location.reload(),
            altText: "Refresh Now"
          }
        });
      }
      
      // Force a page reload to ensure clean state
      window.location.href = options.redirectPath || '/landing';
      return true;
    } catch (error) {
      console.error("Error recovering from stuck state:", error);
      
      // Even if there's an error, we'll still redirect to ensure user isn't stuck
      window.location.href = options.redirectPath || '/landing';
      return false;
    }
  }

  /**
   * Sets session validation timestamp
   */
  public markSessionValidated(): void {
    localStorage.setItem('session_last_validated', Date.now().toString());
  }

  /**
   * Checks if session validation is due
   */
  public isSessionValidationDue(intervalMs = 5 * 60 * 1000): boolean {
    const lastValidation = localStorage.getItem('session_last_validated');
    if (!lastValidation) return true;
    
    const lastValidationTime = parseInt(lastValidation, 10);
    const timeSinceValidation = Date.now() - lastValidationTime;
    
    return timeSinceValidation > intervalMs;
  }
}

// Export a singleton instance
export const sessionManager = SessionManager.getInstance();
