
// Strict Validation Hook - Phase 9E
// Runtime validation for component props and state

import { useCallback, useMemo } from 'react';
import { TypeValidator, ValidationResult, TypeValidationError } from '@/utils/typeValidation';

export interface UseStrictValidationOptions {
  readonly enableRuntimeValidation?: boolean;
  readonly throwOnError?: boolean;
  readonly logErrors?: boolean;
}

export function useStrictValidation<T>(
  validator: TypeValidator<T>,
  options: UseStrictValidationOptions = {}
) {
  const {
    enableRuntimeValidation = process.env.NODE_ENV === 'development',
    throwOnError = false,
    logErrors = true
  } = options;

  const validate = useCallback((value: unknown): ValidationResult<T> => {
    if (!enableRuntimeValidation) {
      return {
        isValid: true,
        data: value as T,
        errors: []
      };
    }

    const result = validator.validate(value);
    
    if (!result.isValid) {
      if (logErrors) {
        console.error('Validation failed:', result.errors);
      }
      
      if (throwOnError) {
        throw new TypeValidationError(
          'validation',
          'valid data',
          'invalid data'
        );
      }
    }

    return result;
  }, [validator, enableRuntimeValidation, throwOnError, logErrors]);

  const validateAndGet = useCallback((value: unknown): T | null => {
    const result = validate(value);
    return result.isValid ? result.data || null : null;
  }, [validate]);

  const isValid = useCallback((value: unknown): boolean => {
    const result = validate(value);
    return result.isValid;
  }, [validate]);

  return useMemo(() => ({
    validate,
    validateAndGet,
    isValid
  }), [validate, validateAndGet, isValid]);
}
