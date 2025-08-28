/**
 * **PHASE 1 FIX**: DevBypass session recovery utilities
 * Helps sync auth context after DevBypass authentication
 */

import { supabase } from '@/integrations/supabase/client';

const DEV_AUTO_LOGIN_TIMESTAMP_KEY = 'dev_auto_login_timestamp';
const DEV_AUTO_LOGIN_USER_TYPE_KEY = 'dev_auto_login_user_type';
const SESSION_RECOVERY_WINDOW_MS = 5000; // 5 seconds

/**
 * Check if we should attempt session recovery based on DevBypass activity
 */
export const shouldAttemptSessionRecovery = (): boolean => {
  try {
    const timestamp = localStorage.getItem(DEV_AUTO_LOGIN_TIMESTAMP_KEY);
    const userType = localStorage.getItem(DEV_AUTO_LOGIN_USER_TYPE_KEY);
    
    if (!timestamp || !userType) {
      return false;
    }
    
    const loginTime = parseInt(timestamp, 10);
    const timeSinceLogin = Date.now() - loginTime;
    
    // Only attempt recovery if login happened very recently
    const shouldRecover = timeSinceLogin <= SESSION_RECOVERY_WINDOW_MS;
    
    console.log('🔐 SessionRecovery - Should attempt recovery:', {
      userType,
      loginTime,
      timeSinceLogin,
      shouldRecover
    });
    
    return shouldRecover;
  } catch (error) {
    console.warn('🔐 SessionRecovery - Error checking recovery status:', error);
    return false;
  }
};

/**
 * Attempt to recover DevBypass session by checking Supabase directly
 */
export const recoverDevBypassSession = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔐 SessionRecovery - Attempting DevBypass session recovery');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('🔐 SessionRecovery - Session fetch error:', error);
      return { success: false, error: error.message };
    }
    
    if (session?.user) {
      console.log('🔐 SessionRecovery - Session recovery successful:', {
        userId: session.user.id,
        email: session.user.email,
        userType: session.user.user_metadata?.user_type
      });
      
      return { success: true };
    } else {
      console.log('🔐 SessionRecovery - No session found during recovery');
      return { success: false, error: 'No session found' };
    }
  } catch (error: any) {
    console.error('🔐 SessionRecovery - Recovery error:', error);
    return { success: false, error: error.message || 'Unknown recovery error' };
  }
};

/**
 * Clear DevBypass recovery markers
 */
export const clearDevBypassRecovery = (): void => {
  try {
    localStorage.removeItem(DEV_AUTO_LOGIN_TIMESTAMP_KEY);
    localStorage.removeItem(DEV_AUTO_LOGIN_USER_TYPE_KEY);
    console.log('🔐 SessionRecovery - Cleared DevBypass recovery markers');
  } catch (error) {
    console.warn('🔐 SessionRecovery - Error clearing recovery markers:', error);
  }
};