
import { User, Session } from '@supabase/supabase-js';

/**
 * Core authentication state interface
 */
export interface AuthState {
  /**
   * The current authenticated user, if any
   */
  user: User | null;
  
  /**
   * The current authentication session, if any
   */
  session: Session | null;
  
  /**
   * Indicates if authentication is in progress
   */
  isLoading: boolean;
  
  /**
   * Indicates if the user's email has been verified
   */
  isEmailVerified: boolean;
  
  /**
   * Indicates if the auth system has stabilized (finished initial loading)
   */
  authStable: boolean;
  
  /**
   * Any authentication error that occurred
   */
  authError: Error | null;

  /**
   * Indicates if the user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Indicates if verification email has been sent
   */
  isVerificationEmailSent: boolean;
}

/**
 * Authentication actions interface
 */
export interface AuthActions {
  /**
   * Sign in with email and password
   */
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  
  /**
   * Register a new user
   */
  signUp: (formData: any) => Promise<any>;
  
  /**
   * Sign out the current user
   */
  signOut: () => Promise<void>;
  
  /**
   * Refresh the current session
   */
  refreshSession: () => Promise<{ isEmailVerified: boolean }>;
  
  /**
   * Attempt to recover from a stuck authentication state
   */
  recoverAuthState: () => Promise<boolean>;

  /**
   * Send verification email to the user
   */
  sendVerificationEmail: (email: string) => Promise<void>;
  
  /**
   * Update user profile data
   */
  updateUserProfile: (data: any) => Promise<void>;
  
  /**
   * Update user password
   */
  updatePassword: (newPassword: string) => Promise<void>;
}

/**
 * Combined interface for auth context
 */
export interface AuthContextType extends AuthState, AuthActions {}

/**
 * Type for login provider options
 */
export type LoginProvider = 'email' | 'google' | 'facebook' | 'twitter';
