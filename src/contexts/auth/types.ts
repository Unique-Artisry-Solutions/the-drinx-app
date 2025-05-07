
import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  authStable: boolean;
  authError: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (email: string, password: string, options?: {
    data?: { [key: string]: any },
    emailRedirectTo?: string
  }) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { [key: string]: any }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  // Update the return type to be Promise<boolean> to match the expected type
  recoverAuthState: () => Promise<boolean>;
};
