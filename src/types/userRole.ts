
/**
 * Database-aligned user role types
 * This matches the actual database enum and RPC function constraints
 */

// Core switchable roles (what the database RPC function supports)
export type SwitchableUserRole = 'individual' | 'establishment' | 'promoter';

// All possible user roles (including non-switchable ones)
export type UserRole = SwitchableUserRole | 'admin';

// Type guard for switchable roles
export const isSwitchableRole = (role: string): role is SwitchableUserRole => {
  return ['individual', 'establishment', 'promoter'].includes(role);
};

// Helper to get display name for roles
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'individual':
      return 'Personal Account';
    case 'establishment':
      return 'Business Account';
    case 'promoter':
      return 'Promoter Account';
    case 'admin':
      return 'Admin Account';
    default:
      return 'Unknown Role';
  }
};
