
import { User, Session } from '@supabase/supabase-js';

export type AuthChangeEvent = 
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  authStable: boolean;
  authError: Error | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
  refreshSession: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  recoverAuthState: () => Promise<boolean>;
}
