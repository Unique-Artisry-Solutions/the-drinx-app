
import { supabase } from '@/lib/supabase';
import { clearAllSessions } from '@/utils/sessionCleaner';
import { isValidSession } from './helpers';

/**
 * Syncs localStorage state with Supabase session to fix mismatches
 */
export const syncSessionState = async (): Promise<boolean> => {
  try {
    console.log("Attempting to sync session state");
    // Use a typed destructuring to ensure we're handling the session properly
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session during sync:", error);
      throw error;
    }
    
    // Extract session from data to make the code clearer
    const session = data.session;
    
    if (session && isValidSession(session)) {
      console.log("Valid session found, updating localStorage");
      // We have a valid Supabase session, update localStorage
      localStorage.setItem('user_authenticated', 'true');
      
      if (session.user.email) {
        localStorage.setItem('user_email', session.user.email);
      }
      
      if (session.user.user_metadata?.user_type) {
        localStorage.setItem('user_type', session.user.user_metadata.user_type);
        console.log("Setting user_type in localStorage:", session.user.user_metadata.user_type);
      }
      
      if (session.user.user_metadata?.username) {
        localStorage.setItem('user_username', session.user.user_metadata.username);
      }
      
      console.log("Session synced from Supabase to localStorage");
      return true; // Successfully synced
    } else {
      console.log("No valid session found, clearing localStorage");
      // No valid Supabase session, clear localStorage auth data
      clearAllSessions();
      console.log("No session found, localStorage cleared");
      return false; // No session to sync
    }
  } catch (error) {
    console.error("Error syncing session state:", error);
    // On error, safer to clear sessions to avoid stuck state
    clearAllSessions();
    return false; // Failed to sync
  }
};
