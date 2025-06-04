
// Service Registry - Phase 9D
// Central registry for all application services

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

class ServiceRegistryClass {
  private services = new Map<string, any>();
  private metrics = new Map<string, ServiceMetrics>();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Initialize core services
      console.log('Initializing service registry...');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize service registry:', error);
      throw error;
    }
  }

  registerService(name: string, service: any): void {
    this.services.set(name, service);
    this.metrics.set(name, {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageResponseTime: 0,
      lastUsed: new Date()
    });
  }

  getService<T>(name: string): T | null {
    return this.services.get(name) || null;
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

  getMetrics(name: string): ServiceMetrics | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Map<string, ServiceMetrics> {
    return new Map(this.metrics);
  }

  getServiceHealth(): ServiceHealthStatus[] {
    const healthStatuses: ServiceHealthStatus[] = [];
    
    for (const [serviceName] of this.services) {
      const metrics = this.metrics.get(serviceName);
      const status: ServiceHealthStatus = {
        serviceName,
        status: this.calculateHealthStatus(metrics),
        lastCheck: new Date(),
        responseTime: metrics?.averageResponseTime
      };
      healthStatuses.push(status);
    }
    
    return healthStatuses;
  }

  getServiceMetrics(): Map<string, ServiceMetrics> {
    return this.getAllMetrics();
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
}

export const serviceRegistry = new ServiceRegistryClass();
