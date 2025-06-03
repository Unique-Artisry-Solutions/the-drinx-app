
// Unified service exports - Phase 8C consolidation COMPLETED
// Primary entry point for all application services

// Import utilities and registry first to avoid circular dependencies
import { ServiceUtils, type ServiceResponse, type ServiceOptions } from './ServiceUtils';
import { serviceRegistry, type ServiceDependencies } from './ServiceRegistry';
import { serviceConfig } from './ServiceConfig';

// Core services - primary exports
export { supabase } from '@/lib/supabase';

// Service management exports
export { serviceRegistry, type ServiceDependencies } from './ServiceRegistry';
export { serviceConfig } from './ServiceConfig';
export { ServiceUtils, type ServiceResponse, type ServiceOptions } from './ServiceUtils';

// Unified service groups - Phase 8C COMPLETED
export { UnifiedPromotionalService as PromotionalService } from './promotional';
export { UnifiedAnalyticsService as AnalyticsService } from './UnifiedAnalyticsService';
export { UnifiedEventService as EventService } from './UnifiedEventService';
export { UnifiedPaymentService as PaymentService } from './UnifiedPaymentService';
export { UnifiedMobileService as MobileService } from './UnifiedMobileService';
export { SimplifiedAdminService as AdminService } from './admin/SimplifiedAdminService';

// Individual services for direct access
export { NotificationService } from './NotificationService';
export { DevAuthService } from './DevAuthService';
export { toastService } from './ToastService';
export { subscriptionAdapter } from './SubscriptionAdapter';

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

/** @deprecated Use EventService.updateEventStatus instead */
export { updateEventStatus } from './eventService';
/** @deprecated Use EventService.adaptToABTestingData instead */
export { adaptToABTestingData } from './eventAdapterService';
/** @deprecated Use EventService access token methods instead */
export { 
  generateEventAccessToken, 
  verifyEventAccessToken, 
  getCurrentEventToken 
} from './eventAccessService';

// Service initialization helper
export const initializeServices = async (): Promise<ServiceResponse> => {
  try {
    await serviceRegistry.initialize();
    return ServiceUtils.success({ message: 'All services initialized successfully' });
  } catch (error) {
    console.error('Failed to initialize services:', error);
    return ServiceUtils.error(error instanceof Error ? error.message : 'Service initialization failed');
  }
};

// Service health check
export const checkServiceHealth = async (): Promise<ServiceResponse> => {
  try {
    const health = await serviceRegistry.healthCheck();
    return ServiceUtils.success(health);
  } catch (error) {
    console.error('Service health check failed:', error);
    return ServiceUtils.error(error instanceof Error ? error.message : 'Health check failed');
  }
};

// Service discovery utilities
export const getServicesByCategory = (category: 'core' | 'analytics' | 'promotional' | 'mobile') => {
  return serviceRegistry.getServicesByCategory(category);
};

export const getServiceMetadata = () => {
  return serviceRegistry.getServiceMetadata();
};
