/**
 * **PHASE 3 FIX**: Enhanced message system hook with authentication debugging and RLS policy validation
 */

import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { MessageThread, UserType } from './types'; 
import { useMessageSystem } from './useMessageSystem';

interface AuthenticatedMessageSystemState {
  threads: MessageThread[];
  loading: boolean;
  error: string | null;
  authError: string | null;
  debugInfo: {
    hasAuth: boolean;
    userId: string | null;
    userType: string | null;
    sessionValid: boolean;
    lastAuthCheck: number;
  };
}

export const useAuthenticatedMessageSystem = (userType: UserType) => {
  const { user, session, isAuthenticated, authStable } = useAuthenticatedUser();
  const [authError, setAuthError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    hasAuth: false,
    userId: null as string | null,
    userType: null as string | null,
    sessionValid: false,
    lastAuthCheck: 0
  });

  // **PHASE 3 FIX**: Enhanced auth validation for message system
  const validateAuthentication = useCallback(async () => {
    console.log('🔧 AuthenticatedMessageSystem - Validating authentication');
    
    try {
      // Direct session check
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('🔧 AuthenticatedMessageSystem - Session error:', sessionError);
        setAuthError(`Session error: ${sessionError.message}`);
        return false;
      }

      const hasValidSession = !!(sessionData?.session?.user);
      
      setDebugInfo({
        hasAuth: isAuthenticated,
        userId: user?.id || null,
        userType: user?.user_metadata?.user_type || null,
        sessionValid: hasValidSession,
        lastAuthCheck: Date.now()
      });

      console.log('🔧 AuthenticatedMessageSystem - Auth validation result:', {
        isAuthenticated,
        userId: user?.id,
        userEmail: user?.email,
        sessionValid: hasValidSession,
        sessionUserId: sessionData?.session?.user?.id,
        userType
      });

      if (!hasValidSession) {
        const errorMsg = 'No valid Supabase session found';
        console.error('🔧 AuthenticatedMessageSystem - ' + errorMsg);
        setAuthError(errorMsg);
        return false;
      }

      if (!isAuthenticated) {
        const errorMsg = 'User not authenticated in auth context';
        console.error('🔧 AuthenticatedMessageSystem - ' + errorMsg);
        setAuthError(errorMsg);
        return false;
      }

      setAuthError(null);
      return true;
    } catch (error: any) {
      console.error('🔧 AuthenticatedMessageSystem - Auth validation error:', error);
      setAuthError(`Auth validation error: ${error.message}`);
      return false;
    }
  }, [user, isAuthenticated, userType]);

  // **PHASE 3 FIX**: Test RLS policies
  const testRLSPolicies = useCallback(async () => {
    if (!user?.id) return;

    console.log('🔧 AuthenticatedMessageSystem - Testing RLS policies');
    
    try {
      // Test basic thread access
      const { data: threadData, error: threadError } = await supabase
        .from('promoter_venue_threads')
        .select('*')
        .limit(1);

      console.log('🔧 AuthenticatedMessageSystem - RLS test result:', {
        threadData: threadData?.length || 0,
        threadError: threadError?.message,
        userId: user.id
      });

      if (threadError) {
        console.error('🔧 AuthenticatedMessageSystem - RLS policy error:', threadError);
        setAuthError(`Database access error: ${threadError.message}`);
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('🔧 AuthenticatedMessageSystem - RLS test error:', error);
      setAuthError(`RLS test error: ${error.message}`);
      return false;
    }
  }, [user?.id]);

  // Initialize authentication validation
  useEffect(() => {
    if (authStable && user) {
      validateAuthentication().then(isValid => {
        if (isValid) {
          testRLSPolicies();
        }
      });
    }
  }, [authStable, user, validateAuthentication, testRLSPolicies]);

  // Use the standard message system if authentication is valid
  const messageSystemResult = useMessageSystem(userType);

  // **PHASE 4 FIX**: Return enhanced state with authentication debugging
  const enhancedState: AuthenticatedMessageSystemState & typeof messageSystemResult = {
    ...messageSystemResult,
    authError,
    debugInfo
  };

  return enhancedState;
};