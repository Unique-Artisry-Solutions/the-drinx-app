
// Phase 3 Alternative: Enhanced Auth Hook (Optional Migration)
// Components can opt-in to this enhanced version while existing hooks continue to work

import { useCompatibleAuth } from '@/services/compatibility/AuthCompatibilityWrapper';
import { authMigrationUtils } from '@/services/migration/ServiceMigrationUtils';
import { safeTypeConverters } from '@/utils/typeEnhancements';

export interface EnhancedAuthOptions {
  enableLogging?: boolean;
  enableTypeValidation?: boolean;
  enableMigrationTracking?: boolean;
}

export function useEnhancedAuth(options: EnhancedAuthOptions = {}) {
  const compatAuth = useCompatibleAuth();
  
  // Enhanced features with safe defaults
  const enhancedAuth = {
    ...compatAuth,
    
    // Enhanced type-safe accessors
    safeUserType: safeTypeConverters.toUserType(compatAuth.userType),
    safeIsAuthenticated: safeTypeConverters.toBoolean(compatAuth.isAuthenticated, false),
    safeIsLoading: safeTypeConverters.toBoolean(compatAuth.isLoading, true),
    
    // Enhanced actions with validation
    safeSignIn: async (email: string, password: string) => {
      const safeEmail = safeTypeConverters.toString(email).trim();
      const safePassword = safeTypeConverters.toString(password);
      
      if (!safeEmail || !safePassword) {
        throw new Error('Email and password are required');
      }
      
      return compatAuth.actions.signIn(safeEmail, safePassword);
    },
    
    // Helper methods
    hasPermission: (permission: string) => {
      return compatAuth.isAuthenticated && compatAuth.userType === 'admin';
    },
    
    canAccess: (userType: string) => {
      return compatAuth.isAuthenticated && compatAuth.userType === userType;
    }
  };
  
  // Optional migration tracking
  if (options.enableMigrationTracking && process.env.NODE_ENV === 'development') {
    authMigrationUtils.suggestMigration('useEnhancedAuth', 'enhanced pattern');
  }
  
  return enhancedAuth;
}

// Backward compatibility: Export as both named and default
export default useEnhancedAuth;
