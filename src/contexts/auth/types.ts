
/**
 * Authentication context and provider types
 */
import { User } from '@supabase/supabase-js';

export interface AuthState {
  session: any | null;
  user: User | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  isVerificationEmailSent: boolean;
  isEmailError: boolean;
  error: Error | null;
  userRole: 'admin' | 'user' | 'guest' | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, redirectTo?: string) => Promise<any>;
  signOut: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateUserProfile: (data: Record<string, any>) => Promise<void>;
}
