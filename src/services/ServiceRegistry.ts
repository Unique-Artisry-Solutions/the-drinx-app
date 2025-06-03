
// Service registry for dependency management and service discovery
// Provides a centralized way to access and manage all services

import { serviceConfig } from './ServiceConfig';
import { UnifiedPromotionalService } from './promotional';
import { NotificationService } from './NotificationService';
import { toastService } from './ToastService';
import { subscriptionAdapter } from './SubscriptionAdapter';

// Import admin service with fallback
let SimplifiedAdminService: any;
try {
  SimplifiedAdminService = require('./admin/SimplifiedAdminService').SimplifiedAdminService;
} catch (error) {
  console.warn('SimplifiedAdminService not found, using fallback');
  SimplifiedAdminService = {
    // Minimal fallback implementation
    healthCheck: () => true
  };
}

export interface ServiceDependencies {
  admin: typeof SimplifiedAdminService;
  promotional: typeof UnifiedPromotionalService;
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
      notification: NotificationService,
      toast: toastService,
      subscription: subscriptionAdapter
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const config = serviceConfig.getConfig();
    
    try {
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

  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const health: { [key: string]: boolean } = {};
    
    try {
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

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const serviceRegistry = new ServiceRegistryManager();

// Auto-initialize in development mode
if (import.meta.env.DEV) {
  serviceRegistry.initialize().catch(console.error);
}
