
import { supabase } from '@/lib/supabase';
import { clearAllSessions } from '@/utils/sessionCleaner';

/**
 * Syncs localStorage state with Supabase session to fix mismatches
 */
export const syncSessionState = async (): Promise<boolean> => {
  try {
    // Use a typed destructuring to ensure we're handling the session properly
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    // Extract session from data to make the code clearer
    const session = data.session;
    
    if (session) {
      // We have a valid Supabase session, update localStorage
      localStorage.setItem('user_authenticated', 'true');
      if (session.user.email) {
        localStorage.setItem('user_email', session.user.email);
      }
      if (session.user.user_metadata?.user_type) {
        localStorage.setItem('user_type', session.user.user_metadata.user_type);
      }
      
      console.log("Session synced from Supabase to localStorage");
      return true; // Successfully synced
    } else {
      // No Supabase session, clear localStorage auth data
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
