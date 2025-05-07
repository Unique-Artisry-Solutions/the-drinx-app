
/**
 * Types for the session management system
 */

/**
 * Interface for session validation result
 */
export interface SessionValidationResult {
  isValid: boolean;
  hasMismatch: boolean;
  hasLocalStorage: boolean;
  hasSupabaseSession: boolean;
  errorDetails?: string;
}

/**
 * Interface for session recovery options
 */
export interface SessionRecoveryOptions {
  timeoutMs?: number;
  autoRecovery?: boolean;
  silent?: boolean;
  redirectPath?: string;
}

/**
 * Interface for stuck state handler
 */
export interface StuckStateHandler {
  cancel: () => void;
}
