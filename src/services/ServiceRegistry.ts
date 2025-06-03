
// Service registry for dependency management and service discovery
// Provides a centralized way to access and manage all services

import { serviceConfig } from './ServiceConfig';
import { UnifiedPromotionalService } from './promotional';
import { NotificationService } from './NotificationService';
import { toastService } from './ToastService';
import { subscriptionAdapter } from './SubscriptionAdapter';
import { UnifiedAnalyticsService } from './UnifiedAnalyticsService';
import { UnifiedEventService } from './UnifiedEventService';
import { UnifiedPaymentService } from './UnifiedPaymentService';
import { UnifiedMobileService } from './UnifiedMobileService';

// Import admin service with fallback
let SimplifiedAdminService: any;
try {
  SimplifiedAdminService = require('./admin/SimplifiedAdminService').SimplifiedAdminService;
} catch (error) {
  console.warn('SimplifiedAdminService not found, using fallback');
  SimplifiedAdminService = {
    healthCheck: () => true
  };
}

export interface ServiceDependencies {
  admin: typeof SimplifiedAdminService;
  promotional: typeof UnifiedPromotionalService;
  analytics: typeof UnifiedAnalyticsService;
  events: typeof UnifiedEventService;
  payments: typeof UnifiedPaymentService;
  mobile: typeof UnifiedMobileService;
  notification: typeof NotificationService;
  toast: typeof toastService;
  subscription: typeof subscriptionAdapter;
}

class ServiceRegistryManager {
  private services: ServiceDependencies;
  private initialized = false;

  constructor() {
    this.services = {
      admin: SimplifiedAdminService,
      promotional: UnifiedPromotionalService,
      analytics: UnifiedAnalyticsService,
      events: UnifiedEventService,
      payments: UnifiedPaymentService,
      mobile: UnifiedMobileService,
      notification: NotificationService,
      toast: toastService,
      subscription: subscriptionAdapter
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const config = serviceConfig.getConfig();
    
    try {
      // Initialize all unified services
      await Promise.all([
        this.services.analytics.initialize(),
        this.services.events.initialize(),
        this.services.payments.initialize(),
        this.services.mobile.initialize()
      ]);

      // Initialize promotional services
      if (this.services.promotional && typeof this.services.promotional.initialize === 'function') {
        this.services.promotional.initialize(config);
      }
      
      // Mark as initialized
      this.initialized = true;
      
      if (config.enableLogging) {
        console.log('ServiceRegistry: All services initialized successfully');
      }
    } catch (error) {
      console.error('ServiceRegistry: Failed to initialize services:', error);
      throw error;
    }
  }

  getService<K extends keyof ServiceDependencies>(serviceName: K): ServiceDependencies[K] {
    if (!this.initialized) {
      console.warn(`ServiceRegistry: Accessing ${serviceName} before initialization`);
    }
    
    return this.services[serviceName];
  }

  // Service discovery - get all services of a category
  getServicesByCategory(category: 'core' | 'analytics' | 'promotional' | 'mobile'): Partial<ServiceDependencies> {
    const categories = {
      core: ['admin', 'notification', 'toast', 'subscription'],
      analytics: ['analytics'],
      promotional: ['promotional'],
      mobile: ['mobile']
    };

    const serviceNames = categories[category] || [];
    const services: Partial<ServiceDependencies> = {};
    
    serviceNames.forEach(name => {
      if (name in this.services) {
        services[name as keyof ServiceDependencies] = this.services[name as keyof ServiceDependencies];
      }
    });

    return services;
  }

  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const health: { [key: string]: boolean } = {};
    
    try {
      // Check unified services
      const healthChecks = await Promise.allSettled([
        this.services.analytics.healthCheck().then(result => ({ analytics: result })),
        this.services.events.healthCheck().then(result => ({ events: result })),
        this.services.payments.healthCheck().then(result => ({ payments: result })),
        this.services.mobile.healthCheck().then(result => ({ mobile: result }))
      ]);

      healthChecks.forEach(result => {
        if (result.status === 'fulfilled') {
          Object.assign(health, result.value);
        } else {
          console.error('Health check failed:', result.reason);
        }
      });

      // Check promotional services
      if (this.services.promotional && typeof this.services.promotional.healthCheck === 'function') {
        const promotionalHealth = await this.services.promotional.healthCheck();
        Object.assign(health, promotionalHealth);
      }
      
      // Check other services
      health.admin = !!this.services.admin;
      health.notification = !!this.services.notification;
      health.toast = !!this.services.toast;
      health.subscription = !!this.services.subscription;
      
      return health;
    } catch (error) {
      console.error('ServiceRegistry: Health check failed:', error);
      return { error: false };
    }
  }

  // Runtime service switching
  switchService<K extends keyof ServiceDependencies>(
    serviceName: K, 
    newService: ServiceDependencies[K]
  ): void {
    const config = serviceConfig.getConfig();
    if (config.enableLogging) {
      console.log(`ServiceRegistry: Switching service ${serviceName}`);
    }
    
    this.services[serviceName] = newService;
  }

  // Get service metadata
  getServiceMetadata(): { [K in keyof ServiceDependencies]: { initialized: boolean; available: boolean } } {
    const metadata = {} as any;
    
    Object.keys(this.services).forEach(serviceName => {
      metadata[serviceName] = {
        initialized: this.initialized,
        available: !!this.services[serviceName as keyof ServiceDependencies]
      };
    });
    
    return metadata;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const serviceRegistry = new ServiceRegistryManager();

// Auto-initialize in development mode
if (import.meta.env.DEV) {
  serviceRegistry.initialize().catch(console.error);
}
