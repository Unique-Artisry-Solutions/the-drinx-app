
// Consolidated Services Index - Phase 3: Standardized Services
// Single entry point for all standardized service modules

// Import standardized services
export { NotificationService } from './NotificationService';
export { SimplifiedAdminService } from './admin/SimplifiedAdminService';
export { UnifiedPromotionalService } from './promotional';
export { standardSubscriptionService } from './StandardSubscriptionService';

// Export service interfaces
export type { 
  StandardServiceConfig,
  StandardServiceMethods,
  ServiceResponse 
} from './interfaces/StandardService';

export { BaseStandardService } from './interfaces/StandardService';

// Export service registry
export { serviceRegistry } from './ServiceRegistry';
export type { ServiceMetrics, ServiceHealthStatus } from './ServiceRegistry';

// Utility function to get all registered services
export const getAllServices = () => {
  return serviceRegistry.getAllServices();
};

// Utility function to check if all core services are healthy
export const checkCoreServicesHealth = async () => {
  const healthStatuses = await serviceRegistry.getServiceHealth();
  const unhealthyServices = healthStatuses.filter(status => status.status === 'error');
  
  return {
    allHealthy: unhealthyServices.length === 0,
    unhealthyServices: unhealthyServices.map(s => s.serviceName),
    healthReport: healthStatuses
  };
};
