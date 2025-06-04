
// Service Registry - Phase 9D
// Centralized service management and monitoring

import { serviceConfig } from './ServiceConfig';
import { UnifiedAnalyticsService } from './UnifiedAnalyticsService';
import { NotificationService } from './NotificationService';
import { SimplifiedAdminService } from './admin/SimplifiedAdminService';

interface ServiceHealthStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'error';
  lastCheck: Date;
  responseTime?: number;
  errorMessage?: string;
}

interface ServiceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  uptime: number;
}

class ServiceRegistry {
  private services: Map<string, any> = new Map();
  private healthStatus: Map<string, ServiceHealthStatus> = new Map();
  private metrics: Map<string, ServiceMetrics> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const config = serviceConfig.getConfig();
    if (config.enableLogging) {
      console.log('ServiceRegistry: Initializing...');
    }

    // Register core services
    this.registerService('analytics', UnifiedAnalyticsService);
    this.registerService('notifications', NotificationService);
    this.registerService('admin', SimplifiedAdminService);

    // Initialize all services
    await this.initializeAllServices();
    
    // Start health monitoring
    this.startHealthMonitoring();
    
    this.initialized = true;
  }

  registerService(name: string, service: any): void {
    this.services.set(name, service);
    this.initializeServiceMetrics(name);
  }

  getService<T>(name: string): T | null {
    return this.services.get(name) || null;
  }

  private async initializeAllServices(): Promise<void> {
    const initPromises = Array.from(this.services.entries()).map(async ([name, service]) => {
      try {
        if (service.initialize && typeof service.initialize === 'function') {
          await service.initialize();
        }
        this.updateHealthStatus(name, 'healthy');
      } catch (error) {
        console.error(`Failed to initialize service ${name}:`, error);
        this.updateHealthStatus(name, 'error', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    await Promise.allSettled(initPromises);
  }

  private initializeServiceMetrics(serviceName: string): void {
    this.metrics.set(serviceName, {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      uptime: 100
    });
  }

  private updateHealthStatus(
    serviceName: string, 
    status: 'healthy' | 'degraded' | 'error',
    errorMessage?: string,
    responseTime?: number
  ): void {
    this.healthStatus.set(serviceName, {
      name: serviceName,
      status,
      lastCheck: new Date(),
      responseTime,
      errorMessage
    });
  }

  private startHealthMonitoring(): void {
    // Run health checks every 30 seconds
    setInterval(async () => {
      await this.performHealthChecks();
    }, 30000);
  }

  private async performHealthChecks(): Promise<void> {
    const config = serviceConfig.getConfig();
    
    for (const [name, service] of this.services.entries()) {
      try {
        const startTime = Date.now();
        
        // Check if service has a health check method
        if (service.healthCheck && typeof service.healthCheck === 'function') {
          const isHealthy = await service.healthCheck();
          const responseTime = Date.now() - startTime;
          
          this.updateHealthStatus(
            name, 
            isHealthy ? 'healthy' : 'degraded',
            undefined,
            responseTime
          );
        } else {
          // Default health check - just verify service exists
          this.updateHealthStatus(name, 'healthy');
        }
      } catch (error) {
        if (config.enableLogging) {
          console.error(`Health check failed for service ${name}:`, error);
        }
        this.updateHealthStatus(
          name, 
          'error', 
          error instanceof Error ? error.message : 'Health check failed'
        );
      }
    }
  }

  // Public methods for monitoring
  getServiceHealth(): ServiceHealthStatus[] {
    return Array.from(this.healthStatus.values());
  }

  getServiceMetrics(serviceName?: string): ServiceMetrics | Map<string, ServiceMetrics> {
    if (serviceName) {
      return this.metrics.get(serviceName) || this.getDefaultMetrics();
    }
    return this.metrics;
  }

  private getDefaultMetrics(): ServiceMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      uptime: 0
    };
  }

  // Method to track service usage
  trackServiceUsage(serviceName: string, success: boolean, responseTime?: number): void {
    const metrics = this.metrics.get(serviceName);
    if (!metrics) return;

    metrics.totalRequests++;
    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }

    if (responseTime !== undefined) {
      // Update average response time
      const totalTime = metrics.averageResponseTime * (metrics.totalRequests - 1) + responseTime;
      metrics.averageResponseTime = totalTime / metrics.totalRequests;
    }

    // Update uptime percentage
    metrics.uptime = (metrics.successfulRequests / metrics.totalRequests) * 100;
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    const config = serviceConfig.getConfig();
    if (config.enableLogging) {
      console.log('ServiceRegistry: Shutting down...');
    }

    // Give services a chance to clean up
    const shutdownPromises = Array.from(this.services.entries()).map(async ([name, service]) => {
      try {
        if (service.shutdown && typeof service.shutdown === 'function') {
          await service.shutdown();
        }
      } catch (error) {
        console.error(`Error shutting down service ${name}:`, error);
      }
    });

    await Promise.allSettled(shutdownPromises);
    this.initialized = false;
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistry();

// Export types
export type { ServiceHealthStatus, ServiceMetrics };
