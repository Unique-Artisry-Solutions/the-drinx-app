
import { Session } from '@supabase/supabase-js';

export interface SessionValidationResult {
  isValid: boolean;
  hasMismatch: boolean;
  hasLocalStorage: boolean;
  hasSupabaseSession: boolean;
  errorDetails?: string;
}

export interface SessionRecoveryOptions {
  silent?: boolean;
  redirectPath?: string;
}

export interface StuckStateHandler {
  cancel: () => void;
}
