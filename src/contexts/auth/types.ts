
import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  authStable: boolean;
  authError?: Error | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, options?: {
    data?: { [key: string]: any },
    emailRedirectTo?: string
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { [key: string]: any }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  recoverAuthState: () => Promise<void>;
};
