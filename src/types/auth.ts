
/**
 * Centralized authentication types - Single source of truth
 */

// Core user type definition that includes all possible user types
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin' | null;

// Non-null user type for components that require authentication
export type AuthenticatedUserType = 'individual' | 'establishment' | 'promoter' | 'admin';

// User types that can be used in regular navigation (excluding admin)
export type StandardUserType = 'individual' | 'establishment' | 'promoter';

// Type guards for safe user type checking
export const isValidUserType = (value: any): value is AuthenticatedUserType => {
  return typeof value === 'string' && 
    ['individual', 'establishment', 'promoter', 'admin'].includes(value);
};

export const isStandardUserType = (value: any): value is StandardUserType => {
  return typeof value === 'string' && 
    ['individual', 'establishment', 'promoter'].includes(value);
};

// Utility to convert admin user type to standard user type for components that don't handle admin
export const toStandardUserType = (userType: UserType): StandardUserType => {
  if (userType === 'admin') return 'individual';
  return userType || 'individual';
};

// Utility to safely get display name for any user type
export const getUserTypeDisplayName = (userType: UserType): string => {
  switch (userType) {
    case 'individual':
      return 'Personal Account';
    case 'establishment':
      return 'Business Account';
    case 'promoter':
      return 'Promoter Account';
    case 'admin':
      return 'Admin Account';
    default:
      return 'Guest';
  }
};
