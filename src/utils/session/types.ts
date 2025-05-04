
/**
 * Types for the session management system
 */

export interface SessionValidationResult {
  isValid: boolean;
  hasMismatch: boolean;
  hasLocalStorage: boolean;
  hasSupabaseSession: boolean;
  errorDetails?: string;
}

export interface SessionRecoveryOptions {
  timeoutMs?: number;
  autoRecovery?: boolean;
}

export interface StuckStateHandler {
  cancel: () => void;
}

