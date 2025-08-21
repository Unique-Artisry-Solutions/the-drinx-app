/**
 * Enhanced session recovery utilities for DevBypass authentication issues
 */

import { supabase } from '@/lib/supabase';
import { validateSessionState } from '@/utils/session/validation';

export interface SessionRecoveryResult {
  success: boolean;
  error?: string;
  recoveryActions?: string[];
}

/**
 * **PHASE 1 FIX**: Comprehensive session recovery for DevBypass issues
 */
export const recoverDevBypassSession = async (): Promise<SessionRecoveryResult> => {
  console.log('🔧 SessionRecovery - Starting DevBypass session recovery');
  
  const recoveryActions: string[] = [];
  
  try {
    // Step 1: Check current session state
    console.log('🔧 SessionRecovery - Step 1: Checking current session state');
    const sessionValidation = await validateSessionState();
    recoveryActions.push('Validated current session state');
    
    console.log('🔧 SessionRecovery - Session validation result:', sessionValidation);
    
    // Step 2: Check for DevBypass state mismatch
    const devUserType = localStorage.getItem('dev_auto_login_user_type');
    const devTimestamp = localStorage.getItem('dev_auto_login_timestamp');
    
    console.log('🔧 SessionRecovery - DevBypass state:', {
      devUserType,
      devTimestamp,
      timeSinceLogin: devTimestamp ? Date.now() - parseInt(devTimestamp) : null
    });
    
    // Step 3: Direct session check with Supabase
    const { data: currentSession, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('🔧 SessionRecovery - Session error:', sessionError);
      recoveryActions.push(`Session error: ${sessionError.message}`);
    }
    
    console.log('🔧 SessionRecovery - Direct session check:', {
      hasSession: !!currentSession?.session,
      hasUser: !!currentSession?.session?.user,
      userId: currentSession?.session?.user?.id,
      userEmail: currentSession?.session?.user?.email
    });
    
    // Step 4: Check for authentication state mismatch
    const hasDevState = !!(devUserType && devTimestamp);
    const hasSupabaseSession = !!(currentSession?.session?.user);
    
    if (hasDevState && !hasSupabaseSession) {
      console.warn('🔧 SessionRecovery - Auth state mismatch detected: DevBypass state exists but no Supabase session');
      recoveryActions.push('Detected auth state mismatch');
      
      // Step 5: Attempt to re-authenticate using DevBypass credentials
      if (devUserType) {
        console.log('🔧 SessionRecovery - Attempting re-authentication');
        const reAuthResult = await attemptReAuthentication(devUserType);
        recoveryActions.push(...reAuthResult.recoveryActions || []);
        
        if (reAuthResult.success) {
          console.log('🔧 SessionRecovery - Re-authentication successful');
          return {
            success: true,
            recoveryActions: [...recoveryActions, 'Re-authentication successful']
          };
        } else {
          console.error('🔧 SessionRecovery - Re-authentication failed:', reAuthResult.error);
          recoveryActions.push(`Re-authentication failed: ${reAuthResult.error}`);
        }
      }
    } else if (hasSupabaseSession) {
      console.log('🔧 SessionRecovery - Supabase session exists, recovery not needed');
      return {
        success: true,
        recoveryActions: [...recoveryActions, 'Session already valid']
      };
    }
    
    // Step 6: If all else fails, clear state and redirect
    console.warn('🔧 SessionRecovery - Recovery failed, clearing state');
    localStorage.removeItem('dev_auto_login_user_type');
    localStorage.removeItem('dev_auto_login_timestamp');
    recoveryActions.push('Cleared corrupted DevBypass state');
    
    return {
      success: false,
      error: 'Unable to recover session, state cleared',
      recoveryActions
    };
    
  } catch (error: any) {
    console.error('🔧 SessionRecovery - Exception during recovery:', error);
    return {
      success: false,
      error: `Recovery exception: ${error.message}`,
      recoveryActions: [...recoveryActions, `Exception: ${error.message}`]
    };
  }
};

/**
 * **PHASE 1 FIX**: Attempt re-authentication using stored DevBypass credentials
 */
const attemptReAuthentication = async (userType: string): Promise<SessionRecoveryResult> => {
  console.log(`🔧 SessionRecovery - Attempting re-authentication for ${userType}`);
  
  try {
    // Import credentials dynamically to avoid circular dependencies
    const { TEST_CREDENTIALS } = await import('@/components/auth/constants/testUsers');
    const credentials = TEST_CREDENTIALS[userType as keyof typeof TEST_CREDENTIALS];
    
    if (!credentials) {
      return {
        success: false,
        error: `No credentials found for user type: ${userType}`,
        recoveryActions: [`Failed to find credentials for ${userType}`]
      };
    }
    
    console.log(`🔧 SessionRecovery - Using credentials for ${userType}:`, { email: credentials.email });
    
    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      return {
        success: false,
        error: `Re-authentication failed: ${error.message}`,
        recoveryActions: [`Sign in error: ${error.message}`]
      };
    }
    
    if (data.user && data.session) {
      console.log(`🔧 SessionRecovery - Re-authentication successful for ${userType}`);
      
      // Update timestamp
      localStorage.setItem('dev_auto_login_timestamp', Date.now().toString());
      
      return {
        success: true,
        recoveryActions: [`Re-authenticated as ${userType}`, 'Updated timestamp']
      };
    }
    
    return {
      success: false,
      error: 'Re-authentication failed - no user or session returned',
      recoveryActions: ['Sign in did not return user/session']
    };
    
  } catch (error: any) {
    return {
      success: false,
      error: `Re-authentication exception: ${error.message}`,
      recoveryActions: [`Exception during re-auth: ${error.message}`]
    };
  }
};

/**
 * **PHASE 1 FIX**: Check if session recovery is needed
 */
export const shouldAttemptSessionRecovery = (): boolean => {
  const devUserType = localStorage.getItem('dev_auto_login_user_type');
  const devTimestamp = localStorage.getItem('dev_auto_login_timestamp');
  
  // Only attempt recovery if DevBypass state exists
  if (!devUserType || !devTimestamp) {
    return false;
  }
  
  // Check if the DevBypass login is recent (within 5 minutes)
  const timeSinceLogin = Date.now() - parseInt(devTimestamp);
  const fiveMinutes = 5 * 60 * 1000;
  
  if (timeSinceLogin > fiveMinutes) {
    console.log('🔧 SessionRecovery - DevBypass state is stale, clearing');
    localStorage.removeItem('dev_auto_login_user_type');
    localStorage.removeItem('dev_auto_login_timestamp');
    return false;
  }
  
  return true;
};