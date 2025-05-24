
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRetry } from '@/hooks/useRetry';
import { authCache } from '@/contexts/auth/authCache';
import { sessionPersistenceService } from '@/services/SessionPersistenceService';
import { debouncedToast } from '@/utils/debouncedToast';

interface AuthRecoveryOptions {
  maxRetries?: number;
  baseDelay?: number;
  showToasts?: boolean;
}

export const useAuthRecovery = (options: AuthRecoveryOptions = {}) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  
  const {
    maxRetries = 3,
    baseDelay = 1000,
    showToasts = true
  } = options;

  const { executeWithRetry } = useRetry({
    maxAttempts: maxRetries,
    baseDelay,
    onRetry: (attempt, error) => {
      console.log(`Auth recovery attempt ${attempt}:`, error.message);
      setRecoveryAttempts(attempt);
      
      if (showToasts) {
        debouncedToast.info(
          'Recovery in progress',
          `Attempting to restore session (attempt ${attempt}/${maxRetries})`,
          3000
        );
      }
    },
    onFailure: (error, attempts) => {
      console.error(`Auth recovery failed after ${attempts} attempts:`, error);
      
      if (showToasts) {
        debouncedToast.error(
          'Recovery failed',
          'Unable to restore your session. Please sign in again.',
          5000
        );
      }
    }
  });

  /**
   * Attempt to recover session using various strategies
   */
  const recoverSession = useCallback(async () => {
    return executeWithRetry(async () => {
      console.log('Starting auth recovery process');
      
      // Strategy 1: Try to refresh current session
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (!error && data.session) {
          sessionPersistenceService.updateSession(data.session, data.session.user);
          console.log('Recovery successful: Session refreshed');
          return { session: data.session, user: data.session.user };
        }
      } catch (error) {
        console.log('Session refresh failed, trying next strategy');
      }

      // Strategy 2: Try to get existing session
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          sessionPersistenceService.updateSession(data.session, data.session.user);
          console.log('Recovery successful: Existing session found');
          return { session: data.session, user: data.session.user };
        }
      } catch (error) {
        console.log('Get session failed, trying next strategy');
      }

      // Strategy 3: Try to use persisted session data
      try {
        const persisted = await sessionPersistenceService.initializeSession();
        if (persisted.session && persisted.user && persisted.fromCache) {
          console.log('Recovery successful: Using persisted session');
          return { session: persisted.session, user: persisted.user };
        }
      } catch (error) {
        console.log('Persisted session recovery failed');
      }

      throw new Error('All recovery strategies failed');
    });
  }, [executeWithRetry]);

  /**
   * Recover userType from cache or database
   */
  const recoverUserType = useCallback(async (userId: string) => {
    return executeWithRetry(async () => {
      // Try cache first
      const cachedUserType = authCache.getUserType(userId);
      if (cachedUserType) {
        console.log('UserType recovered from cache:', cachedUserType);
        return cachedUserType;
      }

      // Try user metadata
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user?.user_metadata?.user_type) {
        const userType = data.user.user_metadata.user_type;
        authCache.setUserType(userId, userType);
        console.log('UserType recovered from metadata:', userType);
        return userType;
      }

      // Try database query
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (!roleError && roleData) {
        authCache.setUserType(userId, roleData.role);
        console.log('UserType recovered from database:', roleData.role);
        return roleData.role;
      }

      throw new Error('Could not recover userType');
    });
  }, [executeWithRetry]);

  /**
   * Full auth state recovery
   */
  const recoverAuthState = useCallback(async () => {
    setIsRecovering(true);
    setRecoveryAttempts(0);

    try {
      const sessionResult = await recoverSession();
      
      if (sessionResult?.user?.id) {
        const userType = await recoverUserType(sessionResult.user.id);
        
        if (showToasts) {
          debouncedToast.success(
            'Session recovered',
            'Your authentication has been restored successfully.',
            3000
          );
        }
        
        return {
          session: sessionResult.session,
          user: sessionResult.user,
          userType
        };
      }
      
      throw new Error('No user found after session recovery');
    } catch (error) {
      console.error('Auth state recovery failed:', error);
      
      // Clear all auth data on complete failure
      sessionPersistenceService.clearSession();
      
      if (showToasts) {
        debouncedToast.error(
          'Recovery failed',
          'Please sign in again to continue.',
          5000
        );
      }
      
      return null;
    } finally {
      setIsRecovering(false);
      setRecoveryAttempts(0);
    }
  }, [recoverSession, recoverUserType, showToasts]);

  /**
   * Quick recovery for minor issues
   */
  const quickRecovery = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (!error && data.session) {
        sessionPersistenceService.updateSession(data.session, data.session.user);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Quick recovery failed:', error);
      return false;
    }
  }, []);

  return {
    recoverAuthState,
    recoverSession,
    recoverUserType,
    quickRecovery,
    isRecovering,
    recoveryAttempts,
    canRecover: recoveryAttempts < maxRetries
  };
};
