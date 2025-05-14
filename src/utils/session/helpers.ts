
import { Session } from '@supabase/supabase-js';

/**
 * Helper function to check if a session is valid
 */
export function isValidSession(session: Session | null): boolean {
  if (!session) return false;
  
  // Check if session has expired
  if (session.expires_at) {
    const expiryTime = new Date(session.expires_at * 1000);
    if (expiryTime < new Date()) {
      console.log('Session expired at:', expiryTime);
      return false;
    }
  }
  
  return true;
}

/**
 * Helper function to check if localStorage contains valid auth data
 */
export function hasValidLocalStorage(): boolean {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  const userEmail = localStorage.getItem('user_email');
  
  return isAuthenticated && !!userEmail;
}
