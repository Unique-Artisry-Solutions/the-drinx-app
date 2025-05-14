
import { Session, User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

export interface AuthState {
  session: Session | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  isVerificationEmailSent: boolean;
  authError: Error | null;
  authStable: boolean;
}

export interface AuthActions {
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (formData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  recoverAuthState: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export interface AuthContextType extends AuthState, AuthActions {}
