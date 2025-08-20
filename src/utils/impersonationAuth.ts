import { supabase } from '@/lib/supabase';
import { getImpersonationState, isImpersonating } from './impersonationSimplified';

/**
 * Impersonation-aware authentication utilities
 * Ensures that during impersonation, we get the correct user ID for operations
 */

export interface AuthResult {
  userId: string | null;
  isImpersonating: boolean;
  error?: string;
  debugInfo?: any;
}

/**
 * Get the current effective user ID, considering impersonation
 * During impersonation, this returns the impersonated user's ID
 * During normal operation, returns the actual user's ID
 */
export async function getCurrentUserId(): Promise<AuthResult> {
  try {
    const impersonationActive = isImpersonating();
    const impersonationState = getImpersonationState();
    
    console.log('🔍 getCurrentUserId - Impersonation check:', {
      isImpersonating: impersonationActive,
      hasBackup: !!impersonationState.backup,
      targetEmail: impersonationState.targetEmail
    });

    // Get current session/user from Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    const debugInfo = {
      impersonationActive,
      sessionExists: !!sessionData.session,
      sessionUserId: sessionData.session?.user?.id,
      sessionUserEmail: sessionData.session?.user?.email,
      userExists: !!userData.user,
      userId: userData.user?.id,
      userEmail: userData.user?.email,
      backupUserId: impersonationState.backup?.user_id,
      backupEmail: impersonationState.backup?.email,
      targetEmail: impersonationState.targetEmail
    };

    console.log('🔍 getCurrentUserId - Auth state:', debugInfo);

    // Check for authentication errors
    if (sessionError || userError) {
      console.error('❌ Authentication error:', { sessionError, userError });
      return {
        userId: null,
        isImpersonating: impersonationActive,
        error: sessionError?.message || userError?.message || 'Authentication failed',
        debugInfo
      };
    }

    // During impersonation, the current session should contain the impersonated user
    // If we have a valid session, use the user from that session
    let effectiveUserId: string | null = null;

    if (sessionData.session?.user?.id) {
      effectiveUserId = sessionData.session.user.id;
      console.log('✅ Using session user ID:', effectiveUserId);
    } else if (userData.user?.id) {
      effectiveUserId = userData.user.id;
      console.log('✅ Using auth user ID:', effectiveUserId);
    }

    if (!effectiveUserId) {
      console.error('❌ No user ID found in session or auth');
      return {
        userId: null,
        isImpersonating: impersonationActive,
        error: 'No authenticated user found',
        debugInfo
      };
    }

    // If we're impersonating, verify that we're not getting the admin user ID
    if (impersonationActive && impersonationState.backup) {
      if (effectiveUserId === impersonationState.backup.user_id) {
        console.warn('⚠️ Getting admin user ID during impersonation - this might be wrong');
        // Don't fail, but log for debugging
      } else {
        console.log('✅ Getting impersonated user ID (different from admin)');
      }
    }

    return {
      userId: effectiveUserId,
      isImpersonating: impersonationActive,
      debugInfo
    };

  } catch (error: any) {
    console.error('❌ getCurrentUserId failed:', error);
    return {
      userId: null,
      isImpersonating: false,
      error: error.message || 'Unknown error getting user ID',
      debugInfo: { error: error.message }
    };
  }
}

/**
 * Verify that we have proper authentication for the current context
 * Throws descriptive errors if authentication is not available
 */
export async function requireAuthentication(): Promise<string> {
  const authResult = await getCurrentUserId();
  
  if (!authResult.userId) {
    const errorMsg = authResult.error || 'User not authenticated';
    console.error('❌ Authentication required but not available:', {
      error: errorMsg,
      isImpersonating: authResult.isImpersonating,
      debugInfo: authResult.debugInfo
    });
    throw new Error(errorMsg);
  }

  console.log('✅ Authentication verified:', {
    userId: authResult.userId,
    isImpersonating: authResult.isImpersonating
  });

  return authResult.userId;
}