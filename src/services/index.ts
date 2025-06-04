
// Services Index - Phase 3: Standardized Service Layer
// Primary entry point for all application services

// Service Registry (primary export)
export { serviceRegistry } from './ServiceRegistry';
export type { ServiceHealthStatus, ServiceMetrics, ServiceDefinition } from './ServiceRegistry';

// Standardized services
export * from './consolidated';

// Service interfaces and base classes
export * from './interfaces/StandardService';

// Service configuration and proxy
export { serviceConfig } from './ServiceConfig';
export { ServiceProxy } from './ServiceProxy';

// Legacy compatibility - these will be removed in future phases
export { NotificationService } from './NotificationService';
export { UnifiedAnalyticsService } from './UnifiedAnalyticsService';

// Deprecated - use serviceRegistry instead
/** @deprecated Use serviceRegistry.getService('admin') instead */
export * from './admin';
