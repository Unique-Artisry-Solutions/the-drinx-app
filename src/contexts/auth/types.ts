
import { User, Session } from '@supabase/supabase-js';

/**
 * User type extending Supabase User with additional properties
 */
export interface AuthUser extends User {
  // Additional properties for authenticated users can be added here
  email_confirmed_at?: string | null;
}

/**
 * Auth context state and methods
 */
export interface AuthContextType {
  // State
  session: Session | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  isVerificationEmailSent: boolean;
  authError: Error | null;
  authStable: boolean;
  
  // Methods
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (formData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<boolean>;
  sendVerificationEmail: (email: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}
