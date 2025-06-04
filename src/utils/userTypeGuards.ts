
/**
 * Type guards and utilities for safe userType handling
 */

export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

/**
 * Type guard to check if a string is a valid UserType
 */
export const isValidUserType = (value: any): value is UserType => {
  return typeof value === 'string' && 
    ['individual', 'establishment', 'promoter', 'admin'].includes(value);
};

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
 * Extracts userType from user metadata safely
 */
export const getUserTypeFromMetadata = (userMetadata: any): UserType => {
  return toUserType(userMetadata?.user_type);
};

/**
 * Extracts userType from database role safely
 */
export const getUserTypeFromRole = (role: any): UserType => {
  return toUserType(role);
};
