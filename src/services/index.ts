
// Unified service exports - Phase 9B: Legacy removal completed
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

// Unified service groups - Phase 9B COMPLETED
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
