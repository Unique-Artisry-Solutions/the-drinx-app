
import { supabase } from '@/integrations/supabase/client';

// Validate the current session state
export const validateSessionState = async () => {
  try {
    // Check localStorage flags
    const hasLocalStorageAuth = localStorage.getItem('user_authenticated') === 'true';
    
    // Check Supabase session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      return { 
        hasMismatch: true, 
        message: error.message 
      };
    }
    
    const hasSupabaseSession = !!data.session;
    
    // Detect mismatches
    if (hasLocalStorageAuth && !hasSupabaseSession) {
      console.warn('Session mismatch: User marked as authenticated in localStorage but no valid Supabase session');
      return { 
        hasMismatch: true, 
        message: "User marked as authenticated in localStorage but no valid Supabase session" 
      };
    }
    
    if (!hasLocalStorageAuth && hasSupabaseSession) {
      console.warn('Session mismatch: Valid Supabase session exists but user not authenticated in localStorage');
      return { 
        hasMismatch: true, 
        message: "Valid Supabase session exists but user not authenticated in localStorage" 
      };
    }
    
    // Email mismatch check
    if (hasSupabaseSession && data.session?.user) {
      const authEmail = localStorage.getItem('user_email');
      
      if (authEmail && data.session.user.email !== authEmail) {
        console.warn('Session mismatch: Email mismatch between localStorage and Supabase session');
        return { 
          hasMismatch: true, 
          message: "Email mismatch between localStorage and Supabase session" 
        };
      }
    }
    
    // If we're here, session state is valid
    return { 
      hasMismatch: false, 
      message: "Session state is valid" 
    };
  } catch (error: any) {
    console.error('Unexpected error during session validation:', error);
    return { 
      hasMismatch: true, 
      message: `Validation error: ${error.message}` 
    };
  }
};

// Synchronize localStorage state with Supabase session
export const syncSessionState = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session during sync:", error);
      throw error;
    }
    
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
      localStorage.removeItem('user_authenticated');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_type');
      console.log("No session found, localStorage cleared");
      return false; // No session to sync
    }
  } catch (error) {
    console.error("Error syncing session state:", error);
    // On error, safer to clear sessions to avoid stuck state
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_type');
    return false; // Failed to sync
  }
};
