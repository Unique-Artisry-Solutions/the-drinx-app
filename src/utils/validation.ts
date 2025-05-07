
import { isNonEmptyString, isValidNumber, exists } from './typeGuards';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Base validator interface
 */
export interface Validator<T> {
  validate(data: T): ValidationResult;
}

/**
 * User profile validator implementation
 */
export class UserProfileValidator implements Validator<any> {
  validate(profile: any): ValidationResult {
    const errors: string[] = [];
    
    if (!exists(profile)) {
      errors.push('Profile data is missing');
      return { isValid: false, errors };
    }
    
    if (!isNonEmptyString(profile.id)) {
      errors.push('Profile ID is required');
    }
    
    if (profile.user_type && !['individual', 'establishment', 'promoter', 'admin'].includes(profile.user_type)) {
      errors.push('Invalid user type');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Event data validator implementation
 */
export class EventValidator implements Validator<any> {
  validate(event: any): ValidationResult {
    const errors: string[] = [];
    
    if (!exists(event)) {
      errors.push('Event data is missing');
      return { isValid: false, errors };
    }
    
    if (!isNonEmptyString(event.name)) {
      errors.push('Event name is required');
    }
    
    if (!isNonEmptyString(event.date)) {
      errors.push('Event date is required');
    }
    
    if (!isNonEmptyString(event.time)) {
      errors.push('Event time is required');
    }
    
    if (event.capacity && !isValidNumber(event.capacity)) {
      errors.push('Event capacity must be a valid number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Create a validator factory to get appropriate validators
 */
export const createValidator = (type: string): Validator<any> => {
  switch (type) {
    case 'userProfile':
      return new UserProfileValidator();
    case 'event':
      return new EventValidator();
    default:
      throw new Error(`Validator not implemented for type: ${type}`);
  }
};

/**
 * Helper function for quick validation
 */
export const validateData = <T>(type: string, data: T): ValidationResult => {
  try {
    const validator = createValidator(type);
    return validator.validate(data);
  } catch (error) {
    return {
      isValid: false,
      errors: [`Validation error: ${(error as Error).message}`]
    };
  }
};
