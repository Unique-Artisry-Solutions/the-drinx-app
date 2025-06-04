
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { authCache } from '@/contexts/auth/authCache';

/**
 * Service for managing session persistence using only Supabase and cache
 */
export class SessionPersistenceService {
  private static instance: SessionPersistenceService;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private readonly SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.startPeriodicSessionCheck();
  }

  public static getInstance(): SessionPersistenceService {
    if (!SessionPersistenceService.instance) {
      SessionPersistenceService.instance = new SessionPersistenceService();
    }
    return SessionPersistenceService.instance;
  }

  /**
   * Initialize session from Supabase only
   */
  public async initializeSession(): Promise<{
    session: Session | null;
    user: User | null;
    fromCache: boolean;
  }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (!error && data.session) {
        // Cache user type if available
        if (data.session.user?.user_metadata?.user_type) {
          authCache.setUserType(
            data.session.user.id, 
            data.session.user.user_metadata.user_type
          );
        }
        
        return {
          session: data.session,
          user: data.session.user,
          fromCache: false
        };
      }
    } catch (error) {
      console.warn('Failed to get current session:', error);
    }

    return {
      session: null,
      user: null,
      fromCache: false
    };
  }

  /**
   * Update session cache
   */
  public updateSession(session: Session | null, user: User | null): void {
    if (user?.id) {
      // Cache session validity
      authCache.setSessionValid(user.id, !!session);
      
      // Cache user type if available
      if (user.user_metadata?.user_type) {
        authCache.setUserType(user.id, user.user_metadata.user_type);
      }
    }
  }

  /**
   * Clear all session data
   */
  public clearSession(): void {
    authCache.clear();
  }

  /**
   * Start periodic session validation
   */
  private startPeriodicSessionCheck(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    this.sessionCheckInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          console.log('Periodic check: No valid session, clearing cache');
          this.clearSession();
        } else {
          console.log('Periodic check: Session valid, updating cache');
          this.updateSession(data.session, data.session.user);
        }
      } catch (error) {
        console.warn('Periodic session check failed:', error);
      }
    }, this.SESSION_CHECK_INTERVAL);
  }

  /**
   * Stop periodic session checking
   */
  public stopPeriodicCheck(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  /**
   * Check if session needs refresh
   */
  public needsRefresh(session: Session | null): boolean {
    if (!session?.expires_at) return false;
    
    // Refresh if expires within next 5 minutes
    const fiveMinutes = 5 * 60; // 5 minutes in seconds
    const expiresAt = session.expires_at;
    const currentTime = Math.floor(Date.now() / 1000);
    
    return (expiresAt - currentTime) < fiveMinutes;
  }
}

export const sessionPersistenceService = SessionPersistenceService.getInstance();
