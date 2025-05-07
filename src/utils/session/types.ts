
export interface SessionValidationResult {
  isValid: boolean;
  hasMismatch: boolean;
  hasLocalStorage: boolean;
  hasSupabaseSession: boolean;
  errorDetails?: string;
}

export interface SessionRecoveryOptions {
  forceRefresh?: boolean;
  resetLocalStorage?: boolean;
}

export type StuckStateHandler = {
  cancel: () => void;
};
