
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
  timeoutMs?: number;
}

export const useAuthRecovery = (options: AuthRecoveryOptions = {}) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const [recoveryError, setRecoveryError] = useState<Error | null>(null);
  
  const {
    maxRetries = 3,
    baseDelay = 1000,
    showToasts = true,
    timeoutMs = 15000
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
      setRecoveryError(error);
      
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
   * Attempt to recover session using various strategies with timeout
   */
  const recoverSession = useCallback(async () => {
    return Promise.race([
      executeWithRetry(async () => {
        console.log('Starting session recovery process');
        
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
      }),
      // Timeout promise
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Recovery timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      })
    ]);
  }, [executeWithRetry, timeoutMs]);

  /**
   * Recover userType from cache or database with timeout
   */
  const recoverUserType = useCallback(async (userId: string) => {
    return Promise.race([
      executeWithRetry(async () => {
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
      }),
      // Timeout promise
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`UserType recovery timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      })
    ]);
  }, [executeWithRetry, timeoutMs]);

  /**
   * Full auth state recovery with comprehensive error handling
   */
  const recoverAuthState = useCallback(async () => {
    setIsRecovering(true);
    setRecoveryAttempts(0);
    setRecoveryError(null);

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
      setRecoveryError(error as Error);
      
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
   * Quick recovery for minor issues with timeout
   */
  const quickRecovery = useCallback(async () => {
    try {
      const recoveryPromise = supabase.auth.refreshSession().then(({ data, error }) => {
        if (!error && data.session) {
          sessionPersistenceService.updateSession(data.session, data.session.user);
          return true;
        }
        return false;
      });
      
      // Add timeout to quick recovery
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Quick recovery timeout')), 5000);
      });
      
      return await Promise.race([recoveryPromise, timeoutPromise]);
    } catch (error) {
      console.warn('Quick recovery failed:', error);
      return false;
    }
  }, []);

  /**
   * Reset recovery state
   */
  const resetRecoveryState = useCallback(() => {
    setRecoveryAttempts(0);
    setRecoveryError(null);
    setIsRecovering(false);
  }, []);

  /**
   * Check if recovery is possible
   */
  const canRecover = useCallback(() => {
    return recoveryAttempts < maxRetries && !isRecovering;
  }, [recoveryAttempts, maxRetries, isRecovering]);

  return {
    recoverAuthState,
    recoverSession,
    recoverUserType,
    quickRecovery,
    resetRecoveryState,
    isRecovering,
    recoveryAttempts,
    recoveryError,
    canRecover: canRecover(),
    maxRetries
  };
};
