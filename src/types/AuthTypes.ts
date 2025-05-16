
import { User, Session } from '@supabase/supabase-js';

/**
 * Central definition for authentication-related types
 */

export interface AuthContextState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  authStable: boolean;
  authError: Error | null;
}

export interface AuthContextValue extends AuthContextState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<boolean>;
}

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
