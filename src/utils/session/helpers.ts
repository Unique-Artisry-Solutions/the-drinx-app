
import { Session } from '@supabase/supabase-js';
import { MAX_SESSION_AGE_MS } from './constants';

/**
 * Checks if a session is valid based on expiry time
 */
export const isValidSession = (session: Session | null): boolean => {
  if (!session) return false;
  
  // Check if session has an expiry time
  if (!session.expires_at) return false;
  
  // Convert expires_at (which is in seconds) to milliseconds for comparison
  const expiryTime = session.expires_at * 1000;
  const currentTime = Date.now();
  
  // Session is valid if it hasn't expired yet
  return expiryTime > currentTime;
};

/**
 * Check if localStorage has valid authentication flags
 */
export const hasValidLocalStorage = (): boolean => {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  const userEmail = localStorage.getItem('user_email');
  
  // Basic check: if authenticated flag is set, we should have an email
  return isAuthenticated && !!userEmail;
};

/**
 * Log detailed session information for debugging
 */
export const logSessionDetails = (session: Session | null, source: string): void => {
  if (!session) {
    console.log(`[Session Debug] ${source}: No session found`);
    return;
  }
  
  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown';
  const timeToExpiry = session.expires_at ? 
    Math.floor((session.expires_at * 1000 - Date.now()) / 1000 / 60) : 
    'unknown';
  
  console.log(`[Session Debug] ${source}:`, {
    userId: session.user?.id,
    email: session.user?.email,
    expiresAt,
    timeToExpiry: `${timeToExpiry} minutes`,
    isValid: isValidSession(session)
  });
};
