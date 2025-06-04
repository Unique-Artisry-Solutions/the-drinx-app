
// Consolidated Services Index - Phase 9C
// Single entry point for all service modules

// Core services
export { NotificationService } from './NotificationService';

// Admin services (simplified)
export { SimplifiedAdminService } from './admin/SimplifiedAdminService';
export type { 
  AdminUser, 
  AdminEstablishment, 
  AdminCocktail,
  SimpleQueryParams,
  SimpleResponse 
} from './admin/SimplifiedAdminService';

// Legacy compatibility exports
export * from './admin';
