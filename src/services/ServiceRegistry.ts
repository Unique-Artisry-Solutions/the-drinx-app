
// Service Registry - Phase 3: Standardized Service Layer
// Central registry for all application services with enhanced capabilities

export interface ServiceMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  lastUsed: Date;
}

export interface ServiceHealthStatus {
  serviceName: string;
  status: 'healthy' | 'degraded' | 'error';
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}

export interface ServiceDefinition {
  name: string;
  instance: any;
  dependencies?: string[];
  version?: string;
  healthCheckMethod?: string;
}

class ServiceRegistryClass {
  private services = new Map<string, any>();
  private serviceDefinitions = new Map<string, ServiceDefinition>();
  private metrics = new Map<string, ServiceMetrics>();
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.doInitialize();
    return this.initializationPromise;
  }

  private async doInitialize(): Promise<void> {
    try {
      console.log('Initializing standardized service registry...');
      
      // Register core services
      await this.registerCoreServices();
      
      this.isInitialized = true;
      console.log('Service registry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize service registry:', error);
      throw error;
    }
  }

  private async registerCoreServices(): Promise<void> {
    const { NotificationService } = await import('./NotificationService');
    const { SimplifiedAdminService } = await import('./admin/SimplifiedAdminService');
    const { UnifiedPromotionalService } = await import('./promotional');

    // Register services with definitions
    this.registerServiceWithDefinition({
      name: 'notification',
      instance: NotificationService,
      version: '1.0.0',
      healthCheckMethod: 'healthCheck'
    });

    this.registerServiceWithDefinition({
      name: 'admin',
      instance: SimplifiedAdminService,
      version: '1.0.0'
    });

    this.registerServiceWithDefinition({
      name: 'promotional',
      instance: new UnifiedPromotionalService(),
      version: '1.0.0',
      healthCheckMethod: 'healthCheck'
    });
  }

  registerServiceWithDefinition(definition: ServiceDefinition): void {
    this.serviceDefinitions.set(definition.name, definition);
    this.services.set(definition.name, definition.instance);
    this.initializeMetrics(definition.name);
  }

  registerService(name: string, service: any): void {
    this.registerServiceWithDefinition({
      name,
      instance: service
    });
  }

  getService<T>(name: string): T | null {
    return this.services.get(name) || null;
  }

  getServiceDefinition(name: string): ServiceDefinition | undefined {
    return this.serviceDefinitions.get(name);
  }

  getAllServices(): Map<string, any> {
    return new Map(this.services);
  }

  trackServiceUsage(name: string, success: boolean, responseTime: number): void {
    const metrics = this.metrics.get(name);
    if (!metrics) return;

    metrics.totalCalls++;
    if (success) {
      metrics.successfulCalls++;
    } else {
      metrics.failedCalls++;
    }
    metrics.averageResponseTime = (metrics.averageResponseTime + responseTime) / 2;
    metrics.lastUsed = new Date();
  }

  private initializeMetrics(serviceName: string): void {
    this.metrics.set(serviceName, {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageResponseTime: 0,
      lastUsed: new Date()
    });
  }

  getMetrics(name: string): ServiceMetrics | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Map<string, ServiceMetrics> {
    return new Map(this.metrics);
  }

  getServiceMetrics(): Map<string, ServiceMetrics> {
    return this.getAllMetrics();
  }

  async getServiceHealth(): Promise<ServiceHealthStatus[]> {
    const healthStatuses: ServiceHealthStatus[] = [];
    
    for (const [serviceName, definition] of this.serviceDefinitions) {
      const metrics = this.metrics.get(serviceName);
      const startTime = Date.now();
      
      try {
        let isHealthy = true;
        
        // Try to call health check method if available
        if (definition.healthCheckMethod && definition.instance[definition.healthCheckMethod]) {
          const healthResult = await definition.instance[definition.healthCheckMethod]();
          isHealthy = healthResult === true || (typeof healthResult === 'object' && healthResult.healthy);
        }
        
        const responseTime = Date.now() - startTime;
        
        const status: ServiceHealthStatus = {
          serviceName,
          status: isHealthy ? this.calculateHealthStatus(metrics) : 'error',
          lastCheck: new Date(),
          responseTime
        };
        
        healthStatuses.push(status);
      } catch (error) {
        const responseTime = Date.now() - startTime;
        healthStatuses.push({
          serviceName,
          status: 'error',
          lastCheck: new Date(),
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return healthStatuses;
  }

  private calculateHealthStatus(metrics?: ServiceMetrics): 'healthy' | 'degraded' | 'error' {
    if (!metrics) return 'error';
    
    const successRate = metrics.totalCalls > 0 ? metrics.successfulCalls / metrics.totalCalls : 1;
    
    if (successRate >= 0.95 && metrics.averageResponseTime < 1000) {
      return 'healthy';
    } else if (successRate >= 0.8) {
      return 'degraded';
    } else {
      return 'error';
    }
  }

  // Utility methods for service management
  isServiceRegistered(name: string): boolean {
    return this.services.has(name);
  }

  unregisterService(name: string): boolean {
    const removed = this.services.delete(name);
    this.serviceDefinitions.delete(name);
    this.metrics.delete(name);
    return removed;
  }

  async reinitialize(): Promise<void> {
    this.isInitialized = false;
    this.initializationPromise = null;
    this.services.clear();
    this.serviceDefinitions.clear();
    this.metrics.clear();
    await this.initialize();
  }
}

export const serviceRegistry = new ServiceRegistryClass();
