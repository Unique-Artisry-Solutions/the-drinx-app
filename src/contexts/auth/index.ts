
/**
 * Primary authentication exports
 * This file serves as the main export point for authentication functionality
 */

// Export all types
export type { AuthUser, AuthContextType } from './types';

// Export the provider and hook from the consolidated implementation
export { AuthProvider, useAuth } from './AuthProvider';
