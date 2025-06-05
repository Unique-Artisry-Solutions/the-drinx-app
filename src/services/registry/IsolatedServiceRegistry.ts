
// Phase 3 Alternative: Isolated Service Registry
// Operates independently without affecting existing service usage

import { StandardServiceInterface, ServiceWrapper, StandardServiceConfig } from '../interfaces/StandardServiceInterface';

interface RegistryMetrics {
  totalServices: number;
  healthyServices: number;
  degradedServices: number;
  errorServices: number;
  lastHealthCheck: Date;
}

class IsolatedServiceRegistryClass {
  private services = new Map<string, ServiceWrapper>();
  private config: StandardServiceConfig = {
    enableLogging: false,
    enableMetrics: true,
    timeout: 5000,
    retries: 2
  };
  private initialized = false;

  // Safe initialization that doesn't interfere with existing systems
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      if (this.config.enableLogging) {
        console.log('[IsolatedRegistry] Initializing service registry...');
      }
      this.initialized = true;
    } catch (error) {
      console.warn('[IsolatedRegistry] Initialization failed:', error);
    }
  }

  // Register a service wrapper (additive only)
  registerService(name: string, service: any, standardInterface?: StandardServiceInterface): void {
    const wrapper: ServiceWrapper = {
      service,
      metadata: {
        name,
        version: '1.0.0',
        initialized: false,
        lastUsed: new Date()
      },
      standardInterface
    };
    
    this.services.set(name, wrapper);
    
    if (this.config.enableLogging) {
      console.log(`[IsolatedRegistry] Registered service: ${name}`);
    }
  }

  // Get service (read-only access)
  getService<T>(name: string): T | null {
    const wrapper = this.services.get(name);
    if (!wrapper) return null;
    
    wrapper.metadata.lastUsed = new Date();
    return wrapper.service as T;
  }

  // Get service wrapper with metadata
  getServiceWrapper(name: string): ServiceWrapper | null {
    return this.services.get(name) || null;
  }

  // Check if service is registered
  hasService(name: string): boolean {
    return this.services.has(name);
  }

  // Get all registered service names
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  // Get registry metrics
  getRegistryMetrics(): RegistryMetrics {
    const healthStatuses: ('healthy' | 'degraded' | 'error')[] = [];
    
    for (const wrapper of this.services.values()) {
      if (wrapper.standardInterface?.healthCheck) {
        // For now, assume all services with health checks are healthy
        // In a real implementation, this would call the actual health check
        healthStatuses.push('healthy');
      } else {
        // Services without health checks are considered degraded
        healthStatuses.push('degraded');
      }
    }
    
    return {
      totalServices: this.services.size,
      healthyServices: healthStatuses.filter(status => status === 'healthy').length,
      degradedServices: healthStatuses.filter(status => status === 'degraded').length,
      errorServices: healthStatuses.filter(status => status === 'error').length,
      lastHealthCheck: new Date()
    };
  }

  // Configure registry (additive only)
  configure(updates: Partial<StandardServiceConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (this.config.enableLogging) {
      console.log('[IsolatedRegistry] Configuration updated:', this.config);
    }
  }

  // Get current configuration
  getConfiguration(): StandardServiceConfig {
    return { ...this.config };
  }

  // Clean shutdown
  async shutdown(): Promise<void> {
    try {
      for (const [name, wrapper] of this.services.entries()) {
        if (wrapper.standardInterface?.destroy) {
          await wrapper.standardInterface.destroy();
        }
      }
      
      this.services.clear();
      this.initialized = false;
      
      if (this.config.enableLogging) {
        console.log('[IsolatedRegistry] Service registry shut down');
      }
    } catch (error) {
      console.warn('[IsolatedRegistry] Shutdown error:', error);
    }
  }
}

export const isolatedServiceRegistry = new IsolatedServiceRegistryClass();
