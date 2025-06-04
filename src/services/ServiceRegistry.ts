
// Service Registry - Phase 9D
// Central registry for all application services

interface ServiceMetrics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  lastUsed: Date;
}

class ServiceRegistryClass {
  private services = new Map<string, any>();
  private metrics = new Map<string, ServiceMetrics>();

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

  getService(name: string): any {
    return this.services.get(name);
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
}

export const serviceRegistry = new ServiceRegistryClass();
