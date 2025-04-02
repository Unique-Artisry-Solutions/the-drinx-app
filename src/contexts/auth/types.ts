
import { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: { 
    data?: { [key: string]: any },
    emailRedirectTo?: string 
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { [key: string]: any }) => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  resetPassword: (email: string) => Promise<void>;
};
