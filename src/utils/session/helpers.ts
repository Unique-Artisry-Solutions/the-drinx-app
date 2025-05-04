
import { Session } from '@supabase/supabase-js';

/**
 * Safely checks if a supabase session exists and is valid
 * Returns a boolean that TypeScript can properly infer
 */
export const isValidSession = (session: Session | null | undefined): boolean => {
  return !!session && !!session.user;
};

/**
 * Safely extracts session data with proper type checking
 */
export const getSessionData = (session: Session | null | undefined) => {
  if (!isValidSession(session)) {
    return {
      exists: false,
      userId: null,
      userEmail: null,
      expiresAt: null
    };
  }
  
  return {
    exists: true,
    userId: session.user?.id,
    userEmail: session.user?.email,
    expiresAt: session.expires_at
  };
};
