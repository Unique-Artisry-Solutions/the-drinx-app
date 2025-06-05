// Consolidated Services Index - Phase 9C + Phase 3 Alternative
// Single entry point for all service modules with enhanced compatibility

// Core services (existing - unchanged)
export { NotificationService } from './NotificationService';

// Admin services (existing - unchanged)
export { SimplifiedAdminService } from './admin/SimplifiedAdminService';
export type { 
  AdminUser, 
  AdminEstablishment, 
  AdminCocktail,
  SimpleQueryParams,
  SimpleResponse 
} from './admin/SimplifiedAdminService';

// Legacy compatibility exports (existing - unchanged)
export * from './admin';

// Phase 3 Alternative: New standardized interfaces (additive only)
export type { 
  StandardServiceInterface,
  StandardServiceConfig,
  StandardServiceMetrics,
  StandardServiceHealth,
  ServiceWrapper
} from './interfaces/StandardServiceInterface';

// Phase 3 Alternative: Compatibility layer (additive only)
export { 
  useCompatibleAuth,
  type CompatibleAuthState,
  type CompatibleAuthActions,
  type CompatibleAuthReturn
} from './compatibility/AuthCompatibilityWrapper';

// Phase 3 Alternative: Isolated service registry (additive only)
export { isolatedServiceRegistry } from './registry/IsolatedServiceRegistry';

// Phase 3 Alternative: Migration utilities (additive only)
export {
  authMigrationUtils,
  serviceMigrationUtils,
  typeMigrationUtils,
  migrationStatusChecker
} from './migration/ServiceMigrationUtils';

// Phase 3 Alternative: Enhanced type utilities (additive only)
export {
  safeTypeGuards,
  safeTypeConverters,
  safeValidation
} from '../utils/typeEnhancements';
