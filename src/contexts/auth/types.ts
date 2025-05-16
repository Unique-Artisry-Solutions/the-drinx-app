
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  isVerificationEmailSent?: boolean;
  authError: Error | null;
  authStable: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (formData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<boolean>;
  sendVerificationEmail?: (email: string) => Promise<void>;
  updateUserProfile?: (data: any) => Promise<void>;
  updatePassword?: (newPassword: string) => Promise<void>;
}
