
// Services Index - Updated for Phase 9D Service Migration Completion

// Service Registry (primary export)
export { serviceRegistry, type ServiceHealthStatus, type ServiceMetrics } from './ServiceRegistry';
export { ServiceProxy } from './ServiceProxy';

// Primary exports from consolidated services
export * from './consolidated';

// Service configuration
export { serviceConfig } from './ServiceConfig';

// Direct service exports (maintained for backward compatibility)
export { NotificationService } from './NotificationService';
export * from './admin';

// Legacy compatibility
export { UnifiedAnalyticsService } from './UnifiedAnalyticsService';
