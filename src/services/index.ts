
// Unified service exports - Phase 8C consolidation
// Primary entry point for all application services

// Service management
export { serviceRegistry, type ServiceDependencies } from './ServiceRegistry';
export { serviceConfig } from './ServiceConfig';
export { ServiceUtils, type ServiceResponse, type ServiceOptions } from './ServiceUtils';

// Core services - primary exports
export { supabase } from '@/lib/supabase';

// Unified service groups
export { UnifiedPromotionalService as PromotionalService } from './promotional';
export { SimplifiedAdminService as AdminService } from './admin/SimplifiedAdminService';

// Individual services
export { updateEventStatus } from './eventService';
export { adaptToABTestingData } from './eventAdapterService';
export { 
  generateEventAccessToken, 
  verifyEventAccessToken, 
  getCurrentEventToken 
} from './eventAccessService';
export { subscriptionAdapter } from './SubscriptionAdapter';
export { NotificationService } from './NotificationService';
export { DevAuthService } from './DevAuthService';
export { toastService } from './ToastService';

// Legacy exports for backward compatibility - marked as deprecated
/** @deprecated Use serviceRegistry.getService('admin') or AdminService instead */
export { 
  BaseAdminService,
  AdminEstablishmentsService, 
  establishmentsService,
  AdminCocktailsService, 
  cocktailsService,
  AdminUsersService, 
  usersService,
  type QueryParams,
  type PaginatedResponse,
  type CreateDTO,
  type UpdateDTO,
  type BulkUpdateDTO,
  type SearchParams,
  type FilterParams,
  type AdminEstablishment,
  type AdminCocktail,
  type AdminUser
} from './admin';

// Service initialization helper
export const initializeServices = async () => {
  try {
    await serviceRegistry.initialize();
    return ServiceUtils.success({ message: 'All services initialized successfully' });
  } catch (error) {
    console.error('Failed to initialize services:', error);
    return ServiceUtils.error(error instanceof Error ? error.message : 'Service initialization failed');
  }
};

// Service health check
export const checkServiceHealth = async () => {
  try {
    const health = await serviceRegistry.healthCheck();
    return ServiceUtils.success(health);
  } catch (error) {
    console.error('Service health check failed:', error);
    return ServiceUtils.error(error instanceof Error ? error.message : 'Health check failed');
  }
};
