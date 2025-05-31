
/**
 * User-specific type guards - enhanced with discriminated unions
 */

import { isValidUserType, UserVariant, isUserVariant } from './typeGuards/coreTypeGuards';

// Re-export the enhanced user type system
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';
export type { UserVariant };

export { isValidUserType, isUserVariant };

/**
 * Safely converts any value to a UserType with fallback
 */
export const toUserType = (value: any, fallback: UserType = 'individual'): UserType => {
  if (isValidUserType(value)) {
    return value;
  }
  return fallback;
};

/**
 * Extracts userType from user metadata safely with validation
 */
export const getUserTypeFromMetadata = (userMetadata: any): UserType => {
  if (!userMetadata || typeof userMetadata !== 'object') {
    console.warn('Invalid user metadata provided:', userMetadata);
    return 'individual';
  }
  
  return toUserType(userMetadata.user_type);
};

/**
 * Extracts userType from database role safely with validation
 */
export const getUserTypeFromRole = (role: any): UserType => {
  return toUserType(role);
};

/**
 * Validates and creates a UserVariant object
 */
export const createUserVariant = (type: UserType, data: any): UserVariant | null => {
  let variant: any;
  
  switch (type) {
    case 'individual':
      variant = {
        type,
        preferences: {
          notifications: data?.preferences?.notifications ?? true
        }
      };
      break;
    case 'establishment':
      variant = {
        type,
        businessInfo: {
          hours: data?.businessInfo?.hours ?? '9AM-5PM',
          capacity: data?.businessInfo?.capacity ?? 50
        }
      };
      break;
    case 'promoter':
      variant = {
        type,
        marketing: {
          campaigns: data?.marketing?.campaigns ?? 0,
          budget: data?.marketing?.budget ?? 0
        }
      };
      break;
    case 'admin':
      variant = {
        type,
        permissions: {
          level: data?.permissions?.level ?? 'basic',
          modules: data?.permissions?.modules ?? ['dashboard']
        }
      };
      break;
    default:
      return null;
  }
  
  return isUserVariant(variant) ? variant : null;
};
