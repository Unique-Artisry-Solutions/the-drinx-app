
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
