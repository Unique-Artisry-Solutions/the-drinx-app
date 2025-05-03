
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  authStable: boolean; // New property to track stable auth state
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, options?: {
    data?: { [key: string]: any },
    emailRedirectTo?: string
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { [key: string]: any }) => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  resetPassword: (email: string) => Promise<void>;
}
