
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { authCache } from '@/contexts/auth/authCache';

/**
 * Service for managing session persistence and reducing auth checks
 */
export class SessionPersistenceService {
  private static instance: SessionPersistenceService;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private readonly SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly STORAGE_KEY = 'spiritless-session-persistence';

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
   * Enhanced session storage with metadata
   */
  private persistSessionData(session: Session | null, user: User | null): void {
    const sessionData = {
      session: session ? {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        user_id: session.user.id
      } : null,
      user: user ? {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        email_confirmed_at: user.email_confirmed_at
      } : null,
      timestamp: Date.now(),
      version: '1.0'
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to persist session data:', error);
    }
  }

  /**
   * Load persisted session data
   */
  private loadPersistedSession(): { session: Session | null; user: User | null } | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const sessionData = JSON.parse(stored);
      
      // Check if data is recent (within 24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - sessionData.timestamp > maxAge) {
        this.clearPersistedSession();
        return null;
      }

      return {
        session: sessionData.session,
        user: sessionData.user
      };
    } catch (error) {
      console.warn('Failed to load persisted session:', error);
      this.clearPersistedSession();
      return null;
    }
  }

  /**
   * Clear persisted session data
   */
  private clearPersistedSession(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear persisted session:', error);
    }
  }

  /**
   * Initialize session with persistence
   */
  public async initializeSession(): Promise<{
    session: Session | null;
    user: User | null;
    fromCache: boolean;
  }> {
    // First try to get current session from Supabase
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (!error && data.session) {
        this.persistSessionData(data.session, data.session.user);
        
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

    // Fallback to persisted session
    const persisted = this.loadPersistedSession();
    if (persisted?.session && persisted?.user) {
      return {
        session: persisted.session as Session,
        user: persisted.user as User,
        fromCache: true
      };
    }

    return {
      session: null,
      user: null,
      fromCache: false
    };
  }

  /**
   * Update session persistence
   */
  public updateSession(session: Session | null, user: User | null): void {
    this.persistSessionData(session, user);
    
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
    this.clearPersistedSession();
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
          console.log('Periodic check: No valid session, clearing persistence');
          this.clearSession();
        } else {
          console.log('Periodic check: Session valid, updating persistence');
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
