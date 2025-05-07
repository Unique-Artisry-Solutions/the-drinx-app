
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { validateSessionState } from '@/utils/session/validation';
import { SessionValidationResult, SessionRecoveryOptions, StuckStateHandler } from '@/types/auth';

/**
 * Centralized service for authentication operations
 */
export class AuthService {
  private static instance: AuthService;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Check session validity
   */
  public async validateSession(): Promise<SessionValidationResult> {
    try {
      return await validateSessionState();
    } catch (error) {
      console.error('Error validating session:', error);
      return {
        isValid: false,
        hasMismatch: true,
        hasLocalStorage: false,
        hasSupabaseSession: false,
        errorDetails: (error as Error).message
      };
    }
  }

  /**
   * Sync localStorage state with Supabase session
   */
  public async syncSessionState(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      const session = data.session;
      
      if (session) {
        // Update localStorage with session data
        localStorage.setItem('user_authenticated', 'true');
        if (session.user.email) {
          localStorage.setItem('user_email', session.user.email);
        }
        if (session.user.user_metadata?.user_type) {
          localStorage.setItem('user_type', session.user.user_metadata.user_type);
        }
        
        console.log("Session synced from Supabase to localStorage");
        return true;
      } else {
        // Clear localStorage auth data if no session exists
        this.clearSessionData();
        console.log("No session found, localStorage cleared");
        return false;
      }
    } catch (error) {
      console.error("Error syncing session state:", error);
      // On error, safer to clear sessions to avoid stuck state
      this.clearSessionData();
      return false;
    }
  }

  /**
   * Clear all session data from localStorage
   */
  public clearSessionData(): void {
    clearAllSessions();
  }

  /**
   * Recover from a stuck authentication state
   */
  public recoverFromStuckState(options: SessionRecoveryOptions = {}): Promise<boolean> {
    return new Promise(async (resolve) => {
      console.log("Attempting to recover from stuck auth state");
      
      try {
        // First try to sign out globally
        await supabase.auth.signOut({ scope: 'global' });
        
        // Clear all localStorage session data
        this.clearSessionData();
        
        // Clear Supabase storage explicitly
        localStorage.removeItem('spiritless-auth-storage');
        
        if (!options.silent) {
          toast({
            title: "Session reset",
            description: "Your session has been reset. Please sign in again.",
            action: {
              label: "Refresh Now",
              onClick: () => window.location.reload(),
              altText: "Refresh the page now"
            }
          });
        }
        
        // Handle timeout if specified
        const timeoutId = options.timeoutMs
          ? setTimeout(() => {
              window.location.href = '/landing';
              resolve(true);
            }, options.timeoutMs)
          : null;
        
        // Allow for cancellation
        const handler: StuckStateHandler = {
          cancel: () => {
            if (timeoutId) clearTimeout(timeoutId);
            resolve(false);
          }
        };
        
        // Auto recovery redirects immediately
        if (options.autoRecovery) {
          if (timeoutId) clearTimeout(timeoutId);
          window.location.href = '/landing';
          resolve(true);
        }
        
        return handler;
      } catch (error) {
        console.error("Error recovering from stuck state:", error);
        
        // Even if there's an error, redirect to ensure user isn't stuck
        window.location.href = '/landing';
        resolve(false);
      }
    });
  }

  /**
   * Updates the local storage based on user data
   */
  public updateLocalStorage(user: User | null): void {
    if (user) {
      localStorage.setItem('user_authenticated', 'true');
      if (user.email) {
        localStorage.setItem('user_email', user.email);
      }
      if (user.user_metadata?.user_type) {
        localStorage.setItem('user_type', user.user_metadata.user_type);
      }
      if (user.user_metadata?.username) {
        localStorage.setItem('user_username', user.user_metadata.username);
      }
    } else {
      // No active user, clear localStorage auth items (except admin)
      if (localStorage.getItem('user_authenticated')) {
        localStorage.removeItem('user_authenticated');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_username');
      }
    }
  }

  /**
   * Sign in with email and password
   */
  public async signIn(email: string, password: string): Promise<{
    error: Error | null;
    user: User | null;
    session: Session | null;
  }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (data.user && !data.user.email_confirmed_at) {
        throw new Error('Email not verified. Please check your email and verify your account.');
      }
      
      this.updateLocalStorage(data.user);
      
      return {
        error: null,
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      return {
        error,
        user: null,
        session: null
      };
    }
  }

  /**
   * Sign up a new user
   */
  public async signUp(
    email: string, 
    password: string, 
    options?: { data?: Record<string, any>; emailRedirectTo?: string }
  ): Promise<{
    error: Error | null;
    user: User | null;
    session: Session | null;
  }> {
    try {
      const baseUrl = window.location.origin;
      const finalRedirectTo = options?.emailRedirectTo || `${baseUrl}/?email_confirmed=true`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data,
          emailRedirectTo: finalRedirectTo
        }
      });
      
      if (error) throw error;
      
      return {
        error: null,
        user: data.user,
        session: data.session
      };
    } catch (error: any) {
      return {
        error,
        user: null,
        session: null
      };
    }
  }

  /**
   * Sign out the current user
   */
  public async signOut(): Promise<{ error: Error | null }> {
    try {
      // First clear all auth-related localStorage items
      this.clearSessionData();
      
      // Use scope: 'global' to terminate all sessions across devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  /**
   * Reset password for email
   */
  public async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }

  /**
   * Refresh the current session
   */
  public async refreshSession(): Promise<{
    session: Session | null;
    user: User | null;
    isEmailVerified: boolean;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      const isVerified = data.session?.user ? (data.session.user.email_confirmed_at !== null) : false;
      
      if (data.session?.user) {
        this.updateLocalStorage(data.session.user);
      }
      
      return {
        session: data.session,
        user: data.session?.user || null,
        isEmailVerified: isVerified,
        error: null
      };
    } catch (error: any) {
      return {
        session: null,
        user: null,
        isEmailVerified: false,
        error
      };
    }
  }
}

// Export a singleton instance
export const authService = AuthService.getInstance();
