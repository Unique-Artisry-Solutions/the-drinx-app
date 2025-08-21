import { useState, useEffect, useCallback, useRef } from 'react';
import { validateSessionState, isSessionValidationDue } from '@/utils/session/validation';
import { handlePotentialStuckState } from '@/utils/session/recovery';
import type { StuckStateHandler } from '@/types/auth';

interface SessionStabilityState {
  isStable: boolean;
  lastValidation: Date | null;
  validationCount: number;
  isValidating: boolean;
  errors: string[];
}

/**
 * Hook for monitoring and maintaining session stability
 * Prevents random refreshes and loading issues
 */
export const useSessionStability = () => {
  const [state, setState] = useState<SessionStabilityState>({
    isStable: true,
    lastValidation: null,
    validationCount: 0,
    isValidating: false,
    errors: []
  });

  const stuckStateHandlerRef = useRef<StuckStateHandler | null>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateSession = useCallback(async () => {
    if (state.isValidating) {
      console.log('🔍 Session validation already in progress, skipping');
      return;
    }

    if (!isSessionValidationDue()) {
      console.log('🔍 Session validation not due, skipping');
      return;
    }

    setState(prev => ({ ...prev, isValidating: true }));

    try {
      console.log('🔍 Starting session stability validation');
      const result = await validateSessionState();
      
      setState(prev => ({
        ...prev,
        isStable: result.isValid,
        lastValidation: new Date(),
        validationCount: prev.validationCount + 1,
        isValidating: false,
        errors: result.errorDetails ? [result.errorDetails] : []
      }));

      if (!result.isValid) {
        console.warn('🔍 Session instability detected:', result);
        
        // Start stuck state detection if session is invalid
        if (stuckStateHandlerRef.current) {
          stuckStateHandlerRef.current.cancel();
        }
        
        stuckStateHandlerRef.current = handlePotentialStuckState(8000, false);
      }

    } catch (error: any) {
      console.error('🔍 Session validation error:', error);
      setState(prev => ({
        ...prev,
        isStable: false,
        isValidating: false,
        errors: [...prev.errors, error.message]
      }));
    }
  }, [state.isValidating]);

  const scheduleValidation = useCallback(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Schedule next validation in 10 minutes
    validationTimeoutRef.current = setTimeout(() => {
      validateSession();
    }, 10 * 60 * 1000);
  }, [validateSession]);

  const forceValidation = useCallback(() => {
    // Clear validation due check temporarily
    localStorage.removeItem('last_session_validation');
    validateSession();
  }, [validateSession]);

  // Initialize session stability monitoring
  useEffect(() => {
    console.log('🔍 Initializing session stability monitoring');
    validateSession();
    scheduleValidation();

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      if (stuckStateHandlerRef.current) {
        stuckStateHandlerRef.current.cancel();
      }
    };
  }, []);

  // Schedule next validation after each validation
  useEffect(() => {
    if (state.lastValidation) {
      scheduleValidation();
    }
  }, [state.lastValidation, scheduleValidation]);

  return {
    ...state,
    validateSession: forceValidation,
    isMonitoring: validationTimeoutRef.current !== null
  };
};